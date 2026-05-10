import type { Metadata } from "next";
import CustomOrderClient from "./CustomOrderClient";

export const metadata: Metadata = {
  title: "Custom Order | Pakarsheet",
  description:
    "Pesan template Google Sheets custom sesuai kebutuhan bisnis kamu. Pilih paket Basic, Pro, atau Enterprise — kami bangun dari nol, deliver dalam hitungan hari.",
  openGraph: {
    title: "Custom Order | Pakarsheet",
    description:
      "Template Google Sheets custom sesuai bisnis kamu. Mulai dari Rp 299rb.",
    url: "https://pakarsheet.com/custom",
    siteName: "Pakarsheet",
    locale: "id_ID",
    type: "website",
  },
};

export default function CustomOrderPage() {
  return <CustomOrderClient />;
}
