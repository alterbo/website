function sequenceParams () {
    const startButton = document.getElementById('start-button');
    const params = `locale=${ globalThis.locale ?? 'en' }&kids=${ globalThis.age ?? 'items' }&category=${ globalThis.category ?? 'all' }`;
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

sequenceParams();



function sequenceParams() {
    const startButton = document.getElementById('start-button');
    if (!startButton) return;

    const locale = globalThis.locale ?? 'en';
    const age = globalThis.age ?? 'items';
    const category = globalThis.category ?? 'all';
    const hasValidParams = globalThis.hasParams;

    const searchParams = new URLSearchParams({
        locale,
        kids: age,
        category,
    }).toString();

    const href = hasValidParams ? `./1/?${searchParams}` : './1';
    startButton.setAttribute('href', href);
}

document.addEventListener("DOMContentLoaded", sequenceParams);