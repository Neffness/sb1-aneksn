import * as THREE from 'three';
import { Actor } from '../../objects/actors/Actor.js';

export class Tree extends Actor {
  constructor() {
    super();
    this.mesh = new THREE.Group();
    this.createTrunk();
    this.createFoliage();

    // Add cylinder collider for the trunk
    const colliderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 8);
    this.setCollider(colliderGeometry);
  }

  createTrunk() {
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a3222,
      roughness: 0.9
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1;
    trunk.castShadow = true;
    this.mesh.add(trunk);
  }

  createFoliage() {
    const foliageGeometry = new THREE.ConeGeometry(1.5, 3, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d5a27,
      roughness: 0.8
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 3;
    foliage.castShadow = true;
    this.mesh.add(foliage);
  }

  onCollision(other) {
    // Handle collisions with other actors
    super.onCollision(other);
  }
}