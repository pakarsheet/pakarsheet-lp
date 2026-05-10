import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { BookOpen, Video, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Academy | Pakarsheet",
  description:
    "Panduan lengkap cara pakai template Pakarsheet. Tutorial video dan artikel untuk memaksimalkan otomasi Google Sheets kamu.",
  openGraph: {
    title: "Academy | Pakarsheet",
    description: "Panduan lengkap cara pakai template Pakarsheet.",
    url: "https://pakarsheet.com/academy",
    siteName: "Pakarsheet",
    locale: "id_ID",
    type: "website",
  },
};

type Tutorial = {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  category: string;
  createdAt: number;
};

async function getTutorials(): Promise<Tutorial[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const client = createClient(url, key);
    const { data } = await client
      .from("tutorials")
      .select("*")
      .order("createdAt", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  Keuangan: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Marketing: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Inventory: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "HR & Admin": "bg-green-500/10 text-green-400 border-green-500/20",
  Lainnya: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
};

export default async function AcademyPage() {
  const tutorials = await getTutorials();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-16 text-center">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">
          Academy
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]">
          Panduan & Tutorial
        </h1>
        <p className="text-neutral-400 text-lg leading-relaxed max-w-xl mx-auto">
          Semua yang kamu butuhkan untuk memaksimalkan template Pakarsheet — dari setup awal sampai fitur lanjutan.
        </p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 pb-24">
        {tutorials.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-24 border border-dashed border-white/8 rounded-[32px]">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={22} className="text-neutral-600" />
            </div>
            <p className="text-neutral-500 text-sm mb-2">Tutorial belum tersedia.</p>
            <p className="text-neutral-600 text-xs">
              Cek kembali nanti atau{" "}
              <Link href="/#request" className="text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors">
                hubungi kami
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {tutorials.map((t) => (
              <div
                key={t.id}
                className="p-7 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 flex flex-col gap-4"
              >
                {/* Icon + category */}
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/8 flex items-center justify-center">
                    {t.videoUrl ? (
                      <Video size={16} className="text-white/40" />
                    ) : (
                      <BookOpen size={16} className="text-white/40" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                      CATEGORY_COLORS[t.category] ?? CATEGORY_COLORS["Lainnya"]
                    }`}
                  >
                    {t.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-white/90 tracking-tight leading-snug">
                  {t.title}
                </h3>

                {/* Content preview */}
                <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 flex-1">
                  {t.content.replace(/#+\s/g, "").replace(/\*\*/g, "")}
                </p>

                {/* Video link */}
                {t.videoUrl && (
                  <a
                    href={t.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mt-auto"
                  >
                    <ExternalLink size={12} />
                    Tonton video tutorial
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
