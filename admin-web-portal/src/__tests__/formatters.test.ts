import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { LocaleProvider } from '../context/LocaleContext'
import { useFormatters } from '../utils/formatters'

describe('formatters', () => {
  it('formats numbers and currency for es-ES/EUR', () => {
    localStorage.setItem('portal_locale', 'es')
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <LocaleProvider>{children}</LocaleProvider>
    )
    const { result } = renderHook(() => useFormatters(), { wrapper })
    expect(result.current.lang).toBe('es-ES')
    expect(result.current.currencyCode).toBe('EUR')
    expect(result.current.formatMoney(1234.5)).toMatch(/€|EUR/)
  })

  it('formats numbers and currency for en-GB/GBP', () => {
    localStorage.setItem('portal_locale', 'en')
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <LocaleProvider>{children}</LocaleProvider>
    )
    const { result } = renderHook(() => useFormatters(), { wrapper })
    expect(result.current.lang).toBe('en-GB')
    expect(result.current.currencyCode).toBe('GBP')
    expect(result.current.formatMoney(1234.5)).toMatch(/£|GBP/)
  })
})
