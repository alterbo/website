class CustomRadioButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: inline-block;
                line-height: 1.25rem;
            }

            .radio-button {
                position: relative;
                padding-left: 28px;
                cursor: pointer;
            }

            .radio-button__input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
            }

            .radio-button__checkmark {
                position: absolute;
                top: 2px;
                left: 0;
                height: 16px;
                width: 16px;
                background-color: #eee;
                border: 2px solid transparent;
                border-radius: 50%;
            }

            .radio-button__checkmark:after {
                content: "";
                position: absolute;
                display: none;
                top: 4px;
                left: 4px;
                width: 8px;
                height: 8px;
                background-color: #000;
                border-radius: 50%;
            }

            .radio-button__input:checked ~ .radio-button__checkmark:after {
                display: block;
            }

            .radio-button__input:focus + .radio-button__checkmark {
                border: 2px solid #000;
                outline: none;
            }
        </style>

        <label class="radio-button">
            <input class="radio-button__input" type="radio" role="radio" aria-checked="false">
            <span class="radio-button__checkmark"></span>
            <slot></slot>
        </label>
        `;

        this.input = this.shadowRoot.querySelector('.radio-button__input');
        this.input.addEventListener('change', this.handleChange.bind(this));
        this.input.addEventListener('focus', this.handleFocus.bind(this));
        this.input.addEventListener('blur', this.handleBlur.bind(this));
    }

    connectedCallback() {
        if (this.hasAttribute('checked')) {
            this.input.checked = true;
            this.input.setAttribute('aria-checked', 'true');
        }

        const name = this.getAttribute('name');
        if (name) {
            this.input.setAttribute('name', name);
        }
    }

    handleBlur() {
        this.input.setAttribute('aria-focused', 'false');
    }

    handleChange() {
        const value = this.getAttribute('value');

        const radioGroup = document.querySelectorAll(`custom-radio-button[name="${this.getAttribute('name')}"]`);
        radioGroup.forEach((radio) => {
            if (radio !== this) {
                radio.input.checked = false;
                radio.input.setAttribute('aria-checked', 'false');
            }
        });

        this.input.setAttribute('aria-checked', 'true');
    
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            detail: {
                value: value,
            },
        }));
    }

    handleFocus() {
        this.input.setAttribute('aria-focused', 'true');
    }
    
    get value() {
        return this.getAttribute('value');
    }
    
    set value(newValue) {
        this.setAttribute('value', newValue);
        this.input.value = newValue;
    }

    isChecked() {
        return this.input.checked;
    }
}

customElements.define('custom-radio-button', CustomRadioButton);
  