"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { PRESETS_BY_SITE } from "@/lib/constants";
import { useStore } from "@/lib/store";

interface Props {
  onStart: (goal: string) => void;
  onReset: () => void;
}

export function GoalInput({ onStart, onReset }: Props) {
  const running      = useStore((s) => s.run.status === "running");
  const demoSite     = useStore((s) => s.demoSite);
  const setHistoryOpen = useStore((s) => s.setHistoryOpen);

  const presets = PRESETS_BY_SITE[demoSite];
  const [value, setValue] = useState(presets[0]);

  useEffect(() => {
    setValue(presets[0]);
  }, [demoSite, presets]);

  const handleChip = (preset: string) => {
    setValue(preset);
    if (!running) onStart(preset);
  };

  return (
    <div className="flex items-center gap-3 min-w-0">
      <label className="flex items-baseline gap-2 min-w-0">
        <span
          className="font-mono text-[10px] uppercase shrink-0"
          style={{ color: "var(--ink-faint)", letterSpacing: "0.2em" }}
        >
          goal
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !running) onStart(value);
          }}
          className="bg-transparent px-3 py-2 text-[13px] font-display text-ink focus:outline-none w-[320px]"
          style={{
            borderBottom: "1px solid var(--hairline-strong)",
            letterSpacing: "-0.01em",
          }}
          placeholder="Enter goal…"
          aria-label="Optimization goal"
        />
      </label>

      <div className="hidden 2xl:flex items-center gap-1">
        {presets.slice(0, 3).map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleChip(preset)}
            disabled={running}
            className="text-[10px] font-mono uppercase px-2 py-1 transition-colors disabled:opacity-30"
            style={{
              color: "var(--ink-muted)",
              letterSpacing: "0.12em",
              borderBottom: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (!running) (e.currentTarget.style.borderBottom = "1px solid var(--ink)");
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottom = "1px solid transparent";
            }}
          >
            {preset.split(" ").slice(0, 3).join(" ")}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onStart(value)}
        disabled={running}
        className={clsx(
          "text-[11px] font-mono uppercase px-4 py-2 transition-colors",
          running ? "cursor-not-allowed" : "hover:opacity-90"
        )}
        style={{
          background: running ? "transparent" : "var(--ink)",
          color: running ? "var(--ink-faint)" : "var(--bone)",
          border: running ? "1px solid var(--hairline)" : "1px solid var(--ink)",
          letterSpacing: "0.16em",
        }}
      >
        {running ? "running…" : "run loop →"}
      </button>

      <button
        type="button"
        onClick={onReset}
        className="text-[11px] font-mono uppercase px-3 py-2 transition-colors"
        style={{
          color: "var(--ink-muted)",
          border: "1px solid var(--hairline)",
          letterSpacing: "0.16em",
        }}
      >
        reset
      </button>

      <button
        type="button"
        onClick={() => setHistoryOpen(true)}
        className="text-[11px] font-mono uppercase px-2 py-2 transition-colors hover:text-ink"
        style={{
          color: "var(--ink-faint)",
          letterSpacing: "0.16em",
        }}
      >
        history
      </button>
    </div>
  );
}
