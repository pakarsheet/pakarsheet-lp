-- Migration: Add features column to products table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
--
-- This adds the per-product feature list (Fitur Unggulan) column.
-- Safe to run multiple times (IF NOT EXISTS).

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS features jsonb;

-- Optional: add other missing columns that may not exist yet
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS "salePrice"       bigint;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS "salePriceUntil"  bigint;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS "socialProofCount" integer;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS "originalPrice"   bigint;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS "lynkUrl"         text;
