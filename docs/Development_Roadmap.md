# TypeMaster — Step-by-Step Development Roadmap 🗺️

This document outlines the granular tasks and subtasks required to build the TypeMaster platform from scratch. Tasks are grouped into logical phases to allow parallel development by team members.

---

## Phase 1: Environment & Project Foundation 🏗️

### 1.1 Repository & CI/CD Setup
- [x] Initialize GitHub repository with `main` and `develop` branches.
- [x] Configure GitHub Actions for linting and automated testing.
- [x] Set up `.gitignore`, `.editorconfig`, and README.

### 1.2 Backend Initialization (Node.js/Express)
- [x] Initialize Node.js project.
- [x] Install core dependencies (Express, Prisma, Zod, JWT, Socket.IO).
- [x] Configure Prisma with PostgreSQL connection.
- [x] Create basic project structure (`src/controllers`, `src/services`, `src/routes`, `src/models`).

### 1.3 Frontend Initialization (React/Vite)
- [x] Initialize React project using Vite.
- [x] Install core dependencies (Tailwind CSS, Redux Toolkit, React Router, Socket.IO-client).
- [x] Configure Tailwind CSS with project color palette.
- [x] Create basic folder structure (`src/components`, `src/pages`, `src/hooks`, `src/store`).

---

## Phase 2: User Authentication & Profile Module 🔐

### 2.1 Backend Auth Logic
- [ ] Create User model in Prisma schema.
- [ ] Implement Registration API with password hashing (bcrypt).
- [ ] Implement Login API with JWT issuance (Access & Refresh tokens).
- [ ] Create middleware for JWT verification.

### 2.2 Frontend Auth Integration
- [ ] Build Login and Registration pages.
- [ ] Implement Redux auth slice for state management.
- [ ] Set up axios interceptors for automatic token refreshing.
- [ ] Add protected route wrappers for authenticated pages.

### 2.3 Profile Management
- [ ] Build Profile page (/profile).
- [ ] Implement API to update user display name and avatar.
- [ ] Integrate avatar upload to AWS S3 or local storage.

---

## Phase 3: Core Typing Engine & Lessons ⌨️

### 3.1 Typing Logic Hook (Frontend)
- [ ] Create `useTypingEngine` hook.
- [ ] Implement real-time character matching (correct/incorrect/pending).
- [ ] Add WPM and Accuracy calculation logic.
- [ ] Implement backspace and cursor tracking.

### 3.2 Lesson Management (Backend)
- [ ] Create Lesson and LessonProgress models.
- [ ] Build CRUD APIs for admins to manage lessons.
- [ ] Create API for fetching lessons by difficulty level.

### 3.3 Lesson Player UI
- [ ] Build Lesson Player component with character highlighting.
- [ ] Implement "Lesson Complete" modal with performance breakdown.
- [ ] Add "Adaptive Difficulty" logic (suggesting the next lesson).

---

## Phase 4: Real-time Multiplayer Racing 🏎️

### 4.1 Socket.IO Integration (Backend)
- [ ] Set up Socket.IO server within the Express app.
- [ ] Create Room management logic (join, leave, create).
- [ ] Implement real-time progress broadcasting.

### 4.2 Race UI (Frontend)
- [ ] Build Multiplayer Lobby screen.
- [ ] Create Race Track component with animated avatars.
- [ ] Synchronize typing engine with Socket.io events.
- [ ] Implement post-race podium and ELO updates.

---

## Phase 5: Gamification & Social 🏆

### 5.1 XP & Leveling System
- [ ] Implement XP reward logic on lesson/game completion.
- [ ] Create level threshold calculator.
- [ ] Build "Level Up" animation and notification.

### 5.2 Badge & Achievement Engine
- [ ] Create Badge system with extensible conditions (e.g., "Speed > 60 WPM").
- [ ] Implement background worker to check and award badges.
- [ ] Build "My Badges" gallery in the profile.

### 5.3 Leaderboards
- [ ] Integrate Redis for high-performance ranking.
- [ ] Build Global, Weekly, and Friends leaderboards.
- [ ] Add regional filtering based on user profile data.

---

## Phase 6: Analytics & Performance 📊

### 6.1 Performance Tracking
- [ ] Log every typing session to the database.
- [ ] Build WPM trend charts using Recharts/Chart.js.
- [ ] Create "Key Error Heatmap" to identify weak fingers.

---

## Phase 7: Polish & Deployment 🚀

### 7.1 UX/UI Refinement
- [ ] Add Framer Motion transitions between pages.
- [ ] Implement Dark Mode toggle.
- [ ] Ensure mobile responsiveness across all core modules.

### 7.2 Deployment
- [ ] Deploy Backend to AWS EC2 or Heroku.
- [ ] Deploy Frontend to Vercel or Netlify.
- [ ] Set up monitoring with Sentry and Datadog.

---

## Phase 8: System Integration & Event Flow 🧩

### 8.1 Cross-Module Integration
- [ ] Implement global event bus for system signals (Level Up, Badge Earned).
- [ ] Connect Typing Engine results to the Scoring Module.
- [ ] Integrate Scoring outcomes with Redis-based Leaderboards.

### 8.2 End-to-End Testing
- [ ] Create E2E tests for the "Typing-to-Ranking" flow.
- [ ] Verify badge awarding logic during high-speed typing sessions.
- [ ] Test real-time leaderboard updates across multiple sessions.
