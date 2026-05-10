# Requirements Document

## Introduction

Fitur ini melakukan rebuild total UI/UX editor produk dan blog pada admin panel (`/admin`). Saat ini kedua editor menggunakan drawer/sidebar yang muncul dari kanan layar dengan ruang yang terbatas. Rebuild ini mengganti drawer dengan halaman editor dedicated full-page (`/admin/products/[id]` dan `/admin/blog/[id]`), menerapkan layout two-column yang lebih lega, dan mengupgrade editor konten blog dari Markdown + preview toggle menjadi rich text editor WYSIWYG berbasis Tiptap.

## Glossary

- **Admin_Panel**: Aplikasi Next.js di route `/admin` yang digunakan admin untuk mengelola konten website.
- **Product_Editor**: Halaman dedicated di `/admin/products/[id]` untuk membuat dan mengedit data produk.
- **Blog_Editor**: Halaman dedicated di `/admin/blog/[id]` untuk membuat dan mengedit artikel blog.
- **WYSIWYG_Editor**: Komponen rich text editor berbasis Tiptap yang menampilkan konten sebagaimana akan terlihat di halaman publik.
- **Two_Column_Layout**: Tata letak halaman editor dengan kolom kiri untuk konten utama dan kolom kanan untuk metadata/pengaturan.
- **Product_List**: Tampilan daftar produk di tab "Produk" pada Admin_Panel.
- **Blog_List**: Tampilan daftar artikel di tab "Blog" pada Admin_Panel.
- **Slug**: Identifier URL-friendly untuk artikel blog, contoh: `cara-membuat-laporan-keuangan`.
- **Flash_Sale**: Harga diskon sementara pada produk dengan batas waktu berakhir.
- **Draft**: Status artikel blog yang belum dipublikasikan.
- **Published**: Status artikel blog yang sudah dipublikasikan dan dapat diakses publik.

---

## Requirements

### Requirement 1: Navigasi ke Halaman Editor

**User Story:** Sebagai admin, saya ingin mengklik produk atau artikel di daftar dan langsung masuk ke halaman editor dedicated, sehingga saya memiliki ruang kerja yang lebih lega dan tidak terganggu oleh overlay drawer.

#### Acceptance Criteria

1. WHEN admin mengklik tombol edit pada item di Product_List, THE Admin_Panel SHALL menavigasi ke halaman `/admin/products/[id]` yang sesuai.
2. WHEN admin mengklik tombol "Tambah Produk" di Product_List, THE Admin_Panel SHALL menavigasi ke halaman `/admin/products/new`.
3. WHEN admin mengklik tombol edit pada item di Blog_List, THE Admin_Panel SHALL menavigasi ke halaman `/admin/blog/[id]` yang sesuai.
4. WHEN admin mengklik tombol "Tulis Artikel" di Blog_List, THE Admin_Panel SHALL menavigasi ke halaman `/admin/blog/new`.
5. WHEN admin berada di Product_Editor atau Blog_Editor, THE Admin_Panel SHALL menampilkan tombol navigasi kembali ke halaman list yang sesuai.
6. WHEN admin mengklik tombol kembali dan Admin_Panel sedang berada di Product_Editor, THE Admin_Panel SHALL menavigasi kembali ke tab "Produk" di Admin_Panel.
7. WHEN admin mengklik tombol kembali dan Admin_Panel sedang berada di Blog_Editor, THE Admin_Panel SHALL menavigasi kembali ke tab "Blog" di Admin_Panel.
8. THE Admin_Panel SHALL mempertahankan sesi autentikasi admin saat berpindah antara halaman list dan halaman editor.
9. IF admin mengakses `/admin/products/[id]` atau `/admin/blog/[id]` tanpa sesi autentikasi yang valid, THEN THE Admin_Panel SHALL mengarahkan admin ke halaman login.

---

### Requirement 2: Layout Two-Column Product Editor

**User Story:** Sebagai admin, saya ingin mengedit produk dalam layout two-column yang lega, sehingga saya dapat melihat dan mengisi semua informasi produk secara efisien tanpa perlu scroll berlebihan.

#### Acceptance Criteria

1. THE Product_Editor SHALL menampilkan layout two-column pada viewport lebar (≥ 1024px) dengan kolom kiri berisi konten utama dan kolom kanan berisi metadata.
2. THE Product_Editor SHALL menempatkan field berikut di kolom kiri: nama produk, deskripsi, dan daftar fitur unggulan produk.
3. THE Product_Editor SHALL menempatkan field berikut di kolom kanan: gambar produk, kategori, harga normal, harga coret/asli, harga flash sale, waktu berakhir flash sale, social proof count, dan Lynk.id URL.
4. WHEN viewport lebar kurang dari 1024px, THE Product_Editor SHALL segera beralih ke layout single-column yang dapat di-scroll, termasuk pada lebar yang sangat sempit.
5. WHEN admin mengubah ukuran browser window sehingga viewport melewati threshold 1024px, THE Product_Editor SHALL segera beralih layout tanpa perlu reload halaman.
5. THE Product_Editor SHALL menampilkan judul halaman yang membedakan antara mode "Tambah Produk" dan "Edit Produk".
6. THE Product_Editor SHALL mempertahankan semua field yang ada pada editor produk sebelumnya tanpa menghilangkan fungsionalitas apapun.

---

### Requirement 3: Layout Two-Column Blog Editor

**User Story:** Sebagai admin, saya ingin mengedit artikel blog dalam layout two-column yang lega, sehingga saya dapat fokus menulis konten di kiri sambil mengatur metadata di kanan.

#### Acceptance Criteria

1. THE Blog_Editor SHALL menampilkan layout two-column pada viewport lebar (≥ 1024px) dengan kolom kiri berisi konten utama dan kolom kanan berisi metadata.
2. THE Blog_Editor SHALL menempatkan field berikut di kolom kiri: judul artikel, slug URL, dan konten artikel (WYSIWYG_Editor).
3. THE Blog_Editor SHALL menempatkan field berikut di kolom kanan: cover image, kategori, status (draft/published), excerpt, tags, dan produk terkait.
4. WHEN viewport lebar kurang dari 1024px, THE Blog_Editor SHALL segera beralih ke layout single-column dengan urutan: cover image, judul, slug, excerpt, kategori, status, tags, produk terkait, lalu konten.
5. WHEN admin mengubah ukuran browser window sehingga viewport melewati threshold 1024px, THE Blog_Editor SHALL segera beralih layout tanpa perlu reload halaman.
5. THE Blog_Editor SHALL menampilkan judul halaman yang membedakan antara mode "Tulis Artikel Baru" dan "Edit Artikel".
6. THE Blog_Editor SHALL mempertahankan semua field yang ada pada editor blog sebelumnya tanpa menghilangkan fungsionalitas apapun.

---

### Requirement 4: Rich Text Editor WYSIWYG untuk Blog

**User Story:** Sebagai admin, saya ingin menulis konten artikel menggunakan rich text editor WYSIWYG, sehingga saya dapat memformat teks secara visual tanpa perlu menghafal sintaks Markdown.

#### Acceptance Criteria

1. THE WYSIWYG_Editor SHALL mendukung format teks: bold, italic, dan strikethrough.
2. THE WYSIWYG_Editor SHALL mendukung heading level H2 dan H3.
3. THE WYSIWYG_Editor SHALL mendukung bullet list (unordered) dan ordered list.
4. THE WYSIWYG_Editor SHALL mendukung blockquote.
5. THE WYSIWYG_Editor SHALL mendukung inline code dan code block.
6. THE WYSIWYG_Editor SHALL mendukung penyisipan dan pengeditan hyperlink.
7. THE WYSIWYG_Editor SHALL menampilkan toolbar dengan tombol untuk setiap format yang didukung.
8. WHEN admin memilih teks di WYSIWYG_Editor, THE WYSIWYG_Editor SHALL menampilkan toolbar format yang relevan.
9. THE WYSIWYG_Editor SHALL menyimpan konten dalam format HTML yang dapat dirender langsung di halaman blog publik.
10. WHEN konten yang tersimpan di database berformat Markdown (data lama), THE Blog_Editor SHALL menampilkan konten tersebut dengan benar di WYSIWYG_Editor tanpa kehilangan data. IF konversi Markdown ke HTML gagal karena sintaks tidak didukung atau data rusak, THEN THE Blog_Editor SHALL mencegah editor dari loading dan menampilkan pesan error yang deskriptif.
11. THE WYSIWYG_Editor SHALL mendukung undo dan redo dengan keyboard shortcut standar (Ctrl+Z / Cmd+Z dan Ctrl+Y / Cmd+Y).

---

### Requirement 5: Tombol Simpan dan Feedback Status

**User Story:** Sebagai admin, saya ingin ada tombol simpan yang jelas dan feedback visual yang informatif, sehingga saya tahu kapan perubahan berhasil disimpan atau gagal.

#### Acceptance Criteria

1. THE Product_Editor SHALL menampilkan tombol "Simpan Produk" atau "Update Produk" yang terlihat jelas di area yang mudah dijangkau.
2. THE Blog_Editor SHALL menampilkan tombol "Simpan Artikel" atau "Update Artikel" yang terlihat jelas di area yang mudah dijangkau.
3. WHEN admin mengklik tombol simpan dan proses penyimpanan sedang berlangsung, THE Admin_Panel SHALL menampilkan indikator loading pada tombol dan menonaktifkan tombol untuk mencegah double-submit.
4. WHEN penyimpanan berhasil, THE Admin_Panel SHALL menampilkan feedback visual sukses (contoh: perubahan label tombol menjadi "Tersimpan!" dengan ikon centang) selama minimal 1 detik.
5. IF penyimpanan gagal karena error, THEN THE Admin_Panel SHALL menampilkan pesan error yang deskriptif di dekat tombol simpan dan memastikan tidak ada feedback sukses yang muncul bersamaan.
6. THE Blog_Editor SHALL menampilkan tombol simpan yang dapat diakses baik dari atas maupun bawah halaman editor untuk artikel panjang.

---

### Requirement 6: Validasi Form Editor

**User Story:** Sebagai admin, saya ingin form editor memvalidasi input sebelum disimpan, sehingga data yang masuk ke database selalu valid dan lengkap.

#### Acceptance Criteria

1. WHEN admin mencoba menyimpan produk tanpa mengisi nama produk, THE Product_Editor SHALL mencegah penyimpanan dan menampilkan pesan validasi pada field nama.
2. WHEN admin mencoba menyimpan produk tanpa mengisi harga, THE Product_Editor SHALL mencegah penyimpanan dan menampilkan pesan validasi pada field harga.
3. WHEN admin mencoba menyimpan produk tanpa mengunggah minimal satu gambar, THE Product_Editor SHALL mencegah penyimpanan dan menampilkan pesan error gambar.
4. WHEN admin mencoba menyimpan produk tanpa mengisi Lynk.id URL, THE Product_Editor SHALL mencegah penyimpanan dan menampilkan pesan validasi pada field URL.
5. WHEN admin mencoba menyimpan artikel tanpa mengisi judul, THE Blog_Editor SHALL mencegah penyimpanan dan menampilkan pesan validasi pada field judul.
6. WHEN admin mencoba menyimpan artikel tanpa mengisi konten, THE Blog_Editor SHALL mencegah penyimpanan dan menampilkan pesan validasi pada field konten.
7. WHEN admin mencoba menyimpan artikel tanpa mengisi excerpt, THE Blog_Editor SHALL mencegah penyimpanan dan menampilkan pesan validasi pada field excerpt.
8. WHEN admin mengisi field harga dengan karakter non-numerik, THE Product_Editor SHALL secara otomatis menghapus karakter non-numerik tersebut dari input.
9. WHEN admin mengisi field slug dengan karakter yang tidak valid untuk URL, THE Blog_Editor SHALL secara otomatis mengkonversi karakter tersebut menjadi format slug yang valid.
10. WHEN admin mengisi excerpt melebihi 160 karakter, THE Blog_Editor SHALL menampilkan penghitung karakter dan mencegah input baru melebihi 160 karakter. WHILE excerpt yang sudah ada melebihi 160 karakter (data lama), THE Blog_Editor SHALL tetap mengizinkan admin mengedit konten tersebut.

---

### Requirement 7: Manajemen Gambar Produk

**User Story:** Sebagai admin, saya ingin mengelola gambar produk dengan mudah di halaman editor, sehingga saya dapat menambah, menghapus, dan melihat preview gambar sebelum menyimpan.

#### Acceptance Criteria

1. THE Product_Editor SHALL menampilkan semua gambar produk yang sudah tersimpan beserta preview thumbnail-nya.
2. WHEN admin mengunggah gambar baru, THE Product_Editor SHALL menampilkan preview gambar tersebut sebelum disimpan dengan label visual yang membedakan gambar baru dari gambar yang sudah tersimpan.
3. WHEN admin mengklik tombol hapus pada thumbnail gambar, THE Product_Editor SHALL menghapus gambar tersebut dari daftar gambar yang akan disimpan.
4. THE Product_Editor SHALL mendukung pengunggahan multiple gambar sekaligus.
5. IF upload gambar ke storage gagal, THEN THE Product_Editor SHALL menampilkan pesan error yang spesifik dan mempertahankan gambar lain yang sudah berhasil diupload.

---

### Requirement 8: Manajemen Cover Image Blog

**User Story:** Sebagai admin, saya ingin mengunggah dan mengganti cover image artikel dengan mudah, sehingga setiap artikel memiliki visual yang menarik.

#### Acceptance Criteria

1. THE Blog_Editor SHALL menampilkan area upload cover image dengan preview visual.
2. WHEN admin memilih file gambar untuk cover, THE Blog_Editor SHALL menampilkan preview cover image sebelum disimpan.
3. WHEN admin mengklik tombol "Hapus cover", THE Blog_Editor SHALL menghapus cover image dari form dan menampilkan kembali area upload kosong.
4. THE Blog_Editor SHALL menampilkan panduan rasio gambar yang disarankan (21:9) pada area upload cover.
5. IF upload cover image gagal, THEN THE Blog_Editor SHALL menampilkan pesan error yang deskriptif.

---

### Requirement 9: Fitur Unggulan Produk

**User Story:** Sebagai admin, saya ingin mengelola daftar fitur unggulan per produk langsung di halaman editor, sehingga setiap produk dapat memiliki highlight fitur yang berbeda-beda.

#### Acceptance Criteria

1. THE Product_Editor SHALL menampilkan daftar fitur unggulan yang sudah tersimpan untuk produk yang sedang diedit.
2. WHEN admin mengklik tombol "Tambah Fitur", THE Product_Editor SHALL menambahkan baris input baru untuk fitur unggulan baru.
3. THE Product_Editor SHALL menyediakan field untuk setiap fitur: nama fitur, deskripsi singkat, dan pilihan ikon.
4. WHEN admin mengklik tombol hapus pada baris fitur, THE Product_Editor SHALL menghapus fitur tersebut dari daftar.
5. THE Product_Editor SHALL menampilkan informasi bahwa fitur kosong akan menggunakan fitur default dari Settings.

---

### Requirement 10: Slug Otomatis untuk Blog

**User Story:** Sebagai admin, saya ingin slug artikel ter-generate otomatis dari judul saat membuat artikel baru, sehingga saya tidak perlu mengetik slug secara manual setiap saat.

#### Acceptance Criteria

1. WHEN admin mengetik judul artikel baru, THE Blog_Editor SHALL secara otomatis mengisi field slug berdasarkan judul yang diketik.
2. THE Blog_Editor SHALL mengkonversi judul menjadi slug dengan aturan: huruf kecil semua, spasi diganti tanda hubung, karakter non-alphanumeric dihapus.
3. WHEN admin sedang mengedit artikel yang sudah ada, THE Blog_Editor SHALL tidak mengubah slug secara otomatis saat judul diubah.
4. THE Blog_Editor SHALL mengizinkan admin mengedit slug secara manual kapan saja, termasuk saat mengedit artikel yang sudah ada.
5. THE Blog_Editor SHALL menampilkan preview URL lengkap artikel berdasarkan slug yang diisi (contoh: `/blog/nama-slug`).
