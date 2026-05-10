-- ─────────────────────────────────────────────────────────────────────────────
-- Pakarsheet — Blog Posts Table Migration
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- NOTE: Column names use camelCase with quotes to match the JavaScript object
-- keys sent by the Supabase JS client. This is intentional and consistent with
-- how the rest of the Pakarsheet tables are structured (products, testimonials, etc.)

create table if not exists public.blog_posts (
  id                 text     primary key,
  slug               text     not null unique,
  title              text     not null,
  excerpt            text     not null default '',
  content            text     not null default '',
  "coverImage"       text     not null default '',
  category           text     not null default 'Tutorial',
  tags               text[]   not null default '{}',
  status             text     not null default 'draft'
                              check (status in ('draft', 'published')),
  "readingTime"      integer  not null default 1,
  views              integer  not null default 0,
  "publishedAt"      bigint   not null default 0,
  "createdAt"        bigint   not null default 0,
  "updatedAt"        bigint   not null default 0,
  "relatedProductId" text     references public.products(id) on delete set null
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
-- The admin panel uses the anon key (no service role key is configured).
-- This matches the pattern used by all other Pakarsheet tables (products,
-- testimonials, tutorials, etc.) which also have RLS disabled.
-- Public reads are safe because drafts are filtered in application code.

-- RLS is intentionally NOT enabled on this table.
-- If you want to enable it in the future, use the policy block below.

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index if not exists blog_posts_slug_idx
  on public.blog_posts (slug);

create index if not exists blog_posts_status_idx
  on public.blog_posts (status);

create index if not exists blog_posts_published_at_idx
  on public.blog_posts ("publishedAt" desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- OPTIONAL: Enable RLS later if you add a service role key to your environment.
-- Uncomment the block below and add SUPABASE_SERVICE_ROLE_KEY to .env.local,
-- then update src/lib/supabase.ts to use it for admin operations.
-- ─────────────────────────────────────────────────────────────────────────────
--
-- alter table public.blog_posts enable row level security;
--
-- -- Public can read published posts only
-- create policy "Public read published"
--   on public.blog_posts for select
--   using (status = 'published');
--
-- -- Anon can increment views via API route
-- create policy "Anon update views"
--   on public.blog_posts for update
--   using (true)
--   with check (true);
--
-- -- Service role has full access (for admin panel)
-- create policy "Service role full access"
--   on public.blog_posts for all
--   using (auth.role() = 'service_role');
