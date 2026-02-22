// Less predictable looping animation that slows its frequency after 7 full cycles.
let _gsapPromise;
function loadGsap() {
    if (!_gsapPromise) {
        _gsapPromise = import('gsap').then((m) => m.gsap || m.default || m);
    }
    return _gsapPromise;
}

export async function initBannerMoustache() {
    const svg = document.getElementById('bannerMoustache');
    if (!svg) return;
    const left = svg.querySelector('.moustache-left');
    const right = svg.querySelector('.moustache-right');
    if (!left || !right) return;

    // Respect reduced motion preference.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const gsap = await loadGsap();

    // Anchor setup: left transforms around its right center; right uses precise svgOrigin.
    gsap.set(left, { transformOrigin: '100% 50%' });
    const rb = right.getBBox();
    gsap.set(right, { svgOrigin: `${rb.x} ${rb.y + rb.height / 2}` });

    // Shared cycle counter to trigger slowdown after threshold.
    let cycles = 0;
    const SLOW_THRESHOLD = 7;

    // Helper to compute duration factoring slowdown (frequency decrease).
    function computeDuration() {
        if (cycles <= SLOW_THRESHOLD) return 1.1 + gsap.utils.random(-0.1, 0.15);
        // Gradually lengthen duration as cycles grow, capped.
        const extra = Math.min(cycles - SLOW_THRESHOLD, 10); // cap growth
        return 1.25 + extra * 0.12 + gsap.utils.random(-0.08, 0.12); // softer randomness
    }

    // Generate a single wave cycle for a given part.
    function waveCycle(part, side, delay = 0) {
        cycles++;
        const dur = computeDuration();

        // Randomized target values within sensible ranges per side.
        const first = {
            rotation: side === 'left' ? gsap.utils.random(3, 7) : gsap.utils.random(-7, -3),
            skewX: side === 'left' ? gsap.utils.random(9, 15) : gsap.utils.random(-15, -9),
            skewY: side === 'left' ? gsap.utils.random(0, 2) : gsap.utils.random(-2, 0)
        };
        const second = {
            rotation: side === 'left' ? gsap.utils.random(-5, -2) : gsap.utils.random(2, 5),
            skewX: side === 'left' ? gsap.utils.random(-12, -6) : gsap.utils.random(6, 12),
            skewY: 0
        };

        const tl = gsap.timeline({ delay });
        tl.to(part, {
            rotation: first.rotation,
            skewX: first.skewX,
            skewY: first.skewY,
            duration: dur,
            ease: 'sine.inOut'
        }).to(part, {
            rotation: second.rotation,
            skewX: second.skewX,
            skewY: second.skewY,
            duration: dur,
            ease: 'sine.inOut',
            onComplete: () => waveCycle(part, side, delay) // recurse for endless loop
        });
    }

    // Kick off both parts; right delayed so motion travels across.
    waveCycle(left, 'left', 0);
    waveCycle(right, 'right', 0.18);
}
