# AGENTS.md

## Voice

Use Simplified Technical English in formal, operational, and other sensible components of the document where you’re establishing specifics.
Use Plain Language in introductory, expository, friendly, and other sensible components of the document where you’re drawing the reader in or keeping them engaged.

## Repository layout

- `src/index.ts` is the `solzero` plugin. `src/rules.ts` holds every rule. `src/rule-names.ts` and `src/messages.ts` list the names and messages.
- `src/config.ts` is the shared config that consumers extend from `oxlint.config.ts`.
- `src/anti-slop.ts` and `src/anti-slop-effect.ts` re-export the `vendor/anti-slop` submodule. Do not edit files under `vendor/`. Change anti-slop upstream, then move the submodule.
- `tests/` holds one `RuleTester` case set per rule. Every rule needs a valid and an invalid case.

Rules must not contain repository paths. A consumer that needs an exception adds an `overrides` entry in its own config.

## Development stack

Clone with submodules, or run `git submodule update --init` after a plain clone. The build compiles anti-slop from `vendor/anti-slop`.

```sh
nub install
```

To update anti-slop:

```sh
git -C vendor/anti-slop fetch origin
git -C vendor/anti-slop checkout <commit>
git add vendor/anti-slop
```

`recommended` enables every anti-slop rule, so a new upstream rule becomes an error in every consumer. Add a `.tegami/` entry that names new rules and choose `minor`.

## Validation

Run these commands from the repository root before handoff:

```sh
nub run typecheck
nub run lint
nub run test
nub run format
```

`nub run lint` builds first, because `oxlint.config.ts` loads the plugin by its package name.

## Pull requests

Open a pull request as a draft. Keep it a draft while you work. GitHub Actions does not run jobs on a draft pull request.

When the work is done, mark the pull request ready for review.

## Release management

- Add a `.tegami/` entry with `"npm:oxlint-plugin-solzero"` for every change that consumers can observe.
- Do not edit `version`, `CHANGELOG.md`, or `.tegami/publish-lock.yaml` on a feature branch. The Tegami version pull request owns those files.
- Merging the Tegami version pull request publishes to npm. Do not merge it without the maintainer's approval.
