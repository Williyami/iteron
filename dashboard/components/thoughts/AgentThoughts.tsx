"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useStore } from "@/lib/store";
import type { Thought } from "@/lib/types";

function formatT(ms: number) {
  const s = Math.floor(ms / 1000);
  const ss = String(s % 60).padStart(2, "0");
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  return `+${mm}:${ss}.${cs}`;
}

export function AgentThoughts() {
  const thoughts = useStore((s) => s.thoughts);
  const running = useStore((s) => s.run.status === "running");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [thoughts.length]);

  return (
    <section
      className="h-full flex flex-col min-h-0 bg-paper"
      style={{ border: "1px solid var(--hairline)" }}
    >
      <div
        className="flex items-baseline justify-between px-5 py-2.5"
        style={{ borderBottom: "1px solid var(--hairline)" }}
      >
        <span
          className="font-mono text-[10px] uppercase"
          style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}
        >
          live log · auto-scroll
        </span>
        <span
          className="font-mono text-[10px] uppercase tabular-nums"
          style={{ color: "var(--ink-faint)", letterSpacing: "0.18em" }}
        >
          {String(thoughts.length).padStart(2, "0")} events
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin thoughts-mask px-5 py-4 min-h-0"
      >
        {thoughts.length === 0 && (
          <div
            className="font-mono text-[11px] uppercase"
            style={{ color: "var(--ink-faint)", letterSpacing: "0.2em" }}
          >
            {running ? "// awaiting first signal" : "// idle — press run loop"}
          </div>
        )}
        <AnimatePresence initial={false}>
          {thoughts.map((t) => (
            <ThoughtLine key={t.id} thought={t} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ThoughtLine({ thought }: { thought: Thought }) {
  const [expanded, setExpanded] = useState(false);
  const isAnalyst = thought.agent === "analyst";
  const tint = isAnalyst ? "var(--moss)" : "var(--signal)";
  const tag = isAnalyst ? "analyst" : "optimizer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
      className="py-1.5"
    >
      <button
        type="button"
        onClick={() => setExpanded((x) => !x)}
        className="w-full text-left flex items-start gap-3 group"
      >
        <span
          className="font-mono text-[10px] tabular-nums pt-1 shrink-0 w-[72px]"
          style={{ color: "var(--ink-faint)" }}
        >
          {formatT(thought.timestamp)}
        </span>
        <span
          className={clsx("font-mono text-[9px] uppercase pt-1 shrink-0 w-[68px]")}
          style={{ color: tint, letterSpacing: "0.16em" }}
        >
          {tag}
        </span>
        <span
          className="font-display text-[14px] leading-[1.55] text-ink group-hover:text-ink"
          style={{ letterSpacing: "-0.005em" }}
        >
          {thought.text}
        </span>
      </button>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pl-[152px] overflow-hidden"
        >
          <div
            className="font-mono text-[10px] uppercase py-1"
            style={{ color: "var(--ink-faint)", letterSpacing: "0.14em" }}
          >
            agent={thought.agent} · t={thought.timestamp}ms
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
