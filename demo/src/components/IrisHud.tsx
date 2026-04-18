import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";

// ── types ─────────────────────────────────────────────────────────────────────
interface AgentStep {
  agent: string;
  node: string;
  status: "running" | "complete" | "error";
  message: string;
  data?: Record<string, unknown>;
}

interface AbResult {
  segment?: string;
  ctr_control?: number;
  ctr_test?: number;
  improvement?: string;
  winner?: string;
}

// ── Step metadata ─────────────────────────────────────────────────────────────
const STEP_META: Record<string, { icon: string; label: string }> = {
  "analyst:fetch_data":        { icon: "📊", label: "Reading CTR data" },
  "analyst:identify_problem":  { icon: "🧠", label: "Analyzing with AI" },
  "optimizer:generate_config": { icon: "⚙️", label: "Generating new config" },
  "optimizer:setup_ab_test":   { icon: "🔀", label: "Setting up A/B test" },
  "optimizer:measure_results": { icon: "📈", label: "Measuring results" },
};

// ── PageTurn demo steps ───────────────────────────────────────────────────────
const PAGETURN_STEPS: AgentStep[] = [
  { agent: "analyst",   node: "fetch_data",        status: "running",  message: "Querying click_events — last 24 h, all segments" },
  { agent: "analyst",   node: "fetch_data",        status: "complete", message: "7,412 events ingested · Mystery CTR: 1.2% (lowest)", data: { segments: { Mystery: 0.012, Romance: 0.048, "Sci-Fi": 0.031 }, lowest_segment: "Mystery" } },
  { agent: "analyst",   node: "identify_problem",  status: "running",  message: "Asking LLM to diagnose root cause" },
  { agent: "analyst",   node: "identify_problem",  status: "complete", message: "Root cause: tag labels don't match reader intent", data: { root_cause: "Tag labels don't resonate with the segment's preferred descriptors.", segment: "Mystery" } },
  { agent: "optimizer", node: "generate_config",   status: "running",  message: "Generating optimised UI config for Mystery" },
  { agent: "optimizer", node: "generate_config",   status: "complete", message: "Config ready: 3 new tags + reordered sort", data: { segment: "Mystery", tags: ["Suspenseful", "Gripping", "Edge-of-your-seat"] } },
  { agent: "optimizer", node: "setup_ab_test",     status: "running",  message: "Splitting users 50/50 and activating test variant" },
  { agent: "optimizer", node: "setup_ab_test",     status: "complete", message: "A/B test live · control vs test · Mystery segment" },
  { agent: "optimizer", node: "measure_results",   status: "running",  message: "Waiting for enough clicks to declare a winner…" },
  { agent: "optimizer", node: "measure_results",   status: "complete", message: "Test wins! +38% CTR lift · scaling to 100%", data: { segment: "Mystery", ctr_control: 0.012, ctr_test: 0.0166, improvement: "+38%", winner: "test" } },
];

// ── NovaWear demo steps ───────────────────────────────────────────────────────
const NOVAWEAR_STEPS: AgentStep[] = [
  { agent: "analyst",   node: "fetch_data",        status: "running",  message: "Querying session data — Women's, Men's, Sale, Accessories" },
  { agent: "analyst",   node: "fetch_data",        status: "complete", message: "4,218 sessions · Womens CTR: 1.4% (lowest)", data: { segments: { Womens: 0.014, Mens: 0.032, Sale: 0.048, Accessories: 0.008 }, lowest_segment: "Womens" } },
  { agent: "analyst",   node: "identify_problem",  status: "running",  message: "Asking LLM to diagnose root cause for Women's underperformance" },
  { agent: "analyst",   node: "identify_problem",  status: "complete", message: "Root cause: top product buried at position 4", data: { root_cause: "Oversized Blazer (nw-03) is the top performer but buried. Default tab doesn't surface bestsellers.", segment: "Womens" } },
  { agent: "optimizer", node: "generate_config",   status: "running",  message: "Generating optimised layout config for Women's" },
  { agent: "optimizer", node: "generate_config",   status: "complete", message: "Config ready: pin nw-03, 'New' badge, editorial hero", data: { pinned: ["nw-03"], badge: "New", active_tab: "womens", hero_variant: "editorial" } },
  { agent: "optimizer", node: "setup_ab_test",     status: "running",  message: "Splitting Women's traffic 50/50 — current vs editorial layout" },
  { agent: "optimizer", node: "setup_ab_test",     status: "complete", message: "A/B test live · control vs editorial · Womens segment" },
  { agent: "optimizer", node: "measure_results",   status: "running",  message: "Collecting impressions — waiting for significance…" },
  { agent: "optimizer", node: "measure_results",   status: "complete", message: "Test wins! +50% CTR lift · scaling to 100%", data: { segment: "Womens", ctr_control: 0.014, ctr_test: 0.021, improvement: "+50%", winner: "test" } },
];

const STEP_DELAYS = [400, 1200, 400, 1400, 400, 1600, 400, 900, 400, 1800];

// ── Iris overlay ──────────────────────────────────────────────────────────────
const IrisOverlay = ({
  running, steps, hudLines,
}: { running: boolean; steps: AgentStep[]; hudLines: string[] }) => {
  useEffect(() => {
    if (!running) return;
    const current = steps[steps.length - 1];
    const isScanning  = current?.node === "fetch_data"       && current.status === "running";
    const isTargeting = current?.node === "generate_config"  && current.status === "running";
    const allCards = Array.from(document.querySelectorAll("[data-product-card]")) as HTMLElement[];
    const fallback = allCards.length === 0
      ? Array.from(document.querySelectorAll(".rounded-lg")).filter((el) => el.querySelector("h3")) as HTMLElement[]
      : allCards;
    let targets: HTMLElement[] = [];
    if (isScanning)  targets = fallback;
    if (isTargeting) targets = fallback.slice(0, 2);
    const color = isScanning ? "#2563eb" : "#7c3aed";
    targets.forEach((el) => { el.classList.add("jarvis-highlight"); el.style.setProperty("--jarvis-color", color); });
    return () => { targets.forEach((el) => { el.classList.remove("jarvis-highlight"); el.style.removeProperty("--jarvis-color"); }); };
  }, [running, steps]);

  if (!running) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent 0%, #2563eb 30%, #2563eb 70%, transparent 100%)",
        boxShadow: "0 0 20px 4px rgba(37,99,235,0.4)",
        animation: "jarvis-scan 4s ease-in-out infinite",
      }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <path d="M40 80 L40 40 L80 40"             fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.45" />
        <path d="M1840 40 L1880 40 L1880 80"       fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.45" />
        <path d="M40 1000 L40 1040 L80 1040"       fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.45" />
        <path d="M1840 1040 L1880 1040 L1880 1000" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.45" />
      </svg>
      <div style={{
        position: "absolute", top: 20, left: 20,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(37,99,235,0.35)", borderRadius: 8,
        padding: "10px 16px", maxWidth: 340,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", animation: "jarvis-pulse 1s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace" }}>
            IRIS — ACTIVE
          </span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.6, color: "#60a5fa", opacity: 0.85 }}>
          {hudLines.slice(-5).map((line, i, arr) => (
            <div key={i} style={{ opacity: i === arr.length - 1 ? 1 : 0.5 }}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Main widget ───────────────────────────────────────────────────────────────
interface IrisHudProps {
  site?: "pageturn" | "novawear";
}

export const IrisHud = ({ site = "pageturn" }: IrisHudProps) => {
  const [open, setOpen]         = useState(false);
  const [running, setRunning]   = useState(false);
  const [goal, setGoal]         = useState("");
  const [steps, setSteps]       = useState<AgentStep[]>([]);
  const [result, setResult]     = useState<AbResult | null>(null);
  const [hudLines, setHudLines] = useState<string[]>([]);
  const stepsEndRef             = useRef<HTMLDivElement>(null);
  const timersRef               = useRef<ReturnType<typeof setTimeout>[]>([]);

  const demoSteps = site === "novawear" ? NOVAWEAR_STEPS : PAGETURN_STEPS;

  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  const addHudLine  = (line: string) => setHudLines((l) => [...l, `> ${line.toUpperCase()}`]);

  const addOrUpdateStep = useCallback((step: AgentStep) => {
    setSteps((prev) => {
      const key = `${step.agent}:${step.node}`;
      const idx = prev.findIndex((s) => `${s.agent}:${s.node}` === key);
      if (idx >= 0) { const u = [...prev]; u[idx] = step; return u; }
      return [...prev, step];
    });
    setTimeout(() => stepsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const runLoop = useCallback(async () => {
    if (running) return;
    setRunning(true); setSteps([]); setResult(null); setHudLines([]);
    window.dispatchEvent(new CustomEvent("iteron-loop-start"));
    let elapsed = 0;
    demoSteps.forEach((step, i) => {
      elapsed += STEP_DELAYS[i];
      const t = setTimeout(() => {
        addOrUpdateStep(step);
        if (step.status === "running") addHudLine(STEP_META[`${step.agent}:${step.node}`]?.label ?? step.node);
        if (step.status === "complete" && step.node === "measure_results") setResult(step.data as AbResult);
      }, elapsed);
      timersRef.current.push(t);
    });
    const total = STEP_DELAYS.reduce((a, b) => a + b, 0) + 300;
    const ft = setTimeout(async () => {
      if (site === "novawear") {
        const config = { pinned: ["nw-03"], badge: "New", active_tab: "womens", hero_variant: "editorial" };
        try { localStorage.setItem("iteron_novawear_config", JSON.stringify(config)); } catch { /* silent */ }
        window.dispatchEvent(new CustomEvent("iteron-loop-complete"));
      } else {
        try {
          await supabase.from("ui_config").insert({
            segment: "Mystery", variant: "test", active: true,
            config_json: { tags: ["Suspenseful", "Gripping", "Edge-of-your-seat"], sort_order: ["m3", "m1", "m2"] },
          });
        } catch { /* silent */ }
        window.dispatchEvent(new CustomEvent("iteron-loop-complete"));
      }
      setRunning(false);
    }, total);
    timersRef.current.push(ft);
  }, [running, addOrUpdateStep, demoSteps, site]);

  const reset = () => {
    clearTimers(); setRunning(false); setSteps([]); setResult(null); setHudLines([]);
    window.dispatchEvent(new CustomEvent("iteron-reset"));
  };

  useEffect(() => () => clearTimers(), []);

  const pct = (v: number) => (v * 100).toFixed(1) + "%";

  return (
    <>
      <IrisOverlay running={running} steps={steps} hudLines={hudLines} />
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
        {!open ? (
          <button onClick={() => setOpen(true)} title="Iris AI" style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "transparent",
            border: "2px solid #34d399",
            cursor: "pointer",
            boxShadow: "0 0 0 4px rgba(52,211,153,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BrandLogo variant="icon" className="h-5 w-5" />
          </button>
        ) : (
          <div style={{
            width: 400, maxHeight: "88vh",
            background: "#0a0a0f", border: "1px solid #1e1e2e",
            borderRadius: 12, display: "flex", flexDirection: "column",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)", overflow: "hidden",
            fontFamily: "'Jost', -apple-system, sans-serif",
          }}>
            {/* Header */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#e0e0e8" }}>
                  <span style={{ color: "#34d399" }}>Iris</span> AI
                </div>
                <div style={{ fontSize: 11, color: "#6b6b80", marginTop: 2 }}>Autonomous Personalization Engine</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#6b6b80", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            {/* Goal input */}
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #1e1e2e" }}>
              <input
                type="text" value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !running && runLoop()}
                placeholder={site === "novawear" ? "Goal — e.g. boost Women's CTR" : "Goal — e.g. boost Mystery CTR"}
                disabled={running}
                style={{
                  width: "100%", boxSizing: "border-box" as const,
                  background: "#0d0d14", border: "1px solid #1e1e2e",
                  borderRadius: 6, padding: "8px 12px",
                  fontSize: 12, color: "#e0e0e8", outline: "none",
                  fontFamily: "'Jost', sans-serif", opacity: running ? 0.5 : 1,
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e1e2e", display: "flex", gap: 8 }}>
              <button onClick={runLoop} disabled={running} style={{
                flex: 1, padding: "10px", borderRadius: 8, border: "none",
                background: running ? "#1e1e2e" : "#34d399",
                color: running ? "#6b6b80" : "#000",
                fontWeight: 600, fontSize: 13, cursor: running ? "not-allowed" : "pointer",
                fontFamily: "'Jost', sans-serif",
              }}>
                {running ? "⏳ Agents running..." : "▶ Run Iris Loop"}
              </button>
              <button onClick={reset} disabled={running} style={{
                padding: "10px 14px", borderRadius: 8,
                border: "1px solid #2a2a3e", background: "transparent",
                color: "#f87171", fontWeight: 600, fontSize: 12,
                cursor: running ? "not-allowed" : "pointer", opacity: running ? 0.4 : 1,
                fontFamily: "'Jost', sans-serif",
              }}>Reset</button>
            </div>

            {/* Steps */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", minHeight: 140, maxHeight: 320 }}>
              {steps.length === 0 && !result && (
                <div style={{ color: "#6b6b80", fontSize: 12, textAlign: "center", padding: "20px 0" }}>
                  Press the button to run the agent pipeline.
                  <br /><span style={{ fontSize: 11, opacity: 0.7 }}>Analyst reads data → AI diagnoses → Optimizer writes fix → A/B test</span>
                </div>
              )}
              {steps.map((step, i) => {
                const key = `${step.agent}:${step.node}`;
                const meta = STEP_META[key];
                const isRunning = step.status === "running";
                const isError   = step.status === "error";
                const agentColor = step.agent === "analyst" ? "#60a5fa" : step.agent === "optimizer" ? "#a78bfa" : "#6b6b80";
                return (
                  <div key={i} style={{
                    background: isRunning ? "#12121a" : isError ? "#1a0a0a" : "#0d0d14",
                    border: `1px solid ${isRunning ? "#2a2a3e" : isError ? "#3a1a1a" : "#161622"}`,
                    borderRadius: 8, padding: "10px 12px", marginBottom: 8, transition: "all 0.3s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14 }}>{meta?.icon ?? (isError ? "❌" : "⚡")}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: agentColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>{step.agent}</span>
                      <span style={{ fontSize: 11, color: "#6b6b80" }}>→</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#e0e0e8" }}>{meta?.label ?? step.node}</span>
                      <span style={{ marginLeft: "auto", fontSize: 10 }}>
                        {isRunning && <span style={{ color: "#fbbf24" }}>● Running</span>}
                        {step.status === "complete" && <span style={{ color: "#34d399" }}>✓ Done</span>}
                        {isError && <span style={{ color: "#f87171" }}>✕ Error</span>}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#9090a0", paddingLeft: 22 }}>{step.message}</div>
                    {step.data && step.status === "complete" && (
                      <div style={{
                        marginTop: 6, marginLeft: 22, padding: "6px 8px",
                        background: "#000", borderRadius: 4,
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                        lineHeight: 1.5, color: "#70e0a0", maxHeight: 90,
                        overflowY: "auto", whiteSpace: "pre-wrap",
                      }}>{JSON.stringify(step.data, null, 2)}</div>
                    )}
                  </div>
                );
              })}
              <div ref={stepsEndRef} />
            </div>

            {/* A/B result */}
            {result && (
              <div style={{ padding: "14px 16px", borderTop: "1px solid #1e1e2e", background: "#12121a" }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#34d399", marginBottom: 10, fontWeight: 700 }}>
                  ✓ Result — {result.segment}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
                  {[
                    { v: pct(result.ctr_control ?? 0), l: "Before",  c: "#f87171" },
                    { v: pct(result.ctr_test ?? 0),    l: "After",   c: "#34d399" },
                    { v: result.improvement ?? "—",    l: "Lift",    c: "#34d399" },
                    { v: result.winner === "test" ? "Scaled" : "No change", l: "Status", c: "#fbbf24" },
                  ].map(({ v, l, c }) => (
                    <div key={l}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono', monospace" }}>{v}</div>
                      <div style={{ fontSize: 10, color: "#6b6b80" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
