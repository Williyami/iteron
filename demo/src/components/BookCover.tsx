import type { Book } from "@/lib/books";

interface Props {
  book: Book;
  className?: string;
}

export const BookCover = ({ book, className = "" }: Props) => (
  <div className={`relative overflow-hidden rounded-sm shadow-lg ${className}`}>
    {/* gradient background */}
    <div className={`absolute inset-0 bg-gradient-to-br ${book.coverBg}`} />

    {/* texture */}
    <div className="absolute inset-0 opacity-20" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }} />

    {/* spine */}
    <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/30" />

    {/* content */}
    <div className="relative flex flex-col justify-between h-full p-4 pt-6">
      <div className="flex justify-center mb-3">
        <div className={`w-8 h-0.5 ${book.coverAccent} opacity-60`} style={{ backgroundColor: 'currentColor' }} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
        <h3 className="font-display text-sm font-bold leading-tight text-white drop-shadow-lg mb-2">
          {book.title}
        </h3>
        <div className="w-6 h-px bg-white/30 mb-2" />
        <p className={`text-xs ${book.coverAccent} opacity-80 font-medium`}>
          {book.author}
        </p>
      </div>
      <div className="flex justify-center mt-3">
        <div className="w-4 h-4 border border-white/20 rotate-45" />
      </div>
    </div>

    {/* badges */}
    {book.bestseller && (
      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-bl-sm">
        BEST
      </div>
    )}
    {book.newRelease && (
      <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-bl-sm">
        NEW
      </div>
    )}
  </div>
);
