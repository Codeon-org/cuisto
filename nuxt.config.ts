// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "@nuxt/eslint",
        "@nuxtjs/device",
        "@vueuse/nuxt",
        "@pinia/nuxt",
        "@nuxt/test-utils/module",
        "pinia-plugin-persistedstate/nuxt",
        "@prisma/nuxt",
        "@nuxt/ui"
    ],
    ssr: false,
    devtools: {
        enabled: true,
    },
    css: [
        "~/assets/css/main.css"
    ],
    router: {
        options: {
            scrollBehaviorType: "smooth"
        }
    },
    future: {
        compatibilityVersion: 4
    },
    compatibilityDate: "2025-02-09",
    eslint: {
        config: {
            stylistic: {
                indent: 4,
                semi: true,
                quotes: "double",
                commaDangle: "only-multiline",
                braceStyle: "allman",
                quoteProps: "as-needed",
            }
        },
    },
    pinia: {
        storesDirs: ["./stores/**"],
    },
    piniaPluginPersistedstate: {
        storage: "localStorage",
        key: "cuisto_%id"
    },
});
