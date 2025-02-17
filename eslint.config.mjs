// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
    ignores: [".devcontainer/", ".docker/", ".github/", ".nuxt/", ".output/", ".vscode/", "node_modules/"],
    rules: {
        "vue/multi-word-component-names": "off",
        "no-async-promise-executor": "off",
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/no-explicit-any": "warn"
    }
});
