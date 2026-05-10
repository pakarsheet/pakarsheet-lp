# Pakarsheet — Product Requirements Document (PRD)

> Dokumen ini adalah sumber kebenaran (*single source of truth*) untuk **apa** yang dibangun di landing page & produk digital Pakarsheet, **untuk siapa**, dan **mengapa**. Dibaca oleh product, engineering, design, dan content writer. Jangan mengubah scope tanpa update dokumen ini.

---

## 1. Ringkasan Eksekutif

**Pakarsheet** adalah studio yang menjual **template Google Sheets premium** dengan **UI bersih** dan **otomasi Apps Script** di belakang layar. Target pembelinya adalah marketer, pemilik bisnis UMKM, dan operator yang butuh sistem kerja cepat tanpa harus jadi ahli Excel atau ngoprek code.

Model bisnisnya **sekali bayar, lifetime update** (bukan SaaS bulanan). Produk utama dijual lewat halaman **Shop**, pelanggan lama punya saluran **Custom Order** untuk request template bespoke, dan ada **Tools gratis** + **Blog** sebagai magnet SEO.

**Satu kalimat positioning:** *"Stop buang waktu untuk input data manual — template Google Sheets yang dirancang seperti aplikasi SaaS, dengan otomasi di belakangnya."*

---

## 2. Tujuan Produk

### 2.1 Tujuan Bisnis
1. **Konversi** — mengubah pengunjung organik menjadi pembeli template lewat landing page yang jelas dan *trust-heavy*.
2. **Retensi & LTV** — pelanggan yang puas kembali untuk template lain atau naik ke **Custom Order**.
3. **SEO inbound** — Tools gratis (kalkulator HPP, ROAS, margin, harga jual) + Blog menangkap traffic niche Indonesia.
4. **Brand premium** — tampilan & copywriting menimbulkan persepsi "ini bukan sekadar jualan template Excel random".

### 2.2 Tujuan Pengguna
- Mendapat sistem kerja *plug-and-play* dalam hitungan menit setelah bayar.
- Menghemat waktu rutinitas (rekap, input, laporan, tracking).
- Merasa aman: data tetap di Drive mereka, ada lisensi, ada support.
- Bisa minta kustomisasi kalau kebutuhan spesifik.

### 2.3 Non-Tujuan (Out of Scope)
- Bukan platform SaaS bulanan. Tidak ada billing recurring.
- Bukan *no-code builder* — produk adalah file Sheets + Apps Script jadi, bukan editor.
- Tidak menyediakan konsultasi bisnis/keuangan. Kami jual alat, bukan nasihat profesional.
- Tidak menyimpan data pelanggan (data tetap di Google Drive milik user).

---

## 3. Target Pengguna

### 3.1 Persona Utama

**Persona 1 — "Rani, Marketer Freelance"**
- 24–32 tahun, handle 3–5 klien bareng.
- Keluhan: rekap laporan iklan tiap bulan memakan waktu 2–3 jam per klien.
- Ingin: laporan PDF cantik 1 klik, data iklan otomatis tersinkron.
- *Pain*: "gue bukan anak IT, males belajar rumus ribet."

**Persona 2 — "Budi, Owner UMKM"**
- 30–45 tahun, punya toko kecil / jasa / agency mikro.
- Keluhan: stok, kas, invoice masih dicatat manual & sering keliru.
- Ingin: satu template jadi "sistem mini" untuk bisnisnya.
- *Pain*: "software kasir mahal & overkill, Excel bawaan jelek."

**Persona 3 — "Sari, Admin Operasional"**
- 22–30 tahun, kerja di perusahaan kecil/menengah.
- Keluhan: diminta bos bikin tracker KPI, dashboard, rekap — tapi ngga diajarin.
- Ingin: template yang tinggal isi, output langsung rapi.
- *Pain*: "takut salah rumus, takut data hilang."

### 3.2 Pengguna Sekunder
- **Agency kecil** yang butuh white-label template untuk klien.
- **Kreator konten bisnis** yang mau jual ulang tools sebagai bagian dari kursusnya (butuh lisensi berbeda — *out of scope untuk v1*).

---

## 4. User Journey Utama

### 4.1 Jalur Beli Template (primary funnel)
1. Masuk dari organic / WA / IG ke **Home (`/`)**.
2. Baca **Hero** → **Social Proof** → **Stats** → **How It Works** → **Features**.
3. Klik *Lihat Template* → masuk **Shop (`/shop`)**.
4. Pilih template → **Shop Detail (`/shop/[id]`)** → klik *Beli* → redirect Lynk.id.
5. Bayar → kembali ke **Success (`/success`)**.
6. Menerima email dengan akses template.

### 4.2 Jalur Request Custom
1. Dari Home → section **RequestForm** ATAU dari **Custom (`/custom`)**.
2. Isi form (email + deskripsi kebutuhan, min. 20 karakter).
3. Submit → data masuk Supabase `user_requests`.
4. Admin review via `/admin` → balas via email/WhatsApp.

### 4.3 Jalur Tools Gratis (SEO magnet)
1. Dari Google → landing di salah satu `/tools/kalkulator-*`.
2. Gunakan kalkulator interaktif.
3. Bawah kalkulator ada soft CTA ke Shop.

### 4.4 Jalur Blog
1. Dari Google → `/blog/[slug]`.
2. Baca → di dalam artikel ada CTA kontekstual ke template yang relevan.

---

## 5. Peta Fitur (Feature Map)

### 5.1 Halaman Publik
| Route | Tujuan | Prioritas |
|---|---|---|
| `/` | Landing utama, hero + value prop + conversion funnel | P0 |
| `/shop` | Katalog template | P0 |
| `/shop/[id]` | Detail template + CTA beli | P0 |
| `/custom` | Form request custom order dengan brief lebih lengkap | P0 |
| `/tools` | Daftar tools gratis | P1 |
| `/tools/kalkulator-hpp` | Kalkulator HPP | P1 |
| `/tools/kalkulator-margin` | Kalkulator margin | P1 |
| `/tools/kalkulator-harga-jual` | Kalkulator harga jual | P1 |
| `/tools/kalkulator-roas` | Kalkulator ROAS | P1 |
| `/blog` | Daftar artikel | P1 |
| `/blog/[slug]` | Artikel | P1 |
| `/academy` | Placeholder/landing kursus mendatang | P2 |
| `/terms`, `/privacy` | Legal | P0 |
| `/success` | Post-purchase thank you | P0 |
| `/not-found` | 404 custom | P1 |

### 5.2 Halaman Admin
| Route | Tujuan | Prioritas |
|---|---|---|
| `/admin` | Dashboard admin (login & manajemen konten) | P0 |
| `/admin/blog/[id]` | Editor blog (Tiptap) | P0 |
| `/admin/products/[id]` | Editor produk Shop | P0 |

### 5.3 API (Next.js Route Handlers)
| Endpoint | Tujuan |
|---|---|
| `POST /api/admin/auth` | Login admin |
| `GET /api/blog/[slug]` | Ambil artikel by slug |

---

## 6. Struktur Landing Page (`/`) — Urutan Tetap

Urutan ini **sengaja** dirancang sebagai funnel: *attention → trust → understanding → desire → objection handling → action*.

1. **Navbar** (fixed, pill-shaped, muncul di semua halaman kecuali `/admin` dan `/shop/[id]`).
2. **Hero** — headline, subline, 2 CTA (primary + secondary), dashboard mockup di bawahnya.
3. **SocialProof** — 4 trust point singkat (pembayaran aman, akses instan, lifetime, support).
4. **StatsCounter** — angka kunci (pengguna, data, jam dihemat, rating).
5. **HowItWorks** — 3 langkah gampang.
6. **NeuralGraph** — visual arsitektur sistem (input → engine → output).
7. **DetailedFeatures** — 4 kemampuan teknis (auto-sync, notifikasi, PDF, access control).
8. **Features** — 4 *feature row* bergantian kiri-kanan dengan visual UI.
9. **Comparison** — tabel Pakarsheet vs Manual.
10. **Testimonials** — wall of love (dari database, empty state ditampilkan jujur kalau kosong).
11. **FAQ** — 5 pertanyaan paling umum.
12. **Pricing** — bento grid: pain points kiri + offer utama kanan.
13. **RequestForm** — form permintaan template.
14. **CTA** — ajakan aksi terakhir.
15. **Footer** — brand + kontak + navigasi + legal.

> ⚠️ Untuk nama **kode** setiap bagian (eyebrow, headline, bento, spotlight card, dll.) lihat `docs/SECTION-VOCABULARY.md`.

---

## 7. Requirements Fungsional

### 7.1 Landing Page
- **F-01** Hero harus menampilkan headline dalam 2 baris di desktop, 1 paragraf di mobile, dengan 2 CTA minimum.
- **F-02** Setiap section (kecuali Hero) dibungkus komponen `<Reveal>` untuk animasi masuk saat scroll.
- **F-03** Setiap section menggunakan komponen `<SectionEyebrow>` untuk label kicker di atas H2 (konsisten di seluruh halaman).
- **F-04** Semua CTA primary menuju `/shop`; CTA secondary boleh menuju anchor (`#cara-kerja`, `#fitur`, `#faq`).
- **F-05** Stats di `StatsCounter` menggunakan animasi *count-up* saat masuk viewport.
- **F-06** Comparison table menunjukkan ✓ terang untuk Pakarsheet, ✗ redup untuk Manual (visual asimetris intensional).
- **F-07** Testimonials mengambil data dari Supabase; kalau kosong tampilkan *empty state* yang jujur ("Jadilah yang pertama…").
- **F-08** FAQ accordion hanya boleh membuka 1 item pada satu waktu.
- **F-09** Pricing menampilkan harga "mulai dari 99rb" sebagai sekali bayar — tidak pernah ditampilkan sebagai bulanan.
- **F-10** RequestForm minimal 20 karakter di deskripsi; status UI: idle / loading / success / error.

### 7.2 Shop
- **F-11** Katalog menampilkan kartu produk dengan thumbnail, judul, harga, dan label (Populer/Baru/Sale).
- **F-12** Detail produk menampilkan galeri, deskripsi, daftar fitur, CTA beli (redirect Lynk.id).
- **F-13** Halaman detail tidak menampilkan Navbar/Footer biasa (pakai layout khusus).

### 7.3 Custom Order
- **F-14** Form lengkap: email, WA, brief, budget range, deadline target, referensi.
- **F-15** Data tersimpan ke Supabase `custom_orders` (lihat migrasi).

### 7.4 Tools
- **F-16** Setiap kalkulator harus bekerja *client-side only* (tidak perlu request network) dan menampilkan hasil instan saat input berubah.
- **F-17** Menyediakan SEO meta khusus per kalkulator.

### 7.5 Blog
- **F-18** Blog rendering menggunakan markdown (`react-markdown`) dengan `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-highlight`.
- **F-19** Setiap artikel punya meta `title`, `description`, `og-image` (auto dari `opengraph-image.tsx`).
- **F-20** Menampilkan estimasi waktu baca (reading-time).

### 7.6 Admin
- **F-21** Login sederhana lewat `/api/admin/auth` (token disimpan di cookie HttpOnly).
- **F-22** Editor blog menggunakan Tiptap (`@tiptap/react`, `@tiptap/starter-kit`) dengan extensions: link, code-block, placeholder.
- **F-23** Editor produk CRUD penuh (judul, deskripsi, galeri, fitur, harga, status).

### 7.7 Cross-cutting
- **F-24** Scroll halus (`lenis` via `SmoothScroll.tsx`) aktif di semua halaman publik.
- **F-25** Progress bar scroll tipis di atas viewport.
- **F-26** Grain/noise overlay global dengan opacity 0.015.

---

## 8. Requirements Non-Fungsional

| Kategori | Target |
|---|---|
| **Performance** | LCP < 2.5s, CLS < 0.1, TBT < 200ms di halaman `/` untuk 4G simulated |
| **Aksesibilitas** | Semantic HTML, kontras AA untuk teks primer, `aria-expanded` pada accordion/mobile menu, semua tombol interaktif mudah di-keyboard |
| **Responsif** | Breakpoint mobile (< 768px), tablet (768–1024), desktop (> 1024). Semua section wajib diuji di 375px |
| **SEO** | Setiap halaman punya `metadata` (title, description, OG). Sitemap (`sitemap.ts`) dan `robots.ts` tersedia |
| **Keamanan** | Admin route dilindungi; env keys (Supabase anon/service) disimpan di `.env.local`, tidak di-commit |
| **Data** | Tidak ada data pribadi pembeli disimpan di sistem kami. Testimoni di-*consent* dulu |
| **Browser support** | 2 versi terakhir Chrome, Safari, Firefox, Edge. iOS Safari khusus: `background-attachment: fixed` **dilarang** (broken) — pakai pseudo-element `body::before` |

---

## 9. Tech Stack

| Layer | Pilihan | Catatan |
|---|---|---|
| Framework | **Next.js 16.2.4** (App Router) | Perhatian: versi ini punya breaking changes — selalu cek `node_modules/next/dist/docs/` sebelum pakai API baru |
| UI | **React 19.2.4** | Gunakan komponen server default; `"use client"` hanya kalau perlu state/event |
| Styling | **Tailwind CSS v4** + `@tailwindcss/typography` | Konfigurasi via `@theme` di `globals.css` — **bukan** `tailwind.config.js` |
| Typography plugin | `@tailwindcss/typography` | Untuk rendering blog/markdown |
| Animasi | **framer-motion** `^12.38.0` | Gunakan `useInView` + `once: true` untuk hemat CPU |
| Scroll halus | **lenis** `^1.3.23` | Di-mount di root layout |
| Icon | **lucide-react** | Satu-satunya library icon yang dipakai |
| Charts | **recharts** | Untuk tools kalkulator & dashboard admin |
| Carousel | **swiper** | Untuk galeri shop detail |
| Markdown | `react-markdown`, `marked`, plugins rehype/remark | Artikel blog |
| Editor | **Tiptap** | Admin blog editor |
| DB/Auth | **Supabase** | Tabel: `products`, `product_features`, `blog_posts`, `testimonials`, `user_requests`, `custom_orders`, `settings` |
| Payment | **Lynk.id** | Eksternal, redirect flow. Tidak ada integrasi webhook di v1 |
| Utility | `clsx`, `tailwind-merge` | Untuk komposisi className |

---

## 10. Integrasi Eksternal

- **Lynk.id** — payment gateway. Tombol beli men-*redirect* ke URL produk di Lynk. Pengembalian ke `/success` tidak terverifikasi server-side (v1). Order tetap dikonfirmasi via email manual.
- **Supabase** — database + anon access untuk baca testimoni/produk, service role hanya di admin.
- **WhatsApp** — nomor disimpan di tabel `settings` dan dipakai oleh `useSettings` hook → muncul di Footer dan form.

---

## 11. Content Guidelines (Copywriting)

### 11.1 Tone of Voice
- **Santai tapi tegas.** Pakai "kamu", bukan "Anda".
- **Problem-first.** Mulai dari rasa sakit pengguna, baru solusi.
- **Ngga lebay.** Hindari kata "revolutionary", "game-changer", "unbelievable".
- **Spesifik > umum.** "Hemat 3 jam tiap hari" > "Kerja lebih efisien".
- **Bahasa Indonesia native** dengan sedikit istilah teknis Inggris yang memang sudah umum (dashboard, template, script, template).

### 11.2 Aturan Headline
- Maksimal 2 baris di desktop.
- Gunakan *line break* (`<br />`) intensional, jangan biarkan browser break otomatis di tempat aneh.
- Gunakan titik di akhir kalau itu pernyataan, tanda tanya kalau tantangan.

### 11.3 Aturan Sub-headline
- Satu paragraf, 1–2 kalimat.
- Mengklarifikasi headline, bukan mengulang.
- 80–160 karakter.

### 11.4 Aturan CTA
- **Primary**: kata kerja + objek ("Lihat Template", "Pilih Template", "Kirim Request").
- **Secondary**: netral ("Cara kerjanya", "Pelajari lebih").
- Hindari kata generik "Klik di sini", "Submit", "Kirim".

---

## 12. Metrik Sukses

| Metrik | Target v1 | Cara Ukur |
|---|---|---|
| Conversion Rate Landing → Shop | ≥ 6% | Analytics funnel |
| Conversion Rate Shop → Checkout | ≥ 12% | Analytics funnel |
| Bounce rate Home | ≤ 55% | Analytics |
| Waktu di halaman (median) | ≥ 45 detik | Analytics |
| Jumlah request custom / bulan | ≥ 20 | Supabase `user_requests` |
| SEO organic sessions dari Tools | ≥ 3000 / bulan pada bulan ke-3 | Search Console |
| Rating rata-rata testimoni | ≥ 4.7/5 | Manual review |

---

## 13. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Lynk.id down saat campaign | Pembeli hilang | Fallback: CTA WhatsApp manual |
| Google ubah Apps Script quota | Otomasi gagal | Versioning template; notifikasi pengguna aktif |
| Persaingan template gratis | Konversi turun | Fokus ke kualitas UI & support, bukan harga |
| Next.js 16 breaking change di patch | Build gagal | Pin versi; uji upgrade di branch |
| iOS Safari rendering quirk | Layout rusak | Hindari `background-attachment: fixed`, gunakan pseudo-element |
| Konten testimoni palsu | Trust rusak | Hanya testimoni asli dengan *consent* tertulis; empty state jujur |

---

## 14. Roadmap Singkat

**v1 (Sekarang)** — Landing + Shop + Custom + Tools + Blog + Admin (CMS).
**v1.1** — Webhook Lynk.id untuk auto-deliver lisensi; e-mail transactional.
**v1.2** — Academy (kursus video pendek membungkus template).
**v2** — Marketplace: vendor lain bisa jual template (dengan kurasi).
**v2.1** — White-label untuk agency (license tier baru).

---

## 15. Glossary Cepat

- **Template** — file Google Sheets jadi, dengan Apps Script, siap diduplikasi pembeli.
- **Apps Script** — runtime JavaScript milik Google yang menempel di Sheets untuk otomasi.
- **Lisensi** — kode unik yang membatasi duplikasi ulang template oleh pihak tidak berhak.
- **Eyebrow / Kicker** — label kecil di atas H2 section; lihat `docs/SECTION-VOCABULARY.md`.
- **Bento grid** — layout grid kotak-kotak bergaya "makanan bento"; tiap kotak punya ukuran berbeda.
- **SpotlightCard** — kartu dengan efek glow mengikuti kursor saat di-hover.

---

## 16. Lampiran

- **Design System & Tokens:** `docs/DESIGN-SYSTEM.md`
- **Section Vocabulary (biar prompt tahu nama bagian):** `docs/SECTION-VOCABULARY.md`
- **Agent rules:** `AGENTS.md` (root)
