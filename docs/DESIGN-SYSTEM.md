# Pakarsheet — Design System, Design Tokens & Design Language

> Dokumen ini menjelaskan **aturan visual** Pakarsheet: token warna, tipografi, spasi, radius, elevasi, motion, dan *design language*-nya (kenapa gelap, kenapa *pill-shaped*, kenapa banyak bingkai tipis). Dipakai oleh siapa saja yang menambah UI baru supaya tampilan tetap konsisten.

Tiga lapisan yang dibahas:

1. **Design Language** — filosofi + *north star* tampilan.
2. **Design Tokens** — nilai primitif (warna, ukuran, radius, dll.) yang dikonsumsi komponen.
3. **Design System** — komponen konkret yang mengkodekan semuanya (Navbar, SectionEyebrow, SpotlightCard, dll.).

---

## 1. Design Language (Filosofi Visual)

### 1.1 Prinsip Inti
1. **Dark-first, bukan "gelap dulu nanti pindah light".** Latar `#030303` dengan sorotan radial di atas. Semua kontras dihitung di atas gelap.
2. **Transparansi berlapis (translucent).** Hampir semua permukaan pakai `white/[0.02]`–`white/[0.06]` dengan border `white/5`–`white/10`. Ini menciptakan rasa "kaca" tanpa perlu backdrop-blur mahal.
3. **Hierarki lewat opacity, bukan banyak warna.** Teks: `white/90` → `white/70` → `neutral-400` → `neutral-500` → `neutral-600`. Warna murni hanya untuk status (hijau = aktif, merah = alert, biru/kuning = aksen fitur).
4. **Radius besar = rasa premium, bukan mainan.** Kartu besar pakai `rounded-[32px]`, badge kecil pakai `rounded-full`. Tidak ada `rounded-sm` di permukaan utama.
5. **Motion minimal, tapi presisi.** `framer-motion` hanya untuk *reveal* saat scroll, *stagger* kartu, dan *counter*. Durasi 400–600ms dengan ease `[0.22, 1, 0.36, 1]` ("apple-curve").
6. **Teks ketat (tight tracking).** Heading selalu `tracking-tight`, eyebrow/kicker selalu `tracking-[0.18em] uppercase`.
7. **Noise/grain halus di seluruh layar.** 0.015 opacity, *fixed* via `body::before`. Bikin tampilan jadi "bahan", bukan vektor datar.
8. **Jujur di empty state.** Kalau belum ada testimoni, tunjukin itu. Jangan pasang placeholder palsu.

### 1.2 Moodboard Kata Kunci
> *Editorial · Studio software · Dark console · Indie SaaS · Premium stationery · Linear.app × Vercel × Apple HIG*

### 1.3 Apa yang Dihindari
- ❌ Gradient warna-warni norak.
- ❌ Drop shadow tebal + glow neon tebal.
- ❌ Font sans yang terlalu bulat/childish (Geist harga mati).
- ❌ Border tebal (≥ 2px) di kartu — semua 1px.
- ❌ Emoji di heading utama. Emoji OK di chip kecil/sekunder.
- ❌ Animasi loop tanpa henti di luar viewport.

---

## 2. Design Tokens

Semua token primitif *hidup* di `src/app/globals.css` di dalam blok `@theme { ... }` (ini cara Tailwind v4 — **tidak** ada `tailwind.config.js`). Token di bawah adalah kontrak resmi.

### 2.1 Color Tokens

#### 2.1.1 Base (didefinisikan di `@theme`)
| Token | Value | Pakai untuk |
|---|---|---|
| `--color-background` | `#030303` | Background body |
| `--color-foreground` | `#ffffff` | Default text color |

> `:root` juga punya `--background` dan `--foreground` duplikat supaya CSS lama/library pihak ketiga tetap kena.

#### 2.1.2 Surface (permukaan translusen)
Dipakai sebagai `bg-white/[xxx]` langsung dari Tailwind utility. Ini adalah *kontrak semantik*, bukan variabel:

| Nama semantik | Kelas Tailwind | Kapan dipakai |
|---|---|---|
| `surface-0` (body) | `bg-background` | Root |
| `surface-1` (subtle) | `bg-white/[0.01]` | Section alt (SocialProof, HowItWorks) |
| `surface-2` (card) | `bg-white/[0.02]` | Kartu default (Features, DetailedFeatures) |
| `surface-3` (card hover) | `bg-white/[0.04]` | State hover kartu |
| `surface-4` (emphasized) | `bg-white/[0.05]`–`bg-white/[0.06]` | Inner icon wrapper, tombol ghost |
| `surface-solid` | `bg-[#0a0a0a]` / `bg-[#0d0d10]` / `bg-[#111]` | Kartu padat (Comparison, NeuralGraph center, Feature mockup) |

#### 2.1.3 Border
| Nama | Kelas | Kapan |
|---|---|---|
| `border-hairline` | `border-white/5` | Default kartu, divider section |
| `border-soft` | `border-white/8` | Kartu sedikit lebih tegas |
| `border-strong` | `border-white/10` | Navbar scrolled, offer card utama Pricing |
| `border-emphasis` | `border-white/[0.12]`–`white/[0.15]` | Hover, center node NeuralGraph |

#### 2.1.4 Text
| Nama | Kelas | Kapan |
|---|---|---|
| `text-primary` | `text-white/90` | H1–H3 |
| `text-body-strong` | `text-white/70`–`white/80` | Label penting, sub-heading kartu |
| `text-body` | `text-neutral-400` | Paragraf utama |
| `text-muted` | `text-neutral-500` | Deskripsi kartu, caption |
| `text-faint` | `text-neutral-600` | Meta text, label sekunder |
| `text-disabled` | `text-neutral-700`–`neutral-800` | Label data kecil, fallback placeholder |
| `text-eyebrow` | `text-white/50` | Teks di dalam `SectionEyebrow` |

#### 2.1.5 Accent / Status
Warna ini **hanya** untuk aksen kecil (dot, chip, icon kecil). Tidak pernah jadi latar besar.

| Token | Warna base | Representasi |
|---|---|---|
| `accent-success` | `green-500` / `green-400` | Status aktif, sukses, lisensi valid, badge "Live" |
| `accent-warning` | `amber-400` / `amber-500` | Highlight proses otomasi, kuning "Apps Script" |
| `accent-info` | `blue-400` / `blue-500` | Dashboard node, realtime |
| `accent-danger` | `red-500` | Error, close button (mock window) |
| `accent-brand` | `violet-500` / `purple-500` | Aksen data/analitik |
| `accent-rose` | `rose-500` | Avatar stack |

**Aturan accent:**
- Fill besar → pakai tint `/10` + border `/20` + text `/400` (contoh: `bg-green-500/10 border-green-500/20 text-green-400`).
- Dot kecil → warna murni (`bg-green-400`) dengan opsional `shadow-[0_0_6px_rgba(34,197,94,0.8)]`.

#### 2.1.6 Background Effects
- **Radial hero**: `radial-gradient(circle at 50% 0%, #1a1a24 0%, var(--color-background) 70%)` pada `body`.
- **Radial sub-section**: `w-[600px] h-[300px] bg-white/[0.02] blur-[80px]`–`blur-[120px]` rounded-full, posisikan absolute di section.
- **Noise overlay**: `body::before` opacity 0.015 dengan SVG fractal noise.

### 2.2 Typography Tokens

#### 2.2.1 Font Family
| Token | Value |
|---|---|
| `--font-sans` | `var(--font-geist-sans), system-ui, -apple-system, sans-serif` |

Geist di-load via `next/font` di `layout.tsx` (tidak ada font lain).

#### 2.2.2 Type Scale
| Role | Kelas Tailwind | Ukuran | Line-height | Tracking |
|---|---|---|---|---|
| **Display H1 (Hero)** | `text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1]` | 36 → 60 → 72 | 1.1 | tight |
| **H2 Section** | `text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]` | 36 → 60 | 1.1 | tight |
| **H3 Sub-section / Card title besar** | `text-3xl md:text-4xl font-semibold tracking-tight leading-[1.15]` | 30 → 36 | 1.15 | tight |
| **H4 Card title** | `text-xl font-semibold tracking-tight` | 20 | 1.3 | tight |
| **H5 Small card title** | `text-lg font-semibold tracking-tight` | 18 | 1.3 | tight |
| **Body Large** | `text-lg leading-relaxed` | 18 | 1.6 | normal |
| **Body** | `text-base leading-relaxed` | 16 | 1.6 | normal |
| **Body Small** | `text-sm leading-relaxed` | 14 | 1.6 | normal |
| **Caption** | `text-xs` | 12 | 1.5 | normal |
| **Micro** | `text-[11px]` / `text-[10px]` | 11 / 10 | 1.5 | normal / wide |
| **Eyebrow (Kicker)** | `text-[11px] font-medium tracking-[0.18em] uppercase` | 11 | 1 | wide |
| **Tabular digit** | `tabular-nums` | — | — | — |
| **Mono (data/kode)** | `font-mono` (mewarisi default system) | — | — | — |

#### 2.2.3 Font Weight
- `font-normal` = 400 (paragraf).
- `font-medium` = 500 (label chip, nav link).
- `font-semibold` = 600 (heading utama, tombol primary, nama produk).
- `font-bold` = 700 (angka besar di StatsCounter; jangan dipakai di paragraf).

### 2.3 Spacing Tokens

Pakai skala Tailwind bawaan. **Spacing section** punya aturan:

| Konteks | Vertical padding |
|---|---|
| Section normal | `py-20 md:py-32` |
| Section kompak (SocialProof) | `py-14` |
| Section Hero | `pt-32 pb-20 md:pt-48 md:pb-32` |
| Padding dalam kartu besar | `p-8` atau `p-10` |
| Padding dalam kartu sedang | `p-6`–`p-7` |
| Padding dalam chip/pill | `px-3 py-1.5` |
| Gap antar kartu dalam grid | `gap-4` (rapat) atau `gap-8`–`gap-20` (editorial) |
| Gap header ke grid | `mb-16 md:mb-20` |
| Gap section ke section | `py-20` handled masing-masing section (tidak pakai margin parent) |

**Container**: `container mx-auto px-4 md:px-6` selalu. Maks lebar konten dibatasi manual per section: `max-w-2xl` (header copy), `max-w-3xl` (navbar/faq), `max-w-4xl` (comparison), `max-w-5xl` (feature grid, pricing).

### 2.4 Radius Tokens

Didaftarkan di `@theme`:

| Token | Value | Pakai untuk |
|---|---|---|
| `--radius-32` | `32px` | Kartu besar fitur, offer card Pricing |
| `--radius-40` | `40px` | (reserved, belum dipakai tapi tersedia) |

Tailwind utility yang dipakai:
- `rounded-full` → badge, pill, avatar, navbar.
- `rounded-3xl` (24px) → kartu medium, FAQ items.
- `rounded-2xl` (16px) → tombol primary, icon wrapper 36–40px.
- `rounded-xl` (12px) → input, tombol standar.
- `rounded-lg` (8px) → icon kecil wrapper, chip.
- `rounded-[28px]` → modul khusus (RequestForm cards).
- `rounded-[24px]` → kartu FAQ, inner mock spreadsheet.
- `rounded-[32px]` / `rounded-[40px]` → editorial cards, hero browser mock.

### 2.5 Shadow / Elevation Tokens

| Nama | Kelas | Pakai |
|---|---|---|
| `elev-0` | (none) | Flat surface |
| `elev-card` | `shadow-xl` | Tombol primary Hero |
| `elev-modal` | `shadow-2xl` | Hero browser mock, big cards |
| `glow-white-xs` | `shadow-[0_0_15px_rgba(255,255,255,0.2)]` | Logo brand |
| `glow-white-sm` | `shadow-[0_0_20px_rgba(255,255,255,0.1)]` | Logo Footer |
| `glow-white-md` | `shadow-[0_0_40px_rgba(255,255,255,0.1)]` | CTA final button |
| `glow-white-lg` | `shadow-[0_0_60px_rgba(255,255,255,0.08)]` | Pricing offer price box, NeuralGraph center |
| `glow-color` | `shadow-[0_0_6px_rgba(34,197,94,0.8)]` | Dot status hijau |

Shadow warna neon lain → **tidak**. Pakai glow putih translusen kecuali benar-benar perlu.

### 2.6 Motion Tokens

| Token | Value |
|---|---|
| `ease-brand` | `[0.22, 1, 0.36, 1]` |
| `duration-fast` | 200–300ms (hover, toggle) |
| `duration-base` | 400–500ms (reveal standar) |
| `duration-slow` | 600–800ms (reveal hero mockup, counter) |
| `stagger-default` | `0.08`–`0.1` s antara child |
| `reveal-y` | `y: 28` → `y: 0` untuk header; `y: 14` untuk `<Reveal>` CSS-only |

**Variants baku:**
```ts
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0 },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
```
Pattern ini *di-copy* apa adanya di setiap section — **bukan** diabstraksi ke file util, biar tiap komponen portabel.

**Aturan motion:**
- Semua animasi masuk viewport `useInView({ once: true, margin: "-60px" })`.
- Hindari animasi infinite kecuali sangat kecil (dot blink, orbit ring NeuralGraph).
- Hover: maksimal translate/scale kecil + color transition. Jangan ada rotate/flip.

### 2.7 Breakpoint Tokens

Pakai default Tailwind:
- `sm` ≥ 640px
- `md` ≥ 768px
- `lg` ≥ 1024px
- `xl` ≥ 1280px
- `2xl` ≥ 1536px

Uji minimum di **375px** (iPhone SE).

### 2.8 Z-Index Skala

| Layer | z |
|---|---|
| Grain overlay (`body::before`) | `100` |
| Scroll progress bar | `1000` |
| Navbar wrapper | `50` |
| Mobile nav overlay | `1001` |
| Popover/Absolute dashboard elements | `10`–`20` dalam komponen |

---

## 3. Design System (Komponen)

Komponen di bawah adalah *building block* yang mengkodekan token di atas. Jangan bikin varian baru tanpa alasan kuat — ekstensi > duplikasi.

### 3.1 Primitif

#### `SectionEyebrow` (`src/components/SectionEyebrow.tsx`)
**Fungsi:** label kicker pill yang duduk di atas H2 di setiap section. Memberi konteks topik section dalam 1–3 kata.

**API:**
```tsx
<SectionEyebrow icon={Tag} label="Harga" />
```

**Anatomi:** `inline-flex` pill, `px-3 py-1.5 rounded-full`, `bg-white/[0.03] border-white/8`, icon 12px di kiri, label `text-[11px] font-medium tracking-[0.18em] uppercase text-white/50`.

**Aturan:**
- Selalu muncul sebelum H2 dalam setiap section landing (kecuali Hero — Hero pakai status-pill hijau yang khas).
- Label 1–3 kata. Kalau perlu "Request Template" → 2 kata OK.
- Icon `lucide-react`.

#### `Reveal` (`src/components/Reveal.tsx`)
Wrapper scroll-reveal berbasis CSS (`IntersectionObserver` + class `[data-visible]`), tanpa beban framer-motion. Dipakai untuk setiap section di `page.tsx` kecuali Hero.

#### `SpotlightCard` (`src/components/SpotlightCard.tsx`)
Kartu dengan efek glow mengikuti kursor. Dipakai untuk kartu yang ingin lebih hidup: FAQ item, Testimoni, Pricing offer, HowItWorks step.

#### `Magnetic` (`src/components/Magnetic.tsx`)
Wrapper yang membuat child menarik kursor sedikit. Dipakai di tombol CTA tertentu.

#### `CodeBackground` (`src/components/CodeBackground.tsx`)
Latar "kode jalan" di Hero. Jangan dipakai di section lain supaya tetap spesial.

### 3.2 Layout

#### `Navbar` (`src/components/Navbar.tsx`)
- Fixed top, pill-shaped, `max-w-3xl`.
- State: *idle* (`bg-white/[0.03]`, padding besar) → *scrolled* (`bg-black/80 border-white/10`, padding mengecil).
- Sembunyi di `/admin` dan `/shop/[id]`.
- Mobile menu: full-screen floating panel `rounded-[32px]`.

#### `Footer` (`src/components/Footer.tsx`)
- 12-kolom grid di desktop: brand (5) + spacer (1) + nav (3) + legal (3).
- Bottom bar tipis dengan copyright + dua link legal.
- Sembunyi di `/admin`.

#### `SmoothScroll` (`src/components/SmoothScroll.tsx`)
Mounting `lenis` di root layout client.

### 3.3 Section Component (atomic pakai token)

Semua section landing mengikuti **rangka yang sama**:

```tsx
<section className="py-20 md:py-32 [opsi: border-t border-white/5 | bg-white/[0.01]]">
  <div className="container mx-auto px-4 md:px-6">

    {/* Header block */}
    <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
      <div className="mb-4 flex justify-center">
        <SectionEyebrow icon={…} label="…" />
      </div>
      <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]">
        {headline}
      </h2>
      <p className="text-neutral-400 text-lg leading-relaxed">
        {subheadline}
      </p>
    </div>

    {/* Content block */}
    <div className="… max-w-5xl mx-auto">
      {children}
    </div>

  </div>
</section>
```

Patuhi rangka ini. Kalau butuh menyimpang (Hero, NeuralGraph) ada alasan eksplisit.

### 3.4 Form Controls

| Elemen | Style default |
|---|---|
| `<input>` / `<textarea>` | `bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-neutral-600 focus:border-white/30 focus:bg-white/[0.05]` |
| Label | `text-[11px] font-semibold text-white/40 uppercase tracking-[0.18em]` |
| Icon dalam input | `absolute left-4` + `text-neutral-600` + `pointer-events-none` |
| Helper/meta | `text-[10px] text-neutral-600` kanan |
| Error box | `bg-red-500/8 border border-red-500/20 text-red-400 rounded-xl px-3.5 py-2.5` |

### 3.5 Button

#### Primary (putih)
```
bg-white text-black px-8 py-3.5 rounded-xl font-semibold
hover:bg-neutral-200 transition-all active:scale-95 shadow-xl
```
Ikon kiri + label + `ArrowRight` kanan (opsional).

#### Secondary (ghost)
```
bg-transparent text-white border border-white/20 px-8 py-3.5 rounded-xl font-medium
hover:bg-white/5 transition-all active:scale-95
```

#### Tertiary (chip)
```
inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5/8
text-[11px] font-medium tracking-[0.18em] uppercase text-white/50
```

### 3.6 Badge / Chip

- **Status dot pill**: `w-2 h-2 rounded-full bg-green-500` + label; dipakai di Hero ("Siap dipakai tanpa setup ribet") dan Footer ("Semua sistem aktif").
- **Accent chip** (misal "↑ 18.4%"): `bg-green-500/10 border border-green-500/20 text-green-400 rounded-full px-3 py-1.5 text-xs`.

### 3.7 Iconography
- Library: **`lucide-react`** eksklusif.
- Ukuran standar: **12** (di dalam pill eyebrow), **14**–**16** (inline body), **17**–**18** (wrapper 36–40px), **20**–**22** (hero icon card), **24** (center NeuralGraph).
- Stroke: default lucide (`strokeWidth={2}`), kecuali Eyebrow pakai `2.2` untuk visibility kecil.
- Warna default: `text-white/40`–`text-white/55`. Aksen warna khusus section (biru/kuning/hijau) hanya kalau punya arti.

### 3.8 Data Visualization
- **Chart**: `recharts`, tema harus gelap dengan stroke `rgba(255,255,255,0.1)` dan tick `text-neutral-500`.
- **Bar mock**: pakai bar `rgba(255,255,255,0.06 + i * 0.04)` supaya ada gradasi halus; bar terakhir pakai `rgba(255,255,255,0.6)` sebagai *focus*.

### 3.9 Image & Media
- `next/image` untuk semua aset statis.
- Border `rounded-2xl` minimum. Tidak ada gambar siku tajam di landing.
- Gunakan *mockup* in-page (UI fake seperti di Hero & Features) daripada screenshot asli — lebih tahan lama & bebas hak cipta.

### 3.10 Scrollbar
- Global: lebar 8px, track hitam, thumb `#222`.
- `custom-scrollbar`: versi tipis 6px untuk kartu dalam modal/list.
- `hide-scrollbar`: utility untuk horizontal scroll row (swiper, tab).

---

## 4. Pola Layout (Section Pattern Library)

### 4.1 Hero Pattern
- Center-aligned, max-width `max-w-4xl`.
- Status pill → H1 → sub → 2 CTA → visual mockup di bawah.
- Ada `CodeBackground` di belakang.

### 4.2 Stats / Metric Grid
- Header center.
- Grid `1 / 2 / 4 kolom` dengan kartu `rounded-[28px]` gelap solid `#0d0d0d`.
- Setiap kartu: icon wrapper + live badge + angka + label + progress bar.

### 4.3 3-Step Grid
- Card dengan icon wrapper + nomor "01"/"02"/"03" + title + desc, center-aligned.
- Dibungkus `SpotlightCard`.

### 4.4 Feature Row (Alternating)
- Grid 2 kolom, teks vs visual.
- Baris genap reverse dengan `md:[&>*:first-child]:order-2`.
- Setiap row punya eyebrow row sendiri (label kecil uppercase, bukan `SectionEyebrow`).

### 4.5 Comparison Table
- Grid 3 kolom: fitur / kami / kompetitor-manual.
- Kolom "kami" punya `bg-white/[0.015]` dan garis horizontal tipis di atasnya.

### 4.6 FAQ Accordion
- Card `rounded-[24px]`, tombol button penuh, chevron berotasi.
- Hanya 1 item terbuka pada satu waktu.

### 4.7 Bento Grid (Pricing)
- Grid 12 kolom: kiri (4) pain points, kanan (8) offer + value boxes.
- Offer card berisi copy + price box putih di kanan.

### 4.8 Form + Inspirasi (RequestForm)
- Grid 2 kolom: kiri inspirasi (chip-list klik-isi), kanan form.
- Success state full-height dalam kolom kanan.

### 4.9 Neural Graph
- 3 kolom: left nodes, center engine, right nodes.
- SVG overlay absolute menggambar koneksi + dot perjalanan.
- Mobile: stack vertikal dengan sub-label "Input" dan "Output".

---

## 5. Copy × Design Guidelines

- Heading H2 idealnya **satu/dua baris**. Kalau lebih, pikirkan ulang.
- Subheadline max 160 karakter.
- Eyebrow 1–3 kata, selalu title case atau specific: "Harga", "Cara Kerja", "Fitur Unggulan", "Request Template".
- CTA label pakai kata kerja lembut: "Lihat", "Pilih", "Kirim", "Pelajari". Hindari "Buy now".

---

## 6. Do's & Don'ts Cepat

✅ **Do**
- Pakai `SectionEyebrow` di setiap section baru.
- Pakai opacity untuk kedalaman, bukan warna baru.
- Pakai `tracking-tight` di semua heading ≥ 18px.
- Pakai ikon `lucide-react` ukuran 12/14/16.
- Pakai `useInView({ once: true, margin: "-60px" })` untuk animasi masuk.

❌ **Don't**
- Jangan tambah library UI (shadcn/radix/mui) — semua komponen tulis tangan.
- Jangan buat token warna baru — perluas skala translusen existing.
- Jangan pakai `border-2` di kartu.
- Jangan buat radius baru di bawah 8px atau antara 8–12px yang duplikatif.
- Jangan animasi rotate 360° kontinyu di luar viewport.

---

## 7. Referensi File

| Token/Concept | File |
|---|---|
| Base color, radius, font | `src/app/globals.css` (blok `@theme`) |
| Grain & selection color | `src/app/globals.css` (`body::before`) |
| Reveal animation (CSS) | `src/app/globals.css` → `.reveal-section` |
| Section Eyebrow | `src/components/SectionEyebrow.tsx` |
| Navbar pattern | `src/components/Navbar.tsx` |
| Footer pattern | `src/components/Footer.tsx` |
| Hero pattern | `src/components/Hero.tsx` |
| Stats grid pattern | `src/components/StatsCounter.tsx` |
| Feature row alternating | `src/components/Features.tsx` |
| Comparison table | `src/components/Comparison.tsx` |
| FAQ accordion | `src/components/FAQ.tsx` |
| Bento Pricing | `src/components/Pricing.tsx` |
| Form style | `src/components/RequestForm.tsx` |

---

## 8. Changelog Rules

Setiap perubahan token/komponen yang dipakai oleh ≥ 2 section **wajib** disertai update dokumen ini. Tambahkan di bagian "Changelog" bawah file, format: `YYYY-MM-DD — ringkasan singkat`.

### Changelog
- *(kosong — ini versi awal)*
