---
packages:
  "npm:oxlint-plugin-solzero": minor
---

## First release

One Oxlint package for every SolZero repository. It replaces the `janus-lint` and
`s0-lint` workspace packages and the `github:dmmulroy/anti-slop` dependency.

- `oxlint-plugin-solzero` is the `solzero` plugin: the Effect composition rules from
  `janus-lint` and `s0-lint`, `use-effect-otel`, and `no-colocated-tests`.
- `oxlint-plugin-solzero/anti-slop` and `oxlint-plugin-solzero/anti-slop-effect` are
  anti-slop, compiled from the pinned `vendor/anti-slop` submodule.
- `oxlint-plugin-solzero/config` exports `recommended`, `effectRules()`, and
  `observabilityRules()` for `oxlint.config.ts`.

Migration from `s0-lint`: `no-effect-ladder`, `no-call-tower`, and `no-return-in-callback`
were duplicates of `no-nested-effect-call`, `no-effect-call-in-effect-arg`, and
`no-return-in-arrow` and are removed. `max-file-lines` is replaced by Oxlint's built-in
`max-lines`. Repository path allowlists moved out of the rules and into each repository's
config overrides.
