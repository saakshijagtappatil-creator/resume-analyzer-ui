<script setup>
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav style="background: #0f172a; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between;">

    <!-- Logo -->
    <NuxtLink to="/" style="text-decoration: none; display: flex; align-items: center; gap: 10px;">
      <div style="width: 32px; height: 32px; background: #1d4ed8; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        <span style="color: white; font-size: 16px; font-weight: 700;">R</span>
      </div>
      <span style="color: white; font-size: 16px; font-weight: 600;">Resume Analyzer</span>
    </NuxtLink>

    <!-- Nav links — only show when logged in -->
    <div v-if="authStore.isLoggedIn" style="display: flex; align-items: center; gap: 2rem;">
      <NuxtLink
        to="/dashboard"
        style="color: #94a3b8; text-decoration: none; font-size: 14px;"
        active-class="active-nav"
      >
        Dashboard
      </NuxtLink>
      <NuxtLink
        to="/upload"
        style="color: #94a3b8; text-decoration: none; font-size: 14px;"
        active-class="active-nav"
      >
        Upload Resume
      </NuxtLink>
      <NuxtLink
        to="/history"
        style="color: #94a3b8; text-decoration: none; font-size: 14px;"
        active-class="active-nav"
      >
        History
      </NuxtLink>
    </div>

    <!-- Right side -->
    <div style="display: flex; align-items: center; gap: 1rem;">

      <!-- Logged in -->
      <div v-if="authStore.isLoggedIn" style="display: flex; align-items: center; gap: 1rem;">
        <span style="color: #94a3b8; font-size: 13px;">
          {{ authStore.user?.username }}
        </span>
        <button
          @click="handleLogout"
          style="background: transparent; border: 1px solid #334155; color: #94a3b8; padding: 6px 16px; border-radius: 6px; font-size: 13px; cursor: pointer;"
        >
          Logout
        </button>
      </div>

      <!-- Not logged in -->
      <div v-else style="display: flex; gap: 0.75rem;">
        <NuxtLink
          to="/login"
          style="color: #94a3b8; text-decoration: none; font-size: 14px; padding: 6px 16px;"
        >
          Login
        </NuxtLink>
        <NuxtLink
          to="/register"
          style="background: #1d4ed8; color: white; text-decoration: none; font-size: 14px; padding: 6px 16px; border-radius: 6px;"
        >
          Get Started
        </NuxtLink>
      </div>
    </div>

  </nav>
</template>

<style scoped>
.active-nav {
  color: white !important;
}
a:hover {
  color: white !important;
}
button:hover {
  border-color: #64748b !important;
  color: white !important;
}
</style>
