import * as THREE from 'three';
import { GameObject } from '../../objects/GameObject.js';

export class Pillar extends GameObject {
  constructor(position) {
    super();
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      roughness: 0.3,
      metalness: 0.7
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.setPosition(position.x, 4, position.z);
  }
}