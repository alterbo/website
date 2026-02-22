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
    }
  
    connectedCallback() {
      const slot = this.shadowRoot.querySelector('slot');
      const slottedElements = slot.assignedElements();
      slottedElements.forEach((el, index) => {
          if (el.tagName.toLowerCase() === 'svg' && slottedElements.length > 1) {
              el.classList.add(index === 0 ? 'background' : 'foreground');
          }
      });
    }

  }
  
  customElements.define('scene-viewer', SceneViewer);