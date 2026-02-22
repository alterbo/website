export function initSceneSlider() {
  const pathName = new URL(location.href).pathname;
  const pathNameWithoutSlide = pathName.split('/').slice(0, -2).join('/');
  const slide = pathName.split('/')[pathName.split('/').length - 2];
  const lengthElement = document.getElementById('controls');
  const length = lengthElement?.getAttribute('length');
  const nextButton = document.getElementById('next-button');
  const prevButton = document.getElementById('prev-button');
  const heading = document.getElementById('scene-heading');
  const pageIndicator = document.getElementById('scene-page');
  const pageIndicatorNumber = document.getElementById('scene-page-number');

  const SWIPE_THRESHOLD_X = 56; // px
  const HORIZONTAL_DOMINANCE_RATIO = 1.2;

  const swipeTarget = document.querySelector('scene-viewer') || document.body;

  swipeTarget.style.touchAction = 'pan-y';

  let interacted = false;

  function revealHeadingOnInteraction() {
    if (interacted) return;
    interacted = true;
    if (heading?.classList.contains('sr-only')) {
      heading.classList.remove('sr-only');
    }
    heading?.focus();
  }

  function handleKeydown(event) {
    const key = event.key;
    if (key === 'ArrowLeft' && prevButton?.getAttribute('href')) {
      window.location.href = prevButton.getAttribute('href');
    } else if (key === 'ArrowRight' && nextButton?.getAttribute('href')) {
      window.location.href = nextButton.getAttribute('href');
    } else if (key === 'Home') {
      window.location.href = `${pathNameWithoutSlide}/1/`;
    } else if (key === 'End' && length) {
      window.location.href = `${pathNameWithoutSlide}/${Number(length)}/`;
    }
    revealHeadingOnInteraction();
  }

  if (('ontouchstart' in window || navigator.maxTouchPoints) && lengthElement) {
    lengthElement.classList.add('on-touch-device');
  }

  const supportsPointer = 'PointerEvent' in window;
  if (supportsPointer) {
    let activePointerId = null;
    let startX = 0;
    let startY = 0;

    const isTouchLike = (e) =>
      e.pointerType === 'touch' ||
      (e.pointerType === 'mouse' && navigator.maxTouchPoints > 0);

    function onPointerDown(e) {
      if (!isTouchLike(e)) return;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
    }

    function finishSwipe(e) {
      if (e.pointerId !== activePointerId || !isTouchLike(e)) return;
      const endX = e.clientX;
      const endY = e.clientY;
      const dx = endX - startX;
      const dy = endY - startY;
      const isHorizontalSwipe =
        Math.abs(dx) >= SWIPE_THRESHOLD_X &&
        Math.abs(dx) > Math.abs(dy) * HORIZONTAL_DOMINANCE_RATIO;

      if (isHorizontalSwipe) {
        if (dx < 0 && nextButton?.getAttribute('href')) {
          window.location.href = nextButton.getAttribute('href');
        } else if (dx > 0 && prevButton?.getAttribute('href')) {
          window.location.href = prevButton.getAttribute('href');
        }
      }
      activePointerId = null;
    }

    function cancelSwipe() {
      activePointerId = null;
    }

    swipeTarget.addEventListener('pointerdown', onPointerDown, { passive: true });
    swipeTarget.addEventListener('pointerup', finishSwipe, { passive: true });
    swipeTarget.addEventListener('pointercancel', cancelSwipe, { passive: true });
  } else {
    // Touch events fallback
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    function handleTouchStart(event) {
      const t = event.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      endX = startX;
      endY = startY;
    }

    function handleTouchMove(event) {
      const t = event.touches[0];
      endX = t.clientX;
      endY = t.clientY;
    }

    function handleTouchEnd() {
      const dx = endX - startX;
      const dy = endY - startY;
      const isHorizontalSwipe =
        Math.abs(dx) >= SWIPE_THRESHOLD_X &&
        Math.abs(dx) > Math.abs(dy) * HORIZONTAL_DOMINANCE_RATIO;

      if (isHorizontalSwipe) {
        if (dx < 0 && nextButton?.getAttribute('href')) {
          window.location.href = nextButton.getAttribute('href');
        } else if (dx > 0 && prevButton?.getAttribute('href')) {
          window.location.href = prevButton.getAttribute('href');
        }
      }
    }

    swipeTarget.addEventListener('touchstart', handleTouchStart, { passive: true });
    swipeTarget.addEventListener('touchmove', handleTouchMove, { passive: true });
    swipeTarget.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
  
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('pointerdown', revealHeadingOnInteraction, { passive: true });
  document.addEventListener('click', revealHeadingOnInteraction, { passive: true });

  if (prevButton && slide === '1') {
    prevButton.style.visibility = 'hidden';
    prevButton.setAttribute('aria-disabled', 'true');
  } else if (prevButton) {
    prevButton.style.visibility = 'visible';
    prevButton.setAttribute('href', `${pathNameWithoutSlide}/${Number(slide) - 1}/`);
    prevButton.removeAttribute('aria-disabled');
  }

  if (nextButton && Number(slide) < Number(length)) {
    nextButton.style.visibility = 'visible';
    nextButton.setAttribute('href', `${pathNameWithoutSlide}/${Number(slide) + 1}/`);
    nextButton.removeAttribute('aria-disabled');
  } else if (nextButton) {
    nextButton.removeAttribute('href');
    nextButton.style.visibility = 'hidden';
    nextButton.setAttribute('aria-disabled', 'true');
  }

  // Update page indicator text and accessible label
  if (pageIndicatorNumber && length) {
    pageIndicatorNumber.textContent = `${Number(slide)} / ${Number(length)}`;
  }
  if (pageIndicator && length) {
    const lang = (document.documentElement.lang || 'en').toLowerCase();
    const templates = {
      en: 'Page {{current}} of {{total}}',
      es: 'Página {{current}} de {{total}}'
    };
    const template = templates[lang] || templates.en;
    const ariaText = template
      .replace('{{current}}', String(Number(slide)))
      .replace('{{total}}', String(Number(length)));
    pageIndicator.setAttribute('aria-label', ariaText);
  }
}