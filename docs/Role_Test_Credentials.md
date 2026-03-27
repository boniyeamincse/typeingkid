# Role-Based Testing Credentials

These demo accounts are used for local RBAC testing in TypeMaster/TypingKids.

## Seed Command

Run this in the backend folder to create/update demo accounts:

```bash
npm run seed
```

## Demo Accounts

| Role | Email | Password | Expected Frontend Route |
|---|---|---|---|
| USER | demo_user@typingkids.dev | DemoUser123! | /dashboard |
| EDUCATOR | demo_educator@typingkids.dev | DemoEducator123! | /educator |
| ADMIN | demo_admin@typingkids.dev | DemoAdmin123! | /admin |

## Login URL (Local)

- Frontend: `http://localhost:5173/login`
- Backend API base: `http://localhost:5000/api`

## Quick Role Checks

1. Login as USER:
- Can access `/dashboard` and `/profile`.
- Cannot access `/educator` or `/admin`.

2. Login as EDUCATOR:
- Can access `/dashboard`, `/profile`, and `/educator`.
- Cannot access `/admin`.

3. Login as ADMIN:
- Can access `/dashboard`, `/profile`, `/educator`, and `/admin`.
- Can manage users via admin APIs and lesson CRUD endpoints.

## Important

- These credentials are for local testing only.
- Do not use these passwords in production.
