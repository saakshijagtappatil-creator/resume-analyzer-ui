import { vi } from 'vitest'
import { ref, computed } from 'vue'

// Mock Nuxt auto-imports used in stores/pages
vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('navigateTo', vi.fn())
vi.stubGlobal('useRouter', () => ({ push: vi.fn() }))
vi.stubGlobal('useRoute', () => ({ path: '/' }))
vi.stubGlobal('definePageMeta', vi.fn())
vi.stubGlobal('onMounted', vi.fn())
vi.stubGlobal('onUnmounted', vi.fn())
vi.stubGlobal('watch', vi.fn())
vi.stubGlobal('useRuntimeConfig', () => ({
  public: { apiBase: 'http://localhost:8080' }
}))
// Patch Nuxt-specific process properties without replacing process itself
Object.assign(process, { client: true, server: false })

// Mock localStorage
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
