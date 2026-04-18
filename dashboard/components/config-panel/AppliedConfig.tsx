"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

export function AppliedConfig() {
  const applied = useStore((s) => s.appliedConfig);
  const [open, setOpen] = useState(false);

  return (
    <section
      className="bg-paper p-5"
      style={{ border: "1px solid var(--hairline)" }}
    >
      <div className="flex items-baseline justify-between mb-3">
        <span
          className="font-mono text-[10px] uppercase"
          style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}
        >
          applied diagnosis
        </span>
        {applied && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="font-mono text-[10px] uppercase transition-colors hover:text-ink"
            style={{ color: "var(--ink-muted)", letterSpacing: "0.2em" }}
          >
            {open ? "hide raw" : "view raw ↓"}
          </button>
        )}
      </div>
      {!applied ? (
        <div
          className="font-mono text-[11px] uppercase py-3"
          style={{ color: "var(--ink-faint)", letterSpacing: "0.2em" }}
        >
          // no config applied yet
        </div>
      ) : (
        <>
          <p
            className="display-italic text-[15px] leading-[1.55] text-ink"
            style={{ letterSpacing: "-0.005em" }}
          >
            “{applied.rootCause}”
          </p>
          <AnimatePresence initial={false}>
            {open && (
              <motion.pre
                key="raw"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 p-3 font-mono text-[10.5px] leading-[1.7] overflow-auto max-h-[160px]"
                style={{
                  background: "var(--bone)",
                  color: "var(--ink-muted)",
                  border: "1px solid var(--hairline)",
                }}
              >
                {JSON.stringify(applied.configJson, null, 2)}
              </motion.pre>
            )}
          </AnimatePresence>
        </>
      )}
    </section>
  );
}
