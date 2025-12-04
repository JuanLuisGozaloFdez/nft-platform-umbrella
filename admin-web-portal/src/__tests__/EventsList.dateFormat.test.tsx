import { describe, it, expect } from 'vitest'
import { LocaleProvider } from '../context/LocaleContext'
import EventsList from '../components/EventsList'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient()
  return render(
    <LocaleProvider>
      <QueryClientProvider client={qc}>{ui}</QueryClientProvider>
    </LocaleProvider>
  )
}

vi.mock('../hooks/events', () => ({
  useEvents: () => ({ data: [{ id: '1', name: 'Concierto', event_date: '2025-12-01T18:00:00.000Z', status: 'draft' }], isLoading: false }),
  useDeleteEvent: () => ({ mutate: vi.fn() }),
}))

describe('EventsList date formatting per locale', () => {
  it('formats date in Spanish locale (es-ES)', () => {
    localStorage.setItem('portal_locale', 'es')
    renderWithProviders(<EventsList onEdit={() => {}} />)
    // Expect Spanish month abbreviation like "dic" present
    const cell = screen.getByText(/dic|ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov/i)
    expect(cell).toBeTruthy()
  })

  it('formats date in English locale (en-GB)', () => {
    localStorage.setItem('portal_locale', 'en')
    renderWithProviders(<EventsList onEdit={() => {}} />)
    // Expect English month abbreviation like "Dec" present
    const cell = screen.getByText(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/)
    expect(cell).toBeTruthy()
  })
})
