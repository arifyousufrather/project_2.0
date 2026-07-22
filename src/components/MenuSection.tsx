import { Leaf, Drumstick, Star, Clock, Plus, Minus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Category, MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/format';

interface MenuSectionProps {
  categories: Category[];
  items: MenuItem[];
  loading: boolean;
  error: string | null;
}

export default function MenuSection({ categories, items, loading, error }: MenuSectionProps) {
  const [activeSlug, setActiveSlug] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const { items: cartItems, add, increment, decrement } = useCart();

  const filtered = useMemo(() => {
    let list = items;
    if (activeSlug !== 'all') {
      const cat = categories.find((c) => c.slug === activeSlug);
      if (cat) list = list.filter((i) => i.category_id === cat.id);
    }
    if (vegOnly) list = list.filter((i) => i.is_veg);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [items, categories, activeSlug, vegOnly, query]);

  const qtyOf = (id: string) => cartItems.find((i) => i.id === id)?.quantity ?? 0;

  return (
    <section id="menu" className="py-20 sm:py-28 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-4">
            Our Menu
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Order your favorites
          </h2>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">
            Veg, non-veg, Chinese, South Indian, and more — freshly made and ready in minutes.
          </p>
        </div>

        {/* Search + veg toggle */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
            />
          </div>
          <button
            onClick={() => setVegOnly((v) => !v)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              vegOnly
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-green-300'
            }`}
          >
            <span
              className={`flex items-center justify-center w-4 h-4 border-2 rounded-sm ${
                vegOnly ? 'border-white' : 'border-green-500'
              }`}
            >
              {vegOnly && <Leaf className="w-2.5 h-2.5 text-white" />}
            </span>
            Veg Only
          </button>
        </div>

        {/* Category chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <Chip active={activeSlug === 'all'} onClick={() => setActiveSlug('all')}>
            All Items
          </Chip>
          {categories.map((cat) => (
            <Chip key={cat.id} active={activeSlug === cat.slug} onClick={() => setActiveSlug(cat.slug)}>
              {cat.name}
            </Chip>
          ))}
        </div>

        {/* Content states */}
        {loading ? (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-stone-100 overflow-hidden animate-pulse">
                <div className="h-52 bg-stone-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-2/3 bg-stone-200 rounded" />
                  <div className="h-4 w-full bg-stone-100 rounded" />
                  <div className="h-9 w-full bg-stone-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-12 text-center py-16 rounded-2xl bg-red-50 border border-red-100">
            <p className="text-red-600 font-semibold">Could not load the menu</p>
            <p className="text-red-400 text-sm mt-1">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 text-center py-16">
            <p className="text-stone-500 text-lg">No dishes match your search.</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const qty = qtyOf(item.id);
              return (
                <article
                  key={item.id}
                  className="group flex flex-col rounded-2xl bg-white border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-200" />
                    )}
                    {/* Veg / non-veg marker */}
                    <div
                      className={`absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded-md bg-white shadow-md border-2 ${
                        item.is_veg ? 'border-green-500' : 'border-red-500'
                      }`}
                    >
                      {item.is_veg ? (
                        <Leaf className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                      ) : (
                        <Drumstick className="w-3.5 h-3.5 text-red-600" strokeWidth={3} />
                      )}
                    </div>
                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900/80 backdrop-blur-sm text-white text-xs font-bold">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {item.rating.toFixed(1)}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-lg font-bold text-stone-900 leading-snug">{item.name}</h3>
                    <p className="mt-1.5 text-sm text-stone-500 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Tags + prep time */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs text-stone-400">
                        <Clock className="w-3.5 h-3.5" />
                        {item.prep_time_min} min
                      </span>
                      {item.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer: price + add */}
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-stone-900">
                        {formatINR(item.price)}
                      </span>
                      {qty === 0 ? (
                        <button
                          onClick={() => add(item)}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-stone-900 font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all"
                        >
                          <Plus className="w-4 h-4" strokeWidth={3} />
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 bg-orange-50 rounded-xl p-1">
                          <button
                            onClick={() => decrement(item.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white text-orange-600 hover:bg-orange-100 transition-colors shadow-sm"
                          >
                            <Minus className="w-4 h-4" strokeWidth={3} />
                          </button>
                          <span className="w-7 text-center font-bold text-stone-900">{qty}</span>
                          <button
                            onClick={() => increment(item.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
                          >
                            <Plus className="w-4 h-4" strokeWidth={3} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
        active
          ? 'bg-stone-900 text-white shadow-lg'
          : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400 hover:bg-stone-50'
      }`}
    >
      {children}
    </button>
  );
}
