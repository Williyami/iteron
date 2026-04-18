"use client";

import { useState } from "react";
import clsx from "clsx";
import { GOAL_PRESETS } from "@/lib/constants";
import { useStore } from "@/lib/store";

interface Props {
  onStart: (goal: string) => void;
  onReset: () => void;
}

export function GoalBar({ onStart, onReset }: Props) {
  const [value, setValue] = useState("Improve CTR across all segments");
  const running = useStore((s) => s.run.status === "running");
  const setHistoryOpen = useStore((s) => s.setHistoryOpen);

  const handleChip = (preset: string) => {
    setValue(preset);
    if (!running) onStart(preset);
  };

  return (
    <section
      className="bg-bone px-8 py-6"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="surface-card p-5 flex items-end gap-6 flex-wrap">
        <div className="flex-1 min-w-[320px]">
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
              if (e.key === "Enter" && !running) onStart(value);
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
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span
              className="text-[11px]"
              style={{ color: "var(--ink-faint)", fontWeight: 600 }}
            >
              Presets
            </span>
            {GOAL_PRESETS.map((preset) => (
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

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onStart(value)}
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
    </section>
  );
}
