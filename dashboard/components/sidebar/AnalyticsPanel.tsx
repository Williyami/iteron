"use client";

import { useStore } from "@/lib/store";

const SEGMENT_META: Record<string, { prev: number; topBook: string; runs: number }> = {
  Mystery:  { prev: 0.012, topBook: "The Last Witness",   runs: 3 },
  Romance:  { prev: 0.042, topBook: "Always You",          runs: 2 },
  "Sci-Fi": { prev: 0.031, topBook: "Void Protocol",       runs: 2 },
};

function MiniBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--hairline)" }}>
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: "var(--signal)", transition: "width 0.6s ease" }}
      />
    </div>
  );
}

export function AnalyticsPanel() {
  const segments = useStore((s) => s.segments);
  const latestAb = useStore((s) => s.latestAb);
  const history  = useStore((s) => s.history);

  const segEntries = Object.entries(segments) as [string, { ctr: number; lastUpdated: number }][];
  const maxCtr = Math.max(...segEntries.map(([, s]) => s.ctr));
  const avgCtr = segEntries.reduce((sum, [, s]) => sum + s.ctr, 0) / segEntries.length;
  const bestLift = history.length
    ? Math.max(...history.map((r) => r.improvement_pct ?? 0))
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="font-mono text-[11px] uppercase" style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}>metrics</div>
        <div className="mt-1" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}>
          <em style={{ fontStyle: "normal", color: "var(--signal)" }}>Analytics</em>
        </div>
        <div className="mt-1 text-[13px]" style={{ color: "var(--ink-muted)" }}>
          Segment-level CTR and lift trends across all runs.
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Avg CTR",       value: `${(avgCtr * 100).toFixed(1)}%`, sub: "across segments" },
          { label: "Best lift",     value: bestLift != null ? `+${bestLift.toFixed(1)}%` : "—", sub: "single run" },
          { label: "Active tests",  value: latestAb ? "1" : "0", sub: latestAb ? latestAb.segment : "none running" },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--hairline)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
          >
            <div className="text-[11px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>{label}</div>
            <div className="mt-1" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em" }}>{value}</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-faint)" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Segment breakdown */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--hairline)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
      >
        <div
          className="px-5 py-3"
          style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}
        >
          <span className="font-mono text-[10px] uppercase" style={{ color: "var(--ink-faint)", letterSpacing: "0.18em" }}>
            Segment performance
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--hairline-soft)" }}>
          {segEntries.map(([seg, state]) => {
            const meta = SEGMENT_META[seg];
            const prev = meta?.prev ?? state.ctr;
            const delta = ((state.ctr - prev) / prev) * 100;
            const isUp = state.ctr >= prev;
            return (
              <div key={seg} className="flex items-center gap-4 px-5 py-4">
                <div className="w-24 shrink-0">
                  <div className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>{seg}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-faint)" }}>
                    {meta?.runs ?? 0} run{(meta?.runs ?? 0) !== 1 ? "s" : ""}
                  </div>
                </div>
                <MiniBar value={state.ctr} max={maxCtr} />
                <div className="w-16 text-right">
                  <div className="font-mono font-bold text-[13px]" style={{ color: "var(--ink)" }}>
                    {(state.ctr * 100).toFixed(1)}%
                  </div>
                  <div
                    className="font-mono text-[11px]"
                    style={{ color: isUp ? "var(--signal)" : "var(--rust)" }}
                  >
                    {isUp ? "↑" : "↓"} {Math.abs(delta).toFixed(0)}%
                  </div>
                </div>
                <div className="hidden sm:block w-32 text-right">
                  <div className="text-[11px]" style={{ color: "var(--ink-faint)" }}>prev</div>
                  <div className="font-mono text-[12px]" style={{ color: "var(--ink-muted)" }}>
                    {(prev * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active experiment */}
      {latestAb && (
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--hairline)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] uppercase" style={{ color: "var(--ink-faint)", letterSpacing: "0.18em" }}>
              Latest experiment
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase"
              style={{ background: "color-mix(in oklch, var(--signal) 12%, transparent)", color: "var(--signal)", border: "1px solid color-mix(in oklch, var(--signal) 30%, transparent)" }}
            >
              {latestAb.winner === "test" ? "test wins" : "control wins"}
            </span>
          </div>
          <div className="text-[15px] font-semibold mb-4" style={{ color: "var(--ink)" }}>
            {latestAb.segment} segment
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Before",  value: `${(latestAb.ctrBefore * 100).toFixed(2)}%`, color: "var(--rust)" },
              { label: "After",   value: `${(latestAb.ctrAfter * 100).toFixed(2)}%`,  color: "var(--signal)" },
              { label: "Lift",    value: `+${latestAb.improvementPct.toFixed(1)}%`,   color: "var(--signal)" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <div className="text-[11px] mb-1" style={{ color: "var(--ink-faint)" }}>{label}</div>
                <div className="font-mono font-bold text-[18px]" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!latestAb && (
        <div
          className="rounded-xl p-6 text-center"
          style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}
        >
          <div className="font-mono text-[11px]" style={{ color: "var(--ink-faint)", letterSpacing: "0.16em" }}>
            // no experiments run yet — hit Run loop to generate data
          </div>
        </div>
      )}
    </div>
  );
}
