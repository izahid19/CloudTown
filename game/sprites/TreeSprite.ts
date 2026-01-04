import { BaseSprite } from './BaseSprite';

/**
 * Tree sprite generator
 * Creates a cherry blossom style tree with pink foliage
 */
export class TreeSprite extends BaseSprite {
  getTextureKey(): string {
    return 'tree';
  }

  create(): void {
    const { canvas, ctx } = this.createCanvas(64, 80);

    this.drawShadow(ctx);
    this.drawTrunk(ctx);
    this.drawFoliage(ctx);
    this.drawPetals(ctx);

    this.addCanvasTexture(this.getTextureKey(), canvas);
  }

  private drawShadow(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(32, 78, 20, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawTrunk(ctx: CanvasRenderingContext2D): void {
    // Main trunk
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(26, 50, 12, 28);
    
    // Trunk shadow
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(26, 50, 4, 28);
  }

  private drawFoliage(ctx: CanvasRenderingContext2D): void {
    // Main foliage (pink cherry blossom)
    ctx.fillStyle = '#ffb7c5';
    ctx.beginPath();
    ctx.arc(32, 32, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffc1cc';
    ctx.beginPath();
    ctx.arc(20, 28, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffcdd2';
    ctx.beginPath();
    ctx.arc(44, 30, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffd7dc';
    ctx.beginPath();
    ctx.arc(32, 18, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawPetals(ctx: CanvasRenderingContext2D): void {
    // Flower petals scattered on foliage
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = 10 + Math.random() * 16;
      const sx = 32 + Math.cos(angle) * r;
      const sy = 28 + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(sx, sy, 2 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
