import { BaseSprite } from './BaseSprite';

/**
 * Tileset sprite generator
 * Creates ground tiles: grass, path, darker grass, and water
 */
export class TilesetSprite extends BaseSprite {
  getTextureKey(): string {
    return 'tileset';
  }

  create(): void {
    const { canvas, ctx } = this.createCanvas(128, 128);

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

    this.addCanvasTexture(this.getTextureKey(), canvas);
  }
}
