export const effectRuleNames = [
  "no-if-statement",
  "no-ternary",
  "no-pipe-ladder",
  "no-flatmap-ladder",
  "no-effect-call-in-effect-arg",
  "no-nested-effect-call",
  "no-effect-as",
  "no-option-as",
  "no-arrow-ladder",
  "no-branch-in-object",
  "no-iife-wrapper",
  "no-return-in-arrow",
  "no-effect-never",
  "no-effect-async",
  "no-effect-do",
  "no-effect-bind",
  "no-nested-effect-gen",
  "no-match-void-branch",
  "no-match-effect-branch",
  "warn-effect-sync-wrapper",
  "no-effect-side-effect-wrapper",
  "no-effect-orElse-ladder",
  "no-manual-effect-channels",
  "prevent-dynamic-imports",
  "prefer-option-over-null",
  "avoid-untagged-errors",
] as const

export const ruleNames = [...effectRuleNames, "use-effect-otel", "no-colocated-tests"] as const

export type RuleName = (typeof ruleNames)[number]
