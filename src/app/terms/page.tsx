import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Pakarsheet",
  description: "Syarat dan ketentuan penggunaan template Pakarsheet. Lisensi, pembayaran, tanggung jawab, dan kebijakan update.",
};

import { Reveal } from "@/components/Reveal";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-32">
      <Reveal>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium mb-8 text-white">Syarat & Ketentuan</h1>
          <div className="prose prose-invert prose-neutral max-w-none space-y-6 text-neutral-400">
            <p className="font-normal">Terakhir diperbarui: 10 Mei 2025</p>
            
            <section className="space-y-4 font-normal">
              <h2 className="text-2xl font-medium text-white">1. Lisensi Penggunaan</h2>
              <p>
                Dengan membeli Pakarsheet, Anda diberikan lisensi non-eksklusif untuk menggunakan template ini untuk keperluan pribadi atau bisnis Anda. Anda dilarang keras untuk menjual kembali, mendistribusikan secara gratis, atau membagikan akses file kepada pihak lain tanpa izin tertulis dari kami.
              </p>
            </section>

            <section className="space-y-4 font-normal">
              <h2 className="text-2xl font-medium text-white">2. Pembelian dan Pembayaran</h2>
              <p>
                Semua penjualan produk digital bersifat final. Karena sifat produk yang dapat langsung diakses setelah pembelian, kami tidak melayani permintaan pengembalian dana (refund) kecuali terjadi kesalahan teknis yang tidak dapat kami perbaiki dalam waktu 7x24 jam.
              </p>
            </section>

            <section className="space-y-4 font-normal">
              <h2 className="text-2xl font-medium text-white">3. Tanggung Jawab</h2>
              <p>
                Kami berusaha memberikan template terbaik, namun kami tidak bertanggung jawab atas kerugian finansial atau kesalahan data yang mungkin timbul akibat penggunaan template ini. Anda bertanggung jawab penuh atas validasi data input Anda sendiri.
              </p>
            </section>

            <section className="space-y-4 font-normal">
              <h2 className="text-2xl font-medium text-white">4. Pembaruan (Update)</h2>
              <p>
                Pembeli berhak mendapatkan update template secara gratis jika terdapat perbaikan bug atau penyesuaian minor pada sistem Google Sheets/Apps Script di masa mendatang.
              </p>
            </section>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
