const menuParams = new URLSearchParams(window.location.search);
const categoryParams = menuParams.get('category');
const defaultAge = menuParams.get('kids');
const defaultPath = new URL(location.href).pathname;
const defaultLocale = defaultPath.split('/')[1];
const age = menuParams.get('kids') === 'on' ? 'kids' : 'items';
const menuLocale = menuParams.get('locale');
const hasParams = menuParams.has('locale') && menuParams.has('kids') && categoryParams;
let menuButton = document.getElementById('menuButton');
if (hasParams) {
    menuButton?.setAttribute('href', `/${ menuLocale ?? 'en' }/${ age ?? 'items' }/${ categoryParams ?? 'all' }/?locale=${ menuLocale ?? 'en' }&kids=${ defaultAge ?? 'off' }&category=${ categoryParams ?? 'all' }`);
} else {
    menuButton?.setAttribute('href', '/en/items/all/?locale=en&kids=off&category=all');
}
