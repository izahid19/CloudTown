import Phaser from 'phaser';

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    
    // Create sprite with the first frame
    this.sprite = scene.physics.add.sprite(x, y, 'player', 0);
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setSize(20, 12);
    this.sprite.setOffset(6, 20);
    
    // Movement speed
    this.speed = 150;
    
    // Create animations
    this.createAnimations();
    
    // Setup controls
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    
    // Current direction
    this.direction = 'down';
    this.isMoving = false;
  }

  createAnimations() {
    const scene = this.scene;
    
    // Frame layout: 4x4 grid (4 columns, 4 rows)
    // Row 0 (frames 0-3): Down
    // Row 1 (frames 4-7): Left
    // Row 2 (frames 8-11): Right
    // Row 3 (frames 12-15): Up
    
    // Down animation
    if (!scene.anims.exists('walk-down')) {
      scene.anims.create({
        key: 'walk-down',
        frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    
    // Left animation
    if (!scene.anims.exists('walk-left')) {
      scene.anims.create({
        key: 'walk-left',
        frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    
    // Right animation
    if (!scene.anims.exists('walk-right')) {
      scene.anims.create({
        key: 'walk-right',
        frames: scene.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    
    // Up animation
    if (!scene.anims.exists('walk-up')) {
      scene.anims.create({
        key: 'walk-up',
        frames: scene.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    
    // Idle animations (first frame of each direction)
    const idleFrames = { down: 0, left: 4, right: 8, up: 12 };
    Object.entries(idleFrames).forEach(([dir, frame]) => {
      if (!scene.anims.exists(`idle-${dir}`)) {
        scene.anims.create({
          key: `idle-${dir}`,
          frames: [{ key: 'player', frame: frame }],
          frameRate: 1,
        });
      }
    });
  }

  update() {
    // Get input
    const leftDown = this.cursors.left.isDown || this.wasd.left.isDown;
    const rightDown = this.cursors.right.isDown || this.wasd.right.isDown;
    const upDown = this.cursors.up.isDown || this.wasd.up.isDown;
    const downDown = this.cursors.down.isDown || this.wasd.down.isDown;
    
    // Calculate velocity
    let vx = 0;
    let vy = 0;
    
    if (leftDown) vx -= 1;
    if (rightDown) vx += 1;
    if (upDown) vy -= 1;
    if (downDown) vy += 1;
    
    // Normalize diagonal movement
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }
    
    // Apply velocity
    this.sprite.setVelocity(vx * this.speed, vy * this.speed);
    
    // Handle animations and direction
    const wasMoving = this.isMoving;
    this.isMoving = vx !== 0 || vy !== 0;
    
    if (this.isMoving) {
      // Determine direction
      if (Math.abs(vx) > Math.abs(vy)) {
        this.direction = vx > 0 ? 'right' : 'left';
      } else {
        this.direction = vy > 0 ? 'down' : 'up';
      }
      
      // Play walk animation for current direction
      this.sprite.anims.play(`walk-${this.direction}`, true);
    } else {
      // Play idle animation when stopped
      if (wasMoving) {
        this.sprite.anims.play(`idle-${this.direction}`, true);
      }
    }
  }
}
