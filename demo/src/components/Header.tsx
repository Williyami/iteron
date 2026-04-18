import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const { pathname } = useLocation();
  const NavItem = ({ to, label }: { to: string; label: string }) => (
    <Link
      to={to}
      className={`text-[12px] uppercase tracking-[0.22em] transition-colors ${
        pathname === to ? "text-paper" : "text-muted-foreground hover:text-paper"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/75 border-b border-hairline/60">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link to="/browse" className="flex items-baseline gap-2">
          <span className="font-display text-2xl text-paper tracking-tight">PageTurn</span>
          <span className="text-amber text-xs tracking-[0.3em] uppercase">·</span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Editorial bookshop
          </span>
        </Link>
        <nav className="flex items-center gap-7">
          <NavItem to="/browse" label="Browse" />
          <NavItem to="/about" label="About" />
          <NavItem to="/dashboard" label="Dashboard" />
        </nav>
      </div>
    </header>
  );
};
