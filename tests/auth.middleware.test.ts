import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref, computed } from 'vue'

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
Object.assign(process, { client: false, server: true })

const navigateTo = vi.fn()
vi.stubGlobal('navigateTo', navigateTo)

// Nuxt wraps middleware in defineNuxtRouteMiddleware — unwrap it for testing
vi.stubGlobal('defineNuxtRouteMiddleware', (fn: Function) => fn)

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, val: string) => { store[key] = val },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} }
  }
})()
vi.stubGlobal('localStorage', localStorageMock)

const { useAuthStore } = await import('../app/stores/auth.js')

// Mock useAuthStore globally so middleware picks it up
vi.stubGlobal('useAuthStore', () => useAuthStore())

const authMiddleware = (await import('../app/middleware/auth.js')).default

describe('Auth Middleware', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    navigateTo.mockClear()
  })

  it('redirects to /login when not authenticated', () => {
    authMiddleware({} as any, {} as any)
    expect(navigateTo).toHaveBeenCalledWith('/login')
  })

  it('does not redirect when authenticated', () => {
    const store = useAuthStore()
    store.setAuth({
      accessToken: 'valid-token',
      userId: 1,
      username: 'prasad',
      email: 'prasad@example.com',
      role: 'USER'
    })

    authMiddleware({} as any, {} as any)
    expect(navigateTo).not.toHaveBeenCalledWith('/login')
  })
})
