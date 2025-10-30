// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/node_modules/**", "eslint.config.mjs", "**/dist/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Typescript-specific rules
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "warn",

      "no-return-await": "off",
      "@typescript-eslint/return-await": "error",
      "@typescript-eslint/no-misused-promises": "off",
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        // projectService: {
        //   allowDefaultProject: ['*.js', '*.mjs'],
        //   defaultProject: './tsconfig.json',
        // },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
);
