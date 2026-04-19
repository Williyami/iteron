import { useState } from "react";
import {
  LayoutDashboard, History, BarChart2, Settings,
  BookOpen, Zap, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  Bell, Shield, Sliders, Code2, RefreshCw, Users, Database, Eye,
  ExternalLink, ChevronRight, Activity, FlaskConical, Target,
  TriangleAlert, Info, Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { IrisHud } from "@/components/IrisHud";
import { usePageMeta } from "@/lib/use-page-meta";

// ── types ───────────────────────────────────────────────────────────────────
type Tab = "home" | "history" | "analytics" | "settings";

// ── Static demo data ───────────────────────────────────────────────────────
const PIPELINE = [
  { label: "Fetch Data",   agent: "Analyst",   sub: "CTR from DB",       agentColor: "text-blue-600",   status: "complete" },
  { label: "AI Diagnosis", agent: "Analyst",   sub: "Root cause",         agentColor: "text-blue-600",   status: "complete" },
  { label: "Gen Config",   agent: "Optimizer", sub: "Build UI config",    agentColor: "text-violet-600", status: "running"  },
  { label: "Setup A/B",    agent: "Optimizer", sub: "Split user groups",  agentColor: "text-violet-600", status: "idle"     },
  { label: "Measure",      agent: "Optimizer", sub: "Declare winner",     agentColor: "text-violet-600", status: "idle"     },
];

const SEGMENTS = [
  { seg: "Mystery",  ctr: "1.2%",  color: "text-red-500",   bg: "bg-red-50",    border: "border-red-200" },
  { seg: "Romance",  ctr: "4.8%",  color: "text-green-600", bg: "bg-green-50",  border: "border-green-200" },
  { seg: "Sci-Fi",   ctr: "3.1%",  color: "text-yellow-600",bg: "bg-yellow-50", border: "border-yellow-200" },
  { seg: "Fantasy",  ctr: "2.7%",  color: "text-blue-600",  bg: "bg-blue-50",   border: "border-blue-200" },
  { seg: "Thriller", ctr: "3.5%",  color: "text-green-600", bg: "bg-green-50",  border: "border-green-200" },
];

const STEPS = [
  { n: "01", agent: "Analyst",   agentColor: "text-blue-600",   agentBg: "bg-blue-50",   title: "Diagnose",   desc: "Queries click-event data from Supabase, calculates CTR per segment, and asks an LLM to identify the root cause of underperformance." },
  { n: "02", agent: "Optimizer", agentColor: "text-violet-600", agentBg: "bg-violet-50", title: "Prescribe",  desc: "Generates a production-ready UI config — tag labels, sort order, card layout — targeted at the underperforming segment." },
  { n: "03", agent: "Optimizer", agentColor: "text-violet-600", agentBg: "bg-violet-50", title: "A/B Test",   desc: "Splits users into control and test buckets, activates the new config for test, then measures real click-through lift from the DB." },
  { n: "04", agent: "System",    agentColor: "text-green-600",  agentBg: "bg-green-50",  title: "Scale",      desc: "Declares a winner. If the test variant wins, it's promoted to 100% and the result is persisted to the run history dashboard." },
];

const FEATURES = [
  { icon: "⚡", label: "Live SSE streaming",    desc: "Watch every agent step stream in real time — no polling, no page refreshes." },
  { icon: "🧠", label: "LLM-driven diagnosis",  desc: "Claude reads your CTR data and writes hypotheses, root causes, and configs." },
  { icon: "📊", label: "Real A/B measurement",  desc: "Lift is calculated from actual click_events timestamps — never fake numbers." },
  { icon: "🗄️", label: "Supabase persistence",  desc: "Every run, config, and result is stored. Row-level security keeps it safe." },
  { icon: "🎯", label: "Goal-aware agents",      desc: "Type a plain-English goal and both agents adjust their prompts to match." },
  { icon: "🔄", label: "One-click reset",        desc: "Deactivate all configs and return the store to defaults instantly." },
];

// ── Reusable small primitives ─────────────────────────────────────────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70 px-3 mb-1 mt-5 first:mt-0">
    {children}
  </div>
);

const NavItem = ({
  icon: Icon, label, active, onClick, badge,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      active
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    }`}
  >
    <Icon className="h-4 w-4 shrink-0" />
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
        active ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
      }`}>
        {badge}
      </span>
    )}
  </button>
);

const Toggle = ({
  checked, onChange,
}: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
      checked ? "bg-primary" : "bg-muted-foreground/30"
    }`}
  >
    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
      checked ? "translate-x-4" : "translate-x-0"
    }`} />
  </button>
);

const SettingRow = ({
  icon: Icon, label, description, children, danger,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}) => (
  <div className="flex items-start justify-between gap-4 py-4 border-b border-border last:border-0">
    <div className="flex gap-3 min-w-0">
      <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
        danger ? "bg-red-50 text-red-500" : "bg-secondary text-muted-foreground"
      }`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <div className={`text-sm font-medium ${danger ? "text-red-600" : "text-foreground"}`}>{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</div>
      </div>
    </div>
    <div className="shrink-0 mt-0.5">{children}</div>
  </div>
);

// ── View: Home ─────────────────────────────────────────────────────────────────
const HomeView = () => (
  <div className="space-y-8">
    {/* Hero row */}
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Autonomous optimization
        </div>
        <h1 className="text-3xl font-bold font-display leading-tight">
          Your UI, self-optimizing.<br />
          <span className="text-primary">No A/B backlog required.</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-lg">
          Iteron runs Analyst and Optimizer agents on your store. They find the worst-performing segment,
          generate a tailored UI config, run a real A/B test, and scale the winner — all without a human in the loop.
        </p>
      </div>
      <div className="flex gap-8 shrink-0">
        {[{ v: "12", l: "Runs total" }, { v: "+31%", l: "Avg lift" }, { v: "5", l: "Segments" }].map(({ v, l }) => (
          <div key={l} className="text-center">
            <div className="text-2xl font-bold font-display text-primary">{v}</div>
            <div className="text-xs text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Pipeline */}
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="bg-secondary border-b border-border px-5 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          {["#f87171", "#fbbf24", "#34d399"].map((c) => (
            <div key={c} style={{ background: c }} className="w-2.5 h-2.5 rounded-full" />
          ))}
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">Agent Pipeline</span>
        <span className="ml-auto text-[10px] text-muted-foreground">Last run · 2 min ago</span>
      </div>
      <div className="p-6">
        <div className="flex gap-0 items-stretch overflow-x-auto scrollbar-hide">
          {PIPELINE.map((node, i) => (
            <div key={i} className="flex items-center flex-1 min-w-0">
              <div className={`flex-1 min-w-0 rounded-lg p-3 border transition-all ${
                node.status === "complete" ? "border-green-300 bg-green-50" :
                node.status === "running"  ? "border-blue-300 bg-blue-50 animate-pulse" :
                                             "border-border bg-background"
              }`}>
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${node.agentColor}`}>{node.agent}</div>
                <div className={`text-xs font-bold ${ node.status === "idle" ? "text-muted-foreground" : "text-foreground" }`}>
                  {node.label}
                  {node.status === "running"  && <span className="ml-1 text-blue-500">●</span>}
                  {node.status === "complete" && <span className="ml-1 text-green-500">✓</span>}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{node.sub}</div>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className="flex items-center shrink-0 px-1">
                  <div className="w-4 h-px bg-border" />
                  <div className="border-y-4 border-y-transparent border-l-4 border-l-border" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-5">
          {SEGMENTS.map((s) => (
            <div key={s.seg} className={`rounded-lg border ${s.bg} ${s.border} p-3 flex justify-between items-center`}>
              <div>
                <div className="text-xs font-semibold">{s.seg}</div>
                <div className="text-[10px] text-muted-foreground">click-to-cart</div>
              </div>
              <div className={`text-lg font-bold font-mono ${s.color}`}>{s.ctr}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* How it works + recent runs */}
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">How it works</div>
        <h2 className="text-lg font-bold font-display mb-5">Four steps, zero human work</h2>
        <div className="space-y-4">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-4">
              <div className={`w-9 h-9 rounded-lg shrink-0 ${s.agentBg} flex items-center justify-center text-xs font-bold font-mono ${s.agentColor}`}>
                {s.n}
              </div>
              <div>
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${s.agentColor}`}>{s.agent}</div>
                <div className="text-sm font-bold mb-0.5">{s.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Recent Runs</div>
          <h2 className="text-lg font-bold font-display mb-4">Optimisation history</h2>
          {HISTORY_RUNS.slice(0, 4).map((r, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
              <div className="text-xs font-mono text-muted-foreground w-5">#{i + 1}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{r.seg}</div>
                <div className="text-xs text-muted-foreground">{r.winner} variant scaled</div>
              </div>
              <div className={`text-sm font-bold ${ r.winner === "test" ? "text-green-600" : "text-muted-foreground" }`}>
                {r.winner === "test" ? `+${r.lift}` : "—"}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Built for production</div>
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div key={f.label} className="rounded-lg bg-secondary p-3">
                <div className="text-lg mb-1.5">{f.icon}</div>
                <div className="text-xs font-bold mb-0.5">{f.label}</div>
                <div className="text-[11px] text-muted-foreground leading-snug">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* CTA */}
    <div className="rounded-2xl bg-foreground p-10 text-center">
      <h2 className="text-2xl font-bold font-display text-background mb-2">Ready to let the agents work?</h2>
      <p className="text-background/55 mb-7 text-sm max-w-md mx-auto">
        Press ⌘K on the bookstore and run a preset to launch a live optimisation loop.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link to="/browse" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/80">
          <BookOpen className="h-4 w-4" /> Open store
        </Link>
        <Link to="/about" className="inline-flex items-center gap-2 rounded-lg border border-background/20 px-5 py-2.5 text-sm font-medium text-background/70 transition-colors hover:text-background">
          Learn more
        </Link>
      </div>
    </div>
  </div>
);

// ── History data ────────────────────────────────────────────────────────────────
const HISTORY_RUNS = [
  { seg: "Mystery",          lift: "38% CTR", winner: "test",    date: "Today, 10:42 AM",   duration: "1m 54s",  ctrl: "1.2%",  test: "1.7%",  status: "scaled"   },
  { seg: "Sci-Fi",           lift: "22% CTR", winner: "test",    date: "Today, 09:11 AM",   duration: "2m 07s",  ctrl: "3.1%",  test: "3.8%",  status: "scaled"   },
  { seg: "Thriller",         lift: "15% CTR", winner: "test",    date: "Yesterday, 4:33 PM", duration: "1m 48s",  ctrl: "3.5%",  test: "4.0%",  status: "scaled"   },
  { seg: "Romance",          lift: "8% CTR",  winner: "control", date: "Yesterday, 2:10 PM", duration: "2m 22s",  ctrl: "4.8%",  test: "4.6%",  status: "no change" },
  { seg: "Fantasy",          lift: "19% CTR", winner: "test",    date: "Jun 18, 11:55 AM",  duration: "1m 31s",  ctrl: "2.7%",  test: "3.2%",  status: "scaled"   },
  { seg: "Historical Fiction",lift: "11% CTR",winner: "test",    date: "Jun 17, 3:20 PM",   duration: "2m 03s",  ctrl: "2.1%",  test: "2.3%",  status: "scaled"   },
  { seg: "Mystery",          lift: "27% CTR", winner: "test",    date: "Jun 16, 9:05 AM",   duration: "1m 58s",  ctrl: "1.1%",  test: "1.4%",  status: "scaled"   },
  { seg: "Sci-Fi",           lift: "—",       winner: "control", date: "Jun 15, 5:40 PM",   duration: "2m 15s",  ctrl: "3.0%",  test: "2.9%",  status: "no change" },
];

// ── View: History ────────────────────────────────────────────────────────────────
const HistoryView = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold font-display">Run History</h2>
      <p className="text-sm text-muted-foreground mt-1">Every optimisation loop Iteron has executed, with full results.</p>
    </div>

    {/* Summary stat strip */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { icon: RefreshCw,     label: "Total runs",    value: "12",   sub: "all time" },
        { icon: TrendingUp,    label: "Avg CTR lift",  value: "+24%", sub: "when test wins" },
        { icon: CheckCircle2,  label: "Test wins",     value: "10",   sub: "of 12 runs" },
        { icon: Clock,         label: "Avg duration",  value: "1m 58s", sub: "per loop" },
      ].map(({ icon: Icon, label, value, sub }) => (
        <div key={label} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
          <div className="text-2xl font-bold font-display text-foreground">{value}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
        </div>
      ))}
    </div>

    {/* Run table */}
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-secondary flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">All runs</span>
        <span className="text-xs text-muted-foreground">{HISTORY_RUNS.length} entries</span>
      </div>
      <div className="divide-y divide-border">
        {HISTORY_RUNS.map((r, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/50 transition-colors group">
            {/* Status icon */}
            <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
              r.status === "scaled" ? "bg-green-50 text-green-600" : "bg-secondary text-muted-foreground"
            }`}>
              {r.status === "scaled"
                ? <CheckCircle2 className="h-3.5 w-3.5" />
                : <AlertTriangle className="h-3.5 w-3.5" />}
            </div>
            {/* Segment + date */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{r.seg}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  r.status === "scaled"
                    ? "bg-green-50 text-green-700"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {r.status === "scaled" ? "Scaled" : "No change"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                <Clock className="h-3 w-3" /> {r.date}
                <span className="text-border">·</span>
                <span>{r.duration}</span>
              </div>
            </div>
            {/* CTR before/after */}
            <div className="hidden sm:flex items-center gap-6 text-sm">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Before</div>
                <div className="font-mono font-semibold text-muted-foreground">{r.ctrl}</div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-border" />
              <div className="text-right">
                <div className="text-xs text-muted-foreground">After</div>
                <div className={`font-mono font-semibold ${ r.winner === "test" ? "text-green-600" : "text-muted-foreground" }`}>
                  {r.test}
                </div>
              </div>
            </div>
            {/* Lift badge */}
            <div className={`shrink-0 text-sm font-bold w-16 text-right ${
              r.winner === "test" ? "text-green-600" : "text-muted-foreground"
            }`}>
              {r.winner === "test" ? `+${r.lift}` : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Analytics data ───────────────────────────────────────────────────────────
const SEGMENT_ANALYTICS = [
  { seg: "Mystery",           ctr: 0.017, prev: 0.012, runs: 3, trend: "up",   topBook: "The Last Witness" },
  { seg: "Romance",           ctr: 0.048, prev: 0.046, runs: 2, trend: "up",   topBook: "Always You" },
  { seg: "Sci-Fi",            ctr: 0.038, prev: 0.031, runs: 2, trend: "up",   topBook: "Void Protocol" },
  { seg: "Fantasy",           ctr: 0.032, prev: 0.027, runs: 1, trend: "up",   topBook: "The Iron Crown" },
  { seg: "Thriller",          ctr: 0.040, prev: 0.035, runs: 1, trend: "up",   topBook: "The Kill Switch" },
  { seg: "Historical Fiction", ctr: 0.023, prev: 0.021, runs: 1, trend: "up",  topBook: "The Silk Merchant" },
];

const BAR_W = 160;
const MiniBar = ({ value, max, color }: { value: number; max: number; color: string }) => (
  <div className="h-1.5 rounded-full bg-border overflow-hidden" style={{ width: BAR_W }}>
    <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
  </div>
);

// ── View: Analytics ─────────────────────────────────────────────────────────────
const AnalyticsView = () => {
  const maxCtr = Math.max(...SEGMENT_ANALYTICS.map((s) => s.ctr));
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Segment-level performance and lift trends across all Iteron runs.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Activity,   label: "Overall avg CTR",   value: "3.3%", delta: "+0.8 pp",  up: true },
          { icon: TrendingUp, label: "Best lift (single)", value: "+38%", delta: "Mystery",  up: true },
          { icon: Target,     label: "Segments tracked",  value: "6",    delta: "all genres", up: true },
          { icon: FlaskConical, label: "Active A/B tests", value: "1",   delta: "Mystery",   up: null },
        ].map(({ icon: Icon, label, value, delta, up }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <div className="text-2xl font-bold font-display">{value}</div>
            <div className={`text-[11px] mt-0.5 font-medium ${
              up === true ? "text-green-600" : up === false ? "text-red-500" : "text-muted-foreground"
            }`}>
              {up === true && <span>↑ </span>}
              {up === false && <span>↓ </span>}
              {delta}
            </div>
          </div>
        ))}
      </div>

      {/* Segment breakdown table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-secondary">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Segment performance</span>
        </div>
        <div className="divide-y divide-border">
          {SEGMENT_ANALYTICS.map((s) => (
            <div key={s.seg} className="flex items-center gap-5 px-5 py-4 hover:bg-secondary/40 transition-colors">
              <div className="w-32 shrink-0">
                <div className="text-sm font-semibold">{s.seg}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.runs} run{s.runs !== 1 ? "s" : ""}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <MiniBar value={s.ctr} max={maxCtr} color="bg-primary" />
                  <span className="text-sm font-bold font-mono text-foreground">{(s.ctr * 100).toFixed(1)}%</span>
                  <span className={`text-xs font-medium ${
                    s.ctr > s.prev ? "text-green-600" : "text-red-500"
                  }`}>
                    {s.ctr > s.prev ? "↑" : "↓"} {Math.abs(((s.ctr - s.prev) / s.prev) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">Top: <span className="text-foreground font-medium">{s.topBook}</span></div>
              </div>
              <div className="shrink-0 hidden md:block text-right">
                <div className="text-[11px] text-muted-foreground">prev</div>
                <div className="text-sm font-mono text-muted-foreground">{(s.prev * 100).toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active experiments */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Active experiments</div>
        <div className="flex items-start gap-4 p-4 rounded-lg border border-blue-200 bg-blue-50">
          <FlaskConical className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-blue-900">Mystery · A/B test running</div>
            <div className="text-xs text-blue-700 mt-0.5">Control 50% / Test 50% · tags: Suspenseful, Gripping, Edge-of-your-seat</div>
            <div className="flex items-center gap-6 mt-3 text-xs">
              <div><span className="text-muted-foreground">Control CTR</span> <span className="font-mono font-bold text-foreground">1.2%</span></div>
              <div><span className="text-muted-foreground">Test CTR</span> <span className="font-mono font-bold text-green-600">1.7%</span></div>
              <div><span className="text-muted-foreground">Lift so far</span> <span className="font-mono font-bold text-green-600">+38%</span></div>
            </div>
          </div>
          <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-full bg-blue-200 text-blue-800">LIVE</span>
        </div>
        <div className="mt-3 text-xs text-muted-foreground text-center py-4">
          No other experiments running.
        </div>
      </div>
    </div>
  );
};

// ── View: Settings ─────────────────────────────────────────────────────────────
const SettingsView = () => {
  const [confirmBeforeApply, setConfirmBeforeApply] = useState(false);
  const [autoScale, setAutoScale]                   = useState(true);
  const [emailAlerts, setEmailAlerts]               = useState(false);
  const [slackAlerts, setSlackAlerts]               = useState(false);
  const [liveIris, setLiveIris]                     = useState(true);
  const [debugMode, setDebugMode]                   = useState(false);
  const [minSampleSize, setMinSampleSize]           = useState("200");
  const [confidenceLevel, setConfidenceLevel]       = useState("95");
  const [maxRunsPerDay, setMaxRunsPerDay]            = useState("10");
  const [targetMetric, setTargetMetric]             = useState("ctr");
  const [dataRetention, setDataRetention]           = useState("90");
  const [saved, setSaved]                           = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold font-display">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure how Iteron agents behave, alert, and apply changes.</p>
      </div>

      {/* ─ Agent behaviour */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-secondary flex items-center gap-2">
          <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Agent behaviour</span>
        </div>
        <div className="px-5">
          <SettingRow
            icon={Shield}
            label="Require human confirmation before applying changes"
            description="When enabled, every proposed UI config change will pause and wait for your approval before going live. Recommended for production stores."
          >
            <Toggle checked={confirmBeforeApply} onChange={setConfirmBeforeApply} />
          </SettingRow>

          <SettingRow
            icon={TrendingUp}
            label="Auto-scale winning variants"
            description="Automatically promote a winning A/B test variant to 100% of users once statistical confidence is reached. Disable to review results manually."
          >
            <Toggle checked={autoScale} onChange={setAutoScale} />
          </SettingRow>

          <SettingRow
            icon={Target}
            label="Target optimisation metric"
            description="The primary signal Iteron agents will try to maximise during each run."
          >
            <select
              value={targetMetric}
              onChange={(e) => setTargetMetric(e.target.value)}
              className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="ctr">Click-through rate</option>
              <option value="cart">Add-to-cart rate</option>
              <option value="revenue">Revenue per session</option>
              <option value="bounce">Bounce rate (lower)</option>
            </select>
          </SettingRow>

          <SettingRow
            icon={RefreshCw}
            label="Max optimisation runs per day"
            description="Limits the total number of loops Iteron can trigger automatically in a 24-hour window. Manual runs via the widget are not counted."
          >
            <input
              type="number" min="1" max="50" value={maxRunsPerDay}
              onChange={(e) => setMaxRunsPerDay(e.target.value)}
              className="w-16 text-xs text-center border border-border rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </SettingRow>
        </div>
      </div>

      {/* ─ A/B testing */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-secondary flex items-center gap-2">
          <FlaskConical className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">A/B testing</span>
        </div>
        <div className="px-5">
          <SettingRow
            icon={Users}
            label="Minimum sample size per variant"
            description="Iteron will keep an A/B test running until each variant has received at least this many click events before declaring a winner."
          >
            <input
              type="number" min="50" max="5000" value={minSampleSize}
              onChange={(e) => setMinSampleSize(e.target.value)}
              className="w-20 text-xs text-center border border-border rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </SettingRow>

          <SettingRow
            icon={BarChart2}
            label="Statistical confidence threshold"
            description="The minimum confidence percentage required before a test variant can be declared the winner and scaled."
          >
            <div className="flex items-center gap-1.5">
              <input
                type="number" min="80" max="99" value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(e.target.value)}
                className="w-16 text-xs text-center border border-border rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </SettingRow>
        </div>
      </div>

      {/* ─ Notifications */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-secondary flex items-center gap-2">
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Notifications</span>
        </div>
        <div className="px-5">
          <SettingRow
            icon={Bell}
            label="Email alerts on run completion"
            description="Receive an email summary after each optimisation loop, including segment, lift, and whether the test variant was scaled."
          >
            <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
          </SettingRow>

          <SettingRow
            icon={Zap}
            label="Slack notifications"
            description="Post a message to a Slack channel when Iteron completes a run or is waiting for human confirmation."
          >
            <Toggle checked={slackAlerts} onChange={setSlackAlerts} />
          </SettingRow>

          <SettingRow
            icon={Eye}
            label="Show Iris HUD overlay during runs"
            description="Display the full-screen scanning animation and book-card highlights while the Iris widget is running. Disable for a quieter experience."
          >
            <Toggle checked={liveIris} onChange={setLiveIris} />
          </SettingRow>
        </div>
      </div>

      {/* ─ Developer */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-secondary flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Developer</span>
        </div>
        <div className="px-5">
          <SettingRow
            icon={Database}
            label="Data retention period"
            description="How many days of click_events and run history to retain in Supabase. Older records are purged automatically."
          >
            <div className="flex items-center gap-1.5">
              <input
                type="number" min="7" max="365" value={dataRetention}
                onChange={(e) => setDataRetention(e.target.value)}
                className="w-16 text-xs text-center border border-border rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <span className="text-xs text-muted-foreground">days</span>
            </div>
          </SettingRow>

          <SettingRow
            icon={Code2}
            label="Debug mode"
            description="Log full agent prompts, raw LLM responses, and SQL queries to the browser console. Useful when building integrations."
          >
            <Toggle checked={debugMode} onChange={setDebugMode} />
          </SettingRow>

          <SettingRow
            icon={ExternalLink}
            label="Supabase project"
            description="Connected to the PageTurn demo project. Click to open the Supabase dashboard in a new tab."
          >
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Open <ExternalLink className="h-3 w-3" />
            </a>
          </SettingRow>
        </div>
      </div>

      {/* ─ Danger zone */}
      <div className="rounded-xl border border-red-200 bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-red-200 bg-red-50 flex items-center gap-2">
          <TriangleAlert className="h-3.5 w-3.5 text-red-500" />
          <span className="text-xs font-semibold text-red-600 uppercase tracking-widest">Danger zone</span>
        </div>
        <div className="px-5">
          <SettingRow
            icon={TriangleAlert}
            label="Reset all active configs"
            description="Deactivates every ui_config record and resets the storefront to its default state. This cannot be undone."
            danger
          >
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("iteron-reset"))}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
            >
              Reset store
            </button>
          </SettingRow>

          <SettingRow
            icon={Database}
            label="Purge all run history"
            description="Permanently deletes all run history, click events, and ui_config records from the database."
            danger
          >
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
              Purge data
            </button>
          </SettingRow>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3 pb-8">
        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium animate-fade-up">
            <Check className="h-3.5 w-3.5" /> Saved
          </div>
        )}
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/80 transition-colors"
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

// ── Sidebar nav config ──────────────────────────────────────────────────────────
const NAV_MAIN = [
  { id: "home"      as Tab, icon: LayoutDashboard, label: "Overview",  badge: undefined },
  { id: "history"   as Tab, icon: History,         label: "History",   badge: "12" },
  { id: "analytics" as Tab, icon: BarChart2,        label: "Analytics", badge: undefined },
] as { id: Tab; icon: React.ElementType; label: string; badge?: string }[];

// ── Root component ───────────────────────────────────────────────────────────────
const Dashboard = () => {
  usePageMeta("PageTurn");
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Below header: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-card/60 pt-4 pb-6 px-3 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">

          {/* Workspace header */}
          <div className="flex items-center gap-2.5 px-3 mb-5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-bold leading-none">PageTurn</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Iteron workspace</div>
            </div>
          </div>

          {/* Status pill */}
          <div className="mx-3 mb-5 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="text-[11px] font-semibold text-green-700">Agent online</span>
          </div>

          {/* Main nav */}
          <SectionLabel>Main</SectionLabel>
          {NAV_MAIN.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={tab === item.id}
              badge={item.badge}
              onClick={() => setTab(item.id)}
            />
          ))}

          {/* Store */}
          <SectionLabel>Store</SectionLabel>
          <Link
            to="/browse"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Browse store</span>
            <ExternalLink className="h-3 w-3 opacity-50" />
          </Link>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Homepage</span>
            <ExternalLink className="h-3 w-3 opacity-50" />
          </Link>

          {/* Bottom: settings */}
          <div className="mt-auto">
            <SectionLabel>Account</SectionLabel>
            <NavItem
              icon={Settings}
              label="Settings"
              active={tab === "settings"}
              onClick={() => setTab("settings")}
            />
          </div>
        </aside>

        {/* ── Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex items-center justify-around px-2 py-2 pr-20">
          {[...NAV_MAIN, { id: "settings" as Tab, icon: Settings, label: "Settings", badge: undefined }].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                tab === item.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* ── Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-5 md:px-8 py-8 pb-24 md:pb-10">
            {tab === "home"      && <HomeView />}
            {tab === "history"   && <HistoryView />}
            {tab === "analytics" && <AnalyticsView />}
            {tab === "settings" && <SettingsView />}
          </div>
        </main>
      </div>

      <IrisHud site="pageturn" />
    </div>
  );
};

export default Dashboard;
