import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pembelian Berhasil | Pakarsheet",
  description: "Terima kasih telah membeli template Pakarsheet. Cek email kamu untuk link akses template.",
  robots: { index: false, follow: false }, // don't index thank-you pages
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
