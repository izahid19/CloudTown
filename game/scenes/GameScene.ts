import * as Phaser from 'phaser';
import Player from '../entities/Player';
import RemotePlayer from '../entities/RemotePlayer';
import NetworkManager from '../multiplayer/NetworkManager';
import type { MultiplayerMessage, PlayerData } from '../multiplayer/types';

export default class GameScene extends Phaser.Scene {
  worldWidth: number;
  worldHeight: number;
  currentZoom: number;
  minZoom: number;
  maxZoom: number;
  player!: Player;
  obstacles!: Phaser.Physics.Arcade.StaticGroup;
  decorations!: Phaser.GameObjects.Group;
  minimapCamera!: Phaser.Cameras.Scene2D.Camera;
  zoomDisplay?: HTMLDivElement;
  minimapWidth!: number;
  minimapHeight!: number;
  minimapPadding!: number;

  // Multiplayer
  networkManager!: NetworkManager;
  remotePlayers: Map<string, RemotePlayer> = new Map();

  constructor() {
    super({ key: 'GameScene' });
    this.worldWidth = 1600;
    this.worldHeight = 1200;
    this.currentZoom = 2.5; // Default 250%
    this.minZoom = 1.5; // Changed from 1.0 to 1.5 as requested
    this.maxZoom = 4.0; // Allowed slightly closer zoom
  }

  create() {
    // Get multiplayer data from registry
    const roomId = this.registry.get('roomId') || 'default';
    const userId = this.registry.get('userId') || `guest-${Date.now()}`;
    const userName = this.registry.get('userName') || 'Guest';
    const userImage = this.registry.get('userImage');
    const userProfile = this.registry.get('userProfile');

    // Initialize network manager
    this.networkManager = new NetworkManager(roomId, userId, userName, userImage, userProfile);

    // Watch for profile updates from UI
    this.events.on('update', () => {
       const win = window as unknown as { getMyProfile?: () => any };
       if (win.getMyProfile) {
         const currentProfile = win.getMyProfile();
         // If username changed or something else, we might trigger update
         // Ideally GameClient calls a function on window that we hook into
       }
    });
    
    // Instead of polling, let's expose a function for GameClient to call
    (window as any).updateGameProfile = (profile: any) => {
       this.networkManager.updateProfile(profile);
       if (this.player) {
         // Update local player name if needed? 
         // Player class doesn't show name tag but we might want to
       }
    };
    
    // Connect async (don't block scene creation)
    this.networkManager.connect().catch((err) => {
      console.error('[GameScene] Network connection failed:', err);
    });

    // Listen for multiplayer messages
    this.networkManager.onMessage((message: MultiplayerMessage) => {
      this.handleNetworkMessage(message);
    });

    // Set world bounds
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
    
    // Create tilemap programmatically
    this.createTileMap(this.worldWidth, this.worldHeight);
    
    // Create decorative objects
    this.createDecorations();
    
    // Create player with random spawn offset to prevent overlap
    const spawnOffsetX = Math.floor(Math.random() * 200) - 100; // -100 to +100
    const spawnOffsetY = Math.floor(Math.random() * 200) - 100;
    this.player = new Player(this, 800 + spawnOffsetX, 600 + spawnOffsetY);
    
    // Add collision between player and obstacles
    this.physics.add.collider(this.player.sprite, this.obstacles);
    
    // Setup main camera
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    this.cameras.main.setZoom(this.currentZoom);
    
    // Add ambient particles (floating leaves)
    this.createAmbientParticles();
    
    // Create minimap
    this.createMinimap();
    
    // Create zoom controls
    this.createZoomControls();
    
    // Setup keyboard zoom controls
    this.setupZoomKeys();

    // Emit game-started event to notify UI (GameClient)
    this.game.events.emit('game-started');

    // Clean up on scene shutdown
    this.events.on('shutdown', () => {
      this.networkManager.disconnect();
    });
  }

  handleNetworkMessage(message: MultiplayerMessage) {
    switch (message.type) {
      case 'player-join':
        this.addRemotePlayer(message.data);
        break;
      case 'player-leave':
        this.removeRemotePlayer(message.data.id);
        break;
      case 'player-update':
        this.updateRemotePlayer(message.data);
        break;
      case 'object-interaction':
        // Handle shared object interactions
        console.log(`Player ${message.data.playerId} interacted with ${message.data.objectId}`);
        break;
      case 'self-profile-update':
        console.log('[GameScene] Updating local profile from server');
        const win = window as unknown as { updateMyProfileFromGame?: (profile: any) => void };
        if (win.updateMyProfileFromGame) {
          win.updateMyProfileFromGame(message.data);
        }
        break;
    }
  }

  addRemotePlayer(data: PlayerData) {
    if (data.id === this.networkManager.getUserId()) return;
    if (this.remotePlayers.has(data.id)) return;

    const remotePlayer = new RemotePlayer(this, data);
    this.remotePlayers.set(data.id, remotePlayer);
    
    // Add collision between local player and remote player
    this.physics.add.collider(this.player.sprite, remotePlayer.getSprite());
    
    // Update player count in UI (1 = self + remotePlayers count)
    this.updatePlayerCountUI();
    
    console.log(`[GameScene] Player joined: ${data.name}`);
  }

  removeRemotePlayer(id: string) {
    const remotePlayer = this.remotePlayers.get(id);
    if (remotePlayer) {
      remotePlayer.destroy();
      this.remotePlayers.delete(id);
      
      // Update player count in UI
      this.updatePlayerCountUI();
      
      console.log(`[GameScene] Player left: ${id}`);
    }
  }

  updateRemotePlayer(data: PlayerData) {
    if (data.id === this.networkManager.getUserId()) return;

    let remotePlayer = this.remotePlayers.get(data.id);
    if (!remotePlayer) {
      // Player not found, add them
      remotePlayer = new RemotePlayer(this, data);
      this.remotePlayers.set(data.id, remotePlayer);
      // Add collision between local player and remote player
      this.physics.add.collider(this.player.sprite, remotePlayer.getSprite());
      // Update player count
      this.updatePlayerCountUI();
    } else {
      remotePlayer.updateFromNetwork(data);
    }
  }

  updatePlayerCountUI() {
    // Count = 1 (self) + number of remote players
    const totalPlayers = 1 + this.remotePlayers.size;
    
    // Call the global updatePlayerCount function if it exists
    const win = window as unknown as { updatePlayerCount?: (count: number) => void };
    if (win.updatePlayerCount) {
      win.updatePlayerCount(totalPlayers);
    }
  }

  createMinimap() {
    // Minimap dimensions - smaller on mobile
    const isMobile = window.innerWidth < 768;
    const minimapWidth = isMobile ? 100 : 180;
    const minimapHeight = isMobile ? 75 : 135;
    const padding = 16;
    
    // Get actual viewport width
    const viewportWidth = window.innerWidth;
    
    // Create minimap camera
    this.minimapCamera = this.cameras.add(
      viewportWidth - minimapWidth - padding,
      padding,
      minimapWidth,
      minimapHeight
    );
    
    // Configure minimap
    this.minimapCamera.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.minimapCamera.setZoom(minimapWidth / this.worldWidth);
    this.minimapCamera.setBackgroundColor(0x1a1a2e);
    this.minimapCamera.startFollow(this.player.sprite);
    this.minimapCamera.setName('minimap');
    
    // Create minimap border using HTML
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;

    const minimapContainer = document.createElement('div');
    minimapContainer.id = 'minimap-border';
    minimapContainer.style.cssText = `
      position: absolute;
      top: ${padding - 2}px;
      right: ${padding - 2}px;
      width: ${minimapWidth + 4}px;
      height: ${minimapHeight + 4}px;
      border: 3px solid #5a5a3a;
      border-radius: 4px;
      pointer-events: none;
      z-index: 999;
    `;
    gameContainer.appendChild(minimapContainer);
    
    // Store for resize handling
    this.minimapWidth = minimapWidth;
    this.minimapHeight = minimapHeight;
    this.minimapPadding = padding;
  }

  createZoomControls() {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;

    // Calculate position below minimap
    const topPos = (this.minimapHeight || 135) + (this.minimapPadding || 16) + 16;
    const rightPos = this.minimapPadding || 16;
    
    const container = document.createElement('div');
    container.id = 'zoom-controls';
    container.style.cssText = `
      position: absolute;
      top: ${topPos}px;
      right: ${rightPos}px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 1000;
      font-family: Arial, sans-serif;
      align-items: center;
    `;
    
    // Zoom in button
    const zoomInBtn = document.createElement('button');
    zoomInBtn.textContent = '+';
    zoomInBtn.style.cssText = `
      width: 44px;
      height: 44px;
      font-size: 24px;
      font-weight: bold;
      background: rgba(255, 255, 255, 0.9);
      border: 2px solid #5a5a3a;
      border-radius: 8px;
      color: #5a5a3a;
      cursor: pointer;
      transition: all 0.2s;
    `;
    zoomInBtn.addEventListener('click', () => this.zoomIn());
    zoomInBtn.addEventListener('mouseenter', () => zoomInBtn.style.background = '#e8e8e0');
    zoomInBtn.addEventListener('mouseleave', () => zoomInBtn.style.background = 'rgba(255, 255, 255, 0.9)');
    
    // Zoom out button
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.textContent = '−';
    zoomOutBtn.style.cssText = `
      width: 44px;
      height: 44px;
      font-size: 24px;
      font-weight: bold;
      background: rgba(255, 255, 255, 0.9);
      border: 2px solid #5a5a3a;
      border-radius: 8px;
      color: #5a5a3a;
      cursor: pointer;
      transition: all 0.2s;
    `;
    zoomOutBtn.addEventListener('click', () => this.zoomOut());
    zoomOutBtn.addEventListener('mouseenter', () => zoomOutBtn.style.background = '#e8e8e0');
    zoomOutBtn.addEventListener('mouseleave', () => zoomOutBtn.style.background = 'rgba(255, 255, 255, 0.9)');
    
    // Zoom percentage display
    this.zoomDisplay = document.createElement('div');
    this.zoomDisplay.style.cssText = `
      text-align: center;
      font-size: 12px;
      color: #5a5a3a;
      background: rgba(255, 255, 255, 0.8);
      padding: 4px 8px;
      border-radius: 4px;
    `;
    this.zoomDisplay.textContent = `${Math.round(this.currentZoom * 100)}%`;
    
    container.appendChild(zoomInBtn);
    container.appendChild(zoomOutBtn);
    container.appendChild(this.zoomDisplay);
    
    gameContainer.appendChild(container);
  }

  setupZoomKeys() {
    // Q to zoom out, E to zoom in
    this.input.keyboard!.on('keydown-Q', () => this.zoomOut());
    this.input.keyboard!.on('keydown-E', () => this.zoomIn());
    
    // Mouse wheel zoom
    this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: unknown[], _deltaX: number, deltaY: number) => {
      if (deltaY > 0) {
        this.zoomOut();
      } else if (deltaY < 0) {
        this.zoomIn();
      }
    });
  }

  zoomIn() {
    this.currentZoom = Math.min(this.currentZoom + 0.25, this.maxZoom);
    this.cameras.main.setZoom(this.currentZoom);
    this.updateZoomText();
  }

  zoomOut() {
    this.currentZoom = Math.max(this.currentZoom - 0.25, this.minZoom);
    this.cameras.main.setZoom(this.currentZoom);
    this.updateZoomText();
  }

  updateZoomText() {
    if (this.zoomDisplay) {
      this.zoomDisplay.textContent = `${Math.round(this.currentZoom * 100)}%`;
    }
  }

  createTileMap(width: number, height: number) {
    const tileSize = 32;
    const cols = Math.ceil(width / tileSize);
    const rows = Math.ceil(height / tileSize);
    
    // Create a graphics object for the ground
    const groundLayer = this.add.graphics();
    
    // Draw base ground - soft mint/sky blue theme
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = x * tileSize;
        const py = y * tileSize;
        
        // Vary ground color slightly
        const noise = Math.sin(x * 0.3) * Math.cos(y * 0.3);
        if (noise > 0.5) {
          groundLayer.fillStyle(0x98d4bb);
        } else if (noise < -0.3) {
          groundLayer.fillStyle(0xc5e8d5);
        } else {
          groundLayer.fillStyle(0xb0dfc6);
        }
        groundLayer.fillRect(px, py, tileSize, tileSize);
        
        // Add some ground detail
        if (Math.random() > 0.85) {
          groundLayer.fillStyle(0xffffff);
          groundLayer.fillRect(px + Math.random() * 24 + 4, py + Math.random() * 24 + 4, 3, 3);
        }
      }
    }
    
    // Create paths
    this.createPaths(groundLayer, tileSize, width, height);
  }

  createPaths(graphics: Phaser.GameObjects.Graphics, tileSize: number, width: number, height: number) {
    // Main horizontal path
    const pathY = Math.floor(height / 2 / tileSize) * tileSize;
    for (let x = 0; x < width; x += tileSize) {
      graphics.fillStyle(0xf0e6ff);
      graphics.fillRect(x, pathY - tileSize, tileSize, tileSize * 3);
      
      // Path texture
      graphics.fillStyle(0xe0d4f0);
      if (Math.random() > 0.7) {
        graphics.fillRect(x + 8, pathY - tileSize + 8, 6, 6);
      }
    }
    
    // Vertical path
    const pathX = Math.floor(width / 2 / tileSize) * tileSize;
    for (let y = 0; y < height; y += tileSize) {
      graphics.fillStyle(0xf0e6ff);
      graphics.fillRect(pathX - tileSize, y, tileSize * 3, tileSize);
    }
  }

  createDecorations() {
    // Create obstacles group for collision
    this.obstacles = this.physics.add.staticGroup();
    
    // Trees group for depth sorting
    this.decorations = this.add.group();
    
    // Path bounds for avoiding flower placement
    const pathY = this.worldHeight / 2;
    const pathX = this.worldWidth / 2;
    const pathWidth = 96;
    
    // Helper to check if position is on a path
    const isOnPath = (x: number, y: number) => {
      const onHorizontalPath = Math.abs(y - pathY) < pathWidth;
      const onVerticalPath = Math.abs(x - pathX) < pathWidth;
      return onHorizontalPath || onVerticalPath;
    };
    
    // Place trees around the map
    const treePositions = [
      { x: 200, y: 150 }, { x: 350, y: 200 }, { x: 150, y: 350 },
      { x: 450, y: 180 }, { x: 280, y: 450 }, { x: 520, y: 350 },
      { x: 180, y: 700 }, { x: 400, y: 750 }, { x: 600, y: 680 },
      { x: 1000, y: 200 }, { x: 1150, y: 350 }, { x: 1300, y: 180 },
      { x: 1100, y: 500 }, { x: 1350, y: 650 }, { x: 1200, y: 800 },
      { x: 250, y: 950 }, { x: 450, y: 1050 }, { x: 700, y: 900 },
      { x: 950, y: 1000 }, { x: 1150, y: 950 }, { x: 1400, y: 1050 },
    ];
    
    treePositions.forEach(pos => {
      const tree = this.add.image(pos.x, pos.y, 'tree');
      tree.setOrigin(0.5, 1);
      tree.setDepth(pos.y);
      this.decorations.add(tree);
      
      // Add collision body for tree trunk
      const treeCollider = this.add.rectangle(pos.x, pos.y - 15, 24, 30);
      this.physics.add.existing(treeCollider, true);
      this.obstacles.add(treeCollider);
      
      // Add subtle animation
      this.tweens.add({
        targets: tree,
        scaleX: 1.02,
        scaleY: 0.98,
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
    
    // Place building (coffee shop)
    const building = this.add.image(1400, 350, 'building');
    building.setOrigin(0.5, 1);
    building.setDepth(350);
    building.setScale(1.5);
    this.decorations.add(building);
    
    // Add collision for building
    const buildingCollider = this.add.rectangle(1400, 300, 150, 100);
    this.physics.add.existing(buildingCollider, true);
    this.obstacles.add(buildingCollider);
    
    // Place benches
    const benchPositions = [
      { x: 700, y: 550 }, { x: 900, y: 550 },
      { x: 700, y: 680 }, { x: 900, y: 680 },
    ];
    
    benchPositions.forEach(pos => {
      const bench = this.add.image(pos.x, pos.y, 'bench');
      bench.setOrigin(0.5, 1);
      bench.setDepth(pos.y);
      this.decorations.add(bench);
      
      // Add collision for bench
      const benchCollider = this.add.rectangle(pos.x, pos.y - 10, 44, 20);
      this.physics.add.existing(benchCollider, true);
      this.obstacles.add(benchCollider);
    });
    
    // Place bushes
    const bushPositions = [
      { x: 100, y: 200 }, { x: 130, y: 220 },
      { x: 1450, y: 450 }, { x: 1480, y: 420 },
      { x: 300, y: 800 }, { x: 330, y: 820 },
      { x: 1200, y: 1100 }, { x: 1230, y: 1080 },
    ];
    
    bushPositions.forEach(pos => {
      const bush = this.add.image(pos.x, pos.y, 'bush');
      bush.setOrigin(0.5, 1);
      bush.setDepth(pos.y);
      this.decorations.add(bush);
      
      // Add collision for bush
      const bushCollider = this.add.rectangle(pos.x, pos.y - 10, 28, 20);
      this.physics.add.existing(bushCollider, true);
      this.obstacles.add(bushCollider);
    });
    
    // Place flowers randomly - avoid paths!
    for (let i = 0; i < 30; i++) {
      let x, y;
      let attempts = 0;
      do {
        x = Math.random() * 1500 + 50;
        y = Math.random() * 1100 + 50;
        attempts++;
      } while (isOnPath(x, y) && attempts < 20);
      
      // Skip if still on path after attempts
      if (isOnPath(x, y)) continue;
      
      const flower = this.add.image(x, y, 'flower');
      flower.setOrigin(0.5, 1);
      flower.setDepth(y);
      
      // Gentle sway animation
      this.tweens.add({
        targets: flower,
        angle: { from: -5, to: 5 },
        duration: 1500 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  createAmbientParticles() {
    // Create simple leaf particles using graphics
    const leafGraphics = this.add.graphics();
    leafGraphics.fillStyle(0xdaa520, 0.6);
    leafGraphics.fillRect(0, 0, 4, 4);
    leafGraphics.generateTexture('leaf', 4, 4);
    leafGraphics.destroy();
    
    // Emit leaves across the visible area
    const particles = this.add.particles(0, 0, 'leaf', {
      x: { min: 0, max: 1600 },
      y: -10,
      lifespan: 8000,
      speedX: { min: -20, max: 20 },
      speedY: { min: 20, max: 40 },
      angle: { min: 0, max: 360 },
      rotate: { min: 0, max: 360 },
      scale: { start: 1, end: 0.5 },
      alpha: { start: 0.7, end: 0 },
      frequency: 500,
      quantity: 1,
    });
    particles.setDepth(999);
  }

  update() {
    if (this.player) {
      // Update player and get current state
      const playerState = this.player.update();
      
      // Update sprite depth based on Y position
      this.player.sprite.setDepth(this.player.sprite.y);

      // Broadcast player position to network
      this.networkManager.broadcastPlayerUpdate(playerState);
    }

    // Update all remote players
    this.remotePlayers.forEach((remotePlayer) => {
      remotePlayer.update();
    });
  }
}
