function changeActiveLink() {
    var currentLocation = window.location.href;
    currentLocation = currentLocation.replace('//', '/').split('/');
    var page = currentLocation[currentLocation.length - 1]; 
    $('.sidebar-menu a[href*="' + page + '"]').addClass('active');
}

$(function () {
    $("#header").load('header.html')
    $("#footer-section").load('footer.html')
    $("#modal-delete").load('modal-delete.html')
    $("#admin-sidebar").load('admin-sidebar.html', changeActiveLink)
    $("#admin-footer").load('admin-footer.html')
})