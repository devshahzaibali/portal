# Internship & Job Application Portal — Backend

A role-based recruitment API: candidates apply to jobs, recruiters manage listings and
pipelines, admins approve companies and jobs. Backend only — no frontend included.

## Tech stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication, bcrypt password hashing
- express-validator for input validation

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in real values:
   ```
   cp .env.example .env
   ```

3. Make sure MongoDB is running locally (or update `MONGO_URI` to point to Atlas).

4. Seed the database with demo data and test accounts:
   ```
   npm run seed
   ```

5. Start the server:
   ```
   npm run dev
   ```
   API runs at `http://localhost:5000/api` by default.

## Environment variables

| Variable | Meaning |
|---|---|
| `PORT` | Port the server listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs — must be long and random in production |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `NODE_ENV` | `development` or `production` — controls error detail and logging |

## Test accounts (created by `npm run seed`)

| Role | Email | Password | Notes |
|---|---|---|---|
| Admin | admin@test.com | Admin@1234 | Full platform access |
| Recruiter | sara.recruiter@test.com | Recruiter@123 | Company "Triad Labz" — approved, has active jobs |
| Recruiter | bilal.recruiter@test.com | Recruiter@123 | Company "Code-XA" — pending approval |
| Candidate | ali.candidate@test.com | Candidate@123 | One of 5 seeded candidates (also ayesha, usman, fatima, hamza — same password) |

## Roles and permissions

| Role | Can do |
|---|---|
| Candidate | Manage own profile, search approved jobs, apply once per job, track own applications |
| Recruiter | Create one company, post jobs under it, manage applicants and interviews for own jobs only |
| Admin | Approve/reject companies and jobs, manage users, view all applications for moderation |

## API base URL

```
http://localhost:5000/api
```

## Endpoint reference

All protected routes require `Authorization: Bearer <token>` header.

### Auth
- `POST /auth/register` — candidate or recruiter only
- `POST /auth/login`
- `GET /auth/me`

### Candidate Profile (candidate only)
- `GET /profile`
- `PATCH /profile`

### Company (recruiter only)
- `POST /companies`
- `GET /companies/my-company`
- `PATCH /companies/:id`

### Jobs
- `GET /jobs` — public, approved jobs only, supports `keyword`, `location`, `workMode`,
  `type`, `skills`, `page`, `limit`
- `GET /jobs/:id` — public for approved jobs; owner/admin can view own non-approved jobs
- `POST /jobs` — recruiter only, company must be approved first
- `PATCH /jobs/:id` — recruiter only, own jobs only, resets status to pending on edit
- `DELETE /jobs/:id` — recruiter only, own jobs only
- `PATCH /jobs/:id/approve` — admin only
- `GET /jobs/:id/applications` — recruiter only, own jobs only

### Applications
- `POST /applications/jobs/:jobId/apply` — candidate only
- `GET /applications/my-applications` — candidate only
- `GET /applications/:id` — candidate (own), recruiter (own job), or admin
- `PATCH /applications/:id/status` — recruiter (own job) or admin; terminal statuses
  (hired/rejected) can only be changed by an admin

### Interviews
- `POST /interviews/applications/:applicationId/interview` — recruiter only, own job only
- `GET /interviews/:applicationId`
- `PATCH /interviews/:id` — recruiter only, own job only

### Admin
- `GET /admin/companies?status=pending`
- `PATCH /admin/companies/:id/approve`
- `GET /admin/users?role=candidate`
- `PATCH /admin/users/:id/deactivate`
- `GET /admin/jobs?status=pending`

### Dashboard
- `GET /dashboard/candidate`
- `GET /dashboard/recruiter`
- `GET /dashboard/admin`

## Business rules enforced

- A candidate can apply to a job at most once — enforced by a unique compound index on
  `{ job, candidate }`, not just application logic.
- Applications are rejected if the job is not approved or the deadline has passed.
- A recruiter can only edit/delete their own company and job listings.
- Only the recruiter who owns a job can change its applicants' status or schedule
  interviews for it.
- `hired` and `rejected` are terminal — once set, only an admin can change them further.
- Jobs must be approved by an admin before they appear in public search results,
  regardless of what filters are applied.
- Editing an already-approved job or company sends it back to "pending" — a recruiter
  cannot silently change content on an approved listing.

## Testing

A Postman collection covering every endpoint (including negative/permission tests) is
provided separately. Run the "Auth" folder first — login requests auto-save JWTs into
collection variables used by every other request.
