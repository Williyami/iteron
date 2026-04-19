import { useEffect, useState } from "react";
import { NOVAWEAR_PRODUCTS } from "@/lib/novawear-products";
import type { NovaWearProduct } from "@/lib/novawear-products";
import { IrisHud } from "@/components/IrisHud";
import { usePageMeta } from "@/lib/use-page-meta";

const A = "https://raw.githubusercontent.com/wilhelmomnell/novawear-e-commerce-design/main/src/assets";

interface NovaWearConfig {
  hero_variant?: "default" | "sale" | "mens" | "editorial";
  pinned?: string[];
  badge?: string;
  layout?: "default" | "urgency" | "cross-sell";
  cta?: string;
}

const HERO_CONTENT: Record<string, { eyebrow: string; headline: string; cta: string }> = {
  default:   { eyebrow: "Spring / Summer 2026",    headline: "A quieter\nway to dress.",              cta: "Shop the collection" },
  editorial: { eyebrow: "New in",                   headline: "The pieces\nthat define a season.",     cta: "Explore new arrivals" },
  sale:      { eyebrow: "Sale — up to 40% off",     headline: "Now at its\nbest price.",               cta: "Shop sale — ends tonight" },
  mens:      { eyebrow: "Men · New tailored edit",  headline: "Considered pieces\nfor considered\ndressing.", cta: "Shop Men's" },
};

const MARQUEE_ITEMS = ["New Arrivals", "Made in Europe", "Free Shipping over $200", "Considered Essentials", "Crafted to Last", "Editorial 2026"];

const collections = [
  { title: "Summer",    subtitle: "Light layers, linen and ease.",            img: `${A}/collection-summer.jpg` },
  { title: "Essentials",subtitle: "The foundation of a quiet wardrobe.",      img: `${A}/collection-essentials.jpg` },
  { title: "Tailoring", subtitle: "Considered structure, modern silhouettes.",img: `${A}/collection-streetwear.jpg` },
];

const genderTiles = [
  { title: "Women", subtitle: "Spring / Summer 2026",    img: `${A}/collection-summer.jpg` },
  { title: "Men",   subtitle: "The new tailored edit",   img: `${A}/category-men.jpg` },
];

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
    <div className="w-full flex items-center justify-center gap-3 py-2.5" style={{ background: "#111", color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em" }}>
      <span style={{ textTransform: "uppercase" }}>Sale ends in</span>
      <span style={{ fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.12em" }}>{pad(h)}:{pad(m)}:{pad(s)}</span>
      <span style={{ color: "#aaa" }}>· Free shipping on orders over $200</span>
    </div>
  );
}

function ProductCard({ product, pinnedBadge }: { product: NovaWearProduct; pinnedBadge?: string }) {
  return (
    <div className="group flex flex-col" style={{ cursor: "pointer" }} data-product-card>
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "#F0EEEB" }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {(pinnedBadge || product.isNew) && (
          <span
            className="absolute top-3 left-3 text-[10px] font-semibold uppercase px-2 py-1"
            style={{ background: "rgba(255,255,255,0.92)", color: "#111", letterSpacing: "0.12em" }}
          >
            {pinnedBadge ?? "New"}
          </span>
        )}
        {product.originalPrice && !pinnedBadge && (
          <span
            className="absolute top-3 left-3 text-[10px] font-semibold uppercase px-2 py-1"
            style={{ background: "#111", color: "#fff", letterSpacing: "0.12em" }}
          >
            Sale
          </span>
        )}
      </div>
      <div className="mt-3 space-y-0.5">
        <p style={{ fontSize: 13, fontWeight: 500, color: "#111", letterSpacing: "-0.01em" }}>{product.name}</p>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 13, color: "#111" }}>${product.price}</span>
          {product.originalPrice && (
            <span style={{ fontSize: 12, color: "#999", textDecoration: "line-through" }}>${product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

const NovaWear = () => {
  usePageMeta("NovaWear", "novawear");
  const [config, setConfig] = useState<NovaWearConfig>({});

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === "iteron:config" && e.data.payload) {
        setConfig(e.data.payload as NovaWearConfig);
      }
    };
    const onLoopComplete = () => {
      try {
        const raw = localStorage.getItem("iteron_novawear_config");
        if (raw) setConfig(JSON.parse(raw) as NovaWearConfig);
      } catch { /* silent */ }
    };
    const onReset = () => setConfig({});
    window.addEventListener("message", onMessage);
    window.addEventListener("iteron-loop-complete", onLoopComplete);
    window.addEventListener("iteron-reset", onReset);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("iteron-loop-complete", onLoopComplete);
      window.removeEventListener("iteron-reset", onReset);
    };
  }, []);

  const heroVariant = config.hero_variant ?? "default";
  const hero = HERO_CONTENT[heroVariant] ?? HERO_CONTENT.default;
  const ctaText = config.cta ?? hero.cta;
  const showUrgency = config.layout === "urgency";
  const isEditorial = heroVariant === "editorial";
  const pinnedSet = new Set(config.pinned ?? []);
  const pinnedProduct = config.pinned?.length
    ? NOVAWEAR_PRODUCTS.find((p) => p.id === config.pinned![0])
    : null;

  const womenNew = NOVAWEAR_PRODUCTS.filter((p) => p.gender === "Women" && p.isNew).slice(0, 4);
  const menNew   = NOVAWEAR_PRODUCTS.filter((p) => p.gender === "Men"   && p.isNew).slice(0, 4);

  const applyPinning = (list: NovaWearProduct[]) => {
    if (!config.pinned?.length) return list;
    const pinned = config.pinned!;
    return [
      ...list.filter((p) => pinnedSet.has(p.id)),
      ...list.filter((p) => !pinnedSet.has(p.id)),
    ].sort((a, b) => {
      const ai = pinned.indexOf(a.id), bi = pinned.indexOf(b.id);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return 0;
    });
  };

  const serif = { fontFamily: 'Georgia, "Times New Roman", serif' };

  return (
    <div style={{ background: "#FAF9F7", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {showUrgency && <UrgencyBanner />}

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4" style={{ background: "#FAF9F7", borderBottom: "1px solid #E8E4DF" }}>
        <div className="flex items-center gap-10">
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#111" }}>NovaWear</span>
          <div className="hidden md:flex items-center gap-7">
            {["Women", "Men", "Sale", "New"].map((link) => (
              <button key={link} style={{ fontSize: 13, color: "#111", letterSpacing: "0.04em", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                className="transition-opacity hover:opacity-50"
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

      {/* Women's Editorial Feature — injected at top when optimization applied */}
      {isEditorial && pinnedProduct && (
        <section style={{ borderBottom: "1px solid #E8E4DF" }}>
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", minHeight: 540 }}>
            <div style={{ position: "relative", overflow: "hidden", background: "#F0EEEB" }}>
              <img
                src={pinnedProduct.image}
                alt={pinnedProduct.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
              />
              {config.badge && (
                <span style={{ position: "absolute", top: 20, left: 20, background: "rgba(255,255,255,0.95)", color: "#111", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", padding: "5px 12px" }}>
                  {config.badge}
                </span>
              )}
            </div>
            <div style={{ background: "#111", color: "#FAF9F7", padding: "64px 52px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.22em", color: "#666", marginBottom: 20 }}>
                Women · Now featuring
              </p>
              <h2 style={{ ...serif, fontSize: "clamp(28px, 3vw, 46px)", color: "#FAF9F7", lineHeight: 1.05, marginBottom: 20 }}>
                {pinnedProduct.name}
              </h2>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.8, marginBottom: 28, maxWidth: "28ch" }}>
                Elevated to the front of our Women's collection after outperforming every other piece in click-through testing.
              </p>
              <p style={{ ...serif, fontSize: 28, color: "#FAF9F7", marginBottom: 36 }}>
                ${pinnedProduct.price}
              </p>
              <button
                style={{ background: "#FAF9F7", color: "#111", border: "none", cursor: "pointer", padding: "14px 36px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", alignSelf: "flex-start" }}
                className="hover:opacity-80 transition-opacity"
              >
                Shop Women's
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Hero — compact banner strip */}
      <section className="px-8 md:px-16 flex items-center justify-between gap-8 py-6" style={{ borderBottom: "1px solid #E8E4DF" }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.22em", color: "#888", marginBottom: 6 }}>
            {hero.eyebrow}
          </p>
          <h1 style={{ ...serif, fontSize: "clamp(22px, 3vw, 34px)", lineHeight: 1.05, color: "#111", whiteSpace: "pre-line" }}>
            {hero.headline}
          </h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            style={{ background: "#111", color: "#FAF9F7", border: "none", cursor: "pointer", padding: "10px 24px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em" }}
            className="hover:opacity-80 transition-opacity"
          >
            {ctaText}
          </button>
          <button
            style={{ background: "transparent", color: "#111", border: "1px solid #D0CBC4", cursor: "pointer", padding: "10px 24px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em" }}
            className="hover:border-black transition-colors"
          >
            Explore outerwear
          </button>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-3.5 overflow-hidden" style={{ borderBottom: "1px solid #E8E4DF" }}>
        <div className="nw-marquee flex whitespace-nowrap gap-16" style={{ width: "max-content" }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#888" }}>— {t}</span>
          ))}
        </div>
      </section>

      {/* Women · New in — hoisted above everything when editorial config applied */}
      {isEditorial && (
        <section className="px-8 md:px-16 py-12 md:py-16" style={{ borderBottom: "1px solid #E8E4DF", background: "#FAF9F7" }}>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "#1d9e75", marginBottom: 8 }}>Optimized · Women · New in</p>
              <h2 style={{ ...serif, fontSize: "clamp(28px, 4vw, 48px)", color: "#111" }}>For her</h2>
            </div>
            <button className="hidden md:block" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#111", background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid #111" }}>
              Shop Women →
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {applyPinning(womenNew).map((p, i) =>
              i === 0 ? (
                <div key={p.id} className="col-span-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div className="col-span-2 group flex flex-col" style={{ cursor: "pointer" }} data-product-card>
                    <div className="relative overflow-hidden" style={{ aspectRatio: "16/9", background: "#F0EEEB" }}>
                      <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                      {pinnedSet.has(p.id) && config.badge && (
                        <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase px-2 py-1" style={{ background: "rgba(255,255,255,0.92)", color: "#111", letterSpacing: "0.12em" }}>{config.badge}</span>
                      )}
                    </div>
                    <div className="mt-3 space-y-0.5">
                      <p style={{ fontSize: 14, fontWeight: 500, color: "#111", letterSpacing: "-0.01em" }}>{p.name}</p>
                      <p style={{ fontSize: 13, color: "#111" }}>${p.price}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <ProductCard key={p.id} product={p} pinnedBadge={pinnedSet.has(p.id) && config.badge ? config.badge : undefined} />
              )
            )}
          </div>
        </section>
      )}

      {/* Shop by gender */}
      <section className="px-8 md:px-16 py-10 md:py-14">
        <div className="mb-10 md:mb-14">
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "#888", marginBottom: 12 }}>Shop by</p>
          <h2 style={{ ...serif, fontSize: "clamp(36px, 5vw, 60px)", color: "#111", lineHeight: 1.05 }}>Women &amp; Men.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {genderTiles.map((g) => (
            <div key={g.title} className="group cursor-pointer" data-product-card>
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <img
                  src={g.img}
                  alt={g.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0) 60%)" }} />
                <div className="absolute bottom-8 left-8 right-8" style={{ color: "#FAF9F7" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", opacity: 0.85, marginBottom: 8 }}>{g.subtitle}</p>
                  <h3 style={{ ...serif, fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1, marginBottom: 16 }}>{g.title}</h3>
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", borderBottom: "1px solid rgba(250,249,247,0.5)", paddingBottom: 2 }}>
                    Discover →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="px-8 md:px-16 pb-20 md:pb-28">
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "#888", marginBottom: 12 }}>Collections</p>
            <h2 style={{ ...serif, fontSize: "clamp(32px, 4.5vw, 56px)", color: "#111", lineHeight: 1.05, maxWidth: "20ch" }}>Edits for every season.</h2>
          </div>
          <button className="hidden md:block" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#111", background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid #111" }}>
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((c) => (
            <div key={c.title} className="group cursor-pointer">
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 60%)", opacity: 0.7 }} />
                <div className="absolute bottom-6 left-6 right-6" style={{ color: "#FAF9F7" }}>
                  <h3 style={{ ...serif, fontSize: "clamp(24px, 3vw, 36px)", marginBottom: 4 }}>{c.title}</h3>
                  <p style={{ fontSize: 13, opacity: 0.85 }}>{c.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Women · New in */}
      <section className="px-8 md:px-16 py-12 md:py-16" style={{ borderTop: "1px solid #E8E4DF" }}>
        <div className="flex items-end justify-between mb-10">
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "#888", marginBottom: 8 }}>Women · New in</p>
            <h2 style={{ ...serif, fontSize: "clamp(28px, 4vw, 48px)", color: "#111" }}>For her</h2>
          </div>
          <button className="hidden md:block" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#111", background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid #111" }}>
            Shop Women →
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-6">
          {applyPinning(womenNew).map((p) => (
            <ProductCard key={p.id} product={p} pinnedBadge={pinnedSet.has(p.id) && config.badge ? config.badge : undefined} />
          ))}
        </div>
      </section>

      {/* Men · New in */}
      <section className="px-8 md:px-16 py-12 md:py-16" style={{ borderTop: "1px solid #E8E4DF" }}>
        <div className="flex items-end justify-between mb-10">
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "#888", marginBottom: 8 }}>Men · New in</p>
            <h2 style={{ ...serif, fontSize: "clamp(28px, 4vw, 48px)", color: "#111" }}>For him</h2>
          </div>
          <button className="hidden md:block" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#111", background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid #111" }}>
            Shop Men →
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-6">
          {applyPinning(menNew).map((p) => (
            <ProductCard key={p.id} product={p} pinnedBadge={pinnedSet.has(p.id) && config.badge ? config.badge : undefined} />
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="relative my-16 md:my-24 overflow-hidden" style={{ height: "60vh", minHeight: 480 }}>
        <img src={`${A}/promo-banner.jpg`} alt="The Atelier" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.12)" }} />
        <div className="relative z-10 h-full px-8 md:px-16 flex items-center">
          <div style={{ maxWidth: 400, color: "#111" }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 16, color: "#333" }}>The Atelier</p>
            <h2 style={{ ...serif, fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1.05, marginBottom: 20 }}>
              Crafted slowly,<br />worn for years.
            </h2>
            <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7, maxWidth: "32ch", marginBottom: 32 }}>
              Every piece is developed in small ateliers across Portugal and Italy, using natural fibres and time-honoured techniques.
            </p>
            <button style={{ background: "#111", color: "#FAF9F7", border: "none", cursor: "pointer", padding: "14px 32px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em" }}
              className="hover:opacity-80 transition-opacity"
            >
              Discover the craft
            </button>
          </div>
        </div>
      </section>

      {/* Editorial split */}
      <section className="px-8 md:px-16 py-20 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "#888", marginBottom: 16 }}>Our Philosophy</p>
          <h2 style={{ ...serif, fontSize: "clamp(28px, 4vw, 48px)", color: "#111", lineHeight: 1.1, marginBottom: 24 }}>
            Less, but considered.
          </h2>
          <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75, marginBottom: 16 }}>
            NovaWear is built on the belief that great clothing should outlast trends. Modern silhouettes, restrained palettes, and the finest natural materials.
          </p>
          <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75 }}>
            We design pieces that work together, season after season — a quiet uniform for everyday life.
          </p>
          <button style={{ marginTop: 32, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#111", background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid #111", paddingBottom: 2 }}>
            Read more
          </button>
        </div>
        <div className="overflow-hidden" style={{ aspectRatio: "4/5" }}>
          <img src={`${A}/collection-essentials.jpg`} alt="Essentials" loading="lazy" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-10" style={{ borderTop: "1px solid #E8E4DF", background: "#F5F1EC" }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#111" }}>NovaWear</span>
          <div className="flex items-center gap-8">
            {["About", "Sustainability", "Careers", "Contact"].map((l) => (
              <span key={l} style={{ fontSize: 12, color: "#666", cursor: "pointer" }} className="hover:underline">{l}</span>
            ))}
          </div>
          <span style={{ fontSize: 11, color: "#999" }}>© 2026 NovaWear</span>
        </div>
      </footer>

      <IrisHud site="novawear" />
    </div>
  );
};

export default NovaWear;
