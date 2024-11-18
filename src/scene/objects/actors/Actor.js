import * as THREE from 'three';
import { GameObject } from '../GameObject.js';

export class Actor extends GameObject {
  constructor() {
    super();
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.maxSpeed = 10;
    this.friction = 0.9;
    this.mass = 1;
    this.isGrounded = false;
    this.collider = null;
    this.boundingBox = new THREE.Box3();
  }

  setCollider(geometry) {
    // Create invisible collision mesh
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      wireframe: true
    });
    this.collider = new THREE.Mesh(geometry, material);
    this.mesh.add(this.collider);
    this.updateBoundingBox();
  }

  updateBoundingBox() {
    if (this.collider) {
      this.boundingBox.setFromObject(this.collider);
    }
  }

  addForce(force) {
    // F = ma, so a = F/m
    this.acceleration.add(force.divideScalar(this.mass));
  }

  setVelocity(x, y, z) {
    this.velocity.set(x, y, z);
  }

  update(deltaTime = 1/60) {
    // Update velocity based on acceleration
    this.velocity.add(this.acceleration.multiplyScalar(deltaTime));

    // Apply speed limit
    if (this.velocity.length() > this.maxSpeed) {
      this.velocity.normalize().multiplyScalar(this.maxSpeed);
    }

    // Apply friction
    this.velocity.multiplyScalar(this.friction);

    // Update position based on velocity
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    if (this.mesh) {
      this.mesh.position.copy(this.position);
    }

    // Reset acceleration
    this.acceleration.set(0, 0, 0);

    // Update bounding box
    this.updateBoundingBox();

    super.update();
  }

  checkCollision(other) {
    if (!this.boundingBox || !other.boundingBox) return false;
    return this.boundingBox.intersectsBox(other.boundingBox);
  }

  onCollision(other) {
    // Override in child classes to handle collisions
  }

  getCollider() {
    return this.collider;
  }

  getBoundingBox() {
    return this.boundingBox;
  }

  getSerializableProperties() {
    // Override in child classes to add custom properties
    return {
      name: this.name
    };
  }

  loadProperties(properties) {
    // Override in child classes to restore custom properties
    if (properties.name) {
      this.name = properties.name;
    }
  }
}