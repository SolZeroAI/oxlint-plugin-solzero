---
packages:
  "npm:oxlint-plugin-solzero": minor
---

## Built-in correctness rules are errors

`recommended` sets Oxlint's `correctness` category to `error`. Oxlint runs that category at
`warn` by default, so findings such as unused imports and React hook issues passed lint as
warnings. They now fail lint in every repository that extends `recommended`. Fix the findings,
or turn a rule off in your own config with a documented reason.
