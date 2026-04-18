"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import { runDemoLoop } from "@/lib/demo-script";
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
  const applyEvent = useStore((s) => s.applyEvent);
  const reset      = useStore((s) => s.reset);
  const mode       = useStore((s) => s.mode);
  const runStatus  = useStore((s) => s.run.status);

  const cancelRef = useRef<(() => void) | null>(null);

  const stopCurrent = useCallback(() => {
    if (cancelRef.current) { cancelRef.current(); cancelRef.current = null; }
  }, []);

  const handleStart = useCallback(
    (goal: string) => {
      stopCurrent();
      startRun(goal);
      const trimmed = goal.trim() || "Improve CTR across all segments";
      if (mode === "live") {
        cancelRef.current = openSseStream(trimmed, {
          onEvent: (ev) => applyEvent(ev),
          onFallback: () => { cancelRef.current = runDemoLoop(trimmed, applyEvent); },
        });
      } else {
        cancelRef.current = runDemoLoop(trimmed, applyEvent);
      }
    },
    [applyEvent, mode, startRun, stopCurrent]
  );

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
            <GoalBar onStart={handleStart} onReset={handleReset} />

            <main className="flex-1 flex flex-col">
              {/* Pipeline */}
              <section className="bg-bone py-2">
                <div className="dashboard-shell">
                  <div className="surface-card p-6">
                    <div className="flex items-baseline justify-between mb-6">
                      <div>
                        <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>Live pipeline</div>
                        <div className="mt-2 text-[24px]" style={{ fontWeight: 600, letterSpacing: "-0.03em" }}>Agent execution</div>
                      </div>
                      <span className="text-[12px]" style={{ color: runStatus === "running" ? "var(--signal)" : "var(--ink-faint)", fontWeight: 600 }}>
                        {runStatus === "running" ? "Running" : runStatus === "complete" ? "Complete" : "Idle"}
                      </span>
                    </div>
                    <PipelineGraph />
                  </div>
                </div>
              </section>

              {/* Store preview + experiment panel */}
              <section className="bg-bone py-6">
                <div className="dashboard-shell">
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-7">
                      <div className="surface-card p-6 h-full">
                        <div>
                          <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>Store preview</div>
                          <div className="mt-2 text-[24px]" style={{ fontWeight: 600, letterSpacing: "-0.03em" }}>Live experience state</div>
                        </div>
                        <div className="h-[520px] min-h-[420px] mt-5"><StorePreview /></div>
                      </div>
                    </div>
                    <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                      <div className="surface-card p-6">
                        <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>Experiment panel</div>
                        <div className="mt-2 text-[24px]" style={{ fontWeight: 600, letterSpacing: "-0.03em" }}>Result and rollout state</div>
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
              <section className="bg-bone pb-10">
                <div className="dashboard-shell">
                  <div className="surface-card p-6">
                    <div>
                      <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>Thought stream</div>
                      <div className="mt-2 text-[24px]" style={{ fontWeight: 600, letterSpacing: "-0.03em" }}>What the agents are saying</div>
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
