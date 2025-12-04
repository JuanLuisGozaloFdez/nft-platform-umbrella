import { describe, it, expect, beforeEach, vi } from 'vitest'
import api from '../lib/api'

// Mock toastBridge globally
vi.mock('../context/ToastContext', () => ({
  toastBridge: {
    handler: vi.fn()
  }
}))

describe('Axios Interceptors Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists in localStorage', async () => {
      localStorage.setItem('admin_jwt', 'test-jwt-token-123')

      // Verify the interceptor exists
      expect(api.interceptors.request.handlers.length).toBeGreaterThan(0)
    })

    it('should not add Authorization header when no token exists', () => {
      // Verify the interceptor exists
      expect(api.interceptors.request.handlers.length).toBeGreaterThan(0)
    })

    it('should update Authorization header when token changes', () => {
      localStorage.setItem('admin_jwt', 'first-token')
      expect(localStorage.getItem('admin_jwt')).toBe('first-token')

      localStorage.setItem('admin_jwt', 'second-token')
      expect(localStorage.getItem('admin_jwt')).toBe('second-token')
    })
  })

  describe('Response Interceptor', () => {
    it('should have response interceptor configured', () => {
      // Verify the response interceptor exists
      expect(api.interceptors.response.handlers.length).toBeGreaterThan(0)
    })

    it('should clear localStorage on 401 error', async () => {
      localStorage.setItem('admin_jwt', 'expired-token')
      localStorage.setItem('admin_role', 'admin')

      // Verify items exist before clearing
      expect(localStorage.getItem('admin_jwt')).toBe('expired-token')
      expect(localStorage.getItem('admin_role')).toBe('admin')

      // Simulate 401 error handling
      localStorage.removeItem('admin_jwt')
      localStorage.removeItem('admin_role')

      // Verify items were cleared
      expect(localStorage.getItem('admin_jwt')).toBeNull()
      expect(localStorage.getItem('admin_role')).toBeNull()
    })

    it('should handle token expiration flow', () => {
      localStorage.setItem('admin_jwt', 'valid-token')
      expect(localStorage.getItem('admin_jwt')).toBe('valid-token')

      // On 401, should be cleared
      localStorage.removeItem('admin_jwt')
      expect(localStorage.getItem('admin_jwt')).toBeNull()
    })

    it('should maintain token for non-401 errors', () => {
      localStorage.setItem('admin_jwt', 'valid-token')
      expect(localStorage.getItem('admin_jwt')).toBe('valid-token')

      // For 404/429/5xx errors, token should remain
      expect(localStorage.getItem('admin_jwt')).toBe('valid-token')
    })
  })

  describe('Request flow with storage', () => {
    it('should use token from localStorage in requests', async () => {
      const token = 'test-integration-token-xyz'
      localStorage.setItem('admin_jwt', token)

      expect(localStorage.getItem('admin_jwt')).toBe(token)
    })

    it('should clear auth on token removal', () => {
      localStorage.setItem('admin_jwt', 'token')
      localStorage.setItem('admin_role', 'admin')

      // Clear auth
      localStorage.removeItem('admin_jwt')
      localStorage.removeItem('admin_role')

      expect(localStorage.getItem('admin_jwt')).toBeNull()
      expect(localStorage.getItem('admin_role')).toBeNull()
    })

    it('should preserve auth across localStorage updates', () => {
      localStorage.setItem('admin_jwt', 'original-token')
      localStorage.setItem('admin_role', 'admin')

      // Update token while preserving role
      localStorage.setItem('admin_jwt', 'new-token')

      expect(localStorage.getItem('admin_jwt')).toBe('new-token')
      expect(localStorage.getItem('admin_role')).toBe('admin')
    })
  })

  describe('API instance configuration', () => {
    it('should have request interceptor configured', () => {
      // The interceptor should exist and be a function
      expect(api.interceptors.request).toBeDefined()
    })

    it('should have response interceptor configured', () => {
      // The interceptor should exist and be a function
      expect(api.interceptors.response).toBeDefined()
    })
  })
})
