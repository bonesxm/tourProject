import { Heart, Plane, Utensils, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const tours = [
  { slug: 'bali-luxury', name: 'Bali Luxury Escape', city: 'Ubud, Bali', days: '7D / 6N', oldPrice: 1990, newPrice: 1490, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80' },
  { slug: 'dubai-premium', name: 'Dubai Skyline Premium', city: 'Dubai, UAE', days: '5D / 4N', oldPrice: 1790, newPrice: 1320, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80' },
  { slug: 'istanbul-classic', name: 'Istanbul Bosphorus Classic', city: 'Istanbul, Türkiye', days: '6D / 5N', oldPrice: 1290, newPrice: 980, image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1400&q=80' },
]

export function ToursPage() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="container-page py-12">
      <h1 className="section-title">Hot Tours & Adventures</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
        Handcrafted packages with hotels, transport, meals, and flexible dates. Click a card for full details.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="premium-card h-[32rem] animate-pulse bg-white/70 dark:bg-slate-900/60" />
            ))
          : tours.map((t) => (
          <article key={t.slug} className="premium-card overflow-hidden">
            <img src={t.image} className="h-64 w-full object-cover" />
            <div className="p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{t.name}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{t.city}</p>
                </div>
                <button className="rounded-full bg-rose-50 p-2 text-rose-500 dark:bg-rose-950/30"><Heart className="size-4" /></button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Full description: premium itinerary, local experiences, comfortable transfers, and curated stays.
              </p>
              <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
                <div className="flex items-center gap-2"><Plane className="size-4" /> Transport included</div>
                <div className="flex items-center gap-2"><Building2 className="size-4" /> Hotel included</div>
                <div className="flex items-center gap-2"><Utensils className="size-4" /> Meals included</div>
                <div>{t.days}</div>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 line-through">${t.oldPrice}</div>
                  <div className="text-xl font-semibold text-emerald-600">${t.newPrice}</div>
                </div>
                <Link to={`/tours/${t.slug}`} className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white">
                  Book now
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

