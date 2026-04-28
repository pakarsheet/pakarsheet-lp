"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="border-t border-white/5 bg-[#050505] py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-2 h-2 rounded-[2px] bg-black"></div>
                  <div className="w-2 h-2 rounded-[2px] bg-green-500"></div>
                  <div className="w-2 h-2 rounded-[2px] bg-black"></div>
                  <div className="w-2 h-2 rounded-[2px] bg-black"></div>
                </div>
              </div>
              <span className="font-semibold text-xl tracking-tight text-white/90">
                Pakarsheet
              </span>
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed font-normal">
              Solusi otomasi Google Sheets premium untuk marketer dan pebisnis yang benci input data manual.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <h4 className="text-white/40 text-[11px] font-semibold tracking-tight">Navigasi</h4>
              <Link href="#fitur" className="text-neutral-500 text-sm hover:text-white transition-colors">Fitur</Link>
              <Link href="#testimoni" className="text-neutral-500 text-sm hover:text-white transition-colors">Testimoni</Link>
              <Link href="#faq" className="text-neutral-500 text-sm hover:text-white transition-colors">FAQ</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white/40 text-[11px] font-semibold tracking-tight">Legal</h4>
              <Link href="/terms" className="text-neutral-500 text-sm hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="text-neutral-500 text-sm hover:text-white transition-colors">Privacy</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white/40 text-[11px] font-semibold tracking-tight">Bantuan</h4>
              <Link href="https://wa.me/6281234567890" target="_blank" className="text-neutral-500 text-sm hover:text-white transition-colors">WhatsApp</Link>
              <Link href="mailto:halo@pakarsheet.com" className="text-neutral-500 text-sm hover:text-white transition-colors">Email</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[11px] text-neutral-600 font-medium tracking-tight">
            © {new Date().getFullYear()} Pakarsheet Studio. All rights reserved.
          </div>
          <div className="text-[11px] text-neutral-600 font-medium tracking-tight flex items-center gap-2">
            Built for <span className="text-neutral-400">Marketers</span> by <span className="text-neutral-400">Experts</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
