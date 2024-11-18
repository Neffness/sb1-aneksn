import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

export class VRControllerSystem {
  constructor(renderer) {
    this.renderer = renderer;
    this.controllers = [];
    this.controllerGrips = [];
    this.raycasters = [];
    this.pointers = [];
    this.scene = null;
    this.modelFactory = new XRControllerModelFactory();
    this.currentIntersections = new Map();
    
    this.renderer.xr.setReferenceSpaceType('local-floor');
    
    // Add VR session change listeners
    this.renderer.xr.addEventListener('sessionstart', () => this.onVRSessionStart());
    this.renderer.xr.addEventListener('sessionend', () => this.onVRSessionEnd());
  }

  onVRSessionStart() {
    if (this.scene?.map?.gameMode) {
      this.scene.map.gameMode.start();
    }
  }

  onVRSessionEnd() {
    if (this.scene?.map?.gameMode) {
      this.scene.map.gameMode.end();
      // Return to main menu when exiting VR
      if (this.scene.loadMap) {
        this.scene.loadMap('MainMenu');
      }
    }
  }

  async startVRSession() {
    if (!navigator.xr) {
      console.warn('WebXR not supported');
      return;
    }

    try {
      const session = await navigator.xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'bounded-floor']
      });
      this.renderer.xr.setSession(session);
    } catch (error) {
      console.warn('VR session request failed:', error);
    }
  }

  setup(scene) {
    this.scene = scene;
    
    // Setup both controllers
    for (let i = 0; i < 2; i++) {
      const controller = this.renderer.xr.getController(i);
      const grip = this.renderer.xr.getControllerGrip(i);
      
      // Add event listeners for both pinch and squeeze actions
      controller.addEventListener('selectstart', () => this.onSelectStart(controller));
      controller.addEventListener('selectend', () => this.onSelectEnd(controller));
      controller.addEventListener('squeezestart', () => this.onSelectStart(controller));
      controller.addEventListener('squeezeend', () => this.onSelectEnd(controller));
      
      // Add visible controller model
      grip.add(this.modelFactory.createControllerModel(grip));
      
      // Add controller pointer
      const pointer = this.createControllerPointer();
      controller.add(pointer);
      this.pointers.push(pointer);
      
      // Create raycaster for this controller
      const raycaster = new THREE.Raycaster();
      this.raycasters.push(raycaster);
      
      scene.add(controller);
      scene.add(grip);
      
      this.controllers.push(controller);
      this.controllerGrips.push(grip);
    }
  }

  createControllerPointer() {
    const group = new THREE.Group();

    // Create laser pointer line
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -5], 3));
    
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 2,
      transparent: true,
      opacity: 0.7
    });

    const line = new THREE.Line(geometry, material);
    line.userData.defaultColor = new THREE.Color(0x00ff00);
    line.userData.hoverColor = new THREE.Color(0x00ffff);
    group.add(line);

    // Add pointer tip
    const tipGeometry = new THREE.ConeGeometry(0.01, 0.02, 8);
    tipGeometry.rotateX(Math.PI / 2);
    const tipMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const tip = new THREE.Mesh(tipGeometry, tipMaterial);
    tip.position.z = -0.05;
    tip.userData.defaultColor = new THREE.Color(0x00ff00);
    tip.userData.hoverColor = new THREE.Color(0x00ffff);
    group.add(tip);

    return group;
  }

  onSelectStart(controller) {
    controller.userData.isSelecting = true;
    const intersection = this.getIntersection(controller);
    if (intersection) {
      const menuItem = this.findMenuItemParent(intersection.object);
      if (menuItem && menuItem.userData.parent && menuItem.userData.parent.onSelect) {
        menuItem.userData.parent.onSelect();
      }
    }
  }

  onSelectEnd(controller) {
    controller.userData.isSelecting = false;
  }

  findMenuItemParent(object) {
    let current = object;
    while (current && !current.userData.isMenuItem) {
      current = current.parent;
    }
    return current;
  }

  getIntersection(controller) {
    if (!this.scene) return null;
    
    const controllerIndex = this.controllers.indexOf(controller);
    const raycaster = this.raycasters[controllerIndex];
    
    // Update raycaster
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    
    // Get intersections with menu items
    const menuItems = this.getMenuItems();
    const intersects = raycaster.intersectObjects(menuItems, true);
    return intersects.length > 0 ? intersects[0] : null;
  }

  getMenuItems() {
    if (!this.scene) return [];
    
    const menuItems = [];
    this.scene.traverse((object) => {
      if (object.userData.isMenuItem) {
        menuItems.push(object);
      }
    });
    return menuItems;
  }

  updatePointerColor(pointer, isHovering) {
    const line = pointer.children[0];
    const tip = pointer.children[1];
    
    const color = isHovering ? line.userData.hoverColor : line.userData.defaultColor;
    line.material.color.copy(color);
    tip.material.color.copy(color);
  }

  update() {
    if (!this.scene) return;

    // Clear previous hover states
    const previousIntersections = new Map(this.currentIntersections);
    this.currentIntersections.clear();

    // Update controller interaction state
    this.controllers.forEach((controller, index) => {
      const intersection = this.getIntersection(controller);
      const pointer = this.pointers[index];

      if (intersection) {
        const menuItem = this.findMenuItemParent(intersection.object);
        if (menuItem && menuItem.userData.parent) {
          this.currentIntersections.set(controller.id, menuItem.userData.parent);
          this.updatePointerColor(pointer, true);
          
          // Call onHover only if this is a new intersection
          if (!previousIntersections.has(controller.id) || 
              previousIntersections.get(controller.id) !== menuItem.userData.parent) {
            menuItem.userData.parent.onHover?.();
          }
        }
      } else {
        this.updatePointerColor(pointer, false);
        
        // If there was a previous intersection, clear the hover state
        const previousItem = previousIntersections.get(controller.id);
        if (previousItem && previousItem.highlight) {
          previousItem.highlight(false);
        }
      }
    });
  }

  getControllers() {
    return this.controllers;
  }

  getControllerGrips() {
    return this.controllerGrips;
  }

  getRaycasters() {
    return this.raycasters;
  }
}