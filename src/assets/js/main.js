import './fonts/load-fonts.js';
import { parseSettingsFromUrl } from './services/path.js';

const qs = (sel) => document.querySelector(sel);

const ALLOWED = {
    locale: new Set(['en', 'es']),
    age: new Set(['items', 'kids']),
    animations: new Set(['on', 'off']),
};

const normalizeSetting = (value, allowed, fallback) => {
    const normalized = String(value || '').toLowerCase();
    return allowed.has(normalized) ? normalized : fallback;
};

window.addEventListener('DOMContentLoaded', async () => {
    const parsed = parseSettingsFromUrl();
    const locale = normalizeSetting(parsed.locale, ALLOWED.locale, 'en');
    const age = normalizeSetting(parsed.age, ALLOWED.age, 'items');
    const animations = normalizeSetting(parsed.animations, ALLOWED.animations, 'on');

    const html = document.documentElement;
    if (html) {
        html.lang = locale;
        html.setAttribute('data-age', age);
        html.setAttribute('data-animations', animations);
    }

    if (animations === 'off') {
        document.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const a = target.closest('a[href]');
            if (!a) return;

            const href = a.getAttribute('href');
            if (!href) return;

            try {
                const url = new URL(href, window.location.href);
                if (url.origin !== window.location.origin) return;
                if (url.searchParams.get('animations') === 'off') return;
                url.searchParams.set('animations', 'off');
                a.setAttribute('href', url.pathname + url.search + url.hash);
            } catch {
                // Ignore malformed URLs; keep existing href
            }
        });
    }

    const needsSettingsUI = Boolean(
        qs('custom-radio-button[category="locale"]') ||
        qs('#custom-checkbox') ||
        qs('#custom-checkbox-animations')
    );
    if (needsSettingsUI) {
        await Promise.all([
            import('./custom-radio-button.js'),
            import('./custom-checkbox.js'),
        ]);

        const mod = await import('./settings.js');
        mod.initSettings();
    }

    if (qs('date-range')) {
        await import('./components/date-range.js');
    }

    const hasSceneViewer = Boolean(qs('scene-viewer'));
    if (hasSceneViewer) {
        await import('./scene-viewer.js');
    }
    if (document.getElementById('controls')) {
        const mod = await import('./scene-slider.js');
        mod.initSceneSlider();
    }

    if (animations !== 'off' && document.getElementById('bannerMoustache')) {
        const mod = await import('./banner.js');
        void mod.initBannerMoustache();
    }
});