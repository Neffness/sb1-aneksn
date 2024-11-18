import * as THREE from 'three';

export class RenderSettings {
  constructor(options = {}) {
    this.antialias = options.antialias ?? true;
    this.alpha = options.alpha ?? true; // Changed to true to support transparent background
    this.shadows = options.shadows ?? true;
    this.shadowMapType = options.shadowMapType ?? THREE.PCFSoftShadowMap;
    this.pixelRatio = options.pixelRatio ?? window.devicePixelRatio;
  }

  getRendererOptions() {
    return {
      antialias: this.antialias,
      alpha: this.alpha,
      powerPreference: "high-performance"
    };
  }

  setShadowMapType(type) {
    this.shadowMapType = type;
  }

  setPixelRatio(ratio) {
    this.pixelRatio = ratio;
  }

  setShadows(enabled) {
    this.shadows = enabled;
  }
}