# Coding standards

For reviewing a diff. Mechanical rules (token-only colours and layers, no
`transition: all`, Lucide instead of inline SVG, types) are enforced by
`pnpm check`; this file holds the judgement calls it can't make.

The playbook is evidence for its own rules: a component that breaks a rule
its page teaches undercuts every page. Review each change as a **witness**
for those rules.

## Components

- **Practises its page.** Read the component's MDX page (and Precision's README, the source for the rules) beside the diff. Every rule the page states, the component obeys: concentric radii, equal insets, one accent, the stated durations and easings, focus only on `:focus-visible`.
- **Checked against the reference products.** A new or reworked component is compared with how macOS, Linear and Raycast solve the same thing. A deliberate deviation is named in the page or the commit message.
- **Wrappers forward everything.** A component wrapping another passes its rest props and `ref` through to the element. Base UI's `render` composition and `Tip` merge event handlers and a ref into the child; a wrapper that drops them breaks hover silently.
- **State changes are transitionable.** Hover and press fade through `opacity` or a colour, never by swapping a `background-image` gradient, which snaps. Enter is `duration-instant`, leave is `duration-fast`.
- **Icon-only controls are named twice, identically.** An `aria-label` and a `Tip` with the same words.

## Demos and pages

- **Pages cover every case, not just the best one.** A component page opens with *When to use* (and what to use instead) and *Kinds* or *Variants*: every option the component exposes (icons, shortcuts, sizes, states, how it opens) appears in a live example with when to use it and when not. A rule that holds in one variant and not another says which. Ground the guidance in the reference products' own docs (Apple HIG and the like), and name deliberate deviations.
- **One island per live demo.** A demo whose children are interactive is a single exported component; children passed into an island render as static HTML.
- **Before is a real mistake.** A comparison's "before" reproduces something shipping products actually do, via `src/demos/mistakes.module.scss`, and its note says what goes wrong.
- **Claims are tested.** Each behaviour a page states (a delay, a kept width, a keyboard path) has a test in `tests/interactions.spec.ts`.
- **Copy.** English, sentence case, verbs on buttons and menu items, a tooltip's name equal to the control's `aria-label`.
