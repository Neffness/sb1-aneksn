import { GameObject } from '../../scene/objects/GameObject.js';

export class Settings extends GameObject {
  constructor() {
    super();
    this.container = this.createContainer();
  }

  createContainer() {
    const container = document.createElement('div');
    container.style.cssText = `
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    `;

    const title = document.createElement('h4');
    title.textContent = 'Settings';
    title.style.margin = '0 0 10px 0';
    container.appendChild(title);

    return container;
  }

  getContainer() {
    return this.container;
  }

  createSettingRow(label, element) {
    const row = document.createElement('div');
    row.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    `;

    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.style.marginRight = '10px';

    row.appendChild(labelElement);
    row.appendChild(element);

    return row;
  }

  update() {
    // Base update method
  }
}