$(document).ready(function () {

    function header() {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/subcategories",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $.each(response.content, function (index, value) {
                var row = `<li class="nav-item">
                                <a href="category.html?name=${value.nameURL}" class="nav-link">${value.name}</a>
                            </li>`
                $("[id=" + value.category + "] .list-unstyled").append(row)
            })
        })
    }

    function getCartItems() {
        var cartItems = Cookies.get('cartItems')
        $("#cartItems").text(cartItems)
    }

    getCartItems()
    header()
})