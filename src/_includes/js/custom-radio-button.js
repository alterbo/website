class CustomRadioButton extends HTMLElement {
    static observedAttributes = ['checked'];
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: inline-block;
                line-height: 1.25rem;
            }

            .label-text {
                color: #232323;
            }

            .radio-button {
                cursor: pointer;
                position: relative;
                padding-left: 28px;
                white-space: nowrap;
            }

            .radio-button__input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
            }

            .radio-button__checkmark {
                position: absolute;
                top: 0;
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
            @media (prefers-color-scheme: dark) {
                .label-text {
                    color: #ededed;
                }
                .radio-button__checkmark {
                    background-color: #595959;
                }
                .radio-button__checkmark:after {
                    background-color: #ededed;
                }
                .radio-button__input:focus + .radio-button__checkmark {
                    border-color: #ededed;

                }
            }
        </style>

        <label class="radio-button">
            <input class="radio-button__input" type="radio" role="radio" aria-checked="false">
            <span class="radio-button__checkmark"></span>
            <span class="label-text"></span>
        </label>
        `;

        this.input = this.shadowRoot.querySelector('.radio-button__input');
        this.labelTextElement = this.shadowRoot.querySelector('.label-text');
        this.input.addEventListener('change', this.handleChange.bind(this));
        this.input.addEventListener('focus', this.handleFocus.bind(this));
        this.input.addEventListener('blur', this.handleBlur.bind(this));
    } 

    connectedCallback() {
        if (this.hasAttribute('checked')) {
            this.input.checked = true;
            this.input.setAttribute('aria-checked', 'true');
        }

        this.updateLabel();
    }

    attributeChangedCallback(name, _oldValue, newValue) {
        if (name === 'checked') {
            this.input.checked = newValue !== null;
            this.input.setAttribute('aria-checked', newValue !== null ? 'true' : 'false');
        } else if (name === 'name') {
            this.input.setAttribute('name', newValue);
        } else if (name === 'value') {
            this.input.value = newValue;
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

    setLabel(text) {
        this.labelText = text;
        this.updateLabel();
    }

    updateLabel() {
        if (this.labelTextElement && this.labelText) {
            this.labelTextElement.textContent = this.labelText;
        }
    }
}

customElements.define('custom-radio-button', CustomRadioButton);
  