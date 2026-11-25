-- -------------------------------------------------------------
-- SEED DATA: DOG GROOMING SERVICES, PRICING, STAFF & DEMO DATA
-- -------------------------------------------------------------

-- 1. BUSINESS SETTINGS
INSERT INTO public.business_settings (
    id, business_name, tagline, address, phone, email, opening_time, closing_time, booking_interval_mins, cancellation_hours_window, require_deposit, deposit_percentage, razorpay_enabled, upi_enabled, cash_enabled, is_demo_mode
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Pawsome Grooming Studio',
    'Because Every Dog Deserves a Little Extra Care',
    '124 Green Glen Park, Bangalore 560103',
    '+91 98765 43210',
    'contact@pawsomecare.com',
    '09:00:00',
    '19:00:00',
    30,
    24,
    false,
    20,
    false,
    true,
    true,
    true
) ON CONFLICT DO NOTHING;

-- 2. SERVICES
INSERT INTO public.services (id, name, slug, description, short_description, image_url, base_duration_mins, requires_assessment, is_active, is_demo) VALUES
('b0000000-0000-0000-0000-000000000001', 'Basic Bath & Dry', 'basic-bath-dry', 'A refreshing bath with hypoallergenic organic shampoo, blow-dry, ear cleaning, and light brush out. Ideal for in-between grooming freshness.', 'Organic bath, gentle warm blow-dry, and ear cleaning.', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800', 45, false, true, true),
('b0000000-0000-0000-0000-000000000002', 'Full Grooming', 'full-grooming', 'The complete spa treatment! Includes relaxing bath, haircut tailored to breed, nail clipping, sanitary trim, paw pad shave, ear cleaning, and scented spritz.', 'Full haircut, styled finish, bath, nails and hygiene trim.', 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&q=80&w=800', 90, false, true, true),
('b0000000-0000-0000-0000-000000000003', 'Nail & Paw Care', 'nail-paw-care', 'Dedicated attention to tired paws. Includes gentle nail trimming, smooth filing, paw pad hair trimming, and a soothing organic paw balm massage.', 'Nail trim, filing, paw hair cleanup, and healing balm.', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800', 30, false, true, true),
('b0000000-0000-0000-0000-000000000004', 'De-shedding Treatment', 'de-shedding', 'Formulated to reduce shedding by up to 90%. Includes deep undercoat rake, specialized deshedding shampoo, high-velocity blow-out, and coat condition treatment.', 'Deep undercoat removal, anti-shed bath, and brush-out.', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800', 75, false, true, true),
('b0000000-0000-0000-0000-000000000005', 'Hygiene & Touch-up', 'hygiene-touch-up', 'Quick hygienic maintenance. Includes eye area trimming, sanitary area tidy-up, teeth spray, and gentle ear flush.', 'Sanitary trim, eye cleaning, teeth spray, and touch-up.', 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=800', 40, false, true, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. SERVICE PRICING (Tiered by pet size)
INSERT INTO public.service_pricing (service_id, pet_size, base_price, estimated_duration_mins) VALUES
-- Basic Bath & Dry
('b0000000-0000-0000-0000-000000000001', 'SMALL', 799.00, 45),
('b0000000-0000-0000-0000-000000000001', 'MEDIUM', 1099.00, 60),
('b0000000-0000-0000-0000-000000000001', 'LARGE', 1499.00, 75),
-- Full Grooming
('b0000000-0000-0000-0000-000000000002', 'SMALL', 1499.00, 75),
('b0000000-0000-0000-0000-000000000002', 'MEDIUM', 1999.00, 90),
('b0000000-0000-0000-0000-000000000002', 'LARGE', 2599.00, 120),
-- Nail & Paw Care
('b0000000-0000-0000-0000-000000000003', 'SMALL', 399.00, 25),
('b0000000-0000-0000-0000-000000000003', 'MEDIUM', 499.00, 30),
('b0000000-0000-0000-0000-000000000003', 'LARGE', 649.00, 35),
-- De-shedding
('b0000000-0000-0000-0000-000000000004', 'SMALL', 1299.00, 60),
('b0000000-0000-0000-0000-000000000004', 'MEDIUM', 1799.00, 75),
('b0000000-0000-0000-0000-000000000004', 'LARGE', 2399.00, 105),
-- Hygiene & Touch-up
('b0000000-0000-0000-0000-000000000005', 'SMALL', 599.00, 30),
('b0000000-0000-0000-0000-000000000005', 'MEDIUM', 799.00, 40),
('b0000000-0000-0000-0000-000000000005', 'LARGE', 999.00, 50)
ON CONFLICT (service_id, pet_size) DO NOTHING;

-- 4. SERVICE ADDONS
INSERT INTO public.service_addons (id, service_id, name, description, price, duration_mins, is_active) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Blueberry Facial Scrub', 'Gentle tear-stain cleansing, soothing facial massage, and natural brightening.', 299.00, 15, true),
('c0000000-0000-0000-0000-000000000002', NULL, 'Teeth Brushing & Mint Freshener', 'Enzyme tartar defense gel, gum massage, and fresh breath spray.', 249.00, 10, true),
('c0000000-0000-0000-0000-000000000003', NULL, 'Organic Flea & Tick Dip', 'Botanical neem and tea tree bath rinse that repels pests safely.', 449.00, 20, true),
('c0000000-0000-0000-0000-000000000004', NULL, 'Deep Conditioning Hot Oil Wrap', 'Restores dry, brittle coats with argan oil and silk proteins.', 399.00, 20, true)
ON CONFLICT DO NOTHING;

-- 5. GROOMERS
INSERT INTO public.groomers (id, name, email, phone, bio, experience_years, specialties, is_active, is_demo) VALUES
('d0000000-0000-0000-0000-000000000001', 'Arjun Sharma', 'arjun@pawsomecare.com', '+91 98111 22233', 'Senior Stylist with 6+ years experience specializing in breed-standard cuts and anxious dogs.', 6, ARRAY['Breed Styling', 'Puppy Intro', 'Gentle Handling'], true, true),
('d0000000-0000-0000-0000-000000000002', 'Priya Menon', 'priya@pawsomecare.com', '+91 98222 33344', 'Passionate canine aesthetician certified in coat restoration, de-shedding, and creative trims.', 4, ARRAY['De-shedding', 'Skin & Coat Therapy', 'Nail & Paw Care'], true, true)
ON CONFLICT (email) DO NOTHING;
