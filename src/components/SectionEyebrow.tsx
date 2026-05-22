import type { LucideIcon } from "lucide-react";

/**
 * Shared eyebrow/kicker label that sits above section H2 headings.
 * Pill-shaped with icon + uppercase label for a consistent anchor across the landing page.
 */
export function SectionEyebrow({
  icon: Icon,
  label,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium tracking-[0.18em] uppercase text-white/60 ${className}`}
    >
      <Icon size={12} strokeWidth={2.2} className="text-white/55" />
      <span>{label}</span>
    </span>
  );
}
