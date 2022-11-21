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

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    function getUser() {
        var user = parseJwt(Cookies.get('token'))
        var username = user.sub
        $.ajax({
            url: "https://obaju-ecommerce.herokuapp.com/api/v1/auth/customer-account",
            method: "POST",
            data: {
                username: username
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
            }
        }).done(function (response) {
            var user = response.content
            $("#fullName").val(user.fullName)
            $("#phoneNum").val(user.phoneNum)
            $("#email").val(user.email)
        })
    }

    function clearCustomerForm() {
        $(".form-control").removeClass("is-invalid is-valid")
        $("label[class=error]").remove()
        getUser()
    }

    $(".btn-reset").click(function () {
        clearCustomerForm()
    })

    $.validator.addMethod('phoneNum', function (value, element) {
        return this.optional(element) || /^[0]\d{9}$/.test(value);
    }, "Please enter a valid phone number");

    $("#userForm").validate({
        rules: {
            fullName: {
                required: true,
                minlength: 5,
                maxlength: 100
            },
            phoneNum: {
                required: true,
                phoneNum: true
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            fullName: {
                required: "Bạn chưa nhập họ tên",
                minlength: "Họ tên phải có ít nhất 5 ký tự",
                maxlength: "Họ tên tối đa 100 ký tự"
            },
            phoneNum: {
                required: "Bạn chưa nhập số điện thoại",
                phoneNum: "Số điện thoại không hợp lệ"
            },
            email: {
                required: "Bạn chưa nhập email",
                email: "Email không hợp lệ"
            }
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
            $(input).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            var user = parseJwt(Cookies.get('token'))
            var dataUsername = user.sub
            var dataFullName = $("#fullName").val()
            var dataPhoneNum = $("#phoneNum").val()
            var dataEmail = $("#email").val()
            $.ajax({
                url: "https://obaju-ecommerce.herokuapp.com/api/v1/auth/customer-account",
                method: "PUT",
                data: JSON.stringify({
                    username: dataUsername,
                    fullName: dataFullName,
                    phoneNum: dataPhoneNum,
                    email: dataEmail
                }),
                contentType: "application/json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get('token'));
                }
            }).done(function(response) {
                if(!response.hasError) {
                    getToastSuccess("Cập nhật thông tin thành công")
                    clearCustomerForm()
                }
            }).fail(function(xhr, status, error) {
                var data = xhr.responseText
                var jsonResponse = JSON.parse(data)
                var message = jsonResponse["errors"]
                getToastError(message)
            })
        }
    })

    getUser()
})