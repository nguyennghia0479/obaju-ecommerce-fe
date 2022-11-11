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
            hideAfter: false
        })
    }

    function getSubcategory() {
        $.ajax({
            url: "http://localhost:8080/api/v1/subcategories",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $("#table-subcategory tbody").empty()
            $.each(response.content, function (index, value) {
                var row = `<tr>
                                <th>${index + 1}</th>
                                <td>${value.name}</td>
                                <td>${value.code}</td>
                                <td>${value.description}</td>
                                <td>${value.category.name}</td>
                                <td>
                                    <div class="row no-gutters">
                                        <div class="col-sm-6">
                                            <a href="#subcategoryFormModal" class="btn btn-sm btn-primary btn-edit-subcategory" 
                                            data-toggle="modal" subcategory-id=${value.id} data-toggle="tooltip" title="Edit">
                                            <i class="fa fa-pencil" aria-hidden="true"></i></a>
                                        </div>
                                        <div class="col-sm-6">
                                            <a href="#deleteModal" class="btn btn-danger btn-delete btn-sm" data-toggle="modal"
                                            id=${value.id} target="subcategories" data-toggle="tooltip" title="Delete">
                                            <i class="fa fa-trash" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                </td>
                            </tr>`
                $("#table-subcategory tbody").append(row)
            })
        })
    }

    function getSelectCategory() {
        $.ajax({
            url: "http://localhost:8080/api/v1/categories",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $("#selectCategory").empty()
            $("#selectCategory").append('<option value="">Chọn danh mục cha</option>')
            $.each(response.content, function (index, value) {
                var option = `<option value="${value.id}">${value.name}</option>`
                $("#selectCategory").append(option)
            })
        })
    }

    function clearFormData() {
        $("label[for=name], input#name").show()
        $("label[for=selectCategory], select#selectCategory").show()
        $("#id").val('')
        $("#name").val('')
        $("#description").val('')
        getSelectCategory()
    }

    function createSubcategory(dataName, dataDescription, dataCategoryId) {
        $.ajax({
            url: "http://localhost:8080/api/v1/admin/subcategories",
            method: "POST",
            data: JSON.stringify({
                name: dataName,
                description: dataDescription,
                categoryId: dataCategoryId
            }),
            contentType: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            if (response.hasError == false) {
                getToastSuccess("Add successfully")
                clearFormData()
                getSubcategory()
            }
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var jsonResponse = JSON.parse(data)
            var message = jsonResponse["errors"]
            getToastError(message)
        })
    }

    function updateSubcategory(dataId, dataDescription) {
        $.ajax({
            url: "http://localhost:8080/api/v1/admin/subcategories",
            method: "PUT",
            data: JSON.stringify({
                id: dataId,
                description: dataDescription
            }),
            contentType: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            if (response.hasError == false) {
                getToastSuccess("Update successfully")
                clearFormData()
                getSubcategory()
            }
            $("#subcategoryFormModal").modal('hide')
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var jsonResponse = JSON.parse(data)
            var message = jsonResponse["errors"]
            getToastError(message)
        })
    }

    $("#btn-add-subcategory").click(function () {
        clearFormData();
    })

    $("body").on('click', '.btn-edit-subcategory', function (e) {
        e.preventDefault()
        $("label[for=name], input#name").hide()
        $("label[for=selectCategory], select#selectCategory").hide()
        var id = $(this).attr("subcategory-id")
        var description = $(this).closest("td").prev("td").prev("td").text()
        $("#id").val(id)
        $("#description").val(description)
    })

    $("#btn-save-subcategory").click(function (e) {
        e.preventDefault()
        var dataId = $("#id").val()
        var dataName = $("#name").val()
        var dataDescription = $("#description").val()
        var dataCategoryId = $("#selectCategory").val()
        if (dataId == '') {
            createSubcategory(dataName, dataDescription, dataCategoryId)
        } else {
            updateSubcategory(dataId, dataDescription)
        }
    })

    getSubcategory()
})