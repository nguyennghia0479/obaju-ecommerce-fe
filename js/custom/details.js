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

    function getSelectSizeByProductId(productId) {
        $.ajax({
            url: "http://localhost:8080/api/v1/product-sizes/select-size/" + productId,
            method: "GET"
        }).done(function(response) {
            $("#selectSize").empty()
            $.each(response.content, function(index, value) {
                var option = `<option value=${value.id}>${value.size}</option>`
                $("#selectSize").append(option)
            })
        })
    }

    function getDetails() {
        var name = getUrlParameter("name")
        $(".breadcrumb .category").text("Sản phẩm")
        $(".breadcrumb .active").text(name)
        $.ajax({
            url: "http://localhost:8080/api/v1/products/detail/" + name,
            method: "GET"
        }).done(function (response) {
            $("#productMain .product-info").empty()
            var product = response.content;
            $("#productId").val(product.id)
            var row = `<h2 class="text-center">${product.name}</h2>
                        <p class="price mt-1">${formatter.format(product.price)}</p>`
            $("#productMain .product-info").append(row)

            getSelectSizeByProductId(`${product.id}`)

            $("#productMain .shop-detail-carousel").empty()
            $("#productMain .owl-thumbs").empty()
            $.each(product.images, function (index, value) {
                var row2 = `<div class="item"> <img src="${value.imageURL}" alt="" class="img-fluid"></div>`
                var row3 = `<button class="owl-thumb-item"><img src="${value.imageURL}" alt="" class="img-fluid"></button>`
                $("#productMain .shop-detail-carousel").append(row2)
                $("#productMain .owl-thumbs").append(row3)
            })     
        })
    }

    function getRelateProduct() {
        $.ajax({
            url: "http://localhost:8080/api/v1/products",
            method: "GET"
        }).done(function (response) {
            $(".container .product-slider").empty()
            $.each(response.content, function(index, value){
                var row = `<div class="item">
                                <div class="card">
                                <img class="card-img-top mb-2" src="${value.avatarURL}" alt="Image">
                                <div class="text text-center">
                                    <h3>${value.name}</h3>
                                    <p class="price">${formatter.format(value.price)}</p>
                                </div>
                                </div>
                            </div>`
                $(".container .product-slider").append(row)
            })          
        })
    }

    $("#btn-add-cart").click(function(e) {
        e.preventDefault()
        var dataProductId = $("#productId").val()
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
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var jsonResponse = JSON.parse(data)
            var message = jsonResponse["errors"]
            getToastError("Bạn đã chọn quá số lượng hiện có")
        })
    })

    getDetails()
    getRelateProduct()
})