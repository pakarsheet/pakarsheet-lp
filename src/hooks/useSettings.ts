"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  id: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  whatsappNumber?: string;
  mainLynkUrl?: string;
};

// Fallback defaults — update these to your real values
const DEFAULTS: SiteSettings = {
  id: "main",
  whatsappNumber: "6281234567890",
  mainLynkUrl: "https://lynk.id/pakarsheet",
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await supabase.from("site_settings").select("*").single();
        if (data) {
          setSettings({ ...DEFAULTS, ...data });
        }
      } catch {
        // silently fall back to defaults
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const waUrl = `https://wa.me/${(settings.whatsappNumber || DEFAULTS.whatsappNumber)?.replace(/\D/g, "")}`;

  return { settings, isLoading, waUrl };
}
