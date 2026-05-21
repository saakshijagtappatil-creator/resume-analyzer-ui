import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Mirror login page logic
function makeLoginForm(apiLogin: (...args: any[]) => Promise<any>) {
  const emailOrUsername = ref('')
  const password = ref('')
  const isLoading = ref(false)
  const error = ref('')
  const showPassword = ref(false)

  const handleLogin = async () => {
    error.value = ''
    if (!emailOrUsername.value || !password.value) {
      error.value = 'Please fill in all fields'
      return
    }
    isLoading.value = true
    try {
      const response = await apiLogin(emailOrUsername.value, password.value)
      if (response.success) {
        return { success: true, data: response.data }
      }
    } catch {
      error.value = 'Invalid email or password. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  return { emailOrUsername, password, isLoading, error, showPassword, handleLogin }
}

describe('Login page logic', () => {
  it('shows error when email field is empty', async () => {
    const { handleLogin, error } = makeLoginForm(vi.fn())
    await handleLogin()
    expect(error.value).toBe('Please fill in all fields')
  })

  it('shows error when password field is empty', async () => {
    const { emailOrUsername, handleLogin, error } = makeLoginForm(vi.fn())
    emailOrUsername.value = 'prasad@example.com'
    await handleLogin()
    expect(error.value).toBe('Please fill in all fields')
  })

  it('shows human-readable error on wrong credentials', async () => {
    const apiLogin = vi.fn().mockRejectedValue({ data: { message: 'Validation failed' } })
    const { emailOrUsername, password, handleLogin, error } = makeLoginForm(apiLogin)
    emailOrUsername.value = 'prasad@example.com'
    password.value = 'wrongpassword'
    await handleLogin()
    expect(error.value).toBe('Invalid email or password. Please try again.')
  })

  it('does not show backend raw message on failure', async () => {
    const apiLogin = vi.fn().mockRejectedValue({ data: { message: 'Validation failed' } })
    const { emailOrUsername, password, handleLogin, error } = makeLoginForm(apiLogin)
    emailOrUsername.value = 'user'
    password.value = 'pass'
    await handleLogin()
    expect(error.value).not.toContain('Validation failed')
  })

  it('clears error before each login attempt', async () => {
    const apiLogin = vi.fn().mockRejectedValue({})
    const { emailOrUsername, password, handleLogin, error } = makeLoginForm(apiLogin)
    emailOrUsername.value = 'user'
    password.value = 'pass'
    await handleLogin()
    expect(error.value).toBe('Invalid email or password. Please try again.')

    apiLogin.mockResolvedValueOnce({ success: true, data: {} })
    await handleLogin()
    expect(error.value).toBe('')
  })

  it('show/hide password toggle starts hidden', () => {
    const { showPassword } = makeLoginForm(vi.fn())
    expect(showPassword.value).toBe(false)
  })

  it('show/hide password toggle toggles correctly', () => {
    const { showPassword } = makeLoginForm(vi.fn())
    showPassword.value = !showPassword.value
    expect(showPassword.value).toBe(true)
    showPassword.value = !showPassword.value
    expect(showPassword.value).toBe(false)
  })

  it('sets isLoading true during API call and false after', async () => {
    let resolveLogin!: (v: any) => void
    const apiLogin = vi.fn(() => new Promise(r => { resolveLogin = r }))
    const { emailOrUsername, password, isLoading, handleLogin } = makeLoginForm(apiLogin)
    emailOrUsername.value = 'user'
    password.value = 'pass'

    const loginPromise = handleLogin()
    expect(isLoading.value).toBe(true)
    resolveLogin({ success: true, data: {} })
    await loginPromise
    expect(isLoading.value).toBe(false)
  })
})