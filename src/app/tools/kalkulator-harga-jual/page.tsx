import type { Metadata } from "next";
import HargaJualCalculator from "./HargaJualCalculator";

export const metadata: Metadata = {
  title: "Kalkulator Harga Jual Marketplace | Pakarsheet",
  description:
    "Hitung harga jual minimum di Shopee, Tokopedia, dan TikTok Shop setelah fee platform, ongkir, dan pajak.",
  alternates: { canonical: "https://pakarsheet.com/tools/kalkulator-harga-jual" },
};

export default function HargaJualPage() {
  return <HargaJualCalculator />;
}
