import { EventEmitter } from '../utils/EventEmitter.js';
import { GameState } from './GameState.js';
import { MainMenuGameState } from './states/MainMenuGameState.js';
import { Player } from './Player.js';

export class GameMode extends EventEmitter {
  constructor() {
    super();
    this.players = new Set();
    this.state = 'waiting'; // waiting, playing, ended
    this.score = 0;
    this.timeLimit = 0;
    this.startTime = 0;
    this.gameState = null;
    this.stateKey = 'gameState';
  }

  init() {
    this.state = 'waiting';
    this.score = 0;
    this.startTime = 0;
    this.loadGameState();
    this.emit('gameInit');
  }

  start() {
    this.state = 'playing';
    this.startTime = Date.now();
    this.loadGameState();
    
    // Create a new player when starting the game
    const player = new Player();
    this.addPlayer(player);
    
    this.gameState?.startSession();
    this.emit('gameStart');
  }

  loadGameState() {
    const savedState = localStorage.getItem(this.getStorageKey());
    if (savedState) {
      const stateData = JSON.parse(savedState);
      const StateClass = this.getStateClassFromType(stateData.type);
      this.gameState = new StateClass();
      this.gameState.loadState(stateData.state);
    } else {
      // Default to base GameState if no saved state exists
      this.gameState = new GameState();
      this.gameState.loadState({
        isPaused: false,
        statistics: {
          score: 0,
          playTime: 0,
          sessionStartTime: null
        }
      });
    }
  }

  getStateClassFromType(type) {
    const stateClasses = {
      'MainMenuGameState': MainMenuGameState,
      'GameState': GameState
      // Add more state classes as needed
    };
    return stateClasses[type] || GameState;
  }

  getStorageKey() {
    return `${this.constructor.name}_${this.stateKey}`;
  }

  saveGameState() {
    if (this.gameState) {
      const stateData = {
        type: this.gameState.constructor.name,
        state: this.gameState.getState()
      };
      localStorage.setItem(this.getStorageKey(), JSON.stringify(stateData));
    }
  }

  end() {
    this.state = 'ended';
    this.gameState?.endSession();
    this.saveGameState();
    
    // Clear all players when ending the game
    this.players.clear();
    
    this.emit('gameEnd', { 
      score: this.score, 
      timePlayed: this.getTimePlayed() 
    });
  }

  pause() {
    if (this.state === 'playing') {
      this.state = 'paused';
      this.gameState?.pause();
      this.saveGameState();
      this.emit('gamePause');
    }
  }

  resume() {
    if (this.state === 'paused') {
      this.state = 'playing';
      this.gameState?.resume();
      this.emit('gameResume');
    }
  }

  reset() {
    localStorage.removeItem(this.getStorageKey());
    this.players.clear();
    this.init();
  }

  addPlayer(player) {
    this.players.add(player);
    if (this.gameState) {
      this.gameState.addPlayer(player);
    }
    this.emit('playerJoined', player);
  }

  removePlayer(player) {
    this.players.delete(player);
    if (this.gameState) {
      this.gameState.removePlayer(player);
    }
    this.emit('playerLeft', player);
  }

  updateScore(points) {
    this.score += points;
    this.saveGameState();
    this.emit('scoreUpdate', this.score);
  }

  getTimePlayed() {
    if (!this.startTime) return 0;
    return Date.now() - this.startTime;
  }

  update() {
    if (this.state === 'playing') {
      if (this.timeLimit > 0 && this.getTimePlayed() >= this.timeLimit) {
        this.end();
      }
      this.gameState?.update();
      
      // Update all players
      for (const player of this.players) {
        player.update();
      }
      
      this.emit('gameTick');
    }
  }

  getState() {
    return {
      state: this.state,
      score: this.score,
      players: Array.from(this.players),
      timePlayed: this.getTimePlayed(),
      gameState: this.gameState?.getState()
    };
  }
}