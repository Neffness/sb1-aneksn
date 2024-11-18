import { GameMode } from '../GameMode.js';

export class SurvivalMode extends GameMode {
  constructor() {
    super();
    this.lives = 3;
    this.maxLives = 3;
    this.level = 1;
  }

  init() {
    super.init();
    this.lives = this.maxLives;
    this.level = 1;
  }

  loseLife() {
    this.lives--;
    this.emit('lifeLost', this.lives);
    
    if (this.lives <= 0) {
      this.end();
    }
  }

  gainLife() {
    if (this.lives < this.maxLives) {
      this.lives++;
      this.emit('lifeGained', this.lives);
    }
  }

  levelUp() {
    this.level++;
    this.emit('levelUp', this.level);
  }

  getState() {
    return {
      ...super.getState(),
      lives: this.lives,
      level: this.level
    };
  }
}