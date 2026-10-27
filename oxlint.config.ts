import { defineConfig } from "oxlint"
import { agentToolIgnorePatterns, effectRules, recommended } from "./src/config.ts"

export default defineConfig({
  extends: [recommended],
  plugins: ["unicorn", "typescript", "oxc"],
  ignorePatterns: [...agentToolIgnorePatterns, "dist/**", "vendor/**"],
  rules: {
    ...effectRules(),
    "solzero/no-colocated-tests": "error",
  },
})
