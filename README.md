# ☁️ Cloud Town

A cozy pixel art virtual world built with **Phaser 3** and **Vite**.

![Cloud Town](https://img.shields.io/badge/Made%20with-Phaser%203-blue)

## ✨ Features

- 🎮 **Explorable world** - Walk around a charming cloud-themed town
- ☁️ **Cloud person character** - Fluffy white character with blue scarf
- 🌸 **Cherry blossom trees** - Beautiful pink trees with petals
- 🏠 **Buildings & furniture** - Coffee shop, benches, bushes
- 🔍 **Zoom controls** - Zoom in/out with buttons, keys, or scroll
- 🗺️ **Minimap** - Navigate easily with the corner minimap

## 🎮 Controls

| Action | Keys |
|--------|------|
| Move | `WASD` or `Arrow Keys` |
| Zoom In | `E` or `+` button or Scroll Up |
| Zoom Out | `Q` or `-` button or Scroll Down |

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd lofitown

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open **http://localhost:3000** in your browser.

### Build for Production

```bash
npm run build
```

## 🛠️ Tech Stack

- [Phaser 3](https://phaser.io/) - Game framework
- [Vite](https://vitejs.dev/) - Build tool
- Vanilla JavaScript

## 📁 Project Structure

```
lofitown/
├── src/
│   ├── main.js              # Game configuration
│   ├── entities/
│   │   └── Player.js        # Player character
│   └── scenes/
│       ├── BootScene.js     # Loading & assets
│       └── GameScene.js     # Main game world
├── index.html
├── package.json
└── vite.config.js
```

## 📝 License

MIT License - feel free to use this project for learning or your own games!
