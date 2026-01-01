import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Background - sky blue theme for Cloud Town
    this.cameras.main.setBackgroundColor('#87CEEB');
    
    // Loading text
    const loadingText = this.add.text(width / 2, height / 2 - 50, '☁️ Cloud Town ☁️', {
      fontFamily: 'Arial',
      fontSize: '48px',
      color: '#2c5aa0',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    const progressText = this.add.text(width / 2, height / 2 + 20, 'Gathering clouds...', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#4a7ab8',
    }).setOrigin(0.5);
    
    // Progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x5a5a3a, 0.3);
    progressBox.fillRect(width / 2 - 160, height / 2 + 50, 320, 20);
    
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x5a5a3a, 1);
      progressBar.fillRect(width / 2 - 156, height / 2 + 54, 312 * value, 12);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
    });
    
    // Generate placeholder assets programmatically
    this.createPlaceholderAssets();
  }

  createPlaceholderAssets() {
    // Create tileset texture
    const tileSize = 32;
    const tilesetCanvas = document.createElement('canvas');
    tilesetCanvas.width = 128;
    tilesetCanvas.height = 128;
    const ctx = tilesetCanvas.getContext('2d');
    
    // Grass tile (0,0)
    ctx.fillStyle = '#c9c484';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#b8b374';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(Math.random() * 28 + 2, Math.random() * 28 + 2, 2, 2);
    }
    
    // Path tile (32,0)
    ctx.fillStyle = '#d4c99a';
    ctx.fillRect(32, 0, 32, 32);
    ctx.fillStyle = '#c4b98a';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(32 + Math.random() * 28 + 2, Math.random() * 28 + 2, 3, 3);
    }
    
    // Darker grass (64,0)
    ctx.fillStyle = '#a8a464';
    ctx.fillRect(64, 0, 32, 32);
    
    // Water tile (96,0)
    ctx.fillStyle = '#7ba3c4';
    ctx.fillRect(96, 0, 32, 32);
    ctx.fillStyle = '#8bb3d4';
    ctx.fillRect(100, 8, 20, 4);
    ctx.fillRect(98, 20, 24, 4);
    
    this.textures.addCanvas('tileset', tilesetCanvas);
    
    // Create player spritesheet with proper frames - Cloud Person character
    const playerCanvas = document.createElement('canvas');
    playerCanvas.width = 128;
    playerCanvas.height = 128;
    const pctx = playerCanvas.getContext('2d');
    
    // Draw 4 directions x 4 frames = 16 frames (32x32 each)
    // Cloud person - fluffy white character with blue accents
    for (let row = 0; row < 4; row++) {
      for (let frame = 0; frame < 4; frame++) {
        const x = frame * 32;
        const y = row * 32;
        const bounce = frame % 2 === 0 ? 0 : -2;
        
        // Shadow
        pctx.fillStyle = 'rgba(0,0,0,0.2)';
        pctx.beginPath();
        pctx.ellipse(x + 16, y + 30, 8, 3, 0, 0, Math.PI * 2);
        pctx.fill();
        
        // Body (fluffy cloud shape)
        pctx.fillStyle = '#ffffff';
        pctx.beginPath();
        pctx.ellipse(x + 16, y + 22 + bounce, 10, 8, 0, 0, Math.PI * 2);
        pctx.fill();
        
        // Head (round fluffy)
        pctx.beginPath();
        pctx.arc(x + 16, y + 12 + bounce, 10, 0, Math.PI * 2);
        pctx.fill();
        
        // Cloud puffs on head
        pctx.beginPath();
        pctx.arc(x + 10, y + 8 + bounce, 5, 0, Math.PI * 2);
        pctx.fill();
        pctx.beginPath();
        pctx.arc(x + 22, y + 8 + bounce, 5, 0, Math.PI * 2);
        pctx.fill();
        pctx.beginPath();
        pctx.arc(x + 16, y + 5 + bounce, 5, 0, Math.PI * 2);
        pctx.fill();
        
        // Face based on direction
        if (row !== 3) { // Not facing up
          // Eyes
          pctx.fillStyle = '#2c5aa0';
          pctx.beginPath();
          pctx.arc(x + 12, y + 12 + bounce, 2, 0, Math.PI * 2);
          pctx.fill();
          pctx.beginPath();
          pctx.arc(x + 20, y + 12 + bounce, 2, 0, Math.PI * 2);
          pctx.fill();
          
          // Eye shine
          pctx.fillStyle = '#ffffff';
          pctx.fillRect(x + 11, y + 11 + bounce, 1, 1);
          pctx.fillRect(x + 19, y + 11 + bounce, 1, 1);
          
          // Blush
          pctx.fillStyle = '#ffb6c1';
          pctx.beginPath();
          pctx.ellipse(x + 8, y + 15 + bounce, 2, 1, 0, 0, Math.PI * 2);
          pctx.fill();
          pctx.beginPath();
          pctx.ellipse(x + 24, y + 15 + bounce, 2, 1, 0, 0, Math.PI * 2);
          pctx.fill();
          
          // Smile
          pctx.strokeStyle = '#2c5aa0';
          pctx.lineWidth = 1;
          pctx.beginPath();
          pctx.arc(x + 16, y + 14 + bounce, 3, 0.1 * Math.PI, 0.9 * Math.PI);
          pctx.stroke();
        }
        
        // Scarf (blue)
        pctx.fillStyle = '#5c9ece';
        pctx.fillRect(x + 10, y + 18 + bounce, 12, 3);
        pctx.fillRect(x + 18, y + 18 + bounce, 3, 8);
      }
    }
    
    // Add as spritesheet with frame dimensions
    this.textures.addSpriteSheet('player', playerCanvas, { frameWidth: 32, frameHeight: 32 });
    // Create tree sprite - Cherry blossom style for Cloud Town
    const treeCanvas = document.createElement('canvas');
    treeCanvas.width = 64;
    treeCanvas.height = 80;
    const tctx = treeCanvas.getContext('2d');
    
    // Shadow
    tctx.fillStyle = 'rgba(0,0,0,0.15)';
    tctx.beginPath();
    tctx.ellipse(32, 78, 20, 5, 0, 0, Math.PI * 2);
    tctx.fill();
    
    // Trunk
    tctx.fillStyle = '#6d4c41';
    tctx.fillRect(26, 50, 12, 28);
    tctx.fillStyle = '#5d4037';
    tctx.fillRect(26, 50, 4, 28);
    
    // Foliage (pink cherry blossom / cloud-like)
    tctx.fillStyle = '#ffb7c5';
    tctx.beginPath();
    tctx.arc(32, 32, 26, 0, Math.PI * 2);
    tctx.fill();
    
    tctx.fillStyle = '#ffc1cc';
    tctx.beginPath();
    tctx.arc(20, 28, 16, 0, Math.PI * 2);
    tctx.fill();
    
    tctx.fillStyle = '#ffcdd2';
    tctx.beginPath();
    tctx.arc(44, 30, 14, 0, Math.PI * 2);
    tctx.fill();
    
    tctx.fillStyle = '#ffd7dc';
    tctx.beginPath();
    tctx.arc(32, 18, 12, 0, Math.PI * 2);
    tctx.fill();
    
    // Flower petals
    tctx.fillStyle = '#fff';
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = 10 + Math.random() * 16;
      const sx = 32 + Math.cos(angle) * r;
      const sy = 28 + Math.sin(angle) * r;
      tctx.beginPath();
      tctx.arc(sx, sy, 2 + Math.random() * 2, 0, Math.PI * 2);
      tctx.fill();
    }
    
    this.textures.addCanvas('tree', treeCanvas);
    
    // Create building sprite (coffee shop style)
    const buildingCanvas = document.createElement('canvas');
    buildingCanvas.width = 128;
    buildingCanvas.height = 128;
    const bctx = buildingCanvas.getContext('2d');
    
    // Roof
    bctx.fillStyle = '#cd5c5c';
    bctx.fillRect(8, 20, 112, 30);
    
    // Roof stripes
    bctx.fillStyle = '#b84848';
    for (let i = 0; i < 10; i++) {
      bctx.fillRect(12 + i * 11, 20, 5, 30);
    }
    
    // Building body
    bctx.fillStyle = '#8b4513';
    bctx.fillRect(16, 50, 96, 70);
    
    // Window
    bctx.fillStyle = '#87ceeb';
    bctx.fillRect(28, 60, 30, 25);
    bctx.fillRect(70, 60, 30, 25);
    
    // Window frames
    bctx.fillStyle = '#654321';
    bctx.fillRect(28, 71, 30, 3);
    bctx.fillRect(41, 60, 3, 25);
    bctx.fillRect(70, 71, 30, 3);
    bctx.fillRect(83, 60, 3, 25);
    
    // Door
    bctx.fillStyle = '#4a2810';
    bctx.fillRect(52, 90, 24, 30);
    
    // Door handle
    bctx.fillStyle = '#ffd700';
    bctx.fillRect(70, 105, 4, 4);
    
    // Sign
    bctx.fillStyle = '#f5deb3';
    bctx.fillRect(35, 95, 15, 8);
    
    this.textures.addCanvas('building', buildingCanvas);
    
    // Create bench sprite
    const benchCanvas = document.createElement('canvas');
    benchCanvas.width = 48;
    benchCanvas.height = 32;
    const benchCtx = benchCanvas.getContext('2d');
    
    // Seat
    benchCtx.fillStyle = '#8b4513';
    benchCtx.fillRect(4, 12, 40, 8);
    
    // Legs
    benchCtx.fillStyle = '#654321';
    benchCtx.fillRect(8, 20, 6, 10);
    benchCtx.fillRect(34, 20, 6, 10);
    
    // Back
    benchCtx.fillRect(4, 4, 40, 4);
    benchCtx.fillRect(6, 8, 4, 8);
    benchCtx.fillRect(38, 8, 4, 8);
    
    this.textures.addCanvas('bench', benchCanvas);

    // Create bush sprite
    const bushCanvas = document.createElement('canvas');
    bushCanvas.width = 32;
    bushCanvas.height = 32;
    const bushCtx = bushCanvas.getContext('2d');
    
    bushCtx.fillStyle = '#228b22';
    bushCtx.beginPath();
    bushCtx.arc(16, 20, 14, 0, Math.PI * 2);
    bushCtx.fill();
    
    bushCtx.fillStyle = '#32cd32';
    bushCtx.beginPath();
    bushCtx.arc(10, 16, 8, 0, Math.PI * 2);
    bushCtx.fill();
    
    bushCtx.beginPath();
    bushCtx.arc(22, 18, 7, 0, Math.PI * 2);
    bushCtx.fill();
    
    this.textures.addCanvas('bush', bushCanvas);
    
    // Create flower sprite
    const flowerCanvas = document.createElement('canvas');
    flowerCanvas.width = 16;
    flowerCanvas.height = 16;
    const fctx = flowerCanvas.getContext('2d');
    
    // Stem
    fctx.fillStyle = '#228b22';
    fctx.fillRect(7, 8, 2, 8);
    
    // Petals
    fctx.fillStyle = '#ff69b4';
    fctx.fillRect(4, 2, 3, 3);
    fctx.fillRect(9, 2, 3, 3);
    fctx.fillRect(4, 7, 3, 3);
    fctx.fillRect(9, 7, 3, 3);
    
    // Center
    fctx.fillStyle = '#ffd700';
    fctx.fillRect(6, 4, 4, 4);
    
    this.textures.addCanvas('flower', flowerCanvas);
  }

  create() {
    // Small delay for effect, then start game
    this.time.delayedCall(500, () => {
      this.scene.start('GameScene');
    });
  }
}
