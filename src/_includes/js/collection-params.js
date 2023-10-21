const collectionHandlers = document.querySelectorAll('[params-handler]');

collectionHandlers.forEach(
    handler => {
        const pathName = new URL(location.href).pathname.split('/');
        const age = pathName[2];
        const href = handler.getAttribute('params-handler');
        const locale = pathName[1];
        if (age === 'kids') {
            handler.setAttribute('href', `${href}?locale=${locale}&kids=on` );
        } else {
            handler.setAttribute('href', `${href}?locale=${locale}` );
        }
    }
);
