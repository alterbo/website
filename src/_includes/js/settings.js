const pathName = new URL(location.href).pathname.split('/');
let age = pathName[2] ? pathName[2] : 'items';
let locale = pathName[1] ? pathName[1] : 'en';
const radioButtons = document.querySelectorAll('custom-radio-button');
radioButtons.forEach((radioButton) => {
    radioButton.addEventListener('change', (event) => {
        locale = event.detail.value;
    });
});
const checkbox = document.getElementById('custom-checkbox');
checkbox.addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    age = isChecked ? 'kids' : 'items';
});
checkbox.checked = age === 'kids';
const settingsForm = document.getElementById('settingsForm');
settingsForm?.addEventListener('change', _e => {
    settingsForm.setAttribute('action', `/${locale}/${age}`);
});
