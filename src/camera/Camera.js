import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EditorControls } from './EditorControls.js';

export class Camera {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);
    this.controls = null;
    this.editorControls = null;
    this.renderer = null;
  }

  setupControls(renderer) {
    this.renderer = renderer;
    this.createControls();
    this.createEditorControls();
    this.enableEditorControls(); // Enable editor controls by default
  }

  createControls() {
    if (this.renderer) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.screenSpacePanning = false;
      this.controls.minDistance = 3;
      this.controls.maxDistance = 30;
      this.controls.maxPolarAngle = Math.PI / 2;
      this.controls.enabled = false;
    }
  }

  createEditorControls() {
    if (this.renderer) {
      this.editorControls = new EditorControls(this.camera, this.renderer.domElement);
      this.editorControls.enabled = false;
    }
  }

  enableEditorControls() {
    if (this.editorControls) {
      this.controls.enabled = false;
      this.editorControls.enabled = true;
    }
  }

  disableEditorControls() {
    if (this.editorControls) {
      this.controls.enabled = false;
      this.editorControls.enabled = false;
    }
  }

  enableControls() {
    if (this.controls) {
      this.editorControls.enabled = false;
      this.controls.enabled = true;
    }
  }

  disableControls() {
    if (this.controls) {
      this.controls.enabled = false;
      this.editorControls.enabled = false;
    }
  }

  update(deltaTime) {
    if (this.controls && this.controls.enabled) {
      this.controls.update();
    }
    if (this.editorControls && this.editorControls.enabled) {
      this.editorControls.update(deltaTime);
    }
  }

  get() {
    return this.camera;
  }
}