// custom-checkbox.js

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

        .custom-checkbox input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
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

        .custom-checkbox input:checked ~ .checkbox-checkmark:after {
          display: block;
        }
      </style>
      
      <label class="custom-checkbox">
        <span class="checkbox-container">
          <input type="checkbox">
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
    this.addEventListener("click", () => {
      this.checkboxElement.checked = !this.checkboxElement.checked;
      this.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  static get observedAttributes() {
    return ["label"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "label") {
      this.labelElement.textContent = newValue;
    }
  }

  get label() {
    return this.getAttribute("label") || "";
  }

  set label(value) {
    this.setAttribute("label", value);
  }

  get checked() {
    return this.checkboxElement.checked;
  }

  set checked(value) {
    this.checkboxElement.checked = value;
  }
}

window.customElements.define("custom-checkbox", CustomCheckbox);
