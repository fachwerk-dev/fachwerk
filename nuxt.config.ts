// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/strapi",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    ["unplugin-icons/nuxt", { autoInstall: true }],
    [
      "@nuxtjs/google-fonts",
      {
        download: false,
        families: {
          "IBM Plex Sans": {
            wght: [400, 600, 700],
            ital: [400, 600, 700],
          },
        },
      },
    ],
  ],
});
