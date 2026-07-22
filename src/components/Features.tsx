import { Leaf, Flame, Clock, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    desc: 'Locally sourced vegetables and daily-fresh produce in every dish.',
    color: 'from-green-400 to-emerald-600',
  },
  {
    icon: Flame,
    title: 'Cooked to Order',
    desc: 'Every plate is prepared fresh when you order — no reheated shortcuts.',
    color: 'from-orange-400 to-red-500',
  },
  {
    icon: Clock,
    title: 'Quick Service',
    desc: 'Most orders are ready in under 20 minutes. Hot food, zero waiting.',
    color: 'from-blue-400 to-sky-600',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Free delivery within 3 km on orders above ₹300. Packed with care.',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: ShieldCheck,
    title: 'Hygiene First',
    desc: 'FSSAI-certified kitchen with strict cleanliness and safety standards.',
    color: 'from-teal-400 to-cyan-600',
  },
  {
    icon: HeartHandshake,
    title: 'Loved by Many',
    desc: 'Hundreds of happy customers served daily across the campus and city.',
    color: 'from-rose-400 to-pink-600',
  },
];

export default function Features() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            More than just a canteen
          </h2>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">
            We blend taste, speed, and quality so every meal feels like a treat —
            whether it is a quick snack or a full plate of biryani.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-7 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} shadow-lg mb-5 group-hover:scale-110 transition-transform`}
              >
                <f.icon className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">{f.title}</h3>
              <p className="text-stone-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
