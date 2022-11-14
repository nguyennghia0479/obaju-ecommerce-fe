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

    function getStocks() {
        $.ajax({
            url: "http://localhost:8080/api/v1/stocks",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $("#table-stock tbody").empty()
            $.each(response.content, function (index, value) {
                var row = `<tr>
                                <td>${index + 1}</td>
                                <td>${value.product.name}</td>
                                <td><img src="${value.product.avatarURL}" alt="${value.product.name}" width="100em"></td>
                                <td>${value.productSize.size}</td>
                                <td>${value.quantity}</td>
                                <td>
                                    <div class="row no-gutters">
                                        <div class="col-sm-6">
                                            <a href="#stockFormModal" class="btn btn-sm btn-primary btn-edit-stock" 
                                            data-toggle="modal" stock-id=${value.id} data-toggle="tooltip" title="Edit">
                                            <i class="fa fa-pencil" aria-hidden="true"></i></a>
                                        </div>
                                        <div class="col-sm-6">
                                            <a href="#deleteModal" class="btn btn-danger btn-delete btn-sm" data-toggle="modal"
                                            id=${value.id} target="stocks" data-toggle="tooltip" title="Delete">
                                            <i class="fa fa-trash" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                </td>
                            </tr>`
                $("#table-stock tbody").append(row)
            })
        })
    }

    function getSelectSubcategoryAndProduct() {
        $.ajax({
            url: "http://localhost:8080/api/v1/subcategories/select-subcategory",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $("#selectSubcategory").empty()
            $("#selectSubcategory").append('<option value="">Chọn danh mục</option>')
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
                url: "http://localhost:8080/api/v1/subcategories/products/select-products",
                method: "GET",
                data: data,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
                }
            }).done(function (response) {
                $("#selectProduct").empty()
                $("#selectProduct").append('<option value="">Chọn sản phẩm</option>')
                $.each(response.content, function (key, value) {
                    var option = `<option value="${value.id}">${value.name}</option>`
                    $("#selectProduct").append(option)
                })
            })
        })
    }

    function getSelectSize(sizeId) {
        $.ajax({
            url: "http://localhost:8080/api/v1/product-sizes",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $("#selectSize").empty()
            $("#selectSize").append('<option value="">Chọn size</option>')
            $.each(response.content, function (index, value) {
                var row = `<option value=${value.id}>${value.size}</option>`
                $("#selectSize").append(row)
                if (sizeId != null)
                    $("#selectSize").val(sizeId)
            })
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var dataJson = JSON.parse(data)
            var message = dataJson["errors"]
            getToastError(message)
        })
    }

    function clearFormData() {
        getSelectSize(null)
        getSelectSubcategoryAndProduct()
        $("#selectSubcategory").val('')
        $("#selectProduct").val('')
        $("#selectSize").val('')
        $("#quantity").val('')
        $("#stockForm .row").show()
        $("label[for=update-quantity], input#update-quantity").hide()
    }

    function createStock(dataProductId, dataSizeId, dataQuantity) {
        $.ajax({
            url: "http://localhost:8080/api/v1/admin/stocks",
            method: "POST",
            data: JSON.stringify({
                productId: dataProductId,
                productSizeId: dataSizeId,
                quantity: dataQuantity
            }),
            contentType: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            if (!response.hasError) {
                getToastSuccess("Add new stock successfully")
                clearFormData()
                getStocks()
            }
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var dataJson = JSON.parse(data)
            var message = dataJson["errors"]
            getToastError(message)
        })
    }

    function updateStock(dataId, dataQuantity) {
        $.ajax({
            url: "http://localhost:8080/api/v1/admin/stocks",
            method: "PUT",
            data: JSON.stringify({
                id: dataId,
                quantity: dataQuantity
            }),
            contentType: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            if (!response.hasError) {
                getToastSuccess("Update stock successfully")
                clearFormData()
                getStocks()
            }
            $("#stockFormModal").modal('hide')
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText
            var dataJson = JSON.parse(data)
            var message = dataJson["errors"]
            getToastError(message)
        })
    }

    $("#btn-add-stock").click(function () {
        clearFormData()
    })

    $("body").on('click', '.btn-edit-stock', function () {
        var id = $(this).attr("stock-id")
        var quantity = $(this).closest("td").prev("td").text()
        $("#id").val(id)
        $("#update-quantity").val(quantity)
        $("#stockForm .row").hide()
        $("label[for=update-quantity], input#update-quantity").show()
    })

    $("#btn-save-stock").click(function (e) {
        e.preventDefault()
        var dataId = $("#id").val()
        if (dataId == '') {
            var dataProductId = $("#selectProduct").val()
            var dataSizeId = $("#selectSize").val()
            var dataQuantity = $("#quantity").val()
            createStock(dataProductId, dataSizeId, dataQuantity)
        } else {
            var dataQuantity = $("#update-quantity").val()
            updateStock(dataId, dataQuantity)
        }
    })

    getStocks()
})