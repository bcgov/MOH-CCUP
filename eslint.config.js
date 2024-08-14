import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginCypress from "eslint-plugin-cypress/flat";

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  pluginCypress.configs.globals, //eslint formatting for Cypress syntax
  {
    files: ["**/*.{js,ts,jsx,tsx,mjs,cjs,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
  {
    ignores: ["**/coverage/*", "**/dist/*", "**/.husky/"],
  },
];
