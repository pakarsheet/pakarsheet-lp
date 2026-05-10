"use client"

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  Database, FileSpreadsheet, Users,
  LayoutDashboard, Zap, ShieldCheck,
  Cpu, Network,
} from "lucide-react";
import { SectionEyebrow } from "./SectionEyebrow";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NodeDef {
  id: string;
  label: string;
  sub: string;
  icon: React.ElementType;
  col: "left" | "center" | "right";
  accent?: string;
}

// ─── Node definitions ─────────────────────────────────────────────────────────
const LEFT_NODES: NodeDef[] = [
  { id: "data",  label: "Data Bisnis",  sub: "Google Sheets",  icon: Database,        col: "left" },
  { id: "form",  label: "Form Input",   sub: "Google Forms",   icon: FileSpreadsheet, col: "left" },
  { id: "users", label: "Tim Kamu",     sub: "Multi-user",     icon: Users,           col: "left" },
];

const RIGHT_NODES: NodeDef[] = [
  { id: "dashboard", label: "Dashboard Otomatis", sub: "Update real-time",   icon: LayoutDashboard, col: "right", accent: "text-blue-400"   },
  { id: "script",    label: "Apps Script",        sub: "Proses tanpa klik",  icon: Zap,             col: "right", accent: "text-amber-400"  },
  { id: "protect",   label: "Sistem Lisensi",     sub: "Proteksi file kamu", icon: ShieldCheck,     col: "right", accent: "text-green-400"  },
];

const CENTER_NODE: NodeDef = {
  id: "engine", label: "Pakarsheet", sub: "Processing", icon: Cpu, col: "center",
};

// ─── Traveling dot ────────────────────────────────────────────────────────────
function TravelDot({ x1, y1, x2, y2, delay, color = "white" }: {
  x1: number; y1: number; x2: number; y2: number; delay: number; color?: string;
}) {
  const [pos, setPos] = useState({ x: x1, y: y1 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loop = async () => {
      while (!cancelled) {
        await new Promise(r => setTimeout(r, delay * 1000 + Math.random() * 800));
        if (cancelled) break;
        setVisible(true);
        const start = performance.now();
        const dur = 700 + Math.random() * 400;
        await new Promise<void>(resolve => {
          const tick = (now: number) => {
            const t = Math.min((now - start) / dur, 1);
            const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            setPos({ x: x1 + (x2 - x1) * ease, y: y1 + (y2 - y1) * ease });
            if (t < 1 && !cancelled) requestAnimationFrame(tick);
            else resolve();
          };
          requestAnimationFrame(tick);
        });
        if (cancelled) break;
        setVisible(false);
        await new Promise(r => setTimeout(r, 400));
      }
    };
    loop();
    return () => { cancelled = true; };
  }, [x1, y1, x2, y2, delay]);

  if (!visible) return null;
  return <circle cx={pos.x} cy={pos.y} r={3.5} fill={color} opacity={0.9} />;
}

// ─── SVG Connectors ───────────────────────────────────────────────────────────
function Connectors({
  leftRefs, centerRef, rightRefs, containerRef, inView,
}: {
  leftRefs: React.RefObject<HTMLDivElement | null>[];
  centerRef: React.RefObject<HTMLDivElement | null>;
  rightRefs: React.RefObject<HTMLDivElement | null>[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  inView: boolean;
}) {
  const [edges, setEdges] = useState<
    { id: string; x1: number; y1: number; x2: number; y2: number; d: string; isRight: boolean }[]
  >([]);

  const compute = useCallback(() => {
    if (!containerRef.current || !centerRef.current) return;
    const base = containerRef.current.getBoundingClientRect();
    const center = centerRef.current.getBoundingClientRect();
    const cx = center.left - base.left + center.width / 2;
    const cy = center.top - base.top + center.height / 2;
    const newEdges: typeof edges = [];

    leftRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const x1 = r.right - base.left;
      const y1 = r.top - base.top + r.height / 2;
      const x2 = center.left - base.left;
      const y2 = cy;
      const mx = (x1 + x2) / 2;
      newEdges.push({ id: `l${i}`, x1, y1, x2, y2, d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, isRight: false });
    });

    rightRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const x1 = center.right - base.left;
      const y1 = cy;
      const x2 = r.left - base.left;
      const y2 = r.top - base.top + r.height / 2;
      const mx = (x1 + x2) / 2;
      newEdges.push({ id: `r${i}`, x1, y1, x2, y2, d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, isRight: true });
    });

    setEdges(newEdges);
  }, [leftRefs, centerRef, rightRefs, containerRef]);

  useEffect(() => {
    compute();
    const obs = new ResizeObserver(compute);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [compute]);

  const dotColors = ["#60a5fa", "#f59e0b", "#4ade80"];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {edges.map(({ id, d, x1, y1, x2, y2, isRight }, i) => {
        const dotColor = isRight ? dotColors[i % dotColors.length] : "rgba(255,255,255,0.6)";
        return (
          <g key={id}>
            <motion.path d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
            />
            <motion.path d={d} fill="none" stroke={isRight ? dotColor : "rgba(255,255,255,0.12)"} strokeWidth={0.8}
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
            />
            <motion.circle cx={x1} cy={y1} r={2.5} fill="rgba(255,255,255,0.25)"
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.1 }}
            />
            <motion.circle cx={x2} cy={y2} r={2.5} fill={isRight ? dotColor : "rgba(255,255,255,0.25)"}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.1 }}
            />
            {inView && <TravelDot x1={x1} y1={y1} x2={x2} y2={y2} delay={0.9 + i * 0.35} color={isRight ? dotColor : "white"} />}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Side Node ────────────────────────────────────────────────────────────────
function SideNode({ node, nodeRef, index, inView }: {
  node: NodeDef;
  nodeRef: React.RefObject<HTMLDivElement | null>;
  index: number;
  inView: boolean;
}) {
  const Icon = node.icon;
  const isRight = node.col === "right";
  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, x: isRight ? 20 : -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.03] transition-all duration-300 w-full group/node cursor-default"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
        isRight
          ? "bg-white/[0.04] border-white/[0.08] group-hover/node:bg-white/[0.08]"
          : "bg-white/[0.04] border-white/[0.06]"
      } transition-colors`}>
        <Icon size={16} className={node.accent ?? "text-white/40"} />
      </div>
      <div className="min-w-0">
        <div className="text-[12px] font-semibold text-white/75 leading-tight truncate">{node.label}</div>
        <div className="text-[10px] text-neutral-600 mt-0.5 truncate">{node.sub}</div>
      </div>
      {isRight && (
        <div className="ml-auto flex-shrink-0">
          <motion.div
            className={`w-1.5 h-1.5 rounded-full ${
              index === 0 ? "bg-blue-400" : index === 1 ? "bg-amber-400" : "bg-green-400"
            }`}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2 + index * 0.4, repeat: Infinity }}
          />
        </div>
      )}
    </motion.div>
  );
}

// ─── Graph Layout ─────────────────────────────────────────────────────────────
function GraphLayout({ inView }: { inView: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const leftRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const rightRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const Icon = CENTER_NODE.icon;

  return (
    <>
      {/* ── Desktop layout (md+): single container with SVG overlay ── */}
      <div ref={containerRef} className="relative hidden md:block w-full py-10 px-10">
        {/* SVG connectors — absolute, fills containerRef */}
        <Connectors
          leftRefs={leftRefs}
          centerRef={centerRef}
          rightRefs={rightRefs}
          containerRef={containerRef}
          inView={inView}
        />

        {/* 3-column grid */}
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-12">
          {/* Left nodes */}
          <div className="flex flex-col gap-3">
            {LEFT_NODES.map((node, i) => (
              <SideNode key={node.id} node={node} nodeRef={leftRefs[i]} index={i} inView={inView} />
            ))}
          </div>

          {/* Center node */}
          <motion.div
            ref={centerRef}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center justify-center w-36 h-36 rounded-3xl bg-[#111] border border-white/[0.15] shadow-[0_0_60px_rgba(255,255,255,0.05)] flex-shrink-0"
          >
            {[1.14, 1.28].map((scale, i) => (
              <motion.div key={i} className="absolute inset-0 rounded-3xl border border-white/[0.08]"
                animate={{ scale: [1, scale, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
              />
            ))}
            <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center mb-2.5">
              <Icon size={24} className="text-white/80" />
            </div>
            <span className="text-[12px] font-bold text-white/90 tracking-tight">{CENTER_NODE.label}</span>
            <span className="text-[9px] text-neutral-500 mt-0.5">{CENTER_NODE.sub}</span>
          </motion.div>

          {/* Right nodes */}
          <div className="flex flex-col gap-3">
            {RIGHT_NODES.map((node, i) => (
              <SideNode key={node.id} node={node} nodeRef={rightRefs[i]} index={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile layout (<md): vertical stack, no SVG ── */}
      <div className="md:hidden flex flex-col gap-5 px-4 py-6">
        <div>
          <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest mb-2">Input</p>
          <div className="flex flex-col gap-2">
            {LEFT_NODES.map((node, i) => (
              <SideNode key={node.id} node={node} nodeRef={{ current: null }} index={i} inView={inView} />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center py-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-[#111] border border-white/[0.15] shadow-[0_0_40px_rgba(255,255,255,0.05)]"
          >
            {[1.14, 1.28].map((scale, i) => (
              <motion.div key={i} className="absolute inset-0 rounded-2xl border border-white/[0.08]"
                animate={{ scale: [1, scale, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
              />
            ))}
            <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center mb-1.5">
              <Icon size={20} className="text-white/80" />
            </div>
            <span className="text-[11px] font-bold text-white/90 tracking-tight">{CENTER_NODE.label}</span>
          </motion.div>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest mb-2">Output</p>
          <div className="flex flex-col gap-2">
            {RIGHT_NODES.map((node, i) => (
              <SideNode key={node.id} node={node} nodeRef={{ current: null }} index={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function NeuralGraph() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const bottomStats = [
    { val: "< 1 detik", label: "Waktu proses",   color: "text-blue-400" },
    { val: "100%",      label: "Tanpa coding",    color: "text-amber-400" },
    { val: "∞",         label: "Baris data",      color: "text-green-400" },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/[0.015] blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="mb-4 flex justify-center">
            <SectionEyebrow icon={Network} label="Arsitektur" />
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6 leading-[1.1]">
            Semua terhubung,<br />semua otomatis.
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Pakarsheet jadi pusat kendali yang menghubungkan data, tim, dan output kamu — tanpa perlu coding satu baris pun.
          </p>
        </motion.div>

        {/* Graph card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl border border-white/[0.08] bg-[#080808] overflow-hidden shadow-2xl max-w-4xl mx-auto"
        >
          {/* Top bar */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05] bg-white/[0.015]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
            <span className="ml-4 text-[11px] text-neutral-600 font-mono">
              pakarsheet — workflow engine
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="text-[10px] text-green-400/70 font-medium">live</span>
            </div>
          </div>

          <GraphLayout inView={inView} />
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 md:mt-12 max-w-2xl mx-auto"
        >
          <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2 rounded-2xl border border-white/8 bg-white/[0.02] backdrop-blur-sm">
            {bottomStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col items-center text-center px-3 sm:px-5 py-4 sm:py-5 rounded-xl hover:bg-white/[0.03] transition-colors"
              >
                {/* colored indicator dot */}
                <div
                  className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${s.color.replace("text-", "bg-")} opacity-50 group-hover:opacity-100 transition-opacity`}
                  aria-hidden
                />
                <div
                  className={`text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight leading-none mb-1.5 sm:mb-2 ${s.color}`}
                >
                  {s.val}
                </div>
                <div className="text-[11px] sm:text-xs text-neutral-500 font-medium uppercase tracking-wider">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
