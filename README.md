# UI Playbook

The small details that make interface components feel right, each shown as a
live before/after. Built with the Precision design system on
[Base UI](https://base-ui.com).

Live at <https://ui-playbook.suspense.site>.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static site in dist/
pnpm run deploy # build, then upload to Cloudflare Workers (`pnpm deploy` is a pnpm builtin)
```

## Layout

| Path | What |
| --- | --- |
| `src/tokens/precision.json` | Design tokens, the single source. `scripts/build-tokens.mjs` writes `src/styles/tokens.css` before every dev and build. |
| `src/ui/` | Precision components on Base UI, each with its own `.module.scss`. Icons are Lucide. |
| `src/demos/` | Demo shells (`Frame`, `Compare`, `Tweak`, `StateGrid`) and each page's demos. `mistakes.module.scss` holds the "before" styles. |
| `src/pages/components/`, `src/pages/principles/` | One MDX page each: Anatomy, States, Details, Common mistakes, Copy. |
| `src/entries.ts` | What the home page lists, in order. |

## Adding a component page

1. Build the component in `src/ui/` on the matching Base UI parts.
2. Write its demos in `src/demos/<name>.tsx`. A demo that holds live components must be one exported component, since an island's children render as static HTML.
3. Add `src/pages/components/<name>.mdx` and an entry in `src/entries.ts`.

States that StateGrid pins use `data-pin` (see `src/styles/_states.scss`), so component styles write `@include hover { … }` rather than `&:hover`.
