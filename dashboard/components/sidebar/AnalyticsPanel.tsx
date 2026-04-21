"use client";

import { useStore } from "@/lib/store";

const SEGMENT_META: Record<string, { prev: number; topBook: string; runs: number; revenuePerClick: number }> = {
  Mystery:  { prev: 0.012, topBook: "The Last Witness",  runs: 3, revenuePerClick: 8.40 },
  Romance:  { prev: 0.042, topBook: "Always You",         runs: 2, revenuePerClick: 7.20 },
  "Sci-Fi": { prev: 0.031, topBook: "Void Protocol",      runs: 2, revenuePerClick: 9.10 },
};

const MONTHLY_IMPRESSIONS = 42000;

function BarChart({ entries }: { entries: { label: string; value: number; prev: number }[] }) {
  const max = Math.max(...entries.map((e) => e.value), 0.001);
  return (
    <div className="flex items-end gap-3 h-24 w-full">
      {entries.map(({ label, value, prev }) => {
        const pct = (value / max) * 100;
        const prevPct = (prev / max) * 100;
        const up = value >= prev;
        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex items-end gap-0.5 h-16 relative">
              {/* prev bar */}
              <div
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${prevPct}%`,
                  background: "var(--hairline-strong)",
                  minHeight: 2,
                }}
              />
              {/* current bar */}
              <div
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${pct}%`,
                  background: up ? "var(--signal)" : "var(--rust)",
                  minHeight: 2,
                  transition: "height 0.5s ease",
                }}
              />
            </div>
            <div className="text-[10px] font-mono text-center" style={{ color: "var(--ink-faint)" }}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RevenueImpactRow({ segment, ctr, prev, revenuePerClick }: {
  segment: string; ctr: number; prev: number; revenuePerClick: number;
}) {
  const currentRevenue = ctr * MONTHLY_IMPRESSIONS * revenuePerClick;
  const prevRevenue    = prev * MONTHLY_IMPRESSIONS * revenuePerClick;
  const delta          = currentRevenue - prevRevenue;
  const up             = delta >= 0;

  return (
    <div
      className="flex items-center justify-between gap-4 py-3"
      style={{ borderBottom: "1px solid var(--hairline-soft)" }}
    >
      <div className="w-20 shrink-0">
        <div className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>{segment}</div>
        <div className="font-mono text-[11px] mt-0.5" style={{ color: "var(--ink-faint)" }}>
          {(ctr * 100).toFixed(2)}% CTR
        </div>
      </div>
      <div className="flex-1">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--hairline)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min((ctr / 0.05) * 100, 100)}%`,
              background: up ? "var(--signal)" : "var(--rust)",
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>
      <div className="text-right w-28 shrink-0">
        <div className="font-mono text-[13px] font-bold" style={{ color: "var(--ink)" }}>
          ${currentRevenue.toLocaleString("en", { maximumFractionDigits: 0 })}
          <span className="text-[11px] font-normal" style={{ color: "var(--ink-faint)" }}>/mo est.</span>
        </div>
        <div className="font-mono text-[11px]" style={{ color: up ? "var(--signal)" : "var(--rust)" }}>
          {up ? "↑" : "↓"} ${Math.abs(delta).toLocaleString("en", { maximumFractionDigits: 0 })}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPanel() {
  const segments = useStore((s) => s.segments);
  const latestAb = useStore((s) => s.latestAb);
  const history  = useStore((s) => s.history);

  const segEntries = Object.entries(segments) as [string, { ctr: number; lastUpdated: number }][];
  const avgCtr     = segEntries.reduce((sum, [, s]) => sum + s.ctr, 0) / segEntries.length;
  const bestLift   = history.length ? Math.max(...history.map((r) => r.improvement_pct ?? 0)) : null;

  const totalRevenue = segEntries.reduce((sum, [seg, state]) => {
    const rpc = SEGMENT_META[seg]?.revenuePerClick ?? 8;
    return sum + state.ctr * MONTHLY_IMPRESSIONS * rpc;
  }, 0);

  const baseRevenue = segEntries.reduce((sum, [seg]) => {
    const meta = SEGMENT_META[seg];
    if (!meta) return sum;
    return sum + meta.prev * MONTHLY_IMPRESSIONS * meta.revenuePerClick;
  }, 0);

  const revenueDelta = totalRevenue - baseRevenue;

  const chartEntries = segEntries.map(([seg, state]) => ({
    label: seg.slice(0, 3).toUpperCase(),
    value: state.ctr,
    prev: SEGMENT_META[seg]?.prev ?? state.ctr,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="font-mono text-[11px] uppercase" style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}>metrics</div>
        <div className="mt-1" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}>
          <em style={{ fontStyle: "normal", color: "var(--signal)" }}>Analytics</em>
        </div>
        <div className="mt-1 text-[13px]" style={{ color: "var(--ink-muted)" }}>
          Segment-level CTR, revenue impact, and lift trends.
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Avg CTR",        value: `${(avgCtr * 100).toFixed(1)}%`,                             sub: "across segments" },
          { label: "Best lift",      value: bestLift != null ? `+${bestLift.toFixed(1)}%` : "—",         sub: "single run" },
          { label: "Est. rev/mo",    value: `$${(totalRevenue / 1000).toFixed(1)}k`,                     sub: "at current CTR" },
          { label: "Rev uplift",     value: revenueDelta >= 0 ? `+$${Math.abs(revenueDelta).toFixed(0)}` : `−$${Math.abs(revenueDelta).toFixed(0)}`, sub: "vs baseline" },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--hairline)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
          >
            <div className="text-[11px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>{label}</div>
            <div className="mt-1" style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)" }}>{value}</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-faint)" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--surface)", border: "1px solid var(--hairline)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] uppercase" style={{ color: "var(--ink-faint)", letterSpacing: "0.18em" }}>CTR by segment</span>
          <div className="flex items-center gap-3 text-[10px] font-mono" style={{ color: "var(--ink-faint)" }}>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "var(--hairline-strong)" }} /> Baseline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "var(--signal)" }} /> Current
            </span>
          </div>
        </div>
        <BarChart entries={chartEntries} />
      </div>

      {/* Revenue impact */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--hairline)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
      >
        <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
          <span className="font-mono text-[10px] uppercase" style={{ color: "var(--ink-faint)", letterSpacing: "0.18em" }}>
            Revenue impact · {MONTHLY_IMPRESSIONS.toLocaleString()} impressions/mo
          </span>
        </div>
        <div className="px-5 last:[&>div]:border-0">
          {segEntries.map(([seg, state]) => (
            <RevenueImpactRow
              key={seg}
              segment={seg}
              ctr={state.ctr}
              prev={SEGMENT_META[seg]?.prev ?? state.ctr}
              revenuePerClick={SEGMENT_META[seg]?.revenuePerClick ?? 8}
            />
          ))}
        </div>
      </div>

      {/* Latest experiment */}
      {latestAb ? (
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
              { label: "Before", value: `${(latestAb.ctrBefore * 100).toFixed(2)}%`, color: "var(--rust)" },
              { label: "After",  value: `${(latestAb.ctrAfter * 100).toFixed(2)}%`,  color: "var(--signal)" },
              { label: "Lift",   value: `+${latestAb.improvementPct.toFixed(1)}%`,   color: "var(--signal)" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <div className="text-[11px] mb-1" style={{ color: "var(--ink-faint)" }}>{label}</div>
                <div className="font-mono font-bold text-[18px]" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
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
