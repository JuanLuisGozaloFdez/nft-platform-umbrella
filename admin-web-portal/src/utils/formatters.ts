import { useLocale } from '../context/LocaleContext'

export function useFormatters() {
  const { locale } = useLocale()
  const lang = locale === 'es' ? 'es-ES' : 'en-GB'
  const num = new Intl.NumberFormat(lang)
  const date = new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeStyle: 'short' })
  const currencyCode = locale === 'es' ? 'EUR' : 'GBP'
  const money = new Intl.NumberFormat(lang, { style: 'currency', currency: currencyCode })
  return {
    formatNumber: (n: number) => num.format(n),
    formatDate: (d: string | number | Date) => date.format(typeof d === 'string' ? new Date(d) : d),
    formatMoney: (n: number) => money.format(n),
    lang,
    currencyCode,
  }
}
