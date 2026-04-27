import { Link } from 'react-router-dom'

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page grid gap-6 py-10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold">Smart Tourism Platform</div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Discover destinations, book tours & hotels, manage bookings, and get AI-powered travel
            recommendations.
          </p>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="font-semibold">Quick links</div>
          <Link className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" to="/destinations">
            Destinations
          </Link>
          <Link className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" to="/tours">
            Tours
          </Link>
          <Link className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" to="/hotels">
            Hotels
          </Link>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="font-semibold">Contact</div>
          <div className="text-slate-600 dark:text-slate-400">Email: support@smarttourism.local</div>
          <div className="text-slate-600 dark:text-slate-400">Phone: +7 (000) 000-00-00</div>
          <div className="text-slate-600 dark:text-slate-400">Address: Алматы, KZ</div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
        © {new Date().getFullYear()} Smart Tourism Platform. All rights reserved.
      </div>
    </footer>
  )
}

