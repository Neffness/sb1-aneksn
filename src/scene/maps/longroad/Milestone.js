import * as THREE from 'three';
import { Actor } from '../../objects/actors/Actor.js';

export class Milestone extends Actor {
  constructor() {
    super();
    const geometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.1
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;

    // Add collider matching the visual geometry
    this.setCollider(geometry);
  }

  onCollision(other) {
    // Handle collisions with other actors
    super.onCollision(other);
  }
}