const menuParams = new URLSearchParams(window.location.search);
const defaultPath = new URL(location.href).pathname;
const defaultLocale = defaultPath.split('/')[1];
const defaultAge = defaultPath.split('/')[2] ?? 'items';
const menuLocale = menuParams.get('locale');
let menuButton = document.getElementById('menuButton');
if (menuParams.has('locale') && !menuParams.has('kids')) {
    menuButton?.setAttribute('href', `/${menuLocale}/items`);
} else if (menuParams.has('locale') && menuParams.has('kids')) {
    const age = menuParams.get('kids') === 'on' ? 'kids' : 'items'
    menuButton?.setAttribute('href', `/${menuLocale}/${age}`);
} else {
    menuButton?.setAttribute('href', `/${defaultLocale.length ? defaultLocale : 'en'}/${defaultAge ?? items}`);
}
