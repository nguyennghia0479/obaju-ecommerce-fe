$(document).ready(function(){
    function hot() {
        $.ajax({
            url: "http://localhost:8080/api/v1/products/get/Ao%20so%20mi",
            method: "GET"
        }).done(function (response) {
            console.log(response)
            $("#productMain .product-info").empty()
            var product = response.content;
            var row = `<h2 class="text-center">${product.name}</h2>
                        <p class="goToDescription"><strong><i>Còn 6 sản phẩm</i></strong></p>
                        <p class="price mt-1">$${product.price}</p>`
            $("#productMain .product-info").append(row)     

            $("#productMain .shop-detail-carousel").empty()
            $("#productMain .owl-thumbs").empty()
            $.each(product.images, function(index, value){
                var row2 = `<div class="item"> <img src="${value.imageURL}" alt="" class="img-fluid"></div>`
                var row3 = `<button class="owl-thumb-item"><img src="${value.imageURL}" alt="" class="img-fluid"></button>`
                $("#productMain .shop-detail-carousel").append(row2)
                $("#productMain .owl-thumbs").append(row3)
            })

            

        })
    }

    hot()
})