import { useEffect, useState } from 'react';
import { ShoppingBag, UtensilsCrossed, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface NavbarProps {
  onCartClick: () => void;
  onMenuClick: () => void;
}

export default function Navbar({ onCartClick, onMenuClick }: NavbarProps) {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Menu', href: '#menu' },
    { label: 'About', href: '#about' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNav = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-stone-900/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNav('#home')}
            className="flex items-center gap-2.5 group"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-stone-900" strokeWidth={2.5} />
            </span>
            <span className="text-white font-extrabold text-xl tracking-tight">
              The<span className="text-amber-400">Canteen</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="px-4 py-2 text-sm font-medium text-stone-200 hover:text-amber-400 rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Cart + mobile toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-stone-900 font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 bg-stone-900/98 backdrop-blur-md rounded-b-2xl -mx-4 px-4 sm:-mx-6 sm:px-6">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="block w-full text-left px-4 py-3 text-base font-medium text-stone-200 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
