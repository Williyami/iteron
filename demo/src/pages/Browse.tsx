import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { CategoryBar } from "@/components/CategoryBar";
import { IrisHud } from "@/components/IrisHud";
import { BookCard } from "@/components/BookCard";
import { books, genres, Genre } from "@/lib/books";
import { supabase } from "@/integrations/supabase/client";

type SortOption = "popular" | "rating" | "price-low" | "price-high" | "newest";

type MysteryConfig = {
  tags?: string[];
  sort_order?: string[];
};

const Browse = () => {
  const [searchParams] = useSearchParams();
  const genreParam = searchParams.get("genre");
  const initialGenre: Genre | "All" =
    genreParam && (genres as readonly string[]).includes(genreParam)
      ? (genreParam as Genre)
      : "All";

  const [activeGenre, setActiveGenre] = useState<Genre | "All">(initialGenre);
  const [sort, setSort] = useState<SortOption>("popular");
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
    if (!error && data?.config_json) {
      setMysteryConfig(data.config_json as MysteryConfig);
    }
  };

  useEffect(() => {
    fetchConfig();
    const interval = setInterval(fetchConfig, 5000);
    const onComplete = () => fetchConfig();
    const onReset = () => setMysteryConfig(null);
    window.addEventListener("iteron-loop-complete", onComplete);
    window.addEventListener("iteron-reset", onReset);
    return () => {
      clearInterval(interval);
      window.removeEventListener("iteron-loop-complete", onComplete);
      window.removeEventListener("iteron-reset", onReset);
    };
  }, []);

  const hasAiConfig = !!(mysteryConfig?.tags?.length);

  const filtered = useMemo(() => {
    let list = activeGenre === "All" ? books : books.filter((b) => b.genre === activeGenre);

    // apply mystery sort order from Supabase config
    if (activeGenre === "Mystery" && mysteryConfig?.sort_order?.length) {
      const order = mysteryConfig.sort_order;
      list = [...list].sort((a, b) => {
        const ai = order.indexOf(a.id);
        const bi = order.indexOf(b.id);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
      return list;
    }

    return [...list].sort((a, b) => {
      switch (sort) {
        case "rating":     return b.rating - a.rating;
        case "price-low":  return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "newest":     return (b.newRelease ? 1 : 0) - (a.newRelease ? 1 : 0);
        default:           return b.reviewCount - a.reviewCount;
      }
    });
  }, [activeGenre, sort, mysteryConfig]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryBar activeGenre={activeGenre} onSelect={setActiveGenre} />

      <div className="container py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-display">
              {activeGenre === "All" ? "All Books" : activeGenre}
            </h1>
            <p className="text-sm text-muted-foreground">{filtered.length} results</p>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* AI optimisation banner */}
        {hasAiConfig && (activeGenre === "All" || activeGenre === "Mystery") && (
          <div className="mb-8 p-5 rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent animate-fade-up">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-primary uppercase tracking-wider">Personalized for you</span>
                </div>
                <p className="text-xs text-muted-foreground">The Mystery shelf has been retuned by Iteron AI based on engagement signals.</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mysteryConfig!.tags!.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 transition-all duration-500">
          {filtered.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              overrideTags={
                (activeGenre === "All" || activeGenre === "Mystery") && hasAiConfig && book.genre === "Mystery"
                  ? mysteryConfig?.tags
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      <footer className="border-t border-border bg-card/50 py-8 mt-8">
        <div className="container text-center text-xs text-muted-foreground">
          © 2026 PageTurn. All rights reserved.
        </div>
      </footer>

      <IrisHud site="pageturn" />
    </div>
  );
};

export default Browse;
