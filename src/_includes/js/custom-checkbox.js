class CustomCheckbox extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        .custom-checkbox {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }

        .custom-checkbox .checkbox-container {
          position: relative;
          display: inline-block;
          width: 20px;
          height: 20px;
        }

        .custom-checkbox .checkbox-label {
          font-size: 16px;
          margin-left: 8px;
        }

        .custom-checkbox .checkbox-checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          border: 2px solid #ccc;
          border-radius: 4px;
        }

        .custom-checkbox .checkbox-checkmark:after {
          content: "";
          position: absolute;
          display: none;
          left: 7px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid #333;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .custom-checkbox input[type="checkbox"] {
          position: absolute;
          left: -9999px;
        }

        .custom-checkbox input[type="checkbox"]:checked + .checkbox-container .checkbox-checkmark:after {
          display: block;
        }

        .custom-checkbox input:focus + .checkbox-container .checkbox-checkmark {
          border: 2px solid #000;
          outline: none;
        }
      </style>
      
      <label class="custom-checkbox">
        <input type="checkbox">
        <span class="checkbox-container">
          <span class="checkbox-checkmark"></span>
        </span>
        <span class="checkbox-label"></span>
      </label>
    `;
    
    this.attachShadow({ mode: "open" }).appendChild(template.content.cloneNode(true));
    this.labelElement = this.shadowRoot.querySelector(".checkbox-label");
    this.checkboxElement = this.shadowRoot.querySelector("input[type='checkbox']");
}

  connectedCallback() {
    if (this.hasAttribute('checked')) {
      this.checkboxElement.checked = true;
    }

    if (this.hasAttribute('label')) {
      this.labelElement.textContent = this.getAttribute('label');
    }

    if (this.hasAttribute('name')) {
      this.checkboxElement.setAttribute('name', this.getAttribute('name'));
    }

    this.checkboxElement.addEventListener('change', () => {
      this.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  static get observedAttributes() {
    return ['label', 'name', 'checked'];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'label') {
      this.labelElement.textContent = newValue;
    } else if (name === 'name') {
      this.checkboxElement.setAttribute('name', newValue);
    } else if (name === "checked") {
      this.checkboxElement.checked = newValue !== null;
    }
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  set label(value) {
    this.setAttribute('label', value);
  }

  get checked() {
    return this.checkboxElement.checked;
  }

  set checked(value) {
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(value) {
    this.setAttribute('name', value);
  }
}

window.customElements.define('custom-checkbox', CustomCheckbox);
