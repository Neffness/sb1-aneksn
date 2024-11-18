import * as THREE from 'three';
import { MainMenu } from './maps/MainMenu.js';
import { LongRoad } from './maps/LongRoad.js';
import { setupLights } from './DefaultLighting.js';
import { GameConfig } from '../config/GameConfig.js';
import { GameStateEnum } from '../game/states/GameStateEnum.js';
import { MainMenuGameState } from '../game/states/MainMenuGameState.js';

export class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    this.objects = [];
    this.editor = null;
    this.currentMap = 'MainMenu';
    
    // Initialize with saved startup map
    const config = GameConfig.getConfig();
    this.initMap(config.startupMap);
    
    // Setup lighting
    setupLights(this.scene);
  }

  getCurrentMap() {
    return this.currentMap;
  }

  loadMap(mapName) {
    this.currentMap = mapName;
    
    // Keep editor-spawned actors when changing maps
    const editorActors = [];
    this.scene.traverse((object) => {
      if (object.userData.isEditorSpawned) {
        editorActors.push(object);
      }
    });

    // Remove current map if it exists
    if (this.map) {
      this.scene.remove(this.map.getMesh());
      const index = this.objects.indexOf(this.map);
      if (index > -1) {
        this.objects.splice(index, 1);
      }
    }

    // Create new map
    switch (mapName) {
      case 'LongRoad':
        this.map = new LongRoad();
        break;
      case 'MainMenu':
      default:
        this.map = new MainMenu();
        this.map.onMapChange = (newMap) => this.loadMap(newMap);
        break;
    }

    // Set the game state based on configuration
    const config = GameConfig.getConfig();
    this.setGameState(config.gameState);

    // Add new map to scene
    this.scene.add(this.map.getMesh());
    this.objects.push(this.map);

    // Re-add editor actors after map change
    editorActors.forEach(actor => {
      this.scene.add(actor);
    });

    // Load editor state for the new map
    if (this.editor) {
      this.editor.loadEditorState();
    }
  }

  initMap(mapName) {
    this.loadMap(mapName);
  }

  setGameState(stateName) {
    if (!this.map) return;

    switch (stateName) {
      case GameStateEnum.MainMenu:
        this.map.setGameState(new MainMenuGameState());
        break;
      case GameStateEnum.None:
      default:
        this.map.setGameState(null);
        break;
    }
  }

  getMenuItems() {
    if (this.map instanceof MainMenu) {
      return this.map.getMenuItems();
    }
    return [];
  }

  update() {
    // Update all objects
    this.objects.forEach(obj => obj.update());

    // Update current map
    if (this.map) {
      this.map.update();
    }
  }

  get() {
    return this.scene;
  }
}