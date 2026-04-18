import type { PipelineNode, DemoSite } from "./types";

export const PAGETURN_SEGMENTS = ["Mystery", "Romance", "Sci-Fi"];
export const NOVAWEAR_SEGMENTS = ["Womens", "Mens", "Sale", "Accessories"];

export const SEGMENTS_BY_SITE: Record<DemoSite, string[]> = {
  pageturn: PAGETURN_SEGMENTS,
  novawear: NOVAWEAR_SEGMENTS,
};

export const PIPELINE_NODES: PipelineNode[] = [
  { id: "fetch", agent: "analyst", label: "[FETCH DATA]", state: "idle" },
  { id: "diagnose", agent: "analyst", label: "[AI DIAGNOSIS]", state: "idle" },
  { id: "generate", agent: "optimizer", label: "[GEN CONFIG]", state: "idle" },
  { id: "ab", agent: "optimizer", label: "[SETUP A/B]", state: "idle" },
  { id: "measure", agent: "optimizer", label: "[MEASURE]", state: "idle" },
];

export const PAGETURN_PRESETS = [
  "Improve CTR across all segments",
  "Boost Mystery genre conversion",
  "Reduce bounce rate on Sci-Fi",
  "Maximize cart adds for Romance",
];

export const NOVAWEAR_PRESETS = [
  "Boost Women's collection CTR",
  "Drive conversions on Sale",
  "Increase add-to-cart for accessories",
  "Reduce bounce on Men's",
];

export const PRESETS_BY_SITE: Record<DemoSite, string[]> = {
  pageturn: PAGETURN_PRESETS,
  novawear: NOVAWEAR_PRESETS,
};

export const DEMO_LOOP_DURATION_MS = 25000;

export const INITIAL_PAGETURN_CTR: Record<string, number> = {
  Mystery: 0.012,
  Romance: 0.034,
  "Sci-Fi": 0.041,
};

export const INITIAL_NOVAWEAR_CTR: Record<string, number> = {
  Womens: 0.014,
  Mens: 0.018,
  Sale: 0.021,
  Accessories: 0.008,
};

export const INITIAL_CTR_BY_SITE: Record<DemoSite, Record<string, number>> = {
  pageturn: INITIAL_PAGETURN_CTR,
  novawear: INITIAL_NOVAWEAR_CTR,
};
