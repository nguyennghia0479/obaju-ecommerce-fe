$(document).ready(function () {

    function getToastSuccess(result) {
        $.toast({
            heading: 'Success',
            position: 'top-right',
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
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName;

        for (var i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    }

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',

    });

    function getCategory() {
        var name = getUrlParameter("name")
        $(".breadcrumb .active").text(name)
        $.ajax({
            url: "http://localhost:8080/api/v1/products/subcategory/" + name,
            method: "GET"
        }).done(function (response) {
            $(".products").empty()
            $.each(response.content, function (index, value) {
                var row = `<div class="col-lg-4 col-md-6">
                                <div class="item">
                                    <div class="card">
                                        <img class="card-img-top mb-2" src="${value.avatarURL}" alt="${value.name}">
                                        <div class="text text-center">
                                            <h3>${value.name}</h3>
                                            <p class="price">${formatter.format(value.price)}</p>
                                            <p class="buttons">
                                                <a href="detail.html?name=${value.nameURL}" class="btn btn-outline-info">
                                                    <i class="fa fa-eye" aria-hidden="true"></i>Xem
                                                </a>
                                                <a href="#cartFormModal" id=${value.id} data-toggle="modal" 
                                                    class="btn btn-primary btn-add-cart">
                                                    <i class="fa fa-shopping-cart"></i>Thêm giỏ hàng
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                $(".products").append(row)
            })
        })
    }

    function getSelectSizeByProductId(productId) {
        $.ajax({
            url: "http://localhost:8080/api/v1/product-sizes/select-size/" + productId,
            method: "GET"
        }).done(function(response) {
            $("#selectSize").empty()
            $("#selectSize").append('<option value="">Chọn size</option')
            $.each(response.content, function(index, value) {
                var option = `<option value=${value.id}>${value.size}</option>`
                $("#selectSize").append(option)
            })
        })
    }

    $("body").on('click', '.btn-add-cart', function() {
        var productId = $(this).attr('id')
        getSelectSizeByProductId(productId)
        $("#selectQuantity").val(1)
        $(".form-control").removeClass("is-invalid is-valid")
        $("label[class=error]").remove()
    })

    $("#cartForm").validate({
        rules: {
            selectSize: "required"
        },
        messages: {
            selectSize: "Bạn chưa chọn size"
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
            $(input).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            var dataProductId = $(".btn-add-cart").attr('id')
            var dataSizeId = $("#selectSize").val()
            var dataQuantity = $("#selectQuantity").val()
            $.ajax({
                url: "http://localhost:8080/api/v1/carts",
                method: "POST",
                data: {
                    productId: dataProductId,
                    sizeId: dataSizeId,
                    quantity: dataQuantity
                },
            }).done(function (response) {
                Cookies.set("cartItems", response.content.length)
                getToastSuccess("Thêm giỏ hàng thành công")
                $("#cartFormModal").modal('hide')
            }).fail(function (xhr, status, error) {
                var data = xhr.responseText
                var jsonResponse = JSON.parse(data)
                var message = jsonResponse["errors"]
                getToastError("Bạn đã chọn quá số lượng hiện có")
            })
        }
    })

    getCategory()
})