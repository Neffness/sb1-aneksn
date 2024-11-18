import { GameMode } from '../GameMode.js';

export class TimeTrialMode extends GameMode {
  constructor(timeLimit = 180000) { // 3 minutes in milliseconds
    super();
    this.timeLimit = timeLimit;
    this.checkpoints = new Set();
  }

  init() {
    super.init();
    this.checkpoints.clear();
  }

  addCheckpoint(checkpoint) {
    this.checkpoints.add(checkpoint);
    this.emit('checkpointAdded', checkpoint);
  }

  reachCheckpoint(checkpoint) {
    if (this.checkpoints.has(checkpoint)) {
      this.updateScore(100);
      this.emit('checkpointReached', checkpoint);
    }
  }

  getTimeRemaining() {
    if (!this.startTime || this.state !== 'playing') return this.timeLimit;
    return Math.max(0, this.timeLimit - this.getTimePlayed());
  }

  getState() {
    return {
      ...super.getState(),
      timeRemaining: this.getTimeRemaining(),
      checkpoints: Array.from(this.checkpoints)
    };
  }
}