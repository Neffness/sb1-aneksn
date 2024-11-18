import { GameState } from '../GameState.js';

export class MainMenuGameState extends GameState {
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      menuMusicEnabled: true,
      menuAnimationsEnabled: true
    };
  }

  startSession() {
    super.startSession();
    // Initialize menu-specific state
    this.statistics = {
      ...this.statistics,
      lastMenuSelection: null,
      timeInMenu: 0
    };
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (!this.isPaused) {
      // Update menu-specific statistics
      this.statistics.timeInMenu = this.statistics.playTime;
    }
  }

  getState() {
    return {
      ...super.getState(),
      menuSpecific: {
        lastMenuSelection: this.statistics.lastMenuSelection,
        timeInMenu: this.statistics.timeInMenu
      }
    };
  }
}