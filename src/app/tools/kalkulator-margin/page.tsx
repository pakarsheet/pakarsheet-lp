import type { Metadata } from "next";
import MarginCalculator from "./MarginCalculator";

export const metadata: Metadata = {
  title: "Kalkulator Margin Keuntungan Online | Pakarsheet",
  description:
    "Hitung margin keuntungan, profit per unit, dan break-even point bisnis kamu secara instan. Gratis, tanpa daftar.",
  alternates: { canonical: "https://pakarsheet.com/tools/kalkulator-margin" },
};

export default function MarginPage() {
  return <MarginCalculator />;
}
