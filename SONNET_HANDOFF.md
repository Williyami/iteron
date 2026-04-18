# SONNET_HANDOFF.md — Iteron AI Dashboard

You (Sonnet) are taking over a 24-hour buildathon project. Read this entire file before writing any code. You will not have other context. Opus did the planning; you do the build.

---

## 1. What Iteron AI is

Iteron AI is autonomous personalization middleware for e-commerce. It watches user behavior on a connected store, runs an Analyst → Optimizer agent loop, generates UI configs, runs A/B tests, and scales winning variants — all without human intervention. The dashboard you are building is the control panel: it shows the loop running live, streams the agents' thoughts, and visualizes the impact on CTR per genre. The connected store is **PageTurn**, a Lovable-built e-book store. This dashboard is being demoed today on a projector to technical buildathon judges.

---

## 2. Repo state when you start

```
/Users/williameklund/iteron/
├── .env                   ← already filled in by user (do not touch)
├── .env.example           ← reference for what vars exist
├── README.md
├── package.json           ← root, runs both dashboard and agents concurrently
├── agents/                ← Python FastAPI backend (LEAVE AS-IS for the demo)
│   ├── main.py            ← /health, /run-loop, /stream-logs, /reset endpoints
│   ├── loop.py            ← orchestrates analyst + optimizer
│   ├── analyst.py         ← returns hardcoded dict (DO NOT WIRE CLAUDE — see §10)
│   ├── optimizer.py       ← returns hardcoded dict (DO NOT WIRE CLAUDE)
│   ├── sse.py             ← SSE log queue + endpoint
│   └── requirements.txt
├── supabase/
│   ├── schema.sql         ← 4 tables: click_events, ui_config, ab_results, runs
│   └── seed.sql           ← demo click data
├── dashboard/             ← Next.js 14 App Router skeleton — YOU build this out
│   ├── app/               ← currently nearly empty
│   ├── lib/               ← currently nearly empty
│   ├── package.json       ← has next, react, @supabase/supabase-js, tailwind only
│   └── next.config.js
└── demo/                  ← EMPTY — you clone PageTurn into here (see §11)
```

The agent backend (`agents/`) is intentionally minimal and returns hardcoded values. **Do not wire real Anthropic Claude calls.** The user's explicit decision: demo mode is the default for the stage; real backend wiring is post-demo.

---

## 3. Design direction (locked, do not deviate)

### Aesthetic positioning
**Autonomous instrument, not SaaS dashboard.** Reference frame: NASA mission control × Klim-typeset financial terminal. The interface is alive even when idle (hairline pulses, faint telemetry tick, numbers that shift with click events). Iteron AI is positioned as an organism that's always thinking; the UI is its readout.

### Color palette (MANDATORY — do not introduce other hues)
| Var | Hex | OKLCH | Use |
|---|---|---|---|
| `--ink` | `#0F1F2E` | `oklch(0.20 0.025 230)` | Primary background, deepest surface |
| `--moss` | `#085041` | `oklch(0.34 0.06 165)` | Secondary surfaces, Analyst-agent tint |
| `--signal` | `#1D9E75` | `oklch(0.61 0.13 160)` | Primary accent, active states, CTAs, Optimizer-agent tint |
| `--mist` | `#E1F5EE` | `oklch(0.95 0.03 160)` | Subtle highlights, completed/passive emphasis |
| `--bone` | `#F8F8F6` | `oklch(0.98 0.003 100)` | Primary text |

**Conflict resolution:** the original brief said "Blue = Analyst, purple = Optimizer." That conflicts with the mandated palette. Resolution: **Analyst nodes use `--moss` (deep forest), Optimizer nodes use `--signal` (emerald).** No blue, no purple, ever. Differentiation is via lightness and chroma, not hue family.

**Status colors** (derived, not added — use sparingly, only for explicit CTR state and errors):
- Bad CTR / error: `oklch(0.55 0.13 30)` (muted rust, NOT pure red)
- Mid CTR: `oklch(0.75 0.11 85)` (muted amber, NOT pure yellow)
- Good CTR: `--signal`

Tint all neutrals toward emerald hue (chroma 0.005–0.01) so even greys feel like they belong to the brand.

### Typography (locked)
- **Bricolage Grotesque** (Google Fonts, variable, free) — display + body. Has variable `wdth` and `GRAD` axes.
- **Geist Mono** (Google Fonts, free) — every number, every agent thought, every pipeline label, every CTR percentage, every status tag.
- No third font.

Load both via `next/font/google` in `app/layout.tsx`. Apply via CSS variables `--font-display` and `--font-mono`.

### Layout
**Split pane, dark-only, no scroll on main view.** Main viewport composition:

```
┌─────────────────────────────────────────────────────────────┐
│  [pulse]  ITERON AI            [goal · chips · Run · Reset] │  Header strip ~72px
├──────────────────────────────────┬──────────────────────────┤
│   PIPELINE NODE GRAPH            │   LIVE STORE IFRAME      │
│   (centerpiece)                  │                          │
├──────────────────────────────────┤                          │
│   AGENT THOUGHTS (streaming)     │   CTR CARDS (3 segments) │
│                                  ├──────────────────────────┤
│                                  │   LATEST A/B RESULT      │
│                                  │   APPLIED CONFIG         │
├──────────────────────────────────┴──────────────────────────┤
│   ◆◆◆ live click ticker scrolling ──────────────────────→   │  Bottom strip ~28px
└─────────────────────────────────────────────────────────────┘
```

Left column: 60% width. Right column: 40% width. Run history opens as a slide-over from the right when the user clicks "History" in the header — does not occupy main layout.

### Animation approach
- **Framer Motion** for component-level orchestration (entrances, exits, state choreography).
- **Pure CSS keyframes** for continuous loops (header pulse, edge dash flow, ticker scroll). Never JS-animate continuous loops — drops frames on projector.
- One node animates richly at a time. Other nodes are static. Concentrate motion to avoid jank.
- No bounce. No elastic. Use ease-out-quart or expo only.
- Animate `transform` and `opacity` only. Never `width`, `height`, `padding`, `margin`, `filter`.

### Two unexpected creative decisions (commit to these — they are the differentiation)
1. **No icons. Anywhere.** Every label and status uses Geist Mono in either bracketed-caps (`[FETCH]`, `[ACTIVE]`, `[WINNER]`) or signed-numeric (`+34.2%`, `Δ 0.0042`). No Lucide. No Heroicons. No emoji except the explicit `✓` and `✗` in pipeline node states. This is the single biggest visual differentiator from every other hackathon dashboard.
2. **Bottom telemetry ticker.** A 28px-tall full-width strip scrolling left at ~40px/s with click events from `click_events` Supabase table, replayed on a synthetic clock. Always running, even when no loop is active. Format: `14:23:11  user_8821  Mystery  ◆ click  the-hollow-hour`. This is what makes the dashboard feel ALIVE when idle.

### Anti-patterns (do not use, ever)
- No gradient text (banned by impeccable skill).
- No `border-left` or `border-right` greater than 1px as colored accent (banned by impeccable skill).
- No glassmorphism / blur cards.
- No drop shadows on cards. Use 1px borders in tinted neutrals.
- No rounded-rect "AI dashboard" look. Use sharp 2px radius max for cards, 0px for the pipeline nodes themselves.
- No purple-blue gradients. No cyan-on-dark. No neon.

---

## 4. Build order (build top-to-bottom, ship in chunks)

Each entry: **path** — what it does — critical implementation notes.

### Phase 0 — Foundation (build first, everything depends on it)

1. **`dashboard/package.json`** — add deps: `framer-motion@^11`, `zustand@^4`, `clsx@^2`. Keep existing.
2. **`dashboard/tailwind.config.ts`** — extend `theme.colors` with the palette as CSS-variable references (`ink: 'var(--ink)'`, etc.). Extend `theme.fontFamily` with `display: ['var(--font-display)']` and `mono: ['var(--font-mono)']`. Configure content paths for `app/**/*.{ts,tsx}` and `components/**/*.{ts,tsx}`.
3. **`dashboard/postcss.config.js`** — standard Tailwind setup.
4. **`dashboard/app/globals.css`** — define palette CSS vars in `:root`, set `body` to `--ink` background and `--bone` text, set `font-family` to display, define `--font-mono` and `--font-display` vars (filled in by `next/font` in layout). Include CSS keyframes for: `pulse`, `edgeFlow`, `tickerScroll`, `breathe`. Include the fade-mask gradient utility for the agent thoughts panel.
5. **`dashboard/app/layout.tsx`** — load Bricolage Grotesque + Geist Mono via `next/font/google`, attach as CSS variable class on `<html>`. Set page title "Iteron AI". Render `{children}`.
6. **`dashboard/lib/types.ts`** — single source of truth for all types:
   - `NodeId = 'fetch' | 'diagnose' | 'generate' | 'ab' | 'measure'`
   - `NodeState = 'idle' | 'active' | 'complete' | 'error'`
   - `Segment = 'Mystery' | 'Romance' | 'Sci-Fi'`
   - `RunEvent` discriminated union (see §5 for exact shape)
   - `PipelineNode { id: NodeId; agent: 'analyst' | 'optimizer'; label: string; state: NodeState }`
   - `AbResult { segment; ctrBefore; ctrAfter; improvementPct; winner; configJson; rootCause; appliedAt }`
   - `RunRow` (matches `runs` table)
7. **`dashboard/lib/constants.ts`** — `SEGMENTS = ['Mystery', 'Romance', 'Sci-Fi']`, `PIPELINE_NODES` array (id, agent, label), `GOAL_PRESETS` (4 strings — see §6), `DEMO_LOOP_DURATION_MS = 25000`.
8. **`dashboard/lib/store.ts`** — Zustand store. State shape:
   ```
   {
     mode: 'demo' | 'live',
     run: { status: 'idle' | 'running' | 'complete' | 'failed', goal: string, startedAt: number | null },
     pipeline: { nodes: PipelineNode[] },
     thoughts: Array<{ id, text, agent, timestamp }>,
     segments: Record<Segment, { ctr: number, lastUpdated: number }>,
     latestAb: AbResult | null,
     appliedConfig: { rootCause: string, configJson: object } | null,
     history: RunRow[],
     tickerEvents: Array<{ id, time, userId, segment, eventType, bookId }>,
   }
   ```
   Actions: `startRun(goal)`, `applyEvent(event: RunEvent)`, `reset()`, `setMode(mode)`, `loadHistory()`. The `applyEvent` reducer is the only writer for run/pipeline/thoughts/segments/latestAb/appliedConfig — this prevents desync. Use `subscribeWithSelector` middleware for shallow-comparison subscriptions.
9. **`dashboard/lib/supabase-client.ts`** — single Supabase browser client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
10. **`dashboard/lib/queries.ts`** — typed Supabase query functions: `fetchRunHistory(limit)`, `fetchTickerSeed(limit)` (reads `click_events` ordered by `created_at desc`).

### Phase 1 — Demo mode (build before any real backend wiring — this is what runs on stage)

11. **`dashboard/lib/demo-script.ts`** — the deterministic 25-second loop simulator. **This is a load-bearing file. Use the script in §6 verbatim.** Exports `runDemoLoop(goal: string, dispatch: (event: RunEvent) => void): () => void` which returns a cancel function. Uses `setTimeout` for each event, tracks all timeouts in an array, cancel function clears them all.
12. **`dashboard/lib/sse-client.ts`** — for `mode === 'live'`. Opens `EventSource(NEXT_PUBLIC_API_URL + '/stream-logs')`. Parses each event as `RunEvent`. Has a 4-second heartbeat watchdog: if no event arrives for 4s during a `running` status, log a console warning AND auto-fall-back to demo mode for the remainder of the run. **This watchdog is the safety net for stage WiFi.**

### Phase 2 — Header (ship-of-Theseus visible work first)

13. **`dashboard/components/header/PulseIndicator.tsx`** — 8px circle, `--signal` color when `run.status === 'running'`, `--mist` 30% otherwise. CSS keyframe `pulse` (1.4s, scales 1→1.6 with opacity 1→0 on a duplicated halo div behind the dot). When idle, halo runs at 4s slow heartbeat instead of 1.4s. Drives the cadence change the user mentioned in their wow-moment description.
14. **`dashboard/components/header/GoalInput.tsx`** — text input + 4 chip buttons + "Run Loop" button + "Reset" button + "History" link + DemoModeToggle. Input is bound to local state; pressing a chip fills the input and immediately calls `startRun`. Run Loop button calls `startRun` with current input. Reset button calls `reset()` action which clears all run-derived state but keeps history. Buttons styled as 1px-border outline by default; the active "Run Loop" button is filled `--signal` with `--ink` text.
15. **`dashboard/components/header/DemoModeToggle.tsx`** — segmented two-state toggle: `[DEMO]` / `[LIVE]`. Default `DEMO`. When toggled, just sets `store.mode`. The actual dispatch routing happens in the page component when `startRun` is called.
16. **`dashboard/components/header/Header.tsx`** — composes the above. Logo on the far left: just the wordmark `iteron` in Bricolage Grotesque at 24px with letter-spacing -0.02em, followed by a `·` and `AI` in Geist Mono uppercase 12px. Centered: GoalInput. Far right: DemoModeToggle and a "History" text link.

### Phase 3 — The wow centerpiece: pipeline graph

17. **`dashboard/components/pipeline/pipeline-config.ts`** — exports the 5 nodes with positions. Five nodes in a horizontal row, evenly spaced. Each node is 168px wide × 96px tall. Use viewBox-based SVG so it scales:
   ```
   nodes = [
     { id: 'fetch',    agent: 'analyst',   label: '[FETCH DATA]',   x: 0,   y: 0 },
     { id: 'diagnose', agent: 'analyst',   label: '[AI DIAGNOSIS]', x: 200, y: 0 },
     { id: 'generate', agent: 'optimizer', label: '[GEN CONFIG]',   x: 400, y: 0 },
     { id: 'ab',       agent: 'optimizer', label: '[SETUP A/B]',    x: 600, y: 0 },
     { id: 'measure',  agent: 'optimizer', label: '[MEASURE]',      x: 800, y: 0 },
   ]
   ```
18. **`dashboard/components/pipeline/PipelineEdge.tsx`** — SVG `<path>` connecting two nodes (from x+168 of source to x of target, y centerline). Stroke 1px in `--mist` 25% when idle. When the source node is `complete` AND target is `active`, stroke becomes `--signal` and a CSS animation on `stroke-dasharray: 8 8` with `stroke-dashoffset` animating from 16 to 0 in 0.8s linear infinite — produces the "data trickling" effect.
19. **`dashboard/components/pipeline/PipelineNode.tsx`** — sharp-cornered rectangle (0px radius for nodes — instrument feel). Border 1px:
   - `idle`: `--mist` 20% opacity
   - `active`: agent-tinted (`--moss` for analyst, `--signal` for optimizer) at full opacity, plus an inner CSS-keyframe glow (mask gradient that travels left-right across the inner surface, 1.4s loop)
   - `complete`: `--mist` 60% opacity, with a `✓` in `--signal` sliding in from right (Framer Motion x: 8 → 0, opacity 0 → 1, 240ms ease-out)
   - `error`: muted rust border, `✗` in same position, single 8px x-shake on entry (Framer keyframes)
   Inside each node: small label in Geist Mono 11px uppercase at top, agent badge `[ANALYST]` or `[OPTIMIZER]` in 9px in agent tint at bottom-left, status text bottom-right (`IDLE` / `RUNNING` / `DONE` / `FAIL`).
20. **`dashboard/components/pipeline/PipelineGraph.tsx`** — SVG container with viewBox `0 0 968 96`, renders 5 PipelineNode (positioned via foreignObject so they can use HTML/Tailwind, OR pure SVG groups — your call, foreignObject is faster to write). Renders 4 PipelineEdge between consecutive nodes. Subscribes to `pipeline.nodes` from store with shallow selector — each PipelineNode further subscribes only to its own `state` slice to prevent cross-node re-renders.

### Phase 4 — Agent thoughts panel

21. **`dashboard/components/thoughts/AgentThoughts.tsx`** — fixed-height container (matches the right-column composition). Renders `thoughts` from store. Each thought line: timestamp in Geist Mono 11px `--mist` 50%, agent tag `[A]` or `[O]` (analyst/optimizer) tinted, then text in Geist Mono 13px `--bone`. Hover any line: it expands to show structured detail (use Framer Motion `layout` with care — only animate height of the expanded line, not the parent). The container has a top-edge fade mask via CSS `mask-image: linear-gradient(to bottom, transparent 0, black 64px, black 100%)` so older lines visually dissolve as they scroll up. New lines append at the bottom; auto-scroll to bottom on new event.

### Phase 5 — Right column

22. **`dashboard/components/store-preview/StorePreview.tsx`** — wraps an `<iframe src="http://localhost:5173">` in a relatively-positioned div. Underneath the iframe at lower z-index: an `<img src="/pageturn-fallback.png">`. The iframe has `onLoad` setting a `loaded` state; if `loaded === false` after 4 seconds, swap the iframe for the image. While `run.status === 'running'`, render `<ApplyingOverlay />` on top.
23. **`dashboard/components/store-preview/ApplyingOverlay.tsx`** — semi-transparent `--moss` 60% overlay with centered text `[APPLYING CONFIG]` in Geist Mono 14px tracking-wider. Pulsing opacity 0.6 → 0.9 → 0.6 (CSS keyframe, 1.6s).
24. **`dashboard/components/ctr-cards/CtrCard.tsx`** — single segment card. 1px border in `--mist` 15%. Inside: segment name in Bricolage Grotesque 18px, large CTR percentage in Geist Mono 32px, delta from previous in 12px. The card's left border (1px) and CTR number color come from a status function: `< 1.5%` → rust, `1.5–3%` → amber, `> 3%` → `--signal`. Use Framer Motion `animate` to tween the displayed number on `segments[seg].ctr` change (240ms ease-out).
25. **`dashboard/components/ctr-cards/CtrCardGrid.tsx`** — renders 3 CtrCard in a column (vertical stack since right column is narrow).
26. **`dashboard/components/ab-result/LatestAbResult.tsx`** — shows when `latestAb !== null`. Layout: top row "BEFORE" / "AFTER" in 11px mono caps; second row two big numbers in Geist Mono 28px; third row improvement % in `--signal` 18px with leading sign (`+34.2%`); bottom: small "✓ APPLIED" badge if winner === 'test'. Entrance: opacity 0 → 1 + translateY 8 → 0, 320ms ease-out-quart, no bounce.
27. **`dashboard/components/config-panel/AppliedConfig.tsx`** — root cause sentence in Bricolage Grotesque 14px italic. Below: a `[VIEW RAW CONFIG]` toggle that expands to show pretty-printed JSON in Geist Mono 11px in a `--moss` 40%-tinted box with sharp corners.

### Phase 6 — Bottom strip

28. **`dashboard/components/ticker/TelemetryTicker.tsx`** — fixed bottom 28px tall. On mount, calls `fetchTickerSeed(60)` to load 60 click events from Supabase. Then runs a synthetic clock that pushes one event into store every 1000ms (cycling the seed list on a loop). Renders the events in a single horizontal row with CSS `@keyframes tickerScroll` translating the row left at 40px/s. Each event formatted as `HH:MM:SS  user_XXXX  Segment  ◆ click  book-id` with separator dots in `--mist` 30%. Pure CSS animation — never JS.

### Phase 7 — Run history slide-over

29. **`dashboard/components/history/RunHistorySlideover.tsx`** — slides in from right (translateX 100% → 0%, 280ms ease-out). Triggered from `Header`'s "History" link — wire via a Zustand `historyOpen` boolean or local React Context. Renders a table of `runs` rows: time (formatted), goal (truncated), segment, before CTR, after CTR, improvement %, winner. On open, calls `loadHistory()`. Backdrop is `--ink` 50% opacity, click to close.

### Phase 8 — Page composition

30. **`dashboard/app/page.tsx`** — server component that immediately redirects to `/dashboard`.
31. **`dashboard/app/dashboard/page.tsx`** — `'use client'`. Composes Header + PipelineGraph + AgentThoughts (left col) + StorePreview + CtrCardGrid + LatestAbResult + AppliedConfig (right col) + TelemetryTicker (bottom) + RunHistorySlideover (overlay). Uses CSS Grid for the main split-pane:
   ```
   grid-template-columns: 60fr 40fr;
   grid-template-rows: 72px 1fr 28px;
   grid-template-areas:
     "header  header"
     "left    right"
     "ticker  ticker";
   ```
   Owns the dispatch routing: when `startRun(goal)` is called, the page checks `store.mode`. If `demo`: invokes `runDemoLoop(goal, applyEvent)`. If `live`: opens SSE connection via `sse-client.ts`. Stores the cancel function in a ref so `reset()` can call it.

### Phase 9 — Final polish (only if time)

32. **`dashboard/public/pageturn-fallback.png`** — take a screenshot of PageTurn running locally, save here. Used by StorePreview when iframe fails.
33. **Header reduced motion query** — wrap the pulse and ticker animations in `@media (prefers-reduced-motion: no-preference)` so demo machines with reduced motion enabled don't flicker.

---

## 5. The `RunEvent` type (use exactly this shape)

```ts
export type RunEvent =
  | { type: 'run.start'; goal: string; t: number }
  | { type: 'node.active'; node: NodeId; t: number }
  | { type: 'node.complete'; node: NodeId; t: number }
  | { type: 'node.error'; node: NodeId; message: string; t: number }
  | { type: 'thought'; agent: 'analyst' | 'optimizer'; text: string; t: number }
  | { type: 'segment.update'; segment: Segment; ctr: number; t: number }
  | {
      type: 'ab.result';
      segment: Segment;
      ctrBefore: number;
      ctrAfter: number;
      winner: 'control' | 'test';
      configJson: Record<string, unknown>;
      rootCause: string;
      t: number;
    }
  | { type: 'run.complete'; t: number };
```

`t` is milliseconds since `run.start`. `applyEvent` reducer maps each event type to the relevant store mutation.

---

## 6. Demo script (USE VERBATIM in `dashboard/lib/demo-script.ts`)

This is the script that runs on stage. Tuned for ~25 seconds, dense enough to never feel stalled.

```ts
const SCRIPT: Array<Omit<RunEvent, 't'> & { t: number }> = [
  { t: 0,     type: 'run.start',       goal: '__GOAL__' },
  { t: 200,   type: 'node.active',     node: 'fetch' },
  { t: 400,   type: 'thought',         agent: 'analyst', text: 'Connecting to Supabase…' },
  { t: 1000,  type: 'thought',         agent: 'analyst', text: 'Pulling 1,247 click events from last 24h' },
  { t: 2000,  type: 'thought',         agent: 'analyst', text: 'Mystery: 1.2% CTR · Romance: 3.4% · Sci-Fi: 4.1%' },
  { t: 2500,  type: 'node.complete',   node: 'fetch' },
  { t: 2600,  type: 'node.active',     node: 'diagnose' },
  { t: 3000,  type: 'thought',         agent: 'analyst', text: 'Mystery underperforming by 67% vs Romance baseline' },
  { t: 4500,  type: 'thought',         agent: 'analyst', text: 'Hypothesis: tag language is too literary, lacks emotional hook' },
  { t: 5500,  type: 'thought',         agent: 'analyst', text: "Root cause: 'Detective Fiction' tag tests 41% lower than 'Edge-of-your-seat'" },
  { t: 6000,  type: 'segment.update',  segment: 'Mystery', ctr: 0.012 },
  { t: 6500,  type: 'node.complete',   node: 'diagnose' },
  { t: 6600,  type: 'node.active',     node: 'generate' },
  { t: 7000,  type: 'thought',         agent: 'optimizer', text: 'Generating new config: emotional tag set + reorder by recency' },
  { t: 9500,  type: 'thought',         agent: 'optimizer', text: 'Config drafted: 3 tags, 3 reorder positions, layout=emotional' },
  { t: 10000, type: 'node.complete',   node: 'generate' },
  { t: 10100, type: 'node.active',     node: 'ab' },
  { t: 10500, type: 'thought',         agent: 'optimizer', text: 'Splitting Mystery traffic 50/50: control vs test' },
  { t: 12000, type: 'thought',         agent: 'optimizer', text: 'A/B running on 247 sessions/min sample rate' },
  { t: 13000, type: 'node.complete',   node: 'ab' },
  { t: 13100, type: 'node.active',     node: 'measure' },
  { t: 13500, type: 'thought',         agent: 'optimizer', text: 'Sample size 100 · p-value drifting toward significance' },
  { t: 17000, type: 'thought',         agent: 'optimizer', text: 'Sample size 500 · test variant +28% lift · p<0.05' },
  { t: 19000, type: 'thought',         agent: 'optimizer', text: 'Sample size 1,000 · +34.2% lift confirmed' },
  { t: 20000, type: 'segment.update',  segment: 'Mystery', ctr: 0.0161 },
  { t: 20500, type: 'ab.result',
              segment: 'Mystery',
              ctrBefore: 0.012,
              ctrAfter: 0.0161,
              winner: 'test',
              rootCause: "'Detective Fiction' tag tested 41% lower than emotional alternatives. Replaced with 'Suspenseful', 'Gripping', 'Edge-of-your-seat'.",
              configJson: {
                tags: ['Suspenseful', 'Gripping', 'Edge-of-your-seat'],
                sort_order: ['what-the-river-knows', 'the-hollow-hour', 'cold-case-protocol'],
                layout: 'emotional',
              } },
  { t: 22000, type: 'thought',         agent: 'optimizer', text: 'Scaling test variant to 100% of Mystery traffic' },
  { t: 23000, type: 'thought',         agent: 'optimizer', text: '✓ Applied. Optimization complete.' },
  { t: 23500, type: 'node.complete',   node: 'measure' },
  { t: 23800, type: 'run.complete' },
];
```

`runDemoLoop(goal, dispatch)` clones the script, replaces `__GOAL__` with the actual goal string in the `run.start` event, then schedules each via `setTimeout(() => dispatch(event), event.t)`. Returns a cancel function that clears all pending timeouts.

### Goal preset chips (4)
```ts
export const GOAL_PRESETS = [
  'Improve CTR across all segments',
  'Boost Mystery genre conversion',
  'Reduce bounce rate on Sci-Fi',
  'Maximize cart adds for Romance',
];
```

---

## 7. Demo-critical (5 things that must work perfectly on stage)

1. **Header pulse** — visible state-of-life indicator. Must change cadence the instant Run Loop is pressed.
2. **Goal input + Run Loop button** — must trigger the demo script with no perceptible delay (target: first node activates within 250ms of click).
3. **Pipeline graph state transitions** — the 5 nodes must animate cleanly through idle→active→complete with edge data flow visible. This IS the wow.
4. **Agent thoughts streaming** — lines must appear one-by-one, never all at once, never out of order. Older lines must visibly fade.
5. **Latest A/B result card emerging at ~20.5s** — the payoff. The `+34.2%` number ticks up. This is the demo's punchline.

If any of these 5 break in dev, stop everything and fix before moving on.

---

## 8. Cut if time is short (in cut order — top first)

1. Run history slide-over (collapse to a static "Recent runs" 3-row inline list in the right column under AppliedConfig).
2. Applied config raw JSON expand toggle (just show root cause text).
3. iframe → static screenshot only (skip iframe entirely if PageTurn local server is troublesome).
4. Bottom telemetry ticker (composition still works without it).
5. CTR card number-tween animation polish (just snap to new value).

Never cut from §7.

---

## 9. Environment variables

All set in `/Users/williameklund/iteron/.env` (already filled by user). For Next.js, only the `NEXT_PUBLIC_*` ones are accessible client-side.

| Variable | Used by | Where |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | dashboard | `lib/supabase-client.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | dashboard | `lib/supabase-client.ts` |
| `NEXT_PUBLIC_API_URL` | dashboard | `lib/sse-client.ts` (default `http://localhost:8000`) |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | agents backend | not your concern, leave alone |
| `ANTHROPIC_API_KEY` | agents backend | not used by demo (hardcoded) |
| `LANGSMITH_API_KEY`, `LANGSMITH_PROJECT` | agents backend | not your concern |

---

## 10. The agents backend — DO NOT TOUCH for the demo

Files in `agents/` (`main.py`, `loop.py`, `analyst.py`, `optimizer.py`, `sse.py`) currently return hardcoded values and that's fine. The user explicitly said: leave hardcoded for demo, wire real Claude calls later. The dashboard's `mode === 'live'` toggle will hit the real backend, but **the stage demo runs entirely in `mode === 'demo'`** which uses `lib/demo-script.ts` and never touches the backend. Treat the backend as proven-works-in-dev, not used live.

If you have spare time at the very end and everything else is solid, you may add a `node.active` / `node.complete` SSE emit to `agents/loop.py` so the live mode actually drives the pipeline — but only as a stretch goal.

---

## 11. PageTurn (the demo store) — wire it in

Repo: `https://github.com/Williyami/pageturn-ai.git`

Setup:
```bash
cd /Users/williameklund/iteron
git clone https://github.com/Williyami/pageturn-ai.git demo
cd demo
npm install
npm run dev   # should bind to http://localhost:5173
```

The dashboard `StorePreview` component iframes `http://localhost:5173`. If PageTurn doesn't bind to 5173 by default (check its `vite.config.ts` after cloning), update the iframe `src` in `StorePreview.tsx` to match.

**Take a screenshot** of PageTurn running locally and save to `dashboard/public/pageturn-fallback.png`. This is the iframe fallback. If you skip this, the right pane goes blank if PageTurn isn't running — kills the demo.

Run order on stage: PageTurn first (`cd demo && npm run dev`), then dashboard (`cd dashboard && npm run dev`). Use the root `npm run dev` to start both dashboard and agents backend together — but PageTurn is a third process you start manually.

---

## 12. Gotchas & risks

1. **Cross-origin iframe.** PageTurn at `localhost:5173` and dashboard at `localhost:3000` are different origins. The iframe will load fine but you cannot read its DOM or messages without `postMessage` + opt-in from PageTurn. Don't try. Just iframe and let it render.
2. **SSE on stage WiFi.** Hotel/venue WiFi often kills long-lived HTTP. The 4-second heartbeat watchdog in `sse-client.ts` is non-negotiable. But again — the stage demo is `mode === 'demo'` so SSE isn't even on the critical path.
3. **Framer Motion `layout` animations are expensive.** Only use them where you must (Agent thoughts hover-expand). Everything else: explicit `animate={{ ... }}` with transform/opacity.
4. **CSS animations vs JS animations.** Header pulse, edge dash flow, ticker scroll — all CSS keyframes with `will-change: transform` or `will-change: opacity`. Never JS-animate continuous loops.
5. **`useEffect` cleanup is critical for the demo loop.** `runDemoLoop` returns a cancel function. The page component MUST call cancel on unmount AND on `reset()`. Otherwise back-to-back runs queue up timeouts that fire over each other.
6. **Zustand re-render perf.** Use shallow selectors. `useStore(s => s.pipeline.nodes)` will re-render on every node change. Use `useStore(s => s.pipeline.nodes[2].state, shallow)` per node.
7. **Tailwind purge.** Make sure `tailwind.config.ts` content array includes `./components/**/*.{ts,tsx}` or your component classes get stripped in build.
8. **`next/font/google`** — Geist Mono on Google Fonts is the Vercel-published version. Confirm it's available; if Google Fonts blocks it for some reason, fall back to `Geist Mono` from npm package `geist/font/mono` (Vercel publishes both).
9. **The mandatory palette has no red or yellow.** When you need bad/mid CTR colors, use the muted rust and muted amber I derived in §3. Do not introduce raw `red-500` or `yellow-500` Tailwind classes.
10. **No icons rule.** It's load-bearing for the differentiation. Resist the reflex to grab Lucide. The bracketed-mono labels are the entire visual vocabulary.
11. **The ticker scroll uses `transform: translateX(-50%)`** with a duplicated row inside the container so the scroll loops seamlessly. Single-row scroll has a visible reset jump.
12. **Reset behavior.** `reset()` should clear: `run`, all `pipeline.nodes` back to idle, `thoughts`, `latestAb`, `appliedConfig`. Should NOT clear: `segments` (let CTR cards stay at last known value), `history`, `tickerEvents`, `mode`. This way the dashboard always feels populated even after reset.
13. **The `agents/main.py` `/run-loop` endpoint** currently doesn't actually run the loop or push any SSE events — it returns `{status: ok}` immediately. The `agents/sse.py` queue exists but nothing pushes to it. So if you ever flip to `mode === 'live'` during dev, you'll see nothing. This is expected. Don't waste time debugging.
14. **No tests.** This is a 24-hour buildathon dashboard. Skip the test suite. The verification is "does it look right and does the demo run end-to-end on stage."

---

## 13. The build sequence in one paragraph

Foundation (palette, fonts, types, store, demo script) → header (so something visible exists) → pipeline graph (the wow) → agent thoughts (the streaming feel) → right-column composition (CTR cards, A/B result, applied config, store iframe with fallback) → bottom telemetry ticker → run history slide-over → polish. Ship in chunks; if you hit phase 6 with the demo working end-to-end, you can demo. Everything past phase 6 is gravy.

Begin.
