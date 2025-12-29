# 🧩 PuzzlyNest

**Your Cozy Corner for Brain Games**

PuzzlyNest is a free online gaming platform designed for **kids (4-12 years)** and **seniors (60+)**. We offer 100+ games including brain training puzzles, classic card games, word games, and educational fun for all ages.

## 🌐 Website
- **Production**: [puzzlynest.com](https://puzzlynest.com)
- **Alternate**: [puzzlynest.io](https://puzzlynest.io)

## 🎮 Features

### For Seniors
- 🧠 Brain training puzzles (Sudoku, Memory Match, Number Sequences)
- 🎴 Classic games (Solitaire, Mahjong, Checkers)
- 📝 Word games (Word Search, Crosswords, Spelling Bee)
- 🧘 Relaxing visual puzzles (Jigsaws, Tangrams)

### For Kids  
- 🎓 Educational games (Counting, Colors, Shapes, Alphabet)
- 🎮 Action & Arcade (Whack-a-Mole, Bubble Pop, Flappy Bird)
- 🎨 Creative play (Coloring Book, Drawing)
- 🧩 Age-appropriate puzzles

### Platform Features
- ✅ 100+ unique games with authentic mechanics
- 🎵 Sound effects and music controls
- 🏆 Achievement system with unlockables
- 📱 Responsive design for all devices
- 🔒 Child-friendly games (no chat, no external links)
- 💰 Ad-supported (free to play)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: CSS with CSS Variables
- **Deployment**: Google Cloud Run
- **Container**: Docker

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🐳 Docker Deployment

```bash
# Build Docker image
docker build -t puzzlynest .

# Run container
docker run -p 8080:8080 puzzlynest
```

## ☁️ Google Cloud Run Deployment

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Build and deploy
gcloud run deploy puzzlynest \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated
```

## 📁 Project Structure

```
puzzlynest/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Homepage
│   ├── games/            # Game listing pages
│   └── play/[id]/        # Individual game player
├── components/           
│   ├── games/            # 27+ authentic game implementations
│   ├── engines/          # Generic game engines
│   ├── GamePlayer.tsx    # Universal game loader
│   ├── Navigation.tsx    # Site navigation
│   └── Footer.tsx        # Site footer
├── lib/
│   ├── config.ts         # Platform configuration
│   ├── games.ts          # Game catalog (100 games)
│   ├── achievements.ts   # Achievement system
│   └── soundManager.ts   # Audio controller
├── Dockerfile            # Container configuration
└── next.config.ts        # Next.js configuration
```

## 🎯 Game Categories

| Category | Age Group | Games |
|----------|-----------|-------|
| Brain Training | Seniors | Memory Match, Sudoku, Minesweeper |
| Classic Games | Seniors | Solitaire, Checkers, Mahjong |
| Word Games | All Ages | Word Search, Hangman, Spelling Bee |
| Learning & Fun | Kids | Counting, Colors, Shapes |
| Action & Arcade | Kids | Whack-a-Mole, Flappy Bird, Brick Breaker |
| Creative Play | Kids | Coloring Book, Drawing |

## 📝 License

© 2024-2025 PuzzlyNest. All rights reserved.

## 🤝 Contributing

This is a private project. Please contact the maintainers for contribution guidelines.
