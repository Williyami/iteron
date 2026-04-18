"use client";

import { useStore } from "@/lib/store";
import clsx from "clsx";

export function DemoModeToggle() {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);

  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-lg text-[12px]"
      role="group"
      aria-label="Mode"
      style={{ border: "1px solid var(--border)" }}
    >
      <button
        type="button"
        onClick={() => setMode("demo")}
        className={clsx("px-4 py-2 transition-colors")}
        style={{
          background: mode === "demo" ? "var(--ink)" : "var(--surface)",
          color: mode === "demo" ? "var(--bone)" : "var(--ink-muted)",
          fontWeight: mode === "demo" ? 600 : 500,
        }}
      >
        Demo
      </button>
      <button
        type="button"
        onClick={() => setMode("live")}
        className={clsx("px-4 py-2 transition-colors")}
        style={{
          background: mode === "live" ? "var(--ink)" : "var(--surface)",
          color: mode === "live" ? "var(--bone)" : "var(--ink-muted)",
          borderLeft: "1px solid var(--border)",
          fontWeight: mode === "live" ? 600 : 500,
        }}
      >
        Live
      </button>
    </div>
  );
}
