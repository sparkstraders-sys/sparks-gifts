-- Sparks Gifts Seed Data
-- Run this AFTER 0001_init.sql

-- Default admin (password: admin123 — CHANGE IMMEDIATELY after first login)
INSERT INTO admins (id, email, password, name, created_at, updated_at) VALUES (
  'admin-sparks-001',
  'admin@sparksgifts.pk',
  '$2a$12$LCAmQiD6iDivwpbvT5LpwuqUCxYdTx/tYq6tSMPr7.VxnPmBMtAu6',
  'Sparks Admin',
  now(), now()
) ON CONFLICT (email) DO NOTHING;

-- Default categories
INSERT INTO categories (id, name, slug, description, sort_order, is_active, created_at, updated_at) VALUES
  ('cat-perfumes', 'Perfumes', 'perfumes', 'Luxury fragrances for him and her', 1, true, now(), now()),
  ('cat-chocolates', 'Chocolates', 'chocolates', 'Premium chocolates and sweets', 2, true, now(), now()),
  ('cat-gift-sets', 'Gift Sets', 'gift-sets', 'Beautifully curated gift collections', 3, true, now(), now()),
  ('cat-accessories', 'Accessories', 'accessories', 'Premium lifestyle accessories', 4, true, now(), now()),
  ('cat-flowers', 'Flowers & Bouquets', 'flowers-bouquets', 'Fresh flowers and floral arrangements', 5, true, now(), now()),
  ('cat-cakes', 'Cakes', 'cakes', 'Custom cakes for every celebration', 6, true, now(), now())
ON CONFLICT (slug) DO NOTHING;

-- Store settings
INSERT INTO store_settings (id, key, value, updated_at) VALUES
  ('ss-01', 'storeName', 'Sparks Gifts', now()),
  ('ss-02', 'tagline', 'Thoughtful Gifts, Delivered with Love.', now()),
  ('ss-03', 'email', 'hello@sparksgifts.pk', now()),
  ('ss-04', 'phone', '0300-143-2502', now()),
  ('ss-05', 'whatsapp', '923001432502', now()),
  ('ss-06', 'address', 'Pakistan', now()),
  ('ss-07', 'deliveryCharge', '200', now()),
  ('ss-08', 'wrappingCharge', '150', now()),
  ('ss-09', 'codAvailable', 'true', now()),
  ('ss-10', 'checkoutEmailEnabled', 'true', now()),
  ('ss-11', 'checkoutEmailRequired', 'false', now()),
  ('ss-12', 'heroTitle', 'Thoughtful Gifts, Delivered with Love.', now()),
  ('ss-13', 'heroSubtitle', 'You choose the gift. You write the message. We deliver the surprise.', now())
ON CONFLICT (key) DO NOTHING;
