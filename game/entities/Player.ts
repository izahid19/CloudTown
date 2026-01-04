import * as Phaser from 'phaser';

export default class Player {
  scene: Phaser.Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  speed: number;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  touchInput: { x: number; y: number; active: boolean };
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    
    // Create sprite with the first frame
    this.sprite = scene.physics.add.sprite(x, y, 'player', 0);
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setSize(20, 12);
    this.sprite.setOffset(6, 20);
    
    // Movement speed
    this.speed = 100;
    
    // Create animations
    this.createAnimations();
    
    // Setup keyboard controls
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasd = scene.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as {
      up: Phaser.Input.Keyboard.Key;
      down: Phaser.Input.Keyboard.Key;
      left: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
    };
    
    // Touch/mobile joystick input
    this.touchInput = { x: 0, y: 0, active: false };
    
    // Create virtual joystick for mobile
    if (this.isMobile()) {
      this.createVirtualJoystick();
    }
    
    // Current direction
    this.direction = 'down';
    this.isMoving = false;
  }
  
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || window.innerWidth < 768;
  }
  
  createVirtualJoystick() {
    // Create joystick container
    const joystickContainer = document.createElement('div');
    joystickContainer.id = 'virtual-joystick';
    joystickContainer.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 30px;
      width: 120px;
      height: 120px;
      border-radius: 60px;
      background: rgba(255, 255, 255, 0.5);
      border: 3px solid rgba(44, 90, 160, 0.7);
      z-index: 10000;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    `;
    
    // Create joystick knob
    const knob = document.createElement('div');
    knob.id = 'joystick-knob';
    knob.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50px;
      height: 50px;
      border-radius: 25px;
      background: rgba(44, 90, 160, 0.8);
      border: 2px solid #fff;
      pointer-events: none;
    `;
    joystickContainer.appendChild(knob);
    
    // Append to body for fixed positioning
    document.body.appendChild(joystickContainer);
    
    // Track joystick state
    const joystickRect = { centerX: 0, centerY: 0 };
    const maxDistance = 35;
    
    const updateJoystickPosition = () => {
      const rect = joystickContainer.getBoundingClientRect();
      joystickRect.centerX = rect.left + rect.width / 2;
      joystickRect.centerY = rect.top + rect.height / 2;
    };
    
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0] || e.changedTouches[0];
      updateJoystickPosition();
      
      let dx = touch.clientX - joystickRect.centerX;
      let dy = touch.clientY - joystickRect.centerY;
      
      // Limit distance
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > maxDistance) {
        dx = (dx / distance) * maxDistance;
        dy = (dy / distance) * maxDistance;
      }
      
      // Update knob position
      knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      
      // Normalize to -1 to 1 range
      this.touchInput.x = dx / maxDistance;
      this.touchInput.y = dy / maxDistance;
      this.touchInput.active = true;
    };
    
    const handleTouchEnd = () => {
      knob.style.transform = 'translate(-50%, -50%)';
      this.touchInput.x = 0;
      this.touchInput.y = 0;
      this.touchInput.active = false;
    };
    
    // Mouse handlers (for desktop testing and click support)
    let isMouseDown = false;
    
    const handleMouse = (e: MouseEvent) => {
      if (!isMouseDown) return;
      e.preventDefault();
      updateJoystickPosition();
      
      let dx = e.clientX - joystickRect.centerX;
      let dy = e.clientY - joystickRect.centerY;
      
      // Limit distance
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > maxDistance) {
        dx = (dx / distance) * maxDistance;
        dy = (dy / distance) * maxDistance;
      }
      
      // Update knob position
      knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      
      // Normalize to -1 to 1 range
      this.touchInput.x = dx / maxDistance;
      this.touchInput.y = dy / maxDistance;
      this.touchInput.active = true;
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      handleMouse(e);
    };
    
    const handleMouseUp = () => {
      isMouseDown = false;
      knob.style.transform = 'translate(-50%, -50%)';
      this.touchInput.x = 0;
      this.touchInput.y = 0;
      this.touchInput.active = false;
    };
    
    // Touch events with passive: false to allow preventDefault
    joystickContainer.addEventListener('touchstart', handleTouch, { passive: false });
    joystickContainer.addEventListener('touchmove', handleTouch, { passive: false });
    joystickContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
    joystickContainer.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    
    // Mouse events
    joystickContainer.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouse);
    document.addEventListener('mouseup', handleMouseUp);
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

  update(): { x: number; y: number; direction: 'up' | 'down' | 'left' | 'right'; isMoving: boolean } {
    // Check if user is typing in an HTML input
    const activeElement = document.activeElement;
    const isTyping = activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' || 
      activeElement.getAttribute('contenteditable') === 'true'
    );

    if (isTyping) {
      this.sprite.setVelocity(0, 0);
      this.isMoving = false;
      this.sprite.anims.play(`idle-${this.direction}`, true);
      return {
        x: this.sprite.x,
        y: this.sprite.y,
        direction: this.direction,
        isMoving: false,
      };
    }

    // Get keyboard input
    const leftDown = this.cursors.left.isDown || this.wasd.left.isDown;
    const rightDown = this.cursors.right.isDown || this.wasd.right.isDown;
    const upDown = this.cursors.up.isDown || this.wasd.up.isDown;
    const downDown = this.cursors.down.isDown || this.wasd.down.isDown;
    
    // Calculate velocity
    let vx = 0;
    let vy = 0;
    
    // Keyboard input
    if (leftDown) vx -= 1;
    if (rightDown) vx += 1;
    if (upDown) vy -= 1;
    if (downDown) vy += 1;
    
    // Touch joystick input (takes priority if active)
    if (this.touchInput && this.touchInput.active) {
      vx = this.touchInput.x;
      vy = this.touchInput.y;
    }
    
    // Normalize diagonal movement (only for keyboard)
    if (!this.touchInput?.active && vx !== 0 && vy !== 0) {
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

    // Return current state for network broadcast
    return {
      x: this.sprite.x,
      y: this.sprite.y,
      direction: this.direction,
      isMoving: this.isMoving,
    };
  }
}
