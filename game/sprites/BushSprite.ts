import { BaseSprite } from './BaseSprite';

/**
 * Bush sprite generator
 * Creates a decorative bush with layered green foliage
 */
export class BushSprite extends BaseSprite {
  getTextureKey(): string {
    return 'bush';
  }

  create(): void {
    const { canvas, ctx } = this.createCanvas(32, 32);

    this.drawBaseFoliage(ctx);
    this.drawAccentFoliage(ctx);

    this.addCanvasTexture(this.getTextureKey(), canvas);
  }

  private drawBaseFoliage(ctx: CanvasRenderingContext2D): void {
    // Base foliage (darker green)
    ctx.fillStyle = '#228b22';
    ctx.beginPath();
    ctx.arc(16, 20, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawAccentFoliage(ctx: CanvasRenderingContext2D): void {
    // Lighter green accents
    ctx.fillStyle = '#32cd32';
    
    // Left accent
    ctx.beginPath();
    ctx.arc(10, 16, 8, 0, Math.PI * 2);
    ctx.fill();

    // Right accent
    ctx.beginPath();
    ctx.arc(22, 18, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}
