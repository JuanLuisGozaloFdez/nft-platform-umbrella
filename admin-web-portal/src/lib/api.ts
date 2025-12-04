import axios from 'axios'
import { toastBridge } from '../context/ToastContext'

const baseURL = import.meta.env.VITE_API_URL as string

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_jwt')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      toastBridge.handler?.('Sesión expirada. Inicia sesión de nuevo.', 'error')
      try {
        localStorage.removeItem('admin_jwt')
        localStorage.removeItem('admin_role')
      } catch {}
      // Redirect to login after gentle toast
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.replace('/login')
        }
      }, 500)
    } else if (status === 403) {
      toastBridge.handler?.('Permisos insuficientes para esta acción.', 'error')
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.replace('/access-denied')
        }
      }, 500)
    } else if (status === 404) {
      toastBridge.handler?.('Recurso no encontrado.', 'info')
    } else if (status === 429) {
      toastBridge.handler?.('Demasiadas peticiones. Intenta más tarde.', 'error')
    } else if (status >= 500) {
      toastBridge.handler?.('Error de servidor. Inténtalo más tarde.', 'error')
    }
    return Promise.reject(error)
  }
)

export default api
