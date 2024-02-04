const collectionHandlers = document.querySelectorAll('[params-handler]');

collectionHandlers.forEach(
    handler => {
        const pathName = new URL(location.href).pathname.split('/');
        const age = pathName[2];
        const category = pathName[3];
        const href = handler.getAttribute('params-handler');
        const locale = pathName[1];

        let newHref = `${href}?locale=${locale}&kids=${age === 'kids' ? 'on' : 'off'}&category=${category}`;

        handler.setAttribute('href', newHref);
    }
);
