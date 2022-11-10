$(document).ready(function () {
    function hot() {
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
                                    <p class="price">$${value.price}</p>
                                </div>
                                </div>
                            </div>`
                $(".container .product-slider").append(row)
            })          
        })
    }

    hot()
})