class CustomRadioButton extends HTMLElement {
    static observedAttributes = ['checked', 'name', 'value', 'label', 'disabled'];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                --radio-bg: var(--color-bg, #fff);
                --radio-border: var(--color-border, #252525);
                --radio-dot: var(--color-link, #1C426F);
                --radio-label: var(--color-text, #454545);
                display: inline-block;
                outline: none;
            }
            .label-text {
                color: var(--radio-label);
                user-select: none;
            }
            .radio-button {
                cursor: pointer;
                position: relative;
                padding-left: 28px;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
            }
            .radio-button__input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
                height: 16px;
                width: 16px;
                margin: 0;
            }
            .radio-button__checkmark {
                position: absolute;
                top: 5px;
                left: 0;
                height: 16px;
                width: 16px;
                background-color: var(--radio-bg);
                border: 2px solid var(--radio-border);
                border-radius: 50%;
                box-sizing: border-box;
                transition: border-color 0.2s, background 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .radio-button__checkmark-dot {
                display: none;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--radio-dot);
                transition: background 0.2s;
            }
            .radio-button__input:checked + .radio-button__checkmark .radio-button__checkmark-dot {
                display: block;
            }
            .radio-button__input:focus-visible + .radio-button__checkmark {
                border: 2px solid var(--radio-dot);
                outline: none;
            }
            :host([disabled]) {
                opacity: 0.6;
                pointer-events: none;
            }
            @media (prefers-color-scheme: dark) {
                :host {
                    --radio-bg: var(--color-bg, #454545);
                    --radio-border: var(--color-border, #fff);
                    --radio-dot: var(--color-link, #90caf9);
                    --radio-label: var(--color-text, #fff);
                }
            }
        </style>
        <label class="radio-button">
            <input class="radio-button__input" type="radio">
            <span class="radio-button__checkmark">
                <span class="radio-button__checkmark-dot"></span>
            </span>
            <span class="label-text"></span>
        </label>
        `;

        this.input = this.shadowRoot.querySelector('.radio-button__input');
        this.labelTextElement = this.shadowRoot.querySelector('.label-text');
    }

    connectedCallback() {
        this.input.addEventListener('change', this.handleChange);
        this.addEventListener('keydown', this.handleKeyDown);

        this.setAttribute('role', 'radio');
        this.syncFromAttributes();
    }

    disconnectedCallback() {
        this.input.removeEventListener('change', this.handleChange);
        this.removeEventListener('keydown', this.handleKeyDown);
    }

    attributeChangedCallback() {
        this.syncFromAttributes();
    }

    syncFromAttributes() {
        this.input.checked = this.hasAttribute('checked');
        this.input.name = this.getAttribute('name') || '';
        this.input.value = this.getAttribute('value') || '';
        this.input.disabled = this.hasAttribute('disabled');
        this.setAttribute('aria-checked', this.input.checked ? 'true' : 'false');
        this.setAttribute('aria-disabled', this.input.disabled ? 'true' : 'false');
        this.setAttribute('tabindex', this.input.checked ? '0' : '-1');
        const label = this.getAttribute('label') || '';
        this.labelTextElement.textContent = label;
        this.setAttribute('aria-label', label);
        this.input.removeAttribute('aria-checked');
        this.input.removeAttribute('aria-disabled');
        this.input.removeAttribute('aria-label');

        if (this.input.checked && this.input.name) {
            document.querySelectorAll(`custom-radio-button[name="${this.input.name}"]`).forEach(radio => {
                if (radio !== this) radio.removeAttribute('checked');
            });
        }
    }

    handleChange = () => {
        if (this.input.disabled) return;
        this.setAttribute('checked', '');
        this.setAttribute('aria-checked', 'true');
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            detail: { value: this.input.value },
        }));
    };

    handleKeyDown = (e) => {
        const keys = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Home', 'End'];
        if (!keys.includes(e.key)) return;

        const radios = Array.from(document.querySelectorAll(`custom-radio-button[name="${this.input.name}"]`));
        const idx = radios.indexOf(this);
        if (idx === -1) return;

        let nextIdx;
        if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = radios.length - 1;
        else {
            const dir = (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 1;
            nextIdx = (idx + dir + radios.length) % radios.length;
        }
        const nextRadio = radios[nextIdx];
        nextRadio.focus();
        nextRadio.setAttribute('checked', '');
        nextRadio.setAttribute('aria-checked', 'true');

        // Dispatch change event if not already checked
        if (!nextRadio.input.checked) {
            nextRadio.input.checked = true;
            nextRadio.dispatchEvent(new CustomEvent('change', {
                bubbles: true,
                detail: { value: nextRadio.input.value },
            }));
        }
    };

    focus() {
        this.input.focus();
    }
}

customElements.define('custom-radio-button', CustomRadioButton);