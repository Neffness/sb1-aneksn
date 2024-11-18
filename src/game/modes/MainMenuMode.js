import { GameMode } from '../GameMode.js';

export class MainMenuMode extends GameMode {
  constructor() {
    super();
    this.selectedOption = 0;
    this.menuOptions = ['Long Road', 'Settings', 'Credits'];
  }

  init() {
    super.init();
    this.selectedOption = 0;
  }

  selectNext() {
    this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
    this.emit('optionSelected', this.getSelectedOption());
  }

  selectPrevious() {
    this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
    this.emit('optionSelected', this.getSelectedOption());
  }

  setMenuOptions(options) {
    this.menuOptions = options;
    this.selectedOption = 0;
    this.emit('optionSelected', this.getSelectedOption());
  }

  getSelectedOption() {
    return {
      index: this.selectedOption,
      text: this.menuOptions[this.selectedOption]
    };
  }

  selectOption() {
    this.emit('optionChosen', this.getSelectedOption());
  }

  getState() {
    return {
      ...super.getState(),
      selectedOption: this.selectedOption,
      menuOptions: this.menuOptions
    };
  }
}