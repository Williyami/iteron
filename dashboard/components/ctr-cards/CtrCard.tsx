"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Segment } from "@/lib/types";

function ctrStatus(ctr: number): "bad" | "mid" | "good" {
  if (ctr < 0.015) return "bad";
  if (ctr < 0.03) return "mid";
  return "good";
}

const STATUS_COLOR = {
  bad: "var(--rust)",
  mid: "var(--amber)",
  good: "var(--signal)",
} as const;

interface Props {
  segment: Segment;
}

export function CtrCard({ segment }: Props) {
  const ctr = useStore((s) => s.segments[segment].ctr);
  const prevCtrRef = useRef(ctr);
  const [delta, setDelta] = useState(0);
  const status = ctrStatus(ctr);
  const color = STATUS_COLOR[status];

  const mv = useMotionValue(ctr);
  const display = useTransform(mv, (v) => (v * 100).toFixed(2));

  useEffect(() => {
    const prev = prevCtrRef.current;
    if (prev !== ctr) {
      setDelta(ctr - prev);
      prevCtrRef.current = ctr;
    }
    const controls = animate(mv, ctr, { duration: 0.32, ease: [0.25, 1, 0.5, 1] });
    return controls.stop;
  }, [ctr, mv]);

  const deltaPct = delta === 0 ? null : (delta / (ctr - delta || 1)) * 100;

  return (
    <div
      className="relative px-4 py-3 bg-paper"
      style={{ borderTop: "1px solid var(--hairline)" }}
    >
      <div className="flex items-baseline justify-between">
        <span
          className="font-display text-[14px] text-ink"
          style={{ fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          {segment}
        </span>
        <span
          className="font-mono text-[9px] uppercase"
          style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}
        >
          ctr
        </span>
      </div>
      <div className="flex items-baseline gap-2 mt-1.5">
        <motion.span
          className="font-mono text-[30px] tabular-nums leading-none"
          style={{ color, letterSpacing: "-0.02em" }}
        >
          <motion.span>{display}</motion.span>
          <span className="text-[18px] opacity-60">%</span>
        </motion.span>
        {deltaPct !== null && Number.isFinite(deltaPct) && (
          <span
            className="font-mono text-[10px] tabular-nums"
            style={{ color: delta >= 0 ? "var(--signal)" : "var(--rust)" }}
          >
            {delta >= 0 ? "+" : ""}
            {deltaPct.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
