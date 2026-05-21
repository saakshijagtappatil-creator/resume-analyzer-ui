import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref, computed } from 'vue'

// Stub Nuxt globals before importing store
vi.stubGlobal('navigateTo', vi.fn())
Object.assign(process, { client: true, server: false })

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
vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)

const { useAuthStore } = await import('../app/stores/auth.js')

const mockAuthData = {
  accessToken: 'test-jwt-token',
  userId: 42,
  username: 'prasad',
  email: 'prasad@example.com',
  role: 'USER'
}

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('isLoggedIn is false when no token', () => {
    const store = useAuthStore()
    expect(store.isLoggedIn).toBe(false)
  })

  it('setAuth stores token and user correctly', () => {
    const store = useAuthStore()
    store.setAuth(mockAuthData)

    expect(store.token).toBe('test-jwt-token')
    expect(store.user).toEqual({
      id: 42,
      username: 'prasad',
      email: 'prasad@example.com',
      role: 'USER'
    })
  })

  it('isLoggedIn is true after setAuth', () => {
    const store = useAuthStore()
    store.setAuth(mockAuthData)
    expect(store.isLoggedIn).toBe(true)
  })

  it('setAuth persists token and user to localStorage', () => {
    const store = useAuthStore()
    store.setAuth(mockAuthData)

    expect(localStorageMock.getItem('token')).toBe('test-jwt-token')
    expect(JSON.parse(localStorageMock.getItem('user')!)).toEqual({
      id: 42,
      username: 'prasad',
      email: 'prasad@example.com',
      role: 'USER'
    })
  })

  it('logout clears token and user', () => {
    const store = useAuthStore()
    store.setAuth(mockAuthData)
    store.logout()

    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })

  it('isLoggedIn is false after logout', () => {
    const store = useAuthStore()
    store.setAuth(mockAuthData)
    store.logout()
    expect(store.isLoggedIn).toBe(false)
  })

  it('logout removes token and user from localStorage', () => {
    const store = useAuthStore()
    store.setAuth(mockAuthData)
    store.logout()

    expect(localStorageMock.getItem('token')).toBeNull()
    expect(localStorageMock.getItem('user')).toBeNull()
  })

  it('logout calls navigateTo /login', () => {
    const navigateTo = vi.fn()
    vi.stubGlobal('navigateTo', navigateTo)
    const store = useAuthStore()
    store.setAuth(mockAuthData)
    store.logout()
    expect(navigateTo).toHaveBeenCalledWith('/login')
  })

  it('loadFromStorage restores token and user from localStorage', () => {
    localStorageMock.setItem('token', 'saved-token')
    localStorageMock.setItem('user', JSON.stringify({ id: 1, username: 'test', email: 'test@test.com', role: 'USER' }))

    const store = useAuthStore()
    store.loadFromStorage()

    expect(store.token).toBe('saved-token')
    expect(store.user?.username).toBe('test')
    expect(store.isLoggedIn).toBe(true)
  })
})
