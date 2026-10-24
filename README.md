<p align="center">
  <a href="https://bydawn.com/open-source"><img src="https://raw.githubusercontent.com/LenderCom/bydawn-dryrun/main/.github/assets/readme-header.svg" width="100%" alt="bydawn-dryrun: A practice run, before first light. By Dawn open source."></a>
</p>

<p align="center">
  <a href="#install">Install</a> ·
  <a href="#before-first-light">Before first light</a> ·
  <a href="https://bydawn.com/open-source">The shoreline</a> ·
  <a href="#used-in-by-dawn">Used in By Dawn</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

**bydawn-dryrun** is the By Dawn open-source template, run once end to end before the real packages. It holds a tiny clock: times of night as `hh:mm`, and how many minutes until one comes round again.

It exists to prove the recipe: the README renders on GitHub in light and dark, GitHub detects the licence, and both gates pass. It is never published to npm. Use the real packages at bydawn.com/open-source instead.

## Install

```sh
npm install @bydawn/dryrun   # a dry run: this package is never published
```

## Before first light

```ts
import { clock, minutesUntil } from '@bydawn/dryrun';

clock(new Date('2026-10-23T05:47:00Z'));                  // '05:47'
minutesUntil(new Date('2026-10-23T23:30:00Z'), '00:15');  // 45, past midnight
```

## What it won't do

- Ship. This repository is a rehearsal and will be archived once the first real package is out.
- Know about time zones. It reads and speaks UTC only.

## Used in By Dawn

Nowhere. It is the dry run every By Dawn package goes through first, so the real ones arrive looking right. We don't keep a private copy. When we fix it, you get the fix.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first. Found a security problem? Report it privately, as [SECURITY.md](SECURITY.md) explains. Everyone here follows the [code of conduct](CODE_OF_CONDUCT.md).

bydawn-dryrun is licensed under [Apache-2.0](LICENSE). See [NOTICE](NOTICE).

<p align="center">
  <a href="https://bydawn.com/open-source">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/LenderCom/bydawn-dryrun/main/.github/assets/colophon-dark.svg">
      <img src="https://raw.githubusercontent.com/LenderCom/bydawn-dryrun/main/.github/assets/colophon-light.svg" width="100%" alt="Made on the coast, by dawn. bydawn-dryrun, copyright 2026 Lender Software Solutions LLC, Apache-2.0. Used every night in By Dawn.">
    </picture>
  </a>
</p>
