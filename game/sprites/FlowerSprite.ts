import { BaseSprite } from './BaseSprite';

/**
 * Flower sprite generator
 * Creates a small decorative flower with stem, petals, and center
 */
export class FlowerSprite extends BaseSprite {
  getTextureKey(): string {
    return 'flower';
  }

  create(): void {
    const { canvas, ctx } = this.createCanvas(16, 16);

    this.drawStem(ctx);
    this.drawPetals(ctx);
    this.drawCenter(ctx);

    this.addCanvasTexture(this.getTextureKey(), canvas);
  }

  private drawStem(ctx: CanvasRenderingContext2D): void {
    // Stem
    ctx.fillStyle = '#228b22';
    ctx.fillRect(7, 8, 2, 8);
  }

  private drawPetals(ctx: CanvasRenderingContext2D): void {
    // Petals (pink)
    ctx.fillStyle = '#ff69b4';
    ctx.fillRect(4, 2, 3, 3); // Top left
    ctx.fillRect(9, 2, 3, 3); // Top right
    ctx.fillRect(4, 7, 3, 3); // Bottom left
    ctx.fillRect(9, 7, 3, 3); // Bottom right
  }

  private drawCenter(ctx: CanvasRenderingContext2D): void {
    // Center (yellow)
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(6, 4, 4, 4);
  }
}
