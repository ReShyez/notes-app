// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],

  css: ['~/assets/styles/main.css'],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  devtools: {
    enabled: true,
  },
  compatibilityDate: '2025-07-15',
})