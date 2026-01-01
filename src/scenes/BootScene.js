import Phaser from 'phaser';
import gsap from 'gsap';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Gradient background using graphics
    this.cameras.main.setBackgroundColor('#87CEEB');
    
    // Create floating clouds in background
    this.createFloatingClouds(width, height);
    
    // Responsive layout scaling
    const isMobile = width < 768;
    const titleSize = isMobile ? '36px' : '52px';
    const subtitleSize = isMobile ? '16px' : '20px';
    const barWidth = isMobile ? '280px' : '340px';
    const percentSize = isMobile ? '20px' : '24px';
    const titleOffset = isMobile ? 60 : 80;
    
    // Main title with GSAP animation
    const title = this.add.text(width / 2, height / 2 - titleOffset, '☁️ Cloud Town ☁️', {
      fontFamily: 'Arial',
      fontSize: titleSize,
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#2c5aa0',
      strokeThickness: isMobile ? 3 : 4,
      shadow: { offsetX: 3, offsetY: 3, color: '#1a4080', blur: 8, fill: true }
    }).setOrigin(0.5).setAlpha(0);
    
    // Animate title entrance
    gsap.to(title, {
      alpha: 1,
      y: height / 2 - (titleOffset - 20),
      duration: 1,
      ease: 'back.out(1.7)'
    });
    
    // Pulsing glow effect on title
    gsap.to(title, {
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    
    // Subtitle with typewriter effect simulation
    const subtitle = this.add.text(width / 2, height / 2, '', {
      fontFamily: 'Arial',
      fontSize: subtitleSize,
      color: '#2c5aa0',
    }).setOrigin(0.5);
    
    const subtitleText = '✨ Gathering clouds... ✨';
    let charIndex = 0;
    
    const typewriter = this.time.addEvent({
      delay: 80,
      callback: () => {
        subtitle.setText(subtitleText.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex >= subtitleText.length) {
          typewriter.destroy();
        }
      },
      repeat: subtitleText.length - 1
    });
    
    // Create progress bar using HTML DOM (more reliable than Phaser graphics)
    const progressContainer = document.createElement('div');
    progressContainer.id = 'loading-progress';
    progressContainer.style.cssText = `
      position: absolute;
      top: 55%;
      left: 50%;
      transform: translateX(-50%);
      width: ${barWidth};
      z-index: 1000;
      font-family: Arial, sans-serif;
    `;
    
    // Progress bar background
    const progressBg = document.createElement('div');
    progressBg.style.cssText = `
      width: 100%;
      height: 35px;
      background: rgba(255, 255, 255, 0.9);
      border: 3px solid #2c5aa0;
      border-radius: 20px;
      overflow: hidden;
    `;
    
    // Progress bar fill
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
      width: 0%;
      height: 100%;
      background: linear-gradient(to bottom, #5cb8e8, #2c5aa0);
      border-radius: 17px;
      transition: width 0.1s ease-out;
    `;
    progressBg.appendChild(progressFill);
    
    // Percentage text
    const percentText = document.createElement('div');
    percentText.style.cssText = `
      text-align: center;
      font-size: ${percentSize};
      font-weight: bold;
      color: #2c5aa0;
      margin-top: 15px;
    `;
    percentText.textContent = '0%';
    
    progressContainer.appendChild(progressBg);
    progressContainer.appendChild(percentText);
    document.getElementById('game-container').appendChild(progressContainer);
    
    // Loading tips
    const tips = [
      '💡 Use WASD or Arrow keys to move',
      '🔍 Press Q/E to zoom in and out',
      '🗺️ Check the minimap in the corner'
    ];
    
    const tipText = this.add.text(width / 2, height - 60, tips[0], {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#4a7ab8',
    }).setOrigin(0.5).setAlpha(0);
    
    gsap.to(tipText, { alpha: 1, duration: 0.5, delay: 1 });
    
    // Cycle through tips
    let tipIndex = 0;
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        tipIndex = (tipIndex + 1) % tips.length;
        gsap.to(tipText, {
          alpha: 0,
          duration: 0.3,
          onComplete: () => {
            tipText.setText(tips[tipIndex]);
            gsap.to(tipText, { alpha: 1, duration: 0.3 });
          }
        });
      },
      repeat: -1
    });
    
    // Animate progress bar 0% to 100% over 5.5 seconds
    const progress = { value: 0 };
    
    gsap.to(progress, {
      value: 100,
      duration: 5.5,
      ease: 'power1.inOut',
      delay: 0.3,
      onUpdate: () => {
        progressFill.style.width = `${progress.value}%`;
        percentText.textContent = `${Math.floor(progress.value)}%`;
      },
      onComplete: () => {
        // Fade out loading screen
        gsap.to(progressContainer, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => progressContainer.remove()
        });
      }
    });
    
    this.load.on('complete', () => {
      // Fade out Phaser elements
      gsap.to([title, subtitle, tipText], {
        alpha: 0,
        duration: 0.3,
        stagger: 0.05
      });
    });
    
    // Generate placeholder assets programmatically
    this.createPlaceholderAssets();
  }
  
  createFloatingClouds(width, height) {
    // Create cloud texture
    const cloudGraphics = this.add.graphics();
    cloudGraphics.fillStyle(0xffffff, 0.6);
    cloudGraphics.fillCircle(20, 20, 20);
    cloudGraphics.fillCircle(40, 15, 25);
    cloudGraphics.fillCircle(65, 20, 20);
    cloudGraphics.fillCircle(45, 30, 18);
    cloudGraphics.generateTexture('cloud', 90, 50);
    cloudGraphics.destroy();
    
    // Create multiple floating clouds
    for (let i = 0; i < 8; i++) {
      const cloud = this.add.image(
        Math.random() * (width + 200) - 100,
        Math.random() * height,
        'cloud'
      );
      cloud.setAlpha(0.4 + Math.random() * 0.3);
      cloud.setScale(0.5 + Math.random() * 1);
      cloud.setDepth(-1);
      
      // Animate cloud floating across screen - starts immediately
      gsap.to(cloud, {
        x: `+=${width + 200}`,
        duration: 15 + Math.random() * 10,
        repeat: -1,
        ease: 'none'
      });
      
      // Gentle bobbing motion
      gsap.to(cloud, {
        y: `+=${10 + Math.random() * 20}`,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
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
    // Show loading screen for 6 seconds before starting game
    this.time.delayedCall(6000, () => {
      this.scene.start('GameScene');
    });
  }
}
