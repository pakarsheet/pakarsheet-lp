-- =============================================================================
-- PAKARSHEET — FINAL SCHEMA (IDEMPOTENT)
-- =============================================================================
-- Aman dijalankan berkali-kali. Semua statement pakai IF NOT EXISTS / IF EXISTS.
-- Kolom yang sudah ada TIDAK akan diubah atau dihapus.
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================================


-- =============================================================================
-- 1. PRODUCTS
-- =============================================================================
create table if not exists public.products (
  id                  text      primary key,
  name                text      not null default '',
  description         text      not null default '',
  price               bigint    not null default 0,
  images              text[]    not null default '{}',
  category            text      not null default 'Lainnya',
  "createdAt"         bigint    not null default 0,
  clicks              integer   not null default 0
);

-- Kolom opsional — ditambahkan hanya jika belum ada
alter table public.products add column if not exists "originalPrice"    bigint    default null;
alter table public.products add column if not exists "lynkUrl"          text      default '';
alter table public.products add column if not exists "salePrice"        bigint    default null;
alter table public.products add column if not exists "salePriceUntil"   bigint    default null;
alter table public.products add column if not exists "socialProofCount" integer   default null;
alter table public.products add column if not exists features           jsonb     default null;
-- Legacy single-image field (deprecated, gunakan images[])
alter table public.products add column if not exists image              text      default null;

-- Index
create index if not exists products_created_idx on public.products ("createdAt" desc);


-- =============================================================================
-- 2. TESTIMONIALS
-- =============================================================================
create table if not exists public.testimonials (
  id          text      primary key,
  name        text      not null default '',
  role        text      not null default '',
  content     text      not null default '',
  rating      integer   not null default 5,
  "createdAt" bigint    not null default 0
);

alter table public.testimonials add column if not exists avatar text default null;

create index if not exists testimonials_created_idx on public.testimonials ("createdAt" desc);


-- =============================================================================
-- 3. TUTORIALS (Academy)
-- =============================================================================
create table if not exists public.tutorials (
  id          text    primary key,
  title       text    not null default '',
  content     text    not null default '',
  category    text    not null default 'Lainnya',
  "createdAt" bigint  not null default 0
);

alter table public.tutorials add column if not exists "videoUrl" text default null;

create index if not exists tutorials_created_idx on public.tutorials ("createdAt" desc);


-- =============================================================================
-- 4. USER_REQUESTS
-- =============================================================================
create table if not exists public.user_requests (
  id          text    primary key,
  email       text    not null default '',
  request     text    not null default '',
  status      text    not null default 'pending'
                      check (status in ('pending', 'reviewed', 'completed')),
  "createdAt" bigint  not null default 0
);

create index if not exists user_requests_status_idx  on public.user_requests (status);
create index if not exists user_requests_created_idx on public.user_requests ("createdAt" desc);


-- =============================================================================
-- 5. SITE_SETTINGS
-- =============================================================================
create table if not exists public.site_settings (
  id                  text    primary key default 'main',
  "metaTitle"         text    not null default '',
  "metaDescription"   text    not null default '',
  "metaKeywords"      text    not null default '',
  "whatsappNumber"    text    not null default '',
  "mainLynkUrl"       text    not null default ''
);

-- Shop page settings — ditambahkan hanya jika belum ada
alter table public.site_settings add column if not exists "shopTitle"       text    default null;
alter table public.site_settings add column if not exists "shopSubtitle"    text    default null;
alter table public.site_settings add column if not exists "shopBadgeText"   text    default null;
alter table public.site_settings add column if not exists "shopCategories"  jsonb   default null;
alter table public.site_settings add column if not exists "shopCtaText"     text    default null;
alter table public.site_settings add column if not exists "shopPaymentNote" text    default null;
alter table public.site_settings add column if not exists "shopTrustBadges" jsonb   default null;
alter table public.site_settings add column if not exists "shopFeatures"    jsonb   default null;

-- Branding (logo, favicon, brand name) — dipakai di Navbar, Footer, dan <head>
alter table public.site_settings add column if not exists "logoUrl"    text default null;
alter table public.site_settings add column if not exists "faviconUrl" text default null;
alter table public.site_settings add column if not exists "brandName"  text default null;

-- Pastikan row 'main' selalu ada (upsert aman)
insert into public.site_settings (id)
values ('main')
on conflict (id) do nothing;


-- =============================================================================
-- 6. BLOG_POSTS
-- =============================================================================
create table if not exists public.blog_posts (
  id                  text      primary key,
  slug                text      not null unique,
  title               text      not null default '',
  excerpt             text      not null default '',
  content             text      not null default '',
  "coverImage"        text      not null default '',
  category            text      not null default 'Tutorial',
  tags                text[]    not null default '{}',
  status              text      not null default 'draft'
                                check (status in ('draft', 'published')),
  "readingTime"       integer   not null default 1,
  views               integer   not null default 0,
  "publishedAt"       bigint    not null default 0,
  "createdAt"         bigint    not null default 0,
  "updatedAt"         bigint    not null default 0
);

alter table public.blog_posts add column if not exists "relatedProductId" text default null;

-- Foreign key hanya ditambahkan jika tabel products sudah ada
-- (constraint ini opsional — skip jika menyebabkan error)
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'blog_posts_relatedProductId_fkey'
      and table_name = 'blog_posts'
  ) then
    alter table public.blog_posts
      add constraint "blog_posts_relatedProductId_fkey"
      foreign key ("relatedProductId")
      references public.products(id)
      on delete set null;
  end if;
end $$;

create index if not exists blog_posts_slug_idx         on public.blog_posts (slug);
create index if not exists blog_posts_status_idx       on public.blog_posts (status);
create index if not exists blog_posts_published_at_idx on public.blog_posts ("publishedAt" desc);
create index if not exists blog_posts_created_idx      on public.blog_posts ("createdAt" desc);


-- =============================================================================
-- 7. CUSTOM_ORDERS
-- =============================================================================
create table if not exists public.custom_orders (
  id              text      primary key,
  name            text      not null default '',
  email           text      not null default '',
  business        text      not null default '',
  package         text      not null default 'basic'
                            check (package in ('basic', 'pro', 'enterprise')),
  "teamSize"      text      not null default '',
  "hasMigration"  boolean   not null default false,
  description     text      not null default '',
  deadline        text      not null default '',
  status          text      not null default 'new'
                            check (status in ('new', 'reviewing', 'in_progress', 'delivered', 'completed', 'cancelled')),
  "createdAt"     bigint    not null default 0
);

alter table public.custom_orders add column if not exists notes text default '';

create index if not exists custom_orders_status_idx  on public.custom_orders (status);
create index if not exists custom_orders_created_idx on public.custom_orders ("createdAt" desc);


-- =============================================================================
-- SELESAI
-- Semua tabel dan kolom sudah dicek. Yang sudah ada tidak diubah.
-- =============================================================================
