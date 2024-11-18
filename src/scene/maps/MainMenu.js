import { Map as GameMap } from '../objects/Map.js';
import { Pillar } from './mainmenu/Pillar.js';
import { MenuTitle } from './mainmenu/MenuTitle.js';
import { MenuItem } from './mainmenu/MenuItem.js';
import { MainMenuMode } from '../../game/modes/MainMenuMode.js';

export class MainMenu extends GameMap {
  constructor() {
    super(40, 40, 1);
    this.menuItems = new Map();
    this.setGameMode(new MainMenuMode());
    this.setupMenuEnvironment();
    this.setupMenuListeners();
    this.onMapChange = null; // Callback for map changes
  }

  setupMenuEnvironment() {
    // Add title
    const title = new MenuTitle();
    this.mesh.add(title.getMesh());

    // Add decorative pillars
    const pillarPositions = [
      { x: -6, z: -4 },
      { x: 6, z: -4 },
      { x: -6, z: 4 },
      { x: 6, z: 4 }
    ];

    pillarPositions.forEach(pos => {
      const pillar = new Pillar(pos);
      this.mesh.add(pillar.getMesh());
    });

    // Add menu options
    const menuOptions = ['Long Road', 'Settings', 'Credits'];
    menuOptions.forEach((option, index) => {
      const yPos = 2 - index * 0.3;
      const menuItem = new MenuItem(option, { x: 0, y: yPos, z: -1.5 });
      menuItem.parent = this; // Set parent reference for event handling
      this.mesh.add(menuItem.getMesh());
      this.menuItems.set(option, menuItem);
    });
  }

  setupMenuListeners() {
    if (!this.gameMode) return;

    this.gameMode.on('optionSelected', (option) => {
      this.menuItems.forEach((item) => {
        item.highlight(item.text === option.text);
      });
    });

    this.gameMode.on('optionChosen', (option) => {
      switch (option.text) {
        case 'Long Road':
          if (this.onMapChange) {
            this.onMapChange('LongRoad');
          }
          break;
        case 'Settings':
          console.log('Opening settings...');
          break;
        case 'Credits':
          console.log('Showing credits...');
          break;
      }
    });
  }

  getMenuItems() {
    return Array.from(this.menuItems.values()).map(item => item.collisionMesh);
  }

  update() {
    super.update();
    // Update all menu items
    this.menuItems.forEach(item => item.update());
  }
}