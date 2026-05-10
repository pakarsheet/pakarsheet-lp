"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { SiteSettings } from "./useData";

function buildWhatsAppUrl(value?: string | null): string {
  const digits = value?.replace(/\D/g, "") ?? "";
  if (!digits) return "https://wa.me/6281234567890";
  if (digits.startsWith("62")) return `https://wa.me/${digits}`;
  if (digits.startsWith("0")) return `https://wa.me/62${digits.slice(1)}`;
  return `https://wa.me/62${digits}`;
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);

    if (!supabase) {
      const stored = localStorage.getItem("pakarsheet_settings");
      if (stored) {
        try { setSettings(JSON.parse(stored)); } catch { /* ignore */ }
      }
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .single();
      setSettings(data ?? null);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void fetchSettings());
  }, [fetchSettings]);

  // Derived convenience value used by CustomOrderClient
  const waUrl = buildWhatsAppUrl(settings?.whatsappNumber);

  return { settings, isLoading, refresh: fetchSettings, waUrl };
}
