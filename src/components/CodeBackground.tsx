"use client"

// Static positions — no JS animation loop, pure CSS keyframes
// This avoids 8 concurrent Framer Motion infinite loops on the main thread
const snippets = [
  { text: "[ 200 OK ]",           top: "15%", left: "10%", duration: "18s", delay: "0s"   },
  { text: "[ .XLSX ]",            top: "25%", left: "85%", duration: "22s", delay: "3s"   },
  { text: "sheet.appendRow()",    top: "60%", left: "5%",  duration: "20s", delay: "1s"   },
  { text: "script.run()",         top: "75%", left: "80%", duration: "25s", delay: "5s"   },
  { text: "[ AUTO ]",             top: "40%", left: "15%", duration: "19s", delay: "2s"   },
  { text: "{ status: 'ok' }",     top: "20%", left: "70%", duration: "23s", delay: "4s"   },
  { text: "import { pakar }",     top: "85%", left: "20%", duration: "21s", delay: "6s"   },
  { text: "fetch(data...)",       top: "10%", left: "40%", duration: "17s", delay: "1.5s" },
];

export function CodeBackground() {
  return (
    <>
      {/* CSS keyframe injected once */}
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 0; transform: translateY(0px); }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-50px); }
        }
        .code-snippet {
          animation-name: floatUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.07] select-none">
        {snippets.map((s, i) => (
          <div
            key={i}
            className="code-snippet absolute text-[9px] md:text-[10px] font-mono text-neutral-400 whitespace-nowrap bg-white/[0.01] border border-white/5 px-2 py-1 rounded"
            style={{
              top: s.top,
              left: s.left,
              animationDuration: s.duration,
              animationDelay: s.delay,
            }}
          >
            {s.text}
          </div>
        ))}
      </div>
    </>
  );
}
