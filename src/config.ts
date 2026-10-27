import type { AllowWarnDeny, OxlintConfig } from "oxlint"
import antiSlopEffect from "./anti-slop-effect.ts"
import antiSlop from "./anti-slop.ts"
import { effectRuleNames } from "./rule-names.ts"

type RuleSeverities = Record<string, AllowWarnDeny>

const packageName = "oxlint-plugin-solzero"

function withSeverity(
  pluginName: string,
  ruleNames: Iterable<string>,
  severity: AllowWarnDeny,
): RuleSeverities {
  return Object.fromEntries(Array.from(ruleNames, (rule) => [`${pluginName}/${rule}`, severity]))
}

/**
 * Shared base for every SolZero repository: loads the solzero, anti-slop, and anti-slop-effect
 * plugins and enables every anti-slop rule as an error. A vendored anti-slop update that adds a
 * rule enables it here too.
 */
export const recommended: OxlintConfig = {
  jsPlugins: [
    { name: "solzero", specifier: packageName },
    { name: "anti-slop", specifier: `${packageName}/anti-slop` },
    { name: "anti-slop-effect", specifier: `${packageName}/anti-slop-effect` },
  ],
  ignorePatterns: [
    ".agent/**",
    ".agents/**",
    ".claude/**",
    ".codex/**",
    ".continue/**",
    ".cursor/**",
    ".gemini/**",
    ".opencode/**",
    ".pi/**",
    ".roo/**",
    ".windsurf/**",
  ],
  rules: {
    "oxc/no-accumulating-spread": "error",
    ...withSeverity("anti-slop", Object.keys(antiSlop.rules), "error"),
    ...withSeverity("anti-slop-effect", Object.keys(antiSlopEffect.rules), "error"),
  },
}

/**
 * The solzero Effect composition rules at one severity. Scope them with an override on the
 * directories that hold Effect services, and pass "off" for files that bridge to non-Effect code.
 */
export function effectRules(severity: AllowWarnDeny = "error"): RuleSeverities {
  return withSeverity("solzero", effectRuleNames, severity)
}

/** `solzero/use-effect-otel`. Scope it to API, Worker, and server request surfaces. */
export function observabilityRules(severity: AllowWarnDeny = "error") {
  return { "solzero/use-effect-otel": severity }
}
