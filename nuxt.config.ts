import pkg from "./package.json";

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
        "./modules/build-copy"
    ],
    ssr: false,
    imports: {
        autoImport: true
    },
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
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
            wsUrl: process.env.NUXT_PUBLIC_WS_URL,
            appVersion: pkg.version,
        },
    },
    future: {
        compatibilityVersion: 4,
    },
    compatibilityDate: "2025-02-09",
    nitro: {
        experimental: {
            websocket: true
        },
        imports: {
            dirs: [
                "./server/config/**",
                "./server/types/**",
                "./server/voter/**",
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
    // debug: process.env.NODE_ENV === "development",
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
