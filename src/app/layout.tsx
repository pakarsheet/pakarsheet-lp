import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fallback metadata used when Supabase is not configured or settings are empty
const FALLBACK_META = {
  title: "Pakarsheet - Template Google Sheets Bebas Ribet untuk Bisnis",
  description:
    "Ubah cara kerjamu hari ini. Template Google Sheets custom dengan otomasi Apps Script, UI cantik, dan sistem anti-ribet.",
};

// Fetch site settings server-side so metadata is dynamic and SEO-effective.
// Cached for 1 hour and tagged so it can be revalidated on-demand from admin.
const getSiteSettings = unstable_cache(
  async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    try {
      const client = createClient(url, key);
      const { data } = await client.from("site_settings").select("*").single();
      return data ?? null;
    } catch {
      return null;
    }
  },
  ["site_settings"],
  { revalidate: 3600, tags: ["site_settings"] }
);

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const title = settings?.metaTitle || FALLBACK_META.title;
  const description = settings?.metaDescription || FALLBACK_META.description;
  const faviconUrl: string | undefined = settings?.faviconUrl || undefined;
  const ogImage: string | undefined = settings?.logoUrl || undefined;

  return {
    metadataBase: new URL("https://pakarsheet.com"),
    title,
    description,
    keywords: settings?.metaKeywords || undefined,
    // Override the file-convention favicon.ico when admin configured one.
    icons: faviconUrl
      ? {
          icon: [{ url: faviconUrl }],
          shortcut: [{ url: faviconUrl }],
          apple: [{ url: faviconUrl }],
        }
      : undefined,
    openGraph: {
      title,
      description,
      url: "https://pakarsheet.com",
      siteName: settings?.brandName || "Pakarsheet",
      locale: "id_ID",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

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
