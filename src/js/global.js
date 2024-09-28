globalThis.params = new URLSearchParams(window.location.search);
globalThis.category = params.get('category');
globalThis.age = params.get('kids') === 'kids' ? 'kids' : 'items';
globalThis.locale= params.get('locale');
globalThis.hasParams = params.has('locale') && params.has('kids') && category;
