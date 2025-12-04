import { Link } from 'react-router-dom'
import SettingsMenu from '../components/SettingsMenu'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { LocaleProvider } from '../context/LocaleContext'
import { useT } from '../i18n'

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useT()
  const navigate = useNavigate()
  const { show } = useToast()
  const logout = () => {
    localStorage.removeItem('admin_jwt')
    localStorage.removeItem('admin_role')
    show(t('logout_success') || 'Sesión cerrada')
    navigate('/login')
  }
  return (
    <LocaleProvider>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b px-4 py-2 flex gap-4 items-center justify-between">
          <div className="flex gap-4">
            <Link to="/">{t('nav_dashboard')}</Link>
            <Link to="/events">{t('nav_events')}</Link>
            <Link to="/checkins">Check-ins</Link>
            <Link to="/audits">Audits</Link>
            <Link to="/roles">Roles</Link>
          </div>
          <div className="flex items-center gap-3">
            <SettingsMenu />
            <button className="border px-2 py-1" onClick={logout}>{t('logout') || 'Logout'}</button>
          </div>
        </nav>
        <main className="p-4">{children}</main>
      </div>
    </LocaleProvider>
  )
}
