import * as THREE from 'three';

export class GameObject {
  constructor() {
    this.mesh = null;
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Euler();
    this.scale = new THREE.Vector3(1, 1, 1);
    this.name = '';
  }

  setName(name) {
    this.name = name;
    if (this.mesh) {
      this.mesh.name = name;
    }
    return this;
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z);
    if (this.mesh) {
      this.mesh.position.copy(this.position);
    }
    return this;
  }

  setRotation(x, y, z) {
    this.rotation.set(x, y, z);
    if (this.mesh) {
      this.mesh.rotation.copy(this.rotation);
    }
    return this;
  }

  setScale(x, y, z) {
    this.scale.set(x, y, z);
    if (this.mesh) {
      this.mesh.scale.copy(this.scale);
    }
    return this;
  }

  update() {
    // Override this method for object-specific updates
  }

  getMesh() {
    return this.mesh;
  }
}