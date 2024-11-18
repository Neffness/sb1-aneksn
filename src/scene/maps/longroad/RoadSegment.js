import * as THREE from 'three';
import { GameObject } from '../../objects/GameObject.js';

export class RoadSegment extends GameObject {
  constructor(width, length) {
    super();
    this.mesh = new THREE.Group();
    this.createRoadSurface(width, length);
    this.createRoadMarkings(width, length);
  }

  createRoadSurface(width, length) {
    const geometry = new THREE.PlaneGeometry(width, length);
    const material = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.1
    });

    const surface = new THREE.Mesh(geometry, material);
    surface.rotation.x = -Math.PI / 2;
    surface.receiveShadow = true;
    this.mesh.add(surface);
  }

  createRoadMarkings(width, length) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 128;

    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.setLineDash([40, 40]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Edge lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.2);
    ctx.lineTo(canvas.width, canvas.height * 0.2);
    ctx.moveTo(0, canvas.height * 0.8);
    ctx.lineTo(canvas.width, canvas.height * 0.8);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(length / 10, 1);

    const geometry = new THREE.PlaneGeometry(width, length);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.9
    });

    const markings = new THREE.Mesh(geometry, material);
    markings.rotation.x = -Math.PI / 2;
    markings.position.y = 0.01; // Slightly above road surface
    this.mesh.add(markings);
  }
}