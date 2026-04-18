"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
      style={{ background: checked ? "var(--signal)" : "var(--hairline-strong)" }}
    >
      <span
        className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}

function SettingRow({
  label, description, children, danger,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4" style={{ borderBottom: "1px solid var(--hairline-soft)" }}>
      <div className="min-w-0 flex-1">
        <div
          className="text-[13px] font-semibold"
          style={{ color: danger ? "var(--rust)" : "var(--ink)" }}
        >
          {label}
        </div>
        <div className="text-[12px] mt-0.5 leading-relaxed" style={{ color: "var(--ink-faint)" }}>
          {description}
        </div>
      </div>
      <div className="shrink-0 mt-0.5">{children}</div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--hairline)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
    >
      <div
        className="px-5 py-3"
        style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}
      >
        <span className="font-mono text-[10px] uppercase" style={{ color: "var(--ink-faint)", letterSpacing: "0.18em" }}>
          {title}
        </span>
      </div>
      <div className="px-5 last:[&>div]:border-0">{children}</div>
    </div>
  );
}

function NumberInput({
  value, onChange, min, max, suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-16 text-center font-mono text-[12px] rounded-lg px-2 py-1.5 outline-none"
        style={{
          border: "1px solid var(--border)",
          background: "var(--surface-2)",
          color: "var(--ink)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--signal)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
      {suffix && <span className="text-[11px]" style={{ color: "var(--ink-faint)" }}>{suffix}</span>}
    </div>
  );
}

export function SettingsPanel() {
  const mode        = useStore((s) => s.mode);
  const setMode     = useStore((s) => s.setMode);
  const demoSite    = useStore((s) => s.demoSite);
  const setDemoSite = useStore((s) => s.setDemoSite);
  const reset       = useStore((s) => s.reset);

  const [confirmBeforeApply, setConfirmBeforeApply] = useState(false);
  const [autoScale,          setAutoScale]          = useState(true);
  const [emailAlerts,        setEmailAlerts]        = useState(false);
  const [slackAlerts,        setSlackAlerts]        = useState(false);
  const [showIris,           setShowIris]           = useState(true);
  const [debugMode,          setDebugMode]          = useState(false);
  const [minSample,          setMinSample]          = useState("200");
  const [confidence,         setConfidence]         = useState("95");
  const [maxRuns,            setMaxRuns]            = useState("10");
  const [retention,          setRetention]          = useState("90");
  const [targetMetric,       setTargetMetric]       = useState("ctr");
  const [saved,              setSaved]              = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <div className="font-mono text-[11px] uppercase" style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}>config</div>
        <div className="mt-1" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}>
          <em style={{ fontStyle: "normal", color: "var(--signal)" }}>Settings</em>
        </div>
        <div className="mt-1 text-[13px]" style={{ color: "var(--ink-muted)" }}>
          Configure how Iteron agents behave, alert, and apply changes.
        </div>
      </div>

      {/* Agent behaviour */}
      <SectionCard title="Agent behaviour">
        <SettingRow
          label="Require human confirmation before applying changes"
          description="Pauses the loop after config generation and waits for your approval before going live. Recommended for production."
        >
          <Toggle checked={confirmBeforeApply} onChange={setConfirmBeforeApply} />
        </SettingRow>
        <SettingRow
          label="Auto-scale winning variants"
          description="Automatically promote a winning test variant to 100% of users once statistical confidence is reached."
        >
          <Toggle checked={autoScale} onChange={setAutoScale} />
        </SettingRow>
        <SettingRow
          label="Target optimisation metric"
          description="The primary signal agents will maximise during each run."
        >
          <select
            value={targetMetric}
            onChange={(e) => setTargetMetric(e.target.value)}
            className="text-[12px] rounded-lg px-2.5 py-1.5 outline-none"
            style={{
              border: "1px solid var(--border)",
              background: "var(--surface-2)",
              color: "var(--ink)",
            }}
          >
            <option value="ctr">Click-through rate</option>
            <option value="cart">Add-to-cart rate</option>
            <option value="revenue">Revenue per session</option>
            <option value="bounce">Bounce rate (lower)</option>
          </select>
        </SettingRow>
        <SettingRow
          label="Max optimisation runs per day"
          description="Limits automated loops in a 24-hour window. Manual runs from the widget are excluded."
        >
          <NumberInput value={maxRuns} onChange={setMaxRuns} min={1} max={50} />
        </SettingRow>
        <SettingRow
          label="Execution mode"
          description="Demo mode runs a scripted simulation locally. Live mode hits the real Python agent API."
        >
          <div className="flex items-center gap-2">
            {(["demo", "live"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="text-[11px] font-mono uppercase px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: mode === m ? "var(--signal)" : "var(--surface-2)",
                  color: mode === m ? "white" : "var(--ink-muted)",
                  border: `1px solid ${mode === m ? "var(--signal)" : "var(--border)"}`,
                  fontWeight: mode === m ? 700 : 400,
                  letterSpacing: "0.06em",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </SettingRow>
        <SettingRow
          label="Demo site"
          description="The storefront shown in the preview iframe. Switching sites resets segments and presets."
        >
          <div className="flex items-center gap-2">
            {(["pageturn", "novawear"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setDemoSite(s)}
                className="text-[11px] font-mono uppercase px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: demoSite === s ? "var(--signal)" : "var(--surface-2)",
                  color: demoSite === s ? "white" : "var(--ink-muted)",
                  border: `1px solid ${demoSite === s ? "var(--signal)" : "var(--border)"}`,
                  fontWeight: demoSite === s ? 700 : 400,
                  letterSpacing: "0.06em",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </SettingRow>
      </SectionCard>

      {/* A/B testing */}
      <SectionCard title="A/B testing">
        <SettingRow
          label="Minimum sample size per variant"
          description="Iteron waits until each bucket has this many click events before declaring a winner."
        >
          <NumberInput value={minSample} onChange={setMinSample} min={50} max={5000} />
        </SettingRow>
        <SettingRow
          label="Statistical confidence threshold"
          description="Minimum confidence required before a variant can be scaled."
        >
          <NumberInput value={confidence} onChange={setConfidence} min={80} max={99} suffix="%" />
        </SettingRow>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications">
        <SettingRow
          label="Email alerts on run completion"
          description="Receive a summary email after each loop with segment, lift, and rollout status."
        >
          <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
        </SettingRow>
        <SettingRow
          label="Slack notifications"
          description="Post a message to a Slack channel when Iteron completes a run or awaits confirmation."
        >
          <Toggle checked={slackAlerts} onChange={setSlackAlerts} />
        </SettingRow>
        <SettingRow
          label="Show Iris HUD overlay during runs"
          description="Full-screen scanning animation over the store preview while agents are active."
        >
          <Toggle checked={showIris} onChange={setShowIris} />
        </SettingRow>
      </SectionCard>

      {/* Developer */}
      <SectionCard title="Developer">
        <SettingRow
          label="Data retention period"
          description="Days of click_events and run history kept in Supabase before automatic purge."
        >
          <NumberInput value={retention} onChange={setRetention} min={7} max={365} suffix="days" />
        </SettingRow>
        <SettingRow
          label="Debug mode"
          description="Log full agent prompts, raw LLM responses, and SQL queries to the browser console."
        >
          <Toggle checked={debugMode} onChange={setDebugMode} />
        </SettingRow>
      </SectionCard>

      {/* Danger zone */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid color-mix(in oklch, var(--rust) 40%, var(--hairline))", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
      >
        <div
          className="px-5 py-3"
          style={{ borderBottom: "1px solid color-mix(in oklch, var(--rust) 25%, var(--hairline))", background: "color-mix(in oklch, var(--rust) 5%, var(--surface))" }}
        >
          <span className="font-mono text-[10px] uppercase" style={{ color: "var(--rust)", letterSpacing: "0.18em" }}>
            Danger zone
          </span>
        </div>
        <div className="px-5">
          <SettingRow
            label="Reset all active configs"
            description="Deactivates every ui_config record and returns the storefront to its default state. Cannot be undone."
            danger
          >
            <button
              onClick={reset}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{
                border: "1px solid color-mix(in oklch, var(--rust) 40%, transparent)",
                color: "var(--rust)",
                background: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in oklch, var(--rust) 8%, transparent)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Reset store
            </button>
          </SettingRow>
          <SettingRow
            label="Purge all run history"
            description="Permanently deletes all run history, click events, and ui_config records from the database."
            danger
          >
            <button
              className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{
                border: "1px solid color-mix(in oklch, var(--rust) 40%, transparent)",
                color: "var(--rust)",
                background: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in oklch, var(--rust) 8%, transparent)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Purge data
            </button>
          </SettingRow>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-4 pb-10">
        {saved && (
          <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "var(--signal)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Saved
          </div>
        )}
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--signal)", color: "white" }}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
