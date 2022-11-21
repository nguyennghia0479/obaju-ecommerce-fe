$(document).ready(function() {

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',

    });

    function getTotalPrice(price, quantity) {
        return price * quantity
    }

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
    
    function statusOrders(id) {
        var status = $("[id=" + id + "] .status-order").text()
        if (status == 'PREPARED') {
            $("[id=" + id + "] .status-order").addClass('badge badge-info')
        } else if (status == 'RECEIVED') {
            $("[id=" + id + "] .status-order").addClass('badge badge-success')
            $("[id=" + id + "] .btn-delivery").hide()
            $("[id=" + id + "] .btn-cancel").hide()
        } else {
            $("[id=" + id + "] .status-order").addClass('badge badge-danger')
            $("[id=" + id + "] .btn-delivery").hide()
            $("[id=" + id + "] .btn-cancel").hide()
        }
    }

    function getOrders() {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/orders",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function(response) {
            $("#table-order .orders").empty()
            $.each(response.content, function(index, value) {
                var row = `<tr id=${index + 1}>
                                <th>${index + 1}</th>
                                <td>${value.orderDate}</td>
                                <td>${value.payment}</td>
                                <td><span class="status-order">${value.statusOrder}</span></td>
                                <td>${value.username}</td>
                                <td>
                                    <a href="#orderModal" data-toggle="modal" order-id=${value.id} address="${value.address}" title="Xem chi tiết"
                                        class="btn btn-info btn-sm btn-order-detail"><i class="fa fa-eye" aria-hidden="true"></i></a> 
                                    <a href="#confirmModal" data-toggle="modal" order-id=${value.id} title="Xác nhận giao hàng thành công"
                                        class="btn btn-primary btn-sm btn-delivery"><i class="fa fa-check" aria-hidden="true"></i></a> 
                                    <a href="#confirmModal" data-toggle="modal" order-id=${value.id} title="Xác nhận hủy đơn hàng"
                                        class="btn btn-danger btn-sm btn-cancel"><i class="fa fa-trash" aria-hidden="true"></i></a>                                 
                                </td>
                            </tr>`
                $("#table-order .orders").append(row)
                statusOrders(index + 1)
            })
        })
    }

    function getOrderDetailById(orderId, address) {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/orders/" + orderId + "/orderItem",
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function(response) {
            $("#order-detail tbody").empty()
            var totalOrder = 0
            $.each(response.content, function(index, value) {
                var totalPrice = `${getTotalPrice(value.stock.product.price, value.quantity)}`
                totalOrder += parseInt(totalPrice)
                var row =`<tr>
                                <td><img width="50rem" src="${value.stock.product.avatarURL}" alt="${value.stock.product.name}"></td>
                                <td><a href="#">${value.stock.product.name} Size ${value.stock.productSize.size}</a></td>
                                <td>${value.quantity}</td>
                                <td>${formatter.format(value.price)}</td>
                                <td>${formatter.format(totalPrice)}</td>
                            </tr>`
                $("#order-detail tbody").append(row)
            })
            $("#order-summary .address").text(address)
            $("#order-summary .total-price").text(formatter.format(totalOrder))
            $("#order-summary .ship-price").text(formatter.format(20000))
            $("#order-summary .total-order-price").text(formatter.format(20000 + totalOrder))
        })
    }

    function confirmDeliveryOrders(dataOrderId) {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/admin/orders/delivery-success/" + dataOrderId,
            method: "PUT",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function(response) {
            if(!response.hasError) {
                getToastSuccess("Xác nhận giao hàng thành công")
                getOrders()
            }
            $("#confirmModal").modal('hide')
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText;
            var jsonResponse = JSON.parse(data);
            var message = jsonResponse["errors"]
            getToastError(message)
        })
    }

    function confirmCancelOrders(dataOrderId) {
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/admin/orders/cancel/" + dataOrderId,
            method: "PUT",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function(response) {
            if(!response.hasError) {
                getToastSuccess("Xác nhận hủy đơn hàng thành công")
                getOrders()
            }
            $("#confirmModal").modal('hide')
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText;
            var jsonResponse = JSON.parse(data);
            var message = jsonResponse["errors"]
            getToastError(message)
        })
    }

    $(document).on('click', '.btn-order-detail', function() {
        var orderId = $(this).attr("order-id")
        var address = $(this).attr("address")
        getOrderDetailById(orderId, address)
    })

    $(document).on('click', '.btn-delivery', function() {
        $("#confirmModal .title").text("Xác nhận giao hàng")
        var id = $(this).attr('order-id')
        $(".btn-confirm").attr('order-id', id)
        $(".btn-confirm").attr("action", "delivery")

    })

    $(document).on('click', '.btn-cancel', function() {
        $("#confirmModal .title").text("Xác nhận hủy đơn hàng")
        var id = $(this).attr('order-id')
        $(".btn-confirm").attr('order-id', id)
        $(".btn-confirm").attr("action", "cancel")
    })

    $(document).on('click', '.btn-confirm', function() {
        var dataOrderId = $(this).attr('order-id')
        var action = $(this).attr('action')
        if(action == 'delivery') {
            confirmDeliveryOrders(dataOrderId)
        } else {
            confirmCancelOrders(dataOrderId)
        }
    })

    getOrders()
})