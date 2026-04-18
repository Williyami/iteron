"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { PRESETS_BY_SITE } from "@/lib/constants";
import { useStore } from "@/lib/store";

interface Props {
  onStart: (goal: string) => void;
  onReset: () => void;
}

export function GoalBar({ onStart, onReset }: Props) {
  const running        = useStore((s) => s.run.status === "running");
  const demoSite       = useStore((s) => s.demoSite);
  const setHistoryOpen = useStore((s) => s.setHistoryOpen);

  const presets = PRESETS_BY_SITE[demoSite];
  const [value, setValue]   = useState(presets[0]);
  const [prompt, setPrompt] = useState("");

  useEffect(() => { setValue(presets[0]); }, [demoSite, presets]);

  const handleChip = (preset: string) => {
    setValue(preset);
  };

  const handleStart = () => {
    const goal = value.trim();
    const customPrompt = prompt.trim();
    const composed = customPrompt
      ? `${goal || "Improve CTR across all segments"}\n\nAdditional prompt:\n${customPrompt}`
      : goal;
    onStart(composed);
  };

  return (
    <section className="bg-bone py-6">
      <div className="dashboard-shell">
        <div className="surface-card p-5">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
          <div
            className="text-[12px] mb-2"
            style={{ color: "var(--ink-faint)", fontWeight: 600 }}
          >
            Optimization goal
          </div>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !running) handleStart();
            }}
            className="w-full bg-transparent text-ink focus:outline-none"
            style={{
              fontSize: "clamp(20px, 2.2vw, 28px)",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "10px",
              letterSpacing: "-0.03em",
              fontWeight: 600,
            }}
            placeholder="What should the loop optimize for?"
            aria-label="Optimization goal"
          />
          <div className="mt-4">
            <div
              className="text-[12px] mb-2"
              style={{ color: "var(--ink-faint)", fontWeight: 600 }}
            >
              Custom prompt
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full resize-y rounded-xl bg-[var(--surface-2)] px-4 py-3 text-[14px] text-ink outline-none"
              style={{
                border: "1px solid var(--border)",
                minHeight: "108px",
                lineHeight: 1.6,
              }}
              placeholder="Add extra instructions for the agents, guardrails, or experiment context."
              aria-label="Custom prompt"
            />
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span
              className="text-[11px]"
              style={{ color: "var(--ink-faint)", fontWeight: 600 }}
            >
              Presets
            </span>
            {presets.map((preset: string) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleChip(preset)}
                disabled={running}
                className="text-[12px] px-3 py-1.5 transition-colors disabled:opacity-30 rounded-full"
                style={{
                  color: "var(--ink-muted)",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                }}
                onMouseEnter={(e) => {
                  if (!running) {
                    e.currentTarget.style.borderColor = "var(--signal)";
                    e.currentTarget.style.color = "var(--signal)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--ink-muted)";
                }}
              >
                {preset}
              </button>
            ))}
          </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 lg:self-start">
              <button
                type="button"
                onClick={handleStart}
                disabled={running}
                className={clsx(
                  "text-[14px] px-5 py-3 transition-colors rounded-lg",
                  running ? "cursor-not-allowed" : "hover:opacity-90"
                )}
                style={{
                  background: running ? "var(--surface-2)" : "var(--signal)",
                  color: running ? "var(--ink-faint)" : "var(--paper)",
                  border: running ? "1px solid var(--border)" : "1px solid var(--signal)",
                  fontWeight: 600,
                }}
              >
                {running ? "Running..." : "Run loop"}
              </button>

              <button
                type="button"
                onClick={onReset}
                className="text-[14px] px-4 py-3 transition-colors rounded-lg"
                style={{
                  color: "var(--ink-muted)",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                }}
              >
                reset
              </button>

              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                className="text-[14px] px-1 py-3 transition-colors hover:text-ink"
                style={{
                  color: "var(--ink-faint)",
                  fontWeight: 500,
                }}
              >
                View history
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
