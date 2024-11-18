import { GameObject } from '../../scene/objects/GameObject.js';
import { EventEmitter } from '../../utils/EventEmitter.js';
import * as THREE from 'three';

export class ActorProperties extends EventEmitter {
  constructor() {
    super();
    this.container = this.createContainer();
    this.currentActor = null;
  }

  createContainer() {
    const container = document.createElement('div');
    container.style.cssText = `
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      padding: 5px;
    `;
    return container;
  }

  showProperties(actor) {
    this.currentActor = actor;
    this.container.innerHTML = '';

    if (!actor) return;

    // Transform properties
    this.addVectorProperty('Position', actor.position);
    this.addEulerProperty('Rotation', actor.rotation);
    this.addVectorProperty('Scale', actor.scale);

    // Actor-specific properties
    if (actor.isPlayerStart) {
      this.addTextField('Name', actor, 'name');
      this.addColorPicker('Color', actor.mesh.children[0].material);
    }
  }

  addVectorProperty(label, vector) {
    const group = document.createElement('div');
    group.style.marginBottom = '10px';

    const title = document.createElement('div');
    title.textContent = label;
    title.style.marginBottom = '5px';
    group.appendChild(title);

    ['x', 'y', 'z'].forEach(axis => {
      const input = document.createElement('input');
      input.type = 'number';
      input.step = '0.1';
      input.value = vector[axis];
      input.style.cssText = `
        background: #2c3e50;
        color: white;
        border: none;
        padding: 3px;
        border-radius: 2px;
        width: 60px;
        margin-right: 5px;
      `;

      input.addEventListener('change', () => {
        vector[axis] = parseFloat(input.value);
        this.emit('propertyChanged', {
          actor: this.currentActor,
          property: `${label.toLowerCase()}.${axis}`,
          value: parseFloat(input.value)
        });
      });

      const container = document.createElement('div');
      container.style.marginBottom = '2px';
      container.appendChild(document.createTextNode(`${axis}: `));
      container.appendChild(input);
      group.appendChild(container);
    });

    this.container.appendChild(group);
  }

  addEulerProperty(label, euler) {
    const group = document.createElement('div');
    group.style.marginBottom = '10px';

    const title = document.createElement('div');
    title.textContent = label;
    title.style.marginBottom = '5px';
    group.appendChild(title);

    ['x', 'y', 'z'].forEach(axis => {
      const input = document.createElement('input');
      input.type = 'number';
      input.step = '0.1';
      input.value = THREE.MathUtils.radToDeg(euler[axis]);
      input.style.cssText = `
        background: #2c3e50;
        color: white;
        border: none;
        padding: 3px;
        border-radius: 2px;
        width: 60px;
        margin-right: 5px;
      `;

      input.addEventListener('change', () => {
        euler[axis] = THREE.MathUtils.degToRad(parseFloat(input.value));
        this.emit('propertyChanged', {
          actor: this.currentActor,
          property: `${label.toLowerCase()}.${axis}`,
          value: THREE.MathUtils.degToRad(parseFloat(input.value))
        });
      });

      const container = document.createElement('div');
      container.style.marginBottom = '2px';
      container.appendChild(document.createTextNode(`${axis}: `));
      container.appendChild(input);
      group.appendChild(container);
    });

    this.container.appendChild(group);
  }

  addTextField(label, object, property) {
    const group = document.createElement('div');
    group.style.marginBottom = '10px';

    const title = document.createElement('div');
    title.textContent = label;
    title.style.marginBottom = '5px';
    group.appendChild(title);

    const input = document.createElement('input');
    input.type = 'text';
    input.value = object[property] || '';
    input.style.cssText = `
      background: #2c3e50;
      color: white;
      border: none;
      padding: 3px;
      border-radius: 2px;
      width: 100%;
    `;

    input.addEventListener('change', () => {
      object[property] = input.value;
      this.emit('propertyChanged', {
        actor: this.currentActor,
        property: property,
        value: input.value
      });
    });

    group.appendChild(input);
    this.container.appendChild(group);
  }

  addColorPicker(label, material) {
    const group = document.createElement('div');
    group.style.marginBottom = '10px';

    const title = document.createElement('div');
    title.textContent = label;
    title.style.marginBottom = '5px';
    group.appendChild(title);

    const input = document.createElement('input');
    input.type = 'color';
    input.value = '#' + material.color.getHexString();
    input.style.cssText = `
      width: 100%;
      height: 30px;
      padding: 0;
      border: none;
      border-radius: 2px;
    `;

    input.addEventListener('change', () => {
      material.color.set(input.value);
      this.emit('propertyChanged', {
        actor: this.currentActor,
        property: 'color',
        value: input.value
      });
    });

    group.appendChild(input);
    this.container.appendChild(group);
  }

  updateTransformValues(actor) {
    if (actor === this.currentActor) {
      this.showProperties(actor);
    }
  }

  clearProperties() {
    this.currentActor = null;
    this.container.innerHTML = '';
  }

  getContainer() {
    return this.container;
  }

  update() {
    // Add any update logic here if needed
  }
}