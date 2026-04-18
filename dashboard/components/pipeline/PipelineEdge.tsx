"use client";

import { useStore } from "@/lib/store";
import type { NodeId } from "@/lib/types";
import { NODE_HEIGHT, NODE_WIDTH, PIPELINE_CONFIG } from "./pipeline-config";

interface Props {
  from: NodeId;
  to: NodeId;
}

export function PipelineEdge({ from, to }: Props) {
  const fromNode = PIPELINE_CONFIG.find((n) => n.id === from)!;
  const toNode = PIPELINE_CONFIG.find((n) => n.id === to)!;

  const x1 = fromNode.x + NODE_WIDTH;
  const x2 = toNode.x;
  const y = NODE_HEIGHT / 2;

  const fromState = useStore((s) => s.pipeline.nodes.find((n) => n.id === from)?.state);
  const toState = useStore((s) => s.pipeline.nodes.find((n) => n.id === to)?.state);

  const flowing = fromState === "complete" && toState === "active";
  const traversed = fromState === "complete" && (toState === "complete" || toState === "active");

  return (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={traversed ? "var(--signal)" : "var(--ink)"}
        strokeOpacity={traversed ? 0.7 : 0.15}
        strokeWidth={1}
      />
      {flowing && (
        <line
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke="var(--signal)"
          strokeWidth={1.5}
          className="edge-flowing"
        />
      )}
      <path
        d={`M ${x2 - 5} ${y - 3.5} L ${x2} ${y} L ${x2 - 5} ${y + 3.5}`}
        fill="none"
        stroke={traversed ? "var(--signal)" : "var(--ink)"}
        strokeOpacity={traversed ? 0.8 : 0.22}
        strokeWidth={1}
      />
    </g>
  );
}
