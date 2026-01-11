import { vi } from 'vitest'

// Mock localStorage for browser environment tests
const localStorageMock = (() => {
	let store: Record<string, string> = {}
	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => { store[key] = value.toString() },
		removeItem: (key: string) => { delete store[key] },
		clear: () => { store = {} }
	}
})()

Object.defineProperty(global, 'localStorage', {
	value: localStorageMock,
	writable: true
})

// Mock window.location for redirect tests
Object.defineProperty(global, 'window', {
	value: {
		location: {
			replace: vi.fn()
		}
	},
	writable: true
})
