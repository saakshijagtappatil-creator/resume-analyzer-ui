import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)
  const isLoggedIn = computed(() => !!token.value)

  function setAuth(authData) {
    token.value = authData.accessToken
    user.value = {
      id: authData.userId,
      username: authData.username,
      email: authData.email,
      role: authData.role
    }
    if (process.client) {
      localStorage.setItem('token', authData.accessToken)
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  function loadFromStorage() {
    if (process.client) {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      if (savedToken && savedUser) {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      }
    }
  }

  function logout() {
    token.value = null
    user.value = null
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    navigateTo('/login')
  }

  return {
    token,
    user,
    isLoggedIn,
    setAuth,
    loadFromStorage,
    logout
  }
})
