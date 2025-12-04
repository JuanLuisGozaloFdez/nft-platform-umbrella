import { Link } from 'react-router-dom'

export default function AccessDeniedPage() {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white border p-6 rounded text-center space-y-3">
      <nav className="text-sm text-gray-600"><Link to="/">Dashboard</Link> / <span>Acceso denegado</span></nav>
      <h1 className="text-2xl font-bold">Acceso denegado</h1>
      <p>No tienes permisos para acceder a esta sección.</p>
      <div className="pt-2">
        <Link to="/" className="border px-3 py-2">Volver al panel</Link>
      </div>
    </div>
  )
}
