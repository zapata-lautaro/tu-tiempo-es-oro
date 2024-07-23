import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {
    ignores: ["dist/", "node_modules/", "webpack.*.cjs"]
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    languageOptions: { 
      globals: {
        ...globals.browser, 
        ...globals.node
      } 
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];