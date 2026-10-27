import { defineRule } from "@oxlint/plugins"
import type { Context, Rule, VisitorWithHooks } from "@oxlint/plugins"
import { hasEffectSignal } from "./effect-signal.ts"
import { messages } from "./messages.ts"
import type { RuleName } from "./rule-names.ts"
import type { RuleReporter, RuleRuntime, VisitorMap } from "./types.ts"

export function defineEffectRule(
  name: RuleName,
  createVisitors: (runtime: RuleRuntime, context: Context) => VisitorMap,
  options: { requiresEffectFile?: boolean } = {},
): Rule {
  const requiresEffectFile = options.requiresEffectFile ?? true

  return defineRule({
    meta: {
      type: "suggestion",
      docs: {
        description: messages[name],
      },
      schema: [],
    },
    createOnce(context: Context) {
      let effectFile = false

      const report: RuleReporter = (node, message = messages[name]) => {
        context.report({ node, message })
      }

      const runtime: RuleRuntime = {
        report,
        shouldRun: () => !requiresEffectFile || effectFile,
      }

      const visitors: VisitorWithHooks = {
        before() {
          effectFile = false
        },
        Program(node) {
          effectFile = hasEffectSignal(node)
        },
      }

      Object.assign(visitors, createVisitors(runtime, context))

      return visitors
    },
  })
}
