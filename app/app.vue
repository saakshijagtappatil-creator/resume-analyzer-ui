<script setup>
const authStore = useAuthStore()

onMounted(() => {
  authStore.loadFromStorage()
})
</script>

<template>
  <div>
    <AppNavbar />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f8fafc;
  color: #0f172a;
}

main {
  min-height: calc(100vh - 64px);
}
</style>
