import type { RuleName } from "../src/rule-names.ts"
import { rules } from "../src/rules.ts"
import { effectImport, tester } from "./rule-tester.ts"

type Cases = { valid: string[]; invalid: string[] }

function run(name: RuleName, cases: Cases) {
  tester.run(`solzero/${name}`, rules[name], {
    valid: cases.valid,
    invalid: cases.invalid.map((code) => ({ code, errors: 1 })),
  })
}

run("no-if-statement", {
  valid: [
    "if (ready) { start() }",
    `${effectImport}const value = Option.match(input, { onNone: () => 0, onSome: (n) => n })`,
  ],
  invalid: [`${effectImport}if (ready) { start() }`],
})

run("no-ternary", {
  valid: ["const value = ready ? 1 : 0"],
  invalid: [`${effectImport}const value = ready ? 1 : 0`],
})

run("no-pipe-ladder", {
  valid: [`${effectImport}const value = pipe(input, Effect.map((n) => n + 1))`],
  invalid: [
    `${effectImport}const value = pipe(input, Effect.flatMap((n) => pipe(n, Effect.succeed)))`,
  ],
})

run("no-flatmap-ladder", {
  valid: [`${effectImport}const value = Effect.flatMap(input, (n) => Effect.succeed(n))`],
  invalid: [
    `${effectImport}const value = Effect.flatMap(input, (n) => Effect.flatMap(load(n), save))`,
    `${effectImport}const value = Effect.flatten(Effect.map(input, load))`,
  ],
})

run("no-effect-call-in-effect-arg", {
  valid: [`${effectImport}const inner = Effect.succeed(1)\nconst value = Effect.asVoid(inner)`],
  invalid: [`${effectImport}const value = Effect.asVoid(Effect.succeed(1))`],
})

run("no-nested-effect-call", {
  valid: [`${effectImport}const value = Effect.asVoid(Effect.succeed(1))`],
  invalid: [`${effectImport}const value = Effect.asVoid(Effect.flatten(Effect.succeed(load())))`],
})

run("no-effect-as", {
  valid: [`${effectImport}const value = Effect.map(input, () => 1)`],
  invalid: [`${effectImport}const value = Effect.as(input, 1)`],
})

run("no-option-as", {
  valid: [`${effectImport}const value = Option.map(input, () => 1)`],
  invalid: [`${effectImport}const value = Option.as(input, 1)`],
})

run("no-arrow-ladder", {
  valid: [`${effectImport}const value = (() => 1)()`],
  invalid: [`${effectImport}const value = (() => (() => 1)())()`],
})

run("no-branch-in-object", {
  valid: [
    `${effectImport}const label = Option.match(input, { onNone: () => "", onSome: String })\nconst value = { label }`,
  ],
  invalid: [
    `${effectImport}const value = { label: Option.match(input, { onNone: () => "", onSome: String }) }`,
  ],
})

run("no-iife-wrapper", {
  valid: [`${effectImport}const run = () => 1\nconst value = run()`],
  invalid: [`${effectImport}const value = (() => 1)()`],
})

run("no-return-in-arrow", {
  valid: [`${effectImport}const value = items.map((item) => item.id)`],
  invalid: [`${effectImport}const value = items.map((item) => { return item.id })`],
})

run("no-effect-never", {
  valid: [`${effectImport}const value = Effect.void`],
  invalid: [`${effectImport}const value = Effect.never`],
})

run("no-effect-async", {
  valid: [`${effectImport}const value = Effect.promise(() => load())`],
  invalid: [`${effectImport}const value = Effect.async((resume) => resume(Effect.void))`],
})

run("no-effect-do", {
  valid: [`${effectImport}const value = Effect.gen(function* () { return 1 })`],
  invalid: [`${effectImport}const value = Effect.Do`],
})

run("no-effect-bind", {
  valid: [`${effectImport}const value = Effect.map(input, (n) => ({ n }))`],
  invalid: [`${effectImport}const value = pipe(start, Effect.bind("n", () => input))`],
})

run("no-nested-effect-gen", {
  valid: [`${effectImport}const value = Effect.gen(function* () { return yield* input })`],
  invalid: [
    `${effectImport}const value = Effect.gen(function* () { return yield* Effect.gen(function* () { return 1 }) })`,
  ],
})

run("no-match-void-branch", {
  valid: [`${effectImport}const value = Match.when("a", () => 1)`],
  invalid: [`${effectImport}const value = Match.when("a", () => Effect.void)`],
})

run("no-match-effect-branch", {
  valid: [
    `${effectImport}const value = Option.match(input, { onNone: () => 0, onSome: (n) => n })`,
  ],
  invalid: [
    `${effectImport}const value = Option.match(input, { onNone: () => Effect.void, onSome: (n) => Effect.flatMap(load(n), save) })`,
  ],
})

run("warn-effect-sync-wrapper", {
  valid: [`${effectImport}const value = Effect.sync(() => console.log("x"))`],
  invalid: [`${effectImport}const value = Effect.sync(() => save())`],
})

run("no-effect-side-effect-wrapper", {
  valid: [`${effectImport}const value = Effect.as(input, 1)`],
  invalid: [
    `${effectImport}const value = Effect.zipRight(Effect.sync(() => console.log("x")), input)`,
  ],
})

run("no-effect-orElse-ladder", {
  valid: [`${effectImport}const value = Effect.orElse(input, () => fallback)`],
  invalid: [
    `${effectImport}const value = Effect.orElse(Effect.flatMap(input, save), () => fallback)`,
  ],
})

run("no-manual-effect-channels", {
  valid: ["type Run = Effect.Effect<number>"],
  invalid: [
    `${effectImport}type Run = Effect.Effect<number>`,
    `${effectImport}type Live = Layer.Layer<Service>`,
  ],
})

run("prevent-dynamic-imports", {
  valid: ['import { load } from "./load.ts"'],
  invalid: ['const module = await import("./load.ts")'],
})

run("prefer-option-over-null", {
  valid: [`${effectImport}function find(): Option.Option<number> { return Option.none() }`],
  invalid: [`${effectImport}function find(): number | null { return null }`],
})

run("avoid-untagged-errors", {
  valid: [`${effectImport}const value = Effect.fail(new NotFound())`],
  invalid: [`${effectImport}const value = Effect.fail(new Error("missing"))`],
})

run("use-effect-otel", {
  valid: ['import { Effect } from "effect"\nconst value = Effect.logInfo("ready")'],
  invalid: ['console.log("ready")'],
})

tester.run("solzero/no-colocated-tests", rules["no-colocated-tests"], {
  valid: [
    { code: "export {}", filename: "src/user.ts" },
    { code: "export {}", filename: "tests/user.test.ts" },
    { code: "export {}", filename: "src/__tests__/user.test.ts" },
  ],
  invalid: [{ code: "export {}", filename: "src/user.test.ts", errors: 1 }],
})
