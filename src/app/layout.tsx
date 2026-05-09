import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pakarsheet.com'),
  title: "Pakarsheet - Template Google Sheets Bebas Ribet untuk Bisnis",
  description: "Ubah cara kerjamu hari ini. Template Google Sheets custom dengan otomasi Apps Script, UI cantik, dan sistem anti-ribet.",
  openGraph: {
    title: "Pakarsheet - Template Google Sheets Bebas Ribet untuk Bisnis",
    description: "Ubah cara kerjamu hari ini. Template Google Sheets custom dengan otomasi Apps Script, UI cantik, dan sistem anti-ribet.",
    url: "https://pakarsheet.com",
    siteName: "Pakarsheet",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pakarsheet - Template Google Sheets Bebas Ribet untuk Bisnis",
    description: "Ubah cara kerjamu hari ini. Template Google Sheets custom dengan otomasi Apps Script, UI cantik, dan sistem anti-ribet.",
  },
};

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-white/20">
        <SmoothScroll>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
