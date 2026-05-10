"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { SiteSettings } from "./useData";

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
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
    fetchSettings();
  }, [fetchSettings]);

  // Derived convenience value used by CustomOrderClient
  const waUrl = settings?.whatsappNumber
    ? `https://wa.me/62${settings.whatsappNumber}`
    : "https://wa.me/6281234567890";

  return { settings, isLoading, refresh: fetchSettings, waUrl };
}
