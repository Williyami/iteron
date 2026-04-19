"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { PRESETS_BY_SITE } from "@/lib/constants";
import { useStore } from "@/lib/store";

interface Props {
  onStart: (goal: string) => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export function GoalBar({ onStart, onPause, onResume, onReset }: Props) {
  const runStatus      = useStore((s) => s.run.status);
  const running        = runStatus === "running";
  const paused         = runStatus === "paused";
  const active         = running || paused;
  const demoSite       = useStore((s) => s.demoSite);
  const setDemoSite    = useStore((s) => s.setDemoSite);
  const setHistoryOpen = useStore((s) => s.setHistoryOpen);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useStore.persist.hasHydrated()) { setHydrated(true); return; }
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  const presets = PRESETS_BY_SITE[demoSite];
  const [value, setValue] = useState("");

  useEffect(() => { setValue(""); }, [demoSite]);

  // Detect which site a preset belongs to and switch demoSite accordingly
  const siteForPreset = (preset: string): "pageturn" | "novawear" => {
    const novawearKeywords = ["women", "sale", "accessor", "men's"];
    const lower = preset.toLowerCase();
    return novawearKeywords.some((kw) => lower.includes(kw)) ? "novawear" : "pageturn";
  };

  const handleChip = (preset: string) => {
    if (active) return;
    const targetSite = siteForPreset(preset);
    if (targetSite !== demoSite) setDemoSite(targetSite);
    setValue(preset);
  };

  const handleStart = () => {
    onStart(value.trim());
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
              if (e.key === "Enter" && !active) handleStart();
            }}
            className="w-full bg-transparent text-ink focus:outline-none"
            style={{
              fontSize: "clamp(20px, 2.2vw, 28px)",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "10px",
              letterSpacing: "-0.03em",
              fontWeight: 600,
            }}
            placeholder="Choose or write a goal…"
            aria-label="Optimization goal"
          />
          <div className="flex items-center gap-2 mt-4 flex-nowrap overflow-x-auto">
            <span
              className="text-[11px]"
              style={{ color: "var(--ink-faint)", fontWeight: 600 }}
            >
              Presets
            </span>
            {hydrated && presets.map((preset: string) => {
              const selected = value === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleChip(preset)}
                  disabled={active}
                  className="text-[12px] px-3 py-1.5 transition-colors disabled:opacity-30 rounded-full"
                  style={{
                    color: selected ? "var(--signal)" : "var(--ink-muted)",
                    border: selected ? "1px solid var(--signal)" : "1px solid var(--border)",
                    background: selected ? "var(--mint-2)" : "var(--surface)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active && !selected) {
                      e.currentTarget.style.borderColor = "var(--signal)";
                      e.currentTarget.style.color = "var(--signal)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--ink-muted)";
                    }
                  }}
                >
                  {preset}
                </button>
              );
            })}
          </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 lg:self-start">
              <button
                type="button"
                onClick={handleStart}
                disabled={active}
                className={clsx(
                  "text-[14px] px-5 py-3 transition-colors rounded-lg",
                  active ? "cursor-not-allowed" : "hover:opacity-90"
                )}
                style={{
                  background: active ? "var(--surface-2)" : "var(--signal)",
                  color: active ? "var(--ink-faint)" : "var(--paper)",
                  border: active ? "1px solid var(--border)" : "1px solid var(--signal)",
                  fontWeight: 600,
                }}
              >
                {running ? "Running..." : paused ? "Paused" : "Run loop"}
              </button>

              <button
                type="button"
                onClick={paused ? onResume : onPause}
                disabled={!active}
                className="text-[14px] px-4 py-3 transition-colors rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  color: "var(--ink-muted)",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                }}
              >
                {paused ? "Resume" : "Pause"}
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
