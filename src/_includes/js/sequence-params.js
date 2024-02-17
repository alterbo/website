function sequenceParams () {
    const sceneParams = new URLSearchParams(window.location.search);
    const categoryParams = sceneParams.get('category');
    const defaultAge = sceneParams.get('kids');
    const sceneLocale = sceneParams.get('locale');
    const hasParams = sceneLocale?.length > 0 && defaultAge?.length > 0 && categoryParams?.length > 0;
    const startButton = document.getElementById('start-button');
    const params = `locale=${ sceneLocale ?? 'en' }&kids=${ defaultAge ?? 'off' }&category=${ categoryParams ?? 'all' }`;
    const searchParams = new URLSearchParams(params).toString();
    if (hasParams) {
        startButton?.setAttribute('href', `./1/?${ searchParams }`);
    } else {
        startButton?.setAttribute('href', './1');
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sequenceParams);
} else {
    sequenceParams();
}
