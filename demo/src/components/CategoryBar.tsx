import { genres } from "@/lib/books";
import type { Genre } from "@/lib/books";
import { Search, Heart, Rocket, Swords, Crosshair, Landmark, BookOpen } from "lucide-react";

const genreIconMap: Record<Genre, React.ReactNode> = {
  Mystery:             <Search className="h-3.5 w-3.5" />,
  Romance:             <Heart className="h-3.5 w-3.5" />,
  "Sci-Fi":            <Rocket className="h-3.5 w-3.5" />,
  Fantasy:             <Swords className="h-3.5 w-3.5" />,
  Thriller:            <Crosshair className="h-3.5 w-3.5" />,
  "Historical Fiction": <Landmark className="h-3.5 w-3.5" />,
};

interface Props {
  activeGenre?: Genre | "All";
  onSelect?: (genre: Genre | "All") => void;
}

export const CategoryBar = ({ activeGenre = "All", onSelect }: Props) => (
  <div className="border-b border-border bg-card/50">
    <div className="container">
      <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
        <button
          onClick={() => onSelect?.("All")}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeGenre === "All"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          All Books
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onSelect?.(genre)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeGenre === genre
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {genreIconMap[genre]}
            {genre}
          </button>
        ))}
      </div>
    </div>
  </div>
);
