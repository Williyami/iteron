"use client";

import { useStore } from "@/lib/store";
import clsx from "clsx";

export function DemoModeToggle() {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);

  return (
    <div
      className="inline-flex items-center text-[10px] font-mono uppercase"
      role="group"
      aria-label="Mode"
      style={{ border: "1px solid var(--hairline-strong)", letterSpacing: "0.18em" }}
    >
      <button
        type="button"
        onClick={() => setMode("demo")}
        className={clsx("px-3 py-1.5 transition-colors")}
        style={{
          background: mode === "demo" ? "var(--ink)" : "transparent",
          color: mode === "demo" ? "var(--bone)" : "var(--ink-muted)",
        }}
      >
        demo
      </button>
      <button
        type="button"
        onClick={() => setMode("live")}
        className={clsx("px-3 py-1.5 transition-colors")}
        style={{
          background: mode === "live" ? "var(--ink)" : "transparent",
          color: mode === "live" ? "var(--bone)" : "var(--ink-muted)",
          borderLeft: "1px solid var(--hairline-strong)",
        }}
      >
        live
      </button>
    </div>
  );
}
