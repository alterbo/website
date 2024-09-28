if (globalThis.hasParams) {
    const settingsPath = `/?locale=${globalThis.locale}&kids=${globalThis.age}&category=${globalThis.category}`;
    const homeButton = document.getElementById('homeButton');
    homeButton?.setAttribute('href', settingsPath);
}
