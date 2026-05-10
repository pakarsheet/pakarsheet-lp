import type { Metadata } from "next";
import DiskonBertingkatCalculator from "./DiskonBertingkatCalculator";

export const metadata: Metadata = {
  title: "Kalkulator Diskon Bertingkat | Pakarsheet",
  description:
    "Hitung harga akhir setelah diskon bertingkat, voucher, cashback, ongkir, dan biaya tambahan. Cocok untuk belanja online dan promo marketplace.",
  alternates: { canonical: "https://pakarsheet.com/tools/kalkulator-diskon-bertingkat" },
};

export default function DiskonBertingkatPage() {
  return <DiskonBertingkatCalculator />;
}
