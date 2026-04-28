"use client"

import { motion } from "framer-motion";

const snippets = [
  { text: "[ 200 OK ]", top: "15%", left: "10%", delay: 0 },
  { text: "[ .XLSX ]", top: "25%", left: "85%", delay: 1.5 },
  { text: "sheet.appendRow()", top: "60%", left: "5%", delay: 0.5 },
  { text: "script.run()", top: "75%", left: "80%", delay: 2 },
  { text: "[ AUTO ]", top: "40%", left: "15%", delay: 1 },
  { text: "{ status: 'success' }", top: "20%", left: "70%", delay: 0.8 },
  { text: "import { pakar }", top: "85%", left: "20%", delay: 2.5 },
  { text: "fetch(data...)", top: "10%", left: "40%", delay: 1.2 },
];

export function CodeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.07] select-none">
      
      {/* Floating Code Snippets */}
      {snippets.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            y: [-10, -20, -30, -40],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut"
          }}
          style={{ position: 'absolute', top: s.top, left: s.left }}
          className="text-[9px] md:text-[10px] font-mono text-neutral-400 whitespace-nowrap bg-white/[0.01] border border-white/5 px-2 py-1 rounded backdrop-blur-sm"
        >
          {s.text}
        </motion.div>
      ))}
    </div>
  );
}
