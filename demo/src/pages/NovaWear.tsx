import { useEffect, useState } from "react";
import { NOVAWEAR_PRODUCTS } from "@/lib/novawear-products";
import type { NovaWearProduct, NovaWearCategory } from "@/lib/novawear-products";
import { IrisHud } from "@/components/IrisHud";

interface NovaWearConfig {
  hero_variant?: "default" | "sale" | "mens" | "editorial";
  pinned?: string[];
  badge?: string;
  layout?: "default" | "urgency" | "cross-sell";
  cta?: string;
  active_tab?: NovaWearCategory;
}

const HERO_CONTENT: Record<string, { headline: string; sub: string; cta: string }> = {
  default:   { headline: "A quieter way to dress.",        sub: "Less, but considered.",                    cta: "Shop collection" },
  editorial: { headline: "The pieces that define a season.", sub: "Curated for those who dress intentionally.", cta: "Explore Women's" },
  sale:      { headline: "Now at its best price.",          sub: "Selected styles, significantly reduced.",   cta: "Shop now — ends tonight" },
  mens:      { headline: "Considered pieces\nfor considered dressing.", sub: "The Men's edit.",              cta: "Shop Men's" },
};

function applyPinning(products: NovaWearProduct[], pinned: string[]): NovaWearProduct[] {
  const result = [...products];
  for (const id of [...pinned].reverse()) {
    const idx = result.findIndex((p) => p.id === id);
    if (idx > 0) {
      const [item] = result.splice(idx, 1);
      result.unshift(item);
    }
  }
  return result;
}

function ProductCard({ product, pinnedBadge }: { product: NovaWearProduct; pinnedBadge?: string }) {
  const badge = pinnedBadge ?? product.badge;
  return (
    <div
      data-product-card
      className="group relative flex flex-col"
      style={{ cursor: "pointer" }}
    >
      {/* Image placeholder */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "3/4",
          background: `linear-gradient(135deg, ${product.color} 0%, ${product.accentColor} 100%)`,
        }}
      >
        {badge && (
          <span
            className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-1"
            style={{ background: "rgba(255,255,255,0.92)", color: "#111", letterSpacing: "0.14em" }}
          >
            {badge}
          </span>
        )}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "rgba(0,0,0,0.08)" }}
        />
      </div>
      {/* Info */}
      <div className="mt-3 flex flex-col gap-0.5">
        <span className="text-[13px] font-medium tracking-tight" style={{ color: "#111" }}>
          {product.name}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[13px]" style={{ color: "#111" }}>
            {product.price.toLocaleString("sv-SE")} SEK
          </span>
          {product.originalPrice && (
            <span className="text-[12px] line-through" style={{ color: "#999" }}>
              {product.originalPrice.toLocaleString("sv-SE")} SEK
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function UrgencyBanner() {
  const [seconds, setSeconds] = useState(3 * 3600 + 42 * 60 + 17);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div
      className="w-full flex items-center justify-center gap-3 py-2.5 text-[12px] font-medium tracking-wide"
      style={{ background: "#111", color: "#fff", letterSpacing: "0.06em" }}
    >
      <span>SALE ENDS IN</span>
      <span className="font-mono font-bold" style={{ letterSpacing: "0.1em" }}>
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
      <span style={{ color: "#aaa" }}>· Free shipping on orders over 800 SEK</span>
    </div>
  );
}

const TABS: { id: NovaWearCategory; label: string }[] = [
  { id: "womens", label: "Women" },
  { id: "mens",   label: "Men" },
  { id: "sale",   label: "Sale" },
];

const NovaWear = () => {
  const [config, setConfig]       = useState<NovaWearConfig>({});
  const [activeTab, setActiveTab] = useState<NovaWearCategory>("womens");

  // Listen for postMessage from dashboard parent frame
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "iteron:config" && e.data.payload) {
        const cfg = e.data.payload as NovaWearConfig;
        setConfig(cfg);
        if (cfg.active_tab) setActiveTab(cfg.active_tab);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Also listen for the IrisHud widget's local event
  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem("iteron_novawear_config");
        if (raw) {
          const cfg = JSON.parse(raw) as NovaWearConfig;
          setConfig(cfg);
          if (cfg.active_tab) setActiveTab(cfg.active_tab);
        }
      } catch { /* silent */ }
    };
    window.addEventListener("iteron-loop-complete", handler);
    return () => window.removeEventListener("iteron-loop-complete", handler);
  }, []);

  const heroVariant = config.hero_variant ?? "default";
  const hero = HERO_CONTENT[heroVariant] ?? HERO_CONTENT.default;
  const ctaText = config.cta ?? hero.cta;
  const showUrgency = config.layout === "urgency";

  const tabProducts = NOVAWEAR_PRODUCTS.filter((p) => p.category === activeTab);
  const displayProducts = config.pinned?.length
    ? applyPinning(tabProducts, config.pinned)
    : tabProducts;

  const pinnedIds = new Set(config.pinned ?? []);

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "'Inter', sans-serif" }}>
      {/* Urgency banner */}
      {showUrgency && <UrgencyBanner />}

      {/* Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: "#FAFAF8", borderBottom: "1px solid #E8E4DF" }}
      >
        <div className="flex items-center gap-10">
          <span className="text-[15px] font-semibold tracking-[0.22em] uppercase" style={{ color: "#111", letterSpacing: "0.22em" }}>
            NovaWear
          </span>
          <div className="hidden md:flex items-center gap-7">
            {["Women", "Men", "Sale", "New"].map((link) => (
              <button
                key={link}
                onClick={() => {
                  const tab = link.toLowerCase() as NovaWearCategory;
                  if (tab === "womens" || tab === "mens" || tab === "sale") setActiveTab(tab);
                  else if (link === "Women") setActiveTab("womens");
                  else if (link === "Men") setActiveTab("mens");
                  else if (link === "Sale") setActiveTab("sale");
                }}
                className="text-[13px] transition-colors hover:opacity-60"
                style={{ color: "#111", letterSpacing: "0.04em", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#555" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#555" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#555" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative flex items-end px-8 py-16"
        style={{
          minHeight: 340,
          background: heroVariant === "sale"
            ? "linear-gradient(135deg, #1C1C1C 0%, #3D2B1F 100%)"
            : heroVariant === "mens"
            ? "linear-gradient(135deg, #1E1E2E 0%, #2C2C3C 100%)"
            : heroVariant === "editorial"
            ? "linear-gradient(135deg, #2C2420 0%, #4A3830 100%)"
            : "linear-gradient(135deg, #E8E0D4 0%, #D4C8B8 100%)",
        }}
      >
        <div className="max-w-lg">
          <div
            className="font-semibold mb-3 leading-tight"
            style={{
              fontSize: 42,
              letterSpacing: "-0.03em",
              color: heroVariant === "default" ? "#111" : "#F5F0EB",
              whiteSpace: "pre-line",
            }}
          >
            {hero.headline}
          </div>
          <p
            className="text-[15px] mb-7"
            style={{ color: heroVariant === "default" ? "#666" : "rgba(245,240,235,0.7)", letterSpacing: "0.01em" }}
          >
            {hero.sub}
          </p>
          <button
            className="inline-flex items-center gap-2 px-7 py-3 text-[13px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{
              background: heroVariant === "default" ? "#111" : "#F5F0EB",
              color: heroVariant === "default" ? "#fff" : "#111",
              letterSpacing: "0.14em",
              border: "none",
              cursor: "pointer",
            }}
          >
            {ctaText}
          </button>
        </div>

        {/* Iteron badge */}
        <div
          className="absolute bottom-4 right-8 flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.12)", backdropFilter: "blur(8px)" }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: heroVariant === "default" ? "#333" : "rgba(245,240,235,0.8)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>
            Iris optimised
          </span>
        </div>
      </section>

      {/* Category tabs */}
      <div
        className="flex items-center gap-0 px-8 mt-10 mb-8"
        style={{ borderBottom: "1px solid #E8E4DF" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="pb-3 mr-8 text-[13px] font-medium transition-colors"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: activeTab === tab.id ? "#111" : "#999",
              borderBottom: activeTab === tab.id ? "1.5px solid #111" : "1.5px solid transparent",
              letterSpacing: "0.02em",
              marginBottom: -1,
            }}
          >
            {tab.label}
            {tab.id === "sale" && (
              <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5" style={{ background: "#111", color: "#fff", letterSpacing: "0.08em" }}>
                SALE
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="px-8 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              pinnedBadge={pinnedIds.has(product.id) && config.badge ? config.badge : undefined}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="px-8 py-10"
        style={{ borderTop: "1px solid #E8E4DF", background: "#F5F0EB" }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <span className="text-[13px] font-semibold tracking-[0.22em] uppercase" style={{ color: "#111" }}>
            NovaWear
          </span>
          <div className="flex items-center gap-8">
            {["About", "Sustainability", "Careers", "Contact"].map((l) => (
              <span key={l} className="text-[12px] cursor-pointer hover:underline" style={{ color: "#666" }}>{l}</span>
            ))}
          </div>
          <span className="text-[11px]" style={{ color: "#999" }}>© 2026 NovaWear</span>
        </div>
      </footer>

      <IrisHud site="novawear" />
    </div>
  );
};

export default NovaWear;
