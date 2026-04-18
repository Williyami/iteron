"use client";

export function ApplyingOverlay() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none applying-pulse"
      style={{
        background: "color-mix(in oklch, var(--bone) 70%, transparent)",
        backdropFilter: "saturate(0.8)",
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className="font-display italic text-[22px] text-ink"
          style={{ letterSpacing: "-0.02em" }}
        >
          applying <span className="text-signal">config</span>
        </div>
        <div
          className="font-mono text-[10px] uppercase"
          style={{ color: "var(--ink-muted)", letterSpacing: "0.3em" }}
        >
          · live on pageturn
        </div>
      </div>
    </div>
  );
}
