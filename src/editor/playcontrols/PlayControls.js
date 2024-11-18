import { GameObject } from '../../scene/objects/GameObject.js';
import { PlayGame } from './PlayGame.js';
import { StopGame } from './StopGame.js';

export class PlayControls extends GameObject {
  constructor(scene, playMode) {
    super();
    this.scene = scene;
    this.playMode = playMode;
    this.playGame = new PlayGame();
    this.stopGame = new StopGame();
    this.container = this.createContainer();
    this.initialCameraPosition = null;
    this.initialCameraRotation = null;
    this.setupEventListeners();
  }

  createContainer() {
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      gap: 10px;
      align-items: center;
    `;

    container.appendChild(this.playGame.getButton());
    // Stop button hidden initially
    
    return container;
  }

  setupEventListeners() {
    this.playGame.onPress(() => this.StartGame());
    this.stopGame.getButton().addEventListener('click', () => this.EndGame());
  }

  async StartGame() {
    if (this.scene) {
      // Store initial camera position and rotation
      this.initialCameraPosition = this.playMode.cameraSystem.get().position.clone();
      this.initialCameraRotation = this.playMode.cameraSystem.get().quaternion.clone();

      this.container.appendChild(this.stopGame.getButton());
      this.container.removeChild(this.playGame.getButton());
      this.scene.loadMap('MainMenu');

      // Start the game mode if available
      if (this.scene.map && this.scene.map.gameMode) {
        this.scene.map.gameMode.start();
      }

      this.playMode.setPlayState(true);
      
      // Start the appropriate mode
      if (this.playMode.mode === 'VR') {
        await this.playMode.vrSystem.startVRSession();
      } else {
        // Enable camera controls for 3D mode
        this.playMode.cameraSystem.enableControls();
      }
    }
  }

  EndGame() {
    if (this.scene) {
      // End the current game mode if available
      if (this.scene.map && this.scene.map.gameMode) {
        this.scene.map.gameMode.end();
      }

      // Remove stop button
      this.stopGame.getButton().remove();
      
      // Add play button back
      this.container.appendChild(this.playGame.getButton());
      
      // Reset to main menu when ending game
      this.scene.loadMap('MainMenu');
      
      // Disable game controls and enable editor controls
      this.playMode.cameraSystem.disableControls();
      this.playMode.cameraSystem.enableEditorControls();
      
      // End VR session if active
      if (this.playMode.vrSystem.renderer.xr.isPresenting) {
        this.playMode.vrSystem.renderer.xr.getSession().end();
      }

      this.playMode.setPlayState(false);

      // Reset camera to initial position and rotation
      if (this.initialCameraPosition && this.initialCameraRotation) {
        this.playMode.cameraSystem.get().position.copy(this.initialCameraPosition);
        this.playMode.cameraSystem.get().quaternion.copy(this.initialCameraRotation);
      }
    }
  }

  getContainer() {
    return this.container;
  }

  update() {
    this.playGame.update();
    this.stopGame.update();
  }
}