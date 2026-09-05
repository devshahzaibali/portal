# 🚀 Portal — Verified Internship & Career Discovery Platform

A full-stack, enterprise-grade job board and internship management platform connecting top talent with verified tech companies. Engineered with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Node.js/Express**, and **MongoDB**.

---

## 🌟 Key Highlights & Architecture

- **Clean Aesthetic & UX**: Executive modern design with curated warm-accent color palette, smooth micro-animations, glassmorphism, responsive navigation, and accessible typography powered by *Plus Jakarta Sans*.
- **Role-Based Access Control (RBAC)**: Secure authentication and route guards separating **Candidates**, **Recruiters**, and **Admins**.
- **Full Application Lifecycle**: Multi-step application submission, PDF/DOCX resume uploads via Multer, real-time application timeline tracking, and interview scheduling.
- **Enterprise Moderation**: Admin moderation pipeline requiring approval for new company registrations and job listings before going live to the public.
- **High Resilience**: Automatic database fallbacks (Atlas / In-Memory MongoDB) and client-side interceptors for error-free FormData uploads.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
- **UI & Animations**: React 19, [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Networking**: Axios with request/response interceptors & cookie-based JWT handling
- **Icons & Assets**: Custom brand SVGs & Lucide React

### Backend
- **Runtime**: Node.js, Express.js REST API
- **Database**: MongoDB with [Mongoose](https://mongoosejs.com/) (supports MongoDB Atlas & `mongodb-memory-server` fallback)
- **Authentication**: JSON Web Tokens (JWT) with HTTP-only cookies and bcryptjs password encryption
- **File Management**: Multer with disk storage for resumes (`.pdf`, `.doc`, `.docx`)
- **Validation**: Express-Validator with centralized error handling

---

## 👥 Platform Roles & Features

### 🎓 Candidate Experience
- **Interactive Job Search**: Filter opportunities by type (*Full-time, Internship, Contract*), work mode (*Remote, Hybrid, Onsite*), and keyword.
- **Dynamic Application Modal**: 3-step wizard (Personal Details, Professional Background, Resume upload / URL + Cover Note).
- **Candidate Dashboard**: Live application tracker (`applied` → `shortlisted` → `interview` → `offered` → `hired`), interview details, and status history.
- **Profile Management**: Structured resume and portfolio builder with education and work experience records.

### 🏢 Recruiter Experience
- **Company Setup**: Register company profile (name, website, location, description) with administrative verification.
- **Job Management**: Create and update job listings with compensation brackets, required skills, and deadlines.
- **Applicant Review**: Inspect submitted candidate profiles, read cover letters, preview resumes, and update applicant statuses.
- **Interview Scheduling**: Book online or onsite interviews with meeting links, dates, and instructions.

### 🛡️ Admin Moderation
- **Moderation Queue**: Review and approve/reject newly registered companies and submitted job postings.
- **User Management**: Monitor platform activity and deactivate accounts violating platform terms.
- **Analytics Dashboard**: Real-time counts of active listings, pending reviews, and users by role.

---

## ⚡ Quick Start & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### 1. Clone & Setup
```bash
git clone https://github.com/devshahzaibali/portal.git
cd portal
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
> The backend will start on **`http://localhost:5001`**. If no external MongoDB Atlas URI is reachable, it will automatically launch an in-memory MongoDB database and seed it with demo listings.

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> The frontend will be available at **`http://localhost:3000`**.

---

## 🔑 Pre-Configured Demo Credentials

The platform comes pre-seeded with test accounts for each role:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `Admin@1234` | Full Platform & Moderation Access |
| **Recruiter** | `sara.recruiter@test.com` | `Recruiter@123` | Approved Company (*Triad Labz*) & Job Postings |
| **Candidate** | `ali.candidate@test.com` | `Candidate@123` | Candidate Profile & Applications |

---

## 📂 Project Structure

```text
portal/
├── backend/
│   ├── config/          # Database configuration and fallbacks
│   ├── controllers/     # Route logic (auth, jobs, applications, admin, etc.)
│   ├── middleware/      # Auth, upload (multer), validation, error handling
│   ├── models/          # Mongoose schemas (User, Job, Company, Application, etc.)
│   ├── routes/          # Express route definitions
│   ├── seed/            # Database initialization and sample data
│   ├── uploads/         # Local resume file uploads
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js App Router (Public, Candidate, Recruiter, Admin)
│   │   ├── components/  # Reusable UI components, Modals, Navbar, Footer
│   │   ├── constants/   # Route definitions and dashboard mappings
│   │   ├── lib/         # Axios client, auth context, hooks, utils
│   │   └── types/       # TypeScript interfaces for API models
│   ├── public/          # Static assets & brand graphics
│   └── tailwind.config.ts
└── README.md
```

---

## 🔒 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=job_portal_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
MONGO_URI=mongodb+srv://...
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## 🧪 Production Build Verification
To ensure all pages compile cleanly:
```bash
cd frontend
npm run build
```
All static and dynamic routes generate cleanly with zero type errors.

---

## 📄 License
Private Repository & Proprietary Software. All rights reserved.
