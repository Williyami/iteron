"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";

export function LatestAbResult() {
  const latest = useStore((s) => s.latestAb);

  return (
    <section
      className="bg-paper p-5 min-h-[160px]"
      style={{ border: "1px solid var(--hairline)" }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <span
          className="font-mono text-[10px] uppercase"
          style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}
        >
          latest result
        </span>
        {latest && (
          <span
            className="font-mono text-[10px] uppercase"
            style={{ color: "var(--signal)", letterSpacing: "0.22em" }}
          >
            {latest.segment.toLowerCase()}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!latest && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-mono text-[11px] uppercase py-6"
            style={{ color: "var(--ink-faint)", letterSpacing: "0.2em" }}
          >
            // awaiting test result
          </motion.div>
        )}
        {latest && (
          <motion.div
            key={latest.appliedAt}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div
                  className="font-mono text-[9px] uppercase mb-1"
                  style={{ color: "var(--ink-faint)", letterSpacing: "0.24em" }}
                >
                  before
                </div>
                <div
                  className="font-mono text-[26px] tabular-nums"
                  style={{ color: "var(--ink-muted)", letterSpacing: "-0.02em" }}
                >
                  {(latest.ctrBefore * 100).toFixed(2)}
                  <span className="text-[16px] opacity-60">%</span>
                </div>
              </div>
              <div>
                <div
                  className="font-mono text-[9px] uppercase mb-1"
                  style={{ color: "var(--ink-faint)", letterSpacing: "0.24em" }}
                >
                  after
                </div>
                <div
                  className="font-mono text-[26px] tabular-nums text-ink"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {(latest.ctrAfter * 100).toFixed(2)}
                  <span className="text-[16px] opacity-60">%</span>
                </div>
              </div>
            </div>
            <div
              className="flex items-baseline justify-between mt-4 pt-3"
              style={{ borderTop: "1px solid var(--hairline)" }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display text-[34px] tabular-nums"
                  style={{
                    color: latest.improvementPct >= 0 ? "var(--signal)" : "var(--rust)",
                    letterSpacing: "-0.03em",
                    fontWeight: 500,
                  }}
                >
                  {latest.improvementPct >= 0 ? "+" : ""}
                  {latest.improvementPct.toFixed(1)}
                  <span className="text-[22px] opacity-70">%</span>
                </span>
                <span
                  className="display-italic text-[13px]"
                  style={{ color: "var(--ink-muted)" }}
                >
                  lift
                </span>
              </div>
              {latest.winner === "test" && (
                <span
                  className="font-mono text-[9px] uppercase px-2 py-1"
                  style={{
                    color: "var(--signal)",
                    border: "1px solid var(--signal)",
                    letterSpacing: "0.22em",
                  }}
                >
                  ✓ applied
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
