"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Agent, NodeId, NodeState } from "@/lib/types";
import { NODE_HEIGHT, NODE_WIDTH, PIPELINE_CONFIG } from "./pipeline-config";

interface Props {
  id: NodeId;
}

const STATE_LABEL: Record<NodeState, string> = {
  idle: "IDLE",
  active: "RUN",
  complete: "DONE",
  error: "FAIL",
};

export function PipelineNode({ id }: Props) {
  const config = PIPELINE_CONFIG.find((n) => n.id === id)!;
  const node = useStore((s) => s.pipeline.nodes.find((n) => n.id === id));
  if (!node) return null;

  const state: NodeState = node.state;
  const agent: Agent = config.agent;
  const isAnalyst = agent === "analyst";

  const agentTint = isAnalyst ? "var(--moss)" : "var(--signal)";
  const agentLabel = isAnalyst ? "ANALYST" : "OPTIM";

  const borderColor =
    state === "idle"
      ? "var(--hairline)"
      : state === "active"
      ? agentTint
      : state === "complete"
      ? "var(--hairline-strong)"
      : "var(--rust)";

  const bgFill = state === "complete" ? "var(--paper)" : "var(--bone)";

  const fillColor = isAnalyst
    ? "color-mix(in oklch, var(--moss) 10%, var(--paper))"
    : "color-mix(in oklch, var(--signal) 12%, var(--paper))";

  const stateColor =
    state === "active"
      ? "var(--signal)"
      : state === "complete"
      ? "var(--ink-muted)"
      : state === "idle"
      ? "var(--ink-faint)"
      : "var(--rust)";

  const showFill = state === "active" || state === "complete";
  const stepNumber = PIPELINE_CONFIG.findIndex((n) => n.id === id) + 1;
  const cleanLabel = config.label.replace(/^\[|\]$/g, "").toLowerCase();

  const W = NODE_WIDTH;
  const H = NODE_HEIGHT;

  return (
    <g
      transform={`translate(${config.x},${config.y})`}
      className={state === "error" ? "x-shake" : ""}
    >
      {/* Background */}
      <rect width={W} height={H} rx={14} fill={bgFill} stroke={borderColor} strokeWidth={1} />

      {/* Active/complete fill overlay */}
      {showFill && (
        <motion.rect
          key={`fill-${id}`}
          width={W}
          height={H}
          rx={14}
          fill={fillColor}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.3, 0.7, 0.2, 1] }}
          style={{ transformBox: "fill-box", transformOrigin: "left center" }}
        />
      )}

      {/* Step number */}
      <text
        x={12}
        y={21}
        fontSize={9}
        fontFamily="var(--font-mono, ui-monospace, monospace)"
        fill="var(--ink-faint)"
        letterSpacing="1"
      >
        0{stepNumber}
      </text>

      {/* Node label */}
      <text
        x={28}
        y={21}
        fontSize={13}
        fontWeight={500}
        fill="var(--ink)"
        letterSpacing="-0.3"
      >
        {cleanLabel}
      </text>

      {/* Agent label — bottom left */}
      <text
        x={12}
        y={H - 11}
        fontSize={8}
        fontFamily="var(--font-mono, ui-monospace, monospace)"
        fill={agentTint}
        letterSpacing="1.5"
        opacity={state === "idle" ? 0.4 : 0.95}
      >
        {agentLabel}
      </text>

      {/* State icon — bottom right */}
      <AnimatePresence mode="popLayout">
        {(state === "complete" || state === "error") && (
          <motion.text
            key="icon"
            x={W - 32}
            y={H - 11}
            fontSize={8}
            fill={state === "complete" ? "var(--signal)" : "var(--rust)"}
            initial={{ opacity: 0, x: W - 24 }}
            animate={{ opacity: 1, x: W - 32 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
          >
            {state === "complete" ? "✓" : "✗"}
          </motion.text>
        )}
      </AnimatePresence>
      <text
        x={W - 12}
        y={H - 11}
        fontSize={8}
        fontFamily="var(--font-mono, ui-monospace, monospace)"
        fill={stateColor}
        letterSpacing="1.5"
        textAnchor="end"
      >
        {STATE_LABEL[state]}
      </text>
    </g>
  );
}
