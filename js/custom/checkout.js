$(document).ready(function () {

    function getToastSuccess(result) {
        $.toast({
            heading: 'Success',
            position: 'top-center',
            text: result,
            showHideTransition: 'slide',
            icon: 'success'
        })
    }

    function getToastError(result) {
        $.toast({
            heading: 'Error',
            position: 'top-center',
            text: result,
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: false
        })
    }

    function getTotalPrice(price, quantity) {
        return price * quantity
    }

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',

    });

    function getBasket() {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/carts",
            method: "GET"
        }).done(function (response) {
            $("#basket tbody").empty()
            if (response.content.length <= 0)
                $("#btn-checkout").attr("disabled", true)
            var totalOrder = 0
            $.each(response.content, function (index, value) {
                var totalPrice = `${getTotalPrice(value.stock.product.price, value.quantity)}`
                totalOrder += parseInt(totalPrice)
                var row = `<tr>
                                <td>
                                    <a href="detail.html?name=${value.stock.product.nameURL}">
                                        <img src="${value.stock.product.avatarURL}" alt="${value.stock.product.name}">
                                    </a>
                                </td>
                                <td>
                                    <a href="detail.html?name=${value.stock.product.nameURL}">${value.stock.product.name} 
                                        Size ${value.stock.productSize.size}</a>
                                </td>
                                <td>${value.quantity} </td>
                                <td>${formatter.format(value.stock.product.price)}</td>
                                <td>${formatter.format(totalPrice)}</td>                              
                            </tr>`
                $("#basket tbody").append(row)
            })
            $("#totalOrder").text(formatter.format(totalOrder))
            $("#order-summary .total-price").text(formatter.format(totalOrder))
            $("#order-summary .ship-price").text(formatter.format(20000))
            $("#order-summary .total-order-price").text(formatter.format(20000 + totalOrder))
            $("#total-order-price").val(20000 + totalOrder)
        })
    }

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    function checkUser() {
        if (Cookies.get('token') != null) {
            $("#btn-checkout").attr("disabled", false)
        } else {
            $("#btn-checkout").attr("disabled", true)
        }
    }

    function getSelectPayment() {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/orders/select-payment",
            method: "GET"
        }).done(function (response) {
            $("#selectPayment").empty()
            $("#selectPayment").append("<option value=''>Chọn thanh toán</option>")
            $.each(response.content, function (index, value) {
                var option = `<option value=${value}>${value}</option>`
                $("#selectPayment").append(option)
            })
        })
    }

    function getSelectProvinceAndDistrict() {
        $.ajax({
            url: "js/custom/province-district.json",
            method: "GET",
            dataType: "json",
        }).done(function (response) {
            $.each(response, function (index, value) {
                var option
                if (value.parent_id == "0")
                    option = `<option value=${value.id}>${value.name}</option>`
                $("#selectProvince").append(option)
            })
        })

        $("#selectProvince").on('change', function () {
            $("#selectDistrict").find('option').remove()
            $("#selectDistrict").append('<option value="">Chọn Quận, Huyện Xã</option>')
            let provinceId = $("#selectProvince").val();
            $.ajax({
                url: "js/custom/province-district.json",
                method: "GET",
                dataType: "json",
            }).done(function (response) {
                $.each(response, function (index, value) {
                    var option
                    if (value.parent_id == provinceId)
                        option = `<option value=${value.name}>${value.name}</option>`
                    $("#selectDistrict").append(option)
                })
            })
        })
    }

    function clearForm() {
        $("#street").val('')
        $("#selectPayment").val('')
        $("#selectProvince").val('')
        $("#selectDistrict").val('')
    }

    $("#checkoutForm").validate({
        rules: {
            selectPayment: "required",
            street: {
                required: true,
                minlength: 10,
                maxlength: 100
            },
            selectProvince: "required",
            selectDistrict: "required"
        },
        messages: {
            selectPayment: "Bạn chưa chọn thanh toán",
            street: {
                required: "Bạn chưa nhập địa chỉ",
                minlength: "Địa chỉ phải ít nhất 10 ký tự",
                maxlength: "Địa chỉ tối đa 100 ký tự"
            },
            selectProvince: "Bạn chưa chọn tỉnh, thành",
            selectDistrict: "Bạn chưa chọn quận, huyện, xã"
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
            $(input).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            var user = parseJwt(Cookies.get('token'))
            var dataUsername = user.sub
            var dataPayment = $("#selectPayment").val()
            var dataTotalPrice = $("#total-order-price").val()
            var dataStreet = $("#street").val()
            var dataSelectProvince = $("#selectProvince option:selected").text()
            var dataSelectDistrict = $("#selectDistrict option:selected").text()
            var dataAddress = dataStreet + " " + dataSelectDistrict + " " + dataSelectProvince
            $.ajax({
                url: "https://obaju-ecommerce.herokuapp.com/api/v1/orders/place-order",
                method: "POST",
                data: JSON.stringify({
                    totalPrice: dataTotalPrice,
                    address: dataAddress,
                    payment: dataPayment,
                    username: dataUsername
                }),
                contentType: "application/json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
                }
            }).done(function(response) {
                Cookies.remove('cartItems')
                clearForm()
                getBasket()
                getToastSuccess("Bạn đã đặt hàng thành công")               
            }).fail(function(xhr, status, error) {
                var data = responseText
                var dataJson = JSON.parse(data)
                var message = dataJson["errors"]
                getToastError(message)
            })
        }
    })

    getSelectProvinceAndDistrict()
    checkUser()
    getBasket()
    getSelectPayment()
})