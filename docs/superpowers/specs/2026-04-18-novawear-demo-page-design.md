# NovaWear Demo Page + Per-Preset Scripts Design

**Date:** 2026-04-18  
**Status:** Approved

## Overview

Add NovaWear (premium fashion e-commerce) as a second demo site alongside the existing PageTurn bookstore. Users switch between demo sites in Settings. Each site has its own preset prompts that trigger distinct demo scripts and produce visual mutations on the demo page. Also rename "Jarvis HUD" to "Iris HUD" throughout.

## Architecture

### State

Add `demoSite: "pageturn" | "novawear"` to the Zustand store (persisted to localStorage). This single field drives iframe URL, preset chips, and demo script selection.

### Visual mutation channel

When a demo run completes, the dashboard writes a config object to `localStorage.iteron_novawear_config` and dispatches `iteron-loop-complete` on `window`. The NovaWear page (running in the iframe) listens for this event and reads the config to apply visual mutations via React state. No cross-origin issues — both run on localhost:8080.

---

## Components

### 1. Dashboard — `lib/store.ts`
- Add `demoSite: "pageturn" | "novawear"` field, default `"pageturn"`
- Add `setDemoSite(site)` action
- Persist `demoSite` in the existing localStorage partialize config

### 2. Dashboard — `lib/constants.ts`
- Rename `GOAL_PRESETS` to `PAGETURN_PRESETS` (4 existing presets, updated text)
- Add `NOVAWEAR_PRESETS` (4 fashion presets)
- Export `PRESETS_BY_SITE` map for convenience

PageTurn presets:
1. "Improve CTR across all segments"
2. "Boost Mystery genre conversion"
3. "Reduce bounce rate on Sci-Fi"
4. "Maximize cart adds for Romance"

NovaWear presets:
1. "Boost Women's collection CTR"
2. "Drive conversions on Sale"
3. "Increase add-to-cart for accessories"
4. "Reduce bounce on Men's"

### 3. Dashboard — `lib/demo-script.ts`
Replace the single hardcoded `SCRIPT` with a `SCRIPTS` map keyed by `"${demoSite}:${goal}"` (matched by prefix/keyword). Each script has contextually appropriate thoughts, segment names, `ab.result` with matching `rootCause`, `ctrBefore/After`, and `configJson`. At `run.complete`, write `localStorage.iteron_novawear_config` with the configJson (NovaWear scripts only).

8 scripts total (4 per site). All follow the same 5-node pipeline shape (fetch → diagnose → generate → ab → measure).

### 4. Dashboard — `components/store-preview/StorePreview.tsx`
- Read `demoSite` from store
- When `"novawear"`: iframe src = `http://localhost:8080/novawear`
- When `"pageturn"`: iframe src = `http://localhost:8080`
- Update label from "localhost:8080" to reflect the active site
- "Open store" link updates to match

### 5. Dashboard — `components/sidebar/SettingsPanel.tsx`
- Add "Demo site" `SettingRow` in the "Agent behaviour" section (below "Execution mode")
- Two buttons: `pageturn` / `novawear`, same style as the demo/live toggle
- Calls `setDemoSite` from store

### 6. Dashboard — `components/header/GoalInput.tsx`
- Read `demoSite` from store
- Render `PRESETS_BY_SITE[demoSite]` instead of hardcoded `GOAL_PRESETS`
- Default input value changes to first preset of the active site

### 7. Demo app — `src/App.tsx`
- Add `/novawear` route → `<NovaWear />` page (lazy loaded)

### 8. Demo app — `src/pages/NovaWear.tsx`
A single-page fashion homepage:
- **Nav**: brand name "NovaWear", links (Women / Men / Sale / New), search + cart icons
- **Hero**: large editorial image area (CSS gradient placeholder), headline + subheadline + CTA button
- **Category tabs**: Women / Men / Sale — switches the product grid
- **Product grid**: 8 cards per tab, each with image placeholder, name, price, optional badge
- **Footer**: minimal

Visual mutations (applied on `iteron-loop-complete` by reading `localStorage.iteron_novawear_config`):

| `configJson` key | Effect |
|---|---|
| `hero_variant: "sale"` | Hero headline → sale copy, CTA → "Shop the sale" |
| `pinned: ["nw-XX"]` | Named product moves to position 1 in its grid |
| `badge: "Limited"` / `"New"` / `"Sale"` | Badge overlay appears on pinned product |
| `layout: "urgency"` | Countdown banner appears above the product grid |
| `cta: "..."` | Hero CTA button text overrides |
| `active_tab: "sale"` | Auto-switches to the Sale tab |

### 9. Demo app — `src/components/IrisHud.tsx` (renamed from IteronHud)
- Rename file from `IteronHud.tsx` → `IrisHud.tsx`
- Rename component from `IteronHud` → `IrisHud`
- Update all internal references: "ITERON AI — ACTIVE" → "IRIS — ACTIVE", "Iteron AI" → "Iris"
- Update `JarvisOverlay` → `IrisOverlay`
- `Index.tsx` and `NovaWear.tsx` both import `IrisHud`
- NovaWear's IrisHud variant writes `localStorage.iteron_novawear_config` at loop end and uses fashion-specific step messages

---

## Data

### NovaWear product data (`src/lib/novawear-products.ts`)
Static array of ~16 products across Women / Men / Sale categories:
```ts
interface NovaWearProduct {
  id: string;        // "nw-01" etc
  name: string;
  category: "womens" | "mens" | "sale"
  price: number;
  originalPrice?: number;
  badge?: string;
  color: string;     // CSS color for placeholder image
}
```

---

## Segments

NovaWear uses segment names `Womens`, `Mens`, `Sale`, `Accessories` in the store's segment state. The `INITIAL_SEGMENT_CTR` constant gets a second export `INITIAL_NOVAWEAR_CTR` with plausible starting values.

The dashboard's CtrCardGrid reads segment names from `SEGMENTS` — this needs to be dynamic based on `demoSite`. Add `NOVAWEAR_SEGMENTS` to constants and a `segmentsByDemoSite` selector.

---

## Spec Self-Review

- No TBDs or placeholders remain
- Architecture is internally consistent: single `demoSite` field drives all downstream behavior
- Scope is focused — no unrelated refactoring
- Visual mutations are specific enough to implement without ambiguity
