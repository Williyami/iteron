"use client";

import { PipelineNode } from "./PipelineNode";
import { PipelineEdge } from "./PipelineEdge";
import { PIPELINE_CONFIG, VIEWBOX_HEIGHT, VIEWBOX_WIDTH } from "./pipeline-config";

export function PipelineGraph() {
  const ids = PIPELINE_CONFIG.map((n) => n.id);
  const pairs: Array<[typeof ids[number], typeof ids[number]]> = [];
  for (let i = 0; i < ids.length - 1; i++) {
    pairs.push([ids[i], ids[i + 1]]);
  }

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {pairs.map(([from, to]) => (
          <PipelineEdge key={`${from}-${to}`} from={from} to={to} />
        ))}
        {PIPELINE_CONFIG.map((n) => (
          <PipelineNode key={n.id} id={n.id} />
        ))}
      </svg>
    </div>
  );
}
