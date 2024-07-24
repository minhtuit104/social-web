// icon-component.js
class IconComponent extends HTMLElement {
    connectedCallback() {
        const name = this.getAttribute('name');
        const className = this.getAttribute('class');
        this.innerHTML = `<img src="../../assets/image/icons/${name}.svg" class="icon ${className}" alt="${name} icon">`;
    }
}

customElements.define('mt-icon', IconComponent);
