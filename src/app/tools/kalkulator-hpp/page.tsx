import type { Metadata } from "next";
import HppCalculator from "./HppCalculator";

export const metadata: Metadata = {
  title: "Kalkulator HPP (Harga Pokok Produksi) | Pakarsheet",
  description:
    "Hitung HPP dari bahan baku, tenaga kerja, dan overhead. Tentukan harga jual minimum yang menguntungkan.",
  alternates: { canonical: "https://pakarsheet.com/tools/kalkulator-hpp" },
};

export default function HppPage() {
  return <HppCalculator />;
}
