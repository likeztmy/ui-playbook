# UI Playbook

The small details that make interface components feel right, each shown as a
live before/after. Built with the Precision design system on
[Base UI](https://base-ui.com).

Live at <https://ui-playbook.suspense.site>.

## Develop

```bash
pnpm install      # also points git at .githooks (pre-commit runs `pnpm check`)
pnpm dev          # http://localhost:4321
pnpm check        # astro check (.astro, .ts, .tsx) + stylelint + no inline SVG
pnpm test:e2e     # Playwright against the built site, installed Chrome, one worker
pnpm verify       # check + build + test:e2e
pnpm run deploy   # verify, then upload to Cloudflare Workers (`pnpm deploy` is a pnpm builtin)
pnpm shoot /components/menu --theme dark --selector figure   # headless screenshot + --eval measurements
```

## Layout

| Path | What |
| --- | --- |
| `src/tokens/precision.json` | Design tokens, the single source. `scripts/build-tokens.mjs` writes `src/styles/tokens.css` before every dev and build. |
| `src/ui/` | Precision components on Base UI, each with its own `.module.scss`. Icons are Lucide. |
| `src/demos/` | Demo shells (`Frame`, `Compare`, `Tweak`, `StateGrid`) and each page's demos. `mistakes.module.scss` holds the "before" styles. |
| `src/pages/components/`, `src/pages/principles/` | One MDX page each: Anatomy, States, Details, Common mistakes, Copy. |
| `src/entries.ts` | What the home page lists, in order. The smoke test walks every entry. |
| `tests/` | `smoke.spec.ts`: every page hydrates, logs no errors, never scrolls sideways (2 widths × 2 themes). `interactions.spec.ts`: one test per behaviour a page claims. |
| `src/pages/lab/` | Design directions kept for reference; not in the gallery, `noindex`. |

## Adding a component page

1. Build the component in `src/ui/` on the matching Base UI parts.
2. Write its demos in `src/demos/<name>.tsx`. A demo that holds live components must be one exported component, since an island's children render as static HTML.
3. Add `src/pages/components/<name>.mdx` and an entry in `src/entries.ts`.
4. For each behaviour the page claims (a delay, a kept width, a keyboard path), add a test to `tests/interactions.spec.ts`.

States that StateGrid pins use `data-pin` (see `src/styles/_states.scss`), so component styles write `@include hover { … }` rather than `&:hover`.

## Syncing the design system

Precision lives as a Design System artifact (claude.ai/artifact/KF1A98gMkmBjWbeyZ4njh9). To take an update, copy its `project/tokens.json` over `src/tokens/precision.json` unchanged. `scripts/build-tokens.mjs` handles the rest:

- Font stacks get the self-hosted names (`"Geist Variable"`, `"Geist Mono Variable"`) put in front.
- Aliases like `"{accent-text}"` are emitted inside every theme block, so a subtree pinned with `data-theme` resolves them in its own theme.
- Its README's Chinese rules are the source for each page's rules; the playbook restates them in English.
