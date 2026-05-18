<script setup>
definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const api = useApi()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref('')

onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  }
})

const handleRegister = async () => {
  error.value = ''

  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  isLoading.value = true

  try {
    const response = await api.register(username.value, email.value, password.value)
    if (response.success) {
      authStore.setAuth(response.data)
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = err?.data?.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div style="min-height: 100vh; background: #f8fafc; display: flex; flex-direction: column;">

    <!-- Navbar -->
    <AppNavbar />

    <!-- Register Form -->
    <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem;">
      <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 440px;">

        <!-- Header -->
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="width: 48px; height: 48px; background: #1d4ed8; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <span style="color: white; font-size: 22px; font-weight: 700;">R</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">Create account</h1>
          <p style="color: #64748b; font-size: 14px;">Start analyzing your resume today</p>
        </div>

        <!-- Error -->
        <div v-if="error" style="background: #fee2e2; border: 1px solid #fecaca; color: #b91c1c; padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 1.5rem;">
          {{ error }}
        </div>

        <!-- Form -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">

          <div>
            <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">
              Username
            </label>
            <input
              v-model="username"
              type="text"
              placeholder="Choose a username"
              style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #0f172a; outline: none;"
            />
          </div>

          <div>
            <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #0f172a; outline: none;"
            />
          </div>

          <div>
            <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="Create a password"
              style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #0f172a; outline: none;"
            />
          </div>

          <div>
            <label style="display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px;">
              Confirm Password
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              @keyup.enter="handleRegister"
              style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #0f172a; outline: none;"
            />
          </div>

          <button
            @click="handleRegister"
            :disabled="isLoading"
            style="width: 100%; background: #1d4ed8; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 0.5rem;"
          >
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </button>

        </div>

        <!-- Footer -->
        <p style="text-align: center; margin-top: 1.5rem; font-size: 14px; color: #64748b;">
          Already have an account?
          <NuxtLink to="/login" style="color: #1d4ed8; text-decoration: none; font-weight: 500;">
            Sign in
          </NuxtLink>
        </p>

      </div>
    </div>

  </div>
</template>
