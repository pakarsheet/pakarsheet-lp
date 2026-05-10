"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ToolLayoutProps {
  title: string;
  description: string;
  relatedProduct?: { name: string; href: string };
  children: React.ReactNode;
}

// ── Shared input style ─────────────────────────────────────────────────────────
export const inputCls =
  "flex-1 bg-transparent text-base text-white focus:outline-none placeholder:text-neutral-700 min-w-0";

export const inputWrapCls =
  "flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 focus-within:border-white/30 focus-within:bg-white/[0.07] transition-all";

export const labelCls =
  "block text-sm font-semibold text-neutral-400 mb-2";

export const hintCls =
  "text-xs text-neutral-600 mt-2 leading-relaxed";

// ── Result card ────────────────────────────────────────────────────────────────
export function ResultCard({
  label,
  value,
  sub,
  highlight,
  color = "neutral",
  large,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  color?: "neutral" | "green" | "red" | "yellow" | "blue";
  large?: boolean;
}) {
  const borderBg: Record<string, string> = {
    neutral: "border-white/8 bg-white/[0.03]",
    green: "border-green-500/25 bg-green-500/[0.06]",
    red: "border-red-500/25 bg-red-500/[0.06]",
    yellow: "border-yellow-500/25 bg-yellow-500/[0.06]",
    blue: "border-blue-500/25 bg-blue-500/[0.06]",
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border ${borderBg[color]} ${highlight ? "ring-1 ring-white/10" : ""}`}>
      <p className="text-xs sm:text-sm text-neutral-500 mb-1.5 sm:mb-2 font-medium">{label}</p>
      <p className={`font-bold text-white tracking-tight tabular-nums break-words ${large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>{value}</p>
      {sub && <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">{sub}</p>}
    </div>
  );
}

// ── Field wrapper ──────────────────────────────────────────────────────────────
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className={hintCls}>{hint}</p>}
    </div>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
  if (!label) return <div className="border-t border-white/5 my-8" />;
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 border-t border-white/5" />
      <span className="text-xs font-semibold text-neutral-600 uppercase tracking-widest">{label}</span>
      <div className="flex-1 border-t border-white/5" />
    </div>
  );
}

// ── Main layout ────────────────────────────────────────────────────────────────
export function ToolLayout({ title, description, relatedProduct, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">

        {/* Back nav */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors mb-6 sm:mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Semua Tools
        </Link>

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-[28px] sm:text-3xl md:text-5xl font-semibold text-white/90 tracking-tight mb-3 sm:mb-4 leading-[1.15]">
            {title}
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">{description}</p>
        </div>

        {/* Tool content */}
        <div className="rounded-[24px] sm:rounded-[32px] border border-white/8 bg-[#0a0a0a] p-5 sm:p-7 md:p-10 mb-6 sm:mb-8">
          {children}
        </div>

        {/* Related product CTA */}
        {relatedProduct && (
          <div className="rounded-[20px] sm:rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-neutral-600 mb-1.5 font-medium uppercase tracking-wider">Mau tracking ini otomatis?</p>
              <p className="text-base font-semibold text-white/80">{relatedProduct.name}</p>
            </div>
            <Link
              href={relatedProduct.href}
              className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-bold px-5 py-3 rounded-xl hover:bg-neutral-100 transition-colors active:scale-[0.98]"
            >
              Lihat <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
