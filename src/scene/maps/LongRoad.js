import { Map } from '../objects/Map.js';
import { RoadSegment } from './longroad/RoadSegment.js';
import { Barrier } from './longroad/Barrier.js';
import { Milestone } from './longroad/Milestone.js';
import { Tree } from './longroad/Tree.js';

export class LongRoad extends Map {
  constructor() {
    super(100, 20, 1);
    this.setupRoadEnvironment();
  }

  setupRoadEnvironment() {
    this.createRoad();
    this.addBarriers();
    this.addMilestones();
    this.addTrees();
  }

  createRoad() {
    const road = new RoadSegment(this.width * this.cellSize, 8);
    this.mesh.add(road.getMesh());
  }

  addBarriers() {
    for (let x = -this.width / 2; x <= this.width / 2; x += 2) {
      const leftBarrier = new Barrier();
      leftBarrier.setPosition(x, 0.5, -4.5);
      this.mesh.add(leftBarrier.getMesh());

      const rightBarrier = new Barrier();
      rightBarrier.setPosition(x, 0.5, 4.5);
      this.mesh.add(rightBarrier.getMesh());
    }
  }

  addMilestones() {
    for (let x = -this.width / 2; x <= this.width / 2; x += 10) {
      const leftMilestone = new Milestone();
      leftMilestone.setPosition(x, 0.5, -5.5);
      this.mesh.add(leftMilestone.getMesh());

      const rightMilestone = new Milestone();
      rightMilestone.setPosition(x, 0.5, 5.5);
      this.mesh.add(rightMilestone.getMesh());
    }
  }

  addTrees() {
    const treePositions = this.generateTreePositions();
    treePositions.forEach(pos => {
      const tree = new Tree();
      tree.setPosition(pos.x, 0, pos.z);
      tree.setRotation(0, Math.random() * Math.PI * 2, 0);
      this.mesh.add(tree.getMesh());
    });
  }

  generateTreePositions() {
    const positions = [];
    const spacing = 5;
    
    for (let x = -this.width / 2; x <= this.width / 2; x += spacing) {
      const offset = Math.random() * 2 - 1;
      positions.push(
        { x: x + offset, z: -8 - Math.random() * 4 },
        { x: x + offset, z: 8 + Math.random() * 4 }
      );
    }
    
    return positions;
  }

  update() {
    super.update();
  }
}