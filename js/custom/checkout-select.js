$(document).ready(function () {
    $.ajax({
        url: "http://localhost:8080/api/v1/provinces-select",
        method: "GET"
    }).done(function (response) {
        $.each(response, function(key, value) {
            var option = `<option value="${value.id}">${value.name}</option>`
            $("#province").append(option)
        })
    })

    $("#province").on('change', function() {
        $("#district").find('option').remove()
        $("#district").append('<option value="">Chọn Quận, Huyện Xã</option>')
        let provinceId = $("#province").val();
        let data = {
            provinceId : provinceId
        }
        $.ajax({
            url: "http://localhost:8080/api/v1/districts-select",
            method: "GET",
            data: data
        }).done(function (response) {
            $.each(response, function(key, value) {
                var option = `<option value="${value.id}">${value.name}</option>`
                $("#district").append(option)
            })
        })
    })
})