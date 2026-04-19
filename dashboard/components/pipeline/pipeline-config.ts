import type { NodeId, Agent } from "@/lib/types";

export interface PipelineNodeConfig {
  id: NodeId;
  agent: Agent;
  label: string;
  x: number;
  y: number;
}

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 96;
export const NODE_GAP = 80;
export const NODE_STEP = NODE_WIDTH + NODE_GAP;

export const PIPELINE_CONFIG: PipelineNodeConfig[] = [
  { id: "fetch", agent: "analyst", label: "[FETCH DATA]", x: 0, y: 0 },
  { id: "diagnose", agent: "analyst", label: "[AI DIAGNOSIS]", x: NODE_STEP * 1, y: 0 },
  { id: "generate", agent: "optimizer", label: "[GEN CONFIG]", x: NODE_STEP * 2, y: 0 },
  { id: "ab", agent: "optimizer", label: "[SETUP A/B]", x: NODE_STEP * 3, y: 0 },
  { id: "measure", agent: "optimizer", label: "[MEASURE]", x: NODE_STEP * 4, y: 0 },
];

export const VIEWBOX_WIDTH = NODE_STEP * 4 + NODE_WIDTH;
export const VIEWBOX_HEIGHT = NODE_HEIGHT;
