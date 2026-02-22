const markFontsLoaded = (() => {
  let applied = false;
  return () => {
    if (!applied) {
      applied = true;
      document.documentElement.classList.add('fonts-loaded');
    }
  };
})();

if ('fonts' in document) {
  const fontSet = document.fonts;
  const descriptors = [
    '400 1rem "Instrument Sans"',
    '700 1rem "Instrument Sans"',
    '400 1rem "Playfair Display"',
  ];

  // Trigger specific weights; if all resolve, mark immediately.
  Promise.all(descriptors.map(d => fontSet.load(d)))
    .then(markFontsLoaded)
    .catch(() => { /* ignore individual load failures */ });

  // Also rely on the global readiness of all font loads initiated by layout.
  fontSet.ready.then(markFontsLoaded);
} else {
  // No Font Loading API: apply class right away.
  markFontsLoaded();
}