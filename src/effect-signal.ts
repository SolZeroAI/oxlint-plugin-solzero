import type { ESTree } from "@oxlint/plugins"
import { containsNode, isNode, isStringValue, literalValue, memberParts, nodeChild } from "./ast.ts"
import type { NodeLike } from "./types.ts"

const effectUtilityImportSources = new Set(["effect/Clock", "effect/DateTime"])

export function hasEffectSignal(program: ESTree.Node | NodeLike): boolean {
  if (!isNode(program)) {
    return false
  }

  return containsNode(program, (candidate) => {
    if (candidate.type === "ImportDeclaration") {
      const source = nodeChild(candidate, "source")
      const value = literalValue(source)

      return (
        value === "effect" ||
        value === "@effect-atom/atom-react" ||
        (isStringValue(value) &&
          value.startsWith("effect/") &&
          !effectUtilityImportSources.has(value))
      )
    }

    const parts = memberParts(candidate)

    return parts?.[0] === "Effect" && parts.length > 1
  })
}
