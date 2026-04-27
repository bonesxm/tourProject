export function ContactPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Send us a message and we’ll get back to you quickly.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              <span className="font-semibold">Name</span>
              <input
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
                placeholder="Your name"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold">Email</span>
              <input
                type="email"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
                placeholder="you@email.com"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold">Message</span>
              <textarea
                rows={5}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
                placeholder="How can we help?"
              />
            </label>
            <button
              type="button"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Send message
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm font-semibold">Location</div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Google Maps embed will be added here (production uses a proper embed key + consent).
          </p>
          <div className="mt-4 aspect-video w-full rounded-xl bg-slate-100 dark:bg-slate-900/50" />
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Email: support@smarttourism.local · Phone: +7 (000) 000-00-00
          </div>
        </div>
      </div>
    </div>
  )
}

