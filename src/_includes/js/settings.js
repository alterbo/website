document.addEventListener('DOMContentLoaded', function () {
    const categoryTranslations = {
        'all': { 'en': 'All', 'es': 'Todos' },
        'comic': { 'en': 'Comic', 'es': 'Comic' },
        'game': { 'en': 'Game', 'es': 'Juego' },
        'poetry': { 'en': 'Poetry', 'es': 'Poesía' },
        'tale': { 'en': 'Tale', 'es': 'Cuento' },
    };
    const localeTranslations = {
        'en': 'En',
        'es': 'Es',
    };

    const pathName = new URL(location.href).pathname.split('/');
    let age = pathName[2] ?? 'items';
    let locale = pathName[1] ?? 'en';
    let category = pathName[3] ?? 'all';
    const categoryButtons = document.querySelectorAll('custom-radio-button[category=category]');

    categoryButtons.forEach((radioButton) => {
        radioButton.addEventListener('change', (event) => {
            category = event.detail.value;
            updateFormAction();
        });
    });

    const updateFormAction = () => {
        const settingsForm = document.getElementById('settingsForm');
        settingsForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const navURL = `/${locale}/${age}/${category}/?locale=${locale}&kids=${age}&category=${category}`;
            window.location.href = navURL;
        });
    }

    const updateCategoryLabels = () => {
        document.querySelectorAll('custom-radio-button[category=category]').forEach((catRadioButton) => {
            const catValue = catRadioButton.getAttribute('value');
            const translatedName = categoryTranslations[catValue] ? categoryTranslations[catValue][locale] : catValue;
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
            updateCategoryLabels();
            updateFormAction();
        });
    });

    const checkbox = document.getElementById('custom-checkbox');
    checkbox.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        age = isChecked ? 'kids' : 'items';
        updateFormAction();
    });

    checkbox.checked = age === 'kids';
    updateCategoryLabels();
    updateLocaleLabels();
    updateFormAction();
});
