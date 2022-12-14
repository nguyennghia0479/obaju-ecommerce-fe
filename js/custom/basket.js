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
            if(response.content.length <= 0) {
                $("#delete-cart").attr('hidden', true)
                $("#btn-checkout").attr("disabled", true)
            }
            var totalOrder = 0
            var item = response.content.length
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
                                <td>
                                    <input style="width: 4em;" type="number" stock-id="${value.stock.id}" name="quantity" 
                                        value="${value.quantity}" min=1 max=10 class="form-control">
                                </td>
                                <td>${formatter.format(value.stock.product.price)}</td>
                                <td>${formatter.format(totalPrice)}</td>
                                <td>
                                    <button stock-id=${value.stock.id} class="btn btn-danger btn-sm btn-remove-cart">
                                        <i class="fa fa-trash-o"></i>
                                    </button>
                                </td>
                            </tr>`
                $("#basket tbody").append(row)
            })
            $("#itemQuantity").text("B???n c?? " + item + " s???n ph???m trong gi??? h??ng")
            $("#totalOrder").text(formatter.format(totalOrder))
        })
    }

    function updateCart(dataStockId, dataQuantity) {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/carts",
            method: "PUT",
            data: {
                stockId: dataStockId,
                quantity: dataQuantity
            },
        }).done(function (response) {
            getToastSuccess("C???p nh???t gi??? h??ng th??nh c??ng")
            getBasket()
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var jsonResponse = JSON.parse(data)
            var message = jsonResponse["errors"]
            getToastError("B???n ???? ch???n qu?? s??? l?????ng hi???n c??")
        })
    }

    function deleteItemInCart(dataStockId) {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/carts/item",
            method: "DELETE",
            data: {
                stockId: dataStockId
            },
        }).done(function (response) {
            Cookies.set("cartItems", response.content.length)
            getToastSuccess("X??a s???n ph???m th??nh c??ng")
            getBasket()
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var jsonResponse = JSON.parse(data)
            var message = jsonResponse["errors"]
            getToastError(message)
        })
    }

    function deleteCart() {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/carts",
            method: "DELETE",
        }).done(function (response) {
            Cookies.remove('cartItems')
            getToastSuccess("X??a gi??? h??ng th??nh c??ng")
            getBasket()
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var jsonResponse = JSON.parse(data)
            var message = jsonResponse["errors"]
            getToastError(message)
        })
    }

    $("body").on('change', "input[name=quantity]", function() {
        var dataQuantity = $("input[name=quantity]").val()
        var dataStockId= $(this).attr("stock-id")
     
        if(dataQuantity != '')
            updateCart(dataStockId, dataQuantity)
    })

    $("body").one('click', '.btn-remove-cart', function(e) {
        e.preventDefault()
        var dataStockId = $(this).attr("stock-id")
        deleteItemInCart(dataStockId)
    })

    $("#delete-cart").click(function(e) {
        e.preventDefault()
        deleteCart()
    })

    $("#btn-checkout").click(function(e) {
        if (Cookies.get('token') != null) {
            window.location.href='checkout.html'
        } else {
            $("#login-modal").modal('show')
        }
    })
    

    getBasket()
})