#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  echo "Stopping development services..."

  if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi

  if [[ -n "$FRONTEND_PID" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi

  wait 2>/dev/null || true
  echo "All services stopped."
}

trap cleanup INT TERM EXIT

echo "Starting TypingKids development environment..."

echo "[1/4] Checking dependencies"
if [[ ! -d "$BACKEND_DIR/node_modules" ]]; then
  echo "Installing backend dependencies..."
  (cd "$BACKEND_DIR" && npm install)
fi

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
  echo "Installing frontend dependencies..."
  (cd "$FRONTEND_DIR" && npm install)
fi

echo "[2/4] Preparing database schema"
(
  cd "$BACKEND_DIR"
  npx prisma migrate deploy
  npx prisma generate
)

echo "[3/4] Seeding role-based demo users"
(
  cd "$BACKEND_DIR"
  npm run seed
)

echo "[4/4] Launching backend and frontend"
(
  cd "$BACKEND_DIR"
  npm run dev
) &
BACKEND_PID=$!

(
  cd "$FRONTEND_DIR"
  npm run dev
) &
FRONTEND_PID=$!

echo ""
echo "Development environment is running:"
echo "- Frontend: http://localhost:5173"
echo "- Backend:  http://localhost:5000"
echo ""
echo "Demo test users (seeded):"
echo "- USER     | demo_user@typingkids.dev     | DemoUser123!     | /dashboard"
echo "- EDUCATOR | demo_educator@typingkids.dev | DemoEducator123! | /educator"
echo "- ADMIN    | demo_admin@typingkids.dev    | DemoAdmin123!    | /admin"
echo ""
echo "Press Ctrl+C to stop both services."

wait -n "$BACKEND_PID" "$FRONTEND_PID"

echo "One of the services exited. Shutting down the rest..."
cleanup
trap - INT TERM EXIT
exit 1
