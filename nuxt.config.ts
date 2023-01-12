export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'On The Road',
      meta: [
        // <meta name="description" content="My amazing site">
        { name: 'description', content: 'On The Road on the scroll' }
      ],
    }
  }, 

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

})
