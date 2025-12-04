import { Route, Routes, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import EventsPage from './pages/EventsPage'
import LoginPage from './pages/LoginPage'
import CheckinsPage from './pages/CheckinsPage'
import AuditsPage from './pages/AuditsPage'
import AccessDeniedPage from './pages/AccessDeniedPage'
import RoleManagementPage from './pages/RoleManagementPage'
import Layout from './layouts/Layout'
import { useEffect, useState } from 'react'
import api from './lib/api'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider, useToast, toastBridge } from './context/ToastContext'
import Spinner from './components/Spinner'

function RequireRole({ children, roles = ['admin', 'organizer'] }: { children: JSX.Element; roles?: string[] }) {
  const { loading, token, role } = useAuth()
  if (loading) return <Spinner />
  if (!token) return <Navigate to="/login" replace />
  if (roles.length && role && !roles.includes(role)) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ToastBridgeBinder />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <RequireRole roles={['admin','organizer']}>
                <Layout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/checkins" element={<CheckinsPage />} />
                    <Route path="/audits" element={<AuditsPage />} />
                    <Route path="/roles" element={<RoleManagementPage />} />
                    <Route path="/access-denied" element={<AccessDeniedPage />} />
                  </Routes>
                </Layout>
              </RequireRole>
            }
          />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  )
}

// Bind toast bridge to provider so axios interceptors can show toasts
function ToastBridgeBinder() {
  const { show } = useToast()
  toastBridge.handler = show
  return null
}
