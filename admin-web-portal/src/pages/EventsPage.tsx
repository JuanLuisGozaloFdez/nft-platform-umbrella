import { useState } from 'react'
import EventsList from '../components/EventsList'
import EventForm from '../components/EventForm'
import { useT } from '../i18n'

export default function EventsPage() {
  const [editingId, setEditingId] = useState<string | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)
  const t = useT()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('events_title')}</h1>
        <button className="bg-black text-white px-3 py-2" onClick={() => { setEditingId(undefined); setShowForm(true) }}>
          {t('events_new')}
        </button>
      </div>
      {showForm && (
        <EventForm editingId={editingId} onDone={() => { setShowForm(false); setEditingId(undefined) }} />
      )}
      <EventsList onEdit={(id) => { setEditingId(id); setShowForm(true) }} />
    </div>
  )
}
