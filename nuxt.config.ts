// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-02',
  devtools: { enabled: false },
  
  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/eslint'
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Artist Portal',
      meta: [
        { name: 'description', content: 'Your Agency in a Dashboard - Premium artist services platform' },
        { name: 'theme-color', content: '#0f0f23' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts'
  },

  runtimeConfig: {
    sessionSecret: process.env.SESSION_SECRET || 'artist-portal-demo-secret-key-2026',
    public: {
      appName: 'Artist Portal'
    }
  },

  nitro: {
    experimental: {
      asyncContext: true
    }
  },

  typescript: {
    strict: true
  }
})
