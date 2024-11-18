import { EventEmitter } from '../utils/EventEmitter.js';
import { Pawn } from '../scene/objects/actors/pawns/Pawn.js';

export class Player extends EventEmitter {
  constructor() {
    super();
    this.id = crypto.randomUUID();
    this.name = `Player_${this.id.slice(0, 8)}`;
    this.pawn = null;
    this.score = 0;
    this.isReady = false;
  }

  spawnPawn(position) {
    if (this.pawn) {
      this.pawn.die();
    }
    
    this.pawn = new Pawn();
    if (position) {
      this.pawn.setPosition(position.x, position.y, position.z);
    }
    
    this.emit('pawnSpawned', this.pawn);
    return this.pawn;
  }

  despawnPawn() {
    if (this.pawn) {
      this.pawn.die();
      this.pawn = null;
      this.emit('pawnDespawned');
    }
  }

  setName(name) {
    this.name = name;
    this.emit('nameChanged', name);
  }

  updateScore(points) {
    this.score += points;
    this.emit('scoreUpdated', this.score);
  }

  setReady(ready) {
    this.isReady = ready;
    this.emit('readyStateChanged', ready);
  }

  update() {
    if (this.pawn) {
      this.pawn.update();
    }
  }

  getState() {
    return {
      id: this.id,
      name: this.name,
      score: this.score,
      isReady: this.isReady,
      hasPawn: !!this.pawn
    };
  }
}