"use client";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useStore } from "@/lib/store";
import type { Agent, NodeId, NodeState } from "@/lib/types";
import { NODE_HEIGHT, NODE_WIDTH, PIPELINE_CONFIG } from "./pipeline-config";

interface Props {
  id: NodeId;
}

const STATE_LABEL: Record<NodeState, string> = {
  idle: "idle",
  active: "running",
  complete: "done",
  error: "fail",
};

export function PipelineNode({ id }: Props) {
  const config = PIPELINE_CONFIG.find((n) => n.id === id)!;
  const node = useStore((s) => s.pipeline.nodes.find((n) => n.id === id));
  if (!node) return null;
  const state: NodeState = node.state;
  const agent: Agent = config.agent;

  const agentTint = agent === "analyst" ? "var(--moss)" : "var(--signal)";
  const agentLabel = agent === "analyst" ? "analyst" : "optimizer";

  const borderColor =
    state === "idle"
      ? "var(--hairline)"
      : state === "active"
      ? agentTint
      : state === "complete"
      ? "var(--hairline-strong)"
      : "var(--rust)";

  const backgroundColor =
    state === "active"
      ? agent === "analyst"
        ? "color-mix(in oklch, var(--moss) 6%, var(--paper))"
        : "color-mix(in oklch, var(--signal) 8%, var(--paper))"
      : state === "complete"
      ? "var(--paper)"
      : "var(--bone)";

  const shakeClass = state === "error" ? "x-shake" : "";

  const stepNumber = PIPELINE_CONFIG.findIndex((n) => n.id === id) + 1;
  const cleanLabel = config.label.replace(/^\[|\]$/g, "").toLowerCase();

  return (
    <foreignObject
      x={config.x}
      y={config.y}
      width={NODE_WIDTH}
      height={NODE_HEIGHT}
    >
      <div
        className={clsx(
          "relative h-full w-full overflow-hidden transition-colors",
          shakeClass
        )}
        style={{
          border: `1px solid ${borderColor}`,
          background: backgroundColor,
        }}
      >
        {state === "active" && (
          <div
            className="absolute inset-0 pointer-events-none node-glow-sweep"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${agentTint}14 50%, transparent 100%)`,
            }}
          />
        )}

        <div className="relative h-full flex flex-col justify-between p-3">
          <div className="flex items-baseline gap-2">
            <span
              className="font-mono text-[10px] tabular-nums"
              style={{ color: "var(--ink-faint)", letterSpacing: "0.1em" }}
            >
              0{stepNumber}
            </span>
            <span
              className="font-display text-[15px] leading-none text-ink"
              style={{ letterSpacing: "-0.02em", fontWeight: 500 }}
            >
              {cleanLabel}
            </span>
          </div>

          <div className="flex items-end justify-between gap-2">
            <span
              className="font-mono text-[9px] uppercase"
              style={{
                color: agentTint,
                opacity: state === "idle" ? 0.4 : 0.95,
                letterSpacing: "0.18em",
              }}
            >
              {agentLabel}
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase" style={{ letterSpacing: "0.18em" }}>
              <AnimatePresence mode="popLayout">
                {state === "complete" && (
                  <motion.span
                    key="check"
                    initial={{ x: 8, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
                    style={{ color: "var(--signal)" }}
                    aria-hidden
                  >
                    ✓
                  </motion.span>
                )}
                {state === "error" && (
                  <motion.span
                    key="x"
                    initial={{ x: 8, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.24 }}
                    style={{ color: "var(--rust)" }}
                    aria-hidden
                  >
                    ✗
                  </motion.span>
                )}
              </AnimatePresence>
              <span
                className="tabular-nums"
                style={{
                  color:
                    state === "active"
                      ? "var(--signal)"
                      : state === "complete"
                      ? "var(--ink-muted)"
                      : state === "idle"
                      ? "var(--ink-faint)"
                      : "var(--rust)",
                }}
              >
                {STATE_LABEL[state]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </foreignObject>
  );
}
