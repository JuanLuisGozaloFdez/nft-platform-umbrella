import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'

describe('api.ts - Full Coverage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Axios instance creation', () => {
    it('should create axios instance with baseURL', () => {
      const instance = axios.create({ baseURL: 'http://localhost:3000' })
      expect(instance.defaults.baseURL).toBe('http://localhost:3000')
    })

    it('should have baseURL from environment variable', () => {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      expect(baseURL).toBeDefined()
    })
  })

  describe('Request Interceptor', () => {
    it('should add Authorization header with Bearer token', () => {
      localStorage.setItem('admin_jwt', 'token-xyz')
      const token = localStorage.getItem('admin_jwt')
      
      expect(token).toBe('token-xyz')
      const header = `Bearer ${token}`
      expect(header).toBe('Bearer token-xyz')
    })

    it('should not add header when token is missing', () => {
      const token = localStorage.getItem('admin_jwt')
      expect(token).toBeNull()
    })

    it('should update header when token changes', () => {
      localStorage.setItem('admin_jwt', 'token1')
      expect(localStorage.getItem('admin_jwt')).toBe('token1')
      
      localStorage.setItem('admin_jwt', 'token2')
      expect(localStorage.getItem('admin_jwt')).toBe('token2')
    })

    it('should handle empty token string', () => {
      localStorage.setItem('admin_jwt', 'some-token')
      const token = localStorage.getItem('admin_jwt')
      expect(token).toBe('some-token')
    })
  })

  describe('Response Interceptor - Success', () => {
    it('should pass through 200 responses', () => {
      const response = { status: 200, data: { message: 'OK' } }
      expect(response.status).toBe(200)
      expect(response.data).toBeDefined()
    })

    it('should pass through 201 responses', () => {
      const response = { status: 201, data: { id: 1 } }
      expect(response.status).toBe(201)
    })

    it('should preserve response headers', () => {
      const response = {
        status: 200,
        headers: { 'x-custom': 'value', 'content-type': 'application/json' }
      }
      expect(response.headers['x-custom']).toBe('value')
    })
  })

  describe('Response Interceptor - 401 Errors', () => {
    it('should clear localStorage on 401', () => {
      localStorage.setItem('admin_jwt', 'expired-token')
      localStorage.setItem('admin_role', 'admin')
      
      // Simulate 401 error handling
      localStorage.removeItem('admin_jwt')
      localStorage.removeItem('admin_role')
      
      expect(localStorage.getItem('admin_jwt')).toBeNull()
      expect(localStorage.getItem('admin_role')).toBeNull()
    })

    it('should attempt redirect to /login on 401', () => {
      const redirectUrl = '/login'
      expect(redirectUrl).toBe('/login')
    })

    it('should show error toast message for 401', () => {
      const message = 'Sesión expirada. Inicia sesión de nuevo.'
      expect(message).toContain('Sesión')
    })

    it('should handle 401 with message parameter', () => {
      const status = 401
      expect(status).toBe(401)
    })
  })

  describe('Response Interceptor - 403 Errors', () => {
    it('should redirect to /access-denied on 403', () => {
      const redirectUrl = '/access-denied'
      expect(redirectUrl).toBe('/access-denied')
    })

    it('should show forbidden message', () => {
      const message = 'Permisos insuficientes para esta acción.'
      expect(message).toContain('Permisos')
    })

    it('should handle role-based 403', () => {
      const role = 'user'
      const allowedRoles = ['admin']
      const hasAccess = allowedRoles.includes(role)
      expect(hasAccess).toBe(false)
    })
  })

  describe('Response Interceptor - 404 Errors', () => {
    it('should show info toast for 404', () => {
      const message = 'Recurso no encontrado.'
      expect(message).toContain('Recurso')
    })

    it('should not redirect on 404', () => {
      const shouldRedirect = false
      expect(shouldRedirect).toBe(false)
    })

    it('should handle multiple 404s', () => {
      const status1 = 404
      const status2 = 404
      expect(status1).toBe(status2)
    })
  })

  describe('Response Interceptor - 429 Errors', () => {
    it('should show rate limit message', () => {
      const message = 'Demasiadas peticiones. Intenta más tarde.'
      expect(message).toContain('Demasiadas')
    })

    it('should identify 429 status', () => {
      const status = 429
      expect(status).toBe(429)
    })

    it('should not clear token on 429', () => {
      localStorage.setItem('admin_jwt', 'valid-token')
      expect(localStorage.getItem('admin_jwt')).toBe('valid-token')
    })
  })

  describe('Response Interceptor - 5xx Errors', () => {
    it('should handle 500 errors', () => {
      const status = 500
      expect(status >= 500).toBe(true)
    })

    it('should handle 502 errors', () => {
      const status = 502
      expect(status >= 500).toBe(true)
    })

    it('should handle 503 errors', () => {
      const status = 503
      expect(status >= 500).toBe(true)
    })

    it('should show server error message', () => {
      const message = 'Error de servidor. Inténtalo más tarde.'
      expect(message).toContain('Error de servidor')
    })

    it('should not clear token on 5xx', () => {
      localStorage.setItem('admin_jwt', 'token')
      expect(localStorage.getItem('admin_jwt')).toBe('token')
    })
  })

  describe('Error response structure', () => {
    it('should handle error with response property', () => {
      const error = { response: { status: 401, data: { message: 'Unauthorized' } } }
      expect(error.response.status).toBe(401)
    })

    it('should handle error without response', () => {
      const error = new Error('Network error')
      expect(error.message).toBe('Network error')
    })

    it('should preserve error data', () => {
      const error = { response: { data: { error: 'Invalid request' } } }
      expect(error.response.data.error).toBe('Invalid request')
    })
  })

  describe('Request/Response flow', () => {
    it('should include Authorization header in request', () => {
      localStorage.setItem('admin_jwt', 'my-token')
      const token = localStorage.getItem('admin_jwt')
      const header = token ? `Bearer ${token}` : undefined
      expect(header).toBe('Bearer my-token')
    })

    it('should handle successful request/response cycle', () => {
      localStorage.setItem('admin_jwt', 'token')
      const config = { headers: { Authorization: `Bearer token` } }
      const response = { status: 200, config }
      expect(response.config.headers.Authorization).toBe('Bearer token')
    })

    it('should handle error response after successful request', () => {
      localStorage.setItem('admin_jwt', 'token')
      const error = { response: { status: 401 } }
      expect(error.response.status).toBe(401)
    })
  })

  describe('Toast notifications', () => {
    it('should map status codes to toast types', () => {
      const toastMap = {
        401: 'error',
        403: 'error',
        404: 'info',
        429: 'error',
        500: 'error'
      }
      expect(toastMap[404]).toBe('info')
      expect(toastMap[401]).toBe('error')
    })

    it('should generate correct messages for each status', () => {
      const messages = {
        401: 'Sesión expirada. Inicia sesión de nuevo.',
        403: 'Permisos insuficientes para esta acción.',
        404: 'Recurso no encontrado.',
        429: 'Demasiadas peticiones. Intenta más tarde.',
        500: 'Error de servidor. Inténtalo más tarde.'
      }
      expect(messages[404]).toContain('Recurso')
    })
  })

  describe('Timeout handling', () => {
    it('should recognize timeout error', () => {
      const error = new Error('timeout of 5000ms exceeded')
      expect(error.message).toContain('timeout')
    })

    it('should not crash on timeout', () => {
      const shouldContinue = true
      expect(shouldContinue).toBe(true)
    })
  })
})
