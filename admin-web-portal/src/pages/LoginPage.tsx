import { useT } from '../i18n'
import api from '../lib/api'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const t = useT()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') || '')
    const password = String(fd.get('password') || '')
    setError(null)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const { token, role } = res.data
      localStorage.setItem('admin_jwt', token)
      if (role) localStorage.setItem('admin_role', role)
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6 bg-white border rounded">
      <h1 className="text-xl font-semibold mb-4">Admin {t('nav_dashboard')} Login</h1>
      {error && <div className="mb-3 text-red-700 bg-red-50 border border-red-200 p-2">{error}</div>}
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <input name="email" className="border p-2" placeholder={(t('login_email') as any) || 'Email'} required />
        <input name="password" type="password" className="border p-2" placeholder={(t('login_password') as any) || 'Password'} required />
        <button type="submit" className="bg-black text-white py-2">{(t('login_action') as any) || 'Login'}</button>
      </form>
    </div>
  )
}
