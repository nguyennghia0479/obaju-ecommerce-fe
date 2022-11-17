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

    function getSizes() {
        $.ajax({
            url: "http://localhost:8080/api/v1/product-sizes",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function(response) {
            $("#table-size tbody").empty()
            $.each(response.content, function(index, value) {
                var row = `<tr>
                                <td>${index + 1}</td>
                                <td>${value.size}</td>
                                <td>
                                    <div class="col-sm-6">
                                        <a href="#deleteModal" class="btn btn-danger btn-delete btn-sm" data-toggle="modal"
                                            id=${value.id} target="product-sizes" data-toggle="tooltip" title="Delete">
                                            <i class="fa fa-trash" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>`
                $("#table-size tbody").append(row)
            })
        }).fail(function(xhr, status, error) {
            var data = xhr.responseText
            var jsonData = JSON.parse(data)
            var message = jsonData["errors"]
            getToastError(message)
        })
    }

    function getSelectSizeType() {
        $.ajax({
            url: "http://localhost:8080/api/v1/product-sizes/select-size-type",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function(response) {
            $("#selectSize").empty()
            $("#selectSize").append('<option value="">Chọn loại size</option>')
            $.each(response.content, function(index, value) {
                var row = `<option value=${value}>${value}</option>`
                $("#selectSize").append(row)
            })
        }).fail(function(xhr, status, error) {
            var data = xhr.responseText
            var jsonData = JSON.parse(data)
            var message = jsonData["errors"]
            getToastError(message)
        })
    }

    function clearFormData() {
        $("#size").val('')
        getSelectSizeType()
    }

    function createSize(dataSize) {
        $.ajax({
            url: "http://localhost:8080/api/v1/admin/product-sizes",
            method: "POST",
            data: JSON.stringify({
                size: dataSize
            }),
            contentType: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function(response) {
            if(!response.hasError) {
                getToastSuccess("Thêm size mới thành công")
                clearFormData()
                getSizes()
            }
        }).fail(function(xhr, status, error) {
            var data = xhr.responseText
            var jsonData = JSON.parse(data)
            var message = jsonData["errors"]
            getToastError(message)
        })
    }

    $("#btn-add-size").click(function() {
        clearFormData()
    })

    $("#sizeForm").validate({
        rules: {
            size: {
                required: true,
                maxlength: 10
            }
        },
        messages: {
            size: {
                required: "Bạn chưa nhập size",
                maxlength: "Size tối đa 10 ký tự"
            }
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
           $(input).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            var dataSize = $("#size").val()
            createSize(dataSize)
        }
    })

    getSizes()
})