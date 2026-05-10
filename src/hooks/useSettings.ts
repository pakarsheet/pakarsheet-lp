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

// Fallback defaults — GANTI dengan nilai asli kamu sebelum deploy
// Nilai ini dipakai saat Supabase belum dikonfigurasi atau settings belum diisi
const DEFAULTS: SiteSettings = {
  id: "main",
  whatsappNumber: "", // Isi di Supabase: Settings tab → Nomor WhatsApp
  mainLynkUrl: "",    // Isi di Supabase: Settings tab → Main Lynk.id URL
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

  const waUrl = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`
    : "#";

  return { settings, isLoading, waUrl };
}
