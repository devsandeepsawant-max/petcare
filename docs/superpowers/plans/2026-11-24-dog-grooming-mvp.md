# Dog Grooming Business Management & Online Booking MVP - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deliver a fully functional, production-minded Dog Grooming Business Management and Online Appointment Booking MVP with customer website, booking wizard, admin suite, groomer portal, PostgreSQL/Supabase schema, payments, and reporting.

**Architecture:** Next.js 15 App Router with TypeScript, Tailwind CSS, Lucide icons, unified server actions and API route handlers. Dual-layer data repository: Supabase PostgreSQL with RLS and schema migrations, coupled with a seamless zero-config local data provider for instantaneous verification and testability.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React, Supabase (@supabase/supabase-js, @supabase/ssr), Zod.

**Spec:** `docs/superpowers/specs/2026-11-24-dog-grooming-mvp-design.md`

## Global Constraints
- Primary color: Forest green (`#1B4332`), Warm cream background (`#FAF8F5`), Coral accent (`#E07A5F`), Charcoal text (`#1F2937`).
- Zero fake chart numbers or mocked unlabelled payments: all demo records are explicitly tagged as demo.
- Never hardcode prices in UI; calculate dynamically from database service pricing based on pet size and add-ons.
- Strict double-booking prevention at both time-slot generator and database transaction levels.
- Mobile-first responsive layouts across customer, groomer, and admin interfaces.

---

### Task 1: Scaffolding Next.js App, Dependencies & Brand Design System
**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `tailwind.config.ts`
- Create: `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/lib/utils.ts`, `src/lib/types/index.ts`
- Test: Verify project compiles cleanly with `npm run build` or Next development runner.

- [ ] **Step 1:** Initialize project files and install dependencies (`next`, `react`, `react-dom`, `lucide-react`, `clsx`, `tailwind-merge`, `zod`, `@supabase/supabase-js`, `@supabase/ssr`).
- [ ] **Step 2:** Configure Tailwind CSS with the specified brand palette (forest green, warm cream, coral accent, rounded cards).
- [ ] **Step 3:** Setup TypeScript definitions for Profiles, Pets, Services, Appointments, Sessions, Payments.
- [ ] **Step 4:** Run build check to verify clean compilation.

---

### Task 2: Core Data Repository & Mock/Supabase Provider
**Files:**
- Create: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`
- Create: `src/lib/data/mock-data.ts`, `src/lib/data/store.ts`
- Create: `supabase/migrations/20261124000000_init_schema.sql`
- Create: `supabase/migrations/20261124000001_seed_demo_data.sql`

- [ ] **Step 1:** Write complete SQL migration file defining all 22 relational tables with foreign keys, checks, indexes, and RLS policies.
- [ ] **Step 2:** Write SQL seed file containing realistic sample services, pricing tiers, groomers, customers, pets, and appointments (tagged with `is_demo = true`).
- [ ] **Step 3:** Create data store layer in TypeScript that reads/writes from Supabase or seamless local mock store so all views work out-of-the-box before/after connecting Supabase credentials.

---

### Task 3: Customer Public Website & Navigation
**Files:**
- Create: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`
- Create: `src/app/page.tsx` (Homepage with 11 specified sections)
- Create: `src/app/services/page.tsx`, `src/app/services/[slug]/page.tsx`
- Create: `src/app/pricing/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`

- [ ] **Step 1:** Build responsive `Navbar` and `Footer` with brand identity, mobile drawer, and role links.
- [ ] **Step 2:** Build Homepage with Hero, "Because Every Dog Deserves a Little Extra Care", CTAs, popular services, process steps, before/after gallery, FAQs, contact info.
- [ ] **Step 3:** Build Services catalog and individual service details with dynamic pricing based on pet size.
- [ ] **Step 4:** Build interactive Pricing calculator and About / Contact pages.

---

### Task 4: Customer Authentication & Pet Profiles
**Files:**
- Create: `src/app/login/page.tsx`, `src/app/register/page.tsx`
- Create: `src/app/account/page.tsx`, `src/app/account/profile/page.tsx`
- Create: `src/app/account/pets/page.tsx`, `src/app/account/pets/new/page.tsx`, `src/app/account/pets/[id]/page.tsx`
- Create: `src/app/account/bookings/page.tsx`

- [ ] **Step 1:** Implement customer login and registration with validation, role storage, and demo quick-login switcher for instant evaluation.
- [ ] **Step 2:** Build pet profile management (list pets, create pet with size, coat, allergies, temperament, handling notes, vaccination status, photo upload).
- [ ] **Step 3:** Build customer account overview and booking history with status badges and cancellation policy rules.

---

### Task 5: 10-Step Interactive Booking Engine & Collision Prevention
**Files:**
- Create: `src/app/booking/page.tsx`
- Create: `src/components/booking/BookingWizard.tsx`
- Create: `src/app/api/availability/route.ts`, `src/app/api/bookings/route.ts`

- [ ] **Step 1:** Implement Steps 1-4: Select service, select pet, select add-ons, dynamic price calculation snapshot based on pet size.
- [ ] **Step 2:** Implement Steps 5-7: Select date, fetch available time slots (cross-referencing existing appointments and groomer availability), enter special instructions.
- [ ] **Step 3:** Implement Steps 8-10: Review summary, confirm booking, generate unique booking reference (`DG-XXXXXX`), and show confirmation screen.
- [ ] **Step 4:** Test double-booking protection: verify overlapping slots are rejected.

---

### Task 6: Admin Dashboard & Operations Suite
**Files:**
- Create: `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`
- Create: `src/app/admin/bookings/page.tsx`, `src/app/admin/calendar/page.tsx`
- Create: `src/app/admin/services/page.tsx`, `src/app/admin/customers/page.tsx`, `src/app/admin/groomers/page.tsx`
- Create: `src/app/admin/reports/page.tsx`, `src/app/admin/settings/page.tsx`

- [ ] **Step 1:** Build Admin Dashboard overview with summary KPI cards, recent bookings table, and visual charts.
- [ ] **Step 2:** Build Bookings management (search, filter by date/status/groomer, assign groomer, reschedule, status transition).
- [ ] **Step 3:** Build Service catalog management (create/edit service, configure duration, set size-tiered pricing, toggle active status).
- [ ] **Step 4:** Build Customer CRM & Pet profiles list with internal notes.
- [ ] **Step 5:** Build Groomer management & shift availability configuration.
- [ ] **Step 6:** Build Reports with date filtering, revenue/appointment metrics, and CSV export.

---

### Task 7: Groomer Mobile Interface & Grooming Sessions
**Files:**
- Create: `src/app/groomer/layout.tsx`, `src/app/groomer/page.tsx`
- Create: `src/app/groomer/bookings/page.tsx`
- Create: `src/app/groomer/sessions/page.tsx`, `src/app/groomer/sessions/[id]/page.tsx`

- [ ] **Step 1:** Build Groomer mobile-friendly dashboard displaying today's and upcoming assigned appointments.
- [ ] **Step 2:** Build Session workflow: Pre-groom pet inspection, coat/temperament review, vet concern flag.
- [ ] **Step 3:** Build active session timer, notes recording, before/after photo upload simulation, and completion workflow.

---

### Task 8: Payments, Notifications & Final Verification
**Files:**
- Create: `src/app/api/payments/razorpay/create-order/route.ts`
- Create: `src/app/api/payments/razorpay/verify/route.ts`
- Create: `src/lib/notifications/dispatcher.ts`
- Create: `README.md`
- Test: Full end-to-end acceptance test covering all 15 MVP scenarios.

- [ ] **Step 1:** Implement secure payment handler supporting Cash, UPI, and Razorpay server-side verification with test-mode fallback.
- [ ] **Step 2:** Implement notification dispatcher with email/WhatsApp payloads for booking creation, confirmation, cancellation, and completion.
- [ ] **Step 3:** Run complete end-to-end acceptance tests across customer, admin, and groomer user flows.
- [ ] **Step 4:** Write comprehensive `README.md` with setup, environment configuration, database migration guide, and Vercel deployment instructions.
