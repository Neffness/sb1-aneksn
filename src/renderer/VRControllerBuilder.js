import * as THREE from 'three';

export class VRControllerBuilder {
  build(data) {
    switch (data.targetRayMode) {
      case 'tracked-pointer':
        return this.buildPointerController();
      case 'gaze':
        return this.buildGazeController();
      default:
        return this.buildDefaultController();
    }
  }

  buildPointerController() {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    return new THREE.Line(geometry, material);
  }

  buildGazeController() {
    const geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, -1);
    const material = new THREE.MeshBasicMaterial({
      opacity: 0.5,
      transparent: true
    });
    return new THREE.Mesh(geometry, material);
  }

  buildDefaultController() {
    const geometry = new THREE.SphereGeometry(0.02);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    return new THREE.Mesh(geometry, material);
  }
}