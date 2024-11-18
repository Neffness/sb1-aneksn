import * as THREE from 'three';
import { VRControllerSystem } from './VRControllerSystem.js';
import { RenderSettings } from './RenderSettings.js';

export class Renderer {
  constructor(settings = new RenderSettings()) {
    this.settings = settings;
    this.renderer = this.createRenderer();
    this.vrSystem = new VRControllerSystem(this.renderer);
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer(this.settings.getRendererOptions());
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.shadowMap.enabled = this.settings.shadows;
    renderer.shadowMap.type = this.settings.shadowMapType;
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  setupVR(scene) {
    this.vrSystem.setup(scene);
  }

  onWindowResize(camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  get() {
    return this.renderer;
  }

  getControllers() {
    return this.vrSystem.getControllers();
  }

  getControllerGrips() {
    return this.vrSystem.getControllerGrips();
  }
}