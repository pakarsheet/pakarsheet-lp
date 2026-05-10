import { Reveal } from "@/components/Reveal";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-32">
      <Reveal>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium mb-8 text-white">Kebijakan Privasi</h1>
          <div className="prose prose-invert prose-neutral max-w-none space-y-6 text-neutral-400">
            <p className="font-normal">Terakhir diperbarui: 10 Mei 2026</p>
            
            <section className="space-y-4 font-normal">
              <h2 className="text-2xl font-medium text-white">1. Informasi yang Kami Kumpulkan</h2>
              <p>
                Kami mengumpulkan informasi yang Anda berikan langsung kepada kami saat melakukan pembelian, termasuk nama, alamat email, dan informasi kontak lainnya yang diperlukan untuk pengiriman produk digital.
              </p>
            </section>

            <section className="space-y-4 font-normal">
              <h2 className="text-2xl font-medium text-white">2. Penggunaan Informasi</h2>
              <p>
                Informasi yang kami kumpulkan digunakan untuk:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Memproses transaksi dan mengirimkan akses produk.</li>
                <li>Memberikan dukungan teknis dan layanan purna jual.</li>
                <li>Mengirimkan informasi pembaruan produk (update).</li>
              </ul>
            </section>

            <section className="space-y-4 font-normal">
              <h2 className="text-2xl font-medium text-white">3. Keamanan Data</h2>
              <p>
                Kami mengimplementasikan langkah-langkah keamanan teknis untuk melindungi data pribadi Anda. Kami tidak akan pernah menjual atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa izin Anda.
              </p>
            </section>

            <section className="space-y-4 font-normal">
              <h2 className="text-2xl font-medium text-white">4. Cookies</h2>
              <p>
                Website kami menggunakan cookies untuk meningkatkan pengalaman pengguna dan menganalisis trafik website guna perbaikan layanan di masa mendatang.
              </p>
            </section>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
