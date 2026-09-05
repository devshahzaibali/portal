# Internship & Job Application Portal

Full-stack recruitment platform with a Next.js 15 frontend and Node/Express/MongoDB backend.

## Quick start

### Backend (port 5000)

```bash
cd Backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Frontend (port 3000)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test accounts (from seed data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | Admin@1234 |
| Recruiter | sara.recruiter@test.com | Recruiter@123 |
| Candidate | ali.candidate@test.com | Candidate@123 |

## Frontend stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS (walnut/wood design system)
- Framer Motion animations
- react-hook-form + zod validation
- Axios API client with JWT auth

## Route map

| Area | Routes |
|------|--------|
| Public | `/`, `/jobs`, `/jobs/[id]` |
| Auth | `/login`, `/register` |
| Candidate | `/dashboard`, `/profile`, `/applications` |
| Recruiter | `/recruiter/dashboard`, `/company`, `/recruiter/jobs/*`, `/applicants/[id]` |
| Admin | `/admin/dashboard`, `/admin/companies`, `/admin/jobs`, `/admin/users` |
