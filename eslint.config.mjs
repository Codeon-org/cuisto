// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
    ignores: [".devcontainer/", ".docker/", ".github/", ".nuxt/", ".output/", ".vscode/", "node_modules/", "old/"],
    rules: {
        "vue/multi-word-component-names": "off",
        "no-async-promise-executor": "off",
    }
});
