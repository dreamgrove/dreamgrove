# Dreamgrove

This is the source for [dreamgrove.gg](https://dreamgrove.gg), the website of the Dreamgrove Druid community.

It contains the spec compendiums, other guides, dungeon and raid notes, a cooldown planner and a few other tools.

Every guide is an `.mdx` file in `data/` and small fixes can be done directly on GitHub.

## Running it locally

You'll need Node 24 and pnpm.

```
git clone git@github.com:dreamgrove/dreamgrove.git
cd dreamgrove
pnpm install
pnpm dev
```

Then open http://localhost:3000.

Most of the site works without any setup with the exception being the in-browser editor (`/cms`) and the wclogs integration. If you want those, copy `.env.local.example` to `.env.local` and fill it in. The file has comments on where to get each value.

## Where things are

- `data/blog/` - the spec compendiums and guides
- `data/dungeons/`, `data/raids/` - dungeon and raid guides
- `app/` - the pages themselves
- `components/` - JSX and MDX components
- `sims/` - the APLs and profiles used for sims
- `other/` - talent data, planner loadouts and miscellaneous

## Writing guides

Guides are written in MDX, a superset of markdown that supports JSX. You can add in spells, talent trees, planner timelines and so on with a custom syntax. For example:

```md
Use !Fury of Elune! during <Wowhead type="spell" name="Celestial Alignment"/>.
```

[CONTRIBUTING.md](CONTRIBUTING.md) has the full list of components and how to use them.

## Other commands

```
pnpm build      # production build, run this before opening a PR
pnpm test       # run the tests
pnpm lint       # lint and autofix
pnpm check:mdx  # check that all the mdx files compile
```

## License

MIT. See [LICENSE](LICENSE).
