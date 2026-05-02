<p align="center">
  <a href="https://quick-hire-client-chi.vercel.app" target="blank"><img src="https://res.cloudinary.com/dp6urj3gj/image/upload/v1772487956/quick-hire-logo_kfga0x.png" width="240" alt="QuickHire Logo" /></a>
</p>

<p align="center">A modern recruitment platform UI: jobs, applications, recruiter and admin portals, and Stripe-powered course purchases against the Quick Hire API.</p>

# QUICK HIRE CLIENT

**QUICK HIRE CLIENT** is the Next.js frontend for Quick Hire. Applicants browse jobs, manage profiles, apply with CV upload, and buy published courses (checkout hosted by Stripe). Recruiters manage listings and incoming applications. Staff use the dashboard for moderation, taxonomy (industries / sub-industries), user administration, and course management.

🌐 **Frontend Live URL:** [https://quick-hire-client-chi.vercel.app](https://quick-hire-client-chi.vercel.app)  
🌐 **Backend Live URL:** [https://quick-hire-server.onrender.com](https://quick-hire-server.onrender.com)  
🌐 **Frontend GitHub:** [https://github.com/mazharul90007/quick-hire](https://github.com/mazharul90007/quick-hire)  
🌐 **Backend GitHub:** [https://github.com/mazharul90007/quick-hire-server](https://github.com/mazharul90007/quick-hire-server)  
📚 **API documentation:** [Postman Documentation](https://documenter.getpostman.com/view/40157327/2sBXcKAcnk)

---

## ✨ Features

### Roles (enforced server-side)

`APPLICANT` · `RECRUITER` · `ADMIN` · `SUPER_ADMIN`

### 👤 Applicant

- **AI Match**: **Natural language job search** using RAG (Retrieval-Augmented Generation). Describe your dream role and get AI-summarized job matches.
- **Job discovery**: Listing and detail pages with filters (e.g. title, location, type).
- **Featured jobs** on the home experience.
- **Apply**: Authenticated apply flow with CV (PDF) and note; aligns with application APIs.
- **Profile**: Applicant profile and assets (backed by Cloudinary on the server).
- **Courses**: Public catalog, **Stripe Checkout** via server session (redirect), purchase history, success/cancel pages, receipt download when the API returns a PDF.
- **Auth**: Better Auth (email/password), session-aware navigation; email verification and password reset are handled by the backend mailer.

### 🏢 Recruiter

- **Dashboard** overview and job/application workflows.
- **Jobs**: Create and update postings (including fields such as employment type, salary, deadlines, featured flag, extended requirements where exposed in the UI).
- **Applications**: Review applications tied to their jobs.

### 🛠️ Admin / super admin

- **Overview** and operational stats (jobs, applications, users) where implemented in the UI.
- **Users**: Manage applicants, recruiters, and staff lists with filtering/tabs as provided.
- **Applications**: Cross-cutting application views for moderation.
- **Taxonomy**: Industry and sub-industry management.
- **Courses**: CRUD for sellable courses (pricing, access duration, publish flag) against `/admin/courses`.

### 🌐 Public

- Marketing/home sections, public job and course catalog, and sign-in/register entry points.

---

## 🛠️ Technology stack

- **Framework**: [Next.js](https://nextjs.org/) (v16.1.6), App Router
- **UI**: [React](https://react.dev/) 19, [Tailwind CSS v4](https://tailwindcss.com/), Radix UI, Shadcn-style components
- **Data**: [TanStack Query](https://tanstack.com/query), [Axios](https://axios-http.com/) instance for REST
- **State**: [Zustand](https://github.com/pmndrs/zustand)
- **Auth**: [Better Auth](https://www.better-auth.com/) client (`baseURL` derived from `NEXT_PUBLIC_API_URL`)
- **Forms**: React Hook Form, [Zod](https://zod.dev/), `@hookform/resolvers`
- **UX**: Sonner toasts, SweetAlert2 where used, Lucide React & React Icons

> Stripe secrets and webhooks live on the **server**; the client starts checkout using the API and follows the returned checkout URL.

---

## 📋 Prerequisites

- **Node.js** v20+ recommended
- **pnpm** or **npm**
- A running **Quick Hire Server** (local or deployed) — see [quick-hire-server README](https://github.com/mazharul90007/quick-hire-server/blob/main/README.md) for database, Cloudinary, email, and Stripe setup

---

## 🔧 Setup

### 1. Clone and enter the client

```bash
git clone https://github.com/mazharul90007/quick-hire.git
cd quick-hire/quick-hire-client
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment variables

Create `.env.local` in this directory.

**Production / hosted API**

```env
NEXT_PUBLIC_API_URL="https://quick-hire-server.onrender.com/api/v1"
```

**Local API** (default server port from backend README is `4000`)

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
```

The Better Auth client uses the same host with `/api/v1` stripped, so it must match your server’s public URL and CORS/cookie settings.

### 4. Run the dev server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For full flows (uploads, checkout, mail), run the backend with a valid `.env` as described in the server README.

---

## 📜 Project structure

- `src/app` — App Router routes: public site, `(applicant)`, `(recruiter)`, `(dashboard)` admin, auth pages
- `src/components` — Shared UI, dashboard, auth, jobs, portal shell
- `src/hooks` — React Query hooks and data helpers
- `src/lib` — Axios client, Better Auth client, API helpers, utilities
- `src/store` — Zustand stores
- `src/types` — Shared TypeScript shapes for API responses
- `src/assets` — Static images and media

---

## 🗂️ Backend reference

Data model and REST surface are documented in the **server** repo (including ERD image and endpoint list). Use the Postman link above for request/response details.

---

## 👤 Author

**Mazharul Islam Sourabh**

---

## 📝 License

ISC
