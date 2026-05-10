import type { Metadata } from "next";
import RoasCalculator from "./RoasCalculator";

export const metadata: Metadata = {
  title: "Kalkulator ROAS Iklan | Pakarsheet",
  description:
    "Hitung Return on Ad Spend (ROAS), cost per acquisition, dan apakah iklan Meta/TikTok/Google kamu profitable.",
  alternates: { canonical: "https://pakarsheet.com/tools/kalkulator-roas" },
};

export default function RoasPage() {
  return <RoasCalculator />;
}
