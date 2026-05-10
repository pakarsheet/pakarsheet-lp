"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/hooks/useSettings";
import { MessageCircle, Mail, ArrowUpRight, FileText, ShieldCheck } from "lucide-react";

const navLinks = [
  { label: "Fitur", href: "/#fitur" },
  { label: "Blog", href: "/blog" },
  { label: "Tools Gratis", href: "/tools" },
  { label: "Custom Order", href: "/custom" },
  { label: "Academy", href: "/academy" },
  { label: "Toko", href: "/shop" },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms", icon: FileText },
  { label: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
];

export function Footer() {
  const pathname = usePathname();
  const { waUrl } = useSettings();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="border-t border-white/5 bg-[#050505]">

      {/* ── Main Footer Body ── */}
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Brand Column — takes more space */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-2 h-2 rounded-[2px] bg-black" />
                  <div className="w-2 h-2 rounded-[2px] bg-green-500" />
                  <div className="w-2 h-2 rounded-[2px] bg-black" />
                  <div className="w-2 h-2 rounded-[2px] bg-black" />
                </div>
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Pakarsheet
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Template Google Sheets premium dengan otomasi Apps Script. Dibuat untuk marketer dan pebisnis yang ingin kerja lebih cepat tanpa ribet.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors px-5 py-2.5 rounded-xl text-sm font-medium"
                >
                  <MessageCircle size={16} />
                  Chat WhatsApp
                </a>
              )}
              <a
                href="mailto:halo@pakarsheet.com"
                className="inline-flex items-center justify-center gap-2 bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10 hover:text-white transition-colors px-5 py-2.5 rounded-xl text-sm font-medium"
              >
                <Mail size={16} />
                halo@pakarsheet.com
              </a>
            </div>
          </div>

          {/* Spacer on desktop */}
          <div className="hidden md:block md:col-span-1" />

          {/* Nav Column */}
          <div className="md:col-span-3">
            <h4 className="text-white text-sm font-semibold mb-5 tracking-tight">
              Navigasi
            </h4>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 text-sm hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    {link.label}
                    {link.href === "/shop" && (
                      <ArrowUpRight
                        size={13}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-3">
            <h4 className="text-white text-sm font-semibold mb-5 tracking-tight">
              Legal
            </h4>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 text-sm hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <link.icon size={14} className="text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Badge */}
            <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
              <span className="text-[11px] text-neutral-500 font-medium">Semua sistem aktif</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-neutral-600 text-center sm:text-left">
              © {new Date().getFullYear()} Pakarsheet Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
                Terms
              </Link>
              <span className="text-neutral-800">·</span>
              <Link href="/privacy" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
                Privacy
              </Link>
              <span className="text-neutral-800">·</span>
              <span className="text-xs text-neutral-600">
                Made with ☕ in Indonesia
              </span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
