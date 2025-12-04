import { useDeleteEvent, useEvents } from '../hooks/events'
import { useT } from '../i18n'
import { useFormatters } from '../utils/formatters'

export default function EventsList({ onEdit }: { onEdit: (id: string) => void }) {
  const { data, isLoading } = useEvents()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const del = useDeleteEvent()
  const t = useT()
  const { formatDate } = useFormatters()

  if (isLoading) return <p>{t('list_loading')}</p>

  const filtered = (data || []).filter((ev) => {
    const matchesText = query
      ? (ev.name?.toLowerCase().includes(query.toLowerCase()) || ev.description?.toLowerCase().includes(query.toLowerCase()))
      : true
    const matchesStatus = status ? ev.status === status : true
    return matchesText && matchesStatus
  })

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="border p-2 flex-1" placeholder={t('filter_search') || 'Buscar…'} value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="border p-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">{t('filter_all') || 'Todos'}</option>
          <option value="draft">{t('form_status_draft') || 'Borrador'}</option>
          <option value="published">{t('form_status_published') || 'Publicado'}</option>
          <option value="archived">{t('form_status_archived') || 'Archivado'}</option>
        </select>
      </div>
      <table className="w-full bg-white border">
      <thead>
        <tr>
          <th className="p-2 text-left">{t('list_name')}</th>
          <th className="p-2">{t('list_date')}</th>
          <th className="p-2">{t('list_status')}</th>
          <th className="p-2">{t('list_actions')}</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((ev) => (
          <tr key={ev.id} className="border-t">
            <td className="p-2">{ev.name}</td>
            <td className="p-2">{formatDate(ev.event_date)}</td>
            <td className="p-2">{ev.status}</td>
            <td className="p-2 flex gap-2 justify-center">
              <button className="px-2 py-1 border" onClick={() => onEdit(ev.id)}>{t('action_edit')}</button>
              <button className="px-2 py-1 border" onClick={() => del.mutate(ev.id)}>{t('action_delete')}</button>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  )
}
