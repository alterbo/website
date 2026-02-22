import { parseSettingsFromUrl, buildUrl, DEFAULTS } from './services/path.js';

export function initSettings() {
  let settings = parseSettingsFromUrl();

  const localeRadios = document.querySelectorAll('custom-radio-button[category=locale]');
  const ageCheckbox = document.getElementById('custom-checkbox');
  const animationsCheckbox = document.getElementById('custom-checkbox-animations');

  function updateLocaleRadios(selectedLocale) {
    localeRadios.forEach(radio => {
      const value = radio.getAttribute('value');
      if (value === selectedLocale) {
        radio.setAttribute('checked', '');
      } else {
        radio.removeAttribute('checked');
      }
    });
  }

  updateLocaleRadios(settings.locale);

  if (ageCheckbox) ageCheckbox.checked = settings.age === 'kids';
  if (animationsCheckbox) animationsCheckbox.checked = settings.animations === 'on';

  const go = (next) => {
    const url = buildUrl({
      locale: next.locale ?? DEFAULTS.locale,
      age: next.age ?? DEFAULTS.age,
      animations: next.animations ?? DEFAULTS.animations,
    });
    if (url !== window.location.pathname + window.location.search) {
      window.location.assign(url);
    }
  };

  // Locale change
  localeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const value = e.detail?.value || radio.getAttribute('value');
      if (!value || value === settings.locale) return;
      go({ ...settings, locale: value, age: ageCheckbox?.checked ? 'kids' : 'items', animations: animationsCheckbox?.checked ? 'on' : 'off' });
    });
  });

  // Age change
  ageCheckbox?.addEventListener('change', (e) => {
    const nextAge = e.target.checked ? 'kids' : 'items';
    if (nextAge === settings.age) return;
    go({ ...settings, age: nextAge });
  });

  // Animations change
  animationsCheckbox?.addEventListener('change', (e) => {
    const nextAnim = e.target.checked ? 'on' : 'off';
    if (nextAnim === settings.animations) return;
    go({ ...settings, animations: nextAnim });
  });
}