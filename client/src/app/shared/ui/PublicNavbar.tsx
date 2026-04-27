import { Link, NavLink } from 'react-router-dom'
import { Globe, Moon, Sun, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { useLang } from '../i18n/LanguageContext'
import { useAuth } from '../auth/AuthContext'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('stp_theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
}

export function PublicNavbar() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
  const nextTheme = useMemo<Theme>(() => (theme === 'dark' ? 'light' : 'dark'), [theme])
  const { lang, setLang, t } = useLang()
  const { user, logout } = useAuth()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('stp_theme', theme)
  }, [theme])

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/35 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/45">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-soft">
            ST
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Smart Tourism</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Platform</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            ['/', t('home')],
            ['/destinations', t('destinations')],
            ['/tours', t('tours')],
            ['/hotels', t('hotels')],
            ['/about', t('about')],
            ['/contact', t('contact')],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'rounded-xl px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-slate-900/90 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-700 hover:bg-white/70 dark:text-slate-100 dark:hover:bg-slate-900/60',
                )
              }
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:hover:bg-slate-900"
            onClick={() => setTheme(nextTheme)}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <label
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:hover:bg-slate-900"
            aria-label="Language switcher"
          >
            <Globe className="size-4" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'en' | 'ru' | 'kz')}
              className="bg-transparent text-sm outline-none"
            >
              <option value="en">EN</option>
              <option value="ru">RU</option>
              <option value="kz">KZ</option>
            </select>
          </label>
          <Link
            to="/admin"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-2 text-sm font-semibold text-white md:inline-flex"
          >
            <Sparkles className="size-4" />
            Admin
          </Link>
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="hidden rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm font-medium md:inline-block dark:bg-slate-900/70">
                {user.fullName}
              </Link>
              <button onClick={logout} className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm font-medium dark:bg-slate-900/70">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm font-medium dark:bg-slate-900/70">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

