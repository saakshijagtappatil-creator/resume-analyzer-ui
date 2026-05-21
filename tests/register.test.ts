import { describe, it, expect, vi } from 'vitest'
import { ref, computed } from 'vue'

// Mirror register page logic
function makeRegisterForm(apiRegister: (...args: any[]) => Promise<any>) {
  const username = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const isLoading = ref(false)
  const error = ref('')
  const signInPrompt = ref(false)
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)

  const passwordRules = computed(() => [
    { label: 'Minimum 8 characters',         met: password.value.length >= 8 },
    { label: 'At least 1 uppercase letter',  met: /[A-Z]/.test(password.value) },
    { label: 'At least 1 number (0-9)',       met: /[0-9]/.test(password.value) },
    { label: 'At least 1 special character', met: /[^a-zA-Z0-9]/.test(password.value) }
  ])

  const passwordsMatch = computed(() =>
    confirmPassword.value.length > 0 && password.value === confirmPassword.value
  )

  const allRulesPass = computed(() =>
    passwordRules.value.every(r => r.met) && passwordsMatch.value
  )

  const handleRegister = async () => {
    error.value = ''
    signInPrompt.value = false

    if (!username.value || !email.value || !password.value || !confirmPassword.value) {
      error.value = 'Please fill in all fields'
      return
    }
    if (!allRulesPass.value) return

    isLoading.value = true
    try {
      const response = await apiRegister(username.value, email.value, password.value)
      if (response.success) return { success: true }
    } catch (err: any) {
      const msg = err?.data?.message || ''
      if (msg.toLowerCase().includes('email already')) {
        error.value = 'An account with this email already exists. Please sign in instead.'
        signInPrompt.value = true
      } else if (msg.toLowerCase().includes('username') && msg.toLowerCase().includes('already')) {
        error.value = 'This username is already taken. Please choose a different one.'
      } else {
        error.value = msg || 'Registration failed. Please try again.'
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    username, email, password, confirmPassword,
    isLoading, error, signInPrompt,
    showPassword, showConfirmPassword,
    passwordRules, passwordsMatch, allRulesPass,
    handleRegister
  }
}

const validPassword = 'StrongP@ss1'

describe('Register page logic', () => {
  it('shows error when fields are empty', async () => {
    const { handleRegister, error } = makeRegisterForm(vi.fn())
    await handleRegister()
    expect(error.value).toBe('Please fill in all fields')
  })

  it('does not submit when password rules fail', async () => {
    const apiRegister = vi.fn()
    const form = makeRegisterForm(apiRegister)
    form.username.value = 'user'
    form.email.value = 'user@example.com'
    form.password.value = 'weak'
    form.confirmPassword.value = 'weak'
    await form.handleRegister()
    expect(apiRegister).not.toHaveBeenCalled()
  })

  it('does not submit when passwords do not match', async () => {
    const apiRegister = vi.fn()
    const form = makeRegisterForm(apiRegister)
    form.username.value = 'user'
    form.email.value = 'user@example.com'
    form.password.value = validPassword
    form.confirmPassword.value = 'Different1!'
    await form.handleRegister()
    expect(apiRegister).not.toHaveBeenCalled()
  })

  it('submits when all rules pass', async () => {
    const apiRegister = vi.fn().mockResolvedValue({ success: true })
    const form = makeRegisterForm(apiRegister)
    form.username.value = 'user'
    form.email.value = 'user@example.com'
    form.password.value = validPassword
    form.confirmPassword.value = validPassword
    await form.handleRegister()
    expect(apiRegister).toHaveBeenCalledWith('user', 'user@example.com', validPassword)
  })

  it('shows duplicate email error and signInPrompt', async () => {
    const apiRegister = vi.fn().mockRejectedValue({
      data: { message: 'Email already registered' }
    })
    const form = makeRegisterForm(apiRegister)
    form.username.value = 'user'
    form.email.value = 'taken@example.com'
    form.password.value = validPassword
    form.confirmPassword.value = validPassword
    await form.handleRegister()
    expect(form.error.value).toBe('An account with this email already exists. Please sign in instead.')
    expect(form.signInPrompt.value).toBe(true)
  })

  it('shows duplicate username error without signInPrompt', async () => {
    const apiRegister = vi.fn().mockRejectedValue({
      data: { message: 'Username already taken' }
    })
    const form = makeRegisterForm(apiRegister)
    form.username.value = 'takenuser'
    form.email.value = 'new@example.com'
    form.password.value = validPassword
    form.confirmPassword.value = validPassword
    await form.handleRegister()
    expect(form.error.value).toBe('This username is already taken. Please choose a different one.')
    expect(form.signInPrompt.value).toBe(false)
  })

  it('allRulesPass is false when password is weak', () => {
    const form = makeRegisterForm(vi.fn())
    form.password.value = 'weak'
    form.confirmPassword.value = 'weak'
    expect(form.allRulesPass.value).toBe(false)
  })

  it('allRulesPass is true for strong matching password', () => {
    const form = makeRegisterForm(vi.fn())
    form.password.value = validPassword
    form.confirmPassword.value = validPassword
    expect(form.allRulesPass.value).toBe(true)
  })

  it('showPassword and showConfirmPassword toggles start false', () => {
    const form = makeRegisterForm(vi.fn())
    expect(form.showPassword.value).toBe(false)
    expect(form.showConfirmPassword.value).toBe(false)
  })

  it('clears signInPrompt on new submission attempt', async () => {
    const apiRegister = vi.fn()
      .mockRejectedValueOnce({ data: { message: 'Email already registered' } })
      .mockRejectedValueOnce({ data: { message: 'Registration failed. Please try again.' } })
    const form = makeRegisterForm(apiRegister)
    form.username.value = 'user'
    form.email.value = 'taken@example.com'
    form.password.value = validPassword
    form.confirmPassword.value = validPassword

    await form.handleRegister()
    expect(form.signInPrompt.value).toBe(true)

    await form.handleRegister()
    expect(form.signInPrompt.value).toBe(false)
  })
})