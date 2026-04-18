"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { fetchRunHistory } from "@/lib/queries";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
}

function pctStyle(pct: number | null) {
  if (pct == null) return { color: "var(--ink-faint)" };
  if (pct >= 10) return { color: "var(--signal)" };
  if (pct >= 0) return { color: "var(--ink-muted)" };
  return { color: "var(--rust)" };
}

export function RunHistorySlideover() {
  const open = useStore((s) => s.historyOpen);
  const setHistoryOpen = useStore((s) => s.setHistoryOpen);
  const history = useStore((s) => s.history);
  const setHistory = useStore((s) => s.setHistory);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const rows = await fetchRunHistory(30);
      if (!cancelled) setHistory(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, setHistory]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: "color-mix(in oklch, var(--ink) 18%, transparent)" }}
            onClick={() => setHistoryOpen(false)}
          />
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="fixed top-0 right-0 h-full w-[600px] max-w-[92vw] bg-paper z-50 flex flex-col"
            style={{ borderLeft: "1px solid var(--hairline-strong)" }}
          >
            <div
              className="flex items-baseline justify-between px-6 py-5"
              style={{ borderBottom: "1px solid var(--hairline)" }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="font-mono text-[10px] uppercase"
                  style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}
                >
                  archive
                </span>
                <span
                  className="font-display text-[22px]"
                  style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                >
                  run <em className="display-italic text-signal">history</em>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="font-mono text-[11px] uppercase transition-colors hover:text-ink"
                style={{ color: "var(--ink-muted)", letterSpacing: "0.2em" }}
              >
                close ×
              </button>
            </div>
            <div className="flex-1 overflow-auto scrollbar-thin px-6 py-4">
              {history.length === 0 && (
                <div
                  className="font-mono text-[11px] uppercase py-6"
                  style={{ color: "var(--ink-faint)", letterSpacing: "0.2em" }}
                >
                  // no runs recorded
                </div>
              )}
              <table className="w-full font-mono text-[11px]">
                <thead>
                  <tr
                    className="uppercase"
                    style={{ color: "var(--ink-faint)", letterSpacing: "0.14em" }}
                  >
                    <th className="text-left py-2 pr-3 font-normal">time</th>
                    <th className="text-left py-2 pr-3 font-normal">goal</th>
                    <th className="text-left py-2 pr-3 font-normal">seg</th>
                    <th className="text-right py-2 pr-3 font-normal">before</th>
                    <th className="text-right py-2 pr-3 font-normal">after</th>
                    <th className="text-right py-2 pr-3 font-normal">Δ</th>
                    <th className="text-right py-2 font-normal">winner</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr
                      key={row.id}
                      style={{ borderTop: "1px solid var(--hairline-soft)", color: "var(--ink)" }}
                    >
                      <td
                        className="py-2.5 pr-3 tabular-nums"
                        style={{ color: "var(--ink-muted)" }}
                      >
                        {formatTime(row.created_at)}
                      </td>
                      <td className="py-2.5 pr-3 truncate max-w-[180px]">
                        {row.goal ?? "—"}
                      </td>
                      <td className="py-2.5 pr-3" style={{ color: "var(--ink-muted)" }}>
                        {row.segment_targeted ?? "—"}
                      </td>
                      <td
                        className="py-2.5 pr-3 text-right tabular-nums"
                        style={{ color: "var(--ink-muted)" }}
                      >
                        {row.ctr_before != null
                          ? `${(row.ctr_before * 100).toFixed(2)}%`
                          : "—"}
                      </td>
                      <td className="py-2.5 pr-3 text-right tabular-nums">
                        {row.ctr_after != null
                          ? `${(row.ctr_after * 100).toFixed(2)}%`
                          : "—"}
                      </td>
                      <td
                        className="py-2.5 pr-3 text-right tabular-nums"
                        style={pctStyle(row.improvement_pct)}
                      >
                        {row.improvement_pct != null
                          ? `${row.improvement_pct >= 0 ? "+" : ""}${row.improvement_pct.toFixed(1)}%`
                          : "—"}
                      </td>
                      <td
                        className="py-2.5 text-right uppercase"
                        style={{ color: "var(--signal)" }}
                      >
                        {row.winner_variant ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
