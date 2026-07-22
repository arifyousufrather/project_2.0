import { ArrowRight } from 'lucide-react';

export default function CtaBanner() {
  const scrollToMenu = () =>
    document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-orange-950 px-6 py-14 sm:px-12 sm:py-16 text-center">
          {/* Decorative glows */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/10 text-amber-300 text-sm font-semibold mb-4 border border-amber-400/20">
              Limited Time
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
              Hungry? Your next meal is just a few taps away
            </h2>
            <p className="mt-4 text-lg text-stone-300 max-w-xl mx-auto">
              Order now and get fresh, hot food delivered in minutes. No queues, no waiting — just pure flavor.
            </p>
            <button
              onClick={scrollToMenu}
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-stone-900 font-bold text-base shadow-xl shadow-orange-500/40 hover:scale-105 transition-transform"
            >
              Order Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
