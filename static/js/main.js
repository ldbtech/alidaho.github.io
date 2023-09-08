const toggleButton = document.getElementById('navbar-toggle');
const navbarLinks = document.querySelector('.navbar-links');

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
});
