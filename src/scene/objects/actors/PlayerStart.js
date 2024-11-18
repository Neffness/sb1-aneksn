import * as THREE from 'three';
import { Actor } from './Actor.js';

export class PlayerStart extends Actor {
  constructor() {
    super();
    this.isPlayerStart = true;
    this.name = 'PlayerStart';
    this.createMesh();
  }

  createMesh() {
    this.mesh = new THREE.Group();

    // Create arrow body
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      roughness: 0.7,
      metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    this.mesh.add(body);

    // Create arrow head
    const headGeometry = new THREE.ConeGeometry(0.4, 0.6, 8);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      roughness: 0.7,
      metalness: 0.3
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.3;
    this.mesh.add(head);

    // Add collider
    const colliderGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.6, 8);
    this.setCollider(colliderGeometry);

    // Cast shadows
    this.mesh.children.forEach(child => {
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }

  getSerializableProperties() {
    return {
      ...super.getSerializableProperties(),
      color: this.mesh.children[0].material.color.getHex()
    };
  }

  loadProperties(properties) {
    super.loadProperties(properties);
    if (properties.color) {
      this.mesh.children.forEach(child => {
        child.material.color.setHex(properties.color);
      });
    }
  }

  getSpawnTransform() {
    return {
      position: this.position.clone(),
      rotation: this.rotation.clone(),
      scale: this.scale.clone()
    };
  }

  onCollision(other) {
    // Handle collisions with other actors
    super.onCollision(other);
  }

  update() {
    super.update();
    
    // Add any PlayerStart-specific update logic here
    // For example, you might want to add a slow rotation or hover effect
    this.mesh.rotation.y += 0.01;
  }
}