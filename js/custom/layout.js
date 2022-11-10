function changeActiveLink() {
    var currentLocation = window.location.href;
    currentLocation = currentLocation.replace('//', '/').split('/');
    var page = currentLocation[currentLocation.length - 1]; 

    // if(page.includes('groupwork-details.html') ) {
    //     page = 'groupwork.html'
    // } else if(page.includes('user-details.html') ) {
    //     page = 'user-table.html'
    // }

    $('.sidebar-menu a[href*="' + page + '"]').addClass('active');
}

$(function () {
    $("#header").load('/header.html')
    $("#footer-section").load('/footer.html')
    $("#modal-delete").load('/modal-delete.html')
    $("#admin-sidebar").load('/admin-sidebar.html', changeActiveLink)
    $("#admin-footer").load('/admin-footer.html')
})

// $('.br-sideleft .br-sideleft-menu li a').each(function() {
//     if ($(this).attr('href') == pathname) {
//         $(this).addClass('active');
//     }
// });