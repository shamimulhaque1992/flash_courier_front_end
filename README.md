# Flash Courier — Frontend

Flash Courier is a full-stack courier management platform built for Bangladesh. It connects **Merchants** who need to ship parcels, **Riders** who deliver them, and **Customers** who receive them — all managed by **Admins** and a **Super Admin**. The platform solves the problem of fragmented, manual courier coordination by providing each role with a dedicated dashboard, real-time shipment tracking, automated payment processing, and a structured application workflow for onboarding new merchants and riders.

---

## Live URLs

| Service  | URL |
|----------|-----|
| Frontend | https://flash-courier-front-end.vercel.app/ |
| Backend  | https://flash-courier.vercel.app/ |

---

## Tech Stack

### Frontend
| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Base UI |
| Server State | TanStack Query v5 |
| Forms | TanStack Form |
| Validation | Zod v4 |
| HTTP Client | ofetch |
| Auth | JWT (cookie-based) + Google OAuth (`@react-oauth/google`) |
| Icons | Lucide React |
| Date Utilities | date-fns |
| Linter/Formatter | Biome |

### Backend
| Category | Technology |
|----------|-----------|
| Runtime | Node.js |
| Framework | Express v5 |
| Language | TypeScript |
| ORM | Prisma v7 |
| Database | PostgreSQL |
| Cache | Redis |
| Auth | JWT + Google OAuth |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer (EJS templates) |
| PDF Generation | PDFKit |
| Scheduled Jobs | node-cron |
| Validation | Zod |
| Linter/Formatter | Biome |

---

## Local Setup Guide

### Prerequisites

- Node.js 18+
- npm or pnpm
- Backend server running (see backend README) or use the live backend URL

---

### 1. Clone the repository

```bash
git clone <repository-url>
cd flash_courier_full_stack/flash_courier_front_end
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of the frontend directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# One-click demo login credentials
NEXT_PUBLIC_TESTER_ADMIN_EMAIL=testeradmin@gmail.com
NEXT_PUBLIC_TESTER_ADMIN_PASSWORD=testeradmin123aA@
NEXT_PUBLIC_TESTER_MERCHANT_EMAIL=testermerchant@gmail.com
NEXT_PUBLIC_TESTER_MERCHANT_PASSWORD=testermerchant123aA@
NEXT_PUBLIC_TESTER_RIDER_EMAIL=testerrider@gmail.com
NEXT_PUBLIC_TESTER_RIDER_PASSWORD=testerrider123aA@
NEXT_PUBLIC_TESTER_CUSTOMER_EMAIL=testercustomer@gmail.com
NEXT_PUBLIC_TESTER_CUSTOMER_PASSWORD=testercustomer123aA@
```

> To use the live backend instead of running it locally, set `NEXT_PUBLIC_API_BASE_URL=https://flash-courier.vercel.app/api/v1`

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm run start
```

---

## Demo Accounts

Use the one-click login buttons on the login page to instantly sign in as any role:

| Role | Email |
|------|-------|
| Admin | testeradmin@gmail.com |
| Merchant | testermerchant@gmail.com |
| Rider | testerrider@gmail.com |
| Customer | testercustomer@gmail.com |
