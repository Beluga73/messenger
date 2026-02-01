import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",

      clearMocks: true,
      restoreMocks: true,
      mockReset: true,

      pool: "threads",
      isolate: true,

      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
          "node_modules/",
          "tests/",
          "src/shared/components/ui/", // shadcn components
          "**/*.d.ts",
          "**/index.ts", // re-exports
        ],
        thresholds: {
          lines: 70,
          functions: 70,
          branches: 65,
          statements: 70,
        },
      },
    },
  })
);
