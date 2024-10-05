document.addEventListener('DOMContentLoaded', function () {

    const toggleButton = document.getElementById('toggleButton');
    const vector = document.getElementById('svgContainer');
    const svgButtonIcon = document.getElementById('svgIcon');

    toggleButton.addEventListener('click', function () {
      if (!vector.classList.contains('animate')) {
        vector.classList.add('animate', 'playing');
      } else {
        vector.classList.toggle('playing');
      }
      svgButtonIcon.classList.toggle('rotate');
      const isPressed = toggleButton.getAttribute('aria-pressed') === 'true';
      toggleButton.setAttribute('aria-pressed', !isPressed);
    });
  });
