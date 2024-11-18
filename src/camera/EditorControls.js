import * as THREE from 'three';

export class EditorControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    
    this.enabled = false;
    this.moveSpeed = 10;
    this.rotateSpeed = 2;
    
    // Movement controls
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
    
    // Rotation controls
    this.rotateLeft = false;
    this.rotateRight = false;
    this.rotateUp = false;
    this.rotateDown = false;
    
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    
    // Quaternion for rotation
    this.rotationQuaternion = new THREE.Quaternion();
    this.tempQuaternion = new THREE.Quaternion();
    
    // Euler for converting rotation input to quaternion
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    
    this.prevTime = performance.now();

    // Raycaster for selection
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.onSelect = null;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (event) => this.onKeyDown(event));
    document.addEventListener('keyup', (event) => this.onKeyUp(event));
    
    // Add click listener for selection
    this.domElement.addEventListener('pointerdown', (event) => {
      if (event.button === 0) { // Left click only
        this.onClick(event);
      }
    });
  }

  onClick(event) {
    if (!this.enabled || !this.onSelect || !this.camera.parent) return;

    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Get all meshes in the scene that have actor references
    const meshes = [];
    this.camera.parent.traverse((object) => {
      if (object.isMesh && object.userData.actor) {
        meshes.push(object);
      }
    });

    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      // Find the first intersected object that has an actor reference
      const selectedObject = intersects[0].object;
      let current = selectedObject;
      
      // Traverse up the parent chain to find the actor
      while (current && !current.userData.actor) {
        current = current.parent;
      }
      
      if (current && current.userData.actor) {
        this.onSelect(current.userData.actor);
      }
    } else {
      this.onSelect(null); // Deselect when clicking empty space
    }
  }

  onKeyDown(event) {
    if (!this.enabled) return;
    
    switch (event.code) {
      // Movement (W/S inverted)
      case 'KeyW': this.moveBackward = true; break;
      case 'KeyS': this.moveForward = true; break;
      case 'KeyA': this.moveLeft = true; break;
      case 'KeyD': this.moveRight = true; break;
      case 'Space': this.moveUp = true; break;
      case 'ShiftLeft': this.moveDown = true; break;
      
      // Rotation
      case 'ArrowLeft': this.rotateLeft = true; break;
      case 'ArrowRight': this.rotateRight = true; break;
      case 'ArrowUp': this.rotateDown = true; break; // Inverted
      case 'ArrowDown': this.rotateUp = true; break; // Inverted
    }
  }

  onKeyUp(event) {
    if (!this.enabled) return;
    
    switch (event.code) {
      // Movement (W/S inverted)
      case 'KeyW': this.moveBackward = false; break;
      case 'KeyS': this.moveForward = false; break;
      case 'KeyA': this.moveLeft = false; break;
      case 'KeyD': this.moveRight = false; break;
      case 'Space': this.moveUp = false; break;
      case 'ShiftLeft': this.moveDown = false; break;
      
      // Rotation
      case 'ArrowLeft': this.rotateLeft = false; break;
      case 'ArrowRight': this.rotateRight = false; break;
      case 'ArrowUp': this.rotateDown = false; break; // Inverted
      case 'ArrowDown': this.rotateUp = false; break; // Inverted
    }
  }

  update(deltaTime) {
    if (!this.enabled) return;
    
    const time = performance.now();
    const delta = deltaTime || (time - this.prevTime) / 1000;
    
    // Handle rotation using quaternions
    if (this.rotateLeft || this.rotateRight || this.rotateUp || this.rotateDown) {
      // Get current rotation as euler angles
      this.euler.setFromQuaternion(this.camera.quaternion);
      
      // Apply rotation changes
      if (this.rotateLeft) this.euler.y += this.rotateSpeed * delta;
      if (this.rotateRight) this.euler.y -= this.rotateSpeed * delta;
      if (this.rotateUp) this.euler.x -= this.rotateSpeed * delta;
      if (this.rotateDown) this.euler.x += this.rotateSpeed * delta;
      
      // Clamp vertical rotation
      this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
      
      // Convert back to quaternion
      this.camera.quaternion.setFromEuler(this.euler);
    }
    
    // Handle movement
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.velocity.z = 0;
    
    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveLeft) - Number(this.moveRight);
    this.direction.y = Number(this.moveUp) - Number(this.moveDown);
    this.direction.normalize();
    
    // Calculate movement in camera's local space
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0);
    
    // Apply movement
    if (this.moveForward || this.moveBackward) {
      this.camera.position.addScaledVector(forward, -this.direction.z * this.moveSpeed * delta);
    }
    if (this.moveLeft || this.moveRight) {
      this.camera.position.addScaledVector(right, -this.direction.x * this.moveSpeed * delta);
    }
    if (this.moveUp || this.moveDown) {
      this.camera.position.addScaledVector(up, this.direction.y * this.moveSpeed * delta);
    }
    
    this.prevTime = time;
  }
}