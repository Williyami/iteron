import { create } from "zustand";
import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware";
import type {
  AbResult,
  AppliedConfigState,
  DemoSite,
  PipelineNode,
  RunEvent,
  RunRow,
  SegmentState,
  Thought,
  TickerEvent,
} from "./types";
import { INITIAL_CTR_BY_SITE, PIPELINE_NODES } from "./constants";

type Mode = "demo" | "live";
type RunStatus = "idle" | "running" | "paused" | "complete" | "failed";

interface DashboardState {
  mode: Mode;
  demoSite: DemoSite;
  run: { status: RunStatus; goal: string; startedAt: number | null };
  pipeline: { nodes: PipelineNode[] };
  thoughts: Thought[];
  segments: Record<string, SegmentState>;
  latestAb: AbResult | null;
  appliedConfig: AppliedConfigState | null;
  history: RunRow[];
  tickerEvents: TickerEvent[];
  historyOpen: boolean;

  startRun: (goal: string) => void;
  pauseRun: () => void;
  resumeRun: () => void;
  applyEvent: (event: RunEvent) => void;
  reset: () => void;
  setMode: (mode: Mode) => void;
  setDemoSite: (site: DemoSite) => void;
  setHistory: (rows: RunRow[]) => void;
  setTickerSeed: (events: TickerEvent[]) => void;
  pushTickerEvent: (event: TickerEvent) => void;
  setHistoryOpen: (open: boolean) => void;
}

const freshPipeline = (): PipelineNode[] =>
  PIPELINE_NODES.map((n) => ({ ...n, state: "idle" }));

const freshSegments = (site: DemoSite = "pageturn"): Record<string, SegmentState> =>
  Object.fromEntries(
    Object.entries(INITIAL_CTR_BY_SITE[site]).map(([seg, ctr]) => [
      seg,
      { ctr, lastUpdated: 0 },
    ])
  );

let thoughtSeq = 0;
const nextThoughtId = () => `t-${Date.now()}-${++thoughtSeq}`;

const isLocalRow = (id: string) => id.startsWith("local-");

const mergeHistory = (incoming: RunRow[], existing: RunRow[]): RunRow[] => {
  const incomingIds = new Set(incoming.map((r) => r.id));
  const localOnly = existing.filter((r) => isLocalRow(r.id) && !incomingIds.has(r.id));
  return [...localOnly, ...incoming]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 200);
};

export const useStore = create<DashboardState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
    mode: "demo",
    demoSite: "pageturn",
    run: { status: "idle", goal: "", startedAt: null },
    pipeline: { nodes: freshPipeline() },
    thoughts: [],
    segments: freshSegments("pageturn"),
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

    pauseRun: () =>
      set((state) =>
        state.run.status === "running"
          ? { run: { ...state.run, status: "paused" } }
          : {}
      ),

    resumeRun: () =>
      set((state) =>
        state.run.status === "paused"
          ? { run: { ...state.run, status: "running" } }
          : {}
      ),

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
          case "run.complete": {
            const ab = state.latestAb;
            const row: RunRow = {
              id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              goal: state.run.goal || null,
              segment_targeted: ab?.segment ?? null,
              ctr_before: ab?.ctrBefore ?? null,
              ctr_after: ab?.ctrAfter ?? null,
              improvement_pct: ab?.improvementPct ?? null,
              winner_variant: ab?.winner ?? null,
              status: "complete",
              error_message: null,
              created_at: new Date().toISOString(),
            };
            return {
              run: { ...state.run, status: "complete" },
              history: [row, ...state.history].slice(0, 200),
            };
          }
          default:
            return {};
        }
      }),

    reset: () =>
      set((state) => ({
        run: { status: "idle", goal: "", startedAt: null },
        pipeline: { nodes: freshPipeline() },
        thoughts: [],
        latestAb: null,
        appliedConfig: null,
        segments: freshSegments(state.demoSite),
      })),

    setMode: (mode) => set({ mode }),

    setDemoSite: (demoSite) =>
      set(() => ({
        demoSite,
        segments: freshSegments(demoSite),
        run: { status: "idle", goal: "", startedAt: null },
        pipeline: { nodes: freshPipeline() },
        thoughts: [],
        latestAb: null,
        appliedConfig: null,
      })),

    setHistory: (rows) =>
      set((state) => ({ history: mergeHistory(rows, state.history) })),
    setTickerSeed: (tickerEvents) => set({ tickerEvents }),
    pushTickerEvent: (event) =>
      set((state) => ({
        tickerEvents: [...state.tickerEvents.slice(-120), event],
      })),
    setHistoryOpen: (historyOpen) => set({ historyOpen }),
      }),
      {
        name: "iteron-dashboard",
        version: 2,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          mode: state.mode,
          demoSite: state.demoSite,
          history: state.history,
          segments: state.segments,
          latestAb: state.latestAb,
          appliedConfig: state.appliedConfig,
        }),
      }
    )
  )
);
