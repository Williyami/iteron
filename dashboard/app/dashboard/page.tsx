"use client";

import { useCallback, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { runDemoLoop } from "@/lib/demo-script";
import { openSseStream } from "@/lib/sse-client";
import { Header } from "@/components/header/Header";
import { GoalBar } from "@/components/header/GoalBar";
import { PipelineGraph } from "@/components/pipeline/PipelineGraph";
import { AgentThoughts } from "@/components/thoughts/AgentThoughts";
import { StorePreview } from "@/components/store-preview/StorePreview";
import { CtrCardGrid } from "@/components/ctr-cards/CtrCardGrid";
import { LatestAbResult } from "@/components/ab-result/LatestAbResult";
import { AppliedConfig } from "@/components/config-panel/AppliedConfig";
import { RunHistorySlideover } from "@/components/history/RunHistorySlideover";

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
      <div className="sticky top-0 z-30 h-[72px] shrink-0">
        <Header />
      </div>

      <GoalBar onStart={handleStart} onReset={handleReset} />

      <main className="flex-1 flex flex-col">
        <section className="px-8 py-8 bg-bone">
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
        </section>

        <section className="px-8 py-8 bg-bone">
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
        </section>

        <section className="px-8 pb-8 bg-bone">
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
        </section>
      </main>

      <RunHistorySlideover />
    </div>
  );
}
