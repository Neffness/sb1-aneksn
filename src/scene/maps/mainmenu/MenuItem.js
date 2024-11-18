import * as THREE from 'three';
import { Actor } from '../../objects/actors/Actor.js';

export class MenuItem extends Actor {
  constructor(text, position) {
    super();
    this.text = text;
    this.isHovered = false;
    this.createMenuItem();
    this.setPosition(position.x, position.y, position.z);
    
    // Add collider for interaction
    const colliderGeometry = new THREE.BoxGeometry(1.05, 0.25, 0.1);
    this.setCollider(colliderGeometry);
  }

  createMenuItem() {
    // Create the main group
    this.mesh = new THREE.Group();

    // Create the visual part of the button
    const buttonGeometry = new THREE.PlaneGeometry(1, 0.2);
    const buttonMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      map: this.createTextTexture()
    });
    this.buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
    this.mesh.add(this.buttonMesh);

    // Mark for interaction
    this.buttonMesh.userData.isMenuItem = true;
    this.buttonMesh.userData.parent = this;
  }

  createTextTexture() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    // Draw background
    ctx.fillStyle = this.isHovered ? '#3498db' : '#2980b9';
    ctx.roundRect(0, 0, canvas.width, canvas.height, 20);
    ctx.fill();
    
    // Draw text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  highlight(isSelected) {
    if (this.isHovered === isSelected) return;
    this.isHovered = isSelected;
    
    // Update the texture
    if (this.buttonMesh) {
      this.buttonMesh.material.map = this.createTextTexture();
      this.buttonMesh.material.needsUpdate = true;
    }
  }

  onHover() {
    this.highlight(true);
  }

  onSelect() {
    // Trigger selection animation
    const scale = 1.1;
    const duration = 100;
    
    // Scale up
    this.setScale(scale, scale, scale);
    
    // Scale back after duration
    setTimeout(() => {
      this.setScale(1, 1, 1);
      
      // Emit selection event
      if (this.parent && this.parent.gameMode) {
        this.parent.gameMode.emit('optionChosen', { text: this.text });
      }
    }, duration);
  }

  onCollision(other) {
    // Handle collisions with other actors
    super.onCollision(other);
  }

  update(deltaTime) {
    super.update(deltaTime);
  }
}