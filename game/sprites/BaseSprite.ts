import * as Phaser from 'phaser';

/**
 * Base class for sprite generation
 * Provides common utilities for creating canvas-based sprites
 */
export abstract class BaseSprite {
  protected scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Abstract method that child classes must implement
   * Returns the key name for the sprite texture
   */
  abstract getTextureKey(): string;

  /**
   * Abstract method that child classes must implement
   * Creates and adds the texture to the scene
   */
  abstract create(): void;

  /**
   * Helper method to create a canvas element
   */
  protected createCanvas(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    return { canvas, ctx };
  }

  /**
   * Helper method to add canvas as texture to the scene
   */
  protected addCanvasTexture(key: string, canvas: HTMLCanvasElement): void {
    this.scene.textures.addCanvas(key, canvas);
  }

  /**
   * Helper method to add spritesheet texture to the scene
   */
  protected addSpriteSheet(
    key: string,
    canvas: HTMLCanvasElement,
    frameWidth: number,
    frameHeight: number
  ): void {
    this.scene.textures.addSpriteSheet(key, canvas as unknown as HTMLImageElement, {
      frameWidth,
      frameHeight,
    });
  }
}
