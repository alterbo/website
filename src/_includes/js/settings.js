document.addEventListener('DOMContentLoaded', function () {
    const categoryTranslations = {
        'all': { 'en': 'All', 'es': 'Todos' },
        'app': { 'en': 'App', 'es': 'App' },
        'comic': { 'en': 'Comic', 'es': 'Comic' },
        'poetry': { 'en': 'Poetry', 'es': 'Poesía' },
        'tale': { 'en': 'Tale', 'es': 'Cuento' },
    };
    const localeTranslations = {
        'en': 'En',
        'es': 'Es',
    };

    let age = globalThis.age ?? 'items';
    let locale = globalThis.defaultLocale ?? 'en';
    let category = globalThis.categoryParams ?? 'all';

    const categoryButtons = document.querySelectorAll('custom-radio-button[category=category]');

    categoryButtons.forEach((radioButton) => {
        radioButton.addEventListener('change', (event) => {
            category = event.detail.value;
            globalThis.category = category;
            updateFormAction();
        });
    });

    const updateFormAction = () => {
        const settingsForm = document.getElementById('settingsForm');
        settingsForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const navURL = `/${globalThis.locale}/${globalThis.age}/${globalThis.category}/?locale=${globalThis.locale}&kids=${globalThis.age}&category=${globalThis.category}`;
            window.location.href = navURL;
        });
    }

    const updateCategoryLabels = () => {
        document.querySelectorAll('custom-radio-button[category=category]').forEach((catRadioButton) => {
            const catValue = catRadioButton.getAttribute('value');
            const translatedName = categoryTranslations[catValue] ? categoryTranslations[catValue][globalThis.locale] : catValue;
            catRadioButton.setLabel(translatedName);
        });
    }

    const updateLocaleLabels = () => {
        document.querySelectorAll('custom-radio-button[category=locale]').forEach((localeRadioButton) => {
            const localeValue = localeRadioButton.getAttribute('value');
            const translatedName = localeTranslations[localeValue] ? localeTranslations[localeValue] : localeValue;
            localeRadioButton.setLabel(translatedName);
        });
    }

    document.querySelectorAll('custom-radio-button[category=locale]').forEach((radioButton) => {
        radioButton.addEventListener('change', (event) => {
            locale = event.detail.value;
            globalThis.locale = locale;
            updateCategoryLabels();
            updateFormAction();
        });
    });

    const checkbox = document.getElementById('custom-checkbox');
    checkbox.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        age = isChecked ? 'kids' : 'items';
        globalThis.age = age;
        updateFormAction();
    });

    checkbox.checked = age === 'kids';
    updateCategoryLabels();
    updateLocaleLabels();
    updateFormAction();
});
