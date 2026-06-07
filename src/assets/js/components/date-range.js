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

    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    marker.setAttribute('width', '16');
    marker.setAttribute('height', '16');
    marker.setAttribute('viewBox', '0 0 16 16');
    marker.setAttribute('aria-hidden', 'true');
    marker.setAttribute('class', 'absolute -translate-x-1/2 top-1/2 -translate-y-1/2 overflow-visible');
    marker.style.left = `${(progress * 100).toFixed(2)}%`;
    const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    square.setAttribute('x', '0');
    square.setAttribute('y', '0');
    square.setAttribute('width', '16');
    square.setAttribute('height', '16');
    square.setAttribute('fill', 'var(--color-bg)');
    square.setAttribute('stroke', 'var(--color-border)');
    square.setAttribute('stroke-width', '1');
    marker.appendChild(square);

    bar.appendChild(marker);
    wrapper.appendChild(bar);
    this.replaceChildren(wrapper);
  }
}
if (!customElements.get('date-range')) customElements.define('date-range', DateRange);
export { DateRange };
