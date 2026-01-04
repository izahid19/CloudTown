import { BaseSprite } from './BaseSprite';

/**
 * Main House sprite generator
 * Creates a detailed cozy house with striped orange roof, wooden texture,
 * windows, door, awning, and "Cloud" sign
 */
export class HouseSprite extends BaseSprite {
  getTextureKey(): string {
    return 'building';
  }

  create(): void {
    const { canvas, ctx } = this.createCanvas(160, 160);

    this.drawShadow(ctx);
    this.drawRoof(ctx);
    this.drawBody(ctx);
    this.drawAwning(ctx);
    this.drawWindows(ctx);
    this.drawDoor(ctx);
    this.drawSign(ctx);
    this.drawDecorations(ctx);

    this.addCanvasTexture(this.getTextureKey(), canvas);
  }

  private drawShadow(ctx: CanvasRenderingContext2D): void {
    // Ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(80, 155, 60, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawRoof(ctx: CanvasRenderingContext2D): void {
    // Roof outline shadow/depth
    ctx.fillStyle = '#9d3d3d';
    ctx.fillRect(10, 25, 140, 3);
    
    // Main roof with orange/coral striped pattern
    const roofColors = ['#e67350', '#d86644', '#ca5938']; // Orange gradient
    
    // Draw horizontal stripes
    for (let y = 0; y < 35; y += 3) {
      ctx.fillStyle = roofColors[y % 3];
      ctx.fillRect(10, 28 + y, 140, 3);
    }
    
    // Roof tiles pattern overlay
    ctx.fillStyle = '#c25840';
    for (let y = 0; y < 35; y += 6) {
      for (let x = 0; x < 140; x += 12) {
        ctx.fillRect(10 + x, 28 + y, 10, 2);
      }
    }
    
    // Roof top edge highlight
    ctx.fillStyle = '#f08060';
    ctx.fillRect(10, 25, 140, 3);
    
    // Roof eaves at bottom
    ctx.fillStyle = '#7a3030';
    ctx.fillRect(8, 60, 144, 4);
  }

  private drawBody(ctx: CanvasRenderingContext2D): void {
    // Main building body with wooden plank texture
    const woodColor1 = '#d4a574';
    const woodColor2 = '#c89960';
    const woodColor3 = '#b88850';
    
    // Base wall
    ctx.fillStyle = woodColor1;
    ctx.fillRect(15, 64, 130, 86);
    
    // Wooden planks pattern (horizontal)
    for (let y = 0; y < 86; y += 8) {
      const color = [woodColor1, woodColor2, woodColor3][Math.floor(y / 8) % 3];
      ctx.fillStyle = color;
      ctx.fillRect(15, 64 + y, 130, 6);
      
      // Plank lines
      ctx.fillStyle = '#a57840';
      ctx.fillRect(15, 64 + y + 5, 130, 1);
    }
    
    // Vertical plank separators
    ctx.fillStyle = '#a57840';
    for (let x = 20; x < 140; x += 25) {
      ctx.fillRect(x, 64, 1, 86);
    }
    
    // Wall edges
    ctx.fillStyle = '#8b6840';
    ctx.fillRect(15, 64, 3, 86); // Left edge
    ctx.fillRect(142, 64, 3, 86); // Right edge
    ctx.fillRect(15, 147, 130, 3); // Bottom edge
  }

  private drawAwning(ctx: CanvasRenderingContext2D): void {
    // Awning above door and windows
    ctx.fillStyle = '#d86644';
    ctx.fillRect(25, 88, 110, 8);
    
    // Awning stripes
    ctx.fillStyle = '#e67350';
    for (let x = 0; x < 110; x += 10) {
      ctx.fillRect(25 + x, 88, 5, 8);
    }
    
    // Awning shadow underneath
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(25, 95, 110, 2);
  }

  private drawWindows(ctx: CanvasRenderingContext2D): void {
    // Left window
    this.drawWindow(ctx, 30, 100);
    // Right window
    this.drawWindow(ctx, 100, 100);
  }

  private drawWindow(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    // Window frame
    ctx.fillStyle = '#6d4c2f';
    ctx.fillRect(x - 2, y - 2, 32, 32);
    
    // Window glass with sky reflection
    const gradient = ctx.createLinearGradient(x, y, x, y + 28);
    gradient.addColorStop(0, '#b8d8f0');
    gradient.addColorStop(1, '#87b8d8');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, 28, 28);
    
    // Window panes (4 panes)
    ctx.fillStyle = '#6d4c2f';
    ctx.fillRect(x, y + 13, 28, 2); // Horizontal divider
    ctx.fillRect(x + 13, y, 2, 28); // Vertical divider
    
    // Window shine/reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(x + 2, y + 2, 10, 10);
    
    // Flower box below window
    ctx.fillStyle = '#8b6840';
    ctx.fillRect(x - 2, y + 28, 32, 6);
    
    // Flowers in box
    const flowerColors = ['#ff6b9d', '#ffb6c1', '#ffd700'];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = flowerColors[i];
      ctx.fillRect(x + 2 + i * 10, y + 29, 4, 4);
    }
  }

  private drawDoor(ctx: CanvasRenderingContext2D): void {
    // Door frame
    ctx.fillStyle = '#6d4c2f';
    ctx.fillRect(68, 110, 28, 42);
    
    // Door panels (wooden)
    ctx.fillStyle = '#8b5a3c';
    ctx.fillRect(70, 112, 24, 38);
    
    // Door panels detail
    ctx.fillStyle = '#744a2c';
    ctx.fillRect(72, 115, 20, 15); // Top panel
    ctx.fillRect(72, 132, 20, 15); // Bottom panel
    
    // Door handle
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(86, 130, 3, 6);
    ctx.fillRect(88, 132, 2, 2);
    
    // Welcome mat
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(66, 150, 32, 6);
    ctx.fillStyle = '#a0522d';
    ctx.fillRect(68, 151, 28, 4);
  }

  private drawSign(ctx: CanvasRenderingContext2D): void {
    // Sign post
    ctx.fillStyle = '#6d4c2f';
    ctx.fillRect(22, 115, 3, 25);
    
    // Sign board
    ctx.fillStyle = '#f5deb3';
    ctx.fillRect(12, 110, 24, 12);
    
    // Sign border
    ctx.strokeStyle = '#8b7355';
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 110, 24, 12);
    
    // "Cloud" text on sign
    ctx.fillStyle = '#2c5aa0';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Cloud', 24, 119);
  }

  private drawDecorations(ctx: CanvasRenderingContext2D): void {
    // Chimney on roof
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(120, 15, 15, 25);
    ctx.fillStyle = '#6d3610';
    ctx.fillRect(120, 15, 4, 25); // Shadow side
    
    // Chimney top
    ctx.fillStyle = '#a0522d';
    ctx.fillRect(118, 13, 19, 3);
    
    // Smoke
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.beginPath();
    ctx.arc(128, 8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(126, 4, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Small bushes at front
    ctx.fillStyle = '#4a7c4e';
    ctx.beginPath();
    ctx.arc(10, 145, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(150, 145, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Lighter shade on bushes
    ctx.fillStyle = '#5a9c5e';
    ctx.beginPath();
    ctx.arc(8, 143, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(148, 143, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}
