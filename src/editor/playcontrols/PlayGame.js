import { GameObject } from '../../scene/objects/GameObject.js';

export class PlayGame extends GameObject {
  constructor() {
    super();
    this.button = this.createPlayButton();
    this.pressCallback = null;
  }

  createPlayButton() {
    const button = document.createElement('button');
    button.textContent = 'Play';
    button.style.cssText = `
      background: #2ecc71;
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
      button.style.background = '#27ae60';
    });

    button.addEventListener('mouseout', () => {
      button.style.background = '#2ecc71';
    });

    button.addEventListener('click', () => {
      if (this.pressCallback) {
        this.pressCallback();
      }
    });

    return button;
  }

  onPress(callback) {
    this.pressCallback = callback;
  }

  getButton() {
    return this.button;
  }

  update() {
    // Add any update logic here if needed
  }
}