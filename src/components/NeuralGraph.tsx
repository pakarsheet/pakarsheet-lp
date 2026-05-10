"use client"

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  Database,
  FileSpreadsheet,
  Users,
  BarChart3,
  Bell,
  Download,
  Cpu,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
interface NodeDef {
  id: string;
  label: string;
  sub: string;
  icon: React.ElementType;
  col: "left" | "center" | "right";
}

/* ─── Node definitions ──────────────────────────────────────────────────────── */
const LEFT_NODES: NodeDef[] = [
  { id: "data",  label: "Data Klien",  sub: "Google Sheets", icon: Database,        col: "left" },
  { id: "form",  label: "Form Input",  sub: "Google Forms",  icon: FileSpreadsheet, col: "left" },
  { id: "users", label: "Tim Kamu",    sub: "Multi-user",    icon: Users,           col: "left" },
];

const RIGHT_NODES: NodeDef[] = [
  { id: "report", label: "Laporan",     sub: "Auto-generate", icon: BarChart3, col: "right" },
  { id: "notif",  label: "Notifikasi",  sub: "Email / WA",    icon: Bell,      col: "right" },
  { id: "export", label: "Export",      sub: "PDF / Excel",   icon: Download,  col: "right" },
];

const CENTER_NODE: NodeDef = {
  id: "engine", label: "Pakarsheet", sub: "Processing", icon: Cpu, col: "center",
};

/* ─── Traveling dot ─────────────────────────────────────────────────────────── */
function TravelDot({
  x1, y1, x2, y2, delay,
}: {
  x1: number; y1: number; x2: number; y2: number; delay: number;
}) {
  const [pos, setPos] = useState({ x: x1, y: y1 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loop = async () => {
      while (!cancelled) {
        await new Promise(r => setTimeout(r, delay * 1000 + Math.random() * 600));
        if (cancelled) break;
        setVisible(true);
        const start = performance.now();
        const dur = 800 + Math.random() * 400;
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
        await new Promise(r => setTimeout(r, 300));
      }
    };
    loop();
    return () => { cancelled = true; };
  }, [x1, y1, x2, y2, delay]);

  if (!visible) return null;
  return (
    <circle cx={pos.x} cy={pos.y} r={3} fill="white" opacity={0.8} />
  );
}

/* ─── SVG Connector overlay ─────────────────────────────────────────────────── */
function Connectors({
  leftRefs,
  centerRef,
  rightRefs,
  containerRef,
  inView,
}: {
  leftRefs: React.RefObject<HTMLDivElement | null>[];
  centerRef: React.RefObject<HTMLDivElement | null>;
  rightRefs: React.RefObject<HTMLDivElement | null>[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  inView: boolean;
}) {
  const [edges, setEdges] = useState<
    { id: string; x1: number; y1: number; x2: number; y2: number; d: string }[]
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
      newEdges.push({
        id: `left-${i}`,
        x1, y1, x2, y2,
        d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`,
      });
    });

    rightRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const x1 = center.right - base.left;
      const y1 = cy;
      const x2 = r.left - base.left;
      const y2 = r.top - base.top + r.height / 2;
      const mx = (x1 + x2) / 2;
      newEdges.push({
        id: `right-${i}`,
        x1, y1, x2, y2,
        d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`,
      });
    });

    setEdges(newEdges);
  }, [leftRefs, centerRef, rightRefs, containerRef]);

  useEffect(() => {
    compute();
    const obs = new ResizeObserver(compute);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [compute]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="ng-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {edges.map(({ id, d, x1, y1, x2, y2 }, i) => (
        <g key={id}>
          {/* Base line */}
          <motion.path
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: "easeOut" }}
          />
          {/* Glow line */}
          <motion.path
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
            filter="url(#ng-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: "easeOut" }}
          />
          {/* Endpoint dots */}
          <motion.circle
            cx={x1} cy={y1} r={2.5}
            fill="rgba(255,255,255,0.2)"
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
          <motion.circle
            cx={x2} cy={y2} r={2.5}
            fill="rgba(255,255,255,0.2)"
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
          {/* Traveling dot */}
          {inView && (
            <TravelDot x1={x1} y1={y1} x2={x2} y2={y2} delay={0.8 + i * 0.3} />
          )}
        </g>
      ))}
    </svg>
  );
}

/* ─── Side node card ────────────────────────────────────────────────────────── */
function SideNode({
  node,
  nodeRef,
  index,
  inView,
}: {
  node: NodeDef;
  nodeRef: React.RefObject<HTMLDivElement | null>;
  index: number;
  inView: boolean;
}) {
  const Icon = node.icon;
  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, x: node.col === "left" ? -20 : 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-300 w-full"
    >
      <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-white/50" />
      </div>
      <div className="min-w-0">
        <div className="text-[12px] font-medium text-white/75 leading-tight truncate">{node.label}</div>
        <div className="text-[10px] text-neutral-600 mt-0.5 truncate">{node.sub}</div>
      </div>
    </motion.div>
  );
}

/* ─── Graph layout ──────────────────────────────────────────────────────────── */
function GraphLayout({ inView }: { inView: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const leftRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const rightRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const Icon = CENTER_NODE.icon;

  return (
    <div ref={containerRef} className="relative w-full py-8 px-4 md:px-8">
      {/* SVG connectors rendered behind everything */}
      <Connectors
        leftRefs={leftRefs}
        centerRef={centerRef}
        rightRefs={rightRefs}
        containerRef={containerRef}
        inView={inView}
      />

      {/* 3-column grid */}
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-10">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {LEFT_NODES.map((node, i) => (
            <SideNode
              key={node.id}
              node={node}
              nodeRef={leftRefs[i]}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        {/* Center node */}
        <motion.div
          ref={centerRef}
          initial={{ opacity: 0, scale: 0.75 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-[#111] border border-white/[0.18] shadow-[0_0_48px_rgba(255,255,255,0.06)] flex-shrink-0"
        >
          {/* Pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-2xl border border-white/10"
            animate={{ scale: [1, 1.14, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-2xl border border-white/[0.05]"
            animate={{ scale: [1, 1.26, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <div className="w-11 h-11 rounded-xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center mb-2.5">
            <Icon size={22} className="text-white/80" />
          </div>
          <span className="text-[11px] font-semibold text-white/85 tracking-tight">{CENTER_NODE.label}</span>
          <span className="text-[9px] text-neutral-500 mt-0.5">{CENTER_NODE.sub}</span>
        </motion.div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {RIGHT_NODES.map((node, i) => (
            <SideNode
              key={node.id}
              node={node}
              nodeRef={rightRefs[i]}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main section ──────────────────────────────────────────────────────────── */
export function NeuralGraph() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">
            Cara Kerja
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white/90 mb-5 leading-[1.1]">
            Semua terhubung,<br />semua otomatis.
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed">
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
              <span className="text-[10px] text-green-400/70">live</span>
            </div>
          </div>

          {/* Graph */}
          <GraphLayout inView={inView} />
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap justify-center gap-10 mt-12 text-center"
        >
          {[
            { val: "< 1 detik", label: "Waktu proses" },
            { val: "100%",      label: "Tanpa coding" },
            { val: "∞",         label: "Baris data" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-semibold text-white/80 tracking-tight">{s.val}</div>
              <div className="text-xs text-neutral-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
