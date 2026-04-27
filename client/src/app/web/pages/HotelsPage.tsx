import { useEffect, useState } from 'react'

const hotels = [
  { name: 'Azure Bay Resort', city: 'Maldives', stars: 5, amenities: 'Pool • Spa • WiFi • Breakfast', price: 420, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80' },
  { name: 'Skyline Palace', city: 'Dubai', stars: 5, amenities: 'Infinity Pool • Lounge • Transfer', price: 350, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80' },
  { name: 'Mountain Pearl Hotel', city: 'Almaty', stars: 4, amenities: 'Spa • WiFi • Breakfast • Ski Shuttle', price: 180, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80' },
]

export function HotelsPage() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="container-page py-12">
      <h1 className="section-title">Premium Hotels & Resorts</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Choose elegant stays with premium facilities, city views, beaches, and mountain comfort.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="premium-card h-[24rem] animate-pulse bg-white/70 dark:bg-slate-900/60" />
            ))
          : hotels.map((h) => (
              <article key={h.name} className="premium-card overflow-hidden">
                <img src={h.image} className="h-56 w-full object-cover" />
                <div className="p-5">
                  <h2 className="text-xl font-semibold">{h.name}</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {'★'.repeat(h.stars)} · {h.city}
                  </p>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{h.amenities}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-sm">
                      From <span className="text-lg font-semibold text-emerald-600">${h.price}</span>{' '}
                      / night
                    </p>
                    <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white">
                      Reserve
                    </button>
                  </div>
                </div>
              </article>
            ))}
      </div>
    </div>
  )
}

