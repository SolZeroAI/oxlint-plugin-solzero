import { defineConfig } from "oxlint"
import { effectRules, recommended } from "./src/config.ts"

export default defineConfig({
  extends: [recommended],
  plugins: ["unicorn", "typescript", "oxc"],
  ignorePatterns: ["dist/**", "vendor/**"],
  rules: {
    ...effectRules(),
    "solzero/no-colocated-tests": "error",
  },
})
