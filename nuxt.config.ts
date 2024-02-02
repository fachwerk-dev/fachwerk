// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  strapi: {
    devtools: true,
  },
  hooks: {
    "vite:extendConfig": (config, { isClient }) => {
      if (isClient) {
        //@ts-ignore
        config.resolve.alias.vue = "vue/dist/vue.esm-bundler.js";
      }
    },
  },
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
          "IBM Plex Serif": {
            wght: [300, 400, 700],
            ital: [300, 400, 700],
          },
        },
      },
    ],
  ],
});
