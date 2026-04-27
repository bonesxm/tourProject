import { Link, useParams } from 'react-router-dom'

const details = {
  'bali-luxury': {
    title: 'Bali Luxury Escape',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
    text: 'Private villa stays, waterfall routes, beach dinners, and premium transfers with local guide support.',
  },
  'dubai-premium': {
    title: 'Dubai Skyline Premium',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80',
    text: 'Desert safari, yacht sunset, skyline dining, and 5-star accommodations with concierge booking.',
  },
  'istanbul-classic': {
    title: 'Istanbul Bosphorus Classic',
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1600&q=80',
    text: 'Historic mosques, Bosphorus cruise, old city food walk, and boutique hotel experience.',
  },
} as const

export function TourDetailsPage() {
  const { slug = 'bali-luxury' } = useParams()
  const data = details[slug as keyof typeof details] || details['bali-luxury']
  return (
    <div className="container-page py-12">
      <img src={data.image} className="h-[26rem] w-full rounded-3xl object-cover shadow-2xl" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="premium-card p-6">
          <h1 className="text-3xl font-semibold">{data.title}</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{data.text}</p>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Includes: flights support, hotel, city transfers, breakfast, selected activities.
          </p>
        </div>
        <aside className="premium-card p-6">
          <p className="text-sm text-slate-500">Starting from</p>
          <p className="text-3xl font-semibold text-emerald-600">$1290</p>
          <Link to="/tours" className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
            Back to tours
          </Link>
        </aside>
      </div>
    </div>
  )
}

