# TypeMaster — Gamified Typing Platform
## Full Software Documentation

**Version:** 1.0.0  
**Date:** March 2026  
**Type:** Web-Based SaaS Application  
**Stack:** Node.js (Backend) + React.js (Frontend) + PostgreSQL + Redis

---

## Table of Contents

1. Project Overview
2. Architecture Overview
3. Technology Stack
4. System Requirements
5. Module Specifications
   - 5.1 User Module
   - 5.2 Typing Lessons Module
   - 5.3 Typing Games Module
   - 5.4 Scoring & Rewards Module
   - 5.5 Leaderboard Module
   - 5.6 Admin Panel Module
   - 5.7 Notifications Module
   - 5.8 Social Module
   - 5.9 Analytics Module
   - 5.10 Premium / Monetization Module
6. Database Schema
7. API Reference
8. Frontend Architecture
9. Gamification System
10. Security Specifications
11. Deployment & Infrastructure
12. Testing Strategy
13. Performance Requirements
14. Accessibility Standards
15. Roadmap & Future Enhancements

---

## 1. Project Overview

### 1.1 Introduction

TypeMaster is a full-stack, gamified web-based typing platform designed to teach, challenge, and track typing skills across all experience levels. It combines structured typing lessons with game mechanics — XP, badges, leaderboards, missions, and story mode — to create an engaging and motivating learning environment.

### 1.2 Goals

- Teach proper touch-typing technique to beginners
- Improve speed and accuracy for intermediate and advanced users
- Provide competitive features (multiplayer races, leaderboards) for enthusiasts
- Track measurable progress over time with rich analytics
- Support multiple languages including English, Bangla, and Hindi

### 1.3 Target Users

| Persona | Description |
|---|---|
| Beginners | Students or new typists learning home row keys and finger placement |
| Students | School or university students practicing typing for academic use |
| Professionals | Office workers wanting to increase typing speed for productivity |
| Enthusiasts | Competitive typists aiming for high WPM and global rankings |

### 1.4 Core Value Proposition

TypeMaster differentiates itself through: adaptive lesson difficulty, story-mode gamification, real-time multiplayer racing, multi-language support, XP and leveling systems, and shareable typed certifications.

---

## 2. Architecture Overview

### 2.1 High-Level Architecture

TypeMaster uses a three-tier architecture:

- **Presentation Layer:** React.js SPA (Single Page Application)
- **Application Layer:** Node.js + Express.js REST API
- **Data Layer:** PostgreSQL (primary), Redis (caching, sessions, real-time), AWS S3 (assets)

### 2.2 System Diagram

```
[React Frontend]
      |
      | HTTPS / WebSocket
      |
[Load Balancer (NGINX)]
      |
[Node.js API Cluster]
      |        \
[PostgreSQL]  [Redis]
                 |
           [Socket.IO - Multiplayer]
```

### 2.3 Key Design Patterns

- RESTful API for all CRUD operations
- WebSocket (Socket.IO) for real-time multiplayer and live leaderboard updates
- JWT-based stateless authentication
- Redis for caching leaderboards, session data, and game state
- Event-driven architecture for notifications and achievements

---

## 3. Technology Stack

### 3.1 Backend

| Component | Technology | Version |
|---|---|---|
| Runtime | Node.js | 20.x LTS |
| Framework | Express.js | 4.x |
| Real-time | Socket.IO | 4.x |
| ORM | Prisma | 5.x |
| Auth | Passport.js + JWT | Latest |
| Cache | Redis (ioredis) | 7.x |
| Email | Nodemailer + SendGrid | Latest |
| File Storage | AWS S3 + Multer | Latest |
| Validation | Zod | 3.x |
| Testing | Jest + Supertest | Latest |

### 3.2 Frontend

| Component | Technology | Version |
|---|---|---|
| Framework | React.js | 18.x |
| State | Redux Toolkit + React Query | Latest |
| Routing | React Router | 6.x |
| Styling | Tailwind CSS + Framer Motion | Latest |
| Real-time | Socket.IO Client | 4.x |
| Charts | Chart.js / Recharts | Latest |
| Testing | Vitest + React Testing Library | Latest |
| Build | Vite | 5.x |

### 3.3 Infrastructure

| Component | Service |
|---|---|
| Hosting | AWS EC2 / Vercel |
| Database | AWS RDS (PostgreSQL) |
| Cache | AWS ElastiCache (Redis) |
| CDN | CloudFront |
| Storage | AWS S3 |
| CI/CD | GitHub Actions |
| Monitoring | Datadog / Sentry |

---

## 4. System Requirements

### 4.1 Functional Requirements

1. User registration, login, and profile management
2. Structured typing lessons by difficulty level
3. Real-time typing feedback with error highlighting
4. Time-based typing games and challenges
5. Multiplayer racing mode
6. WPM and accuracy calculation
7. XP, levels, badges, and achievement system
8. Daily, weekly, and all-time leaderboards
9. Admin panel for user and content management
10. Push/in-app notifications for achievements and streaks
11. Multi-language support (English, Bangla, Hindi)
12. Text import for custom practice
13. Typing test with shareable certificate generation
14. Friends system and social sharing

### 4.2 Non-Functional Requirements

| Requirement | Target |
|---|---|
| Response Time | API < 200ms, Typing feedback < 16ms |
| Availability | 99.9% uptime |
| Concurrent Users | 10,000+ simultaneous users |
| Data Retention | Unlimited per user account |
| Security | OWASP Top 10 compliance |
| Accessibility | WCAG 2.1 Level AA |
| Mobile Support | Responsive down to 375px |
| Browser Support | Chrome, Firefox, Safari, Edge (last 2 versions) |

---

## 5. Module Specifications

### 5.1 User Module

**Purpose:** Manage all user identity, profile, authentication, and account data.

#### Features

- Email + password registration with email verification
- OAuth2 login via Google and GitHub
- JWT access tokens (15 min) + refresh tokens (7 days)
- Profile page: avatar, display name, bio, country
- Stats dashboard: total WPM, accuracy, lessons completed, badges earned
- Typing history: per-session performance logs
- Account settings: change password, email, notification preferences
- Account deletion with data wipe

#### Data Entities

**User**
- id, email, password_hash, display_name, avatar_url
- xp, level, total_points
- created_at, last_active_at
- is_verified, is_premium, is_admin

**UserStats**
- user_id, avg_wpm, best_wpm, avg_accuracy
- total_lessons, total_games, total_time_minutes
- current_streak, longest_streak

**TypingSession**
- id, user_id, session_type (lesson/game/test)
- wpm, accuracy, duration_seconds, errors
- text_id, created_at

#### API Endpoints

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- GET /api/users/:id/profile
- PUT /api/users/:id/profile
- GET /api/users/:id/stats
- GET /api/users/:id/history

---

### 5.2 Typing Lessons Module

**Purpose:** Deliver structured, progressive typing lessons from beginner to advanced.

#### Lesson Structure

**Beginner Level**
- Home row keys (A, S, D, F, J, K, L)
- Top row keys (Q, W, E, R, T, Y, U, I, O, P)
- Bottom row and shift keys
- Numbers and symbols
- Beginner review and assessment

**Intermediate Level**
- Speed drills
- Common words and sentences
- Punctuation practice
- Capitalization patterns

**Advanced Level**
- Code snippets (Python, JavaScript, HTML)
- Long-form passages
- Speed and accuracy combined challenges
- Professional writing samples

#### Features

- Live character-by-character highlighting (correct = green, error = red)
- Cursor tracking with smooth animation
- Backspace allowed with error tracking
- Auto-advance on lesson completion
- Save completion status and performance per lesson
- Adaptive difficulty: auto-recommend next lesson based on accuracy
- Support for English, Bangla, Hindi text

#### Data Entities

**Lesson**
- id, title, level (beginner/intermediate/advanced)
- category, language, content_text
- estimated_duration, order_index

**LessonProgress**
- user_id, lesson_id, status (not_started/in_progress/completed)
- best_wpm, best_accuracy, attempts, last_attempt_at

#### API Endpoints

- GET /api/lessons?level=beginner&lang=en
- GET /api/lessons/:id
- POST /api/lessons/:id/complete
- GET /api/users/:id/lesson-progress

---

### 5.3 Typing Games Module

**Purpose:** Provide gamified typing challenges to build speed, accuracy, and engagement.

#### Game Modes

**Time Challenge**
- Durations: 15s, 30s, 1 min, 3 min, 5 min
- Type as many words as possible in the time limit
- Score = WPM × accuracy percentage
- Post-game breakdown with error analysis

**Race Mode (Multiplayer)**
- 2–8 players in a race
- All players type the same passage
- Live progress bar for each racer
- First to finish wins; ELO-based ranking update
- Private rooms with share codes or public matchmaking

**Accuracy Challenge**
- Lower time pressure, maximum accuracy focus
- Penalties for errors, no penalty for slow speed
- Unlocks "Precision" badge chain

**Time Attack / Endless Mode**
- Infinite word stream, speed increases every 30 seconds
- Score multipliers for streaks (10, 25, 50 consecutive correct words)
- Personal best and global best displayed live

**Story Mode**
- Users unlock chapters by completing typing tasks
- Each chapter = a narrative passage users must type
- Progressively harder text, more characters, longer passages
- Rewards: story items, special badges, XP bonuses

**Daily Challenge**
- One shared challenge per day for all users
- Compare scores on a daily-specific leaderboard
- Streak rewards for daily participation

#### Socket.IO Events (Multiplayer)

- game:join — Player joins a room
- game:start — Game countdown begins
- game:progress — Player position update (sent every ~100ms)
- game:finish — Player completes passage
- game:end — Room closes, final standings broadcast

#### API Endpoints

- GET /api/games/modes
- POST /api/games/rooms (create room)
- GET /api/games/rooms/:code (join room)
- POST /api/games/:id/score (submit score)
- GET /api/games/daily-challenge

---

### 5.4 Scoring & Rewards Module

**Purpose:** Calculate performance metrics, assign XP, manage leveling, and award badges.

#### WPM Calculation

```
WPM = (Total Characters Typed / 5) / Minutes Elapsed
Net WPM = WPM × (1 - Error Rate)
Accuracy = (Correct Characters / Total Characters) × 100
```

#### XP & Leveling System

| Activity | XP Earned |
|---|---|
| Complete a lesson (first time) | 50 XP |
| Complete a lesson (repeat) | 10 XP |
| Finish a Time Challenge | 20–100 XP (by WPM tier) |
| Win a Race | 75 XP |
| Participate in Race | 25 XP |
| Daily Challenge complete | 60 XP |
| 7-day streak | 200 XP bonus |

**Level Thresholds**

| Level | Title | XP Required |
|---|---|---|
| 1 | Typing Seedling | 0 |
| 5 | Home Row Hero | 2,500 |
| 10 | Speed Seeker | 8,000 |
| 20 | Velocity Typist | 30,000 |
| 30 | Master Typist | 90,000 |
| 50 | Legendary Keyboardist | 300,000 |

#### Badge System

**Speed Badges**
- First Steps: Complete first lesson
- Warming Up: Reach 20 WPM
- Getting Serious: Reach 40 WPM
- Speed Demon: Reach 60 WPM
- Century Typist: Reach 100 WPM
- Warp Speed: Reach 150 WPM

**Accuracy Badges**
- Sharp Eye: 90% accuracy in a game
- Precision Master: 99% accuracy in a game
- Perfect Run: 100% accuracy in a full lesson

**Streak Badges**
- Getting Consistent: 3-day streak
- Week Warrior: 7-day streak
- Monthly Devotion: 30-day streak

**Special Badges**
- Story Finisher: Complete Story Mode
- Multiplayer Champion: Win 10 races
- Polyglot Typist: Complete lessons in 3 languages

#### Typing Test Certificate

- Triggered when user completes a timed typing test
- PDF certificate generated with: name, date, WPM, accuracy, level
- Shareable link and downloadable PNG/PDF

---

### 5.5 Leaderboard Module

**Purpose:** Rank users globally, regionally, and among friends.

#### Leaderboard Types

- Global All-Time (by total XP)
- Global Weekly (by WPM in the current week)
- Global Daily (by daily challenge score)
- Regional (by country and city)
- Friends-Only (social graph filtered)
- Mode-Specific (Race, Time Attack, Accuracy)

#### Features

- Live updates via Redis sorted sets (ZADD/ZRANK)
- User position highlighted in all leaderboard views
- Top 3 shown with gold/silver/bronze styling
- Pagination (top 100 shown, user rank always visible)
- Weekly reset with archive of previous week's winner

#### API Endpoints

- GET /api/leaderboard?type=global&period=weekly
- GET /api/leaderboard?type=friends&userId=:id
- GET /api/leaderboard?type=regional&country=BD
- GET /api/leaderboard/rank/:userId

---

### 5.6 Admin Panel Module

**Purpose:** Provide administrators with tools to manage users, content, and platform health.

#### Features

**User Management**
- View all users with search and filter
- View user details, stats, and session history
- Suspend or ban accounts
- Manually award or revoke badges
- Reset user passwords

**Content Management**
- Create, edit, delete lessons
- Assign lesson difficulty and language
- Create and schedule daily challenges
- Manage game text pools

**Analytics Dashboard**
- Total registered users and DAU/MAU
- Average WPM and accuracy across platform
- Most popular lessons and game modes
- New signups per day/week/month
- Top 50 users by XP

**System Health**
- API response times
- Active WebSocket connections
- Database query performance
- Error rate monitoring

#### Access Control

- Admin role: full access
- Moderator role: content management only, no user data
- Analyst role: read-only analytics

---

### 5.7 Notifications Module

**Purpose:** Alert users about achievements, streaks, challenges, and platform updates.

#### Notification Types

| Type | Trigger | Channel |
|---|---|---|
| Achievement Earned | Badge or level awarded | In-app, email |
| Streak Reminder | User hasn't typed today | Push, email |
| Daily Challenge | New challenge available | In-app push |
| Race Invitation | Friend invites to race | In-app, email |
| Weekly Summary | Every Monday | Email |
| Certificate Ready | Typing test completed | In-app, email |

#### Channels

- In-app notification bell (real-time via Socket.IO)
- Email (SendGrid templates, user can unsubscribe per type)
- Browser push notifications (Web Push API, opt-in)

#### API Endpoints

- GET /api/notifications/:userId
- PUT /api/notifications/:id/read
- PUT /api/users/:id/notification-preferences

---

### 5.8 Social Module

**Purpose:** Enable users to connect, compete, and share achievements.

#### Features

- Follow / Friend system (mutual follow = friends)
- Send race challenges directly to friends
- Share achievements as image cards to social media
- View friends' recent activity feed
- Private friend leaderboard

#### Social Sharing

- Auto-generated image card for badges and WPM milestones
- OG metadata for rich link previews on Twitter/Facebook
- Direct link sharing (no account needed to view result)

---

### 5.9 Analytics Module

**Purpose:** Give users deep insight into their typing performance over time.

#### Metrics Tracked Per User

- WPM trend over time (daily/weekly/monthly)
- Accuracy trend over time
- Error heatmap by key (which keys are slowest/most mistyped)
- Time spent typing per day
- Lessons completed vs. total available
- Game score history by mode
- Streak history calendar (GitHub-style contribution graph)
- XP earned per day

#### Visualizations

- Line chart: WPM progress over 30 days
- Bar chart: accuracy by lesson category
- Heatmap: keyboard error map
- Calendar: streak and activity map
- Gauge: current level and XP progress

#### API Endpoints

- GET /api/analytics/:userId/wpm-trend?period=30d
- GET /api/analytics/:userId/key-errors
- GET /api/analytics/:userId/activity-calendar

---

### 5.10 Premium / Monetization Module

**Purpose:** Provide optional paid features to sustain the platform.

#### Free Tier

- All beginner and intermediate lessons
- 5 games per day
- Global leaderboard access
- 1 language

#### Premium Tier ($5.99/month or $49.99/year)

- Unlimited games per day
- All advanced lessons
- Story mode
- Multi-language support
- Ad-free experience
- Keyboard skins and UI themes
- Detailed analytics and key error heatmap
- Typing test certificate generation
- Priority multiplayer matchmaking
- Exclusive premium badges

#### Implementation

- Stripe for payment processing
- Subscription status stored on User record
- Grace period: 3 days after payment failure before downgrade
- Annual billing with 30% discount over monthly

---

## 6. Database Schema

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  display_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_points INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ
);

-- User Stats
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  avg_wpm DECIMAL(6,2) DEFAULT 0,
  best_wpm DECIMAL(6,2) DEFAULT 0,
  avg_accuracy DECIMAL(5,2) DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  total_time_minutes INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  level VARCHAR(20) NOT NULL CHECK (level IN ('beginner','intermediate','advanced')),
  category VARCHAR(50),
  language VARCHAR(10) DEFAULT 'en',
  content_text TEXT NOT NULL,
  estimated_duration INTEGER,
  order_index INTEGER,
  is_active BOOLEAN DEFAULT TRUE
);

-- Typing Sessions
CREATE TABLE typing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_type VARCHAR(20) NOT NULL,
  wpm DECIMAL(6,2),
  accuracy DECIMAL(5,2),
  duration_seconds INTEGER,
  errors INTEGER DEFAULT 0,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  category VARCHAR(50),
  condition_type VARCHAR(50),
  condition_value JSONB
);

-- User Badges
CREATE TABLE user_badges (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Leaderboard Snapshots
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  period_type VARCHAR(20) NOT NULL,
  period_key VARCHAR(20),
  score DECIMAL(10,2),
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_sessions_user_id ON typing_sessions(user_id);
CREATE INDEX idx_sessions_created_at ON typing_sessions(created_at DESC);
CREATE INDEX idx_leaderboard_period ON leaderboard_entries(period_type, period_key);
CREATE INDEX idx_users_xp ON users(xp DESC);
```

---

## 7. API Reference

### Authentication

All protected routes require: `Authorization: Bearer <JWT_TOKEN>`

### Base URL

`https://api.typemaster.io/v1`

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 100 },
  "error": null
}
```

### Error Format

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### Key Endpoints Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /auth/register | No | Create account |
| POST | /auth/login | No | Login, receive JWT |
| POST | /auth/refresh | No | Refresh access token |
| GET | /users/:id/profile | Yes | Get user profile |
| PUT | /users/:id/profile | Yes (owner) | Update profile |
| GET | /users/:id/stats | Yes | Get user stats |
| GET | /lessons | No | List lessons |
| GET | /lessons/:id | No | Get lesson detail |
| POST | /lessons/:id/complete | Yes | Submit lesson result |
| GET | /games/modes | No | List game modes |
| POST | /games/rooms | Yes | Create race room |
| POST | /games/:id/score | Yes | Submit game score |
| GET | /leaderboard | No | Get leaderboard |
| GET | /analytics/:userId/wpm-trend | Yes | WPM trend data |
| GET | /notifications/:userId | Yes | Get notifications |
| POST | /admin/users/:id/suspend | Admin | Suspend user |

---

## 8. Frontend Architecture

### 8.1 Project Structure

```
src/
├── components/
│   ├── common/          # Button, Input, Modal, Badge
│   ├── typing/          # TypingArea, KeyHighlight, WPMDisplay
│   ├── games/           # GameRoom, RaceProgress, Timer
│   ├── lessons/         # LessonCard, LessonPlayer
│   ├── leaderboard/     # LeaderboardTable, RankBadge
│   ├── profile/         # ProfileHeader, StatsGrid, BadgeCollection
│   └── admin/           # UserTable, ContentEditor
├── pages/
│   ├── Home.jsx
│   ├── Lessons.jsx
│   ├── Games.jsx
│   ├── Leaderboard.jsx
│   ├── Profile.jsx
│   └── Admin.jsx
├── store/
│   ├── authSlice.js
│   ├── gameSlice.js
│   └── notificationSlice.js
├── hooks/
│   ├── useTypingEngine.js   # Core typing logic
│   ├── useTimer.js
│   └── useSocket.js
├── utils/
│   ├── wpmCalculator.js
│   ├── errorAnalysis.js
│   └── certificateGenerator.js
└── services/
    ├── api.js              # Axios instance
    └── socket.js           # Socket.IO client
```

### 8.2 Typing Engine (Core Hook)

The `useTypingEngine` hook is the heart of the frontend:

- Tracks current character index
- Compares user input against expected text in real time
- Builds character state array: each char has status: pending / correct / incorrect
- Calculates live WPM every second
- Handles backspace: marks char as pending again, decrements index
- Emits progress events for multiplayer sync
- Returns: charStates, currentIndex, wpm, accuracy, isComplete

### 8.3 Real-time Multiplayer Flow

1. User creates or joins a race room (POST /api/games/rooms)
2. Room code is shared with other players
3. All players connect via Socket.IO to room channel
4. Host starts countdown (game:start event)
5. Each player's progress is emitted every 100ms (game:progress)
6. All progress bars updated live for all players
7. First to 100% triggers game:finish
8. After all finish or timeout, game:end delivers final standings

---

## 9. Gamification System

### 9.1 XP & Level Flow

```
User completes activity
     ↓
XP calculated based on activity type and performance
     ↓
XP added to user record
     ↓
Level threshold check
     ↓
If new level reached → emit LEVEL_UP event → show animation → check for unlocks
```

### 9.2 Badge Award Flow

```
Activity completed
     ↓
Badge conditions evaluated (all badge types scanned)
     ↓
New badge conditions met?
     ↓ Yes
Award badge → save to user_badges → send notification → show toast
```

### 9.3 Streak System

- A streak is maintained by completing at least one typing activity per calendar day
- Streak checked and updated on each session completion
- Midnight UTC is the day boundary
- Missed day: streak resets to 0
- Streak freeze: premium users get 1 streak freeze per week (protects against 1 missed day)

### 9.4 Daily/Weekly Missions

Generated fresh each day/week. Examples:

**Daily:**
- Type 500 words (+30 XP)
- Complete 2 lessons (+40 XP)
- Finish a time challenge (+25 XP)

**Weekly:**
- Maintain a 5-day streak (+200 XP)
- Win 3 races (+150 XP)
- Complete an advanced lesson (+100 XP)

---

## 10. Security Specifications

### Authentication Security

- Passwords hashed with bcrypt (rounds: 12)
- JWT access tokens expire in 15 minutes
- Refresh tokens stored in httpOnly cookies
- Rate limiting on auth endpoints: 5 requests/minute per IP
- Email verification required before full access

### Input Validation

- All inputs validated with Zod schemas on server
- SQL injection prevented via Prisma parameterized queries
- XSS prevented by React's default escaping + DOMPurify on text imports
- CSRF protection via SameSite cookie policy

### Data Protection

- All passwords and tokens encrypted at rest
- HTTPS enforced (HSTS header)
- Sensitive user data access logged for audit
- PII deletion supported (GDPR compliance)
- Lesson text content not exposed in bulk API

### Rate Limiting

| Endpoint | Limit |
|---|---|
| POST /auth/login | 5/min per IP |
| POST /auth/register | 3/min per IP |
| POST /games/rooms | 10/min per user |
| GET /leaderboard | 60/min per IP |

---

## 11. Deployment & Infrastructure

### 11.1 Environment Configuration

```
# .env.production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=<256-bit secret>
REFRESH_TOKEN_SECRET=<256-bit secret>
SENDGRID_API_KEY=...
STRIPE_SECRET_KEY=...
AWS_S3_BUCKET=typemaster-assets
FRONTEND_URL=https://typemaster.io
```

### 11.2 Deployment Pipeline

```
Git push to main
     ↓
GitHub Actions: lint + test
     ↓
Build Docker image
     ↓
Push to ECR
     ↓
Deploy to EC2 cluster (zero-downtime rolling update)
     ↓
Health check pass → mark deployment complete
```

### 11.3 Scaling Strategy

- Horizontal scaling: stateless Node.js API behind a load balancer
- Redis adapter for Socket.IO to support multi-instance WebSocket sessions
- PostgreSQL read replicas for analytics and leaderboard queries
- Redis sorted sets for real-time leaderboard updates (O(log N) per update)
- CDN for all static assets and lesson text content

---

## 12. Testing Strategy

### 12.1 Unit Tests

- WPM and accuracy calculation functions
- XP and badge award logic
- Streak increment and reset logic
- Leaderboard ranking utilities

### 12.2 Integration Tests

- All REST API endpoints (happy path + error cases)
- Auth flows: register, login, token refresh, OAuth callback
- Lesson completion and score submission
- Badge award trigger tests

### 12.3 End-to-End Tests

- User registration to first lesson complete flow
- Full multiplayer race: room create → join → play → finish
- Admin: create lesson → publish → visible to users

### 12.4 Performance Tests

- Simulate 5,000 concurrent typing sessions
- Leaderboard update under load (1,000 writes/second)
- WebSocket connection scalability (500 concurrent races)

### 12.5 Coverage Target

- Unit: ≥ 80%
- Integration: ≥ 70%
- E2E: critical user flows covered 100%

---

## 13. Performance Requirements

| Metric | Target |
|---|---|
| Typing feedback latency | < 16ms (1 frame at 60fps) |
| API response (p95) | < 200ms |
| Page load (initial) | < 3 seconds |
| Time to interactive | < 5 seconds |
| WebSocket message latency | < 50ms |
| Leaderboard refresh | < 500ms |
| Certificate PDF generation | < 3 seconds |

---

## 14. Accessibility Standards

- WCAG 2.1 Level AA compliance
- All interactive elements keyboard navigable
- ARIA labels on all typing input areas, game controls, and score displays
- Screen reader compatible lesson content
- Color contrast ratio ≥ 4.5:1 for all text
- Focus indicators visible on all interactive elements
- Typing area usable without mouse
- Reduced motion mode: disables all animations for users who prefer it

---

## 15. Roadmap & Future Enhancements

### Phase 1 — MVP (Months 1–3)

- User auth (email + Google)
- Beginner and intermediate lessons (English)
- Time Challenge game mode
- WPM and accuracy tracking
- Basic leaderboard (global, all-time)
- Profile with stats

### Phase 2 — Gamification (Months 4–6)

- XP and leveling system
- Badges and achievements
- Daily challenges and missions
- Streak system
- Advanced lessons

### Phase 3 — Multiplayer & Social (Months 7–9)

- Multiplayer race mode
- Friends system
- Social sharing
- Regional leaderboards

### Phase 4 — Advanced Features (Months 10–12)

- Story mode
- Adaptive lessons (AI difficulty adjustment)
- Multi-language: Bangla and Hindi
- Text import
- Typing test and certificate
- Premium tier and Stripe payments

### Phase 5 — Scale & Polish (Year 2)

- Mobile app (React Native)
- Browser extension for in-context typing practice
- API for third-party integrations
- Corporate / team accounts
- Custom keyboard sound packs

---

*TypeMaster Software Documentation — v1.0.0 — March 2026*  
*Confidential and Proprietary*
