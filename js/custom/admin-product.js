$(document).ready(function () {

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',

    });

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

    function getProducts() {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/products",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $("#table-product tbody").empty()
            $.each(response.content, function (index, value) {
                var row = `<tr>
                                <th>${index + 1}</th>
                                <td>${value.name}</td>
                                <td>${formatter.format(value.price)}</td>
                                <td><img src="${value.avatarURL}" alt="${value.name}" width="50em"></td>
                                <td>${value.subcategory.name}</td>
                                <td>
                                    <div class="row no-gutters">
                                        <div class="col-sm-6">
                                            <a href="#productFormModal" class="btn btn-sm btn-primary btn-edit-product" 
                                            data-toggle="modal" product-id=${value.id} data-toggle="tooltip" title="Edit">
                                            <i class="fa fa-pencil" aria-hidden="true"></i></a>
                                        </div>
                                        <div class="col-sm-6">
                                            <a href="#deleteModal" class="btn btn-danger btn-delete btn-sm" data-toggle="modal"
                                            id=${value.id} target="products" data-toggle="tooltip" title="Delete">
                                            <i class="fa fa-trash" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                </td>
                            </tr>`
                $("#table-product tbody").append(row)
            })
        })
    }

    function getSelectColor(color) {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/products/select-color",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $("#selectColor").empty()
            $("#selectColor").append('<option value="">Chọn màu</option>')
            $.each(response.content, function (index, value) {
                var option = `<option value="${value}">${value}</option>`
                $("#selectColor").append(option)
            })
            if(color != null)
                $("#selectColor").val(color)
        })
    }

    function getSelectSubcategory(subcategoryId) {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/subcategories/select-subcategory",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $("#selectSubcategory").empty()
            $("#selectSubcategory").append('<option value="">Chọn Danh mục</option>')
            $.each(response.content, function (index, value) {
                var option = `<option value="${value.id}">${value.name}</option>`
                $("#selectSubcategory").append(option)
            })
            if(subcategoryId != null)
                $("#selectSubcategory").val(subcategoryId)
        })
    }

    function clearFormData() {
        $("#id").val('')
        $("#name").val('')
        $("#price").val('')
        $("#avatarURL").val(null)
        $("#avatarURL").next('.custom-file-label').html('Choose a File');
        $("#previewImg").attr('src', '').hide()
        $(".form-control, .custom-file-input").removeClass("is-invalid is-valid")
        $("label[class=error]").remove()
        getSelectColor(null)
        getSelectSubcategory(null)
    }

    function createProduct(form) {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/admin/products",
            method: "POST",
            data: form,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function(response) {
            if(response.hasError == false) {
                getToastSuccess("Thêm sản phẩm thành công")
                clearFormData()
                getProducts()
            }
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var jsonResponse = JSON.parse(data)
            var message = jsonResponse["errors"]
            getToastError(message)
        })
    }

    function updateProduct(form, dataId) {
        form.append('id', dataId)
            $.ajax({
                url: "https://obaju-ecommerce.herokuapp.com/api/v1/admin/products",
                method: "PUT",
                data: form,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
                }
            }).done(function(response) {
                if(!response.hasError) {
                    getToastSuccess("Cập nhật sản phẩm thành công")
                    clearFormData()
                    getProducts()
                }
                $("#productFormModal").modal('hide')
            }).fail(function (xhr, status, error) {
                var data = xhr.responseText
                var jsonResponse = JSON.parse(data)
                var message = jsonResponse["errors"]
                getToastError(message)
            })
    }

    $('#avatarURL').on('change',function(){
        var fileName = $(this).val();
        $(this).next('.custom-file-label').html(fileName);
        const [file] = avatarURL.files
        if(file) {
            previewImg.src = URL.createObjectURL(file)
        }
    })

    $("#btn-add-product").click(function () {
        clearFormData()
    })

    $("body").on('click', '.btn-edit-product', function() {
        var id = $(this).attr("product-id")
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/products/" + id,
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function(response) {
            var product = response.content
            $("#id").val(id)
            $("#name").val(product.name)
            $("#price").val(product.price)
            $("#previewImg").attr('src', product.avatarURL)
            $("#avatarURL").addClass('ignore')
            getSelectColor(product.color)
            getSelectSubcategory(product.subcategory.id)
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var jsonResponse = JSON.parse(data)
            var message = jsonResponse["errors"]
            getToastError(message)
        })
    })
    

    $("#productForm").validate({
        ignore: ".ignore",
        rules: {
            avatarURL: {
                required: true,
                extension: "jpg|jpeg|png|jfif"
            },
            name: {
                required: true,
                minlength: 5,
                maxlength: 100
            },
            selectColor: "required",
            price: {
                required: true,
                number: true,
                digits: true
            },
            selectSubcategory: "required"
        },
        messages: {
            avatarURL: {
                required: "Bạn chưa chọn file ảnh",
                extension: "File ảnh phải có đuôi là jpg, jpeg, png, jfif"
            },
            name: {
                required: "Bạn chưa nhập tên sản phẩm",
                minlength: "Tên sản phẩm phải có ít nhất 5 ký tự",
                maxlength: "Tên sản phẩm tối đa 100 ký tự"
            },
            selectColor: "Bạn chưa chọn màu sắc",
            price: {
                required: "Bạn chưa nhập đơn giá",
                number: "Đơn giá phải là số nguyên dương",
                digits: "Đơn giá phải là số nguyên dương"
            },
            selectSubcategory: "Bạn chưa chọn danh mục"
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
           $(input).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            var dataId = $("#id").val()
            var dataColor = $("#selectColor").val()
            var dataSubcategoryId = $("#selectSubcategory").val()
            var dataAvatarURL = $("#avatarURL")[0].files
           
            var form = new FormData($("#productForm")[0]);
            form.append('color', dataColor)
            form.append('subcategoryId', dataSubcategoryId)
            if(dataAvatarURL.length > 0) {
                form.append('file', dataAvatarURL[0])
            }
    
            if(dataId == '') {
                createProduct(form)
            } else {
                updateProduct(form, dataId)
            }
        }
    })

    getProducts()
})