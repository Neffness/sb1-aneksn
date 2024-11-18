import { GameObject } from '../scene/objects/GameObject.js';
import { PlayMode } from './PlayMode.js';
import { GameSettings } from './settings/GameSettings.js';
import { SceneHierarchy } from './hierarchy/SceneHierarchy.js';
import { ActorSpawner } from './spawner/ActorSpawner.js';
import { ActorProperties } from './properties/ActorProperties.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import * as THREE from 'three';

export class EditorPanel extends GameObject {
  constructor(scene, cameraSystem, vrSystem) {
    super();
    this.scene = scene;
    this.cameraSystem = cameraSystem;
    this.playMode = new PlayMode(cameraSystem, vrSystem, scene);
    this.gameSettings = new GameSettings(scene);
    this.sceneHierarchy = new SceneHierarchy(scene);
    this.actorSpawner = new ActorSpawner(scene, cameraSystem);
    this.actorProperties = new ActorProperties();
    this.transformControls = null;
    
    // Set editor reference in scene
    this.scene.editor = this;
    
    this.setupTransformControls();
    this.setupEventListeners();
    this.createPanel();
    
    // Load initial editor state
    this.loadEditorState();
  }

  setupTransformControls() {
    const domElement = this.playMode.vrSystem.renderer.domElement;
    this.transformControls = new TransformControls(this.cameraSystem.get(), domElement);
    this.transformControls.addEventListener('dragging-changed', (event) => {
      this.cameraSystem.editorControls.enabled = !event.value;
    });
    this.transformControls.addEventListener('objectChange', () => {
      if (this.transformControls.object) {
        const actor = this.transformControls.object.userData.actor;
        if (actor) {
          actor.position.copy(this.transformControls.object.position);
          actor.rotation.copy(this.transformControls.object.rotation);
          actor.scale.copy(this.transformControls.object.scale);
          this.actorProperties.updateTransformValues(actor);
          this.saveEditorState();
        }
      }
    });
    this.scene.get().add(this.transformControls);
  }

  setupEventListeners() {
    this.sceneHierarchy.on('actorSelected', (actor) => {
      this.actorProperties.showProperties(actor);
      if (actor) {
        this.attachTransformControls(actor.getMesh());
      } else {
        this.detachTransformControls();
      }
    });

    this.sceneHierarchy.on('actorDeleted', () => {
      this.saveEditorState();
    });

    this.actorSpawner.on('actorSpawned', () => {
      this.sceneHierarchy.refresh();
      this.saveEditorState();
    });

    this.actorProperties.on('propertyChanged', () => {
      this.saveEditorState();
    });

    this.playMode.on('playStateChanged', (isPlaying) => {
      if (isPlaying) {
        this.detachTransformControls();
        this.cameraSystem.disableEditorControls();
      } else {
        this.cameraSystem.enableEditorControls();
        this.loadEditorState();
        this.sceneHierarchy.refresh();
      }
    });

    if (this.cameraSystem.editorControls) {
      this.cameraSystem.editorControls.onSelect = (actor) => {
        this.sceneHierarchy.selectedActor = actor;
        this.actorProperties.showProperties(actor);
        if (actor) {
          this.attachTransformControls(actor.getMesh());
        } else {
          this.detachTransformControls();
        }
        this.sceneHierarchy.refresh();
      };
    }
  }

  createPanel() {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      padding: 20px;
      border-radius: 8px;
      color: white;
      font-family: Arial, sans-serif;
      min-width: 250px;
      max-height: 80vh;
      overflow-y: auto;
      z-index: 1000;
    `;

    const title = document.createElement('h3');
    title.textContent = 'Scene Editor';
    title.style.margin = '0 0 15px 0';
    container.appendChild(title);

    container.appendChild(this.playMode.getContainer());
    container.appendChild(this.actorSpawner.getContainer());

    const hierarchyTitle = document.createElement('h4');
    hierarchyTitle.textContent = 'Scene Hierarchy';
    hierarchyTitle.style.margin = '15px 0 10px 0';
    container.appendChild(hierarchyTitle);
    container.appendChild(this.sceneHierarchy.getContainer());

    const propertiesTitle = document.createElement('h4');
    propertiesTitle.textContent = 'Properties';
    propertiesTitle.style.margin = '15px 0 10px 0';
    container.appendChild(propertiesTitle);
    container.appendChild(this.actorProperties.getContainer());

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Scene';
    saveButton.style.cssText = `
      background: #2ecc71;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 15px;
      width: 100%;
    `;
    saveButton.addEventListener('click', () => this.saveEditorState());
    container.appendChild(saveButton);

    container.appendChild(this.gameSettings.getContainer());

    document.body.appendChild(container);
  }

  attachTransformControls(object) {
    if (this.transformControls && object) {
      this.transformControls.attach(object);
    }
  }

  detachTransformControls() {
    if (this.transformControls) {
      this.transformControls.detach();
    }
  }

  saveEditorState() {
    const sceneData = {
      actors: [],
      cameraState: {
        position: this.cameraSystem.get().position.toArray(),
        rotation: this.cameraSystem.get().quaternion.toArray()
      }
    };

    this.scene.get().traverse((object) => {
      if (object.userData.actor) {
        const actor = object.userData.actor;
        sceneData.actors.push({
          type: actor.constructor.name,
          name: actor.name,
          position: actor.position.toArray(),
          rotation: actor.rotation.toArray(),
          scale: actor.scale.toArray(),
          properties: actor.getSerializableProperties?.() || {}
        });
      }
    });

    const currentMap = this.scene.getCurrentMap();
    localStorage.setItem(`sceneData_${currentMap}`, JSON.stringify(sceneData));
    
    this.gameSettings.saveSettings();
    this.showSaveFeedback();
  }

  loadEditorState() {
    const currentMap = this.scene.getCurrentMap();
    const savedData = localStorage.getItem(`sceneData_${currentMap}`);
    
    if (savedData) {
      const sceneData = JSON.parse(savedData);
      
      if (sceneData.cameraState) {
        this.cameraSystem.get().position.fromArray(sceneData.cameraState.position);
        this.cameraSystem.get().quaternion.fromArray(sceneData.cameraState.rotation);
      }
      
      const toRemove = [];
      this.scene.get().traverse((object) => {
        if (object.userData.actor) {
          toRemove.push(object);
        }
      });
      toRemove.forEach(object => this.scene.get().remove(object));
      
      sceneData.actors.forEach(actorData => {
        const actor = this.actorSpawner.spawnActor(actorData.type, {
          position: new THREE.Vector3().fromArray(actorData.position),
          rotation: new THREE.Euler().fromArray(actorData.rotation),
          scale: new THREE.Vector3().fromArray(actorData.scale),
          name: actorData.name
        });
        
        if (actor && actorData.properties) {
          actor.loadProperties?.(actorData.properties);
        }
      });
      
      this.sceneHierarchy.refresh();
    }
  }

  showSaveFeedback() {
    const feedback = document.createElement('div');
    feedback.textContent = 'Scene saved!';
    feedback.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #2ecc71;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      animation: fadeOut 2s forwards;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeOut {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
      style.remove();
    }, 2000);
  }

  update() {
    this.playMode.update();
    this.gameSettings.update();
    this.sceneHierarchy.update();
    this.actorSpawner.update();
    this.actorProperties.update();
  }
}