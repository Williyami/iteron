"use client";

import { useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import { runDemoLoop } from "@/lib/demo-script";
import { openSseStream } from "@/lib/sse-client";
import { GoalBar } from "@/components/header/GoalBar";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { DemoModeToggle } from "@/components/header/DemoModeToggle";

const PipelineGraph = dynamic(
  () => import("@/components/pipeline/PipelineGraph").then((mod) => mod.PipelineGraph),
  { loading: () => <PanelSkeleton height="h-[200px]" /> }
);
const AgentThoughts = dynamic(
  () => import("@/components/thoughts/AgentThoughts").then((mod) => mod.AgentThoughts),
  { loading: () => <PanelSkeleton height="h-[320px]" /> }
);
const StorePreview = dynamic(
  () => import("@/components/store-preview/StorePreview").then((mod) => mod.StorePreview),
  { loading: () => <PanelSkeleton height="h-[520px]" /> }
);
const CtrCardGrid = dynamic(
  () => import("@/components/ctr-cards/CtrCardGrid").then((mod) => mod.CtrCardGrid),
  { loading: () => <PanelSkeleton height="h-[220px]" /> }
);
const LatestAbResult = dynamic(
  () => import("@/components/ab-result/LatestAbResult").then((mod) => mod.LatestAbResult),
  { loading: () => <PanelSkeleton height="h-[160px]" /> }
);
const AppliedConfig = dynamic(
  () => import("@/components/config-panel/AppliedConfig").then((mod) => mod.AppliedConfig),
  { loading: () => <PanelSkeleton height="h-[180px]" /> }
);
const RunHistorySlideover = dynamic(
  () => import("@/components/history/RunHistorySlideover").then((mod) => mod.RunHistorySlideover)
);

export default function DashboardPage() {
  const startRun = useStore((s) => s.startRun);
  const applyEvent = useStore((s) => s.applyEvent);
  const reset = useStore((s) => s.reset);
  const mode = useStore((s) => s.mode);
  const runStatus = useStore((s) => s.run.status);

  const cancelRef = useRef<(() => void) | null>(null);

  const stopCurrent = useCallback(() => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }
  }, []);

  const handleStart = useCallback(
    (goal: string) => {
      stopCurrent();
      startRun(goal);
      const trimmed = goal.trim() || "Improve CTR across all segments";

      if (mode === "live") {
        cancelRef.current = openSseStream(trimmed, {
          onEvent: (ev) => applyEvent(ev),
          onFallback: () => {
            cancelRef.current = runDemoLoop(trimmed, applyEvent);
          },
        });
      } else {
        cancelRef.current = runDemoLoop(trimmed, applyEvent);
      }
    },
    [applyEvent, mode, startRun, stopCurrent]
  );

  const handleReset = useCallback(() => {
    stopCurrent();
    reset();
  }, [reset, stopCurrent]);

  useEffect(() => {
    return () => stopCurrent();
  }, [stopCurrent]);

  return (
    <div className="min-h-screen w-full bg-bone text-ink flex flex-col">
      <MarketingNav />

      <section className="bg-bone pt-10">
        <div className="page-shell">
          <div className="max-w-[760px]">
            <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
              Dashboard
            </div>
            <h1
              className="mt-3 text-[clamp(34px,5vw,56px)] leading-[1.02]"
              style={{ letterSpacing: "-0.045em", fontWeight: 700 }}
            >
              Watch the optimization loop think, test, and update the live experience.
            </h1>
            <p className="mt-5 max-w-[680px] text-[17px] leading-[1.7]" style={{ color: "var(--ink-muted)" }}>
              The dashboard now uses the same shell and navigation as the homepage, with the run controls
              and experiment state sitting inside the same product system.
            </p>
          </div>
        </div>
      </section>

      <GoalBar onStart={handleStart} onReset={handleReset} />

      <main className="flex-1 flex flex-col">
        <section className="bg-bone py-2">
          <div className="page-shell">
            <div className="surface-card p-6">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
                  Live pipeline
                </div>
                <div className="mt-2 text-[24px]" style={{ fontWeight: 600, letterSpacing: "-0.03em" }}>
                  Agent execution
                </div>
              </div>
              <span
                className="text-[12px]"
                style={{
                  color: runStatus === "running" ? "var(--signal)" : "var(--ink-faint)",
                  fontWeight: 600,
                }}
              >
                {runStatus === "running"
                  ? "Running"
                  : runStatus === "complete"
                  ? "Complete"
                  : "Idle"}
              </span>
            </div>
            <PipelineGraph />
            </div>
          </div>
        </section>

        <section className="bg-bone py-6">
          <div className="page-shell">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-7">
                <div className="surface-card p-6 h-full">
                <div>
                  <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
                    Store preview
                  </div>
                  <div className="mt-2 text-[24px]" style={{ fontWeight: 600, letterSpacing: "-0.03em" }}>
                    Live experience state
                  </div>
                </div>
                <div className="h-[520px] min-h-[420px] mt-5">
                  <StorePreview />
                </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                <div className="surface-card p-6">
                <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
                  Experiment panel
                </div>
                <div className="mt-2 text-[24px]" style={{ fontWeight: 600, letterSpacing: "-0.03em" }}>
                  Result and rollout state
                </div>
                <div className="mt-5 flex flex-col gap-4">
                  <LatestAbResult />
                  <CtrCardGrid />
                  <AppliedConfig />
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-bone pb-10">
          <div className="page-shell">
            <div className="surface-card p-6">
            <div className="flex items-baseline gap-3">
              <div>
                <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
                  Thought stream
                </div>
                <div className="mt-2 text-[24px]" style={{ fontWeight: 600, letterSpacing: "-0.03em" }}>
                  What the agents are saying
                </div>
              </div>
            </div>
            <div className="h-[320px] min-h-[260px] mt-5">
              <AgentThoughts />
            </div>
            </div>
          </div>
        </section>

        <section className="bg-bone pb-12">
          <div className="page-shell">
            <div className="surface-card flex items-center justify-between gap-4 p-5">
              <div>
                <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
                  Connection mode
                </div>
                <div className="mt-1 text-[16px]" style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
                  Switch between demo and live execution
                </div>
              </div>
              <DemoModeToggle />
            </div>
          </div>
        </section>
      </main>

      <RunHistorySlideover />
    </div>
  );
}

function PanelSkeleton({ height }: { height: string }) {
  return (
    <div
      className={`${height} w-full rounded-xl`}
      style={{
        background:
          "linear-gradient(90deg, var(--surface-2) 0%, color-mix(in srgb, var(--surface-2) 72%, white) 50%, var(--surface-2) 100%)",
        backgroundSize: "200% 100%",
        animation: "tickerScroll 2.4s linear infinite",
      }}
    />
  );
}
