$(document).ready(function () {
    function header() {
        $.ajax({
            url: "http://localhost:8080/api/v1/categories/include-subcategories",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $("#dropdown-menu .row").empty()
            $.each(response.content, function(index, value){
                var row = `<div id=${value.code} class="col-md-6 col-lg-3">
                                <h5>${value.name}</h5>
                                <ul class="list-unstyled mb-3">
                                </ul>
                            </div>`
                $("#dropdown-menu .row").append(row)
                $.each(value.subcategories, function(i, val){
                    var subCategory = `<li class="nav-item">
                                            <a href="category.html" class="nav-link">${val.name}</a>
                                        </li>`
                    $("[id=" + value.code +"] .list-unstyled").append(subCategory)
                })
            })          
        })
    }

    header()
})