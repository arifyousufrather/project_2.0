import { ArrowRight, Star, Clock, Truck } from 'lucide-react';

export default function Hero() {
  const scrollToMenu = () =>
    document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Delicious food spread"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900/90 via-stone-900/75 to-orange-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(251,146,60,0.25),transparent_50%)]" />
      </div>

      {/* Floating food badges */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-12 w-20 h-20 rounded-2xl overflow-hidden shadow-2xl animate-[float_6s_ease-in-out_infinite] ring-2 ring-white/20">
          <img
            src="https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=200"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-40 left-24 w-16 h-16 rounded-2xl overflow-hidden shadow-2xl animate-[float_5s_ease-in-out_infinite_1s] ring-2 ring-white/20">
          <img
            src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-44 right-16 w-24 h-24 rounded-2xl overflow-hidden shadow-2xl animate-[float_7s_ease-in-out_infinite_0.5s] ring-2 ring-white/20">
          <img
            src="https://images.pexels.com/photos/4158292/pexels-photo-4158292.jpeg?auto=compress&cs=tinysrgb&w=200"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-52 right-28 w-20 h-20 rounded-2xl overflow-hidden shadow-2xl animate-[float_6.5s_ease-in-out_infinite_1.5s] ring-2 ring-white/20">
          <img
            src="https://images.pexels.com/photos/2871757/pexels-photo-2871757.jpeg?auto=compress&cs=tinysrgb&w=200"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-[fadeInUp_0.6s_ease-out]">
          <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-stone-100">Open Now · Free delivery on orders over ₹300</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight animate-[fadeInUp_0.7s_ease-out_0.1s_both]">
          Good Food,
          <br />
          <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            Great Mood
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed animate-[fadeInUp_0.7s_ease-out_0.2s_both]">
          From sizzling biryani to crisp dosas, juicy burgers to chilled shakes —
          order your canteen favorites and get them fresh, fast, and packed with flavor.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_0.7s_ease-out_0.3s_both]">
          <button
            onClick={scrollToMenu}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-stone-900 font-bold text-base shadow-xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all"
          >
            Explore Menu
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="tel:+919000000000"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-base hover:bg-white/15 transition-colors"
          >
            Call to Order
          </a>
        </div>

        {/* Quick stats */}
        <div className="mt-14 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto animate-[fadeInUp_0.7s_ease-out_0.4s_both]">
          {[
            { icon: Star, value: '4.8', label: 'Avg Rating', suffix: '/5' },
            { icon: Clock, value: '15', label: 'Min Delivery', suffix: 'min' },
            { icon: Truck, value: '500+', label: 'Daily Orders', suffix: '' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center px-2 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <stat.icon className="w-6 h-6 text-amber-400 mb-2" />
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {stat.value}
                <span className="text-amber-400 text-base sm:text-lg">{stat.suffix}</span>
              </div>
              <div className="text-xs sm:text-sm text-stone-300 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-[bounce_2s_ease-in-out_infinite]">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}
