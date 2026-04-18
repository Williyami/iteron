import { Search, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";

export const Header = () => {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="container flex h-14 items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-foreground flex-shrink-0">
          <BrandLogo variant="full" className="h-9" />
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search books, authors, genres..."
              className="w-full rounded-lg bg-secondary border border-border pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-4 ml-auto">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname === "/" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            to="/browse"
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname === "/browse" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Browse
          </Link>
          <Link
            to="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">0</span>
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
