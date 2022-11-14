$(document).ready(function () {

    function encodeURL(str) {
        return str.toLowerCase()
        .replace(/[^a-z0-9\-_]+/g, "-")
        .replace(/-{2,}/, "-")
        .replace(/^-|-$/, '');
    }

    function header() {
        $.ajax({
            url: "http://localhost:8080/api/v1/subcategories",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            // $("[id=" + value.category + "] .list-unstyled").empty()
            $.each(response.content, function (index, value) {
                var row = `<li class="nav-item">
                                <a href="category.html?name=${value.nameURL}" class="nav-link">${value.name}</a>
                            </li>`
                $("[id=" + value.category + "] .list-unstyled").append(row)
            })
        })
    }

    header()
})