function changeActiveLink() {
    var currentLocation = window.location.href;
    currentLocation = currentLocation.replace('//', '/').split('/');
    var page = currentLocation[currentLocation.length - 1]; 
    $('.sidebar-menu a[href*="' + page + '"]').addClass('active');
}

function changeActiveLink2() {
    var currentLocation = window.location.href;
    currentLocation = currentLocation.replace('//', '/').split('/');
    var page = currentLocation[currentLocation.length - 1]; 
    if(page.includes("index"))
        $('#navigation a[href*="' + page + '"]').addClass('active');
    else if(page.includes("admin")) {
        $('#navigation .admin-menu a[href*="#"]').addClass('active');
    } else {
        $('#navigation .menu-large a[href*="#"]').addClass('active');
    }
}

$(function () {
    $("#header").load('header.html', changeActiveLink2)
    $("#footer-section").load('footer.html')
    $("#modal-delete").load('modal-delete.html')
    $("#admin-sidebar").load('admin-sidebar.html', changeActiveLink)
    $("#admin-footer").load('admin-footer.html')
})