import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// ── types ─────────────────────────────────────────────────────────────────────
interface AgentStep {
  agent: string;
  node: string;
  status: "running" | "complete" | "error";
  message: string;
  data?: Record<string, unknown>;
}

interface Preset {
  key: string;
  label: string;
  steps: AgentStep[];
  applyConfig: {
    segment: string;
    configJson: Record<string, unknown>;
  };
}

// ── PageTurn presets ──────────────────────────────────────────────────────────
const PAGETURN_PRESETS: Preset[] = [
  {
    key: "mystery",
    label: "Boost Mystery shelf CTR",
    steps: [
      { agent: "analyst",   node: "fetch_data",        status: "running",  message: "Querying click_events — Mystery segment, 24h" },
      { agent: "analyst",   node: "fetch_data",        status: "complete", message: "7,412 events ingested · Mystery CTR: 1.2% (lowest)", data: { segments: { Mystery: 0.012, Romance: 0.048, "Sci-Fi": 0.031 }, lowest_segment: "Mystery" } },
      { agent: "analyst",   node: "identify_problem",  status: "running",  message: "Asking LLM to diagnose root cause" },
      { agent: "analyst",   node: "identify_problem",  status: "complete", message: "Root cause: tag labels don't match reader intent", data: { root_cause: "Literary tags under-resonate vs emotional framing.", segment: "Mystery" } },
      { agent: "optimizer", node: "generate_config",   status: "running",  message: "Generating optimised UI config for Mystery" },
      { agent: "optimizer", node: "generate_config",   status: "complete", message: "Config ready: 3 new tags + reordered sort", data: { segment: "Mystery", tags: ["Suspenseful", "Gripping", "Edge-of-your-seat"] } },
      { agent: "optimizer", node: "setup_ab_test",     status: "running",  message: "Splitting users 50/50 — activating test variant" },
      { agent: "optimizer", node: "setup_ab_test",     status: "complete", message: "A/B test live · control vs test · Mystery segment" },
      { agent: "optimizer", node: "measure_results",   status: "running",  message: "Waiting for enough clicks to declare a winner…" },
      { agent: "optimizer", node: "measure_results",   status: "complete", message: "Test wins! +38% CTR lift · scaling to 100%", data: { segment: "Mystery", ctr_control: 0.012, ctr_test: 0.0166, improvement: "+38%", winner: "test" } },
    ],
    applyConfig: {
      segment: "Mystery",
      configJson: { tags: ["Suspenseful", "Gripping", "Edge-of-your-seat"], sort_order: ["m3", "m1", "m2"] },
    },
  },
  {
    key: "scifi",
    label: "Boost Sci-Fi shelf CTR",
    steps: [
      { agent: "analyst",   node: "fetch_data",        status: "running",  message: "Loading Sci-Fi funnel — clicks + dwell time" },
      { agent: "analyst",   node: "fetch_data",        status: "complete", message: "Sci-Fi: 4.1% CTR but 72% bounce", data: { segment: "Sci-Fi", bounce: 0.72 } },
      { agent: "analyst",   node: "identify_problem",  status: "running",  message: "Diagnosing engagement drop-off" },
      { agent: "analyst",   node: "identify_problem",  status: "complete", message: "Root cause: page misses world-building intent" },
      { agent: "optimizer", node: "generate_config",   status: "running",  message: "Config: immersive layout + premise-first copy" },
      { agent: "optimizer", node: "generate_config",   status: "complete", message: "Config ready: immersive hero + world-building copy" },
      { agent: "optimizer", node: "setup_ab_test",     status: "running",  message: "Splitting Sci-Fi traffic — current vs immersive" },
      { agent: "optimizer", node: "setup_ab_test",     status: "complete", message: "A/B test live · Sci-Fi segment" },
      { agent: "optimizer", node: "measure_results",   status: "running",  message: "Collecting bounce-rate signal" },
      { agent: "optimizer", node: "measure_results",   status: "complete", message: "Test wins! +29% CTR · bounce -24pts", data: { segment: "Sci-Fi", ctr_control: 0.041, ctr_test: 0.053, improvement: "+29%", winner: "test" } },
    ],
    applyConfig: {
      segment: "Sci-Fi",
      configJson: { layout: "immersive", description_style: "world-building", hero_book: "sci-fi-01" },
    },
  },
  {
    key: "romance",
    label: "Boost Romance cart-add rate",
    steps: [
      { agent: "analyst",   node: "fetch_data",        status: "running",  message: "Pulling Romance cart events — last 48h" },
      { agent: "analyst",   node: "fetch_data",        status: "complete", message: "Romance: 3.4% CTR · 0.6% cart-add (low)" },
      { agent: "analyst",   node: "identify_problem",  status: "running",  message: "Diagnosing conversion drop-off" },
      { agent: "analyst",   node: "identify_problem",  status: "complete", message: "Root cause: CTA below fold + hidden price" },
      { agent: "optimizer", node: "generate_config",   status: "running",  message: "Config: inline CTA + persistent price + bundle prompt" },
      { agent: "optimizer", node: "generate_config",   status: "complete", message: "Config ready: inline CTA variant" },
      { agent: "optimizer", node: "setup_ab_test",     status: "running",  message: "Splitting Romance traffic — hover vs inline" },
      { agent: "optimizer", node: "setup_ab_test",     status: "complete", message: "A/B test live · Romance segment" },
      { agent: "optimizer", node: "measure_results",   status: "running",  message: "Measuring cart-add rate" },
      { agent: "optimizer", node: "measure_results",   status: "complete", message: "Test wins! +41% cart rate", data: { segment: "Romance", ctr_control: 0.034, ctr_test: 0.048, improvement: "+41%", winner: "test" } },
    ],
    applyConfig: {
      segment: "Romance",
      configJson: { cta_position: "inline", price_display: "prominent", bundle_offer: true },
    },
  },
];

// ── NovaWear presets ──────────────────────────────────────────────────────────
const NOVAWEAR_PRESETS: Preset[] = [
  {
    key: "womens",
    label: "Boost Women's collection CTR",
    steps: [
      { agent: "analyst",   node: "fetch_data",        status: "running",  message: "Fetching Women's sessions — last 24h" },
      { agent: "analyst",   node: "fetch_data",        status: "complete", message: "Womens CTR: 1.4% (lowest) · 58% of sessions", data: { segment: "Womens" } },
      { agent: "analyst",   node: "identify_problem",  status: "running",  message: "Diagnosing Women's underperformance" },
      { agent: "analyst",   node: "identify_problem",  status: "complete", message: "Root cause: Oversized Blazer buried at position 4" },
      { agent: "optimizer", node: "generate_config",   status: "running",  message: "Generating editorial layout for Women's" },
      { agent: "optimizer", node: "generate_config",   status: "complete", message: "Config ready: pin nw-03, editorial hero" },
      { agent: "optimizer", node: "setup_ab_test",     status: "running",  message: "Splitting Women's traffic 50/50" },
      { agent: "optimizer", node: "setup_ab_test",     status: "complete", message: "A/B test live · editorial layout" },
      { agent: "optimizer", node: "measure_results",   status: "running",  message: "Collecting impressions" },
      { agent: "optimizer", node: "measure_results",   status: "complete", message: "Test wins! +50% CTR · scaling to 100%", data: { segment: "Womens", ctr_control: 0.014, ctr_test: 0.021, improvement: "+50%", winner: "test" } },
    ],
    applyConfig: {
      segment: "Womens",
      configJson: { pinned: ["ines-blazer"], badge: "New", active_tab: "womens", hero_variant: "editorial" },
    },
  },
  {
    key: "mens",
    label: "Boost Men's collection CTR",
    steps: [
      { agent: "analyst",   node: "fetch_data",        status: "running",  message: "Loading Men's — sessions + bounce heatmap" },
      { agent: "analyst",   node: "fetch_data",        status: "complete", message: "Mens: 1.8% CTR · 64% bounce" },
      { agent: "analyst",   node: "identify_problem",  status: "running",  message: "Diagnosing hero slot performance" },
      { agent: "analyst",   node: "identify_problem",  status: "complete", message: "Root cause: Suit Jacket buried at position 3" },
      { agent: "optimizer", node: "generate_config",   status: "running",  message: "Config: pin nw-07, Men's tab default" },
      { agent: "optimizer", node: "generate_config",   status: "complete", message: "Config ready: editorial hero variant" },
      { agent: "optimizer", node: "setup_ab_test",     status: "running",  message: "Splitting Men's traffic" },
      { agent: "optimizer", node: "setup_ab_test",     status: "complete", message: "A/B test live · Men's segment" },
      { agent: "optimizer", node: "measure_results",   status: "running",  message: "Measuring CTR + bounce" },
      { agent: "optimizer", node: "measure_results",   status: "complete", message: "Test wins! +44% CTR · bounce -16pts", data: { segment: "Mens", ctr_control: 0.018, ctr_test: 0.026, improvement: "+44%", winner: "test" } },
    ],
    applyConfig: {
      segment: "Mens",
      configJson: { active_tab: "mens", pinned: ["vance-blazer"], hero_variant: "mens" },
    },
  },
  {
    key: "sale",
    label: "Boost Sale segment conversion",
    steps: [
      { agent: "analyst",   node: "fetch_data",        status: "running",  message: "Fetching Sale funnel — last 72h" },
      { agent: "analyst",   node: "fetch_data",        status: "complete", message: "Sale: 4.8% CTR · 1.8% conversion" },
      { agent: "analyst",   node: "identify_problem",  status: "running",  message: "Diagnosing high-intent drop-off" },
      { agent: "analyst",   node: "identify_problem",  status: "complete", message: "Root cause: no urgency signals, weak CTA" },
      { agent: "optimizer", node: "generate_config",   status: "running",  message: "Config: urgency banner + strong CTA" },
      { agent: "optimizer", node: "generate_config",   status: "complete", message: "Config ready: urgency layout" },
      { agent: "optimizer", node: "setup_ab_test",     status: "running",  message: "Splitting Sale traffic" },
      { agent: "optimizer", node: "setup_ab_test",     status: "complete", message: "A/B test live · Sale segment" },
      { agent: "optimizer", node: "measure_results",   status: "running",  message: "Measuring conversion + CTR" },
      { agent: "optimizer", node: "measure_results",   status: "complete", message: "Test wins! +62% conversion", data: { segment: "Sale", ctr_control: 0.021, ctr_test: 0.034, improvement: "+62%", winner: "test" } },
    ],
    applyConfig: {
      segment: "Sale",
      configJson: { layout: "urgency", hero_variant: "sale", cta: "Shop now — ends tonight", active_tab: "sale" },
    },
  },
  {
    key: "accessories",
    label: "Boost Accessories cart-add rate",
    steps: [
      { agent: "analyst",   node: "fetch_data",        status: "running",  message: "Pulling accessories funnel" },
      { agent: "analyst",   node: "fetch_data",        status: "complete", message: "Accessories: 0.8% cart · 34% scroll" },
      { agent: "analyst",   node: "identify_problem",  status: "running",  message: "Diagnosing discoverability" },
      { agent: "analyst",   node: "identify_problem",  status: "complete", message: "Root cause: buried below fold, no cross-sell" },
      { agent: "optimizer", node: "generate_config",   status: "running",  message: "Config: pin nw-09, cross-sell at 60%" },
      { agent: "optimizer", node: "generate_config",   status: "complete", message: "Config ready: cross-sell layout" },
      { agent: "optimizer", node: "setup_ab_test",     status: "running",  message: "Splitting traffic 50/50" },
      { agent: "optimizer", node: "setup_ab_test",     status: "complete", message: "A/B test live · Accessories" },
      { agent: "optimizer", node: "measure_results",   status: "running",  message: "Measuring cart rate" },
      { agent: "optimizer", node: "measure_results",   status: "complete", message: "Test wins! +75% cart rate", data: { segment: "Accessories", ctr_control: 0.008, ctr_test: 0.014, improvement: "+75%", winner: "test" } },
    ],
    applyConfig: {
      segment: "Accessories",
      configJson: { pinned: ["orion-belt"], badge: "Limited", layout: "cross-sell" },
    },
  },
];

const STEP_DELAYS = [300, 800, 300, 900, 300, 1000, 300, 700, 300, 1200];

// ── Overlay ───────────────────────────────────────────────────────────────────
const IrisOverlay = ({
  running, steps,
}: { running: boolean; steps: AgentStep[] }) => {
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
    targets.forEach((el) => { el.classList.add("iris-highlight"); el.style.setProperty("--iris-color", color); });
    return () => { targets.forEach((el) => { el.classList.remove("iris-highlight"); el.style.removeProperty("--iris-color"); }); };
  }, [running, steps]);

  if (!running) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent 0%, #2563eb 30%, #2563eb 70%, transparent 100%)",
        boxShadow: "0 0 20px 4px rgba(37,99,235,0.4)",
        animation: "iris-scan 4s ease-in-out infinite",
      }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <path d="M40 80 L40 40 L80 40"             fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.45" />
        <path d="M1840 40 L1880 40 L1880 80"       fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.45" />
        <path d="M40 1000 L40 1040 L80 1040"       fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.45" />
        <path d="M1840 1040 L1880 1040 L1880 1000" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.45" />
      </svg>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
interface IrisHudProps {
  site?: "pageturn" | "novawear";
}

export const IrisHud = ({ site = "pageturn" }: IrisHudProps) => {
  const [running, setRunning] = useState(false);
  const [steps, setSteps]     = useState<AgentStep[]>([]);
  const timersRef             = useRef<ReturnType<typeof setTimeout>[]>([]);
  const runningRef            = useRef(false);

  const presets = site === "novawear" ? NOVAWEAR_PRESETS : PAGETURN_PRESETS;

  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };

  const addOrUpdateStep = useCallback((step: AgentStep) => {
    setSteps((prev) => {
      const key = `${step.agent}:${step.node}`;
      const idx = prev.findIndex((s) => `${s.agent}:${s.node}` === key);
      if (idx >= 0) { const u = [...prev]; u[idx] = step; return u; }
      return [...prev, step];
    });
  }, []);

  const runLoop = useCallback(async (presetKey?: string | null) => {
    if (runningRef.current) return;
    runningRef.current = true;
    setRunning(true); setSteps([]);
    const preset = presets.find((p) => p.key === presetKey) ?? presets[0];
    window.dispatchEvent(new CustomEvent("iteron-loop-start"));
    let elapsed = 0;
    preset.steps.forEach((step, i) => {
      elapsed += STEP_DELAYS[i] ?? 600;
      const t = setTimeout(() => {
        addOrUpdateStep(step);
      }, elapsed);
      timersRef.current.push(t);
    });
    const total = STEP_DELAYS.reduce((a, b) => a + b, 0) + 300;
    const ft = setTimeout(async () => {
      const { segment, configJson } = preset.applyConfig;
      if (site === "novawear") {
        try { localStorage.setItem("iteron_novawear_config", JSON.stringify(configJson)); } catch { /* silent */ }
      } else {
        try {
          await supabase.from("ui_config").insert({ segment, variant: "test", active: true, config_json: configJson as never });
        } catch { /* silent */ }
      }
      window.dispatchEvent(new CustomEvent("iteron-loop-complete"));
      window.dispatchEvent(new CustomEvent("iteron-config", { detail: configJson }));
      runningRef.current = false;
      setRunning(false);
    }, total);
    timersRef.current.push(ft);
  }, [addOrUpdateStep, presets, site]);

  useEffect(() => () => clearTimers(), []);

  const runLoopRef = useRef(runLoop);
  useEffect(() => { runLoopRef.current = runLoop; }, [runLoop]);

  // ⌘K / Ctrl+K → run default preset for the current site
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        runLoopRef.current(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Dashboard-driven triggers (iframe postMessage + BroadcastChannel)
  useEffect(() => {
    const handle = (data: { type: string; preset?: string; payload?: unknown }) => {
      if (data?.type === "iteron:run-start") {
        runLoopRef.current(data.preset ?? null);
      }
      if (data?.type === "iteron:run-complete") {
        window.dispatchEvent(new CustomEvent("iteron-loop-complete"));
        if (data.payload) {
          window.dispatchEvent(new CustomEvent("iteron-config", { detail: data.payload }));
        }
      }
    };
    const onMessage = (e: MessageEvent) => handle(e.data);
    const channel = new BroadcastChannel("iteron-demo");
    const onBroadcast = (e: MessageEvent) => handle(e.data);
    window.addEventListener("message", onMessage);
    channel.addEventListener("message", onBroadcast);
    return () => {
      window.removeEventListener("message", onMessage);
      channel.removeEventListener("message", onBroadcast);
      channel.close();
    };
  }, []);

  return <IrisOverlay running={running} steps={steps} />;
};
