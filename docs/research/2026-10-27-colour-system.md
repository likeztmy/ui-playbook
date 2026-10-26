# Colour system: choosing hues, neutrals and steps

Research for a principle page on how to **choose** an interface's colours: the space a scale is built in, the lightness steps, the neutrals, the status hues and the dark theme. How colour is **used** is already covered by `src/pages/principles/colour-means-one-thing.mdx` (one colour, one meaning; colour never alone, WCAG 1.4.1). Simultaneous contrast is backlog #6, "A colour changes with its neighbours" (`2026-10-25-topic-backlog.md`). Attention guidance, WCAG 1.4.3/1.4.11 basics, Material roles, the M2 dark-theme `#121212` advice, Fluent, and CVD prevalence are covered in `2026-10-27-colour-and-unread.md`. None of that is repeated here; this note only cites it where a rule builds on it.

**Labels.**
- **Verified**: read in the primary source this session (page text, spec text or source code).
- **Secondary**: known only through a search snippet, an abstract summary or a non-author page.
- **Unverified**: stated from memory or inference; keep it off pages.
- **Computed**: numbers worked out here from the published formulas: OKLab (Ottosson 2020 matrices), WCAG 2 relative luminance and ratio, APCA 0.0.98G-4g constants, CIELAB L\*, and Machado et al. 2009 CVD matrices. The APCA implementation reproduces the published reference values (#888 on #fff = Lc 63.06; #000 on #fff = Lc 106.04). Scripts were run in a scratchpad and are not in the repo.

---

## 1. Perceptual colour spaces for building scales

### OKLab / OKLCH

- **Source.** Björn Ottosson, *A perceptual color space for image processing*, 23 Dec 2020, https://bottosson.github.io/posts/oklab/. **Verified.**
  - The goal: a space that should "predict lightness, chroma and hue well", blend evenly, and be numerically simple.
  - On HSV: "Yellow, magenta and cyan appear much lighter than red and blue". On CIELAB/CIELUV: their "largest issue is their inability to predict hue. In particular blue hues are predicted badly"; in blends, "CIELAB, CIELUV and HSV all show hue shifts towards purple".
  - The post's RMS error table, with the comparison data generated from CAM16:

    | | Oklab | CIELAB | HSV |
    | --- | --- | --- | --- |
    | Lightness | 0.20 | 1.70 | 11.59 |
    | Chroma | 0.81 | 1.84 | 3.38 |
    | Hue | 0.49 | 0.69 | 1.10 |

    JzAzBz scores better on hue (0.43).
  - **Caveat, from the post itself.** The test data were generated with CAM16, not collected from people, so the table measures agreement with a model rather than with observers. "Perceptually uniform" is a claim about fit to CAM16 and the Munsell data, not a new human study.
- **Follow-up.** Ottosson, *Okhsv and Okhsl* (8 Sep 2021), https://bottosson.github.io/posts/colorpicker/. **Verified.**
  - HSL lightness "does not match the perception of lightness well at all for saturated colors".
  - The trade-off is structural: "independent control of hue, lightness and chroma can not be achieved in a color space that also maps sRGB to a simple geometrical shape". In OKLCH the sRGB gamut is "quite irregular", with a cusp per hue.

### CSS Color 4 and 5

- **CSS Color Module Level 4**, W3C Candidate Recommendation Draft, 26 Oct 2026, https://www.w3.org/TR/css-color-4/. **Verified.**
  - §7 (HSL): blue and yellow both have HSL lightness 50%, yet "clearly the yellow looks much lighter than the blue". HSL lightness "is simply the mean of the gamma-corrected red, green and blue components". "The hue angle in HSL is not perceptually uniform." The spec's own values: sRGB blue is `oklch(0.452 0.313 264.1)` and sRGB yellow is `oklch(0.968 0.211 109.8)`.
  - §9.1: in CIE LCH, "In the blue region (LCH Hue between 270° and 330°), visual hue departs from what LCH predicts".
  - §9.2: Oklab "has improved hue linearity, hue uniformity, and chroma uniformity compared to CIE LCH".
  - §14.2 (gamut mapping): "All three CSS gamut mapping algorithms aim at constant-lightness, constant-hue chroma reduction in the OkLCh color space." §14.2.1: "For the OkLCh color space, one JND is an OkLCh difference of 0.02." That 0.02 ΔEOK is used below as the "can't tell apart" line.
  - §2: an out-of-gamut colour is mapped to "a similar-looking but lower chroma (less saturated) color".
- **CSS Color Module Level 5**, W3C Working Draft, 26 Oct 2026, https://www.w3.org/TR/css-color-5/. **Verified.**
  - Relative colour syntax: `oklch(from var(--base) l c calc(h + 90))`.
  - `color-mix()` interpolates in Oklab by default. These are what let a theme be generated in CSS from a few inputs.
  - It is a Working Draft, so treat it as shipping-in-browsers rather than as a stable standard.

### Material HCT

- **Material Color Utilities (MCU) source and concept docs**, https://github.com/material-foundation/material-color-utilities (concepts/*.md and typescript/ read via the GitHub API). **Verified.**
  - `concepts/color_spaces.md`: RGB, HSL and CMYK "are flawed in several fundamental ways. They describe colors, but do not do a good job of describing the relationships between colors." HCT combines CAM16 hue and chroma with CIELAB L\* as tone. When a requested colour is impossible, "HCT keeps the tone, and reduces chroma until the color is feasible". That is the same choice CSS gamut mapping makes.
  - `concepts/dynamic_color_scheme.md`: tone "determines control contrast. Colors with a greater difference in tone create higher contrast." HCT chroma "top[s] out at roughly 120".
  - `concepts/contrast_for_accessibility.md`: "a difference of 40 in tone guarantees a WCAG contrast ratio ≥ 3.0; a difference of 50 in tone guarantees a contrast ratio ≥ 4.5".
    - **Computed:** the worst case for ΔL\* 50 is T50 against T100, which gives 4.484:1, a hair under 4.5. WCAG doesn't round ("4.499:1 would not meet", per the earlier note). So the real worst cases are ΔL\* 40 → 3.17:1, 50 → 4.48:1 and 60 → 6.46:1. Use ΔL\* ≥ 51 for a hard 4.5:1.
- **Not read.** Google's 2022 blog post *The Science of Color & Design* (https://m3.material.io/blog/science-of-color-design) is a client-rendered page; WebFetch returned only its title. Everything about HCT above comes from MCU's own docs and code instead. **Unverified** as a quote source.

### Why HSL lightness lies, in numbers (computed)

Eight hues at `hsl(h 100% 50%)` all have the same nominal lightness:

| HSL hue | OKLCH L | WCAG vs white |
| --- | --- | --- |
| 240 blue | 45.2% | 8.59:1 |
| 270 purple | 53.0% | 6.26:1 |
| 0 red | 62.8% | 4.00:1 |
| 300 magenta | 70.2% | 3.14:1 |
| 30 orange | 73.1% | 2.53:1 |
| 120 green | 86.6% | 1.37:1 |
| 180 cyan | 90.5% | 1.25:1 |
| 60 yellow | 96.8% | 1.07:1 |

One "lightness" value spans 51 points of perceived lightness and an 8× range of contrast against white.

### Gamut: sRGB vs Display P3 (computed)

Maximum in-gamut OKLCH chroma, shown as sRGB / P3:

| Hue | L 45% | L 55% | L 65% | L 75% | L 85% | L 95% |
| --- | --- | --- | --- | --- | --- | --- |
| Blue (256°, Precision's accent hue) | 0.154 / 0.196 | 0.188 / 0.240 | 0.189 / 0.204 | 0.130 / 0.141 | 0.075 / 0.082 | 0.024 / 0.026 |
| Red (25°) | 0.183 / 0.206 | 0.223 / 0.251 | 0.236 / 0.297 | 0.151 / 0.193 | 0.082 / 0.106 | 0.025 / 0.032 |
| Green (150°) | 0.124 / 0.173 | 0.152 / 0.211 | 0.179 / 0.250 | 0.207 / 0.288 | 0.234 / 0.327 | 0.083 / 0.093 |
| Yellow (100°) | 0.094 / 0.109 | 0.114 / 0.133 | 0.135 / 0.157 | 0.156 / 0.181 | 0.177 / 0.205 | 0.107 / 0.125 |

- Every hue's chroma collapses toward white and black, but the cusp sits at a different lightness per hue: blue near L 55–65, yellow and green near L 85. So a "light tint" of yellow can hold four times the chroma of a light tint of blue (L 95: 0.107 vs 0.024).
- P3 adds the most around the cusp: +28% chroma for blue at L 55, +40% for green at L 65.
- Tailwind v4 uses this headroom. Its blue-500 (`oklch(62.3% 0.214 259.8)`), red-600, green-500 and amber-500 are **outside sRGB** (computed), so they get gamut-mapped on sRGB screens.
- Apple HIG *Color* says P3 colours "appear fine on sRGB displays", but "it may be hard to distinguish two very similar P3 colors when viewing them on an sRGB display" (https://developer.apple.com/design/human-interface-guidelines/color, JSON source read). **Verified.**

---

## 2. Contrast: WCAG 2.2 and APCA

### WCAG 2.2

- Ratios are in the earlier note (4.5:1 text, 3:1 large text and non-text).
- **Understanding 1.4.3**, https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html. **Verified.**
  - Rationale: "visual acuity of 20/40 is associated with a contrast sensitivity loss of roughly 1.5", so "3 * 1.5 = 4.5 to 1".
  - Hue: "contrast is calculated in such a way that color (hue) is not a key factor", and "effective luminance contrast can generally be computed without regard to specific color deficiency".
  - Admitted limit: "particularly thin or unusual fonts may be rendered … with a much fainter color" and then have "a much lower contrast in practice".
  - The page says nothing about dark mode.
- **Known flaws, as argued by the APCA author.** Andrew Somers (Myndex), w3c/wcag issue #695, *Contrast Ratio Math and Related Visual Issues*, opened 14 Apr 2019 and **still open**, https://github.com/w3c/wcag/issues/695. **Verified** for the thread's content; the claims are the author's own and have not been independently verified.
  - The ratio "fails badly in the midrange colors as it does not adjust for human nonlinear perception".
  - In 2019 he estimated "40% of the color pairs the WCAG math calls 'PASS' are poor in quality".
  - A 2024 comment says it "greatly overstates the contrast of dark colors, and understates the contrast of lighter colors".
  - An April 2025 comment asks whether a WCAG 2.x erratum could address the issue. No erratum has been found.

### APCA

- **Primary.** https://github.com/Myndex/apca-w3. **Verified.**
  - Algorithm 0.0.98G-4g (15 Feb 2021); library 0.1.9, labelled "beta".
  - APCA "is being evaluated as a replacement for WCAG 2 contrast math"; "standards that will be incorporating APCA are still developmental".
  - Output is signed Lc: negative means light text on a dark background.
- **Thresholds.** *ARC Bronze Simple Mode*, https://readtech.org/ARC/tests/bronze-simple-mode/ (status "Draft", content "should be considered beta", last change log 2023-02-10). **Verified.**
  - Body text: minimum Lc 75, preferred Lc 90.
  - Other content text: Lc 60.
  - Large fluent text (above 36px): Lc 45.
  - Large text: maximum Lc 90.

### Status in Oct 2026, stated precisely

- **WCAG 2.2 is the only normative contrast test.**
- WCAG 3.0 Working Draft, 10 Sep 2026 (https://www.w3.org/TR/wcag-3.0/), **verified**:
  - "The contrast algorithm used in WCAG 3 is yet to be determined"; the text requirement reads "@@[contrast measure to be determined]".
  - The draft "assumes the algorithm will include a size/weight factor".
  - "A separate requirement may be needed if red/green color vision deficiency (CVD) is not accounted for."
  - APCA is not named anywhere in the draft.
- Who uses APCA anyway:
  - Apple HIG *Accessibility* names WCAG and APCA as "two popular standards" but publishes WCAG AA values (**verified**, JSON source).
  - Radix Colors states APCA targets for its text steps (§3).

### What each says about choosing lightness steps

- **WCAG 2** cares only about luminance. On white, a grey reaches 3:1 at OKLCH L ≤ 66.9%, 4.5:1 at ≤ 56.8%, and 7:1 at ≤ 46.4% (computed). On Precision's dark surface `#16171a`, the same ratios need L ≥ 50.1%, 59.8% and 71.1%. Chromatic colours sit a few points off these grey values.
- **APCA** is polarity-aware and nonlinear. It asks for more separation in dark mode and for mid-tones than WCAG 2 does.
- **Computed example on Precision's dark tokens:** `accent-text` `#2997ff` on `surface` is WCAG 5.94:1 (passes) but APCA Lc −44 (below the Lc 60 needed for "other content text"). `ink-muted` is WCAG 8.71:1 but Lc −61. That is Somers' "overstates dark colours" claim in concrete form.
- **The blue-button flip (computed).**
  - On `#0a84ff`, WCAG prefers dark text (5.26:1, vs 3.65:1 for white). APCA prefers white (Lc 69, vs Lc 40 for dark).
  - Apple's dark-mode system blue `#0091ff` takes white labels at WCAG 3.23:1, Lc 64.
  - The two standards pick opposite label colours for the same button.

---

## 3. How current systems build palettes, and their stated reasons

### Radix Colors

Source: *Understanding the scale*, https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale. **Verified.**

12 steps, each with one job:

| Steps | Job |
| --- | --- |
| 1–2 | "app backgrounds and subtle component backgrounds" |
| 3 / 4 / 5 | Component background: default / hover / pressed or selected |
| 6 / 7 / 8 | Borders: subtle non-interactive / interactive / strong and focus rings |
| 9 | "the highest chroma of all steps in the scale", mixed with the least white or black |
| 10 | Hover on step 9 |
| 11–12 | Low- and high-contrast text |

- Steps 11 and 12 are guaranteed "Lc 60 and Lc 90 APCA contrast ratio on top of a step 2 background".
- Step 9 takes white text, except Sky, Mint, Lime, Yellow and Amber, which take dark text on steps 9–10. That exception is the gamut cusp from §1 showing up as a rule.
- Custom palette tool (https://www.radix-ui.com/colors/custom, **verified**): the inputs are appearance, **accent, gray, background**.

### Tailwind v4

- *Tailwind CSS v4.0*, 22 Jan 2025, https://tailwindcss.com/blog/tailwindcss-v4. **Verified.**
  - "We've upgraded the entire default color palette from rgb to oklch, taking advantage of the wider gamut to make the colors more vivid in places where we were previously limited by the sRGB color space."
  - They "tried to keep the balance between all the colors the same as it was in v3".
- Source `packages/tailwindcss/theme.css` (GitHub, **verified**) shows what the palette actually does:
  - **Hue drifts along a scale.** Amber runs from hue 95 (50) to 46 (950); yellow from 102 to 54; blue from 254 to 268.
  - **Chroma peaks mid-scale.** Blue-50 has C 0.014, blue-600 has 0.245 and blue-950 has 0.091. Red, amber and green follow the same arch.
  - **Neutrals.** The five greys carry the hue at low chroma:
    - `neutral` has C 0.
    - `zinc` sits at hue about 286 with C ≤ 0.017.
    - `gray` is about 264 with C ≤ 0.034.
    - `slate` is about 257 with C ≤ 0.046.
    - `stone` is warm (hue 49–106) with C ≤ 0.013.

    Chroma is highest at 500–900 and close to 0 at the light end.

### Material 3 dynamic colour

All **verified** in MCU docs and code:

- **From one colour to five palettes.** "Material color schemes start from a source color". The algorithm derives "four additional visually complementary key colors". Each of the five becomes a tonal palette of 13 tones from T0 to T100. A scheme then assigns tones to roles.
- **Palette chroma in the default TonalSpot variant** (2021 spec, `dynamic_scheme.ts`):

  | Palette | Hue | Chroma |
  | --- | --- | --- |
  | Primary | source | 36 |
  | Secondary | source | 16 |
  | Tertiary | source + 60° | 24 |
  | Neutral | source | 6 |
  | Neutral variant | source | 8 |
  | Error | 25 (fixed) | 84 |

  In the 2025 spec, primary is C 32 (26 on phone in dark), and the neutral is C 5 on phone and 10 elsewhere.
- **Role tones** (2021 spec, `color_spec_2021.ts`):

  | Role | Light | Dark |
  | --- | --- | --- |
  | background / surface | 98 | 6 |
  | surfaceContainer, lowest → highest | 100, 96, 94, 92, 90 | 4, 10, 12, 17, 22 |
  | onSurface | 10 | 90 |
  | onSurfaceVariant | 30 | 80 |
  | outline | 50 | 60 |
  | outlineVariant | 80 | 30 |
  | primary | 40 | 80 |
  | primaryContainer | 90 | 30 |

  `ContrastCurve` values move the surface tones when the contrast level rises.
- **Constraints** (`concepts/scheme_generation.md`).
  - Hard constraints: contrast within range, roles within tone ranges, a minimum tone delta between x and xContainer, and "tertiaryContainer should not be disliked".
  - Soft constraints include "The distribution of tones should be even across colors".
  - "if a background color is a mid-tone T50, its highest contrast on-color (white) only reaches a contrast ratio of ~4.5:1". This is why primary sits at T40/T80, never near T50.
- **Contrast levels** (`contrast_for_accessibility.md`):
  - Default guarantees 4.5:1 for all text and icons and 3:1 for required non-text, with 7:1 as a target for higher-emphasis text.
  - Medium contrast adds 3:1 for all non-text.
  - High contrast guarantees 7:1 for text and 4.5:1 for non-text.
- **Dislike analyzer** (`dislike/dislike_analyzer.ts`). It cites Palmer & Schloss 2010 for "universal distaste for dark yellow-greens". A colour with hue 90–111, chroma above 16 and tone below 65 is lifted to T70. A preference study is encoded as a rule.

### Apple HIG

Source: *Color*, https://developer.apple.com/design/human-interface-guidelines/color (JSON source read; change log shows "Updated system color values" on 9 Jun 2025). **Verified.**

- "If you define a custom color, make sure to supply light and dark variants, and an increased contrast option for each variant that provides a significantly higher amount of visual differentiation."
- Each system colour has four values: light, dark, increased-contrast light and increased-contrast dark. Values from the image alt text, with computed figures:

  | Colour | sRGB | OKLCH | WCAG vs white |
  | --- | --- | --- | --- |
  | Blue, light | 0,136,255 | 63.2% 0.202 | 3.52:1 |
  | Blue, dark | 0,145,255 | 65.1% 0.192 | — |
  | Blue, increased contrast, light | 30,110,244 | 57.3% | 4.57:1 |
  | Blue, increased contrast, dark | 92,184,255 | 75.6% 0.135 | 9.76:1 vs black |
  | Red, light / increased contrast | — | — | 3.57 / 4.56:1 |
  | Green, light / increased contrast | — | — | 2.22 / 4.54:1 |

- **Reading.** Apple's *default* colours don't meet 4.5:1 as text on white. The increased-contrast variants are tuned to land just above it, and the dark increased-contrast variant raises lightness and drops chroma. HIG *Accessibility* says this is allowed: "If your app doesn't provide this minimum contrast by default, ensure it at least provides a higher contrast color scheme when the system setting Increase Contrast is turned on." **Verified.**
- HIG *Dark Mode* (**verified**): "these colors aren't necessarily inversions of their light counterparts: while many colors are inverted, some are not". For custom colours, "strive for a contrast ratio of 7:1, especially in small text". The base and elevated background sets are covered in the earlier note.

### Linear, 2024 redesign

Source: *How we redesigned the Linear UI (part Ⅱ)*, 28 Mar 2024, Karri Saarinen with Andreas Eldh and Yann-Edern Gillet, https://linear.app/now/how-we-redesigned-the-linear-ui. **Verified** from the page HTML.

- "we rebuilt the system for generating custom themes in Linear, using the LCH color space instead of HSL. LCH has the benefit that it's perpetually [sic] uniform, meaning a red and a yellow color with lightness 50 will appear roughly equally light".
- "instead of having to define 98 specific variables for each theme, we defined three: base color, accent color, and contrast."
- The contrast variable "allows us to automatically include super high-contrast themes".
- LCH "allowed us to deal with different elevations for our surfaces".
- On neutrals: "return to a more neutral and timeless appearance. The latter was achieved by limiting how much chrome (blue in our case) was used in the calculations applied to our color system." Text and neutral icons were made "darker in light mode and lighter in dark mode".

### Adobe Leonardo

Source: https://github.com/adobe/leonardo and `packages/contrast-colors/README.md`. **Verified.**

- "generating colors by target contrast ratio", "using contrast ratio as the starting point, rather than a post-color-selection auditing process".
- A colour is defined by key colours plus target `ratios` (for example `[3, 4.5]`) against a shared background.
- A `Theme` takes `lightness` (0–100, the background), `contrast` (a multiplier) and `saturation`. Dark mode is "a different lightness value", recommended at 8–11.
- Interpolation can run in LCH and other spaces, "correct[ing] the lightness of the scale based on HSLuv".
- The README names no formula beyond WCAG ratios. Whether it supports APCA is **unverified**.

---

## 4. Neutrals

- **Explicit guidance found (all verified, §3):**
  - Radix: "choose the gray scale which is saturated with the hue closest to your accent hue"; mauve is purple-based, slate blue, sage green, olive lime, sand yellow. The difference is subtle but makes "a more colorful and harmonius vibe". Caution: "be careful when using saturated grays for your app background", especially in dark mode and with many colourful components (https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette).
  - Material's neutral palettes take the **source hue** at chroma 6 (neutral) and 8 (neutral variant) in TonalSpot. Every Material surface is tinted by the user's colour.
  - Linear went the other way in 2024 and limited the blue in its neutrals for a "timeless" look.
  - Tailwind ships tinted and untinted greys side by side, with chroma up to 0.046 (slate) and 0 (`neutral`).
- **Size of the tint.** In the systems above it is 0.003–0.046 OKLCH chroma. That is below or near one JND (0.02) at the light end and visible only at mid-tones. The tint is felt across a whole screen more than seen in any single swatch. That last point is inference, **unverified**.
- **Evidence of benefit.** No study testing tinted against untinted UI neutrals was found.
  - Indirect, classic: Schloss & Palmer, *Aesthetic response to color combinations: preference, harmony, and similarity*, Attention, Perception & Psychophysics 73:551–571, 2011, doi:10.3758/s13414-010-0027-0. Abstract read via Europe PMC, PMC3037488. **Verified (abstract).**
    - "pair preference and harmony both increase as hue similarity increases, but preference relies more strongly on component color preference and lightness contrast".
    - "figural color preference ratings increase as hue contrast with the background increases".
    - **Implication (inference).** Tinting the ground toward the accent's hue raises pair harmony but lowers the accent's figure-against-ground hue contrast. The tint helps the screen cohere and costs the accent a little of its pop. That is a reason to keep the tint small, as all the systems do.
  - Recent counterpart: Forni, Darmon & Benzaquen, *Harmonious Color Pairings: Insights from Human Preference and Natural Hue Statistics*, arXiv:2508.15777, v1 Aug 2025, v3 Jul 2026. **Verified (abstract); preprint, not peer-reviewed.** Preferences are "strongly hue-dependent", which challenges classical harmony rules. The palettes were built "in HSL color space", so by §1, lightness varied with hue and confounds the result. That is our inference; the full methods were not read.
- **Warm vs cool grounds.** There is no primary evidence either way. Tailwind `stone` and Radix `sand`/`olive` exist as options with no stated rationale beyond "vibe". Treat "warm greys feel friendlier" as **folklore**.

---

## 5. Semantic colours (success, warning, danger, info)

- **Lightness, not hue, keeps them apart for CVD.** Crameri, Shephard & Heron, *The misuse of colour in science communication*, Nature Communications 11:5444, 2020, doi:10.1038/s41467-020-19160-7. Full text read via Europe PMC. **Verified.**
  - "Colour maps that include both red and green colours with similar lightness cannot be read by a large fraction of the readership."
  - Estimate: "worldwide 0.5% of women and 8% of men".
  - Non-uniform maps add "artificial boundaries … hiding small-scale variations elsewhere".
  - The paper is about data maps, but the lightness point carries to status colours directly.
- **GitHub Primer, colour-blind themes.** Launched in beta on 19 Apr 2022 (https://github.blog/changelog/2022-04-19-protanopia-deuteranopia-colorblind-themes-beta/, **verified**). The source `primer/primitives`, `src/tokens/functional/color/fgColor.json5`, is **verified**:
  - In the `*-protanopia-deuteranopia` themes, `fgColor.success` is replaced by **blue** (blue.5 light, blue.3 dark) and `fgColor.danger` by **orange**.
  - In `*-tritanopia`, success becomes blue and danger stays red.
  - A source comment explains a custom light high-contrast green: "level 5 fails 7:1 vs bgColor-muted, level 6 is too dark to visually differentiate status colors". Contrast and status distinctness pull against each other, and Primer hand-tunes the compromise.
- **Hue choices per system.**
  - Radix lists "common pairings that work well in Western culture": error = red, ruby, tomato, crimson; success = green, teal, jade, grass, mint; warning = yellow, amber, orange; info = blue, indigo, sky, cyan. **Verified.**
  - Material fixes error at hue 25, chroma 84, independent of the source colour. **Verified.**
  - Apple notes red can mean a positive trend in Chinese Stocks. **Verified**, HIG *Color*.
- **Not competing with the accent.** Material keeps error off the source hue. Precision aliases `info` to the accent (one blue, one meaning; see *Colour means one thing*). No system was found with a stated rule beyond keeping the meanings separate.
- **CVD simulation (computed).** Machado, Oliveira & Fernandes 2009 matrices at severity 1.0, applied to Precision's status tokens; see §9.
  - Chrome DevTools' vision-deficiency emulation is based on the same Machado model, per Chrome's write-up (https://developer.chrome.com/blog/cvd). **Secondary**: confirmed only through the search snippet of a translated version.

---

## 6. Dark mode

- **Re-map lightness; don't invert.**
  - Material: surface T98 ↔ T6 and onSurface T10 ↔ T90, but primary goes T40 → T80 and primaryContainer T90 → T30. The pairs aren't mirror images around T50.
  - Apple: "aren't necessarily inversions".
  - Leonardo: dark mode is a different background lightness, with every colour re-solved for its target ratio.
- **Does chroma go down?**
  - Material 2 said to desaturate primaries (earlier note).
  - In M3, dark primary is T80. Near T80 the gamut is narrower (§1), so chroma drops as a side effect of lightness rather than by rule.
  - Apple's 2025 dark system colours keep roughly the same chroma and get slightly **brighter** (blue L 63.2 → 65.1%, C 0.202 → 0.192). Only the increased-contrast dark variant drops chroma noticeably (0.135).
  - **Rule that follows (inference):** raise lightness for dark mode and let chroma fall to what the gamut allows. Don't desaturate as a separate step.
- **Elevation.** Lighter is higher. Material container tones run T4/T10/T12/T17/T22; Apple has base and elevated sets; Linear generates elevations in LCH.
- **Polarity and readability.** Classic positive-polarity studies (Piepenbrock et al. 2013 onward) were found only through NN/g summaries, which are **secondary**. No 2020+ primary study was found in this pass. Kept off pages.

---

## 7. Empirical work on accent, brand colour and aesthetics (weak; flagged)

- **Colour–emotion meaning is mostly shared.** Jonauskaite et al., *Universal Patterns in Color-Emotion Associations Are Further Shaped by Linguistic and Geographic Proximity*, Psychological Science 31(10):1245–1260, 2020. 4,598 participants in 30 nations; mean cross-nation similarity r = .88, but nation still predicts beyond the universal pattern. **Secondary** (abstract via search; PDF not read). The study used colour *terms*, not rendered UI colours.
- **Colourfulness and first impressions.** Reinecke & Gajos, *Quantifying Visual Preferences Around the World*, CHI 2014. 2.4M ratings from about 40k people: women liked colourful sites more than men, higher education lowered the preference, and countries differed. **Secondary** (abstract via search). Classic; no 2020+ replication was read.
- **Blue vs red on a website.** Nissen & Riedl, NeuroIS pilot, 2021: colour (blue vs red) "significantly influences pleasure, arousal, and use intentions", and button shape doesn't. **Secondary**, a small pilot. Too weak for a page.
- **Disliked colours.** Palmer & Schloss 2010 (PNAS, ecological valence) is known here only as cited in Material's source. **Secondary.** Material's T70 lift for dark yellow-green is the only place found where a preference finding drives a production palette.
- **Harmony.** See §4: Schloss & Palmer 2011 (abstract verified) and Forni et al. 2025 (preprint, abstract verified). They disagree on whether similar or contrasting hues are preferred. That supports keeping hue choices few and letting lightness do the work, not a harmony formula.
- **Bottom line.** No 2018+ peer-reviewed study was found that ties a specific accent or brand hue to measured usability. Pages should argue from perception and contrast mechanisms, not from "blue builds trust".

---

## 8. Synthesis for the playbook

### Counterintuitive mechanisms worth a principle page

1. **Pick lightness first; hue is the label.**
   - Contrast and legibility depend on luminance, not hue (WCAG Understanding 1.4.3; MCU "tone determines control contrast").
   - HSL's lightness is a channel average, and `hsl(h 100% 50%)` spans OKLCH L 45–97% and 1.07–8.59:1 against white.
   - The systems that work set lightness per role and then pour hue in: Material (tones by role), Radix (steps 11/12 at Lc 60/90), Leonardo (target ratios as input).
   - Numbers: ΔL\* 40 → ≥3.17:1; ΔL\* 50 → ≥4.48:1, so use 51; on white, a grey needs OKLCH L ≤ 56.8% for 4.5:1.
2. **A scale can't hold one hue or one chroma.**
   - The sRGB gamut has a cusp at a different lightness per hue. At L 95% blue holds C 0.024 and yellow 0.107; at L 45% yellow holds only 0.094.
   - A fixed-hue scale turns dark yellow olive, which Material's dislike rule then lifts to T70. A fixed-chroma scale clips.
   - Tailwind v4's own palette bends hue (amber 95° → 46°) and arches chroma (blue 0.014 → 0.245 → 0.091).
   - Radix's step 9 takes dark text on yellow, amber, lime, mint and sky because their cusp is high.
3. **Neutrals carry the hue, at a chroma you can barely see.**
   - Material tints every surface with the source hue at chroma 6–8. Radix pairs the grey to the accent hue. Tailwind's greys run up to C 0.046.
   - Linear's redesign made the UI read as "neutral and timeless" by *removing* blue from the neutrals.
   - The tint is a global setting with a cost: a matched hue raises harmony, but the figure's preference rises with hue contrast against its ground (Schloss & Palmer 2011, abstract).
4. **A theme is three inputs.**
   - Linear: from 98 variables per theme to base, accent and contrast. Leonardo: background lightness, contrast multiplier and saturation. Radix custom: accent, gray and background. Material: one source colour plus a contrast level.
   - Making contrast an input means the high-contrast theme Apple asks for comes free.
   - In CSS this is now native: `oklch(from var(--accent) …)` and `color-mix()` default to Oklab (CSS Color 5 WD).
5. **Status colours are told apart by lightness, not hue.**
   - Red and green "with similar lightness cannot be read" by about 8% of men (Crameri 2020).
   - GitHub's colour-blind themes swap success to blue and danger to orange.
   - In Precision's light theme, danger, warning and success all sit at OKLCH L 52–53%. Under simulated deuteranopia, danger vs warning is ΔEOK 0.004, a fifth of one JND (§9).

A strong sixth candidate: **dark mode is a re-mapping, not an inversion, and the two contrast standards disagree there.** The same blue button takes a dark label under WCAG and a white label under APCA (§2).

### Concrete rules with values

- **Space.** Author scales in OKLCH; never derive steps by HSL lightness. Gamut-map by reducing chroma at constant L and h, which is what CSS Color 4 §14 does.
- **Lightness targets per role.** WCAG 2 governs; APCA is shown alongside as advisory.

  | Role | WCAG target | OKLCH L on white | OKLCH L on dark `#16171a` | APCA |
  | --- | --- | --- | --- | --- |
  | Body text | 4.5:1 | ≤ 56% | ≥ 60% | aim Lc ≥ 75 |
  | Secondary text | 4.5:1 | ≤ 56% | ≥ 60% | Lc 60 is the APCA floor for "other content text" |
  | Control borders, focus, icons that carry state | 3:1 | ≤ 66% | ≥ 50% | — |
  | Decorative lines | none | — | — | — |

  These are grey values; check chromatic colours individually.
- **Fills with a label on them.** Keep the fill's lightness away from the middle: L\* ≤ 45 for white labels or ≥ 75 for dark labels. Material uses T40/T80 because T50 caps white at about 4.5:1.
- **Step counts.**
  - About 12 steps per scale with fixed jobs (Radix); Material uses 13 tones per palette.
  - In the light theme, surfaces sit in the top 10% of lightness: Material T90–100, Precision L\* 91–100.
  - In the dark theme they sit in L\* 4–22, with elevation by +4 to +5 L\* per level.
- **Chroma.**
  - Neutrals: 0–0.02 OKLCH at the ends, up to about 0.045 mid-scale (Tailwind range); Material uses HCT C 5–10.
  - Accent: as high as the gamut allows at its lightness. Check P3 headroom (blue at L 55%: sRGB 0.188, P3 0.240).
  - Large tints, such as selection, soft status backgrounds and accent-soft, need far lower chroma (Radix steps 3–5).
- **Status hues.**
  - Separate at least one pair by lightness, not only hue.
  - Make sure every pair keeps ΔEOK ≥ 0.02 under deutan and protan simulation.
  - Offer the Primer swap (success → blue, danger → orange) if a colour-blind theme is ever added.
  - Keep error's hue off the accent's.
- **Dark theme.** Re-solve each role for its contrast target. Raise accent lightness and let chroma follow the gamut. Supply an increased-contrast variant per theme (Apple).

### Demo ideas

1. **HSL vs OKLCH, the same nominal lightness (Before/After).**
   - Eight status-like chips, each with a label, at `hsl(h 100% 50%)` vs `oklch(65% 0.15 h)`.
   - A greyscale toggle shows the HSL row breaking into light and dark blobs while the OKLCH row stays one grey.
   - Each chip shows its live contrast against white.
2. **One input, whole theme (Tweak).**
   - Three controls: accent hue, neutral tint (0 → match accent), contrast.
   - They regenerate the playbook's own token set with relative colour syntax, rendered on a small real screen (a Post list row, a button, a badge, a toast) in light and dark side by side.
   - Live counters show how many text/surface pairs pass 4.5:1 and 3:1. Moving contrast to "high" produces the increased-contrast theme.
3. **Status colours under deuteranopia (Before/After).**
   - Precision's current light danger, warning and success badges vs a version with the same hues and spread lightness.
   - A CVD toggle uses an SVG `feColorMatrix` with the Machado matrices. The Before pair visibly merges; the After stays apart.
4. **The blue button in two standards (Tweak).**
   - One accent fill in dark mode with a lightness slider. The label flips between white and dark.
   - The WCAG and APCA verdicts are shown side by side. Around L 60–65%, the two standards choose opposite labels.

### Audit: Precision tokens (`src/tokens/precision.json` → `src/styles/tokens.css`)

All values are computed here.

**What holds**

- **Neutrals.** One hue family (about 286°, zinc-like; `ink` `#18181b` equals Tailwind zinc-900), chroma 0.001–0.015. Light and dark use the same family.
- **Text contrast.**
  - `ink` on `surface`: 17.7:1 light, 15.2:1 dark.
  - `ink-muted`: 6.42:1 on `surface`, 5.59:1 on `surface-sunken` and ≥ 5.3:1 on hover and active fills (light); 8.71:1 (dark).
- **Non-text contrast.** `line-strong` is 3.60:1 light and 3.49:1 dark, which passes 1.4.11 for control borders. `line` is 1.27:1 and labelled decorative, which is correct.
- **Status text.** Every status colour passes 4.5:1 on `surface` and on its own soft tint in both themes (lowest: `success` on `success-soft` light, 4.69:1).
- **Accent.** One blue; `info` aliases it. White on light `accent` is 4.70:1.
- **Dark surfaces.** `bg`, `surface` and `surface-raised` are L\* 4 / 8 / 12, close to Material's dark containers T4 / T10 / T12. Not pure black; raised layers get lighter.
- **Accent lightness in dark.** The accent gets lighter in dark (L 56.3 → 62.4%), the same direction as Material T40 → T80 and Apple's system blue.

**What doesn't, or is at risk**

1. **Light status colours share one lightness.** `danger`, `success` and `warning` are OKLCH L 52.9 / 51.6 / 53.1% (L\* 43–45), differing by hue alone.
   - Under deuteranopia simulation, danger vs warning is ΔEOK **0.004** (JND 0.02); danger vs success 0.099; under protanopia, danger vs warning is 0.052.
   - Words and icons mitigate this on pages (WCAG 1.4.1), but the tokens themselves aren't separable.
   - The dark theme spreads a little: warning L 80.4% vs danger 75.5%.
2. **The dark on-accent label.** `on-accent` `#0e0f11` on `#0a84ff` passes WCAG (5.26:1) but is APCA Lc 40, below the Lc 60 needed even for "other content text". White would be WCAG 3.65:1 (fails) but Lc 69. The accent sits at L\* 56, the mid-tone dead zone Material avoids by using T80 with a dark label or T40 with a white one.
   - **Owner decision:** either lighten the dark accent toward L\* about 75 and keep dark labels, or darken it toward L\* about 45 and use white.
3. **Dark text that passes WCAG but not APCA.** `accent-text` `#2997ff` is 5.94:1 but Lc −44; `ink-muted` is 8.71:1 but Lc −61. Both pass WCAG; by APCA, `accent-text` is too weak for body-size links. Advisory only, since APCA isn't normative.
4. **The light accent as text on `bg`.** `accent` `#0071e3` on `bg` `#f7f7f8` is 4.39:1, which fails 4.5:1 as text. `accent-text` exists for that job, but `src/demos/post/Sending.module.scss:13` uses `color: var(--accent)`. Check what it sits on.
5. **No increased-contrast variants.** Apple asks for them for every custom colour; there is no `prefers-contrast: more` set.
6. **Neutral hue isn't the accent's hue.** Neutrals sit at about 286° (violet-leaning zinc) while the accent is 256°. Under Radix's rule the matching grey would be slate-like. The chroma is so low that the difference is subtle. This is a choice to record, not a defect.
7. **Gamut.** All values are sRGB hex. The accent (C 0.193 at L 56%) sits on the sRGB edge; P3 allows about 0.24. This is optional headroom, as Tailwind v4 uses it.
8. **Hand-authored hex.** The theme can't be regenerated from inputs, and there is no contrast input. Re-expressing the tokens as OKLCH derived from about 3 inputs would make the demo-2 idea the playbook's own system.

`ink-disabled` (2.36:1 / 2.07:1) is below 4.5:1. That is allowed under WCAG 1.4.3's exception for inactive components (spec text known, not re-read this session).

### Folklore vs evidence

| Claim | Status |
| --- | --- |
| HSL lightness equals perceived lightness | **False.** CSS Color 4 §7; computed spread of 45–97% |
| OKLCH is perceptually uniform | **Mostly.** Fitted to CAM16-generated data, not a new human study (Ottosson's own caveat); hue error is not the best of all spaces tested |
| Same OKLCH L means same contrast | **Approximately, for greys only.** Chromatic colours drift a few points |
| Contrast is about hue | **False.** WCAG Understanding 1.4.3: hue "is not a key factor" |
| APCA is the WCAG 3 contrast method | **False as of the 10 Sep 2026 WD.** The algorithm is "yet to be determined"; APCA is still beta |
| WCAG 2 is wrong in dark mode | **Argued by the APCA author** (issue #695, open), with a consistent computed pattern; no independent validation read |
| Dark mode means desaturate | **Partly.** M2 said so; M3 and Apple raise lightness and let chroma fall with the gamut |
| Never use pure black in dark mode | **Guidance** (M2 `#121212`, M3 T6); no outcome study read |
| Tint greys with the brand hue | **Common guidance** (Radix, Material, Tailwind); Linear did the opposite on purpose; no outcome study |
| Warm greys feel friendlier | **Folklore.** No source found |
| Blue builds trust; brand hue drives usability | **Folklore for UI.** Colour–emotion links are shared across 30 nations (Jonauskaite 2020, secondary), but no UI usability evidence was found |
| Harmony rules (complementary, analogous …) | **Contested.** Schloss & Palmer 2011 vs Forni et al. 2025 preprint |
| 60-30-10 rule | **No primary source located** in this pass |

---

## Sources not verified, kept off pages

- Google, *The Science of Color & Design* (2022): the page is client-rendered and was not read; HCT claims come from the MCU repo instead.
- Leonardo APCA support: not stated in the README.
- Chrome DevTools using the Machado matrices: translated snippet only.
- Jonauskaite 2020, Reinecke & Gajos 2014, Nissen & Riedl 2021, Palmer & Schloss 2010: abstracts or snippets only.
- Positive-polarity reading studies: NN/g summaries only.
- Bezold–Brücke and Helmholtz–Kohlrausch effects as the cause of hue drift or of chromatic colours looking lighter: textbook, not read here.
- Ou et al. 2018, *Universal models of colour emotion and colour harmony* (Color Res. Appl. 43:736–748, doi:10.1002/col.22243): metadata only, no abstract.
