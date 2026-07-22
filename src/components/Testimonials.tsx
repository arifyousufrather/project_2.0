import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Aisha Khan',
    role: 'Student',
    rating: 5,
    text: 'The chicken biryani is unreal — so flavorful and the portion is huge. My go-to lunch spot every single day.',
    avatar: 'https://images.pexels.com/photos/4158292/pexels-photo-4158292.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Rahul Sharma',
    role: 'Office Worker',
    rating: 5,
    text: 'Ordered the veg thali for the whole team. Fresh, hot, and delivered in 15 minutes. Cannot beat the value.',
    avatar: 'https://images.pexels.com/photos/2871757/pexels-photo-2871757.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Priya Nair',
    role: 'Regular Customer',
    rating: 4,
    text: 'Their masala dosa reminds me of home. Crispy, perfect chutneys, and the filter coffee is the cherry on top.',
    avatar: 'https://images.pexels.com/photos/4158292/pexels-photo-4158292.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Imran Sheikh',
    role: 'Food Blogger',
    rating: 5,
    text: 'The butter chicken is the best I have had in this area. Creamy, rich, and the naan is always soft and fresh.',
    avatar: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-20 sm:py-28 bg-stone-900 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/10 text-amber-300 text-sm font-semibold mb-4 border border-amber-400/20">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What our customers say
          </h2>
          <p className="mt-4 text-lg text-stone-400 leading-relaxed">
            Real words from real food lovers who keep coming back for more.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative p-7 rounded-2xl bg-stone-800/60 border border-stone-700/50 hover:border-amber-400/40 transition-colors"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-amber-400/20 group-hover:text-amber-400/40 transition-colors" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-600 fill-stone-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-stone-200 leading-relaxed text-base">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400/30"
                />
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-sm text-stone-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
