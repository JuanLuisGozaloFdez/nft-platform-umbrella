import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { formatISO } from 'date-fns'
import { useT } from '../i18n'
import { useLocale } from '../context/LocaleContext'
import { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import enGB from 'date-fns/locale/en-GB'

registerLocale('es', es)
registerLocale('en', enGB)
import { useCreateEvent, useEvents, useUpdateEvent } from '../hooks/events'

export default function EventForm({ editingId, onDone }: { editingId?: string; onDone: () => void }) {
  const { data } = useEvents()
  const create = useCreateEvent()
  const update = useUpdateEvent()
  const [errors, setErrors] = useState<string[]>([])
  const { locale } = useLocale()
  const t = useT()

  const ev = data?.find((e) => e.id === editingId)
  const [dateVal, setDateVal] = useState<Date | null>(ev?.event_date ? new Date(ev.event_date) : null)

  useEffect(() => {
    // no-op; placeholder for side effects when editing
  }, [editingId])

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name') || ''),
      description: String(form.get('description') || ''),
      event_date: dateVal ? formatISO(dateVal, { representation: 'complete' }) : '',
      location: String(form.get('location') || ''),
      total_capacity: Number(form.get('total_capacity') || 0),
      status: String(form.get('status') || 'draft'),
    }

    const errs: string[] = []
    if (!payload.name || payload.name.length < 3) errs.push('El nombre es obligatorio y mínimo de 3 caracteres')
    if (!payload.event_date) errs.push('La fecha es obligatoria')
    else if (isNaN(Date.parse(payload.event_date))) errs.push('La fecha no es válida')
    if (payload.total_capacity < 0) errs.push('La capacidad debe ser 0 o mayor')
    if (payload.status && !['draft', 'published', 'archived'].includes(payload.status)) errs.push('Estado debe ser draft/published/archived')
    setErrors(errs)
    if (errs.length) return

    if (editingId) await update.mutateAsync({ id: editingId, payload })
    else await create.mutateAsync(payload)
    onDone()
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3 bg-white p-4 border rounded">
      {errors.length > 0 && (
        <ul className="col-span-2 bg-red-50 text-red-700 border border-red-200 p-2 rounded">
          {errors.map((er, i) => (<li key={i}>• { er }</li>))}
        </ul>
      )}
      <input name="name" defaultValue={ev?.name} className="border p-2" placeholder={t('form_name')} required minLength={3} />
      <div className="border p-2">
        <DatePicker
          selected={dateVal}
          onChange={(d) => setDateVal(d)}
          placeholderText={t('form_date')}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="Pp"
          locale={locale}
          className="w-full"
        />
      </div>
      <input name="location" defaultValue={ev?.location} className="border p-2" placeholder={t('form_location')} />
      <input name="total_capacity" defaultValue={ev?.total_capacity} type="number" min={0} className="border p-2" placeholder={t('form_capacity')} />
      <select name="status" defaultValue={ev?.status || 'draft'} className="border p-2" aria-label={t('form_status')}>
        <option value="draft">{locale === 'es' ? 'Borrador' : 'Draft'}</option>
        <option value="published">{locale === 'es' ? 'Publicado' : 'Published'}</option>
        <option value="archived">{locale === 'es' ? 'Archivado' : 'Archived'}</option>
      </select>
      <textarea name="description" defaultValue={ev?.description} className="border p-2 col-span-2" placeholder={t('form_description')} />
      <div className="col-span-2 flex justify-end gap-2">
        <button type="submit" className="bg-black text-white px-3 py-2">{t('form_save')}</button>
      </div>
    </form>
  )
}
