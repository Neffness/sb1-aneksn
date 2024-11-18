import * as THREE from 'three';
import { Actor } from '../../objects/actors/Actor.js';

export class Barrier extends Actor {
  constructor(length = 2) {
    super();
    const geometry = new THREE.BoxGeometry(length, 1, 0.2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 0.7,
      metalness: 0.3
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