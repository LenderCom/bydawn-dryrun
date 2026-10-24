<img src="https://raw.githubusercontent.com/LenderCom/bydawn-dryrun/main/.github/assets/doc-strip.svg" width="100%" alt="bydawn-dryrun, By Dawn open source">

# Contributing to bydawn-dryrun

Thank you for wanting to help. bydawn-dryrun is small on purpose, and we'd like to keep it that way. A clear change with a test beats a clever one without.

## Before you start

- For anything bigger than a typo, open an issue first and say what you want to change and why. It saves you writing a pull request we can't take.
- Keep each change to one idea. Two ideas are two pull requests.
- Security problems never go in a public issue. See [SECURITY.md](SECURITY.md).

## Making the change

```sh
bun install
bun test
bun run typecheck
bun run build
```

- Add a test that fails without your change and passes with it.
- Run the two gates that CI runs as well: `node scripts/reference-gate.mjs` and `node scripts/license-gate.mjs`.

## Review

An agent can't mark its own homework, and neither can we: every pull request runs the full suite, and a maintainer reads every line before it merges. We aim to answer within a few working days.

## Releases

This repository is the rehearsal, and `@bydawn/dryrun` is never published. A tag, like a manual run of Release, only packs the package and runs `npm publish --dry-run`: nothing leaves CI. The real By Dawn packages publish to npm with provenance when a maintainer tags a release, and their release notes say what changed overnight.

## Licence

By contributing, you agree that your contribution is licensed under Apache-2.0, the same as the project (see section 5 of [LICENSE](LICENSE)). You keep your copyright. There is no CLA.
