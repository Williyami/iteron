interface Props {
  title: string;
  author: string;
  bg: string;
  fg: string;
}

export const BookCover = ({ title, author, bg, fg }: Props) => {
  return (
    <div
      className="relative aspect-[2/3] w-full overflow-hidden rounded-sm shadow-[var(--shadow-card)] transition-transform duration-500 group-hover:-translate-y-1"
      style={{ backgroundColor: bg, color: fg }}
    >
      {/* spine highlight */}
      <div
        className="absolute inset-y-0 left-0 w-[6px]"
        style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.45), rgba(0,0,0,0))" }}
      />
      {/* texture */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, #fff 0, transparent 40%), radial-gradient(circle at 70% 80%, #fff 0, transparent 40%)",
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="text-[10px] uppercase tracking-[0.3em] opacity-70">PageTurn</div>
        <div>
          <div className="font-display text-xl leading-[1.05] mb-2" style={{ color: fg }}>
            {title}
          </div>
          <div className="h-px w-8 mb-2" style={{ background: fg, opacity: 0.5 }} />
          <div className="text-[10px] uppercase tracking-[0.25em] opacity-80">{author}</div>
        </div>
      </div>
      {/* sheen on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)" }}
      />
    </div>
  );
};
