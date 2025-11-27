// vitest.config.ts
// aider par l'enseignant Etienne Rivard
import { defineConfig } from "vitest/config";
import path from "path";


export default defineConfig({
  test: {
    setupFiles: ["./tests/setup-env.ts"],
    globals: true,
  },
    resolve: {
    alias: {
        "@src": path.resolve(__dirname, "src"),
    },
  },
});
