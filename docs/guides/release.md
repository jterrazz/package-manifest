# Release

This repository ships one thing: the npm package `@jterrazz/manifest`, published to the public registry. There is no service, no image and no infrastructure of its own — releasing it is the whole of shipping it, and this guide is how it is cut and who cuts it.

## What a merge to `main` does

Nothing that reaches a consumer. `.github/workflows/validate.yaml` runs on every push and pull request to `main` and calls the shared `jterrazz-actions` validation workflow — build, lint, test, mutation — with `browsers: true`, since the audit spec renders pages in a headless Chromium. A green `main` is a publishable tree, not a published one.

## What publishes

`.github/workflows/release.yaml` fires on `release: created` and calls the shared `release-npm.yaml` workflow with npm provenance (`id-token: write`). Exactly one gesture publishes, and a human makes it: cutting a GitHub Release.

The sequence, in order:

1. the change merges to `main` and validates green;
2. `version` in `package.json` (and the lockfile) is bumped on `main`;
3. the owner tags `vX.Y.Z` and creates the GitHub Release;
4. the workflow publishes to npm, with provenance.

Steps 2 to 4 are the owner's. A contributor never bumps the version inside a feature branch: two branches in flight would both claim the same number, and the tag is what the registry answers to.

## The peer range

The `./testing` entry is written against `@jterrazz/test`'s accessors, so its peer range follows that package's major: a site whose specs run the audit on another major fails on this package, not on its own code. A new `@jterrazz/test` major is taken here, and released, before the sites that run the audit take it.

## Related

- [Test](test.md) — what `validate.yaml` runs.
- [Develop](develop.md) — the gates a merge must pass.
