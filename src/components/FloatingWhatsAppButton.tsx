"use client";

import { MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export function FloatingWhatsAppButton() {
  const { waUrl, isLoading } = useSettings();

  if (isLoading || !waUrl) return null;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp Pakarsheet"
      className="fixed bottom-5 right-5 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full border border-green-400/25 bg-green-500 text-white shadow-[0_12px_35px_rgba(34,197,94,0.35)] transition-all hover:-translate-y-0.5 hover:bg-green-400 hover:shadow-[0_16px_42px_rgba(34,197,94,0.45)] focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-[#050505] md:bottom-7 md:right-7 md:h-auto md:w-auto md:gap-2 md:rounded-full md:px-5 md:py-3"
    >
      <MessageCircle size={22} className="flex-shrink-0" />
      <span className="hidden text-sm font-bold tracking-tight md:inline">
        WhatsApp
      </span>
    </a>
  );
}
