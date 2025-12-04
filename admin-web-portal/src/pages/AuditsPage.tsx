import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useMemo, useState } from 'react'
import { useT } from '../i18n'

type AuditItem = { tokenId: string; eventId: string; ownerAddress: string; result: string; message?: string; createdAt: string }

export default function AuditsPage() {
  const t = useT()
  const [q, setQ] = useState('')
  const [eventId, setEventId] = useState('')
  const [result, setResult] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const params = useMemo(() => ({ q, eventId, result, from, to, page, limit: 20 }), [q, eventId, result, from, to, page])
  const { data } = useQuery({
    queryKey: ['audits', params],
    queryFn: async () => (await api.get('/api/stats/audits', { params })).data as { total: number; page: number; limit: number; items: AuditItem[] },
  })

  const exportCsv = () => {
    const search = new URLSearchParams()
    if (q) search.set('q', q)
    if (eventId) search.set('eventId', eventId)
    if (result) search.set('result', result)
    if (from) search.set('from', from)
    if (to) search.set('to', to)
    const url = `/api/stats/audits/export?${search.toString()}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('audits_title') || 'Auditoría de check-ins'}</h1>
      <div className="bg-white border rounded p-4 space-y-2">
        <div className="grid grid-cols-5 gap-2">
          <input className="border p-2" placeholder={t('filter_search') || 'Buscar…'} value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="border p-2" placeholder="Event ID" value={eventId} onChange={(e) => setEventId(e.target.value)} />
          <select className="border p-2" value={result} onChange={(e) => setResult(e.target.value)}>
            <option value="">Todos</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="ALREADY_USED">ALREADY_USED</option>
            <option value="NOT_OWNER">NOT_OWNER</option>
            <option value="ERROR">ERROR</option>
          </select>
          <input type="date" className="border p-2" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input type="date" className="border p-2" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="flex justify-between items-center">
          <button className="border px-3 py-2" onClick={exportCsv}>Export CSV</button>
          <div className="flex items-center gap-2">
            <button disabled={page<=1} className="border px-2 py-1" onClick={() => setPage((p) => Math.max(1, p-1))}>Prev</button>
            <span>{data?.page ?? page}</span>
            <button disabled={(data?.page ?? 1) * (data?.limit ?? 20) >= (data?.total ?? 0)} className="border px-2 py-1" onClick={() => setPage((p) => p+1)}>Next</button>
          </div>
        </div>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-2 text-left">Token</th>
              <th className="p-2 text-left">Event</th>
              <th className="p-2 text-left">Owner</th>
              <th className="p-2">Result</th>
              <th className="p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((i) => (
              <tr key={`${i.tokenId}-${i.createdAt}`} className="border-t">
                <td className="p-2">{i.tokenId}</td>
                <td className="p-2">{i.eventId}</td>
                <td className="p-2">{i.ownerAddress}</td>
                <td className="p-2 text-center">{i.result}</td>
                <td className="p-2">{new Date(i.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
