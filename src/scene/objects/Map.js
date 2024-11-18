import * as THREE from 'three';
import { GameObject } from './GameObject.js';

export class Map extends GameObject {
  constructor(width = 20, height = 20, cellSize = 1) {
    super();
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.grid = [];
    this.gameMode = null;
    this.gameState = null;
    
    // Create map geometry
    const geometry = new THREE.Group();
    
    // Create ground
    const ground = this.createGround();
    geometry.add(ground);
    
    // Create walls
    const walls = this.createWalls();
    geometry.add(walls);
    
    this.mesh = geometry;
  }

  setGameMode(gameMode) {
    this.gameMode = gameMode;
    this.setupGameModeListeners();
  }

  setGameState(gameState) {
    this.gameState = gameState;
    if (this.gameMode) {
      this.gameMode.gameState = gameState;
    }
  }

  setupGameModeListeners() {
    if (!this.gameMode) return;

    this.gameMode.on('gameStart', () => this.onGameStart());
    this.gameMode.on('gameEnd', () => this.onGameEnd());
    this.gameMode.on('gamePause', () => this.onGamePause());
    this.gameMode.on('gameResume', () => this.onGameResume());
    this.gameMode.on('scoreUpdate', (score) => this.onScoreUpdate(score));
  }

  onGameStart() {
    // Override in child classes
  }

  onGameEnd() {
    // Override in child classes
  }

  onGamePause() {
    // Override in child classes
  }

  onGameResume() {
    // Override in child classes
  }

  onScoreUpdate(score) {
    // Override in child classes
  }

  createGround() {
    const groundGeometry = new THREE.PlaneGeometry(
      this.width * this.cellSize,
      this.height * this.cellSize
    );
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    return ground;
  }

  createWalls() {
    const walls = new THREE.Group();
    
    // Create outer walls
    const wallHeight = 3;
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x505050,
      roughness: 0.6,
      metalness: 0.2
    });

    // North wall
    const northWall = new THREE.Mesh(
      new THREE.BoxGeometry(this.width * this.cellSize, wallHeight, 0.3),
      wallMaterial
    );
    northWall.position.set(0, wallHeight / 2, -(this.height * this.cellSize) / 2);
    walls.add(northWall);

    // South wall
    const southWall = new THREE.Mesh(
      new THREE.BoxGeometry(this.width * this.cellSize, wallHeight, 0.3),
      wallMaterial
    );
    southWall.position.set(0, wallHeight / 2, (this.height * this.cellSize) / 2);
    walls.add(southWall);

    // East wall
    const eastWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, wallHeight, this.height * this.cellSize),
      wallMaterial
    );
    eastWall.position.set((this.width * this.cellSize) / 2, wallHeight / 2, 0);
    walls.add(eastWall);

    // West wall
    const westWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, wallHeight, this.height * this.cellSize),
      wallMaterial
    );
    westWall.position.set(-(this.width * this.cellSize) / 2, wallHeight / 2, 0);
    walls.add(westWall);

    return walls;
  }

  // Add a wall at specific grid coordinates
  addWall(x, y) {
    const wallHeight = 3;
    const wallGeometry = new THREE.BoxGeometry(this.cellSize, wallHeight, this.cellSize);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x505050,
      roughness: 0.6,
      metalness: 0.2
    });
    
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(
      (x - this.width / 2) * this.cellSize,
      wallHeight / 2,
      (y - this.height / 2) * this.cellSize
    );
    
    this.mesh.add(wall);
    if (!this.grid[y]) this.grid[y] = [];
    this.grid[y][x] = 1;
  }

  // Check if a position is walkable
  isWalkable(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
    return !this.grid[y] || !this.grid[y][x];
  }

  // Convert world coordinates to grid coordinates
  worldToGrid(worldX, worldZ) {
    const gridX = Math.floor((worldX + (this.width * this.cellSize) / 2) / this.cellSize);
    const gridY = Math.floor((worldZ + (this.height * this.cellSize) / 2) / this.cellSize);
    return { x: gridX, y: gridY };
  }

  // Convert grid coordinates to world coordinates
  gridToWorld(gridX, gridY) {
    const worldX = (gridX - this.width / 2) * this.cellSize;
    const worldZ = (gridY - this.height / 2) * this.cellSize;
    return { x: worldX, z: worldZ };
  }

  update() {
    if (this.gameMode) {
      this.gameMode.update();
    }
    if (this.gameState) {
      this.gameState.update();
    }
  }

  getGameMode() {
    return this.gameMode;
  }

  getGameState() {
    return this.gameState;
  }
}