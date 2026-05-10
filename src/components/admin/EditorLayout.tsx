"use client";

import Link from "next/link";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

// ── Shared style tokens ────────────────────────────────────────────────────────
export const inputCls =
  "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors";
export const labelCls =
  "block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2";

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
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-neutral-600 mt-1.5">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5">
          <AlertCircle size={11} /> {error}
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
      className={`flex items-center gap-2 bg-white text-black text-sm font-bold px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
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
    <div className={`bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 space-y-5 ${className}`}>
      {title && (
        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
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
    <div className="sticky top-0 z-40 bg-[#080808]/90 backdrop-blur-xl border-b border-white/8">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href={backHref}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors group flex-shrink-0"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="text-sm hidden sm:block">{backLabel}</span>
          </Link>
          <div className="w-px h-4 bg-white/10 flex-shrink-0" />
          <h1 className="text-sm font-semibold text-white truncate">{title}</h1>
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
      className="max-w-7xl mx-auto px-5 md:px-8 py-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="space-y-6 min-w-0">{left}</div>
        <div className="space-y-5 lg:sticky lg:top-[72px]">{right}</div>
      </div>
    </motion.div>
  );
}
