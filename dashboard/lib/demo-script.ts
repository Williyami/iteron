import type { RunEvent } from "./types";

type ScriptEvent = RunEvent;

const SCRIPT: ScriptEvent[] = [
  { t: 0, type: "run.start", goal: "__GOAL__" },
  { t: 200, type: "node.active", node: "fetch" },
  { t: 400, type: "thought", agent: "analyst", text: "Connecting to Supabase…" },
  { t: 1000, type: "thought", agent: "analyst", text: "Pulling 1,247 click events from last 24h" },
  { t: 2000, type: "thought", agent: "analyst", text: "Mystery: 1.2% CTR · Romance: 3.4% · Sci-Fi: 4.1%" },
  { t: 2500, type: "node.complete", node: "fetch" },
  { t: 2600, type: "node.active", node: "diagnose" },
  { t: 3000, type: "thought", agent: "analyst", text: "Mystery underperforming by 67% vs Romance baseline" },
  { t: 4500, type: "thought", agent: "analyst", text: "Hypothesis: tag language is too literary, lacks emotional hook" },
  { t: 5500, type: "thought", agent: "analyst", text: "Root cause: 'Detective Fiction' tag tests 41% lower than 'Edge-of-your-seat'" },
  { t: 6000, type: "segment.update", segment: "Mystery", ctr: 0.012 },
  { t: 6500, type: "node.complete", node: "diagnose" },
  { t: 6600, type: "node.active", node: "generate" },
  { t: 7000, type: "thought", agent: "optimizer", text: "Generating new config: emotional tag set + reorder by recency" },
  { t: 9500, type: "thought", agent: "optimizer", text: "Config drafted: 3 tags, 3 reorder positions, layout=emotional" },
  { t: 10000, type: "node.complete", node: "generate" },
  { t: 10100, type: "node.active", node: "ab" },
  { t: 10500, type: "thought", agent: "optimizer", text: "Splitting Mystery traffic 50/50: control vs test" },
  { t: 12000, type: "thought", agent: "optimizer", text: "A/B running on 247 sessions/min sample rate" },
  { t: 13000, type: "node.complete", node: "ab" },
  { t: 13100, type: "node.active", node: "measure" },
  { t: 13500, type: "thought", agent: "optimizer", text: "Sample size 100 · p-value drifting toward significance" },
  { t: 17000, type: "thought", agent: "optimizer", text: "Sample size 500 · test variant +28% lift · p<0.05" },
  { t: 19000, type: "thought", agent: "optimizer", text: "Sample size 1,000 · +34.2% lift confirmed" },
  { t: 20000, type: "segment.update", segment: "Mystery", ctr: 0.0161 },
  {
    t: 20500,
    type: "ab.result",
    segment: "Mystery",
    ctrBefore: 0.012,
    ctrAfter: 0.0161,
    winner: "test",
    rootCause:
      "'Detective Fiction' tag tested 41% lower than emotional alternatives. Replaced with 'Suspenseful', 'Gripping', 'Edge-of-your-seat'.",
    configJson: {
      tags: ["Suspenseful", "Gripping", "Edge-of-your-seat"],
      sort_order: ["what-the-river-knows", "the-hollow-hour", "cold-case-protocol"],
      layout: "emotional",
    },
  },
  { t: 22000, type: "thought", agent: "optimizer", text: "Scaling test variant to 100% of Mystery traffic" },
  { t: 23000, type: "thought", agent: "optimizer", text: "✓ Applied. Optimization complete." },
  { t: 23500, type: "node.complete", node: "measure" },
  { t: 23800, type: "run.complete" },
];

export function runDemoLoop(
  goal: string,
  dispatch: (event: RunEvent) => void
): () => void {
  const timeouts: ReturnType<typeof setTimeout>[] = [];
  for (const raw of SCRIPT) {
    const event: RunEvent =
      raw.type === "run.start" ? { ...raw, goal: goal || raw.goal } : raw;
    const id = setTimeout(() => dispatch(event), event.t);
    timeouts.push(id);
  }
  return () => {
    for (const id of timeouts) clearTimeout(id);
  };
}
