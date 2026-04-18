"use client";

import { useStore } from "@/lib/store";

export function PulseIndicator() {
  const running = useStore((s) => s.run.status === "running");

  return (
    <div className="relative h-3.5 w-3.5 flex items-center justify-center" aria-hidden>
      <div
        className={`absolute h-2 w-2 rounded-full ${
          running ? "pulse-halo" : "pulse-halo-idle"
        }`}
        style={{
          background: running ? "var(--signal)" : "var(--ink)",
          willChange: "transform, opacity",
        }}
      />
      <div
        className="relative h-2 w-2 rounded-full"
        style={{
          background: running ? "var(--signal)" : "var(--ink)",
        }}
      />
    </div>
  );
}
