import { GameObject } from '../scene/objects/GameObject.js';
import { PlayControls } from './playcontrols/PlayControls.js';
import { EventEmitter } from '../utils/EventEmitter.js';

export class PlayMode extends EventEmitter {
  constructor(cameraSystem, vrSystem, scene) {
    super();
    this.cameraSystem = cameraSystem;
    this.vrSystem = vrSystem;
    this.scene = scene;
    this.mode = 'VR';
    this.playControls = new PlayControls(scene, this);
    this.container = this.createContainer();
    this.isPlaying = false;
  }

  createContainer() {
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      gap: 10px;
      align-items: center;
    `;

    container.appendChild(this.playControls.getContainer());
    this.addModeDropdown(container);

    return container;
  }

  addModeDropdown(container) {
    const select = document.createElement('select');
    select.style.cssText = `
      background: #2c3e50;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      outline: none;
    `;

    const options = ['VR', '3D'];
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      optionElement.selected = option === 'VR';
      select.appendChild(optionElement);
    });

    select.addEventListener('change', (e) => {
      this.mode = e.target.value;
    });

    this.modeSelect = select;
    container.appendChild(select);
  }

  setPlayState(isPlaying) {
    this.isPlaying = isPlaying;
    this.emit('playStateChanged', isPlaying);
  }

  getContainer() {
    return this.container;
  }

  update() {
    // Check if VR session ended externally
    if (this.mode === 'VR' && !this.vrSystem.renderer.xr.isPresenting) {
      // Handle VR session end if needed
    }
    
    // Update play controls
    this.playControls.update();
  }
}