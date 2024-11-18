import * as THREE from 'three';
import { GameObject } from '../../scene/objects/GameObject.js';
import { PlayerStart } from '../../scene/objects/actors/PlayerStart.js';
import { EventEmitter } from '../../utils/EventEmitter.js';

export class ActorSpawner extends EventEmitter {
  constructor(scene, cameraSystem) {
    super();
    this.scene = scene;
    this.cameraSystem = cameraSystem;
    this.actorClasses = {
      'PlayerStart': PlayerStart
    };
    this.storageKey = 'editorActors';
  }

  createContainer() {
    const container = document.createElement('div');
    container.style.cssText = `
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    `;

    const title = document.createElement('h4');
    title.textContent = 'Add Actor';
    title.style.margin = '0 0 10px 0';
    container.appendChild(title);

    // Create actor type selector
    const select = document.createElement('select');
    select.style.cssText = `
      background: #2c3e50;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      margin-right: 10px;
      cursor: pointer;
    `;

    Object.keys(this.actorClasses).forEach(actorType => {
      const option = document.createElement('option');
      option.value = actorType;
      option.textContent = actorType;
      select.appendChild(option);
    });

    // Create spawn button
    const button = document.createElement('button');
    button.textContent = 'Spawn Actor';
    button.style.cssText = `
      background: #2ecc71;
      color: white;
      border: none;
      padding: 5px 15px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    `;

    button.addEventListener('click', () => {
      const selectedType = select.value;
      this.spawnActor(selectedType);
    });

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.flexDirection = 'column';
    controls.appendChild(select);
    controls.appendChild(button);

    container.appendChild(controls);
    return container;
  }

  spawnActor(actorType, savedData = null) {
    const ActorClass = this.actorClasses[actorType];
    if (ActorClass) {
      const actor = new ActorClass();
      
      if (savedData) {
        // Restore saved transform data
        actor.position.copy(savedData.position);
        actor.rotation.copy(savedData.rotation);
        actor.scale.copy(savedData.scale);
        if (savedData.name) {
          actor.setName(savedData.name);
        }
      } else {
        // Position in front of camera
        const cameraDirection = this.cameraSystem.get().getWorldDirection(actor.position);
        actor.position.multiplyScalar(5); // 5 units in front of camera
        actor.position.add(this.cameraSystem.get().position);
      }
      
      // Add to scene
      this.scene.get().add(actor.getMesh());
      
      // Store actor reference for transform controls
      actor.getMesh().userData.actor = actor;
      actor.getMesh().userData.isEditorSpawned = true;
      
      // Save to localStorage
      this.saveActors();
      
      // Attach transform controls
      if (this.scene.editor) {
        this.scene.editor.attachTransformControls(actor.getMesh());
      }

      // Emit actor spawned event
      this.emit('actorSpawned', actor);

      return actor;
    }
    return null;
  }

  saveActors() {
    const actors = [];
    this.scene.get().traverse((object) => {
      if (object.userData.isEditorSpawned && object.userData.actor) {
        const actor = object.userData.actor;
        actors.push({
          type: actor.constructor.name,
          position: actor.position.toArray(),
          rotation: actor.rotation.toArray(),
          scale: actor.scale.toArray(),
          name: actor.name
        });
      }
    });
    localStorage.setItem(this.storageKey, JSON.stringify(actors));
    this.emit('actorsUpdated');
  }

  loadActors() {
    const savedActors = localStorage.getItem(this.storageKey);
    if (savedActors) {
      const actors = JSON.parse(savedActors);
      actors.forEach(actorData => {
        this.spawnActor(actorData.type, {
          position: new THREE.Vector3().fromArray(actorData.position),
          rotation: new THREE.Euler().fromArray(actorData.rotation),
          scale: new THREE.Vector3().fromArray(actorData.scale),
          name: actorData.name
        });
      });
    }
    this.emit('actorsUpdated');
  }

  getContainer() {
    return this.createContainer();
  }

  update() {
    // Add any update logic here if needed
  }
}