import { describe, it } from "node:test"
import { RuleTester } from "oxlint/plugins-dev"

RuleTester.describe = describe

RuleTester.it = it

export const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } })

export const effectImport = 'import { Effect, Layer, Match, Option, pipe } from "effect"\n'
