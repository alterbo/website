export function initCollectionParams({ locale, age }) {
  const collectionHandlers = document.querySelectorAll('[params-handler]');
  collectionHandlers.forEach(handler => {
    const href = handler.getAttribute('params-handler');
    let newHref = `${href}?locale=${locale}&kids=${age}`;
    handler.setAttribute('href', newHref);
  });
}