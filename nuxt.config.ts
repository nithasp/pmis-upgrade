// https://nuxt.com/docs/api/configuration/nuxt-config
import deployment from "./deployment.config.js";

export default defineNuxtConfig({
   ssr: false,

   app: {
      head: {
         htmlAttrs: {
            lang: "en",
         },
         title: "PMIS Upgrade",
      },
   },

   devtools: { enabled: true },
   components: false,
   css: ["~/assets/css/main.scss"],

   modules: [
      "@nuxt/ui",
      "@pinia/nuxt",
      '@nuxtjs/svg-sprite',
      [
         "@nuxtjs/i18n",
         {
            vueI18n: "./i18n.config.ts",
            locales: [
               { code: "en", iso: "en-US", name: "English" },
               { code: "th", iso: "th-TH", name: "ไทย" },
            ],
            defaultLocale: "th",
            strategy: "no_prefix",
         },
      ],
      'nuxt-icons',
   ],

   runtimeConfig: {
      public: {
         apiBaseUrl: deployment.baseURL,
         version: deployment.version
      },
   },

   devServer: {
      host: "0.0.0.0",
   },

   tailwindcss: {
      viewer: false,
   },
   colorMode: {
      preference: "light",
   },

   compatibilityDate: "2024-08-13",
   plugins: [
      '~/plugins/axios.js',
      '~/plugins/autoNumeric.ts',
   ],
   
});