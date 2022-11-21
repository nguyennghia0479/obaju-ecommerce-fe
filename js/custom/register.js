$(document).ready(function() {

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

    function clearRegisterForm() {
        $(".form-control").removeClass("is-invalid is-valid")
        $("label[class=error]").remove()
        $("#fullName").val('')
        $("#phoneNum").val('')
        $("#email").val('')
        $("#username").val('')
        $("#password").val('')
    }

    $(".btn-reset").click(function () {
        clearRegisterForm()
    })

    $.validator.addMethod('phoneNum', function (value, element) {
        return this.optional(element) || /^[0]\d{9}$/.test(value);
    }, "Please enter a valid phone number");

    $("#registerForm").validate({
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
            },
            usernameRegister: {
                required: true,
                minlength: 5,
                maxlength: 100
            },
            passwordRegister: {
                required: true,
                minlength: 5,
                maxlength: 100
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
            },
            usernameRegister: {
                required: "Bạn chưa nhập tên tài khoản",
                minlength: "Tên tài khoản phải có ít nhất 5 ký tự",
                maxlength: "Tên tài khoản tối đa 100 ký tự"
            },
            passwordRegister: {
                required: "Bạn chưa nhập mật khẩu",
                minlength: "Mật khẩu phải có ít nhất 5 ký tự",
                maxlength: "Mật khẩu khoản tối đa 100 ký tự"
            }
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
            $(input).removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            var dataFullName = $("#fullName").val()
            var dataPhoneNum = $("#phoneNum").val()
            var dataEmail = $("#email").val()
            var dataUsername = $("#usernameRegister").val()
            var dataPassword = $("#passwordRegister").val()
            $.ajax({
                url: "https://obaju-ecommerce.herokuapp.com/api/v1/auth/register",
                method: "POST",
                data: JSON.stringify({
                    fullName: dataFullName,
                    phoneNum: dataPhoneNum,
                    email: dataEmail,
                    username: dataUsername,
                    password: dataPassword
                }),
                contentType: "application/json",
            }).done(function(response) {
                if (!response.hasError) {
                    alert("Đăng ký thành công")
                    var token = response.content
                    Cookies.set('token', token)
                    window.location.href = 'index.html'
                }
            }).fail(function(xhr, status, error) {
                var data = xhr.responseText
                var jsonResponse = JSON.parse(data)
                var message = jsonResponse["errors"]
                getToastError(message)
            })
        }
    })
})