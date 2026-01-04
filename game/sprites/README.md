# Sprite Organization

This directory contains all sprite generators for the CloudTown game. Each sprite is separated into its own file for easy modification and maintenance.

## Structure

```
sprites/
├── BaseSprite.ts        # Base class with common utilities
├── CharacterSprite.ts   # Player character (cloud person)
├── TreeSprite.ts        # Cherry blossom tree
├── HouseSprite.ts       # Building/house sprite
├── TableSprite.ts       # Bench/table furniture
├── FlowerSprite.ts      # Small flower decoration
├── BushSprite.ts        # Bush decoration
├── TilesetSprite.ts     # Ground tiles (grass, path, water)
└── index.ts             # Barrel export file
```

## How It Works

Each sprite class extends `BaseSprite` and implements two methods:
- `getTextureKey()`: Returns the texture key name used in Phaser
- `create()`: Generates the sprite using canvas drawing API

## Usage

In `BootScene.ts`, sprites are instantiated and created:

```typescript
import { CharacterSprite, TreeSprite } from '../sprites';

// In createPlaceholderAssets()
const character = new CharacterSprite(this);
character.create();

const tree = new TreeSprite(this);
tree.create();
```

## Modifying Sprites

To modify a sprite:

1. **Open the sprite file** you want to modify (e.g., `CharacterSprite.ts`)
2. **Edit the drawing methods** to change colors, sizes, or shapes
3. **Save the file** - changes will appear on next game restart

### Example: Changing Tree Color

```typescript
// In TreeSprite.ts, modify drawFoliage() method
private drawFoliage(ctx: CanvasRenderingContext2D): void {
  // Change from pink cherry blossom to green
  ctx.fillStyle = '#228b22'; // Changed from '#ffb7c5'
  ctx.beginPath();
  ctx.arc(32, 32, 26, 0, Math.PI * 2);
  ctx.fill();
  // ... rest of the foliage drawing
}
```

## Creating New Sprites

To add a new sprite:

1. **Create a new file** in the `sprites/` directory (e.g., `RockSprite.ts`)
2. **Extend BaseSprite**:

```typescript
import { BaseSprite } from './BaseSprite';

export class RockSprite extends BaseSprite {
  getTextureKey(): string {
    return 'rock';
  }

  create(): void {
    const { canvas, ctx } = this.createCanvas(32, 32);
    
    // Draw your sprite here
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, Math.PI * 2);
    ctx.fill();
    
    this.addCanvasTexture(this.getTextureKey(), canvas);
  }
}
```

3. **Export from index.ts**:

```typescript
export { RockSprite } from './RockSprite';
```

4. **Add to BootScene.ts**:

```typescript
import { RockSprite } from '../sprites';

// In createPlaceholderAssets()
const rock = new RockSprite(this);
rock.create();
```

## Benefits of This Organization

✅ **Easy to find**: Each sprite has its own file
✅ **Easy to modify**: Change one sprite without affecting others
✅ **Easy to test**: Can work on sprites independently
✅ **Reusable**: Import only the sprites you need
✅ **Organized**: Clear structure and documentation
✅ **Scalable**: Simple to add new sprites

## Sprite Details

### Character (Player)
- **File**: `CharacterSprite.ts`
- **Size**: 32x32 per frame
- **Frames**: 16 (4 directions × 4 animation frames)
- **Directions**: Down, Left, Right, Up
- **Key**: `'player'`

### Tree
- **File**: `TreeSprite.ts`
- **Size**: 64x80
- **Style**: Cherry blossom (pink foliage)
- **Key**: `'tree'`

### House
- **File**: `HouseSprite.ts`
- **Size**: 128x128
- **Features**: Striped roof, windows, door, sign
- **Key**: `'building'`

### Table/Bench
- **File**: `TableSprite.ts`
- **Size**: 48x32
- **Features**: Wooden seat, legs, backrest
- **Key**: `'bench'`

### Flower
- **File**: `FlowerSprite.ts`
- **Size**: 16x16
- **Features**: Pink petals, yellow center, green stem
- **Key**: `'flower'`

### Bush
- **File**: `BushSprite.ts`
- **Size**: 32x32
- **Features**: Layered green foliage
- **Key**: `'bush'`

### Tileset
- **File**: `TilesetSprite.ts`
- **Size**: 128x128 (4 tiles of 32x32)
- **Tiles**: Grass, Path, Darker Grass, Water
- **Key**: `'tileset'`
