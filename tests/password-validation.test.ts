import { describe, it, expect } from 'vitest'
import { ref, computed } from 'vue'

// Mirror the exact logic from register.vue
function makePasswordRules(password: ReturnType<typeof ref<string>>) {
  return computed(() => [
    { label: 'Minimum 8 characters',          met: password.value.length >= 8 },
    { label: 'At least 1 uppercase letter',   met: /[A-Z]/.test(password.value) },
    { label: 'At least 1 number (0-9)',        met: /[0-9]/.test(password.value) },
    { label: 'At least 1 special character',  met: /[^a-zA-Z0-9]/.test(password.value) }
  ])
}

function makePasswordsMatch(
  password: ReturnType<typeof ref<string>>,
  confirm: ReturnType<typeof ref<string>>
) {
  return computed(() => confirm.value.length > 0 && password.value === confirm.value)
}

describe('Password validation rules', () => {
  it('fails minimum 8 characters for short password', () => {
    const pw = ref('Ab1!')
    const rules = makePasswordRules(pw)
    expect(rules.value[0].met).toBe(false)
  })

  it('passes minimum 8 characters', () => {
    const pw = ref('Abcdef1!')
    const rules = makePasswordRules(pw)
    expect(rules.value[0].met).toBe(true)
  })

  it('fails uppercase rule when all lowercase', () => {
    const pw = ref('abcdef1!')
    const rules = makePasswordRules(pw)
    expect(rules.value[1].met).toBe(false)
  })

  it('passes uppercase rule', () => {
    const pw = ref('Abcdef1!')
    const rules = makePasswordRules(pw)
    expect(rules.value[1].met).toBe(true)
  })

  it('fails number rule when no digits', () => {
    const pw = ref('Abcdefg!')
    const rules = makePasswordRules(pw)
    expect(rules.value[2].met).toBe(false)
  })

  it('passes number rule', () => {
    const pw = ref('Abcdef1!')
    const rules = makePasswordRules(pw)
    expect(rules.value[2].met).toBe(true)
  })

  it('fails special character rule when none present', () => {
    const pw = ref('Abcdef12')
    const rules = makePasswordRules(pw)
    expect(rules.value[3].met).toBe(false)
  })

  it('passes special character rule', () => {
    const pw = ref('Abcdef1!')
    const rules = makePasswordRules(pw)
    expect(rules.value[3].met).toBe(true)
  })

  it('all rules pass for a strong password', () => {
    const pw = ref('StrongP@ss1')
    const rules = makePasswordRules(pw)
    expect(rules.value.every(r => r.met)).toBe(true)
  })

  it('passwordsMatch is false when confirm is empty', () => {
    const pw = ref('StrongP@ss1')
    const confirm = ref('')
    expect(makePasswordsMatch(pw, confirm).value).toBe(false)
  })

  it('passwordsMatch is false when passwords differ', () => {
    const pw = ref('StrongP@ss1')
    const confirm = ref('Different1!')
    expect(makePasswordsMatch(pw, confirm).value).toBe(false)
  })

  it('passwordsMatch is true when both match', () => {
    const pw = ref('StrongP@ss1')
    const confirm = ref('StrongP@ss1')
    expect(makePasswordsMatch(pw, confirm).value).toBe(true)
  })

  it('allRulesPass is false until all conditions met', () => {
    const pw = ref('weak')
    const confirm = ref('weak')
    const rules = makePasswordRules(pw)
    const match = makePasswordsMatch(pw, confirm)
    const allPass = computed(() => rules.value.every(r => r.met) && match.value)
    expect(allPass.value).toBe(false)
  })

  it('allRulesPass is true for valid matching passwords', () => {
    const pw = ref('StrongP@ss1')
    const confirm = ref('StrongP@ss1')
    const rules = makePasswordRules(pw)
    const match = makePasswordsMatch(pw, confirm)
    const allPass = computed(() => rules.value.every(r => r.met) && match.value)
    expect(allPass.value).toBe(true)
  })
})