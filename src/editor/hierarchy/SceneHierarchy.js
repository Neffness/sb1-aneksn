import { GameObject } from '../../scene/objects/GameObject.js';
import { EventEmitter } from '../../utils/EventEmitter.js';

export class SceneHierarchy extends EventEmitter {
  constructor(scene) {
    super();
    this.scene = scene;
    this.container = this.createContainer();
    this.selectedActor = null;
  }

  createContainer() {
    const container = document.createElement('div');
    container.style.cssText = `
      max-height: 200px;
      overflow-y: auto;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      padding: 5px;
    `;

    this.refreshHierarchy(container);
    return container;
  }

  refreshHierarchy(container = this.container) {
    container.innerHTML = '';
    const actors = this.getSceneActors();
    
    actors.forEach(actor => {
      const item = this.createActorItem(actor);
      container.appendChild(item);
    });
  }

  createActorItem(actor) {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 5px;
      cursor: pointer;
      border-radius: 3px;
      margin-bottom: 2px;
      background: ${this.selectedActor === actor ? '#3498db' : '#2c3e50'};
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    // Create name span
    const nameSpan = document.createElement('span');
    nameSpan.textContent = actor.constructor.name;
    nameSpan.style.flexGrow = '1';
    nameSpan.addEventListener('click', () => {
      this.selectedActor = actor;
      this.emit('actorSelected', actor);
      this.refresh();
    });

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '×';
    deleteButton.style.cssText = `
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 3px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
      margin-left: 5px;
      padding: 0;
      font-size: 14px;
    `;
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.deleteActor(actor);
    });

    item.appendChild(nameSpan);
    item.appendChild(deleteButton);

    return item;
  }

  deleteActor(actor) {
    if (actor && actor.getMesh()) {
      // Remove from scene
      this.scene.get().remove(actor.getMesh());
      
      // Clear selection if this was the selected actor
      if (this.selectedActor === actor) {
        this.emit('actorSelected', null);
        this.selectedActor = null;
      }

      // Save updated actors
      this.emit('actorDeleted', actor);
      
      // Refresh the hierarchy
      this.refresh();
    }
  }

  getSceneActors() {
    const actors = [];
    this.scene.get().traverse((object) => {
      if (object.userData.actor) {
        actors.push(object.userData.actor);
      }
    });
    return actors;
  }

  refresh() {
    this.refreshHierarchy();
  }

  getContainer() {
    return this.container;
  }

  update() {
    // Add any update logic here if needed
  }
}