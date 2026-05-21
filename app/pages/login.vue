<script setup>
definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const api = useApi()
const router = useRouter()

const emailOrUsername = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')
const showPassword = ref(false)

onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  }
})

const handleLogin = async () => {
  error.value = ''

  if (!emailOrUsername.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  isLoading.value = true

  try {
    const response = await api.login(emailOrUsername.value, password.value)
    if (response.success) {
      authStore.setAuth(response.data)
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = 'Invalid email or password. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div style="min-height: calc(100vh - 64px); background: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 2rem;">
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 440px;">

      <!-- Header -->
      <div style="text-align: center; margin-bottom: 2rem;">
        <div style="width: 48px; height: 48px; background: #1d4ed8; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
          <span style="color: white; font-size: 22px; font-weight: 700;">R</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">Welcome back</h1>
        <p style="color: #64748b; font-size: 14px;">Sign in to your account</p>
      </div>

      <!-- Error -->
      <div v-if="error" style="background: #fee2e2; border: 1px solid #fecaca; color: #b91c1c; padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 1.5rem;">
        {{ error }}
      </div>

      <!-- Form -->
      <div style="display: flex; flex-direction: column; gap: 1rem;">

        <div>
          <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">
            Email or Username
          </label>
          <input
            v-model="emailOrUsername"
            type="text"
            placeholder="Enter your email or username"
            @keyup.enter="handleLogin"
            style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #0f172a; outline: none;"
          />
        </div>

        <div>
          <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">
            Password
          </label>
          <div style="position: relative;">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              @keyup.enter="handleLogin"
              style="width: 100%; padding: 10px 44px 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #0f172a; outline: none;"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0; display: flex; align-items: center;"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <button
          @click="handleLogin"
          :disabled="isLoading"
          style="width: 100%; background: #1d4ed8; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 0.5rem;"
        >
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>

      </div>

      <!-- Footer -->
      <p style="text-align: center; margin-top: 1.5rem; font-size: 14px; color: #64748b;">
        Don't have an account?
        <NuxtLink to="/register" style="color: #1d4ed8; text-decoration: none; font-weight: 500;">
          Sign up
        </NuxtLink>
      </p>

    </div>
  </div>
</template>