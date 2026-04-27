import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type Lang = 'en' | 'ru' | 'kz'
type Dict = Record<string, string>

const dictionaries: Record<Lang, Dict> = {
  en: {
    home: 'Home',
    destinations: 'Destinations',
    tours: 'Tours',
    hotels: 'Hotels',
    about: 'About',
    contact: 'Contact',
    discover: 'Discover Your Next Dream Journey',
    heroSub: 'Book premium tours, boutique hotels, flights, and unforgettable experiences with one elegant platform.',
    destination: 'Destination',
    dates: 'Dates',
    guests: 'Guests',
    budget: 'Budget',
    search: 'Search',
  },
  ru: {
    home: 'Главная',
    destinations: 'Направления',
    tours: 'Туры',
    hotels: 'Отели',
    about: 'О нас',
    contact: 'Контакты',
    discover: 'Откройте свое следующее путешествие мечты',
    heroSub: 'Бронируйте премиальные туры, отели, перелеты и впечатления в одном сервисе.',
    destination: 'Направление',
    dates: 'Даты',
    guests: 'Гости',
    budget: 'Бюджет',
    search: 'Найти',
  },
  kz: {
    home: 'Басты бет',
    destinations: 'Бағыттар',
    tours: 'Турлар',
    hotels: 'Қонақ үйлер',
    about: 'Біз туралы',
    contact: 'Байланыс',
    discover: 'Келесі армандағы саяхатыңызды табыңыз',
    heroSub: 'Премиум турлар, қонақ үйлер мен рейстерді бір заманауи платформада брондаңыз.',
    destination: 'Бағыт',
    dates: 'Күндер',
    guests: 'Қонақтар',
    budget: 'Бюджет',
    search: 'Іздеу',
  },
}

type LanguageValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageValue | null>(null)

function getInitialLang(): Lang {
  const saved = localStorage.getItem('stp_lang')
  if (saved === 'en' || saved === 'ru' || saved === 'kz') return saved
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang)

  const value = useMemo<LanguageValue>(() => {
    const setLang = (next: Lang) => {
      setLangState(next)
      localStorage.setItem('stp_lang', next)
    }
    return {
      lang,
      setLang,
      t: (key: string) => dictionaries[lang][key] || key,
    }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}

