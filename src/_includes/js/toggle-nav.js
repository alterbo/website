const nav = document.getElementById('nav');
if (nav) {
    const navHeight = nav.offsetHeight;
    let prevScrollPos = window.scrollY;

    function toggleNavVisibility() {
        const currentScrollPos = window.scrollY;
        const isScrollingUp = currentScrollPos < prevScrollPos;

        if (isScrollingUp || currentScrollPos <= 0) {
            nav.style.transform = 'translateY(0)';
        } else {
            nav.style.transform = `translateY(-${navHeight}px)`;
        }

        prevScrollPos = currentScrollPos;
    }

    function checkWindowSize() {
        if (window.innerWidth < 768) {
            window.addEventListener('scroll', toggleNavVisibility);
        } else {
            window.removeEventListener('scroll', toggleNavVisibility);
            nav.style.transform = 'translateY(0)';
        }
    }

    window.addEventListener('load', checkWindowSize);
    window.addEventListener('resize', checkWindowSize);
}
