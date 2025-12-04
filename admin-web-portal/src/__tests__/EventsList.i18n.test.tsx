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

// Mock hooks to provide deterministic data
vi.mock('../hooks/events', () => ({
  useEvents: () => ({ data: [{ id: '1', name: 'Concierto', event_date: '2025-12-01T18:00:00.000Z', status: 'draft' }], isLoading: false }),
  useDeleteEvent: () => ({ mutate: vi.fn() }),
}))

describe('EventsList i18n', () => {
  it('renders Spanish headers', () => {
    localStorage.setItem('portal_locale', 'es')
    renderWithProviders(<EventsList onEdit={() => {}} />)
    expect(screen.getByText('Nombre')).toBeTruthy()
    expect(screen.getByText('Fecha')).toBeTruthy()
    expect(screen.getByText('Estado')).toBeTruthy()
    expect(screen.getByText('Acciones')).toBeTruthy()
    expect(screen.getByText('Editar')).toBeTruthy()
    expect(screen.getByText('Eliminar')).toBeTruthy()
  })

  it('renders English headers', () => {
    localStorage.setItem('portal_locale', 'en')
    renderWithProviders(<EventsList onEdit={() => {}} />)
    expect(screen.getByText('Name')).toBeTruthy()
    expect(screen.getByText('Date')).toBeTruthy()
    expect(screen.getByText('Status')).toBeTruthy()
    expect(screen.getByText('Actions')).toBeTruthy()
    expect(screen.getByText('Edit')).toBeTruthy()
    expect(screen.getByText('Delete')).toBeTruthy()
  })
})
