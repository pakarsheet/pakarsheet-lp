# Pakarsheet — Section & Element Vocabulary

> Dokumen ini kamus nama resmi untuk tiap bagian landing page dan elemen UI. Tujuannya: **ketika kamu ngasih prompt ke AI/dev**, cukup sebut namanya dan semua orang tahu persis bagian mana yang dimaksud — dengan layer apa (section, block, element), di file mana, dengan gaya apa.
>
> Contoh: *"ganti **eyebrow** di **Pricing section** dari 'Harga' jadi 'Investasi'"* → langsung paham: ubah prop `label` di `<SectionEyebrow>` dalam `Pricing.tsx`.

Format istilah dibagi jadi 4 lapisan:
- **Section** → satu zona besar dalam halaman.
- **Block** → sub-zona di dalam section (header, grid, footer-strip dll).
- **Element** → unit atom UI (eyebrow, headline, card, chip, dst).
- **Pattern** → susunan/komposisi spesifik (bento grid, feature row alternating, dst).

---

## 1. Kosakata Universal (Terlepas dari Section Mana)

Istilah-istilah ini **berlaku di mana saja** di produk. Sebut nama-nama ini saat memberi instruksi, bukan deskripsi visual panjang.

### 1.1 Elemen Atas Heading

#### **Eyebrow** (alias: *kicker*, *pre-headline*, *overline*)
Label pill kecil yang duduk tepat **di atas** `<h2>` setiap section.

- **Apa itu**: chip/pill horizontal kecil, biasanya `Icon + TEKS UPPERCASE` dengan jarak huruf lebar (tracking `0.18em`).
- **Komponen**: `SectionEyebrow` di `src/components/SectionEyebrow.tsx`.
- **Tujuan UX**: memberi konteks topik section dalam 1–3 kata sebelum mata pengunjung sampai ke headline besar.
- **Visual**: `rounded-full`, background `white/[0.03]`, border `white/8`, teks `text-[11px] font-medium uppercase tracking-[0.18em] text-white/50`, icon 12px kiri.
- **Contoh nilai di produk**:
  - "Kenapa pilih Pakarsheet" — SocialProof
  - "Hasil Nyata" — StatsCounter
  - "Cara Kerja" — HowItWorks
  - "Arsitektur" — NeuralGraph
  - "Kemampuan" — DetailedFeatures
  - "Fitur Unggulan" — Features
  - "Perbandingan" — Comparison
  - "Testimoni" — Testimonials
  - "FAQ" — FAQ
  - "Harga" — Pricing
  - "Request Template" — RequestForm
  - "Mulai Sekarang" — CTA

> ⚠️ Kalau ada orang menyebut "tag kecil di atas heading", "label kategori", "overline", "sub-title atas" — semua maksudnya **eyebrow**. Pakai istilah ini supaya konsisten.

#### **Headline** (alias: *section title*, *H2*)
Teks besar utama sebuah section. Selalu `<h2>` (kecuali Hero yang `<h1>`).
- Style baku: `text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]`.

#### **Sub-headline** (alias: *lede*, *dek*, *section description*)
Paragraf singkat di bawah headline yang menjelaskan janji dari section tersebut.
- Style baku: `text-neutral-400 text-lg leading-relaxed`.

#### **Section Header (block)**
Gabungan **eyebrow + headline + sub-headline** di tengah, `max-w-2xl mx-auto mb-16 md:mb-20 text-center`. Hampir setiap section pakai pattern ini.

### 1.2 Navigation Elements

| Istilah | Maksud |
|---|---|
| **Navbar pill** | Bar navigasi atas yang pill-shaped (fixed, max-w-3xl) |
| **Brand lockup** | Logo (kotak putih dengan grid 2×2) + teks "Pakarsheet" |
| **Nav links** | Link teks tengah navbar (Fitur, Tools, Blog, Custom, Toko) |
| **Primary nav CTA** | Tombol putih di kanan navbar ("Lihat Template") |
| **Mobile drawer** | Panel menu mobile yang muncul saat hamburger diklik |
| **Scroll progress bar** | Garis putih 2px di paling atas viewport |
| **Footer nav** | Kolom link di Footer |
| **Footer legal** | Kolom legal di Footer (Terms, Privacy) |
| **Footer bottom bar** | Strip tipis paling bawah Footer (copyright + link) |
| **Footer status badge** | Pill "Semua sistem aktif" di kolom legal |

### 1.3 Card & Surface Elements

| Istilah | Maksud | Contoh |
|---|---|---|
| **Card** | Kotak dengan background surface + border hairline. | Feature card di DetailedFeatures |
| **Offer card** | Kartu utama penawaran harga. | Kartu besar di Pricing |
| **Price box** | Kotak putih di dalam offer card yang berisi harga. | Kotak "99rb" di Pricing |
| **Pain card** | Kartu setengah-opasitas yang menggambarkan masalah. | 2 kartu kiri di Pricing ("Sewa agency", "Manual input") |
| **Stat card** | Kartu angka dengan live badge + progress bar. | 4 kartu di StatsCounter |
| **Step card** | Kartu 1 langkah dalam HowItWorks. | 3 kartu "01/02/03" |
| **Trust chip** | Pill kecil dengan icon + label + sub-label. | 4 item di SocialProof |
| **Feature row** | 2-kolom row teks vs visual di Features. | 4 row bergantian |
| **Feature visual** | Mockup UI di sisi visual Feature row. | `UIPreview`, `ChartPreview`, dst. |
| **Comparison row** | 1 baris tabel Comparison | "Tampilan & UI", "Otomasi Apps Script", dst. |
| **FAQ item** | 1 item accordion FAQ | 5 item pertanyaan |
| **Testimonial card** | Kartu komentar pengguna | Wall of love di Testimonials |
| **Inspiration chip** | Chip di kolom kiri RequestForm yang kalau diklik mengisi textarea | "Template manajemen stok toko retail" dll. |

### 1.4 Button & Chip

| Istilah | Maksud |
|---|---|
| **Primary CTA** | Tombol solid putih, teks hitam |
| **Secondary CTA** | Tombol ghost border putih transparan |
| **Tertiary chip / ghost pill** | Pill background translusen dengan teks kecil |
| **Status pill (live)** | Pill dengan dot hijau berkedip |
| **Trend chip** | Chip accent hijau dengan panah ↑/↓ |
| **Accent chip** | Chip warna status (green/amber/blue) |

### 1.5 Data Visualization

| Istilah | Maksud |
|---|---|
| **Counter** | Angka yang count-up saat masuk viewport (di StatsCounter) |
| **Progress bar** | Garis horizontal tipis dengan fill animated |
| **Mini chart** | Chart kecil dalam card (bars di Hero overlay, ChartPreview) |
| **Spark bar** | Bar mini di Hero overlay analytics |
| **Connector path** | Kurva SVG di NeuralGraph yang menghubungkan node |
| **Travel dot** | Bulatan kecil yang merambat di connector path |
| **Engine node** | Node tengah NeuralGraph (kotak besar "Pakarsheet Processing") |
| **Side node** | Node kiri/kanan di NeuralGraph |
| **Orbit ring** | Lingkaran konsentris animated mengelilingi engine node |

### 1.6 Background / Ambient

| Istilah | Maksud |
|---|---|
| **Grain overlay** | Noise SVG global opacity 0.015 di `body::before` |
| **Radial halo** | Lingkaran blur besar `bg-white/[0.02] blur-[80px]` di dalam section |
| **Hero code background** | `CodeBackground.tsx` — animasi "kode jalan" di Hero |
| **Corner glow** | Blur accent color di pojok kartu (amber, green, violet) |

### 1.7 Animation Tokens

| Istilah | Maksud |
|---|---|
| **Reveal** | Animasi CSS opacity + translateY saat section masuk viewport (`<Reveal>`) |
| **Fade-up** | Variant framer-motion `{ opacity: 0, y: 28 } → { opacity: 1, y: 0 }` |
| **Stagger** | Variant parent yang men-*delay* anak-anaknya |
| **Spotlight** | Glow mengikuti kursor (`<SpotlightCard>`) |
| **Magnetic** | Tombol yang "tertarik" ke kursor (`<Magnetic>`) |

---

## 2. Section-by-Section (Landing `/`)

Bagian ini daftar **urutan section** di halaman utama beserta nama kode, eyebrow, headline, dan elemen penting. Gunakan nama kode (kolom pertama) saat memberi perintah.

### 2.1 `Navbar`
- **Tipe**: global layout (bukan section halaman).
- **File**: `src/components/Navbar.tsx`.
- **Elemen**: Brand lockup, Nav links, Primary nav CTA, Mobile drawer, Scroll progress bar.

### 2.2 `Hero`
- **File**: `src/components/Hero.tsx`.
- **Eyebrow**: — (dipilih khas: **status pill hijau** bertuliskan "Siap dipakai tanpa setup ribet").
- **Headline**: "Stop buang waktu untuk / input data manual."
- **Sub-headline**: 1 paragraf menjelaskan template + Apps Script.
- **CTA**: `Primary → /shop "Lihat template"` + `Secondary → #cara-kerja "Cara kerjanya"`.
- **Visual**: **Hero browser mock** (bar merah/kuning/hijau + nama file) → **Spreadsheet mock** (grid + status chip + angka Rp + progress) → **Analytics overlay card** dengan spark bars di kanan.

### 2.3 `SocialProof` (alias *Trust strip*)
- **File**: `src/components/SocialProof.tsx`.
- **Eyebrow**: `ShieldCheck` · "Kenapa pilih Pakarsheet".
- **Tidak punya** headline H2 (khusus strip kompak).
- **Konten**: 4 **trust chip** — Pembayaran aman, Akses instan, Lifetime update, Support aktif.

### 2.4 `StatsCounter` (alias *Metric grid*)
- **File**: `src/components/StatsCounter.tsx`.
- **Eyebrow**: `TrendingUp` · "Hasil Nyata".
- **Headline**: "Angka yang bicara."
- **Sub**: "Bukan klaim kosong...".
- **Konten**: 4 **stat card** (Pengguna Aktif / Data Terproses / Jam Dihemat / Rating Kepuasan) dengan **counter** + **progress bar**.
- **Footer block**: **Avatar stack** (5 inisial) + **rating stars**.

### 2.5 `HowItWorks` (anchor: `#cara-kerja`)
- **File**: `src/components/HowItWorks.tsx`.
- **Eyebrow**: `Workflow` · "Cara Kerja".
- **Headline**: "3 Langkah Gampang".
- **Konten**: 3 **step card** dengan icon + nomor "01/02/03" + title + desc.

### 2.6 `NeuralGraph` (alias *Architecture graph*)
- **File**: `src/components/NeuralGraph.tsx`.
- **Eyebrow**: `Network` · "Arsitektur".
- **Headline**: "Semua terhubung, / semua otomatis."
- **Konten**:
  - **Graph card** (`rounded-3xl`, top bar mini-window dengan label "live").
  - **Left nodes** (3): Data Bisnis, Form Input, Tim Kamu.
  - **Engine node** (center): "Pakarsheet Processing" dengan **orbit ring** animated.
  - **Right nodes** (3): Dashboard Otomatis, Apps Script, Sistem Lisensi — dengan dot status berkedip.
  - **Connector path** SVG + **travel dot** yang merambat.
  - **Bottom stat strip** (3 mini): "< 1 detik", "100%", "∞".

### 2.7 `DetailedFeatures` (alias *Capability grid*)
- **File**: `src/components/DetailedFeatures.tsx`.
- **Eyebrow**: `Zap` · "Kemampuan".
- **Headline**: "Bekerja lebih cerdas".
- **Konten**: 4 card: Auto-Sync Data Iklan, Sistem Notifikasi Telegram, One-Click PDF Reporting, User Access Control.

### 2.8 `Features` (anchor: `#fitur`, alias *Feature rows*)
- **File**: `src/components/Features.tsx`.
- **Eyebrow**: `Layers` · "Fitur Unggulan".
- **Headline**: "Fitur yang bikin / saingan kamu iri."
- **Konten**: 4 **feature row** bergantian:
  1. **UIPreview** — eyebrow row "Desain Premium" · "Bukan template bawaan Google."
  2. **ChartPreview** — eyebrow row "Analitik Real-time" · "Otomasi & analitik dalam satu klik."
  3. **AutoPreview** — eyebrow row "Tanpa Kode" · "Sistem anti-ribet untuk semua orang."
  4. **LicensePreview** — eyebrow row "Keamanan" · "Lisensi resmi & perlindungan penuh."
- **Catatan**: "eyebrow row" di sini **bukan** `<SectionEyebrow>` — ini label uppercase kecil di sisi teks tiap row. Kalau diminta "ubah eyebrow feature row ke-2", maksudnya field `eyebrow` di objek feature.

### 2.9 `Comparison`
- **File**: `src/components/Comparison.tsx`.
- **Eyebrow**: `GitCompare` · "Perbandingan".
- **Headline**: "Beda kelas, beda hasil."
- **Konten**: **Comparison table** 3 kolom × 5 baris. Kolom "Pakarsheet" punya `bg-white/[0.015]` + garis putih tipis di atas.

### 2.10 `Testimonials` (anchor: `#testimoni`)
- **File**: `src/components/Testimonials.tsx`.
- **Eyebrow**: `Quote` · "Testimoni".
- **Headline**: "Wall of love."
- **Konten**: grid **testimonial card** diambil dari Supabase. Punya **loading skeleton** dan **empty state** jujur.

### 2.11 `FAQ` (anchor: `#faq`)
- **File**: `src/components/FAQ.tsx`.
- **Eyebrow**: `HelpCircle` · "FAQ".
- **Headline**: "Tanya jawab santai."
- **Konten**: 5 **FAQ item** accordion, hanya 1 terbuka sekaligus.

### 2.12 `Pricing` (anchor: `#beli`)
- **File**: `src/components/Pricing.tsx`.
- **Eyebrow**: `Tag` · "Harga".
- **Headline**: "Investasi pintar. / Sekali seumur hidup."
- **Konten** (*bento grid*):
  - **Pain column** (kiri) — 2 **pain card** (Sewa agency, Manual input).
  - **Offer card** (kanan atas besar) — eyebrow kecil "↓ Solusi paling efisien", judul, deskripsi, **feature check list** (4 item), **price box** putih.
  - **Value boxes** (kanan bawah, 2 kartu): "Instan aktif", "Pakai selamanya".
- **Trust badges** (strip bawah): 3 badge dengan icon kecil.

### 2.13 `RequestForm` (anchor: `#request`)
- **File**: `src/components/RequestForm.tsx`.
- **Eyebrow**: `MessageSquarePlus` · "Request Template".
- **Headline**: "Nggak nemu yang kamu cari?"
- **Konten**:
  - **Inspiration pane** (kiri): 4 **inspiration chip**.
  - **Form pane** (kanan): input Email + textarea Request + submit.
  - States: idle / loading / success / error. Success state punya **confirmation block** dengan check icon.

### 2.14 `CTA`
- **File**: `src/components/CTA.tsx`.
- **Eyebrow**: `Rocket` · "Mulai Sekarang".
- **Headline**: "Ubah cara kerjamu hari ini."
- **Konten**: 1 **primary CTA** besar → `/shop`.

### 2.15 `Footer`
- **File**: `src/components/Footer.tsx`.
- **Kolom**: Brand (5 cols) + Nav (3 cols) + Legal (3 cols).
- **Footer bottom bar**: copyright + 2 link + "Made with ☕ in Indonesia".

---

## 3. Halaman Lain (Ringkas)

### 3.1 `/shop` — **ShopClient**
- File: `src/app/shop/ShopClient.tsx`.
- Bagian: **Shop hero** (judul toko), **filter row**, **product grid** dengan **product card**.

### 3.2 `/shop/[id]` — **ShopDetail**
- File: `src/app/shop/[id]/page.tsx`.
- Bagian: **Product gallery** (swiper), **product info pane** (judul, harga, CTA beli), **feature list**, **long description**.
- Tidak menampilkan Navbar biasa (pakai layout sendiri).

### 3.3 `/custom` — **CustomOrderClient**
- File: `src/app/custom/CustomOrderClient.tsx`.
- Bagian: **Hero intro**, **custom brief form** (lebih lengkap dari RequestForm).

### 3.4 `/tools` + `/tools/kalkulator-*`
- File: `src/app/tools/ToolsClient.tsx` + masing-masing kalkulator.
- Bagian: **Tool header** (eyebrow + headline + sub), **calculator panel** (input kiri, hasil kanan), **soft CTA** bawah.

### 3.5 `/blog` + `/blog/[slug]`
- Bagian: **Blog header**, **article list**, **article card**, **article body** (rendered markdown), **author strip**, **reading-time badge**.

### 3.6 `/admin` + child
- Bagian: **Admin login card**, **admin dashboard**, **admin editor** (Tiptap), **admin product form**.

---

## 4. Peta Prompt Cepat

Gunakan contoh-contoh ini saat menulis instruksi:

| Kalau kamu mau… | Sebut begini |
|---|---|
| Ubah label pill di atas heading section | "ubah **eyebrow** di section **Pricing** jadi 'Investasi'" |
| Ubah headline section | "ganti **headline** section **StatsCounter** jadi '…'" |
| Ubah teks pengenalan setelah headline | "perbaiki **sub-headline** section **HowItWorks**" |
| Ubah teks nomor "01/02/03" di HowItWorks | "ubah urutan **step card** di HowItWorks" |
| Ubah tabel perbandingan | "tambah **comparison row** baru di **Comparison** tentang …" |
| Ubah salah satu fitur teknis di grid 4 | "ganti **capability card** ke-3 di **DetailedFeatures**" |
| Ubah visual di Features | "ubah **feature visual** baris ke-2 (ChartPreview)" |
| Ubah eyebrow *di dalam* row Features | "ubah **feature row eyebrow** dari 'Desain Premium' jadi '…'" |
| Ubah penawaran harga | "ubah **offer card** di **Pricing** + teks di **price box**" |
| Tambah contoh di form request | "tambah **inspiration chip** baru di **RequestForm**" |
| Ubah CTA akhir | "ganti **primary CTA** di section **CTA**" |
| Ubah badge hijau hidup di mockup | "ubah **live badge** di **NeuralGraph graph card**" |
| Ubah navbar saat scroll | "perhalus transisi state **Navbar pill** dari idle ke scrolled" |
| Ubah logo brand | "perbarui **brand lockup** (logo+kata 'Pakarsheet')" |
| Ubah empty state | "perbaiki **empty state** di Testimonials" |

---

## 5. Tabel Rujukan Cepat (Index)

| Nama kode | File | Eyebrow | Anchor/ID |
|---|---|---|---|
| Navbar | `Navbar.tsx` | — | — |
| Hero | `Hero.tsx` | status pill | — |
| SocialProof | `SocialProof.tsx` | Kenapa pilih Pakarsheet | — |
| StatsCounter | `StatsCounter.tsx` | Hasil Nyata | — |
| HowItWorks | `HowItWorks.tsx` | Cara Kerja | `#cara-kerja` |
| NeuralGraph | `NeuralGraph.tsx` | Arsitektur | — |
| DetailedFeatures | `DetailedFeatures.tsx` | Kemampuan | — |
| Features | `Features.tsx` | Fitur Unggulan | `#fitur` |
| Comparison | `Comparison.tsx` | Perbandingan | — |
| Testimonials | `Testimonials.tsx` | Testimoni | `#testimoni` |
| FAQ | `FAQ.tsx` | FAQ | `#faq` |
| Pricing | `Pricing.tsx` | Harga | `#beli` |
| RequestForm | `RequestForm.tsx` | Request Template | `#request` |
| CTA | `CTA.tsx` | Mulai Sekarang | — |
| Footer | `Footer.tsx` | — | — |

---

## 6. Aturan Penamaan Baru

Kalau menambah section baru, ikuti pola ini biar tetap bisa di-*prompt*:
1. **Buat komponen** dengan nama PascalCase yang kembar dengan nama kode section (`NewSection.tsx`).
2. **Wajib pasang `<SectionEyebrow>`** dengan label pendek 1–3 kata.
3. **Headline selalu `<h2>`**, ikuti type scale di `docs/DESIGN-SYSTEM.md`.
4. **Tambahkan entry** ke tabel rujukan di §5 dokumen ini.
5. Kalau section punya elemen spesifik, daftarkan sub-namanya di §2 (seperti *Engine node*, *Price box*, *Inspiration chip*, dst) biar bisa dipanggil dalam prompt.

---

## 7. Lampiran

- PRD utama → `docs/PRD.md`.
- Design System & Tokens → `docs/DESIGN-SYSTEM.md`.
- Aturan agent Next.js (versi baru) → `AGENTS.md` (root).
