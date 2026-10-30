# oxlint-plugin-solzero

Oxlint rules and one shared config for SolZero repositories. The package contains:

| Import                                   | What it is                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| `oxlint-plugin-solzero`                  | The `solzero` plugin: Effect composition rules, `use-effect-otel`, `no-colocated-tests` |
| `oxlint-plugin-solzero/anti-slop`        | [anti-slop](https://github.com/dmmulroy/anti-slop), compiled from `vendor/anti-slop` |
| `oxlint-plugin-solzero/anti-slop-effect` | anti-slop's Effect rules                                                       |
| `oxlint-plugin-solzero/config`           | `recommended`, `agentToolIgnorePatterns`, `effectRules()`, `observabilityRules()`                         |

All entry points are compiled JavaScript, so Oxlint loads them without `tsx`.

## Install

```sh
nub add -D oxlint oxlint-plugin-solzero
```

## Configure

```ts
// oxlint.config.ts
import { defineConfig } from "oxlint"
import {
  agentToolIgnorePatterns,
  effectRules,
  observabilityRules,
  recommended,
} from "oxlint-plugin-solzero/config"

export default defineConfig({
  extends: [recommended],
  plugins: ["unicorn", "typescript", "oxc", "react"],
  // Oxlint does not inherit ignorePatterns through extends, so spread the shared list.
  ignorePatterns: [...agentToolIgnorePatterns, "dist/**"],
  overrides: [
    // Effect services: flat pipelines, Option over null, tagged errors.
    { files: ["packages/api/src/server/**"], rules: effectRules("error") },
    // Request surfaces: Effect logging instead of console.
    { files: ["packages/api/src/server/**"], rules: observabilityRules("error") },
    // Files that bridge to non-Effect code.
    { files: ["packages/infra/src/stacks/**"], rules: effectRules("off") },
  ],
})
```

`recommended` loads the three plugins and enables `oxc/no-accumulating-spread` plus every
anti-slop and anti-slop-effect rule as an error. It also sets Oxlint's built-in `correctness`
category to error, because Oxlint runs that category at warn by default. SolZero lint has no
warning level: run `oxlint --deny-warnings` so that a rule set to warn fails lint. `agentToolIgnorePatterns` lists the agent
tool directories (`.agents/**`, `.claude/**`, `.cursor/**`, and similar). Turn a rule off for a documented
reason in your own `rules` or `overrides`.

The `solzero` composition rules check only files that import Effect.

## Rules

| Rule                                                                                   | Checks                                              |
| -------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `no-if-statement`, `no-ternary`                                                        | Imperative branching                                |
| `no-pipe-ladder`, `no-flatmap-ladder`, `no-nested-effect-call`, `no-effect-call-in-effect-arg` | Nested pipelines and Effect calls           |
| `no-effect-as`, `no-option-as`, `no-effect-side-effect-wrapper`, `warn-effect-sync-wrapper` | Placeholder values and wrapped side effects    |
| `no-arrow-ladder`, `no-iife-wrapper`, `no-return-in-arrow`                             | IIFEs and block-bodied callbacks                    |
| `no-branch-in-object`, `no-match-void-branch`, `no-match-effect-branch`                | Decisions hidden in objects or Match branches       |
| `no-effect-never`, `no-effect-async`, `no-effect-do`, `no-effect-bind`, `no-nested-effect-gen` | Lifecycle and builder APIs                  |
| `no-effect-orElse-ladder`, `no-manual-effect-channels`                                 | Error-handling ladders and hand-written channel types |
| `prevent-dynamic-imports`                                                              | `import()`                                          |
| `prefer-option-over-null`, `avoid-untagged-errors`                                     | Nullable types and bare `Error` failures            |
| `use-effect-otel`                                                                      | `console.*` on observability surfaces               |
| `no-colocated-tests`                                                                   | `*.test.*` files outside `test`, `tests`, `__tests__` |

Each rule's message states the rule, why it exists, and the fix.

## anti-slop

anti-slop is a git submodule at `vendor/anti-slop`, pinned to a reviewed commit. The build
compiles it into the package, so consumers do not install it from GitHub. Its license is
in `vendor/anti-slop/LICENSE` and ships with the package.

## License

MIT
