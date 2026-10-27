# DialKit and Josh Puckett's site: what makes them feel of a piece

Measured on 2026-10-27 from the live pages' computed styles, and from DialKit's source
(`joshpuckett/dialkit`, MIT): `src/styles/theme.css`, `src/components/Slider.tsx`.

## 1. DialKit's panel

### One system, few numbers

Every control in the panel is built from the same handful of values. That, more than any single
detail, is why it reads as one thing.

| Value | DialKit | Ours (Tweak panel) |
| --- | --- | --- |
| Row height | 36 for every control: slider, select, text, colour, toggle, toolbar button | 32 slider, 32 segmented track, 28 segments |
| Row radius | 8 everywhere; a segmented pill inside it is 6 (8 − 2 inset) | slider 10, segmented 9999 (a capsule beside a rounded rectangle) |
| Row gap | 6 | varies |
| Panel | `#fafafa`, 1px `#0000001a` border, radius 14, padding 10/12, shadow `0 4px 20px #00000014` | `#fff`, ring + `0 2px 4px` shadow, radius 18, padding 8 |
| Label | 13 / 500, `#0009` (60% black) | 15 / 400 ink on the slider; 13 / 500 on segments |
| Value | Geist Mono 13 / 500, same 60% black; full black while active | sans |
| Section title | 13 / 600, 65% black, −0.01em | — |
| Divider | 1px at 6% black between folders | — |

### Colour is one ink at a few alphas

Light theme, all on `#fafafa`:

- surface `#0000000a` (4%), hover `#00000014` (8%), active `#0000001a` (10%), subtle `#0000000f` (6%);
- text: root 100%, primary 90%, section 65%, label 60%, secondary 55%, tertiary 35%;
- border 10%, border-hover 15%, focus ring 55%.

The dark theme is the same list in white. No control has a border; depth comes only from the panel.
State changes are steps on that alpha ladder (surface 4% → hover 8% → active 10%), each a 0.15s
colour transition.

### The slider's behaviour (Slider.tsx)

- **Handle:** a 3 × 20 bar. Opacity 0 at rest, 0.5 when active, 0.9 dragging, and 0.1 when it would
  sit over the label or the value. It grows from `scaleX 0.25` with a spring
  (visualDuration 0.25, bounce 0.15).
- **Fill:** while active it deepens from the active surface to `border-hover`.
- **Hash marks:** 1 × 8, invisible until active. There is one per step when the slider has 10 steps
  or fewer, and one per tenth otherwise.
- **Click and drag:** a click (under 3px of movement) snaps to the nearest decile, or to the nearest
  step on a coarse slider, with a spring (stiffness 300, damping 25, mass 0.8). A drag follows the
  pointer exactly.
- **Rubber band:** past either end, after a 32px dead zone, the row stretches
  8 · √(overflow / 200) px at most. On release it springs back (0.35s, bounce 0.15).
- **Value:** hovering the value for 800ms makes it editable and underlines it; the number becomes
  an input.

We already copied the slider (rubber band, handle, fill). What we didn't copy is the system
around it.

## 2. dialkit.dev, the docs page

- **Headline:** a custom face (mluvka) at 128 / 128, weight 450, −0.02em. The draggable control
  chips around it are the product itself.
- **Body:** one 672px column. h2 24 / 33.6 at 500; text 16 / 24 at 500 in `#a3a3a3` on near-black.
- **Install and Usage tabs:** plain words, white when active and grey when not, with no pill.
- **Code:** one surface with 16px padding, 13px mono.

## 3. joshpuckett.me

### Home

- One 548px column.
- Name and section titles in a serif (Signifier) at 24 / 36, weight 400, with a 48 × 1 hairline in
  `#d4d4d4` under each, 24px above and below.
- Text in system-ui 16 / 26, `#525252`.
- Links are not underlined: they are near-black `#0a0a0a` against the grey text.
- Projects are a list with no bullets: a name in black, then a one-line description in grey.

### An article (`/seamless-mobile-safari`)

- **Column:** one 624px column, and **figures and code are the same 624 as the text**. Both edges
  align.
- **Title:** serif 30 / 36 at 500, −0.025em.
- **Body:** 16 / 24 in `#525252`, 16px between paragraphs.
- **Headings:** h2 20 / 28 at 500, near-black, 64px above.
- **Figures:** `#fafafa`, radius 16, no border and no shadow, 20px padding. The caption sits
  *inside* the figure at 12 / 16 `#737373`.
- **Table of contents:** pinned at the far left, 14 / 20 `#a3a3a3`.
- **Date:** "Originally written in …" at the end, 14px grey.

## What this means for the playbook

1. **Hierarchy by ink, not size.** His headings are barely larger than the text (20 against 16);
   colour carries the rank: near-black headings, grey body. Ours step 40 → 24 → 16 in near-black
   throughout.
2. **One width for everything** in an article. Done on 2026-10-27: prose and demos share 576px.
3. **One control system.** Pick one row height, one radius and one alpha ladder for every control
   in a Tweak panel. Concretely:
   - segmented tracks at the slider's radius, with the selected segment concentric inside;
   - labels and values at one size and weight;
   - values in mono;
   - the panel on a 4% surface with a hairline.
4. **Figures without chrome.** A flat tinted surface with the caption inside reads calmer than a
   white card with a ring and a shadow.
5. **Personality from one move.** The serif titles, the hand-tuned display face, and the live
   controls as the hero. One distinctive element, everything else quiet.
