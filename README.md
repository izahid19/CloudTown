# ☁️ Cloud Town

A cozy pixel art virtual world built with **Next.js**, **React**, and **Phaser 3**. Join your friends in a persistent cloud-themed town!

![Cloud Town](https://img.shields.io/badge/Made%20with-Phaser%203-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black)

## ✨ Features

- 🌐 **Real-time Multiplayer** - See other players move and join in real-time
- 🔑 **User Accounts** - Sign in via Discord/Google to save your profile
- ☁️ **Cloud Person Character** - Fluffy white character with customizable profile
- 🌸 **Live World** - Cherry blossom trees, animated clouds and flowers
- 🔍 **Zoom & Minimap** - Navigate easily with zoom controls and a live minimap
- 💾 **Cloud Persistence** - Your profile connects to your account across devices

## 🎮 Controls

| Action | Keys |
|--------|------|
| Move | `WASD` or `Arrow Keys` |
| Zoom In | `E` or `+` button or Scroll Up |
| Zoom Out | `Q` or `-` button or Scroll Down |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd CloudTown

# Install dependencies
cd client
pnpm install

# Setup Environment
cp .env.local.example .env.local
# (Fill in your NextAuth and Socket URL details)

# Start development server
pnpm dev
```

Then open **http://localhost:3000** in your browser.

> **Note**: You must also run the `server` (see `server/README.md`) for multiplayer to work.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Game Engine**: Phaser 3
- **Multiplayer**: Socket.io Client
- **Auth**: NextAuth.js (JWT)

## 📁 Project Structure

```
CloudTown/
├── client/                  # Next.js Frontend
│   ├── app/                 # App Router pages
│   ├── components/          # React UI components
│   ├── game/                # Phaser game logic
│   │   ├── scenes/          # Game scenes
│   │   ├── entities/        # Player classes
│   │   └── multiplayer/     # Network logic
│   └── public/              # Game assets
└── server/                  # Socket.io Backend
```

## 📝 License

MIT License - feel free to use this project for learning or your own games!
