import { BaseSprite } from './BaseSprite';

/**
 * Table (Bench) sprite generator
 * Creates a wooden bench/table with seat and backrest
 */
export class TableSprite extends BaseSprite {
  getTextureKey(): string {
    return 'bench';
  }

  create(): void {
    const { canvas, ctx } = this.createCanvas(48, 32);

    this.drawSeat(ctx);
    this.drawLegs(ctx);
    this.drawBack(ctx);

    this.addCanvasTexture(this.getTextureKey(), canvas);
  }

  private drawSeat(ctx: CanvasRenderingContext2D): void {
    // Seat
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(4, 12, 40, 8);
  }

  private drawLegs(ctx: CanvasRenderingContext2D): void {
    // Legs
    ctx.fillStyle = '#654321';
    ctx.fillRect(8, 20, 6, 10);
    ctx.fillRect(34, 20, 6, 10);
  }

  private drawBack(ctx: CanvasRenderingContext2D): void {
    // Back rest horizontal
    ctx.fillStyle = '#654321';
    ctx.fillRect(4, 4, 40, 4);
    
    // Back rest supports
    ctx.fillRect(6, 8, 4, 8);
    ctx.fillRect(38, 8, 4, 8);
  }
}
