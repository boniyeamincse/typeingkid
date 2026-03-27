# TypeMaster — Gamified Typing Platform 🚀

TypeMaster is a full-stack, gamified web-based typing platform designed to teach, challenge, and track typing skills across all experience levels. It combines structured typing lessons with game mechanics — **XP, badges, leaderboards, missions, and story mode** — to create an engaging and motivating learning environment.

---

## 🏗️ Technology Stack

| Component | Technology | Version |
|---|---|---|
| **Backend** | Node.js + Express.js | 20.x LTS |
| **Frontend** | React.js + Vite | 18.x |
| **Database** | PostgreSQL | 15+ |
| **Cache** | Redis | 7.x |
| **Real-time** | Socket.IO | 4.x |
| **Styling** | Tailwind CSS + Framer Motion | Latest |

---

## ✨ Key Features

- **⌨️ Structured Lessons:** From home row basics to professional coding snippets.
- **🏁 Multiplayer Races:** Real-time 2–8 player races with live progress tracking.
- **🏆 Gamification:** XP, levels, 100+ unlockable badges, and daily challenges.
- **📈 Analytics:** Detailed WPM/accuracy trends and key error heatmaps.
- **🌐 Multi-language:** Support for English, Bangla, and Hindi.
- **📖 Story Mode:** Narrative-driven typing adventures.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20.x LTS)
- [PostgreSQL](https://www.postgresql.org/) (v15+)
- [Redis](https://redis.io/) (v7.x)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/boniyeamincse/typeingkid.git
   cd typeingkid
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your database and secret keys
   npx prisma migrate dev
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🤝 Team Collaboration

We are a growing team! Please follow these standards to keep the codebase clean:

### 🗺️ Documentation
- [Software Documentation](docs/TypeMaster_Software_Documentation.md): Full system specifications.
- [Development Roadmap](docs/Development_Roadmap.md): Step-by-step task list and subtasks.

### 🌿 Branching Strategy
- `main` - Production-ready code.
- `develop` - Integration branch for features.
- `feature/*` - New features (e.g., `feature/typing-engine`).
- `bugfix/*` - Critical fixes (e.g., `bugfix/login-failure`).

### 🛠️ Workflow
1. Create a branch from `develop`.
2. Commit your changes with clear, descriptive messages.
3. Open a Pull Request for review.
4. Once approved and CI passes, it will be merged into `develop`.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
