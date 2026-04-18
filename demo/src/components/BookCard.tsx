import { Book } from "@/lib/books";
import { BookCover } from "./BookCover";
import { trackEvent } from "@/lib/tracking";

interface Props {
  book: Book;
  overrideTags?: string[];
}

export const BookCard = ({ book, overrideTags }: Props) => {
  const tags = overrideTags ?? book.tags;

  const onCardClick = () =>
    trackEvent({ segment: book.genre, book_id: book.id, event_type: "click" });

  const onCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent({ segment: book.genre, book_id: book.id, event_type: "cart" });
  };

  return (
    <article
      onClick={onCardClick}
      className="group flex flex-col cursor-pointer"
    >
      <BookCover
        title={book.title}
        author={book.author}
        bg={book.cover.bg}
        fg={book.cover.fg}
      />
      <div className="pt-5 flex flex-col flex-1">
        <h3 className="font-display text-xl text-paper leading-tight">{book.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">by {book.author}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((t) => (
            <span key={t} className="pill">{t}</span>
          ))}
        </div>
        <button
          onClick={onCart}
          className="mt-5 self-start text-[11px] uppercase tracking-[0.22em] text-amber border-b border-amber/40 pb-1 hover:border-amber transition-colors"
        >
          Add to Cart →
        </button>
      </div>
    </article>
  );
};
