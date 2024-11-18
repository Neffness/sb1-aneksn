export class GameConfig {
  static configKey = 'gameSettings';

  static getConfig() {
    const stored = localStorage.getItem(this.configKey);
    return stored ? JSON.parse(stored) : {
      startupMap: 'MainMenu',
      gameState: 'MainMenu'
    };
  }

  static saveConfig(config) {
    localStorage.setItem(this.configKey, JSON.stringify(config));
  }

  static updateConfig(key, value) {
    const config = this.getConfig();
    config[key] = value;
    this.saveConfig(config);
  }
}