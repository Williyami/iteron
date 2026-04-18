import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  AbResult,
  AppliedConfigState,
  PipelineNode,
  RunEvent,
  RunRow,
  Segment,
  SegmentState,
  Thought,
  TickerEvent,
} from "./types";
import { INITIAL_SEGMENT_CTR, PIPELINE_NODES } from "./constants";

type Mode = "demo" | "live";
type RunStatus = "idle" | "running" | "complete" | "failed";

interface DashboardState {
  mode: Mode;
  run: { status: RunStatus; goal: string; startedAt: number | null };
  pipeline: { nodes: PipelineNode[] };
  thoughts: Thought[];
  segments: Record<Segment, SegmentState>;
  latestAb: AbResult | null;
  appliedConfig: AppliedConfigState | null;
  history: RunRow[];
  tickerEvents: TickerEvent[];
  historyOpen: boolean;

  startRun: (goal: string) => void;
  applyEvent: (event: RunEvent) => void;
  reset: () => void;
  setMode: (mode: Mode) => void;
  setHistory: (rows: RunRow[]) => void;
  setTickerSeed: (events: TickerEvent[]) => void;
  pushTickerEvent: (event: TickerEvent) => void;
  setHistoryOpen: (open: boolean) => void;
}

const freshPipeline = (): PipelineNode[] =>
  PIPELINE_NODES.map((n) => ({ ...n, state: "idle" }));

const freshSegments = (): Record<Segment, SegmentState> => ({
  Mystery: { ctr: INITIAL_SEGMENT_CTR.Mystery, lastUpdated: 0 },
  Romance: { ctr: INITIAL_SEGMENT_CTR.Romance, lastUpdated: 0 },
  "Sci-Fi": { ctr: INITIAL_SEGMENT_CTR["Sci-Fi"], lastUpdated: 0 },
});

let thoughtSeq = 0;
const nextThoughtId = () => `t-${Date.now()}-${++thoughtSeq}`;

export const useStore = create<DashboardState>()(
  subscribeWithSelector((set) => ({
    mode: "demo",
    run: { status: "idle", goal: "", startedAt: null },
    pipeline: { nodes: freshPipeline() },
    thoughts: [],
    segments: freshSegments(),
    latestAb: null,
    appliedConfig: null,
    history: [],
    tickerEvents: [],
    historyOpen: false,

    startRun: (goal) =>
      set(() => ({
        run: { status: "running", goal, startedAt: Date.now() },
        pipeline: { nodes: freshPipeline() },
        thoughts: [],
        latestAb: null,
        appliedConfig: null,
      })),

    applyEvent: (event) =>
      set((state) => {
        switch (event.type) {
          case "run.start":
            return {
              run: { status: "running", goal: event.goal, startedAt: Date.now() },
            };
          case "node.active":
          case "node.complete":
          case "node.error": {
            const nextState =
              event.type === "node.active"
                ? "active"
                : event.type === "node.complete"
                ? "complete"
                : "error";
            return {
              pipeline: {
                nodes: state.pipeline.nodes.map((n) =>
                  n.id === event.node ? { ...n, state: nextState } : n
                ),
              },
            };
          }
          case "thought":
            return {
              thoughts: [
                ...state.thoughts,
                {
                  id: nextThoughtId(),
                  text: event.text,
                  agent: event.agent,
                  timestamp: event.t,
                },
              ],
            };
          case "segment.update":
            return {
              segments: {
                ...state.segments,
                [event.segment]: {
                  ctr: event.ctr,
                  lastUpdated: Date.now(),
                },
              },
            };
          case "ab.result": {
            const improvementPct =
              ((event.ctrAfter - event.ctrBefore) / event.ctrBefore) * 100;
            return {
              latestAb: {
                segment: event.segment,
                ctrBefore: event.ctrBefore,
                ctrAfter: event.ctrAfter,
                improvementPct,
                winner: event.winner,
                configJson: event.configJson,
                rootCause: event.rootCause,
                appliedAt: Date.now(),
              },
              appliedConfig: {
                rootCause: event.rootCause,
                configJson: event.configJson,
              },
            };
          }
          case "run.complete":
            return {
              run: { ...state.run, status: "complete" },
            };
          default:
            return {};
        }
      }),

    reset: () =>
      set(() => ({
        run: { status: "idle", goal: "", startedAt: null },
        pipeline: { nodes: freshPipeline() },
        thoughts: [],
        latestAb: null,
        appliedConfig: null,
      })),

    setMode: (mode) => set({ mode }),
    setHistory: (history) => set({ history }),
    setTickerSeed: (tickerEvents) => set({ tickerEvents }),
    pushTickerEvent: (event) =>
      set((state) => ({
        tickerEvents: [...state.tickerEvents.slice(-120), event],
      })),
    setHistoryOpen: (historyOpen) => set({ historyOpen }),
  }))
);
