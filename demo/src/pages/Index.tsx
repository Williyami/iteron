import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Clock, ShoppingCart, Search, Heart, Rocket, Swords, Crosshair, Landmark, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { CategoryBar } from "@/components/CategoryBar";
import { BookCarousel } from "@/components/BookCarousel";
import { BookCard } from "@/components/BookCard";
import { BookCover } from "@/components/BookCover";
import { IteronHud } from "@/components/IteronHud";
import { books, genres } from "@/lib/books";
import type { Genre } from "@/lib/books";

const genreIconMap: Record<Genre, React.ReactNode> = {
  Mystery:             <Search className="h-5 w-5" />,
  Romance:             <Heart className="h-5 w-5" />,
  "Sci-Fi":            <Rocket className="h-5 w-5" />,
  Fantasy:             <Swords className="h-5 w-5" />,
  Thriller:            <Crosshair className="h-5 w-5" />,
  "Historical Fiction": <Landmark className="h-5 w-5" />,
};

const bestsellers  = books.filter((b) => b.bestseller);
const newReleases  = books.filter((b) => b.newRelease);
const deals        = books.filter((b) => b.originalPrice);
const topRated     = [...books].sort((a, b) => b.rating - a.rating).slice(0, 10);
const under100     = books.filter((b) => b.price < 100);
const heroBooks    = [books[0], books[5], books[10], books[15], books[20]];
const dealBook     = books.find((b) => b.originalPrice && b.bestseller) ?? books[0];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryBar onSelect={(genre) => navigate(`/browse?genre=${genre}`)} />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="pointer-events-none absolute -top-32 left-1/3 h-96 w-[600px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 right-1/4 h-96 w-[400px] rounded-full bg-accent/8 blur-[120px]" />

        <div className="container relative py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-medium text-primary mb-6">
                <Sparkles className="h-3 w-3" />
                AI-optimised shelves · updated live
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-display">
                Your next great read<br />is waiting
              </h1>
              <p className="mt-4 text-muted-foreground text-lg max-w-md">
                30+ e-books across every genre — curated by editors, quietly optimised by Iteron AI.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
                >
                  Browse All Books
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-display text-sm font-semibold text-secondary-foreground transition-colors hover:bg-surface-hover"
                >
                  Today's Deals
                </Link>
              </div>
              <div className="mt-10 flex gap-8">
                <div>
                  <div className="text-2xl font-bold font-display">{books.length}+</div>
                  <div className="text-xs text-muted-foreground">E-Books</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">{genres.length}</div>
                  <div className="text-xs text-muted-foreground">Genres</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">4.5★</div>
                  <div className="text-xs text-muted-foreground">Avg Rating</div>
                </div>
              </div>
            </div>

            {/* Right — fanned covers */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-80 h-96">
                {heroBooks.map((book, i) => (
                  <div
                    key={book.id}
                    className="absolute transition-transform duration-500 hover:scale-110 hover:z-10"
                    style={{
                      left: `${i * 48}px`,
                      top: `${Math.abs(i - 2) * 16}px`,
                      transform: `rotate(${(i - 2) * 6}deg)`,
                      zIndex: 5 - Math.abs(i - 2),
                    }}
                  >
                    <BookCover book={book} className="w-32 h-48 shadow-2xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-8">
        {/* Bestsellers */}
        <BookCarousel title="Bestsellers" subtitle="Our most popular titles" books={bestsellers} />

        {/* Deal of the Day */}
        <div className="container mb-10">
          <div className="rounded-xl bg-gradient-to-r from-primary/10 via-card to-accent/10 border border-border p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <BookCover book={dealBook} className="w-28 h-40 flex-shrink-0" />
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
                  <Clock className="h-3 w-3" />
                  DEAL OF THE DAY
                </div>
                <h3 className="text-xl font-bold font-display">{dealBook.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">by {dealBook.author}</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">{dealBook.description}</p>
                <div className="mt-4 flex items-center gap-3 justify-center md:justify-start">
                  <span className="text-2xl font-bold font-display text-primary">{dealBook.price} SEK</span>
                  {dealBook.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{dealBook.originalPrice} SEK</span>
                  )}
                  {dealBook.originalPrice && (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Save {dealBook.originalPrice - dealBook.price} SEK
                    </span>
                  )}
                </div>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 flex-shrink-0">
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* New Releases */}
        <BookCarousel title="New Releases" subtitle="Fresh off the press" books={newReleases} />

        {/* Browse by Genre */}
        <section className="container mb-10">
          <h2 className="text-xl font-bold font-display mb-4">Browse by Genre</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {genres.map((genre) => (
              <Link
                key={genre}
                to={`/browse?genre=${genre}`}
                className="flex flex-col items-center gap-2 rounded-xl bg-card border border-border p-4 transition-all hover:bg-surface-hover hover:border-primary/30 hover:scale-105"
              >
                <span className="text-muted-foreground">{genreIconMap[genre]}</span>
                <span className="text-sm font-medium text-center leading-tight">{genre}</span>
                <span className="text-xs text-muted-foreground">{books.filter((b) => b.genre === genre).length} books</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Rated */}
        <BookCarousel title="Top Rated" subtitle="Highest rated by readers" books={topRated} />

        {/* Under 100 SEK */}
        <BookCarousel title="Under 100 SEK" subtitle="Great reads, great prices" books={under100} variant="compact" />

        {/* Today's Deals grid */}
        <section className="container mb-10">
          <h2 className="text-xl font-bold font-display mb-1">Today's Deals</h2>
          <p className="text-sm text-muted-foreground mb-4">Save on your favourite genres</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {deals.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Recommended */}
        <BookCarousel title="Recommended For You" subtitle="Based on popular picks" books={books.slice(8, 18)} />
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Shop",    links: ["All Books", "Bestsellers", "New Releases", "Deals"] },
              { title: "Genres",  links: genres.slice(0, 4) },
              { title: "Account", links: ["Sign In", "My Library", "Wishlist", "Order History"] },
              { title: "Help",    links: ["FAQ", "Contact Us", "Returns", "Privacy Policy"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-display font-semibold mb-3">{title}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {links.map((l) => (
                    <li key={l} className="hover:text-foreground cursor-pointer transition-colors">{l}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            © 2026 PageTurn. All rights reserved.
          </div>
        </div>
      </footer>

      <IteronHud />
    </div>
  );
};

export default Index;
