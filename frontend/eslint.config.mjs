import js from "@eslint/js";
import tanstackQuery from "@tanstack/eslint-plugin-query";
// <--- The new standard way
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // 1. Global Ignores
  {
    ignores: [
      "dist",
      "node_modules",
      "vite.config.ts",
      "vitest.config.ts",
      "vitest.shims.d.ts",
      "tailwind.config.js",
      "src/shared/components/ui/**",
      "tests/**",
      "coverage/**",
    ],
  },

  // 2. Base Recommended Configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Your Specialist Workspace Config
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@tanstack/query": tanstackQuery,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // React & Hooks
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "off",

      // TanStack Query
      ...tanstackQuery.configs.recommended.rules,

      // Fast Refresh
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // Logic & TS Rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-definitions": "off",

      // Native Cleanliness
      "prefer-const": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // 4. Prettier (Must be the very last element in the array)
  prettier,
]);
