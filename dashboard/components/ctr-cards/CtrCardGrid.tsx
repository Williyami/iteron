"use client";

import { SEGMENTS } from "@/lib/constants";
import { CtrCard } from "./CtrCard";

export function CtrCardGrid() {
  return (
    <div
      className="flex flex-col bg-paper"
      style={{ border: "1px solid var(--hairline)" }}
    >
      <div
        className="flex items-baseline justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--hairline)" }}
      >
        <span
          className="font-mono text-[10px] uppercase"
          style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}
        >
          ctr · by segment
        </span>
        <span
          className="font-mono text-[9px] uppercase"
          style={{ color: "var(--signal)", letterSpacing: "0.22em" }}
        >
          ◆ live
        </span>
      </div>
      <div className="flex flex-col">
        {SEGMENTS.map((s) => (
          <CtrCard key={s} segment={s} />
        ))}
      </div>
    </div>
  );
}
