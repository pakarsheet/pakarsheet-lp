import type { Metadata } from "next";
import ToolsClient from "./ToolsClient";

export const metadata: Metadata = {
  title: "Tools Gratis untuk Bisnis | Pakarsheet",
  description:
    "Kalkulator bisnis gratis: margin keuntungan, HPP, ROAS iklan, harga jual marketplace. Langsung pakai, tanpa daftar.",
  openGraph: {
    title: "Tools Gratis untuk Bisnis | Pakarsheet",
    description: "Kalkulator bisnis gratis untuk UMKM dan marketer Indonesia.",
    url: "https://pakarsheet.com/tools",
    siteName: "Pakarsheet",
    locale: "id_ID",
    type: "website",
  },
};

export default function ToolsPage() {
  return <ToolsClient />;
}
