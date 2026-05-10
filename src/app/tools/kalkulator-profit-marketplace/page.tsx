import type { Metadata } from "next";
import ProfitMarketplaceCalculator from "./ProfitMarketplaceCalculator";

export const metadata: Metadata = {
  title: "Kalkulator Profit Marketplace | Pakarsheet",
  description:
    "Hitung profit bersih jualan marketplace setelah HPP, fee platform, voucher seller, subsidi ongkir, packaging, biaya iklan, dan biaya admin.",
  alternates: { canonical: "https://pakarsheet.com/tools/kalkulator-profit-marketplace" },
};

export default function ProfitMarketplacePage() {
  return <ProfitMarketplaceCalculator />;
}
