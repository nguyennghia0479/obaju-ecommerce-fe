$(document).ready(function() {
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

    function getCategories() {
        $.ajax({
            url: "http://localhost:8080/api/v1/categories",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function(response) {
            $("#table-category tbody").empty()
            $.each(response.content, function(index, value) {
                var row = `<tr>
                                <th>${index + 1}</th>
                                <td>${value.name}</td>
                                <td>${value.code}</td>
                                <td>
                                    <a href="#deleteModal" class="btn btn-danger btn-delete btn-sm" data-toggle="modal"
                                        id=${value.id} target="categories">
                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                    </a>
                                </td>
                            </tr>`
                $("#table-category tbody").append(row)
            })
        })
    }

    function clearFormData() {
        $("#name").val('')
        $("#code").val('')
    }

    $("#btn-add-category").click(function() {
        clearFormData()
    })

    $("#btn-save-category").click(function(e) {
        e.preventDefault()
        var dataName = $("#name").val()
        var dataCode = $("#code").val()
        $.ajax({
            url: "http://localhost:8080/api/v1/admin/categories",
            method: "POST",
            data: JSON.stringify({
                name: dataName,
                code: dataCode
            }),
            contentType: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function(response) {
            if(response.hasError == false) {
                getToastSuccess("Add successfully")
                clearFormData()
                getCategories()
            }
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var jsonResponse = JSON.parse(data)
            var message = jsonResponse["errors"]
            getToastError(message)
        })
    })

    getCategories()
})