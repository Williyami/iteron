"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import { runDemoLoop, type LoopController } from "@/lib/demo-script";
import { openSseStream } from "@/lib/sse-client";
import { GoalBar } from "@/components/header/GoalBar";
import { OverviewHeader } from "@/components/header/OverviewHeader";
import { DashboardSidebar } from "@/components/sidebar/DashboardSidebar";
import { HistoryPanel } from "@/components/sidebar/HistoryPanel";
import { AnalyticsPanel } from "@/components/sidebar/AnalyticsPanel";
import { ConnectionsPanel } from "@/components/sidebar/ConnectionsPanel";
import { SettingsPanel } from "@/components/sidebar/SettingsPanel";

type NavTab = "overview" | "history" | "analytics" | "connections" | "settings";

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
  const [tab, setTab] = useState<NavTab>("overview");

  const startRun   = useStore((s) => s.startRun);
  const pauseRun   = useStore((s) => s.pauseRun);
  const resumeRun  = useStore((s) => s.resumeRun);
  const applyEvent = useStore((s) => s.applyEvent);
  const reset      = useStore((s) => s.reset);
  const mode       = useStore((s) => s.mode);
  const demoSite   = useStore((s) => s.demoSite);
  const runStatus  = useStore((s) => s.run.status);

  const controllerRef = useRef<LoopController | null>(null);
  const sseCancelRef = useRef<(() => void) | null>(null);

  const stopCurrent = useCallback(() => {
    if (controllerRef.current) { controllerRef.current.cancel(); controllerRef.current = null; }
    if (sseCancelRef.current) { sseCancelRef.current(); sseCancelRef.current = null; }
  }, []);

  const handleStart = useCallback(
    (goal: string) => {
      stopCurrent();
      startRun(goal);
      const trimmed = goal.trim() || "Improve CTR across all segments";
      const currentSite = useStore.getState().demoSite;
      if (mode === "live") {
        sseCancelRef.current = openSseStream(trimmed, {
          onEvent: (ev) => applyEvent(ev),
          onFallback: () => { controllerRef.current = runDemoLoop(trimmed, currentSite, applyEvent); },
        });
      } else {
        controllerRef.current = runDemoLoop(trimmed, currentSite, applyEvent);
      }
    },
    [applyEvent, mode, startRun, stopCurrent]
  );

  const handlePause = useCallback(() => {
    controllerRef.current?.pause();
    pauseRun();
  }, [pauseRun]);

  const handleResume = useCallback(() => {
    controllerRef.current?.resume();
    resumeRun();
  }, [resumeRun]);

  const handleReset = useCallback(() => { stopCurrent(); reset(); }, [reset, stopCurrent]);
  useEffect(() => () => stopCurrent(), [stopCurrent]);

  return (
    <div className="min-h-screen w-full bg-bone text-ink flex">

      {/* ── Sidebar */}
      <DashboardSidebar active={tab} onSelect={setTab} />

      {/* ── Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {tab === "overview" && (
          <>
            <OverviewHeader />
            <GoalBar onStart={handleStart} onPause={handlePause} onResume={handleResume} onReset={handleReset} />

            <main className="flex-1 flex flex-col">
              {/* Pipeline */}
              <section className="bg-bone py-2">
                <div className="dashboard-shell">
                  <div className="surface-card-lift p-7">
                    <div className="flex items-baseline justify-between mb-6">
                      <div>
                        <div
                          className="text-[12px] font-semibold uppercase tracking-[0.08em]"
                          style={{ color: "var(--deep)" }}
                        >
                          Live pipeline
                        </div>
                        <div className="mt-2 text-[26px]" style={{ fontWeight: 700, letterSpacing: "-0.035em" }}>Agent execution</div>
                      </div>
                      <span
                        className="text-[11px] font-semibold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full"
                        style={{
                          color:
                            runStatus === "running"
                              ? "var(--deep)"
                              : runStatus === "complete"
                              ? "var(--deep)"
                              : "var(--ink-faint)",
                          background:
                            runStatus === "running"
                              ? "var(--mint-2)"
                              : runStatus === "complete"
                              ? "var(--mint-2)"
                              : "var(--surface-2)",
                          border:
                            runStatus === "running"
                              ? "1px solid rgba(29, 158, 117, 0.25)"
                              : "1px solid var(--border-2)",
                        }}
                      >
                        {runStatus === "running" ? "● Running" : runStatus === "complete" ? "Complete" : "Idle"}
                      </span>
                    </div>
                    <PipelineGraph />
                  </div>
                </div>
              </section>

              {/* Store preview + experiment panel */}
              <section className="section-wash-mint py-8">
                <div className="dashboard-shell">
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-7">
                      <div className="surface-card-lift p-7 h-full">
                        <div>
                          <div
                            className="text-[12px] font-semibold uppercase tracking-[0.08em]"
                            style={{ color: "var(--deep)" }}
                          >
                            Store preview
                          </div>
                          <div className="mt-2 text-[26px]" style={{ fontWeight: 700, letterSpacing: "-0.035em" }}>Live experience state</div>
                        </div>
                        <div className="h-[520px] min-h-[420px] mt-5"><StorePreview /></div>
                      </div>
                    </div>
                    <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                      <div className="surface-card-lift p-7">
                        <div
                          className="text-[12px] font-semibold uppercase tracking-[0.08em]"
                          style={{ color: "var(--deep)" }}
                        >
                          Experiment panel
                        </div>
                        <div className="mt-2 text-[26px]" style={{ fontWeight: 700, letterSpacing: "-0.035em" }}>Result and rollout state</div>
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

              {/* Thought stream */}
              <section className="bg-bone py-8 pb-14">
                <div className="dashboard-shell">
                  <div className="surface-card-lift p-7">
                    <div>
                      <div
                        className="text-[12px] font-semibold uppercase tracking-[0.08em]"
                        style={{ color: "var(--deep)" }}
                      >
                        Thought stream
                      </div>
                      <div className="mt-2 text-[26px]" style={{ fontWeight: 700, letterSpacing: "-0.035em" }}>What the agents are saying</div>
                    </div>
                    <div className="h-[320px] min-h-[260px] mt-5"><AgentThoughts /></div>
                  </div>
                </div>
              </section>
            </main>
          </>
        )}

        {tab !== "overview" && (
          <div className="flex-1 px-8 py-8 max-w-5xl">
            {tab === "history"     && <HistoryPanel />}
            {tab === "analytics"   && <AnalyticsPanel />}
            {tab === "connections" && <ConnectionsPanel />}
            {tab === "settings"    && <SettingsPanel />}
          </div>
        )}

      </div>

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
