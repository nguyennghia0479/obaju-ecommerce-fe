$(document).ready(function() {

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
        console.log(user.sub)
        if(user.scope[0].toLowerCase() != 'group admin') {
            window.location.href = "404.html"
        }
    } else {
        window.location.href = "404.html"
    }


})