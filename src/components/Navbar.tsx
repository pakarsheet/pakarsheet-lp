"use client"

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // All hooks MUST be called before any conditional returns
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Conditional return AFTER all hooks
  if (pathname.startsWith('/admin')) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 pointer-events-none">
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <div className="container mx-auto max-w-3xl pointer-events-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`mx-auto rounded-full border transition-all duration-300 backdrop-blur-2xl flex items-center justify-between ${
            scrolled ? 'bg-black/80 border-white/10 px-5 py-2.5' : 'bg-white/[0.03] border-white/5 px-7 py-3.5'
          }`}
        >
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 rounded-[2px] bg-black"></div>
                <div className="w-2 h-2 rounded-[2px] bg-green-500"></div>
                <div className="w-2 h-2 rounded-[2px] bg-black"></div>
                <div className="w-2 h-2 rounded-[2px] bg-black"></div>
              </div>
            </div>
            <span className="font-semibold text-base tracking-tight text-white/90">
              Pakarsheet
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400 tracking-tight">
            <Link href="/#fitur" className="hover:text-white transition-colors">Fitur</Link>
            <Link href="/#testimoni" className="hover:text-white transition-colors">Testimoni</Link>
            <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/shop" className="hover:text-white transition-colors">Toko</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              className="hidden md:block bg-white text-black px-6 py-2.5 rounded-xl text-sm font-semibold tracking-tight hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5"
            >
              Lihat Template
            </Link>

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-white/70 p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-90"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden absolute top-24 left-4 right-4 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 flex flex-col gap-6 shadow-2xl pointer-events-auto z-[1001]"
          >
            <Link href="/#fitur" onClick={() => setIsOpen(false)} className="text-xl font-medium text-white/90 border-b border-white/5 pb-4 tracking-tight">Fitur</Link>
            <Link href="/#testimoni" onClick={() => setIsOpen(false)} className="text-xl font-medium text-white/90 border-b border-white/5 pb-4 tracking-tight">Testimoni</Link>
            <Link href="/#faq" onClick={() => setIsOpen(false)} className="text-xl font-medium text-white/90 border-b border-white/5 pb-4 tracking-tight">FAQ</Link>
            <Link href="/shop" onClick={() => setIsOpen(false)} className="text-xl font-medium text-white/90 border-b border-white/5 pb-4 tracking-tight">Toko</Link>
            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className="bg-white text-black py-5 rounded-2xl text-lg font-semibold text-center active:scale-95 transition-all mt-4 tracking-tight"
            >
              Lihat Semua Template
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
