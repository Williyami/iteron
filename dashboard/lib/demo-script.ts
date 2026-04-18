import type { RunEvent, DemoSite } from "./types";

type ScriptEvent = RunEvent;

// ── PageTurn scripts ──────────────────────────────────────────────────────────

const PAGETURN_ALL: ScriptEvent[] = [
  { t: 0,     type: "run.start",      goal: "__GOAL__" },
  { t: 200,   type: "node.active",    node: "fetch" },
  { t: 400,   type: "thought",        agent: "analyst",   text: "Connecting to Supabase…" },
  { t: 1000,  type: "thought",        agent: "analyst",   text: "Pulling 1,247 click events from last 24h" },
  { t: 2000,  type: "thought",        agent: "analyst",   text: "Mystery: 1.2% CTR · Romance: 3.4% · Sci-Fi: 4.1%" },
  { t: 2500,  type: "node.complete",  node: "fetch" },
  { t: 2600,  type: "node.active",    node: "diagnose" },
  { t: 3000,  type: "thought",        agent: "analyst",   text: "Mystery underperforming by 67% vs Romance baseline" },
  { t: 4500,  type: "thought",        agent: "analyst",   text: "Hypothesis: tag language is too literary, lacks emotional hook" },
  { t: 5500,  type: "thought",        agent: "analyst",   text: "Root cause: 'Detective Fiction' tag tests 41% lower than 'Edge-of-your-seat'" },
  { t: 6000,  type: "segment.update", segment: "Mystery", ctr: 0.012 },
  { t: 6500,  type: "node.complete",  node: "diagnose" },
  { t: 6600,  type: "node.active",    node: "generate" },
  { t: 7000,  type: "thought",        agent: "optimizer", text: "Generating new config: emotional tag set + reorder by recency" },
  { t: 9500,  type: "thought",        agent: "optimizer", text: "Config drafted: 3 tags, 3 reorder positions, layout=emotional" },
  { t: 10000, type: "node.complete",  node: "generate" },
  { t: 10100, type: "node.active",    node: "ab" },
  { t: 10500, type: "thought",        agent: "optimizer", text: "Splitting Mystery traffic 50/50: control vs test" },
  { t: 12000, type: "thought",        agent: "optimizer", text: "A/B running on 247 sessions/min sample rate" },
  { t: 13000, type: "node.complete",  node: "ab" },
  { t: 13100, type: "node.active",    node: "measure" },
  { t: 13500, type: "thought",        agent: "optimizer", text: "Sample size 100 · p-value drifting toward significance" },
  { t: 17000, type: "thought",        agent: "optimizer", text: "Sample size 500 · test variant +28% lift · p<0.05" },
  { t: 19000, type: "thought",        agent: "optimizer", text: "Sample size 1,000 · +34.2% lift confirmed" },
  { t: 20000, type: "segment.update", segment: "Mystery", ctr: 0.0161 },
  {
    t: 20500, type: "ab.result", segment: "Mystery", ctrBefore: 0.012, ctrAfter: 0.0161, winner: "test",
    rootCause: "'Detective Fiction' tag tested 41% lower than emotional alternatives. Replaced with 'Suspenseful', 'Gripping', 'Edge-of-your-seat'.",
    configJson: { tags: ["Suspenseful", "Gripping", "Edge-of-your-seat"], sort_order: ["what-the-river-knows", "the-hollow-hour", "cold-case-protocol"], layout: "emotional" },
  },
  { t: 22000, type: "thought",        agent: "optimizer", text: "Scaling test variant to 100% of Mystery traffic" },
  { t: 23000, type: "thought",        agent: "optimizer", text: "✓ Applied. Optimization complete." },
  { t: 23500, type: "node.complete",  node: "measure" },
  { t: 23800, type: "run.complete" },
];

const PAGETURN_MYSTERY: ScriptEvent[] = [
  { t: 0,     type: "run.start",      goal: "__GOAL__" },
  { t: 200,   type: "node.active",    node: "fetch" },
  { t: 400,   type: "thought",        agent: "analyst",   text: "Fetching Mystery segment data — last 7 days" },
  { t: 1000,  type: "thought",        agent: "analyst",   text: "Mystery: 1,412 clicks · 3,891 impressions · 1.2% CTR" },
  { t: 2000,  type: "thought",        agent: "analyst",   text: "Top 3 Mystery titles account for 78% of impressions" },
  { t: 2500,  type: "node.complete",  node: "fetch" },
  { t: 2600,  type: "node.active",    node: "diagnose" },
  { t: 3000,  type: "thought",        agent: "analyst",   text: "Bestseller 'What the River Knows' buried at position 7" },
  { t: 4500,  type: "thought",        agent: "analyst",   text: "Cover art for top 3 titles scored low in visual engagement scan" },
  { t: 5500,  type: "thought",        agent: "analyst",   text: "Root cause: sort order is by publish date, not popularity" },
  { t: 6000,  type: "segment.update", segment: "Mystery", ctr: 0.012 },
  { t: 6500,  type: "node.complete",  node: "diagnose" },
  { t: 6600,  type: "node.active",    node: "generate" },
  { t: 7000,  type: "thought",        agent: "optimizer", text: "Config: pin bestseller to position 1, sort remaining by rating" },
  { t: 9500,  type: "thought",        agent: "optimizer", text: "Adding 'Featured' badge to top performer — drives +14% avg CTR" },
  { t: 10000, type: "node.complete",  node: "generate" },
  { t: 10100, type: "node.active",    node: "ab" },
  { t: 10500, type: "thought",        agent: "optimizer", text: "50/50 split on Mystery shelf order · control vs bestseller-first" },
  { t: 12000, type: "thought",        agent: "optimizer", text: "1,100 sessions measured — test variant pulling ahead" },
  { t: 13000, type: "node.complete",  node: "ab" },
  { t: 13100, type: "node.active",    node: "measure" },
  { t: 13500, type: "thought",        agent: "optimizer", text: "CTR test: 1.9% vs control 1.2% · +58% lift at n=400" },
  { t: 17000, type: "thought",        agent: "optimizer", text: "Confidence 97.3% · exceeds 95% threshold" },
  { t: 19000, type: "thought",        agent: "optimizer", text: "Final lift: +45.0% · rolling out to 100%" },
  { t: 20000, type: "segment.update", segment: "Mystery", ctr: 0.0174 },
  {
    t: 20500, type: "ab.result", segment: "Mystery", ctrBefore: 0.012, ctrAfter: 0.0174, winner: "test",
    rootCause: "Sort order was chronological, burying bestseller 'What the River Knows' at position 7. Pinning top performer to position 1 with a Featured badge delivered a 45% CTR lift.",
    configJson: { sort_by: "bestseller_first", featured_id: "what-the-river-knows", badge: "Featured", layout: "featured" },
  },
  { t: 22000, type: "thought",        agent: "optimizer", text: "Writing bestseller-first config to ui_config table" },
  { t: 23000, type: "thought",        agent: "optimizer", text: "✓ Mystery shelf now leads with top performers." },
  { t: 23500, type: "node.complete",  node: "measure" },
  { t: 23800, type: "run.complete" },
];

const PAGETURN_SCIFI: ScriptEvent[] = [
  { t: 0,     type: "run.start",      goal: "__GOAL__" },
  { t: 200,   type: "node.active",    node: "fetch" },
  { t: 400,   type: "thought",        agent: "analyst",   text: "Loading Sci-Fi funnel data — clicks, impressions, dwell time" },
  { t: 1000,  type: "thought",        agent: "analyst",   text: "Sci-Fi: 4.1% CTR but 72% bounce · users click, then leave" },
  { t: 2000,  type: "thought",        agent: "analyst",   text: "Dwell time: 8 seconds avg · suggests a mismatch on landing" },
  { t: 2500,  type: "node.complete",  node: "fetch" },
  { t: 2600,  type: "node.active",    node: "diagnose" },
  { t: 3000,  type: "thought",        agent: "analyst",   text: "Landing page uses generic imagery — misses hard sci-fi audience" },
  { t: 4500,  type: "thought",        agent: "analyst",   text: "Product descriptions lead with word count, not setting or premise" },
  { t: 5500,  type: "thought",        agent: "analyst",   text: "Root cause: page doesn't match hard sci-fi reader intent (world-building)" },
  { t: 6000,  type: "segment.update", segment: "Sci-Fi",  ctr: 0.041 },
  { t: 6500,  type: "node.complete",  node: "diagnose" },
  { t: 6600,  type: "node.active",    node: "generate" },
  { t: 7000,  type: "thought",        agent: "optimizer", text: "New layout: 'immersive' mode with expanded premise descriptions" },
  { t: 9500,  type: "thought",        agent: "optimizer", text: "Hero book: top engagement in A/B history for this segment" },
  { t: 10000, type: "node.complete",  node: "generate" },
  { t: 10100, type: "node.active",    node: "ab" },
  { t: 10500, type: "thought",        agent: "optimizer", text: "Splitting Sci-Fi traffic · control (current) vs immersive layout" },
  { t: 12000, type: "thought",        agent: "optimizer", text: "Bounce rate dropping in test bucket — 68% → 52% at n=200" },
  { t: 13000, type: "node.complete",  node: "ab" },
  { t: 13100, type: "node.active",    node: "measure" },
  { t: 13500, type: "thought",        agent: "optimizer", text: "CTR: test 5.3% vs control 4.1% · p=0.031 at n=600" },
  { t: 17000, type: "thought",        agent: "optimizer", text: "Confidence 96.9% · bounce rate also down 24 pts in test" },
  { t: 19000, type: "thought",        agent: "optimizer", text: "CTR +29.3% · bounce -24pts · scaling to 100%" },
  { t: 20000, type: "segment.update", segment: "Sci-Fi",  ctr: 0.053 },
  {
    t: 20500, type: "ab.result", segment: "Sci-Fi", ctrBefore: 0.041, ctrAfter: 0.053, winner: "test",
    rootCause: "Generic imagery and word-count-first descriptions don't match hard sci-fi reader intent. Immersive layout with premise-first descriptions reduced bounce by 24 points and lifted CTR 29%.",
    configJson: { layout: "immersive", hero_genre: "sci-fi", description_style: "world-building", hero_book: "sci-fi-01" },
  },
  { t: 22000, type: "thought",        agent: "optimizer", text: "Applying immersive layout config to Sci-Fi shelf" },
  { t: 23000, type: "thought",        agent: "optimizer", text: "✓ Sci-Fi landing now optimised for world-building audience." },
  { t: 23500, type: "node.complete",  node: "measure" },
  { t: 23800, type: "run.complete" },
];

const PAGETURN_ROMANCE: ScriptEvent[] = [
  { t: 0,     type: "run.start",      goal: "__GOAL__" },
  { t: 200,   type: "node.active",    node: "fetch" },
  { t: 400,   type: "thought",        agent: "analyst",   text: "Pulling Romance cart event data — last 48 hours" },
  { t: 1000,  type: "thought",        agent: "analyst",   text: "Romance: 3.4% CTR (healthy) · cart-add rate 0.6% (low)" },
  { t: 2000,  type: "thought",        agent: "analyst",   text: "Scroll depth 78% — readers browse but don't add to cart" },
  { t: 2500,  type: "node.complete",  node: "fetch" },
  { t: 2600,  type: "node.active",    node: "diagnose" },
  { t: 3000,  type: "thought",        agent: "analyst",   text: "Add-to-cart button is below the fold on 60% of devices" },
  { t: 4500,  type: "thought",        agent: "analyst",   text: "Price shown only on hover — friction before intent can convert" },
  { t: 5500,  type: "thought",        agent: "analyst",   text: "Root cause: CTA placement and price visibility create drop-off before cart" },
  { t: 6000,  type: "segment.update", segment: "Romance", ctr: 0.034 },
  { t: 6500,  type: "node.complete",  node: "diagnose" },
  { t: 6600,  type: "node.active",    node: "generate" },
  { t: 7000,  type: "thought",        agent: "optimizer", text: "Config: inline CTA + persistent price + bundle prompt" },
  { t: 9500,  type: "thought",        agent: "optimizer", text: "Bundle offer: 'Add 2 more Romance, save 15%' — tested +22% cart rate in Fantasy" },
  { t: 10000, type: "node.complete",  node: "generate" },
  { t: 10100, type: "node.active",    node: "ab" },
  { t: 10500, type: "thought",        agent: "optimizer", text: "Launching A/B: control (hover price) vs inline CTA with bundle offer" },
  { t: 12000, type: "thought",        agent: "optimizer", text: "Cart-add rate: test 1.1% vs control 0.6% at n=300" },
  { t: 13000, type: "node.complete",  node: "ab" },
  { t: 13100, type: "node.active",    node: "measure" },
  { t: 13500, type: "thought",        agent: "optimizer", text: "p-value 0.024 · cart lift consistent across devices" },
  { t: 17000, type: "thought",        agent: "optimizer", text: "Mobile cart rate especially strong: +67% on small screens" },
  { t: 19000, type: "thought",        agent: "optimizer", text: "Final: +41.2% cart adds · rolling out to 100% of Romance" },
  { t: 20000, type: "segment.update", segment: "Romance", ctr: 0.048 },
  {
    t: 20500, type: "ab.result", segment: "Romance", ctrBefore: 0.034, ctrAfter: 0.048, winner: "test",
    rootCause: "Add-to-cart button below the fold and price hidden on hover created drop-off between intent and action. Inline CTA with persistent price and bundle prompt lifted cart adds 41%.",
    configJson: { cta_position: "inline", price_display: "prominent", bundle_offer: true, bundle_copy: "Add 2 more Romance, save 15%" },
  },
  { t: 22000, type: "thought",        agent: "optimizer", text: "Pushing inline CTA config — all Romance product cards updating" },
  { t: 23000, type: "thought",        agent: "optimizer", text: "✓ Romance shelf now converts readers into buyers." },
  { t: 23500, type: "node.complete",  node: "measure" },
  { t: 23800, type: "run.complete" },
];

// ── NovaWear scripts ──────────────────────────────────────────────────────────

const NOVAWEAR_WOMENS: ScriptEvent[] = [
  { t: 0,     type: "run.start",      goal: "__GOAL__" },
  { t: 200,   type: "node.active",    node: "fetch" },
  { t: 400,   type: "thought",        agent: "analyst",   text: "Fetching NovaWear session data — Women's, Men's, Sale segments" },
  { t: 1000,  type: "thought",        agent: "analyst",   text: "Womens: 1.4% CTR · Mens: 3.2% · Sale: 4.8%" },
  { t: 2000,  type: "thought",        agent: "analyst",   text: "Women's accounts for 58% of sessions but only 28% of revenue" },
  { t: 2500,  type: "node.complete",  node: "fetch" },
  { t: 2600,  type: "node.active",    node: "diagnose" },
  { t: 3000,  type: "thought",        agent: "analyst",   text: "Hero product: 'Merino Wrap Coat' not in top 3 viewed — at position 5" },
  { t: 4500,  type: "thought",        agent: "analyst",   text: "New arrivals tab active by default — doesn't surface bestsellers" },
  { t: 5500,  type: "thought",        agent: "analyst",   text: "Root cause: Oversized Blazer (nw-03) is top performer but buried at position 4" },
  { t: 6000,  type: "segment.update", segment: "Womens",  ctr: 0.014 },
  { t: 6500,  type: "node.complete",  node: "diagnose" },
  { t: 6600,  type: "node.active",    node: "generate" },
  { t: 7000,  type: "thought",        agent: "optimizer", text: "Config: pin nw-03 (Oversized Blazer) to position 1 with 'New' badge" },
  { t: 9500,  type: "thought",        agent: "optimizer", text: "Default tab: Women's · editorial hero headline for high-intent landing" },
  { t: 10000, type: "node.complete",  node: "generate" },
  { t: 10100, type: "node.active",    node: "ab" },
  { t: 10500, type: "thought",        agent: "optimizer", text: "Splitting Women's traffic 50/50 · editorial vs current layout" },
  { t: 12000, type: "thought",        agent: "optimizer", text: "Pinned product CTR: 4.1% vs control 1.4% — strong signal early" },
  { t: 13000, type: "node.complete",  node: "ab" },
  { t: 13100, type: "node.active",    node: "measure" },
  { t: 13500, type: "thought",        agent: "optimizer", text: "n=420 · p=0.017 · test variant leading consistently" },
  { t: 17000, type: "thought",        agent: "optimizer", text: "Segment-wide CTR up to 2.1% · +50% lift · confidence 98.1%" },
  { t: 19000, type: "thought",        agent: "optimizer", text: "Final: Womens CTR 1.4% → 2.1% · scaling to 100%" },
  { t: 20000, type: "segment.update", segment: "Womens",  ctr: 0.021 },
  {
    t: 20500, type: "ab.result", segment: "Womens", ctrBefore: 0.014, ctrAfter: 0.021, winner: "test",
    rootCause: "Top-performing Oversized Blazer (nw-03) buried at position 4. Pinning it with a 'New' badge and setting Women's as default tab lifted CTR 50%.",
    configJson: { pinned: ["nw-03"], badge: "New", active_tab: "womens", hero_variant: "editorial" },
  },
  { t: 22000, type: "thought",        agent: "optimizer", text: "Applying editorial layout config to Women's collection" },
  { t: 23000, type: "thought",        agent: "optimizer", text: "✓ Women's collection now leads with its top performer." },
  { t: 23500, type: "node.complete",  node: "measure" },
  { t: 23800, type: "run.complete" },
];

const NOVAWEAR_SALE: ScriptEvent[] = [
  { t: 0,     type: "run.start",      goal: "__GOAL__" },
  { t: 200,   type: "node.active",    node: "fetch" },
  { t: 400,   type: "thought",        agent: "analyst",   text: "Fetching Sale segment funnel data — last 72 hours" },
  { t: 1000,  type: "thought",        agent: "analyst",   text: "Sale: 4.8% CTR · 1.8% conversion · strong awareness, weak purchase" },
  { t: 2000,  type: "thought",        agent: "analyst",   text: "Avg session time on Sale page: 42s — intent present but not converting" },
  { t: 2500,  type: "node.complete",  node: "fetch" },
  { t: 2600,  type: "node.active",    node: "diagnose" },
  { t: 3000,  type: "thought",        agent: "analyst",   text: "No urgency signals — sale has no end date, no stock indicators" },
  { t: 4500,  type: "thought",        agent: "analyst",   text: "CTA copy: 'View Sale' — weak intent language for discount shoppers" },
  { t: 5500,  type: "thought",        agent: "analyst",   text: "Root cause: no urgency, generic CTA, sale items not surfaced above the fold" },
  { t: 6000,  type: "segment.update", segment: "Sale",    ctr: 0.021 },
  { t: 6500,  type: "node.complete",  node: "diagnose" },
  { t: 6600,  type: "node.active",    node: "generate" },
  { t: 7000,  type: "thought",        agent: "optimizer", text: "Config: urgency banner + strong CTA + Sale tab as default" },
  { t: 9500,  type: "thought",        agent: "optimizer", text: "CTA override: 'Shop now — ends tonight' · urgency layout with countdown" },
  { t: 10000, type: "node.complete",  node: "generate" },
  { t: 10100, type: "node.active",    node: "ab" },
  { t: 10500, type: "thought",        agent: "optimizer", text: "A/B running · control (standard) vs urgency layout on Sale segment" },
  { t: 12000, type: "thought",        agent: "optimizer", text: "Conversion rate test: 3.1% vs control 1.8% at n=180 — strong early signal" },
  { t: 13000, type: "node.complete",  node: "ab" },
  { t: 13100, type: "node.active",    node: "measure" },
  { t: 13500, type: "thought",        agent: "optimizer", text: "p=0.009 · n=520 · test variant dominant across all devices" },
  { t: 17000, type: "thought",        agent: "optimizer", text: "Conversion: 1.8% → 3.4% · CTR also up to 2.9% on segment" },
  { t: 19000, type: "thought",        agent: "optimizer", text: "Final: +61.9% conversion lift · scaling to 100% of Sale traffic" },
  { t: 20000, type: "segment.update", segment: "Sale",    ctr: 0.034 },
  {
    t: 20500, type: "ab.result", segment: "Sale", ctrBefore: 0.021, ctrAfter: 0.034, winner: "test",
    rootCause: "No urgency signals and weak CTA copy allowed high-intent sale shoppers to bounce. Urgency banner with countdown, strong CTA, and Sale-first layout lifted conversions 62%.",
    configJson: { layout: "urgency", hero_variant: "sale", cta: "Shop now — ends tonight", active_tab: "sale" },
  },
  { t: 22000, type: "thought",        agent: "optimizer", text: "Pushing urgency layout config to Sale segment" },
  { t: 23000, type: "thought",        agent: "optimizer", text: "✓ Sale page now converts with urgency-driven layout." },
  { t: 23500, type: "node.complete",  node: "measure" },
  { t: 23800, type: "run.complete" },
];

const NOVAWEAR_ACCESSORIES: ScriptEvent[] = [
  { t: 0,     type: "run.start",      goal: "__GOAL__" },
  { t: 200,   type: "node.active",    node: "fetch" },
  { t: 400,   type: "thought",        agent: "analyst",   text: "Pulling accessories funnel — cart events and product scroll depth" },
  { t: 1000,  type: "thought",        agent: "analyst",   text: "Accessories: 0.8% cart rate · avg scroll depth 34% on product cards" },
  { t: 2000,  type: "thought",        agent: "analyst",   text: "Cross-category navigation: only 3% of Men's sessions visit accessories" },
  { t: 2500,  type: "node.complete",  node: "fetch" },
  { t: 2600,  type: "node.active",    node: "diagnose" },
  { t: 3000,  type: "thought",        agent: "analyst",   text: "Accessories section is below the fold — users don't reach it organically" },
  { t: 4500,  type: "thought",        agent: "analyst",   text: "Leather Belt (nw-09) is highest-margin item but gets 0.4% of product views" },
  { t: 5500,  type: "thought",        agent: "analyst",   text: "Root cause: accessories lack discoverability — no cross-sell, no tab prominence" },
  { t: 6000,  type: "segment.update", segment: "Accessories", ctr: 0.008 },
  { t: 6500,  type: "node.complete",  node: "diagnose" },
  { t: 6600,  type: "node.active",    node: "generate" },
  { t: 7000,  type: "thought",        agent: "optimizer", text: "Config: pin nw-09, 'Limited' badge, cross-sell layout on Men's and Women's" },
  { t: 9500,  type: "thought",        agent: "optimizer", text: "Cross-sell placement at scroll position 60% — proven optimal in prior tests" },
  { t: 10000, type: "node.complete",  node: "generate" },
  { t: 10100, type: "node.active",    node: "ab" },
  { t: 10500, type: "thought",        agent: "optimizer", text: "50/50 split on accessories discovery — current vs cross-sell layout" },
  { t: 12000, type: "thought",        agent: "optimizer", text: "Leather Belt views up 8× in test bucket · 'Limited' badge driving urgency" },
  { t: 13000, type: "node.complete",  node: "ab" },
  { t: 13100, type: "node.active",    node: "measure" },
  { t: 13500, type: "thought",        agent: "optimizer", text: "Accessories cart rate: 1.4% test vs 0.8% control · p=0.028 at n=350" },
  { t: 17000, type: "thought",        agent: "optimizer", text: "Cross-sell click-through: 12% of Men's sessions now visit accessories" },
  { t: 19000, type: "thought",        agent: "optimizer", text: "Final: +75% cart rate on accessories · scaling now" },
  { t: 20000, type: "segment.update", segment: "Accessories", ctr: 0.014 },
  {
    t: 20500, type: "ab.result", segment: "Accessories", ctrBefore: 0.008, ctrAfter: 0.014, winner: "test",
    rootCause: "Accessories section lacked discoverability and cross-sell integration. Pinning the Leather Belt with a 'Limited' badge and adding cross-sell placements lifted cart rate 75%.",
    configJson: { pinned: ["nw-09"], badge: "Limited", layout: "cross-sell" },
  },
  { t: 22000, type: "thought",        agent: "optimizer", text: "Applying cross-sell layout — accessories now surface across all categories" },
  { t: 23000, type: "thought",        agent: "optimizer", text: "✓ Accessories are now discoverable at peak intent moments." },
  { t: 23500, type: "node.complete",  node: "measure" },
  { t: 23800, type: "run.complete" },
];

const NOVAWEAR_MENS: ScriptEvent[] = [
  { t: 0,     type: "run.start",      goal: "__GOAL__" },
  { t: 200,   type: "node.active",    node: "fetch" },
  { t: 400,   type: "thought",        agent: "analyst",   text: "Loading Men's segment — sessions, bounce, and engagement heatmap" },
  { t: 1000,  type: "thought",        agent: "analyst",   text: "Mens: 1.8% CTR · 64% bounce · 18s avg dwell time" },
  { t: 2000,  type: "thought",        agent: "analyst",   text: "Heat map shows 80% of clicks in first 3 product slots" },
  { t: 2500,  type: "node.complete",  node: "fetch" },
  { t: 2600,  type: "node.active",    node: "diagnose" },
  { t: 3000,  type: "thought",        agent: "analyst",   text: "Top slot occupied by 'Straight Chinos' — not a hero piece, low visual impact" },
  { t: 4500,  type: "thought",        agent: "analyst",   text: "Hero headline is generic: 'Men's Collection' — no editorial voice" },
  { t: 5500,  type: "thought",        agent: "analyst",   text: "Root cause: Unstructured Suit Jacket (nw-07) is the hero but placed at position 3" },
  { t: 6000,  type: "segment.update", segment: "Mens",    ctr: 0.018 },
  { t: 6500,  type: "node.complete",  node: "diagnose" },
  { t: 6600,  type: "node.active",    node: "generate" },
  { t: 7000,  type: "thought",        agent: "optimizer", text: "Config: pin nw-07 to position 1, Men's tab default, updated hero variant" },
  { t: 9500,  type: "thought",        agent: "optimizer", text: "Hero headline: 'Considered pieces for considered dressing'" },
  { t: 10000, type: "node.complete",  node: "generate" },
  { t: 10100, type: "node.active",    node: "ab" },
  { t: 10500, type: "thought",        agent: "optimizer", text: "Running A/B on Men's landing · current layout vs editorial-first config" },
  { t: 12000, type: "thought",        agent: "optimizer", text: "Bounce dropping: test 48% vs control 64% at n=290" },
  { t: 13000, type: "node.complete",  node: "ab" },
  { t: 13100, type: "node.active",    node: "measure" },
  { t: 13500, type: "thought",        agent: "optimizer", text: "CTR test 2.6% vs control 1.8% · p=0.031 · n=640" },
  { t: 17000, type: "thought",        agent: "optimizer", text: "Suit Jacket getting 3.1× more views in test bucket" },
  { t: 19000, type: "thought",        agent: "optimizer", text: "Final: +44.4% CTR lift, bounce -16pts · scaling to 100%" },
  { t: 20000, type: "segment.update", segment: "Mens",    ctr: 0.026 },
  {
    t: 20500, type: "ab.result", segment: "Mens", ctrBefore: 0.018, ctrAfter: 0.026, winner: "test",
    rootCause: "Hero product slot occupied by low-impact Chinos while best piece (Unstructured Suit Jacket) sat at position 3. Editorial hero with pinned jacket cut bounce by 16 points and lifted CTR 44%.",
    configJson: { active_tab: "mens", pinned: ["nw-07"], hero_variant: "mens" },
  },
  { t: 22000, type: "thought",        agent: "optimizer", text: "Pushing Men's editorial config — hero product and tab updated" },
  { t: 23000, type: "thought",        agent: "optimizer", text: "✓ Men's collection now leads with its most compelling piece." },
  { t: 23500, type: "node.complete",  node: "measure" },
  { t: 23800, type: "run.complete" },
];

// ── Script selection ──────────────────────────────────────────────────────────

function selectScript(goal: string, demoSite: DemoSite): ScriptEvent[] {
  const g = goal.toLowerCase();
  if (demoSite === "novawear") {
    if (g.includes("women"))    return NOVAWEAR_WOMENS;
    if (g.includes("sale"))     return NOVAWEAR_SALE;
    if (g.includes("accessor")) return NOVAWEAR_ACCESSORIES;
    if (g.includes("men"))      return NOVAWEAR_MENS;
    return NOVAWEAR_WOMENS;
  }
  if (g.includes("mystery"))              return PAGETURN_MYSTERY;
  if (g.includes("sci-fi") || g.includes("sci fi") || g.includes("scifi")) return PAGETURN_SCIFI;
  if (g.includes("romance"))              return PAGETURN_ROMANCE;
  return PAGETURN_ALL;
}

export function runDemoLoop(
  goal: string,
  demoSite: DemoSite,
  dispatch: (event: RunEvent) => void
): () => void {
  const script = selectScript(goal, demoSite);
  const timeouts: ReturnType<typeof setTimeout>[] = [];
  for (const raw of script) {
    const event: RunEvent =
      raw.type === "run.start" ? { ...raw, goal: goal || raw.goal } : raw;
    const id = setTimeout(() => dispatch(event), event.t);
    timeouts.push(id);
  }
  return () => { for (const id of timeouts) clearTimeout(id); };
}
