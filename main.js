import { Scene } from './src/scene/Scene.js';
import { Camera } from './src/camera/Camera.js';
import { Renderer } from './src/renderer/Renderer.js';
import { EditorPanel } from './src/editor/EditorPanel.js';

class App {
  constructor() {
    this.scene = new Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    
    // Setup VR with controllers
    this.renderer.setupVR(this.scene.get());
    
    // Setup camera controls for non-VR mode
    this.camera.setupControls(this.renderer.get());

    // Add editor panel with Scene class instance
    this.editor = new EditorPanel(
      this.scene, // Pass the Scene class instance instead of THREE.Scene
      this.camera,
      this.renderer.vrSystem
    );

    window.addEventListener('resize', () => {
      this.renderer.onWindowResize(this.camera.get());
    }, false);

    this.animate();
  }

  animate() {
    this.renderer.get().setAnimationLoop(() => {
      this.scene.update();
      this.camera.update();
      this.editor.update();
      this.renderer.get().render(this.scene.get(), this.camera.get());
    });
  }
}

new App();