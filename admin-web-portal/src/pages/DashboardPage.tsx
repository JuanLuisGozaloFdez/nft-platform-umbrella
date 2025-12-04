import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useT } from '../i18n'
import { useFormatters } from '../utils/formatters'
import AdminMintForm from '../components/AdminMintForm'
import OwnerLookupForm from '../components/OwnerLookupForm'

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: ['admin-kpis'],
    queryFn: async () => (await api.get('/api/stats/kpis')).data,
  })
  const t = useT()
  const { formatNumber, formatMoney } = useFormatters()

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('nav_dashboard')}</h1>
      <p>{t('dashboard_intro') ?? 'KPIs y gráficos irán aquí.'}</p>
      {data && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-white border rounded">Ingresos: {formatMoney(data.revenue)}</div>
          <div className="p-4 bg-white border rounded">NFTs: {formatNumber(data.totalNFTs)}</div>
          <div className="p-4 bg-white border rounded">Check-ins: {formatNumber(data.totalCheckins)}</div>
        </div>
      )}
      {data && (
        <div className="mt-6 bg-white border rounded p-4">
          <h2 className="font-semibold mb-2">Tendencia de validaciones</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={[{ name: 'Total', value: data.totalCheckins }, { name: 'Usados', value: data.usedTickets }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#1D4ED8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="mt-6">
        <AdminMintForm />
      </div>
      <div className="mt-6">
        <OwnerLookupForm />
      </div>
    </div>
  )
}
