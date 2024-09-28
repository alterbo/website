const collectionHandlers = document.querySelectorAll('[params-handler]');

collectionHandlers.forEach(
    handler => {
        const href = handler.getAttribute('params-handler');
        let newHref = `${href}?locale=${globalThis.locale}&kids=${globalThis.age}&category=${globalThis.category}`;
        handler.setAttribute('href', newHref);
    }
);