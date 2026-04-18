export type NodeId = "fetch" | "diagnose" | "generate" | "ab" | "measure";
export type NodeState = "idle" | "active" | "complete" | "error";
export type Segment = string;
export type DemoSite = "pageturn" | "novawear";
export type Agent = "analyst" | "optimizer";

export interface PipelineNode {
  id: NodeId;
  agent: Agent;
  label: string;
  state: NodeState;
}

export interface Thought {
  id: string;
  text: string;
  agent: Agent;
  timestamp: number;
}

export interface AbResult {
  segment: Segment;
  ctrBefore: number;
  ctrAfter: number;
  improvementPct: number;
  winner: "control" | "test";
  configJson: Record<string, unknown>;
  rootCause: string;
  appliedAt: number;
}

export interface AppliedConfigState {
  rootCause: string;
  configJson: Record<string, unknown>;
}

export interface SegmentState {
  ctr: number;
  lastUpdated: number;
}

export interface TickerEvent {
  id: string;
  time: string;
  userId: string;
  segment: string;
  eventType: "click" | "cart" | "bounce";
  bookId: string;
}

export interface RunRow {
  id: string;
  goal: string | null;
  segment_targeted: string | null;
  ctr_before: number | null;
  ctr_after: number | null;
  improvement_pct: number | null;
  winner_variant: string | null;
  status: "running" | "complete" | "failed";
  error_message: string | null;
  created_at: string;
}

export type RunEvent =
  | { type: "run.start"; goal: string; t: number }
  | { type: "node.active"; node: NodeId; t: number }
  | { type: "node.complete"; node: NodeId; t: number }
  | { type: "node.error"; node: NodeId; message: string; t: number }
  | { type: "thought"; agent: Agent; text: string; t: number }
  | { type: "segment.update"; segment: Segment; ctr: number; t: number }
  | {
      type: "ab.result";
      segment: Segment;
      ctrBefore: number;
      ctrAfter: number;
      winner: "control" | "test";
      configJson: Record<string, unknown>;
      rootCause: string;
      t: number;
    }
  | { type: "run.complete"; t: number };
