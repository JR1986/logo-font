// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  colorMode: {
    classSuffix: ''
  },
  app: {
    head: {
      title: 'logofont. — find the font that fits your mark',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Pair your logo mark with the perfect typeface. Shuffle through the Fontshare catalog, tune the wordmark, save matches and export a brand kit.'
        }
      ],
      link: [
        { rel: 'preconnect', href: 'https://api.fontshare.com' },
        { rel: 'preconnect', href: 'https://cdn.fontshare.com', crossorigin: '' },
        // UI chrome fonts: Satoshi (sans) + Sentient (serif accents)
        {
          rel: 'stylesheet',
          href: 'https://api.fontshare.com/v2/css?f[]=satoshi@1,2&f[]=sentient@1,2&display=swap'
        }
      ]
    }
  }
})
