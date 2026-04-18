import type { PipelineNode, Segment } from "./types";

export const SEGMENTS: Segment[] = ["Mystery", "Romance", "Sci-Fi"];

export const PIPELINE_NODES: PipelineNode[] = [
  { id: "fetch", agent: "analyst", label: "[FETCH DATA]", state: "idle" },
  { id: "diagnose", agent: "analyst", label: "[AI DIAGNOSIS]", state: "idle" },
  { id: "generate", agent: "optimizer", label: "[GEN CONFIG]", state: "idle" },
  { id: "ab", agent: "optimizer", label: "[SETUP A/B]", state: "idle" },
  { id: "measure", agent: "optimizer", label: "[MEASURE]", state: "idle" },
];

export const GOAL_PRESETS = [
  "Improve CTR across all segments",
  "Boost Mystery genre conversion",
  "Reduce bounce rate on Sci-Fi",
  "Maximize cart adds for Romance",
];

export const DEMO_LOOP_DURATION_MS = 25000;

export const INITIAL_SEGMENT_CTR: Record<Segment, number> = {
  Mystery: 0.012,
  Romance: 0.034,
  "Sci-Fi": 0.041,
};
