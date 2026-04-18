import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Book } from "@/lib/books";
import { BookCard } from "./BookCard";

interface Props {
  title: string;
  subtitle?: string;
  books: Book[];
  variant?: "default" | "compact";
}

export const BookCarousel = ({ title, subtitle, books, variant = "default" }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="mb-10">
      <div className="container flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold font-display">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary cursor-pointer hover:underline mr-2">See all</span>
          <button onClick={() => scroll("left")} className="p-1.5 rounded-full bg-secondary hover:bg-surface-hover transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll("right")} className="p-1.5 rounded-full bg-secondary hover:bg-surface-hover transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="container">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        >
          {books.map((book) => (
            <div
              key={book.id}
              className={variant === "compact" ? "min-w-[140px] max-w-[140px]" : "min-w-[180px] max-w-[180px]"}
            >
              <BookCard book={book} variant={variant} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
