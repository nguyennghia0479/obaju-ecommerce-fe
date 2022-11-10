$(document).ready(function () {
    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    if (Cookies.get('token') != null) {
        var user = parseJwt(Cookies.get('token'))
        $("#top #register").hide()
        $("#top #login").hide()
        $("#display-name").text(user.sub)
        if(user.scope[0].toLowerCase() == 'group admin') {
            $(".admin-menu").show()
        } else {
            $(".admin-menu").hide()
        }
    } else {
        $("#top #display-name").hide()
        $("#top #logout").hide()
        $(".admin-menu").hide()
    }

    $("#login").click(function () {
        $("#username").val('')
        $("#password").val('')
        $(".alert-message").css('display', 'none')
    })

    $("#btn-login").click(function (e) {
        e.preventDefault()
        var username = $("#username").val()
        var password = $("#password").val()
        $.ajax({
            url: "http://localhost:8080/api/v1/auth/login",
            method: "POST",
            data: JSON.stringify({
                username: username,
                password: password
            }),
            contentType: "application/json",
        }).done(function (response) {
            if (!response.hasError) {
                var token = response.content
                Cookies.set('token', token)
                window.location.href = "/index.html"
            }
        }).fail(function (xhr, status, error) {
            var data = xhr.responseText;
            var jsonResponse = JSON.parse(data);
            var message = jsonResponse["errors"]
            $(".alert-message").css('display', 'block')
            $(".alert-message").text(message)
        })
    })

    $("#btn-logout").click(function (e) {
        e.preventDefault()
        Cookies.remove('token')
        window.location.href = "/register.html"
    })

})