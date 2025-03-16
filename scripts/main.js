let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    if (index >= slides.length) {
        slideIndex = 0;
    } else if (index < 0) {
        slideIndex = slides.length - 1;
    } else {
        slideIndex = index;
    }
    const offset = -slideIndex * 100;
    document.querySelector('.slides').style.transform = `translateX(${offset}%)`;
}

function moveSlide(step) {
    showSlide(slideIndex + step);
}

document.addEventListener('DOMContentLoaded', () => {
    showSlide(slideIndex);
    setInterval(() => {
        moveSlide(1);
    }, 5000); // Cambia de imagen cada 3 segundos
});