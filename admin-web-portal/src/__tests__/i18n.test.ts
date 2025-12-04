import { describe, it, expect } from 'vitest'
import { LocaleProvider } from '../context/LocaleContext'
import { useT } from '../i18n'
import { renderHook } from '@testing-library/react'

describe('i18n useT', () => {
  it('returns Spanish strings when locale=es', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <LocaleProvider>{children}</LocaleProvider>
    )
    const { result } = renderHook(() => useT(), { wrapper })
    expect(result.current('nav_events')).toBe('Eventos')
    expect(result.current('login_action')).toBe('Acceder')
  })

  it('returns English strings when locale=en', () => {
    localStorage.setItem('portal_locale', 'en')
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <LocaleProvider>{children}</LocaleProvider>
    )
    const { result } = renderHook(() => useT(), { wrapper })
    expect(result.current('nav_events')).toBe('Events')
    expect(result.current('login_action')).toBe('Login')
  })
})
