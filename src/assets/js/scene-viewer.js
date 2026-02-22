class SceneViewer extends HTMLElement {
    constructor() {
      super();
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          :host {
            display: block;
            height: 100%;
            z-index: auto;
          }
          #sceneViewer {
            display: grid;
            height: 100%;
            justify-items: center;
            align-items: end;
            overflow: hidden;
            position: relative;
          }
        </style>
        
        <div id="sceneViewer">
            <slot></slot>
        </div>
      `;
      
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
      this.decorateSlotted = this.decorateSlotted.bind(this);
    }

    decorateSlotted() {
      const slot = this.shadowRoot.querySelector('slot');
      const slottedElements = slot.assignedElements();
      const multi = slottedElements.length > 1;
      slottedElements.forEach((el, index) => {
        if (el.tagName.toLowerCase() === 'svg' && multi) {
          el.classList.toggle('background', index === 0);
          el.classList.toggle('foreground', index !== 0);
        }
      });
    }

    connectedCallback() {
      const slot = this.shadowRoot.querySelector('slot');
      this.decorateSlotted();
      slot.addEventListener('slotchange', this.decorateSlotted);
    }

    disconnectedCallback() {
      const slot = this.shadowRoot?.querySelector('slot');
      slot?.removeEventListener('slotchange', this.decorateSlotted);
    }

  }
  
  customElements.define('scene-viewer', SceneViewer);