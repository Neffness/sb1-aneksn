import * as THREE from 'three';
import { Actor } from '../Actor.js';

export class Pawn extends Actor {
  constructor() {
    super();
    this.health = 100;
    this.maxHealth = 100;
    this.isDead = false;
    this.team = 0;
    this.controller = null;
    this.mesh = this.createDefaultMesh();
  }

  createDefaultMesh() {
    // Create a default capsule mesh for the pawn
    const group = new THREE.Group();
    
    // Body (capsule-like shape using cylinder and spheres)
    const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1.5, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      roughness: 0.7,
      metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    group.add(body);

    // Head sphere
    const headGeometry = new THREE.SphereGeometry(0.25, 8, 8);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.y = 1.75;
    group.add(head);

    // Add capsule collider
    const colliderGeometry = new THREE.CapsuleGeometry(0.25, 1.5, 4, 8);
    this.setCollider(colliderGeometry);

    return group;
  }

  setController(controller) {
    this.controller = controller;
  }

  damage(amount) {
    if (this.isDead) return;
    
    this.health = Math.max(0, this.health - amount);
    
    if (this.health <= 0) {
      this.die();
    }
  }

  heal(amount) {
    if (this.isDead) return;
    
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  die() {
    this.isDead = true;
    this.health = 0;
    // Trigger death animation or effects
    this.emit('death');
  }

  respawn(position) {
    this.isDead = false;
    this.health = this.maxHealth;
    if (position) {
      this.setPosition(position.x, position.y, position.z);
    }
    this.emit('respawn');
  }

  setTeam(teamId) {
    this.team = teamId;
  }

  update(deltaTime) {
    super.update(deltaTime);
    
    // Update controller if present
    if (this.controller) {
      this.controller.update(deltaTime);
    }
  }

  onCollision(other) {
    super.onCollision(other);
    // Handle pawn-specific collision logic
  }
}