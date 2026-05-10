"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ToolLayoutProps {
  title: string;
  description: string;
  relatedProduct?: { name: string; href: string };
  children: React.ReactNode;
}

export function ToolLayout({ title, description, relatedProduct, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-600 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-neutral-500 truncate">{title}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-white transition-colors mb-5">
            <ArrowLeft size={12} /> Semua Tools
          </Link>
          <h1 className="text-3xl md:text-4xl font-semibold text-white/90 tracking-tight mb-3">{title}</h1>
          <p className="text-neutral-400 leading-relaxed">{description}</p>
        </div>

        {/* Tool content */}
        <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-7 md:p-9 mb-8">
          {children}
        </div>

        {/* Related product CTA */}
        {relatedProduct && (
          <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-neutral-600 mb-1">Mau tracking ini otomatis?</p>
              <p className="text-sm font-semibold text-white/80">{relatedProduct.name}</p>
            </div>
            <Link
              href={relatedProduct.href}
              className="flex-shrink-0 flex items-center gap-1.5 bg-white text-black text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              Lihat Template <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
