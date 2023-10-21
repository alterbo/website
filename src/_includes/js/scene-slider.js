const pathName = new URL(location.href).pathname;
const pathNameWithoutSlide = new URL(location.href).pathname.split('/').slice(0, -2).join('/');
const slide = pathName.split('/')[pathName.split('/').length - 2];
const lengthElement = document.getElementById('controls');
const length = lengthElement?.getAttribute('length');
let prevButton = document.getElementById('prev-button');
let nextButton = document.getElementById('next-button');

let startX = 0;
let endX = 0;

function handleTouchStart(event) {
    startX = event.touches[0].clientX;
}

function handleTouchMove(event) {
    endX = event.touches[0].clientX;
}

function handleTouchEnd() {
    const threshold = 100;
    const slideDiff = endX - startX;

    if (slideDiff > threshold) {
        if (prevButton && prevButton.getAttribute('href')) {
            window.location.href = prevButton.getAttribute('href');
        }
    } else if (slideDiff < -threshold) {
        if (nextButton && nextButton.getAttribute('href')) {
            window.location.href = nextButton.getAttribute('href');
        }
    }
}

document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);

if (prevButton && slide === '1') {
    prevButton.style.visibility = 'hidden';
} else {
    prevButton.style.visibility = 'visible';
    prevButton.setAttribute('href', `${pathNameWithoutSlide}/${Number(slide) - 1}`);
}

if (nextButton && Number(slide) < Number(length)) {
    nextButton.style.visibility = 'visible';
    nextButton.setAttribute('href', `${pathNameWithoutSlide}/${Number(slide) + 1}`);
} else {
    nextButton.removeAttribute('href');
    nextButton.style.visibility = 'hidden';
}


