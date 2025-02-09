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
    ],
    ssr: true,
    devtools: {
        enabled: true,
    },
    router: {
        options: {
            scrollBehaviorType: "smooth"
        }
    },
    compatibilityDate: "2024-11-01",
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
