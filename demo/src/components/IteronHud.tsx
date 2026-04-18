import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const IteronHud = () => {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const logRef = useRef(logs);
  logRef.current = logs;

  const pushLog = (msg: string) => {
    const line = `${new Date().toLocaleTimeString()} · ${msg}`;
    setLogs((l) => [line, ...l].slice(0, 3));
  };

  const runLoop = async () => {
    setRunning(true);
    pushLog("Loop started");
    window.dispatchEvent(new CustomEvent("iteron-loop-start"));
    // POST /api/run-loop placeholder
    console.log("POST /api/run-loop");
    // Activate a sample mystery config so the storefront updates live
    try {
      await supabase.from("ui_config").insert({
        segment: "Mystery",
        variant: "test",
        active: true,
        config_json: {
          tags: ["Suspenseful", "Gripping", "Edge-of-your-seat"],
          sort_order: ["what-the-river-knows", "the-hollow-hour", "cold-case-protocol"],
        },
      });
      pushLog("Config v1 activated");
    } catch (e) {
      pushLog("Config insert failed");
      console.warn(e);
    }
    window.dispatchEvent(new CustomEvent("iteron-loop-complete"));
    pushLog("Loop complete");
    setRunning(false);
  };

  const reset = async () => {
    pushLog("Resetting…");
    try {
      // Deactivate all configs (only inserts allowed publicly — emit event so UI resets locally)
    } catch {}
    window.dispatchEvent(new CustomEvent("iteron-reset"));
    pushLog("Reset complete");
  };

  useEffect(() => {
    const onStart = () => {};
    const onDone = () => {};
    window.addEventListener("iteron-loop-start", onStart);
    window.addEventListener("iteron-loop-complete", onDone);
    return () => {
      window.removeEventListener("iteron-loop-start", onStart);
      window.removeEventListener("iteron-loop-complete", onDone);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {open ? (
        <div className="w-[300px] bg-card border border-hairline rounded-md shadow-[var(--shadow-card)] animate-fade-up overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
            <div className="flex items-center gap-2">
              <span className="text-amber">⚡</span>
              <span className="text-[11px] uppercase tracking-[0.22em] text-paper">Iteron AI</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-paper text-sm"
              aria-label="close"
            >
              ✕
            </button>
          </div>
          <div className="p-4 space-y-2">
            <button
              onClick={runLoop}
              disabled={running}
              className="w-full text-[11px] uppercase tracking-[0.22em] py-2.5 bg-amber text-ink hover:opacity-90 disabled:opacity-60 transition-opacity rounded-sm"
            >
              {running ? "Running…" : "Run Loop"}
            </button>
            <button
              onClick={reset}
              className="w-full text-[11px] uppercase tracking-[0.22em] py-2.5 border border-hairline text-paper hover:border-amber/50 transition-colors rounded-sm"
            >
              Reset
            </button>
          </div>
          <div className="px-4 pb-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
              Activity
            </div>
            <div className="space-y-1 min-h-[60px]">
              {logs.length === 0 && (
                <div className="text-xs text-muted-foreground/60 italic">No activity yet.</div>
              )}
              {logs.map((l, i) => (
                <div key={i} className="text-[11px] text-muted-foreground font-mono">
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber text-ink rounded-full text-[11px] uppercase tracking-[0.22em] shadow-[var(--shadow-amber)] animate-pulse-amber hover:scale-105 transition-transform"
        >
          <span>⚡</span> Iteron
        </button>
      )}
    </div>
  );
};
