export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  authStore.loadFromStorage()

  if (!authStore.isLoggedIn) {
    return navigateTo('/login')
  }
})
