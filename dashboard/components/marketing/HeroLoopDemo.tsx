"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Stage = {
  key: "read" | "diagnose" | "ship" | "scale";
  nodeLabel: string;
  statusLine: string;
  thought: string;
  segment: string;
  change: string;
  metric: { label: string; value: string; delta: string };
};

const STAGES: Stage[] = [
  {
    key: "read",
    nodeLabel: "Analyst",
    statusLine: "Reading storefront events…",
    thought:
      "Mystery segment CTR slipped 4.1% below the weekly baseline after yesterday's catalog refresh.",
    segment: "Mystery · 2,148 sessions",
    change: "No change yet · gathering signal",
    metric: { label: "Baseline CTR", value: "6.8%", delta: "−4.1%" },
  },
  {
    key: "diagnose",
    nodeLabel: "Hypothesis",
    statusLine: "Writing diagnosis…",
    thought:
      "Tag language skews literary (\"noir procedural\"). Shoppers in this segment respond to emotional framing — try lead tags with feeling words.",
    segment: "Mystery · tag language",
    change: "Draft: tag rewrite + shelf re-order",
    metric: { label: "Confidence", value: "0.82", delta: "hypothesis ready" },
  },
  {
    key: "ship",
    nodeLabel: "Optimizer",
    statusLine: "Splitting traffic 50 / 50…",
    thought:
      "Config test live. Control keeps current tags; test swaps in emotional framing and bumps titles with higher dwell. Rollback stays one click away.",
    segment: "Mystery · control vs. test",
    change: "Config test #41 · live",
    metric: { label: "Test CTR", value: "9.1%", delta: "+2.3%" },
  },
  {
    key: "scale",
    nodeLabel: "Winner",
    statusLine: "Scaling winner to 100%…",
    thought:
      "Test beat control on both CTR and add-to-cart. Promoting to all Mystery traffic and archiving the prior config for audit.",
    segment: "Mystery · promoted",
    change: "Winner scaled · prior config archived",
    metric: { label: "Lift vs. control", value: "+34.2%", delta: "promoted" },
  },
];

const STAGE_DURATION_MS = 2000;

export function HeroLoopDemo() {
  const [stageIdx, setStageIdx] = useState(0);
  const [runtime, setRuntime] = useState(0);
  const [ctrSeries, setCtrSeries] = useState<number[]>(() =>
    Array.from({ length: 28 }, (_, i) => 6.4 + Math.sin(i * 0.45) * 0.3)
  );
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setStageIdx((prev) => (prev + 1) % STAGES.length);
    }, STAGE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setRuntime(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCtrSeries((prev) => {
        const next = prev.slice(1);
        const last = prev[prev.length - 1] ?? 6.5;
        const base =
          stageIdx === 0
            ? 6.4
            : stageIdx === 1
            ? 6.7
            : stageIdx === 2
            ? 8.1
            : 9.1;
        const jitter = (Math.random() - 0.5) * 0.35;
        const target = base + jitter;
        const next_val = last + (target - last) * 0.35;
        next.push(Number(next_val.toFixed(2)));
        return next;
      });
    }, 420);
    return () => clearInterval(id);
  }, [stageIdx]);

  const stage = STAGES[stageIdx];

  const ctrMax = Math.max(...ctrSeries, 9.6);
  const ctrMin = Math.min(...ctrSeries, 5.6);
  const spark = useMemo(() => {
    const w = 280;
    const h = 44;
    const range = Math.max(0.6, ctrMax - ctrMin);
    const points = ctrSeries.map((v, i) => {
      const x = (i / (ctrSeries.length - 1)) * w;
      const y = h - ((v - ctrMin) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return {
      polyline: points.join(" "),
      areaPath: `M0,${h} L${points.join(" L")} L${w},${h} Z`,
      w,
      h,
    };
  }, [ctrSeries, ctrMax, ctrMin]);

  const runtimeLabel = useMemo(() => {
    const m = Math.floor(runtime / 60)
      .toString()
      .padStart(2, "0");
    const s = (runtime % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [runtime]);

  return (
    <div className="surface-card-lift relative overflow-hidden" aria-label="Autonomous loop demo">
      {/* top chrome */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block rounded-full"
            style={{
              width: 8,
              height: 8,
              background: "var(--signal)",
              boxShadow: "0 0 0 4px rgba(29, 158, 117, 0.18)",
            }}
          />
          <span className="text-[12px] font-semibold" style={{ color: "var(--ink)" }}>
            Live loop
          </span>
          <span className="text-[12px]" style={{ color: "var(--ink-faint)" }}>
            · {stage.statusLine}
          </span>
        </div>
        <div
          className="font-mono text-[12px]"
          style={{ color: "var(--ink-muted)", letterSpacing: "-0.005em" }}
        >
          runtime {runtimeLabel}
        </div>
      </div>

      {/* node rail */}
      <div className="px-5 pt-6 pb-2">
        {/* circles row — line runs through the centre of this row */}
        <div className="relative flex justify-between items-center">
          {/* track line */}
          <svg
            className="absolute inset-x-0 h-[2px] w-full"
            style={{ top: "50%", transform: "translateY(-50%)" }}
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            aria-hidden
          >
            <line x1="0" y1="1" x2="100" y2="1" stroke="var(--border)" strokeWidth="1" />
            <line
              x1="0"
              y1="1"
              x2={(stageIdx / (STAGES.length - 1)) * 100 || 0.01}
              y2="1"
              stroke="var(--signal)"
              strokeWidth="1.4"
              className="connect-dash"
              style={{ transition: "all 500ms cubic-bezier(.2,.8,.2,1)" }}
            />
          </svg>

          {STAGES.map((s, i) => {
            const active = i === stageIdx;
            const done = i < stageIdx;
            return (
              <div
                key={s.key}
                className="relative flex items-center justify-center rounded-full"
                style={{
                  width: active ? 40 : 32,
                  height: active ? 40 : 32,
                  background: active
                    ? "var(--signal)"
                    : done
                    ? "var(--deep)"
                    : "var(--surface-2)",
                  color: active || done ? "var(--paper)" : "var(--ink-muted)",
                  border: `1px solid ${
                    active ? "var(--signal)" : done ? "var(--deep)" : "var(--border)"
                  }`,
                  boxShadow: active ? "0 0 0 6px rgba(29, 158, 117, 0.15)" : "none",
                  transition: "all 260ms cubic-bezier(.2,.8,.2,1)",
                }}
              >
                <NodeIcon stage={s.key} />
              </div>
            );
          })}
        </div>

        {/* labels row */}
        <div className="flex justify-between mt-2">
          {STAGES.map((s, i) => {
            const active = i === stageIdx;
            const done = i < stageIdx;
            return (
              <span
                key={s.key}
                className="text-[11px] font-semibold text-center"
                style={{
                  color: active ? "var(--ink)" : done ? "var(--deep)" : "var(--ink-faint)",
                  letterSpacing: "-0.005em",
                  width: 40,
                }}
              >
                {s.nodeLabel}
              </span>
            );
          })}
        </div>
      </div>

      {/* thought card */}
      <div className="px-5 pt-4 pb-5">
        <div
          key={stage.key}
          className="rounded-2xl p-4"
          style={{
            background: "var(--mint-2)",
            border: "1px solid rgba(29, 158, 117, 0.2)",
            animation: "floatIn 420ms cubic-bezier(.2,.8,.2,1)",
          }}
        >
          <div
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--deep)" }}
          >
            {stage.nodeLabel} · thinking
          </div>
          <p
            className="mt-2 text-[14.5px] leading-[1.55]"
            style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}
          >
            {stage.thought}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
            <Row label="Segment" value={stage.segment} />
            <Row label="Status" value={stage.change} accent />
          </div>
        </div>
      </div>

      {/* metric + sparkline */}
      <div
        className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4"
        style={{ borderTop: "1px solid var(--border)", background: "var(--surface-2)" }}
      >
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-faint)" }}>
            Live CTR · Mystery segment
          </div>
          <svg
            className="mt-1 block"
            width={spark.w}
            height={spark.h}
            viewBox={`0 0 ${spark.w} ${spark.h}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.32" />
                <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={spark.areaPath} fill="url(#sparkFill)" />
            <polyline
              points={spark.polyline}
              fill="none"
              stroke="var(--signal)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-faint)" }}>
            {stage.metric.label}
          </div>
          <div
            className="mt-0.5 text-[28px] leading-none font-bold"
            style={{ color: "var(--ink)", letterSpacing: "-0.035em" }}
          >
            {stage.metric.value}
          </div>
          <div
            className="mt-1 text-[11.5px] font-semibold"
            style={{ color: "var(--signal)" }}
          >
            {stage.metric.delta}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span
        className="text-[10.5px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--ink-faint)" }}
      >
        {label}
      </span>
      <span
        className="truncate"
        style={{
          color: accent ? "var(--deep)" : "var(--ink)",
          fontWeight: accent ? 600 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function NodeIcon({ stage }: { stage: Stage["key"] }) {
  const common = { width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (stage === "read")
    return (
      <svg {...common} viewBox="0 0 14 14">
        <path d="M2 3h10M2 7h10M2 11h6" />
      </svg>
    );
  if (stage === "diagnose")
    return (
      <svg {...common} viewBox="0 0 14 14">
        <circle cx="6" cy="6" r="3.4" />
        <path d="M8.6 8.6L11.5 11.5" />
      </svg>
    );
  if (stage === "ship")
    return (
      <svg {...common} viewBox="0 0 14 14">
        <path d="M2 7h10M8 3l4 4-4 4" />
      </svg>
    );
  return (
    <svg {...common} viewBox="0 0 14 14">
      <path d="M3 7l3 3 5-6" />
    </svg>
  );
}
