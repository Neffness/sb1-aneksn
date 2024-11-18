import { Settings } from './Settings.js';
import { GameStateEnum } from '../../game/states/GameStateEnum.js';
import { GameConfig } from '../../config/GameConfig.js';

export class GameSettings extends Settings {
  constructor(scene) {
    super();
    this.scene = scene;
    this.config = GameConfig.getConfig();
    this.addStartupMapSetting();
    this.addGameStateSetting();
  }

  addStartupMapSetting() {
    const select = document.createElement('select');
    select.style.cssText = `
      background: #2c3e50;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      outline: none;
    `;

    const maps = ['MainMenu', 'LongRoad'];
    maps.forEach(map => {
      const option = document.createElement('option');
      option.value = map;
      option.textContent = map;
      option.selected = map === this.config.startupMap;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      const selectedMap = e.target.value;
      GameConfig.updateConfig('startupMap', selectedMap);
      this.scene.loadMap(selectedMap);
    });

    const row = this.createSettingRow('Startup Map:', select);
    this.container.appendChild(row);
  }

  addGameStateSetting() {
    const select = document.createElement('select');
    select.style.cssText = `
      background: #2c3e50;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      outline: none;
    `;

    Object.entries(GameStateEnum).forEach(([key, value]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = key;
      option.selected = value === this.config.gameState;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      const selectedState = e.target.value;
      GameConfig.updateConfig('gameState', selectedState);
      
      // Update the game state if a map is loaded
      if (this.scene.map) {
        this.scene.map.setGameState(selectedState);
      }
    });

    const row = this.createSettingRow('Game State:', select);
    this.container.appendChild(row);
  }

  saveSettings() {
    // Save current settings to GameConfig
    GameConfig.saveConfig(this.config);
  }

  update() {
    super.update();
    // Add any game-specific setting updates here
  }
}