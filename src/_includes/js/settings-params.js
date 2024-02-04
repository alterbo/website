const homeParams = new URLSearchParams(window.location.search);
if (homeParams) {
    const ageHomeParams = homeParams.get('kids') ;
    const categoryHomeParams = homeParams.get('category') ;
    const localeHomeParams = homeParams.get('locale') ;
    const settingsAgePathName = new URL(location.href).pathname.split('/')[2];
    const settingsLocalePathName = new URL(location.href).pathname.split('/')[1];
    const settingsLocale = homeParams.has('locale') ? localeHomeParams : settingsLocalePathName;
    const settingsAge = homeParams.has('kids') ? ageHomeParams : settingsAgePathName;
    const settingsCategory = homeParams.has('category') ? categoryHomeParams : 'all';
    const setAge = settingsAge === 'on' ? 'on' : 'off'; 
    const settingsPath = `/?locale=${settingsLocale}&kids=${setAge}&category=${settingsCategory}`;
    const homeButton = document.getElementById('homeButton');
    homeButton?.setAttribute('href', settingsPath);
}
