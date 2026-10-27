import type { ESTree } from "@oxlint/plugins"

export type NodeProperty =
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined
  | NodeLike
  | readonly NodeProperty[]

export type NodeLike = ESTree.Node & {
  readonly type: string
  readonly [key: string]: NodeProperty
}

export type RuleReporter = (node: NodeLike, message?: string) => void

export type RuleRuntime = {
  report: RuleReporter
  shouldRun: () => boolean
}

export type VisitorMap = Record<string, (node: NodeLike) => void>
