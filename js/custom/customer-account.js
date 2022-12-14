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
                required: "B???n ch??a nh???p h??? t??n",
                minlength: "H??? t??n ph???i c?? ??t nh???t 5 k?? t???",
                maxlength: "H??? t??n t???i ??a 100 k?? t???"
            },
            phoneNum: {
                required: "B???n ch??a nh???p s??? ??i???n tho???i",
                phoneNum: "S??? ??i???n tho???i kh??ng h???p l???"
            },
            email: {
                required: "B???n ch??a nh???p email",
                email: "Email kh??ng h???p l???"
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
                    getToastSuccess("C???p nh???t th??ng tin th??nh c??ng")
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