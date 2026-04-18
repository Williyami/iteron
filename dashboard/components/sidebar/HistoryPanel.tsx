"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { fetchRunHistory } from "@/lib/queries";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short",
  });
}

function pctColor(pct: number | null) {
  if (pct == null) return "var(--ink-faint)";
  if (pct >= 10)   return "var(--signal)";
  if (pct >= 0)    return "var(--ink-muted)";
  return "var(--rust)";
}

export function HistoryPanel() {
  const history     = useStore((s) => s.history);
  const setHistory  = useStore((s) => s.setHistory);

  useEffect(() => {
    let cancelled = false;
    fetchRunHistory(50).then((rows) => { if (!cancelled) setHistory(rows); });
    return () => { cancelled = true; };
  }, [setHistory]);

  const wins     = history.filter((r) => r.winner_variant === "test").length;
  const avgLift  = history.length
    ? (history.reduce((s, r) => s + (r.improvement_pct ?? 0), 0) / history.length).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="font-mono text-[11px] uppercase" style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}>archive</div>
        <div className="mt-1" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}>
          Run <em style={{ fontStyle: "normal", color: "var(--signal)" }}>history</em>
        </div>
        <div className="mt-1 text-[13px]" style={{ color: "var(--ink-muted)" }}>
          Every optimisation loop Iteron has executed.
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total runs",   value: String(history.length || "—") },
          { label: "Test wins",    value: history.length ? String(wins) : "—" },
          { label: "Avg lift",     value: avgLift ? `+${avgLift}%` : "—" },
          { label: "No-change",    value: history.length ? String(history.length - wins) : "—" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--hairline)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
          >
            <div className="text-[11px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>{label}</div>
            <div className="mt-1" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--hairline)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}>
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}
        >
          <span className="font-mono text-[10px] uppercase" style={{ color: "var(--ink-faint)", letterSpacing: "0.18em" }}>All runs</span>
          <span className="font-mono text-[10px]" style={{ color: "var(--ink-faint)" }}>{history.length} entries</span>
        </div>

        {history.length === 0 && (
          <div className="px-5 py-10 text-center font-mono text-[11px]" style={{ color: "var(--ink-faint)", letterSpacing: "0.16em" }}>
            // no runs recorded yet
          </div>
        )}

        {history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px]">
              <thead>
                <tr style={{ color: "var(--ink-faint)" }}>
                  {["Time", "Goal", "Segment", "Before", "After", "Δ", "Winner"].map((h, i) => (
                    <th
                      key={h}
                      className={`py-2.5 px-4 font-normal uppercase text-[10px] ${i > 2 ? "text-right" : "text-left"}`}
                      style={{ letterSpacing: "0.12em", borderBottom: "1px solid var(--hairline)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <tr
                    key={row.id}
                    style={{ borderBottom: "1px solid var(--hairline-soft)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-4 py-3 whitespace-nowrap tabular-nums" style={{ color: "var(--ink-muted)" }}>
                      {formatTime(row.created_at)}
                    </td>
                    <td className="px-4 py-3 max-w-[180px] truncate" style={{ color: "var(--ink)" }}>
                      {row.goal ?? "—"}
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--ink-muted)" }}>
                      {row.segment_targeted ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums" style={{ color: "var(--ink-muted)" }}>
                      {row.ctr_before != null ? `${(row.ctr_before * 100).toFixed(2)}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums" style={{ color: "var(--ink)" }}>
                      {row.ctr_after != null ? `${(row.ctr_after * 100).toFixed(2)}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold" style={{ color: pctColor(row.improvement_pct) }}>
                      {row.improvement_pct != null
                        ? `${row.improvement_pct >= 0 ? "+" : ""}${row.improvement_pct.toFixed(1)}%`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right uppercase" style={{ color: row.winner_variant === "test" ? "var(--signal)" : "var(--ink-faint)" }}>
                      {row.winner_variant ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
