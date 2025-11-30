import { Link } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-2 flex gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/events">Events</Link>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  )
}
