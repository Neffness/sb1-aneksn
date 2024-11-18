import * as THREE from 'three';
import { GameObject } from './GameObject.js';

export class MenuTitle extends GameObject {
  constructor() {
    super();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    ctx.fillStyle = '#3498db';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MAIN MENU', canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(5, 1.25);
    this.mesh = new THREE.Mesh(geometry, material);
    this.setPosition(0, 4, -4);
  }
}