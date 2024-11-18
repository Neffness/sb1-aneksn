import { GameObject } from '../scene/objects/GameObject.js';
import { EventEmitter } from '../utils/EventEmitter.js';

export class GameState extends GameObject {
  constructor() {
    super();
    this.events = new EventEmitter();
    this.isPaused = false;
    this.settings = {
      soundEnabled: true,
    };
    this.statistics = {
      playTime: 0,
      sessionStartTime: null
    };
    this.players = new Set(); // Initialize players collection
  }

  pause() {
    if (!this.isPaused) {
      this.isPaused = true;
      this.events.emit('gamePaused');
    }
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.events.emit('gameResumed');
    }
  }

  startSession() {
    this.statistics.sessionStartTime = Date.now();
    this.statistics.score = 0;
    this.statistics.playTime = 0;
    this.events.emit('sessionStarted');
  }

  endSession() {
    if (this.statistics.sessionStartTime) {
      this.statistics.playTime = Date.now() - this.statistics.sessionStartTime;
      this.events.emit('sessionEnded', {
        playTime: this.statistics.playTime
      });
    }
  }

  getState() {
    return {
      gameMode: this.gameMode,
      isPaused: this.isPaused,
      statistics: { ...this.statistics }
    };
  }

  loadState(state) {
    if (state.settings) {
      Object.entries(state.settings).forEach(([key, value]) => {
        this.updateSetting(key, value);
      });
    }
    this.isPaused = state.isPaused || false;
    if (state.statistics) {
      this.statistics = { ...this.statistics, ...state.statistics };
    }
    this.events.emit('stateLoaded', this.getState());
  }

  addPlayer(player) {
    this.players.add(player);
    this.events.emit('playerAdded', player);
  }

  removePlayer(player) {
    this.players.delete(player);
    this.events.emit('playerRemoved', player);
  }

  on(event, callback) {
    return this.events.on(event, callback);
  }

  off(event, callback) {
    this.events.off(event, callback);
  }

  update(deltaTime) {
    if (!this.isPaused) {
      // Update play time
      if (this.statistics.sessionStartTime) {
        this.statistics.playTime = Date.now() - this.statistics.sessionStartTime;
      }

      // Update all players
      this.players.forEach(player => player.update(deltaTime));
    }
  }
}