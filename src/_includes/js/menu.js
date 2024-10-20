document.addEventListener('DOMContentLoaded', () => {
    let menuButton = document.getElementById('menuButton');
    if (globalThis.hasParams) {
        menuButton?.setAttribute('href', `/${globalThis.locale ?? 'en'}/${globalThis.age ?? 'items'}/${globalThis.category ?? 'all'}/?locale=${globalThis.locale ?? 'en'}&kids=${globalThis.age ?? 'items'}&category=${globalThis.category ?? 'all'}`);
    } else {
        menuButton?.setAttribute('href', '/en/items/all/?locale=en&kids=items&category=all');
    }
});