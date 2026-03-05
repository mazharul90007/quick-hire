<p align="center">
  <a href="https://quick-hire-client-chi.vercel.app" target="blank"><img src="https://res.cloudinary.com/dp6urj3gj/image/upload/v1772487956/quick-hire-logo_kfga0x.png" width="240" alt="QuickHire Logo" /></a>
</p>

  <p align="center">A professional and scalable job portal application built with modern technologies.</p>

# QUICK HIRE CLIENT

**QUICK HIRE CLIENT** is a modern, responsive job portal frontend designed for a seamless recruitment experience. It allows applicants to discover opportunities, manage their profiles, and track applications, while providing administrators with a powerful dashboard for managing job listings and platform operations.

🌐 **Frontend Live URL:** [https://quick-hire-client-chi.vercel.app](https://quick-hire-client-chi.vercel.app)  
🌐 **Backend Live URL:** [https://quick-hire-server.onrender.com](https://quick-hire-server.onrender.com)  
🌐 **Backend Github URL:** [https://github.com/mazharul90007/quick-hire-server](https://github.com/mazharul90007/quick-hire-server)

---

## ✨ Features

### 👤 Applicant Experience

- **Dynamic Job Board**: Browse and search through various job listings with advanced filters (title, district, type).
- **Featured Jobs**: Discover highlighted career opportunities right on the homepage.
- **Easy Application**: Submit applications for jobs with just a few clicks.
- **Email Verification**: Secure account activation and transactional notifications via Nodemailer.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views with a premium look.

### 🛠️ Admin Dashboard

- **Job Management**: Create, update, and manage job postings with a specialized UI.
- **Category Control**: Organize job listings into logical categories for better searchability.
- **Application Tracking**: Monitor all incoming job applications in real-time.
- **User Insights**: Overview of platform activity including total jobs and applications.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (v16.1.6)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Radix UI & Shadcn/UI
- **Authentication**: [Better-Auth](https://www.better-auth.com/)
- **API Client**: Axios with custom instance configuration
- **Icons**: Lucide React & React Icons
- **Form Handling**: React Hook Form with Zod validation

---

## 📋 Prerequisites

- **Node.js** (v20 or higher)
- **pnpm** or **npm**
- **Backend API Access** (Local or Remote)

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mazharul90007/quick-hire.git
cd quick-hire/quick-hire-client
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root of the client directory:-

```env
NEXT_PUBLIC_API_URL="https://quick-hire-server.onrender.com/api/v1"
```

### 4. Running Locally

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

---

## 📜 Project Structure

- `src/app`: Next.js App Router and page layouts.
- `src/components`: Reusable UI components (Shared, Dashboard, Auth).
- `src/hooks`: Custom React hooks for API interaction and UI state.
- `src/lib`: Utility functions, authentication client, and Axios instance.
- `src/store`: Zustand store for global state management.
- `src/assets`: Project images, logos, and static resources.

---

## 👤 Author

**Mazharul Islam Sourabh**

---

## 📝 License

ISC
