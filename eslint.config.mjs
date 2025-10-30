// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/node_modules/**", "**/dist/**", "eslint.config.mjs"],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },

    rules: {
      // --- TypeScript specific ---
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/switch-exhaustiveness-check": "warn",

      // --- Promises & async ---
      "no-return-await": "off",
      "@typescript-eslint/return-await": "error",

      // --- General JavaScript ---
      "no-console": "off",
    },
  }
);
