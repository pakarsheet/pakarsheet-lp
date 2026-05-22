"use client";

import Link from "next/link";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

// ── Shared style tokens ────────────────────────────────────────────────────────
// Larger, more readable inputs for admin editors
export const inputCls =
  "w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-base text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all";

export const labelCls =
  "block text-sm font-semibold text-neutral-400 mb-2.5";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0">
      <label className={labelCls}>{label}</label>
      {children}
      {hint && !error && (
        <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{hint}</p>
      )}
      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-400 mt-2">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}

export function SaveButton({
  loading,
  success,
  label,
  className = "",
}: {
  loading: boolean;
  success: boolean;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`flex items-center gap-2 bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <>
          <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          Menyimpan...
        </>
      ) : success ? (
        <>
          <Check size={15} />
          Tersimpan!
        </>
      ) : (
        label
      )}
    </button>
  );
}

export function SectionCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[#0d0d0d] border border-white/8 rounded-2xl p-7 space-y-6 ${className}`}>
      {title && (
        <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

// ── Top nav bar for editor pages ───────────────────────────────────────────────
export function EditorTopBar({
  backHref,
  backLabel,
  title,
  actions,
}: {
  backHref: string;
  backLabel: string;
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-white/8">
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={backHref}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors group flex-shrink-0"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="text-sm font-medium hidden sm:block">{backLabel}</span>
          </Link>
          <div className="w-px h-5 bg-white/10 flex-shrink-0" />
          <h1 className="text-base font-semibold text-white truncate">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

// ── Two-column editor layout ───────────────────────────────────────────────────
export function TwoColumnEditor({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto px-5 md:px-10 py-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-7 min-w-0">{left}</div>
        <div className="space-y-6 lg:sticky lg:top-[72px]">{right}</div>
      </div>
    </motion.div>
  );
}
