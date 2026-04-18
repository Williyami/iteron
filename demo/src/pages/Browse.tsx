import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { IteronHud } from "@/components/IteronHud";
import { BookCard } from "@/components/BookCard";
import { BOOKS, GENRES, Genre, Book } from "@/lib/books";
import { supabase } from "@/integrations/supabase/client";

type MysteryConfig = {
  tags?: string[];
  sort_order?: string[];
};

const Browse = () => {
  const [genre, setGenre] = useState<Genre>("All");
  const [mysteryConfig, setMysteryConfig] = useState<MysteryConfig | null>(null);

  const fetchConfig = async () => {
    const { data, error } = await supabase
      .from("ui_config")
      .select("config_json")
      .eq("segment", "Mystery")
      .eq("variant", "test")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.warn("ui_config fetch error", error);
      return;
    }
    if (data?.config_json) {
      setMysteryConfig(data.config_json as MysteryConfig);
    }
  };

  useEffect(() => {
    fetchConfig();
    const onComplete = () => fetchConfig();
    const onReset = () => setMysteryConfig(null);
    window.addEventListener("iteron-loop-complete", onComplete);
    window.addEventListener("iteron-reset", onReset);
    return () => {
      window.removeEventListener("iteron-loop-complete", onComplete);
      window.removeEventListener("iteron-reset", onReset);
    };
  }, []);

  // Apply config: reorder mystery + tag overrides
  const mysteryBooks = useMemo(() => {
    const mys = BOOKS.filter((b) => b.genre === "Mystery");
    if (mysteryConfig?.sort_order?.length) {
      const order = mysteryConfig.sort_order;
      return [...mys].sort((a, b) => {
        const ai = order.indexOf(a.id);
        const bi = order.indexOf(b.id);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
    }
    return mys;
  }, [mysteryConfig]);

  const otherBooks = BOOKS.filter((b) => b.genre !== "Mystery");

  const filtered = (list: Book[]) =>
    genre === "All" ? list : list.filter((b) => b.genre === genre);

  const showMysterySection = genre === "All" || genre === "Mystery";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-10 pt-20 pb-14 md:pt-28 md:pb-20">
        <div className="text-[11px] uppercase tracking-[0.3em] text-amber mb-6">
          Issue 04 · Spring Selection
        </div>
        <h1 className="font-display text-[44px] md:text-7xl leading-[1.02] text-paper max-w-4xl">
          Discover your<br />
          <span className="italic text-amber-soft">next obsession.</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
          A small, opinionated catalogue of fiction — handpicked, occasionally
          tuned by an algorithm that's read more than it should have.
        </p>
      </section>

      {/* Personalized banner */}
      {mysteryConfig?.tags?.length ? (
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 pb-10 animate-fade-up">
          <div className="border border-amber/30 bg-amber/[0.04] rounded-sm px-6 py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-amber mb-1.5">
                ⚡ Personalized for you
              </div>
              <div className="font-display text-xl text-paper">
                We've retuned the Mystery shelf based on your taste.
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:ml-auto">
              {mysteryConfig.tags.map((t) => (
                <span key={t} className="pill-amber">{t}</span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Genre filter */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-10 pb-10">
        <div className="hairline pt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mr-2">
            Filter
          </span>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`text-[12px] uppercase tracking-[0.22em] pb-1 border-b transition-colors ${
                genre === g
                  ? "text-paper border-amber"
                  : "text-muted-foreground border-transparent hover:text-paper"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* Mystery section */}
      {showMysterySection && (
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 pb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-amber mb-2">
                Section 01
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-paper">Mystery</h2>
            </div>
            <div className="hidden md:block max-w-xs text-sm text-muted-foreground text-right">
              Quiet rooms, long shadows, the wrong question asked at the right time.
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-14">
            {mysteryBooks.map((b) => (
              <BookCard
                key={b.id}
                book={b}
                overrideTags={mysteryConfig?.tags}
              />
            ))}
          </div>
        </section>
      )}

      {/* Other genres */}
      {(["Romance", "Sci-Fi"] as const).map((sec, i) => {
        const list = filtered(otherBooks.filter((b) => b.genre === sec));
        if (list.length === 0) return null;
        return (
          <section key={sec} className="max-w-[1280px] mx-auto px-6 md:px-10 pb-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-amber mb-2">
                  Section 0{i + 2}
                </div>
                <h2 className="font-display text-3xl md:text-5xl text-paper">{sec}</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-14">
              {list.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        );
      })}

      <footer className="max-w-[1280px] mx-auto px-6 md:px-10 py-12 hairline text-xs text-muted-foreground flex flex-wrap justify-between gap-4">
        <div>© PageTurn — printed in pixels.</div>
        <div className="tracking-[0.22em] uppercase">Vol. IV / MMXXVI</div>
      </footer>

      <IteronHud />
    </div>
  );
};

export default Browse;
