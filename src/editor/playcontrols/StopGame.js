import { GameObject } from '../../scene/objects/GameObject.js';

export class StopGame extends GameObject {
  constructor() {
    super();
    this.button = this.createStopButton();
  }

  createStopButton() {
    const button = document.createElement('button');
    button.textContent = 'Stop';
    button.style.cssText = `
      background: #e74c3c;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      transition: background-color 0.2s;
    `;

    button.addEventListener('mouseover', () => {
      button.style.background = '#c0392b';
    });

    button.addEventListener('mouseout', () => {
      button.style.background = '#e74c3c';
    });

    return button;
  }

  getButton() {
    return this.button;
  }

  update() {
    // Add any update logic here if needed
  }
}