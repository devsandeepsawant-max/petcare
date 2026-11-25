# Pawsome Grooming Studio – MVP

> A production-minded, responsive dog grooming business management and online appointment booking platform built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Supabase.

---

## 🐾 Table of Contents

- [Overview & Objective](#overview--objective)
- [Design System & Brand Identity](#design-system--brand-identity)
- [System Architecture & Roles](#system-architecture--roles)
- [Application Routes](#application-routes)
- [Database Schema & Migrations](#database-schema--migrations)
- [Row Level Security (RLS)](#row-level-security-rls)
- [10-Step Booking Engine](#10-step-booking-engine)
- [Payments & Integrations](#payments--integrations)
- [Getting Started & Local Development](#getting-started--local-development)
- [Environment Variables](#environment-variables)
- [Vercel Deployment Guide](#vercel-deployment-guide)

---

## 1. Overview & Objective

Pawsome Grooming Studio is an end-to-end digital operations platform built for modern canine salons:
1. **Dog Owners (Customers):** Discover services, inspect size-tiered pricing, register profiles for multiple pets (allergies, coat type, temperament, vaccination records), reserve collision-free appointments via a 10-step wizard, and manage bookings within cancellation policy windows.
2. **Business Owners (Admin):** Live KPI dashboard, status transition pipeline (`PENDING` → `CONFIRMED` → `CHECKED_IN` → `IN_PROGRESS` → `COMPLETED`), groomer assignment, calendar schedule grid, service catalog configuration, customer CRM, and downloadable CSV revenue reports.
3. **Staff Groomers:** Mobile-first portal displaying daily assigned schedules, pre-groom 7-point health check, active session timers, behavior notes, before/after photo documentation, and non-medical veterinary referral flagging.

---

## 2. Design System & Brand Identity

- **Primary Forest Green:** `#1B402D` / `#2D784F` – evokes natural care, calm, and clinical safety.
- **Warm Cream Canvas:** `#FAF8F5` / `#F5F0E8` – comforting, avoiding sterile hospital white.
- **Coral / Terracotta Accent:** `#F45E3C` / `#E04320` – vibrant, friendly calls-to-action.
- **Charcoal Typography:** `#1F2937` with **Inter** and **Poppins** typography.
- **Physical Feel:** Soft rounded corners (`rounded-2xl`, `rounded-3xl`), subtle elevation shadows (`shadow-soft`), accessible high-contrast form controls, and explicit loading/empty states.

---

## 3. System Architecture & Roles

```
┌────────────────────────────────────────────────────────┐
│             Next.js 15 Full-Stack App Router           │
├────────────────────┬─────────────────┬─────────────────┤
│ Customer Portal    │ Groomer Portal  │ Admin Suite     │
│ /, /services,      │ /groomer        │ /admin          │
│ /booking, /account │ /groomer/sess   │ /admin/bookings │
├────────────────────┴─────────────────┴─────────────────┤
│ API Handlers: /api/availability, /api/bookings, etc.   │
├────────────────────────────────────────────────────────┤
│ Dual Data Layer: PostgreSQL / Supabase + In-Memory Store│
└────────────────────────────────────────────────────────┘
```

The system features three distinct role perspectives:
- **`customer`**: Self-service profile management, pet health records, and personal booking history.
- **`groomer`**: Assigned appointments view, pre-groom health check, and session completion.
- **`admin`**: Global operational control, staff availability, service catalog pricing, and revenue audits.

*For testing convenience, the top navigation includes a 1-click **Role Switcher** to instantly evaluate the interface as Customer, Groomer, or Admin.*

---

## 4. Application Routes

### Customer Website
- `/`: Hero, "Because Every Dog Deserves a Little Extra Care", Why Choose Us, 4-Step Process, Before/After Gallery, Verified Demo Testimonials, FAQs, Location & Hours.
- `/services`: Full service catalog cards with durations and starting rates.
- `/services/[slug]`: Dedicated service breakdown with pet-size matrix and direct booking trigger.
- `/pricing`: Interactive size switcher (Small, Medium, Large) calculating dynamic package costs.
- `/about`: Fear-free ethos, 5-point cleanliness pledge, and certified stylist background.
- `/contact`: Bangalore studio address, phone, email, inquiries form, and hours.
- `/login`: Email/password authentication with 1-click demo role switcher.
- `/register`: Pet parent registration with safety policy consent.
- `/account`: Overview of upcoming appointments and registered dogs.
- `/account/pets`: Pet profiles directory with size, coat, and vaccination status.
- `/account/pets/new`: Register a new pet profile.
- `/account/pets/[id]`: Edit existing pet parameters.
- `/account/bookings`: Booking history with status badges and 24h cancellation rules.
- `/account/profile`: Emergency contact and address settings.

### 10-Step Booking Engine
- `/booking`: Complete 10-step wizard:
  1. Select Service
  2. Select Pet
  3. Select Optional Add-ons
  4. Dynamic Price Calculation (Snapshot)
  5. Select Date & Stylist
  6. Display Real-Time Available Slots
  7. Special Instructions
  8. Review Booking Summary
  9. Confirm Booking & Payment Choice
  10. Confirmation Reference Screen (`DG-XXXXXX`)

### Admin Dashboard
- `/admin`: KPI metrics (Total bookings, today's schedule, pipeline, gross revenue), service popularity charts, and recent bookings.
- `/admin/bookings`: Search, filter by date/status/groomer, assign groomer, and trigger status transitions.
- `/admin/calendar`: Stylist schedule grid for visual collision tracking.
- `/admin/services`: Service catalog, duration, and size-tiered pricing (₹ INR).
- `/admin/customers`: Customer CRM with registered pets and staff internal notes.
- `/admin/groomers`: Stylist roster, specialties, and active toggles.
- `/admin/reports`: Gross booked pipeline, realized revenue, cancellation rates, and CSV export.
- `/admin/settings`: Studio hours, cancellation policy window, and payment toggles.

### Groomer Portal
- `/groomer`: Daily overview of assigned appointments and quick check-in actions.
- `/groomer/bookings`: Detailed assigned schedule.
- `/groomer/sessions`: Active grooming session management.
- `/groomer/sessions/[id]`: 3-stage session workflow (pre-groom observation, during-groom temperament, before/after photo documentation, non-medical veterinary referral flag, and completion).

---

## 5. Database Schema & Migrations

The database includes 22 PostgreSQL tables located in `supabase/migrations/`:

1. `profiles`
2. `customers`
3. `pets`
4. `pet_health_records`
5. `pet_documents`
6. `services`
7. `service_pricing`
8. `service_addons`
9. `groomers`
10. `groomer_availability`
11. `appointments`
12. `appointment_items`
13. `grooming_sessions`
14. `grooming_notes`
15. `grooming_photos`
16. `payments`
17. `invoices`
18. `reviews`
19. `notifications`
20. `incidents`
21. `business_settings`
22. `audit_logs`

### Migration Files
- `supabase/migrations/20261124000000_init_schema.sql`: Full schema DDL with check constraints, foreign keys, indexes, and RLS policies.
- `supabase/migrations/20261124000001_seed_demo_data.sql`: Seed data for services, size tiers, staff groomers, and business settings.

---

## 6. Payments & Integrations

### Razorpay Integration
- Server-side order generation (`/api/payments/razorpay/create-order`).
- Server-side HMAC SHA-256 cryptographic signature verification (`/api/payments/razorpay/verify`).
- Automatic fallback: when Razorpay credentials are not provided in environment variables, the system automatically activates a clearly-labeled **Demo / Test Mode**.

### Payment Methods Supported
- **UPI QR Codes** (Google Pay, PhonePe, Paytm).
- **Credit / Debit Cards & NetBanking** (via Razorpay).
- **Cash on Pick-up** (recorded in studio).

---

## 7. Getting Started & Local Development

### Prerequisites
- Node.js 18+ (tested on Node 24)
- npm 9+

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start Next.js development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 8. Environment Variables

Create `.env.local` based on `.env.local.example`:

```env
# Supabase Backend
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay (Optional - leave blank for built-in sandbox demo mode)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_WEBHOOK_SECRET=

# Notifications
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=appointments@pawsomecare.com
WHATSAPP_API_KEY=
```

---

## 9. Vercel Deployment Guide

1. Push code to your GitHub repository.
2. In Vercel, click **"Add New Project"** and select the repository.
3. Configure the environment variables in the Vercel dashboard.
4. Click **Deploy**. Next.js App Router will automatically build and deploy the production bundle.

