# Operating

This repository ships one thing: the npm package `@jterrazz/manifest`,
published to the public registry. There is no service, no image and no
infrastructure — operating it means the release, and what triggers one.

| Question                        | Section             |
| ------------------------------- | ------------------- |
| What does a merge to `main` do? | What a merge does   |
| What publishes the package?     | What publishes      |
| What version gets published?    | Which version ships |

## What a merge does

`.github/workflows/validate.yaml` runs on every push and pull request to
`main`, calling the shared `jterrazz-actions` validation workflow with
`node-version: '24'`. A green `main` is publishable, not published — nothing
here deploys anywhere on its own.

## What publishes

`.github/workflows/release.yaml` fires on `release: created` and calls the
shared `release-npm.yaml` workflow (`jterrazz-actions`), with
`id-token: write` for npm provenance and `secrets: inherit`. That shared
workflow builds (`make build`) and publishes to the npm registry — so
exactly one gesture publishes, and a human makes it: creating a GitHub
Release.

## Which version ships

`npm publish` reads whatever `version` `package.json` carries on the commit
the release points at (`package.json:3`), so the version to publish must
already be bumped and merged to `main` before the release is created — the
tag and the release are what the registry answers to, not a separate step
this repository's workflow performs.

## Related

- [02-developing.md](02-developing.md) — the local gate a release inherits.
- [03-testing.md](03-testing.md) — what `validate.yaml` runs.
