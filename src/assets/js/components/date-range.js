class DateRange extends HTMLElement {
  connectedCallback() {
    if (this._init) return; this._init = true;
    const dateStr = this.dataset.date || '';
    const locale = this.dataset.locale === 'es' ? 'es-ES' : 'en-GB';
    const title = this.dataset.title || '';
    let date = new Date(dateStr);
    if (isNaN(date)) {
      this.textContent = '';
      return;
    }
    const year = date.getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const progress = (date - start) / (end - start);
    const human = date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });

    // Build structure using Tailwind utility classes only.
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-3';

    const yearLabel = document.createElement('span');
    yearLabel.textContent = year;
    wrapper.appendChild(yearLabel);

    const bar = document.createElement('div');
    bar.className = 'border-b relative w-full';
    bar.setAttribute('role', 'img');
    bar.setAttribute('aria-label', `${title} created on ${human}`);

    const marker = document.createElement('span');
    marker.className = 'absolute bg-white top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ring ring-black dark:ring-slate-800';
    marker.style.left = `${(progress * 100).toFixed(2)}%`;
    marker.setAttribute('aria-hidden', 'true');

    bar.appendChild(marker);
    wrapper.appendChild(bar);
    this.replaceChildren(wrapper);
  }
}
if (!customElements.get('date-range')) customElements.define('date-range', DateRange);
export { DateRange };
