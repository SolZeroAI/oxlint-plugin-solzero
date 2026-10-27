import { eslintCompatPlugin } from "@oxlint/plugins"
import { rules } from "./rules.ts"

export { effectRuleNames, ruleNames } from "./rule-names.ts"

export type { RuleName } from "./rule-names.ts"

export default eslintCompatPlugin({
  meta: { name: "solzero" },
  rules,
})
