import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../contexts/cart-context";
import { useAuth } from "@workspace/replit-auth-web";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/shop", label: "Shop" },
    ...(isAuthenticated ? [{ href: "/orders", label: "My Orders" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <button
            className="md:hidden p-2 -ml-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
            Aura.
          </Link>

          <nav className="hidden md:flex items-center gap-8 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm tracking-wide uppercase transition-colors hover:text-foreground/70",
                  location === link.href ? "text-foreground font-medium" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground/60">
                  {user?.firstName || user?.username || 'Account'}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors uppercase tracking-wide"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="text-sm text-foreground/60 hover:text-foreground transition-colors uppercase tracking-wide"
              >
                Sign In
              </Link>
            )}
          </div>

          <Link href="/cart" className="relative p-2 -mr-2 text-foreground hover:text-foreground/70 transition-colors group">
            <ShoppingBag size={22} className="stroke-[1.5]" />
            {itemCount > 0 && (
              <span className="absolute top-1.5 right-0.5 bg-foreground text-background text-[10px] font-medium h-4 w-4 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full h-[calc(100vh-5rem)] bg-background border-t border-border flex flex-col p-6 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-6 text-xl font-serif">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-foreground/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2 w-12" />
            {isAuthenticated ? (
              <>
                <div className="text-foreground/60 text-sm font-sans uppercase tracking-wide">
                  Signed in as {user?.firstName || user?.username || 'Account'}
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-left hover:text-foreground/70 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-foreground/70 transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
