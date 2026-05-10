import { Reveal } from "@/components/Reveal";
import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-32 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <Reveal>
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mb-8 mx-auto border border-red-500/20">
          <FileQuestion className="text-red-400" size={40} />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-white/90 tracking-tight">404 - Halaman hilang</h1>
        <p className="text-neutral-400 text-lg max-w-md mx-auto mb-10 font-normal">
          Waduh! Sepertinya rumus spreadsheet kamu salah ketik. Halaman yang kamu cari nggak ada di sini.
        </p>

        <Link 
          href="/" 
          className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 tracking-tight"
        >
          <Home size={18} /> Balik ke beranda
        </Link>
      </Reveal>
    </div>
  );
}
