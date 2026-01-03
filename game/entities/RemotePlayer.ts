import * as Phaser from 'phaser';

export interface RemotePlayerData {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  profile?: {
    username: string;
    about: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
    github?: string;
  };
}

export default class RemotePlayer {
  scene: Phaser.Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  nameContainer: Phaser.GameObjects.Container;
  nameText: Phaser.GameObjects.Text;
  id: string;
  targetX: number;
  targetY: number;
  direction: string;
  isMoving: boolean;
  lerpSpeed: number;
  profile?: RemotePlayerData['profile'];

  constructor(scene: Phaser.Scene, data: RemotePlayerData) {
    this.scene = scene;
    this.id = data.id;
    this.targetX = data.x;
    this.targetY = data.y;
    this.direction = data.direction;
    this.isMoving = data.isMoving;
    this.lerpSpeed = 0.15;
    this.profile = data.profile;

    // Create physics sprite for collision detection
    this.sprite = scene.physics.add.sprite(data.x, data.y, 'player', 0);
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setDepth(data.y);
    this.sprite.setAlpha(0.95);
    
    // Set up physics body
    this.sprite.body?.setSize(20, 12);
    this.sprite.body?.setOffset(6, 20);
    this.sprite.setImmovable(true);
    this.sprite.setPushable(false);

    // Make sprite interactive (clickable + hover)
    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on('pointerdown', () => {
      this.showProfile();
    });
    
    // Hover events for name tag
    this.sprite.on('pointerover', () => {
      this.nameContainer.setVisible(true);
      this.sprite.setAlpha(1);
    });
    
    this.sprite.on('pointerout', () => {
      this.nameContainer.setVisible(false);
      this.sprite.setAlpha(0.95);
    });

    // Create name container (hidden by default)
    this.nameContainer = scene.add.container(data.x, data.y - 50);
    this.nameContainer.setDepth(100000);
    this.nameContainer.setVisible(false);

    // Create clean, readable name text
    this.nameText = scene.add.text(0, 0, data.name, {
      fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    });
    this.nameText.setOrigin(0.5, 0.5);
    this.nameText.setShadow(0, 2, 'rgba(0,0,0,0.5)', 2, true, true);
    this.nameContainer.add(this.nameText);

    // Create animations if not already created
    this.createAnimations();
  }

  showProfile() {
    const win = window as unknown as { viewPlayerProfile?: (profile: unknown) => void };
    if (win.viewPlayerProfile) {
      const profile = this.profile || {
        username: this.nameText.text,
        about: '',
      };
      win.viewPlayerProfile(profile);
    }
  }

  createAnimations() {
    const scene = this.scene;
    const directions = ['down', 'left', 'right', 'up'];
    const startFrames = [0, 4, 8, 12];

    directions.forEach((dir, index) => {
      const walkKey = `walk-${dir}`;
      const idleKey = `idle-${dir}`;

      if (!scene.anims.exists(walkKey)) {
        scene.anims.create({
          key: walkKey,
          frames: scene.anims.generateFrameNumbers('player', {
            start: startFrames[index],
            end: startFrames[index] + 3,
          }),
          frameRate: 8,
          repeat: -1,
        });
      }

      if (!scene.anims.exists(idleKey)) {
        scene.anims.create({
          key: idleKey,
          frames: [{ key: 'player', frame: startFrames[index] }],
          frameRate: 1,
        });
      }
    });
  }

  updateFromNetwork(data: RemotePlayerData) {
    this.targetX = data.x;
    this.targetY = data.y;
    this.direction = data.direction;
    this.isMoving = data.isMoving;
    if (data.profile) {
      this.profile = data.profile;
      this.nameText.setText(data.profile.username || data.name);
    }
  }

  update() {
    // Interpolate position smoothly
    const dx = this.targetX - this.sprite.x;
    const dy = this.targetY - this.sprite.y;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      this.sprite.x += dx * this.lerpSpeed;
      this.sprite.y += dy * this.lerpSpeed;
    } else {
      this.sprite.x = this.targetX;
      this.sprite.y = this.targetY;
    }

    // Update depth based on Y position
    this.sprite.setDepth(this.sprite.y);

    // Update name position
    this.nameContainer.setPosition(this.sprite.x, this.sprite.y - 40);

    // Update animation
    if (this.isMoving) {
      this.sprite.anims.play(`walk-${this.direction}`, true);
    } else {
      this.sprite.anims.play(`idle-${this.direction}`, true);
    }
  }

  getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  destroy() {
    this.sprite.destroy();
    this.nameContainer.destroy();
  }
}
