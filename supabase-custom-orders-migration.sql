-- ─────────────────────────────────────────────────────────────────────────────
-- Pakarsheet — Custom Orders Table Migration
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.custom_orders (
  id           text    primary key,
  name         text    not null default '',
  email        text    not null default '',
  business     text    not null default '',
  package      text    not null default 'basic'
                       check (package in ('basic', 'pro', 'enterprise')),
  "teamSize"   text    not null default '',
  "hasMigration" boolean not null default false,
  description  text    not null default '',
  deadline     text    not null default '',
  status       text    not null default 'new'
                       check (status in ('new', 'reviewing', 'in_progress', 'delivered', 'completed', 'cancelled')),
  notes        text    not null default '',
  "createdAt"  bigint  not null default 0
);

-- Indexes
create index if not exists custom_orders_status_idx on public.custom_orders (status);
create index if not exists custom_orders_created_idx on public.custom_orders ("createdAt" desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- Also add new columns to products table for flash sale & social proof
-- Run this if your products table already exists
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.products
  add column if not exists "salePrice"        integer   default null,
  add column if not exists "salePriceUntil"   bigint    default null,
  add column if not exists "socialProofCount" integer   default null;
