import * as Phaser from 'phaser';
import {
  TilesetSprite,
  CharacterSprite,
  TreeSprite,
  HouseSprite,
  TableSprite,
  BushSprite,
  FlowerSprite,
} from '../sprites';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Generate placeholder assets programmatically
    this.createPlaceholderAssets();
  }

  createPlaceholderAssets() {
    // Create all sprites using the modular sprite system
    // Each sprite is now in its own file for easy modification
    
    // Ground tiles (grass, path, water, etc.)
    const tileset = new TilesetSprite(this);
    tileset.create();
    
    // Player character (cloud person)
    const character = new CharacterSprite(this);
    character.create();
    
    // Tree (cherry blossom)
    const tree = new TreeSprite(this);
    tree.create();
    
    // House/Building
    const house = new HouseSprite(this);
    house.create();
    
    // Table/Bench
    const table = new TableSprite(this);
    table.create();
    
    // Bush
    const bush = new BushSprite(this);
    bush.create();
    
    // Flower
    const flower = new FlowerSprite(this);
    flower.create();
  }

  create() {
    // Show loading screen for 1.5 seconds before starting game
    this.time.delayedCall(1500, () => {
      this.scene.start('GameScene');
    });
  }
}
