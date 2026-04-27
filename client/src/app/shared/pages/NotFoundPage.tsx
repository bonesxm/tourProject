import { Link, useRouteError } from 'react-router-dom'

export function NotFoundPage() {
  const error = useRouteError() as unknown
  return (
    <div className="grid min-h-dvh place-items-center bg-slate-50 px-4 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="text-sm font-semibold text-brand-700 dark:text-brand-400">404</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          The page you requested doesn’t exist or has moved.
        </p>
        {error ? (
          <pre className="mt-4 max-h-40 overflow-auto rounded-2xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
            {JSON.stringify(error, null, 2)}
          </pre>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Go home
          </Link>
          <Link
            to="/destinations"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
          >
            Browse destinations
          </Link>
        </div>
      </div>
    </div>
  )
}

