"use client";

import { useStore } from "@/lib/store";
import type { NodeId } from "@/lib/types";
import { NODE_HEIGHT, NODE_WIDTH, PIPELINE_CONFIG } from "./pipeline-config";

interface Props {
  from: NodeId;
  to: NodeId;
}

const EDGE_PAD = 4;

export function PipelineEdge({ from, to }: Props) {
  const fromNode = PIPELINE_CONFIG.find((n) => n.id === from)!;
  const toNode = PIPELINE_CONFIG.find((n) => n.id === to)!;

  const x1 = fromNode.x + NODE_WIDTH + EDGE_PAD;
  const x2 = toNode.x - EDGE_PAD;
  const y = NODE_HEIGHT / 2;
  const length = x2 - x1;

  const fromState = useStore((s) => s.pipeline.nodes.find((n) => n.id === from)?.state);
  const toState = useStore((s) => s.pipeline.nodes.find((n) => n.id === to)?.state);

  // Line fills as soon as upstream completes; stays filled when downstream completes too.
  const shouldFill =
    fromState === "complete" && (toState === "idle" || toState === "active" || toState === "complete");

  return (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke="var(--border)"
        strokeWidth={1}
        strokeLinecap="round"
      />
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke="var(--signal)"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={shouldFill ? 0 : length}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.3,.7,.2,1)" }}
      />
    </g>
  );
}
