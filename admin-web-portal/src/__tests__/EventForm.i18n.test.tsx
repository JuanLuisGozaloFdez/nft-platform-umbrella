import { describe, it, expect } from 'vitest'
import { LocaleProvider } from '../context/LocaleContext'
import EventForm from '../components/EventForm'
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
  useEvents: () => ({ data: [], isLoading: false }),
  useCreateEvent: () => ({ mutateAsync: vi.fn() }),
  useUpdateEvent: () => ({ mutateAsync: vi.fn() }),
}))

describe('EventForm i18n', () => {
  it('shows Spanish placeholders and button', () => {
    localStorage.setItem('portal_locale', 'es')
    renderWithProviders(<EventForm onDone={() => {}} />)
    expect(screen.getByPlaceholderText('Nombre')).toBeTruthy()
    expect(screen.getByPlaceholderText('Fecha del evento')).toBeTruthy()
    expect(screen.getByPlaceholderText('Ubicación')).toBeTruthy()
    expect(screen.getByPlaceholderText('Capacidad')).toBeTruthy()
    expect(screen.getByPlaceholderText('Descripción')).toBeTruthy()
    expect(screen.getByText('Guardar')).toBeTruthy()
  })

  it('shows English placeholders and button', () => {
    localStorage.setItem('portal_locale', 'en')
    renderWithProviders(<EventForm onDone={() => {}} />)
    expect(screen.getByPlaceholderText('Name')).toBeTruthy()
    expect(screen.getByPlaceholderText('Event date')).toBeTruthy()
    expect(screen.getByPlaceholderText('Location')).toBeTruthy()
    expect(screen.getByPlaceholderText('Capacity')).toBeTruthy()
    expect(screen.getByPlaceholderText('Description')).toBeTruthy()
    expect(screen.getByText('Save')).toBeTruthy()
  })
})
