import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export type Event = {
  id: string
  name: string
  description?: string
  event_date: string
  location?: string
  total_capacity?: number
  status?: string
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => (await api.get('/admin/events')).data as Event[],
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Event>) => (await api.post('/admin/events', payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Event> }) => (
      await api.put(`/admin/events/${id}`, payload)
    ).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin/events/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })
}
