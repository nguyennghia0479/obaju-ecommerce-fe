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

    function getImages() {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/images",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $("#table-image tbody").empty()
            $.each(response.content, function (index, value) {
                var row = `<tr>
                                <td>${index + 1}</td>
                                <td><img src="${value.imageURL}" alt="${value.name}" width="50em"></td>
                                <td>${value.product.name}</td>
                                <td>
                                    <div class="col-sm-6">
                                        <a href="#deleteModal" class="btn btn-danger btn-delete btn-sm" data-toggle="modal"
                                        id=${value.id} target="images" data-toggle="tooltip" title="Delete">
                                        <i class="fa fa-trash" aria-hidden="true"></i></a>
                                    </div>
                                </td>
                            </tr>`
                $("#table-image tbody").append(row)
            })
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var jsonResponse = JSON.parse(data)
            var message = jsonResponse["errors"]
            getToastError(message)
        })
    }

    function getSelectSubcategoryAndProduct() {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/subcategories/select-subcategory",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $.each(response.content, function (index, value) {
                var option = `<option value="${value.id}">${value.name}</option>`
                $("#selectSubcategory").append(option)
            })
        })

        $("#selectSubcategory").on('change', function () {
            $("#selectProduct").find('option').remove()
            $("#selectProduct").append('<option value="">Chọn sản phẩm</option>')
            let dataSubcategoryId = $("#selectSubcategory").val();
            let data = {
                subcategoryId: dataSubcategoryId
            }
            $.ajax({
                url: "https://obaju-ecommerce.herokuapp.com/api/v1/subcategories/products/select-products",
                method: "GET",
                data: data,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
                }
            }).done(function (response) {
                $.each(response.content, function (key, value) {
                    var option = `<option value="${value.id}">${value.name}</option>`
                    $("#selectProduct").append(option)
                })
            })
        })
    }

    function clearFormData() {
        $("input[name=file]").val(null)
        $("input[name=file]").next('.custom-file-label').html('Choose a File')
        $(".form-control, .custom-file-input").removeClass("is-invalid is-valid")
        $("label[class=error]").remove()
    }

    function createImages(form) {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/admin/images",
            method: "POST",
            data: form,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            if (!response.hasError) {
                getToastSuccess("Thêm hình ảnh thành công")
                clearFormData()
                getImages()
            }
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var jsonResponse = JSON.parse(data)
            var message = jsonResponse["errors"]
            getToastError(message)
        })
    }

    $("body").on('change', 'input[name=file]', function () {
        var fileName = $(this).val();
        $(this).next('.custom-file-label').html(fileName);
    })

    $("#btn-add-images").click(function () {
        clearFormData()
    })

    $("#btn-append-input").click(function () {
        var row = `<div class="col-12">
                        <div class="form-group">
                            <label for="file" class="col-md-12 required"><strong>Ảnh đại diện</strong></label>
                            <div class="col-md-12 input-group">
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" name="file">
                                    <label class="custom-file-label" for="file">Choose a File</label>
                                </div>
                                <div class="input-group-append">
                                    <button class="btn btn-outline-danger btn-remove" type="button">
                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>`
        $(".images").append(row)
    })

    $("body").on('click', '.btn-remove', function () {
        $(this).closest('.col-12').remove()
    })

    $("#imageForm").validate({
        rules: {
            selectProduct: "required"
        },
        messages: {
            selectProduct: "Bạn chưa chọn sản phẩm"
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
            $(input).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            var form = new FormData()
            var dataProductId = $("#selectProduct").val()
            form.append('productId', dataProductId)
            $.each($("input[type=file]"), function (i, obj) {
                $.each(obj.files, function (j, file) {
                    form.append('files', file)
                })
            })
            createImages(form)
        }
    })

    getImages()
    getSelectSubcategoryAndProduct()
})