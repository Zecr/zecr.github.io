window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    var headerHeight = header.offsetHeight;

    if (window.scrollY > headerHeight) {
        header.style.backgroundColor = '#'; // replace 'newColor' with the color you want
    } else {
        header.style.backgroundColor = 'transparent'; // replace 'originalColor' with the original color
    }
});