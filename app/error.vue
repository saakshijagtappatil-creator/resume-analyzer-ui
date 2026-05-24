<script setup>
const props = defineProps({ error: Object })

const handleHome = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div style="min-height: 100vh; background: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 2rem; font-family: 'Inter', -apple-system, sans-serif;">
    <div style="text-align: center; max-width: 480px;">

      <div style="font-size: 64px; margin-bottom: 1.5rem;">
        {{ error?.statusCode === 404 ? '🔍' : '⚠️' }}
      </div>

      <h1 style="font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
        {{ error?.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
      </h1>

      <p style="font-size: 15px; color: #64748b; margin-bottom: 2rem; line-height: 1.6;">
        {{ error?.statusCode === 404
          ? "The page you're looking for doesn't exist or has been moved."
          : 'An unexpected error occurred. Please try again.' }}
      </p>

      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button
          @click="handleHome"
          style="background: #1d4ed8; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;"
        >
          Go Home
        </button>
        <button
          @click="$router.back()"
          style="background: white; color: #475569; border: 1px solid #e2e8f0; padding: 12px 28px; border-radius: 8px; font-size: 15px; cursor: pointer;"
        >
          Go Back
        </button>
      </div>

      <p v-if="error?.statusCode" style="margin-top: 2rem; font-size: 12px; color: #94a3b8;">
        Error {{ error.statusCode }}
      </p>

    </div>
  </div>
</template>
