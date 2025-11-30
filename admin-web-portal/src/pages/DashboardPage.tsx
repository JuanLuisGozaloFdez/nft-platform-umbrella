import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: ['admin-kpis'],
    queryFn: async () => (await api.get('/admin/kpis')).data,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>KPIs y gráficos irán aquí.</p>
      {data && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-white border rounded">Ingresos: {data.revenue}</div>
          <div className="p-4 bg-white border rounded">Entradas vendidas: {data.ticketsSold}</div>
          <div className="p-4 bg-white border rounded">Asistencia: {data.attendance}</div>
        </div>
      )}
    </div>
  )
}
