$(document).ready(function () {

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',

    });

    function getTotalPrice(price, quantity) {
        return price * quantity
    }

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    function statusOrders(id) {
        var status = $("[id=" + id + "] .status-order").text()
        if (status == 'PREPARED') {
            $("[id=" + id + "] .status-order").addClass('badge badge-info')
        } else if (status == 'RECEIVED') {
            $("[id=" + id + "] .status-order").addClass('badge badge-success')
        } else {
            $("[id=" + id + "] .status-order").addClass('badge badge-danger')
        }
    }


    function getOrders() {
        var user = parseJwt(Cookies.get('token'))
        var username = user.sub
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/orders/user/" + username,
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            $("#customer-orders .orders").empty()
            $.each(response.content, function (index, value) {
                var row = `<tr id=${index + 1}>
                                <th>${value.code}</th>
                                <td>${value.orderDate}</td>
                                <td>${formatter.format(value.totalPrice)}</td>
                                <td>${value.payment}</td>
                                <td><span class="status-order">${value.statusOrder}</span></td>
                                <td>
                                    <a href="#orderModal" data-toggle="modal" order-id=${value.id} address="${value.address}" title="Xem chi tiết"
                                        class="btn btn-info btn-sm btn-order-detail"><i class="fa fa-eye" aria-hidden="true"></i></a>                                  
                                </td>
                            </tr>`
                $("#customer-orders .orders").append(row)
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

    $(document).on('click', '.btn-order-detail', function() {
        var orderId = $(this).attr("order-id")
        var address = $(this).attr("address")
       getOrderDetailById(orderId, address)
    })

    getOrders()

})