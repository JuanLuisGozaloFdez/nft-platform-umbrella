import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Locale = 'es' | 'en'

type LocaleCtx = {
  locale: Locale
  setLocale: (l: Locale) => void
}

const Ctx = createContext<LocaleCtx | undefined>(undefined)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')

  useEffect(() => {
    const saved = localStorage.getItem('portal_locale') as Locale | null
    if (saved) setLocaleState(saved)
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('portal_locale', l)
  }

  const value = useMemo(() => ({ locale, setLocale }), [locale])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLocale() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useLocale must be used within LocaleProvider')
  return v
}
