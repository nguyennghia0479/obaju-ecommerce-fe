$(document).ready(function () {

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

    function getCurrency(price) {
        return (price / 1000).toFixed(3)
    }

    function getCategory() {
        var name = getUrlParameter("name")
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
                                            <p class="price">${getCurrency(value.price)} VND</p>
                                            <p class="buttons">
                                                <a href="detail.html?name=${value.nameURL}" class="btn btn-outline-secondary">View detail</a>
                                                <a href="basket.html" class="btn btn-primary"><i class="fa fa-shopping-cart"></i>Add to cart</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                $(".products").append(row)
            })
        })
    }

    getCategory()
})