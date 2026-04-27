export function AboutPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-semibold tracking-tight">About us</h1>
      <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
        Smart Tourism Platform is a modern travel booking system: destination discovery, tours,
        hotels, secure bookings, and a personalized AI assistant for itinerary planning.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ['Mission', 'Make travel planning effortless and transparent.'],
          ['Team', 'Product + engineering + travel ops specialists.'],
          ['Values', 'Security, reliability, and excellent UX.'],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="text-sm font-semibold">{title}</div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

