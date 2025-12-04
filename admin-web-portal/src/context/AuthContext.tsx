import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

type AuthState = {
  loading: boolean
  token?: string
  role?: string
}

const AuthContext = createContext<AuthState>({ loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ loading: true })

  useEffect(() => {
    const token = localStorage.getItem('admin_jwt') || undefined
    if (!token) { setState({ loading: false }); return }
    api.get('/api/auth/me')
      .then((res) => {
        const serverRole = res.data?.role as string | undefined
        if (serverRole) localStorage.setItem('admin_role', serverRole)
        setState({ loading: false, token, role: serverRole || localStorage.getItem('admin_role') || undefined })
      })
      .catch(() => setState({ loading: false }))
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
