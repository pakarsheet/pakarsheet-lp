import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Toko Template | Pakarsheet",
  description: "Temukan koleksi template Google Sheets premium dengan otomasi Apps Script. Filter berdasarkan kategori: Keuangan, Marketing, Inventory, HR & Admin.",
  openGraph: {
    title: "Toko Template | Pakarsheet",
    description: "Koleksi template Google Sheets premium yang siap pakai untuk berbagai kebutuhan bisnis.",
    url: "https://pakarsheet.com/shop",
    siteName: "Pakarsheet",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toko Template | Pakarsheet",
    description: "Koleksi template Google Sheets premium yang siap pakai untuk berbagai kebutuhan bisnis.",
  },
};

export default function ShopPage() {
  return <ShopClient />;
}
