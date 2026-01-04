import { BaseSprite } from './BaseSprite';

/**
 * Character (Player) sprite generator
 * Creates a fluffy cloud person character with 4 directions and 4 frames per direction
 * Total: 16 frames in a 4x4 grid (32x32 each)
 * Row 0 (frames 0-3): Down
 * Row 1 (frames 4-7): Left
 * Row 2 (frames 8-11): Right
 * Row 3 (frames 12-15): Up
 */
export class CharacterSprite extends BaseSprite {
  getTextureKey(): string {
    return 'player';
  }

  create(): void {
    const { canvas, ctx } = this.createCanvas(128, 128);

    // Draw 4 directions x 4 frames = 16 frames (32x32 each)
    for (let row = 0; row < 4; row++) {
      for (let frame = 0; frame < 4; frame++) {
        this.drawFrame(ctx, row, frame);
      }
    }

    this.addSpriteSheet(this.getTextureKey(), canvas, 32, 32);
  }

  private drawFrame(ctx: CanvasRenderingContext2D, row: number, frame: number): void {
    const x = frame * 32;
    const y = row * 32;
    const bounce = frame % 2 === 0 ? 0 : -2;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 30, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (fluffy cloud shape)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 22 + bounce, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head (round fluffy)
    ctx.beginPath();
    ctx.arc(x + 16, y + 12 + bounce, 10, 0, Math.PI * 2);
    ctx.fill();

    // Cloud puffs on head
    ctx.beginPath();
    ctx.arc(x + 10, y + 8 + bounce, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 22, y + 8 + bounce, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 16, y + 5 + bounce, 5, 0, Math.PI * 2);
    ctx.fill();

    // Face based on direction (not shown for up direction)
    if (row !== 3) {
      this.drawFace(ctx, x, y, bounce);
    }

    // Scarf (blue)
    ctx.fillStyle = '#5c9ece';
    ctx.fillRect(x + 10, y + 18 + bounce, 12, 3);
    ctx.fillRect(x + 18, y + 18 + bounce, 3, 8);
  }

  private drawFace(ctx: CanvasRenderingContext2D, x: number, y: number, bounce: number): void {
    // Eyes
    ctx.fillStyle = '#2c5aa0';
    ctx.beginPath();
    ctx.arc(x + 12, y + 12 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 20, y + 12 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 11, y + 11 + bounce, 1, 1);
    ctx.fillRect(x + 19, y + 11 + bounce, 1, 1);

    // Blush
    ctx.fillStyle = '#ffb6c1';
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 15 + bounce, 2, 1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 24, y + 15 + bounce, 2, 1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#2c5aa0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x + 16, y + 14 + bounce, 3, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  }
}
