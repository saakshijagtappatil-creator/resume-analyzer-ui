<script setup>
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isLandingPage = computed(() => route.path === '/')
const showAuthNav = computed(() => authStore.isLoggedIn && !isLandingPage.value)
const isMenuOpen = ref(false)

watch(() => route.path, () => { isMenuOpen.value = false })

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const displayName = computed(() => {
  const u = authStore.user?.username
  return u ? u.charAt(0).toUpperCase() + u.slice(1) : ''
})
</script>

<template>
  <nav style="background: #0f172a; padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 100;">

    <!-- Logo -->
    <NuxtLink to="/" style="text-decoration: none; display: flex; align-items: center; gap: 10px;">
      <div style="width: 32px; height: 32px; background: #1d4ed8; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        <span style="color: white; font-size: 16px; font-weight: 700;">R</span>
      </div>
      <span style="color: white; font-size: 16px; font-weight: 600;">Resume Analyzer</span>
    </NuxtLink>

    <!-- Desktop nav links -->
    <div v-if="showAuthNav" class="desktop-nav" style="display: flex; align-items: center; gap: 2rem;">
      <NuxtLink to="/dashboard" style="color: #94a3b8; text-decoration: none; font-size: 14px;" active-class="active-nav">Dashboard</NuxtLink>
      <NuxtLink to="/upload" style="color: #94a3b8; text-decoration: none; font-size: 14px;" active-class="active-nav">Upload Resume</NuxtLink>
      <NuxtLink to="/history" style="color: #94a3b8; text-decoration: none; font-size: 14px;" active-class="active-nav">History</NuxtLink>
    </div>

    <!-- Desktop right side -->
    <div class="desktop-right" style="display: flex; align-items: center; gap: 1rem;">
      <div v-if="showAuthNav" style="display: flex; align-items: center; gap: 1rem;">
        <span style="color: #94a3b8; font-size: 13px;">{{ displayName }}</span>
        <button @click="handleLogout" style="background: transparent; border: 1px solid #334155; color: #94a3b8; padding: 6px 16px; border-radius: 6px; font-size: 13px; cursor: pointer;">
          Logout
        </button>
      </div>
      <div v-else style="display: flex; gap: 0.75rem;">
        <NuxtLink to="/login" style="color: #94a3b8; text-decoration: none; font-size: 14px; padding: 6px 16px;">Login</NuxtLink>
        <NuxtLink to="/register" style="background: #1d4ed8; color: white; text-decoration: none; font-size: 14px; padding: 6px 16px; border-radius: 6px;">Get Started</NuxtLink>
      </div>
    </div>

    <!-- Hamburger button (mobile only) -->
    <button
      class="hamburger"
      @click="isMenuOpen = !isMenuOpen"
      style="background: none; border: none; cursor: pointer; color: white; padding: 4px; display: none; flex-direction: column; gap: 5px;"
      aria-label="Toggle menu"
    >
      <span v-if="!isMenuOpen" style="font-size: 22px; line-height: 1;">☰</span>
      <span v-else style="font-size: 22px; line-height: 1;">✕</span>
    </button>

  </nav>

  <!-- Mobile dropdown menu -->
  <div v-if="isMenuOpen" class="mobile-menu" style="display: none; background: #1e293b; border-bottom: 1px solid #334155; padding: 1rem 1.5rem; flex-direction: column; gap: 0.25rem;">
    <template v-if="showAuthNav">
      <NuxtLink to="/dashboard" @click="isMenuOpen = false" style="color: #94a3b8; text-decoration: none; font-size: 15px; padding: 10px 0; border-bottom: 1px solid #334155; display: block;" active-class="active-nav">Dashboard</NuxtLink>
      <NuxtLink to="/upload" @click="isMenuOpen = false" style="color: #94a3b8; text-decoration: none; font-size: 15px; padding: 10px 0; border-bottom: 1px solid #334155; display: block;" active-class="active-nav">Upload Resume</NuxtLink>
      <NuxtLink to="/history" @click="isMenuOpen = false" style="color: #94a3b8; text-decoration: none; font-size: 15px; padding: 10px 0; border-bottom: 1px solid #334155; display: block;" active-class="active-nav">History</NuxtLink>
      <div style="padding: 10px 0; display: flex; align-items: center; justify-content: space-between;">
        <span style="color: #64748b; font-size: 13px;">{{ displayName }}</span>
        <button @click="handleLogout" style="background: transparent; border: 1px solid #334155; color: #94a3b8; padding: 6px 16px; border-radius: 6px; font-size: 13px; cursor: pointer;">Logout</button>
      </div>
    </template>
    <template v-else>
      <NuxtLink to="/login" @click="isMenuOpen = false" style="color: #94a3b8; text-decoration: none; font-size: 15px; padding: 10px 0; border-bottom: 1px solid #334155; display: block;">Login</NuxtLink>
      <NuxtLink to="/register" @click="isMenuOpen = false" style="color: white; text-decoration: none; font-size: 15px; padding: 10px 0; display: block; font-weight: 600;">Get Started</NuxtLink>
    </template>
  </div>
</template>

<style scoped>
.active-nav { color: white !important; }
a:hover { color: white !important; }
button:hover { border-color: #64748b !important; color: white !important; }

@media (max-width: 768px) {
  .desktop-nav { display: none !important; }
  .desktop-right { display: none !important; }
  .hamburger { display: flex !important; }
  .mobile-menu { display: flex !important; }
}
</style>
