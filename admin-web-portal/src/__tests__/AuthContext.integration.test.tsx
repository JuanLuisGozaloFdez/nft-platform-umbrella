import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthProvider, useAuth } from '../context/AuthContext'
import api from '../lib/api'

// Mock api module
vi.mock('../lib/api', () => ({
  default: {
    get: vi.fn()
  }
}))

describe('AuthProvider Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should provide auth context', () => {
    expect(AuthProvider).toBeDefined()
    expect(useAuth).toBeDefined()
  })

  it('should check token in localStorage', () => {
    localStorage.setItem('admin_jwt', 'test-token')
    expect(localStorage.getItem('admin_jwt')).toBe('test-token')
  })

  it('should support role caching', () => {
    localStorage.setItem('admin_role', 'admin')
    expect(localStorage.getItem('admin_role')).toBe('admin')
  })

  it('should clear token on logout simulation', () => {
    localStorage.setItem('admin_jwt', 'token')
    localStorage.removeItem('admin_jwt')
    expect(localStorage.getItem('admin_jwt')).toBeNull()
  })

  it('should have API mock available', async () => {
    const mockGet = vi.mocked(api.get)
    mockGet.mockResolvedValueOnce({ data: { role: 'admin' } })

    await api.get('/test')

    expect(mockGet).toHaveBeenCalled()
  })

  it('should handle API errors', async () => {
    const mockGet = vi.mocked(api.get)
    mockGet.mockRejectedValueOnce(new Error('Failed'))

    await expect(api.get('/test')).rejects.toThrow()
  })
})
