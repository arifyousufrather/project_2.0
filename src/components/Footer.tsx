import { UtensilsCrossed, MapPin, Phone, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const handleNav = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-stone-950 text-stone-400">
      {/* Contact strip */}
      <div className="border-b border-stone-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 flex-shrink-0">
                <MapPin className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Visit Us</h3>
                <p className="text-sm leading-relaxed">
                  Canteen Block, Main Campus Road,
                  <br />
                  Near Auditorium, Srinagar, 190001
                </p>
              </div>
            </div>
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 flex-shrink-0">
                <Phone className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Call to Order</h3>
                <a href="tel:+919000000000" className="text-sm hover:text-orange-400 transition-colors">
                  +91 90000 00000
                </a>
                <br />
                <a href="tel:+919111111111" className="text-sm hover:text-orange-400 transition-colors">
                  +91 91111 11111
                </a>
              </div>
            </div>
            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 flex-shrink-0">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Opening Hours</h3>
                <p className="text-sm">Mon – Sat: 8:00 AM – 10:00 PM</p>
                <p className="text-sm">Sunday: 9:00 AM – 9:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                <UtensilsCrossed className="w-5 h-5 text-stone-900" strokeWidth={2.5} />
              </span>
              <span className="text-white font-extrabold text-xl">
                The<span className="text-amber-400">Canteen</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              Serving fresh, flavorful meals since day one. From crispy dosas to juicy burgers,
              hearty biryani to chilled shakes — every dish is made with care and delivered with a smile.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-800 hover:bg-orange-500 hover:text-stone-900 text-stone-400 transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', href: '#home' },
                { label: 'Menu', href: '#menu' },
                { label: 'About', href: '#about' },
                { label: 'Reviews', href: '#reviews' },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              {['Vegetarian', 'Non-Veg', 'Chinese', 'South Indian', 'Fast Food', 'Desserts'].map(
                (cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => handleNav('#menu')}
                      className="hover:text-orange-400 transition-colors"
                    >
                      {cat}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar with name */}
      <div className="border-t border-stone-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-stone-500">
            &copy; {year} TheCanteen. All rights reserved.
          </p>
          <p className="text-stone-400">
            Crafted with{' '}
            <span className="text-orange-400 font-semibold">&hearts;</span> by{' '}
            <span className="font-bold text-white">Arif Yousuf Rather</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
