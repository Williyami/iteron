import { ShoppingCart, Star } from "lucide-react";
import type { Book } from "@/lib/books";
import { genreColors } from "@/lib/books";
import { BookCover } from "./BookCover";
import { trackEvent } from "@/lib/tracking";

const StarRating = ({ rating, count }: { rating: number; count: number }) => (
  <div className="flex items-center gap-1">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : star <= rating + 0.5
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
    <span className="text-xs text-muted-foreground">({count.toLocaleString()})</span>
  </div>
);

interface Props {
  book: Book;
  variant?: "default" | "compact";
  overrideTags?: string[];
}

export const BookCard = ({ book, variant = "default", overrideTags }: Props) => {
  const onCardClick = () =>
    trackEvent({ segment: book.genre, book_id: book.id, event_type: "click" });
  const onCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent({ segment: book.genre, book_id: book.id, event_type: "cart" });
  };

  if (variant === "compact") {
    return (
      <div onClick={onCardClick} className="group flex flex-col rounded-lg bg-card overflow-hidden transition-all duration-200 hover:bg-surface-hover hover:scale-[1.02] hover:shadow-lg hover:shadow-black/10 cursor-pointer">
        <BookCover book={book} className="aspect-[2/3]" />
        <div className="p-3">
          <h3 className="font-display text-xs font-semibold text-foreground truncate">{book.title}</h3>
          <p className="text-xs text-muted-foreground truncate">{book.author}</p>
          <span className="font-display text-sm font-bold text-foreground mt-1 block">{book.price} SEK</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onCardClick}
      className="group relative flex flex-col rounded-lg bg-card overflow-hidden transition-all duration-200 hover:bg-surface-hover hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10 cursor-pointer"
    >
      <BookCover book={book} className="aspect-[2/3]" />

      {/* genre tag */}
      <span className={`absolute top-2 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white/90 ${genreColors[book.genre]}`}>
        {book.genre}
      </span>

      <div className="flex flex-col gap-1.5 p-3">
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground leading-tight line-clamp-2">{book.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
        </div>
        <StarRating rating={book.rating} count={book.reviewCount} />
        {overrideTags && overrideTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {overrideTags.map((t) => (
              <span key={t} className="pill-amber">{t}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-foreground">{book.price} SEK</span>
            {book.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{book.originalPrice} SEK</span>
            )}
          </div>
          <button
            onClick={onCart}
            className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <ShoppingCart className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
