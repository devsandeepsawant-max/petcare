# Dog Grooming Business Management & Online Booking MVP - Design Spec

**Date:** 2026-11-24  
**Project:** Dog Grooming Business – MVP  
**Status:** Approved  

## 1. Executive Summary & Objective

The Dog Grooming Business MVP is a full-stack, production-ready web application providing:
1. **Public Marketing & Customer Experience:** Discover dog grooming services, tiered transparent pricing based on pet size and add-ons, responsive mobile-first booking wizard, customer accounts, and pet profiles.
2. **Business Operations & Admin Suite:** Multi-role staff control, appointment scheduling & calendar management, groomer assignment, customer CRM, service & price tier configuration, revenue & booking analytics, and operational audit logs.
3. **Dedicated Groomer Interface:** Mobile-optimized portal for assigned daily appointments, pre-groom health/handling checklists, session timers, progress notes, vet referral alerts, and before/after photo documentation.
4. **Resilient Data & Integrations:** 22-table PostgreSQL schema with Supabase Auth, Row-Level Security (RLS), conflict-free appointment booking constraints, modular payment processor (Cash, UPI, Razorpay with test-mode fallback), and notification dispatcher (Email & WhatsApp ready).

---

## 2. Brand Identity & Design System

- **Primary Colors:** Forest Green (`#1B4332`, `#2D6A4F`, Tailwind primary), conveying trust, natural care, and calm.
- **Background:** Warm Cream (`#FAF8F5`, `#F3EFEA`), avoiding sterile medical whites.
- **Card Surfaces:** Pure White (`#FFFFFF`) with subtle borders (`border-stone-200`) and soft shadows (`shadow-sm`, `shadow-md`).
- **Accent Color:** Warm Coral / Terracotta (`#E07A5F`, `#E76F51`), highlighting calls-to-action, badges, and alerts.
- **Typography:** Dark Charcoal (`#1F2937`) with Inter/Poppins font families. High contrast (WCAG AA compliant).
- **Component Style:** Rounded buttons and cards (`rounded-xl` and `rounded-2xl`), accessible form controls, explicit loading/empty/error states.

---

## 3. Architecture & Tech Stack

### 3.1 Technology Stack
- **Framework:** Next.js 15 (App Router, Server Actions, Route Handlers)
- **Language:** TypeScript 5+ (Strict typing, Zod schema validation)
- **Styling:** Tailwind CSS with custom design tokens and semantic variables
- **Icons:** Lucide React
- **Database & Auth:** Supabase PostgreSQL with RLS, Supabase Auth (Email/Password, Session Tokens, Role Claims), Supabase Storage (pet photos, groom photos, documents)
- **Payments:** Secure server-side Razorpay order creation and signature verification; automatic fallback to sandbox/test mode with explicit demo badge when API keys are unconfigured.

### 3.2 Role-Based Access Control (RBAC)
- **Roles:** `customer`, `groomer`, `admin`.
- **Enforcement:**
  - Database level: PostgreSQL Row Level Security (RLS) policies on all tables based on `auth.uid()` and `profiles.role`.
  - Application level: Server-side middleware & server action role gates redirecting unauthorized access.

---

## 4. Database Schema (22 Relational Tables)

1. `profiles`: User accounts extending Supabase auth (name, email, phone, role, avatar_url).
2. `customers`: Extended customer metadata, address, loyalty/notes, emergency contacts.
3. `pets`: Pet profiles (name, photo_url, breed, dob, gender, weight, size_category [SMALL, MEDIUM, LARGE], coat_type, allergies, temperament, handling_notes, vaccination_status).
4. `pet_health_records`: Health conditions, sensitivities, veterinary contacts.
5. `pet_documents`: File attachments (vaccination records, registration certificates).
6. `services`: Grooming services (name, slug, description, image_url, base_duration_mins, is_active).
7. `service_pricing`: Tiered pricing matrix per service and pet size (SMALL, MEDIUM, LARGE).
8. `service_addons`: Add-on services (teeth cleaning, blueberry facial, flea treatment, etc.) with price and duration.
9. `groomers`: Staff groomer records (bio, experience_years, specialties, is_active, user_id).
10. `groomer_availability`: Weekly working hours and blocked dates/slots per groomer.
11. `appointments`: Central appointment records (reference_code, customer_id, pet_id, groomer_id, service_id, scheduled_date, start_time, end_time, status, total_amount, deposit_amount, cancellation_reason).
12. `appointment_items`: Snapshot of selected service tiers and add-ons at the time of booking.
13. `grooming_sessions`: Operational session record (check-in time, start time, end time, vet_flag, status).
14. `grooming_notes`: Staff observations, coat condition, behavior notes during session.
15. `grooming_photos`: Before and after session pictures with timestamp and captions.
16. `payments`: Payment records (appointment_id, amount, payment_method [CASH, UPI, RAZORPAY], payment_status, transaction_ref, is_demo).
17. `invoices`: Generated billing invoices with itemized tax and totals.
18. `reviews`: Customer feedback and ratings post-service.
19. `notifications`: In-app and outbound notification dispatch logs.
20. `incidents`: Operational safety/incident logs with veterinary referral flags.
21. `business_settings`: Operating hours, booking lead times, cancellation window, tax rates, payment configs.
22. `audit_logs`: Audit trail for critical actions (status overrides, price adjustments, role modifications).

---

## 5. User Flows & Application Routes

### Customer Website
- `/`: Hero, USP, Popular Services, Grooming Process, Before/After Gallery, Demo Testimonials, FAQs, Contact.
- `/services` & `/services/[slug]`: Service details, inclusions, price starting points, direct booking trigger.
- `/pricing`: Interactive pricing table filtering by pet size (Small, Medium, Large) and optional add-ons.
- `/about`: Philosophy, hygienic standards, staff care approach.
- `/contact`: Salon address, contact details, map, business hours.
- `/booking`: 10-step interactive booking engine with real-time price snapshot and slot collision checking.
- `/login`, `/register`: Authentication and session management.
- `/account`, `/account/pets`, `/account/bookings`, `/account/profile`: Customer dashboard.

### Admin Dashboard
- `/admin`: Metrics (Total bookings, today's schedule, pending, revenue, monthly trend).
- `/admin/bookings`: Search, filter by date/status/groomer, assign groomer, reschedule, status transitions.
- `/admin/calendar`: Visual daily/weekly calendar grid of appointments.
- `/admin/customers` & `/admin/pets`: Customer CRM and pet profiles.
- `/admin/services`: Service catalog and size-based price matrix configuration.
- `/admin/groomers`: Staff roster and shift availability management.
- `/admin/reports`: Revenue charts, service breakdown, cancellation rates, CSV export.
- `/admin/settings`: Business policies, operating hours, payment mode toggles.

### Groomer Portal
- `/groomer`: Daily overview, assigned appointments.
- `/groomer/bookings`: Detailed assigned schedule.
- `/groomer/sessions`: Active grooming session workflow (pre-groom checklist, timer, photos, completion).

---

## 6. Security, Integrity & Double-Booking Prevention

1. **Double-Booking Prevention:** Handled both at UI time-slot generation and via PostgreSQL exclusion/unique check constraints across `(groomer_id, scheduled_date, start_time, end_time)` where `status NOT IN ('CANCELLED')`.
2. **Price Snapshotting:** Appointments store immutable price snapshots in `appointment_items` and `appointments.total_amount` so future service catalog price changes never alter historical records.
3. **Data Sanitization & Validation:** Zod schemas applied to all API endpoints and server actions.
