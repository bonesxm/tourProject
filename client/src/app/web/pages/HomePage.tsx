import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CalendarDays, Search, Sparkles, Star } from 'lucide-react'
import { useState } from 'react'
import { useLang } from '../../shared/i18n/LanguageContext'

const popular = [
  { title: 'Bali', country: 'Indonesia', priceFrom: 420, rating: 4.9, image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Dubai', country: 'UAE', priceFrom: 590, rating: 4.8, image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Paris', country: 'France', priceFrom: 520, rating: 4.7, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Istanbul', country: 'Türkiye', priceFrom: 330, rating: 4.8, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Almaty', country: 'Kazakhstan', priceFrom: 260, rating: 4.8, image: 'https://images.unsplash.com/photo-1464822759844-d150ad6ba46f?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Maldives', country: 'Indian Ocean', priceFrom: 890, rating: 5.0, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80' },
]

export function HomePage() {
  const [videoReady, setVideoReady] = useState(true)
  const { t } = useLang()
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[88vh]">
        {videoReady ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80"
            onError={() => setVideoReady(false)}
          >
            <source src="https://cdn.coverr.co/videos/coverr-white-sand-beach-1560/1080p.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/35 to-sky-700/35" />
        <div className="container-page relative flex min-h-[88vh] items-center py-14">
          <div className="max-w-3xl text-white">
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-semibold leading-tight sm:text-6xl">
              {t('discover')}
            </motion.h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90">
              {t('heroSub')}
            </p>
            <div className="glass mt-8 grid gap-3 rounded-3xl p-4 sm:grid-cols-5">
              <input className="rounded-xl bg-white/80 px-3 py-2 text-sm text-slate-800" placeholder={t('destination')} />
              <div className="flex items-center rounded-xl bg-white/80 px-3 py-2 text-sm text-slate-700"><CalendarDays className="mr-2 size-4" /> {t('dates')}</div>
              <input className="rounded-xl bg-white/80 px-3 py-2 text-sm text-slate-800" placeholder={t('guests')} />
              <input className="rounded-xl bg-white/80 px-3 py-2 text-sm text-slate-800" placeholder={t('budget')} />
              <Link to="/tours" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-2 font-semibold text-white">
                <Search className="mr-2 size-4" /> {t('search')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-600">TOP DESTINATIONS</p>
            <h2 className="section-title">Popular escapes with real vibes</h2>
          </div>
          <Link to="/destinations" className="text-sm font-semibold text-sky-700">See all</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((p) => (
            <article key={p.title} className="premium-card overflow-hidden">
              <img src={p.image} className="h-52 w-full object-cover transition duration-500 hover:scale-105" />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700"><Star className="size-3" /> {p.rating}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p.country}</p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Luxury stays, private tours, beach and city highlights.</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm">From <b>${p.priceFrom}</b></span>
                  <Link to={`/destinations/${p.title.toLowerCase()}`} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">Explore</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            ['Best prices', 'Exclusive deals for tours and hotels'],
            ['Secure payments', 'Protected card and instant confirmations'],
            ['24/7 support', 'Travel experts and AI assistant always online'],
            ['Verified stays', 'Only trusted hotels and experiences'],
          ].map(([t, d]) => (
            <div key={t} className="premium-card p-5">
              <div className="text-base font-semibold">{t}</div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-20 pt-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 p-8 text-white shadow-2xl">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-white/90"><Sparkles className="size-4" /> Limited offers this week</p>
              <h2 className="mt-2 text-3xl font-semibold">Start your next adventure today</h2>
              <p className="mt-2 text-white/90">Beach sunsets, mountain mornings, luxury stays and seamless booking.</p>
            </div>
            <div className="flex gap-3 md:justify-end">
              <Link to="/tours" className="rounded-xl bg-white px-4 py-3 font-semibold text-sky-700">Book tours</Link>
              <Link to="/hotels" className="rounded-xl border border-white/60 px-4 py-3 font-semibold">Reserve hotels</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

