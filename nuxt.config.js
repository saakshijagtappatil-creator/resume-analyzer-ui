export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
      appEnv: process.env.NUXT_PUBLIC_APP_ENV || 'development',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Resume Analyzer'
    }
  },

  colorMode: {
    preference: 'light'
  },

  app: {
    head: {
      title: 'Resume Analyzer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AI-powered Resume Analyzer and Job Match API' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
