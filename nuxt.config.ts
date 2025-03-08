// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "@nuxt/eslint",
        "@nuxtjs/device",
        "@vueuse/nuxt",
        "@pinia/nuxt",
        "@nuxt/test-utils/module",
        "pinia-plugin-persistedstate/nuxt",
        "@nuxt/ui",
        "~/modules/build-copy"
    ],
    ssr: false,
    devtools: {
        enabled: true,
    },
    // css: [
    //     "~/assets/css/main.css"
    // ],
    router: {
        options: {
            scrollBehaviorType: "smooth"
        }
    },
    future: {
        compatibilityVersion: 4
    },
    compatibilityDate: "2025-02-09",
    nitro: {
        imports: {
            dirs: [
                "./server/config/**",
                "./server/types/**",
            ]
        },
        storage: {
            fs: {
                driver: "fs-lite",
                base: ".cache"
            },
            email: {
                driver: "fs-lite",
                base: "email"
            }
        }
    },
    debug: process.env.NODE_ENV === "development",
    copyFiles: {
        sources: ["./email"],
        root: "dir"
    },
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
