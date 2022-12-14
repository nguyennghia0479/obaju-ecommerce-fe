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
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/subcategories",
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
                                <td>${value.category}</td>
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
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/subcategories/select-category",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $("#selectCategory").empty()
            $("#selectCategory").append('<option value="">Ch???n danh m???c cha</option>')
            $.each(response.content, function (index, value) {
                var option = `<option value="${value}">${value}</option>`
                $("#selectCategory").append(option)
            })
        })
    }

    function clearFormData() {
        $("label[for=name], input#name").show()
        $("label[for=code], input#code").show()
        $("label[for=selectCategory], select#selectCategory").show()
        $("#id").val('')
        $("#name").val('')
        $("#code").val('')
        $("#description").val('')
        $(".form-control").removeClass("is-invalid is-valid")
        $("label[class=error]").remove()
        getSelectCategory()
    }

    function createSubcategory(dataName, dataCode, dataDescription, dataCategory) {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/admin/subcategories",
            method: "POST",
            data: JSON.stringify({
                name: dataName,
                code: dataCode,
                description: dataDescription,
                category: dataCategory
            }),
            contentType: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            if (response.hasError == false) {
                getToastSuccess("Th??m m???i danh m???c th??nh c??ng")
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
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/admin/subcategories",
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
                getToastSuccess("C???p nh???t danh m???c th??nh c??ng")
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
        $("label[for=code], input#code").hide()
        $("label[for=selectCategory], select#selectCategory").hide()
        var id = $(this).attr("subcategory-id")
        var description = $(this).closest("td").prev("td").prev("td").text()
        $("#id").val(id)
        $("#description").val(description)
    })

    $("#subcategoryForm").validate({
        rules: {
            name: {
                required: true,
                minlength: 5,
                maxlength: 20
            },
            code: {
                required: true,
                minlength: 2,
                maxlength: 10
            },
            description: {
                required: false,
                maxlength: 1000
            },
            selectCategory: "required"

        },
        messages: {
            name: {
                required: "B???n ch??a nh???p t??n danh m???c",
                minlength: "T??n danh m???c ph???i c?? ??t nh???t 5 k?? t???",
                maxlength: "T??n danh m???c t???i ??a 20 k?? t???"
            },
            code: {
                required: "B???n ch??a nh???p m?? danh m???c",
                minlength: "M?? danh m???c ph???i c?? ??t nh???t 5 k?? t???",
                maxlength: "M?? danh m???c t???i ??a 10 k?? t???"
            },
            description: {
                maxlength: "M?? t??? t???i ??a 1000 k?? t???"
            },
            selectCategory: "B???n ch??a ch???n danh m???c cha"
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
           $(input).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            var dataId = $("#id").val()
            var dataName = $("#name").val()
            var dataCode = $("#code").val()
            var dataDescription = $("#description").val()
            var dataCategory = $("#selectCategory").val()
            if (dataId == '') {
                createSubcategory(dataName, dataCode, dataDescription, dataCategory)
            } else {
                updateSubcategory(dataId, dataDescription)
            }
        }
    });

    getSubcategory()
})