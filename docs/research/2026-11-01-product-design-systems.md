# What products publish about their design systems

Research date: 2026-11-01. Scope: official publications, not inferred product styling. Repository citations pin a commit or tag; live documentation is a dated observation. Evidence comes from written documentation and published token/component sources. Screenshots, computed styles and deployed CSS bundles were not used. Component behaviour was not measured.

The [companion JSON](2026-11-01-product-design-systems.json) is an array in the requested product order. Each evidence record has `value` and `source`; that source covers the entire scalar, scale, table or recipe inside `value`. `additional_sources` establish alias mappings or licences where more than one file is needed. `note` is research context, not another token. Product identifiers, gap paths and research classifications are metadata. Nulls mean **not verified in the sources opened**, not proof that a product never publishes the field. Blank table cells below correspond to nulls. No gap is filled by a similar product.

“Full system published” describes the publication, not a clean bill for shipping a named look. Values may be platform-specific, generated, example-only, or licensed for a restricted use. A foreground status colour is not interchangeable with a background colour; the role is identified beside each selection.

Sizes and targets already covered for Apple, M3, Fluent and Primer remain linked to [the earlier numbers research](2026-10-29-design-system-numbers.md). A reference-only field is deliberate, not a missing scale. Newly observed package/documentation differences are identified below.

## Summary

| Product | Status | Colour | Type | Shape and space | Elevation | Motion | Icons | Reuse terms |
|---|---|---|---|---|---|---|---|---|
| Apple — iOS and macOS | partial | system RGB; iOS greys | native styles + restricted SF | geometry; targets ref | adaptive materials | guidance | restricted SF Symbols | font/brand restrictions |
| Linear | partial | brand swatches; LCH approach | Inter families + OFL | — | — | — | — | font/brand restrictions |
| Claude / Anthropic | brand only | brand only | Poppins/Lora + fallbacks | — | — | — | — | Apache-2.0; separate brand rights |
| Vercel — Geist | partial | roles; raw values unverified | fonts + classes; metrics gaps | material radii | material model | guidance | set; licence gap | font/brand restrictions |
| GitHub — Primer | full system published | light/dark + all status roles | stack + styles ref | scales/targets ref | light/dark shadows | durations + curves | Octicons / MIT | MIT; separate font/brand rights |
| Google — Material Design 3 | full system published | baseline; no success/warning/info | Roboto + styles ref | radii/targets ref; spacing gap | levels | durations + curves | Material / Apache-2.0 | Apache-2.0; separate brand rights |
| Microsoft — Fluent 2 | full system published | light/dark + component info | stack + styles ref | package radii; sizes ref | light/dark shadows | durations + curves | Fluent / MIT | MIT; separate font/brand rights |
| Stripe | partial | semantic names | style names | numeric spacing | — | — | component; licence gap | font/brand restrictions |
| Notion | partial | content enums | style labels | — | — | — | content options | not verified |
| Raycast | partial | dynamic API names | — | — | — | — | API; licence gap | not verified |
| Atlassian Design System | full system published | pinned light/dark + statuses | package styles; font-licence gaps | package radii; spacing | light/dark shadows | package durations + curves | ADS; package licence unverified | Apache-2.0 tokens; separate ADS assets |
| Ant Design 5 | full system published | light values; dark recipe | stack + numeric styles | numeric scales | shadow values | durations + curves | Ant icons / MIT | MIT; separate font/brand rights |
| TDesign — Tencent | full system published | light/dark + all status roles | stack + numeric styles | numeric scales | light/dark shadows | durations + curves | TDesign icons / MIT | MIT; separate font/brand rights |
| Arco Design — ByteDance | full system published | light/dark + all status roles | stack + numeric styles | numeric scales | shadow values | durations + curves | Arco icons / MIT | MIT; separate font/brand rights |

**Whole-look assessment.** Primer, Fluent 2, TDesign and Arco have published evidence in all five requested dimensions: colour, type, radius, shadow and motion. They are the strongest technical candidates in this audit. Their exact font choices still matter: OFL fonts can be supplied under that licence; proprietary/local fallbacks are not a font-file redistribution grant. Atlassian’s pinned token package also covers all five dimensions and is Apache-2.0, but its named custom-font licences remain unresolved. The per-font gaps below must survive into any implementation brief.

Material 3 publishes all five core dimensions but has no baseline success/warning/info roles in the audited tokens. Ant Design 5 publishes a complete generation recipe, but the exact dark literal palette is not verified here. Apple, Linear, Anthropic, Vercel, Stripe, Notion and Raycast cannot supply a complete fixed web look from the evidence collected. These are research judgments based on the product sections, not claims of endorsement.

## 1. Apple — iOS and macOS

**Status: partial.** HIG publishes native colour and typography specifications, adaptive materials and qualitative shape/motion guidance; it is not a complete fixed web token set. [S1][S1]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp | `systemGray`: R-142,G-142,B-147<br>`systemGray2`: R-174,G-174,B-178<br>`systemGray3`: R-199,G-199,B-204<br>`systemGray4`: R-209,G-209,B-214<br>`systemGray5`: R-229,G-229,B-234<br>`systemGray6`: R-242,G-242,B-247<br>iOS/iPadOS UIKit systemGray, default contrast only. These are written RGB values in official image alternative text, not sampled pixels. macOS has semantic dynamic colours instead. | `systemGray`: R-142,G-142,B-147<br>`systemGray2`: R-99,G-99,B-102<br>`systemGray3`: R-72,G-72,B-74<br>`systemGray4`: R-58,G-58,B-60<br>`systemGray5`: R-44,G-44,B-46<br>`systemGray6`: R-28,G-28,B-30<br>iOS/iPadOS UIKit systemGray, default contrast only. These are written RGB values in official image alternative text, not sampled pixels. macOS has semantic dynamic colours instead. | [S2][S2], [S1][S1] |
| accent | R-0,G-136,B-255<br>Published system blue reference; not a promise of the current user-selected macOS accent. | R-0,G-145,B-255<br>Published system blue reference; not a promise of the current user-selected macOS accent. | [S2][S2], [S1][S1] |
| success |  |  |  |
| warning |  |  |  |
| danger |  |  |  |
| info |  |  |  |

| Additional publication | Value / scope | Sources |
|---|---|---|
| light.system_palette | `red`: R-255,G-56,B-60<br>`orange`: R-255,G-141,B-40<br>`yellow`: R-255,G-204,B-0<br>`green`: R-52,G-199,B-89<br>`mint`: R-0,G-200,B-179<br>`teal`: R-0,G-195,B-208<br>`cyan`: R-0,G-192,B-232<br>`blue`: R-0,G-136,B-255<br>`indigo`: R-97,G-85,B-245<br>`purple`: R-203,G-48,B-224<br>`pink`: R-255,G-45,B-85<br>`brown`: R-172,G-127,B-94<br>System colour names are not a published success/warning/danger/info mapping. | [S2][S2], [S1][S1] |
| dark.system_palette | `red`: R-255,G-66,B-69<br>`orange`: R-255,G-146,B-48<br>`yellow`: R-255,G-214,B-0<br>`green`: R-48,G-209,B-88<br>`mint`: R-0,G-218,B-195<br>`teal`: R-0,G-210,B-224<br>`cyan`: R-60,G-211,B-254<br>`blue`: R-0,G-145,B-255<br>`indigo`: R-109,G-124,B-255<br>`purple`: R-219,G-52,B-242<br>`pink`: R-255,G-55,B-95<br>`brown`: R-183,G-138,B-102<br>System colour names are not a published success/warning/danger/info mapping. | [S2][S2], [S1][S1] |
| macos_neutral_ramp |  |  |
| macos_semantics | windowBackgroundColor; controlBackgroundColor; underPageBackgroundColor; alternatingContentBackgroundColors; selectedContentBackgroundColor; controlAccentColor<br>Dynamic AppKit roles; macOS accent can be replaced by the user. No fixed numeric palette is asserted. | [S1][S1] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces | SF Pro | [S3][S3] |
| fallback |  |  |
| text styles | iOS Dynamic Type styles and macOS built-in text styles: see sections 1 and 2 of the existing numbers report and the HIG Specifications tables, including default/emphasized weights. [Existing numbers report](2026-10-29-design-system-numbers.md#1-apple-hig-ios--ipados-consumer-reference).<br>Reference only: sizes/targets already researched; do not duplicate or silently reconcile that report here. | [S3][S3] |
| weights | Regular; Medium; Semibold; Bold<br>HIG legibility recommendation, not a replacement for per-style weights in Specifications. | [S3][S3] |

**Font licences.**

| Typeface / selector | Web licence | Source |
|---|---|---|
| SF Pro | Apple restricted font licence: the downloadable font is for Apple-platform UI mockups; no embedding or general website-content use is granted. Do not ship the downloaded font as a webfont. Native system-font APIs are described separately in HIG. | [S4][S4] |

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps |  |  |
| shape and space.spacing scale |  |  |
| shape and space.control heights | See prior report for control/hit-target guidance and its unresolved general-button versus macOS-target distinction. These are not a macOS push-button height scale. [Existing numbers report](2026-10-29-design-system-numbers.md#2-apple-hig-macos-work-tool-reference).<br>Reference only: sizes/targets already researched; do not duplicate or silently reconcile that report here. | [S5][S5] |
| shape and space.macos push button heights |  |  |
| shape and space.corner guidance | Fixed shapes keep a constant radius; capsules use half the container height; concentric shapes subtract padding from the parent radius. macOS Mini/Small/Medium retain rounded rectangles; Large and X-Large use capsules.<br>Published geometry guidance, not a numeric radius scale. | [S6][S6] |
| elevation | `Liquid Glass`: regular; clear<br>`iOS content-layer materials`: ultra-thin; thin; regular (default); thick<br>`macOS`: Use standard materials by semantic purpose; appearance responds to context.<br>Adaptive material model; no blur radii, fixed shadow values or web recipe were confirmed. | [S7][S7] |
| motion.durations |  |  |
| motion.easing curves |  |  |
| motion.guidance | Use purposeful, brief feedback; avoid adding custom motion to frequent interactions; allow cancellation; respect accessibility settings and provide alternatives. | [S8][S8] |
| icons.set | SF Symbols | [S9][S9] |
| icons.licence | Restricted Apple symbols: not for app icons, logos or trademark use; certain Apple product/feature symbols may not be customized. General web redistribution rights were not verified. | [S9][S9] |
| terms | The downloadable SF font licence restricts embedding and website-content use; SF Symbols have separate restrictions. No reusable HIG-token or Apple-name licence was established. | [S4][S4], [S9][S9] |

**Gaps.**

- `colour.light.success`, `colour.light.warning`, `colour.light.danger`, `colour.light.info`, `colour.dark.success`, `colour.dark.warning`, `colour.dark.danger`, `colour.dark.info`, `colour.macos_neutral_ramp`: HIG publishes named system colours but no four-way semantic status mapping; iOS UIKit greys are not a macOS neutral ramp.
- `type.fallback`: No web fallback stack published in the opened HIG/font sources.
- `shape_and_space.radius_steps`: Published geometry is adaptive; no numeric radius scale found.
- `shape_and_space.spacing_scale`: No general spacing scale found in opened HIG.
- `shape_and_space.macos_push_button_heights`: Control target sizes are not a macOS push-button height scale.
- `motion.durations`, `motion.easing_curves`: No general duration/easing token scale in the opened HIG motion page.

## 2. Linear

**Status: partial.** An engineering/design account explains LCH theme generation; brand guidelines publish a small brand palette. No complete UI token package was verified. [S10][S10]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp |  |  |  |
| accent |  |  |  |
| success |  |  |  |
| warning |  |  |  |
| danger |  |  |  |
| info |  |  |  |

| Additional publication | Value / scope | Sources |
|---|---|---|
| brand_palette | `Mercury White`: #F4F5F8<br>`Nordic Gray (hex as printed)`: #222326<br>`Nordic Gray (RGB as printed)`: 35, 35, 38<br>The Nordic Gray hex and RGB disagree. Preserve both as published; do not repair or promote either to a theme default. | [S11][S11] |
| generation | LCH theme generation uses base colour, accent colour and contrast; the article does not publish the numeric inputs or a complete generator. | [S10][S10] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces | `headings`: Inter Display<br>`body`: Inter | [S10][S10] |
| fallback |  |  |
| text styles |  |  |
| weights |  |  |

**Font licences.**

| Typeface / selector | Web licence | Source |
|---|---|---|
| Inter Display, Inter | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S12][S12] |

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps |  |  |
| shape and space.spacing scale |  |  |
| shape and space.control heights |  |  |
| elevation |  |  |
| motion.durations |  |  |
| motion.easing curves |  |  |
| icons.set |  |  |
| icons.licence |  |  |
| terms | Linear marks are proprietary. Follow supplied assets; do not alter them, imply a relationship, combine them with another identity or use them as your own product name without permission. | [S11][S11] |

**Gaps.**

- `colour.light.neutral_ramp`, `colour.light.accent`, `colour.light.success`, `colour.light.warning`, `colour.light.danger`, `colour.light.info`, `colour.dark.neutral_ramp`, `colour.dark.accent`, `colour.dark.success`, `colour.dark.warning`, `colour.dark.danger`, `colour.dark.info`: No complete mode-specific numeric UI palette; brand swatches and LCH approach alone do not supply it.
- `type.fallback`, `type.text_styles`, `type.weights`: Exact fallback stack, size/weight/leading styles were not published in the opened article/brand page.
- `shape_and_space.radius_steps`, `shape_and_space.spacing_scale`, `shape_and_space.control_heights`: No radius/spacing/control-height scale found in the opened official sources.
- `elevation`: No shadow/elevation token values found.
- `motion.durations`, `motion.easing_curves`: No durations/easing scale found.
- `icons.set`, `icons.licence`: No reusable official icon set/licence confirmed.

## 3. Claude / Anthropic

**Status: brand only.** Anthropic publishes a brand-guidelines skill. It specifies Anthropic branding, not a complete Claude application theme. [S13][S13]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp |  |  |  |
| accent |  |  |  |
| success |  |  |  |
| warning |  |  |  |
| danger |  |  |  |
| info |  |  |  |

| Additional publication | Value / scope | Sources |
|---|---|---|
| brand_palette | `dark`: #141413<br>`light`: #faf9f5<br>`mid-gray`: #b0aea5<br>`light-gray`: #e8e6dc<br>`orange`: #d97757<br>`blue`: #6a9bcc<br>`green`: #788c5d<br>Orange is the primary accent; these names do not establish mode-specific UI or status tokens. | [S13][S13] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces | `headings`: Poppins<br>`body`: Lora | [S13][S13] |
| fallback | `Poppins`: Arial<br>`Lora`: Georgia | [S13][S13] |
| text styles |  |  |
| weights |  |  |
| heading guidance | Poppins for headings at 24pt and larger; Lora for body text.<br>A usage threshold, not a complete text-style scale. | [S13][S13] |

**Font licences.**

| Typeface / selector | Web licence | Source |
|---|---|---|
| Poppins | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S14][S14] |
| Lora | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S15][S15] |
| Arial, Georgia | Installed-font CSS use permitted; the Windows font licence does not permit copying fonts to a web server or converting them to WOFF. Separate webfont rights would be needed for self-hosting. | [S16][S16] |

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps |  |  |
| shape and space.spacing scale |  |  |
| shape and space.control heights |  |  |
| elevation |  |  |
| motion.durations |  |  |
| motion.easing curves |  |  |
| icons.set |  |  |
| icons.licence |  |  |
| terms | Apache-2.0: retain licence and applicable notices, identify modifications; no general trademark permission.<br>The skill licence does not establish rights to Claude/Anthropic marks or proprietary application assets. | [S17][S17] |

**Gaps.**

- `colour.light.neutral_ramp`, `colour.light.accent`, `colour.light.success`, `colour.light.warning`, `colour.light.danger`, `colour.light.info`, `colour.dark.neutral_ramp`, `colour.dark.accent`, `colour.dark.success`, `colour.dark.warning`, `colour.dark.danger`, `colour.dark.info`: Brand palette has no mode-specific neutral ramp or semantic status roles.
- `type.text_styles`, `type.weights`: The brand skill does not define full text-style sizes, weights or line heights.
- `shape_and_space.radius_steps`, `shape_and_space.spacing_scale`, `shape_and_space.control_heights`, `elevation`, `motion.durations`, `motion.easing_curves`: Not supplied by the brand-guidelines skill.
- `icons.set`, `icons.licence`: No icon system/licence found in the opened brand skill.

## 4. Vercel — Geist

**Status: partial.** Public design-system pages cover colour roles, typography classes, materials and icons; the font repository publishes usable fonts. Raw colour/shadow and full typography metrics were not exposed by the readable pages in this audit. [S18][S18]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp |  |  |  |
| accent |  |  |  |
| success |  |  |  |
| warning |  |  |  |
| danger |  |  |  |
| info |  |  |  |

| Additional publication | Value / scope | Sources |
|---|---|---|
| published_roles | Ten colour steps per scale; roles distinguish component backgrounds, borders, high-contrast backgrounds and text/icons. The page offers copying raw values and supports P3. No values were read from swatches or CSS. | [S19][S19] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces | Geist Sans; Geist Mono | [S20][S20] |
| fallback |  |  |
| text styles |  |  |
| weights |  |  |
| published classes | `heading`: text-heading-72; text-heading-64; text-heading-56; text-heading-48; text-heading-40; text-heading-32; text-heading-24; text-heading-20; text-heading-16; text-heading-14<br>`button`: text-button-16; text-button-14; text-button-12<br>`label`: text-label-20; text-label-18; text-label-16; text-label-14; text-label-13; text-label-12<br>`copy`: text-copy-24; text-copy-20; text-copy-18; text-copy-16; text-copy-14; text-copy-13<br>Class names as documented, not inferred CSS size/weight/leading values. | [S21][S21] |

**Font licences.**

| Typeface / selector | Web licence | Source |
|---|---|---|
| Geist Sans, Geist Mono | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S22][S22] |

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps | `surface-base`: 6px<br>`surface-small`: 6px<br>`surface-medium`: 12px<br>`surface-large`: 12px<br>`floating-tooltip`: 6px<br>`floating-menu`: 12px<br>`floating-modal`: 12px<br>`floating-fullscreen`: 16px<br>Material-specific radii; no claim of a universal radius token scale. | [S23][S23] |
| shape and space.spacing scale |  |  |
| shape and space.control heights |  |  |
| elevation | `surface`: base; small; medium; large<br>`floating`: tooltip; menu; modal; fullscreen<br>Published layer/material model; literal shadow values not verified. | [S23][S23] |
| motion.durations |  |  |
| motion.easing curves |  |  |
| motion.guidance | Respect reduced motion, prefer transform/opacity, make animations interruptible and connect them to meaningful interaction.<br>Guidance does not provide a complete Geist duration/easing scale. | [S24][S24] |
| icons.set | Geist icons | [S25][S25] |
| icons.licence |  |  |
| terms | Use Vercel marks without alteration and without implying sponsorship or endorsement; the font OFL licence is separate from the UI and brand assets. | [S26][S26], [S22][S22] |

**Gaps.**

- `colour.light.neutral_ramp`, `colour.light.accent`, `colour.light.success`, `colour.light.warning`, `colour.light.danger`, `colour.light.info`, `colour.dark.neutral_ramp`, `colour.dark.accent`, `colour.dark.success`, `colour.dark.warning`, `colour.dark.danger`, `colour.dark.info`: Raw light/dark colour values could not be read from the public page; copy interaction unavailable. No swatch or CSS sampling used.
- `type.fallback`, `type.text_styles`, `type.weights`: Readable typography page exposes classes, not a complete numeric size/leading/weight table or fallback stack.
- `shape_and_space.spacing_scale`, `shape_and_space.control_heights`: No numeric spacing or control-height scale confirmed in the opened pages.
- `motion.durations`, `motion.easing_curves`: Motion guidance supplies no complete duration/easing token scale.
- `icons.licence`: A standalone Geist icon licence was not confirmed.

## 5. GitHub — Primer

**Status: full system published.** Primer publishes base and semantic tokens, theme overrides, type stacks, shadows and motion in its own primitives repository. [S27][S27]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp | `base.color.neutral.0`: #ffffff<br>`base.color.neutral.1`: #F6F8FA<br>`base.color.neutral.2`: #EFF2F5<br>`base.color.neutral.3`: #E6EAEF<br>`base.color.neutral.4`: #E0E6EB<br>`base.color.neutral.5`: #DAE0E7<br>`base.color.neutral.6`: #D1D9E0<br>`base.color.neutral.7`: #C8D1DA<br>`base.color.neutral.8`: #818B98<br>`base.color.neutral.9`: #59636E<br>`base.color.neutral.10`: #454C54<br>`base.color.neutral.11`: #393F46<br>`base.color.neutral.12`: #25292E<br>`base.color.neutral.13`: #1f2328 | `base.color.neutral.0`: #010409<br>`base.color.neutral.1`: #0D1117<br>`base.color.neutral.2`: #151B23<br>`base.color.neutral.3`: #212830<br>`base.color.neutral.4`: #262C36<br>`base.color.neutral.5`: #2A313C<br>`base.color.neutral.6`: #2F3742<br>`base.color.neutral.7`: #3D444D<br>`base.color.neutral.8`: #656C76<br>`base.color.neutral.9`: #9198A1<br>`base.color.neutral.10`: #B7BDC8<br>`base.color.neutral.11`: #D1D7E0<br>`base.color.neutral.12`: #F0F6FC<br>`base.color.neutral.13`: #ffffff | [S28][S28], [S29][S29] |
| accent | #0969da<br>fgColor.accent; foreground colour. Theme aliases resolved without colour conversion. | #4493F8<br>fgColor.accent; foreground colour. Theme aliases resolved without colour conversion. | [S27][S27], [S28][S28], [S27][S27], [S29][S29] |
| success | #1a7f37<br>fgColor.success; foreground colour. Theme aliases resolved without colour conversion. | #3fb950<br>fgColor.success; foreground colour. Theme aliases resolved without colour conversion. | [S27][S27], [S28][S28], [S27][S27], [S29][S29] |
| warning | #9a6700<br>fgColor.attention; foreground colour. Theme aliases resolved without colour conversion. | #d29922<br>fgColor.attention; foreground colour. Theme aliases resolved without colour conversion. | [S27][S27], [S28][S28], [S27][S27], [S29][S29] |
| danger | #d1242f<br>fgColor.danger; foreground colour. Theme aliases resolved without colour conversion. | #f85149<br>fgColor.danger; foreground colour. Theme aliases resolved without colour conversion. | [S27][S27], [S28][S28], [S27][S27], [S29][S29] |
| info | #0969da<br>fgColor.accent; foreground colour. The token metadata explicitly lists info-text usage. | #4493F8<br>fgColor.accent; foreground colour. The token metadata explicitly lists info-text usage. | [S27][S27], [S28][S28], [S27][S27], [S29][S29] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces | Mona Sans VF first in system/sansSerif/sansSerifDisplay; monospace uses installed fonts. | [S30][S30] |
| fallback | `fontStack.system`: 'Mona Sans VF', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Backtick Fix', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'<br>`fontStack.sansSerif`: 'Mona Sans VF', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Backtick Fix', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'<br>`fontStack.sansSerifDisplay`: 'Mona Sans VF', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Backtick Fix', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'<br>`fontStack.monospace`: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace | [S30][S30] |
| text styles | See existing numbers report for body/caption sizes and the line-height discrepancy. The linked source also defines display/title/subtitle styles; use tokens rather than prose descriptions when they disagree. [Existing numbers report](2026-10-29-design-system-numbers.md#6-github-primer-work-tool-short).<br>Reference only: sizes/targets already researched; do not duplicate or silently reconcile that report here. | [S31][S31] |
| weights | `base.text.weight.light`: 300<br>`base.text.weight.normal`: 400<br>`base.text.weight.medium`: 500<br>`base.text.weight.semibold`: 600 | [S32][S32] |

**Font licences.**

| Typeface / selector | Web licence | Source |
|---|---|---|
| Mona Sans VF | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S33][S33] |
| -apple-system, BlinkMacSystemFont, sans-serif, ui-monospace, monospace | Generic family or platform selector, not a bundled font file. No separate font is supplied by this stack. | [S30][S30] |
| Segoe UI, Arial, Segoe UI Emoji, Consolas | Installed-font CSS use permitted; the Windows font licence does not permit copying fonts to a web server or converting them to WOFF. Separate webfont rights would be needed for self-hosting. | [S16][S16] |
| Noto Sans Backtick Fix, Helvetica, Apple Color Emoji, SFMono-Regular, SF Mono, Menlo, Liberation Mono |  |  |
| Noto Sans | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S34][S34] |

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps | See Primer sizes/targets in the existing numbers report; the linked pinned file is the complete token source. [Existing numbers report](2026-10-29-design-system-numbers.md#6-github-primer-work-tool-short).<br>Reference only: sizes/targets already researched; do not duplicate or silently reconcile that report here. | [S35][S35] |
| shape and space.spacing scale | See Primer sizes/targets in the existing numbers report; the linked pinned file is the complete token source. [Existing numbers report](2026-10-29-design-system-numbers.md#6-github-primer-work-tool-short).<br>Reference only: sizes/targets already researched; do not duplicate or silently reconcile that report here. | [S36][S36] |
| shape and space.control heights | See Primer sizes/targets in the existing numbers report; the linked pinned file is the complete token source. [Existing numbers report](2026-10-29-design-system-numbers.md#6-github-primer-work-tool-short).<br>Reference only: sizes/targets already researched; do not duplicate or silently reconcile that report here. | [S37][S37] |
| elevation.light | `shadow.inset`: `color`: {base.color.neutral.13}, `alpha`: 0.04, `offsetX`: 0px, `offsetY`: 1px, `blur`: 0px, `spread`: 0px, `inset`: true<br>`shadow.resting.xsmall`: `color`: {base.color.neutral.13}, `alpha`: 0.05, `offsetX`: 0px, `offsetY`: 1px, `blur`: 1px, `spread`: 0px, `inset`: false<br>`shadow.resting.small`: `color`: {base.color.neutral.13}, `alpha`: 0.04, `offsetX`: 0px, `offsetY`: 1px, `blur`: 1px, `spread`: 0px, `inset`: false; `color`: {base.color.neutral.13}, `alpha`: 0.03, `offsetX`: 0px, `offsetY`: 1px, `blur`: 2px, `spread`: 0px, `inset`: false<br>`shadow.resting.medium`: `color`: {base.color.neutral.12}, `alpha`: 0.1, `offsetX`: 0px, `offsetY`: 1px, `blur`: 1px, `spread`: 0px; `color`: {base.color.neutral.12}, `alpha`: 0.12, `offsetX`: 0px, `offsetY`: 3px, `blur`: 6px, `spread`: 0px<br>`shadow.floating.small`: `color`: {overlay.borderColor}, `alpha`: 0.25, `offsetX`: 0px, `offsetY`: 0px, `blur`: 0px, `spread`: 1px; `color`: {base.color.neutral.12}, `alpha`: 0.04, `offsetX`: 0px, `offsetY`: 6px, `blur`: 12px, `spread`: -3px; `color`: {base.color.neutral.12}, `alpha`: 0.12, `offsetX`: 0px, `offsetY`: 6px, `blur`: 18px, `spread`: 0px<br>`shadow.floating.medium`: `color`: {overlay.borderColor}, `alpha`: 0, `offsetX`: 0px, `offsetY`: 0px, `blur`: 0px, `spread`: 1px; `color`: {base.color.neutral.12}, `alpha`: 0.08, `offsetX`: 0px, `offsetY`: 8px, `blur`: 16px, `spread`: -4px; `color`: {base.color.neutral.12}, `alpha`: 0.08, `offsetX`: 0px, `offsetY`: 4px, `blur`: 32px, `spread`: -4px; `color`: {base.color.neutral.12}, `alpha`: 0.08, `offsetX`: 0px, `offsetY`: 24px, `blur`: 48px, `spread`: -12px; `color`: {base.color.neutral.12}, `alpha`: 0.08, `offsetX`: 0px, `offsetY`: 48px, `blur`: 96px, `spread`: -24px<br>`shadow.floating.large`: `color`: {overlay.borderColor}, `alpha`: 0, `offsetX`: 0px, `offsetY`: 0px, `blur`: 0px, `spread`: 1px; `color`: {base.color.neutral.12}, `alpha`: 0.24, `offsetX`: 0px, `offsetY`: 40px, `blur`: 80px, `spread`: 0px<br>`shadow.floating.xlarge`: `color`: {overlay.borderColor}, `alpha`: 0, `offsetX`: 0px, `offsetY`: 0px, `blur`: 0px, `spread`: 1px; `color`: {base.color.neutral.12}, `alpha`: 0.32, `offsetX`: 0px, `offsetY`: 56px, `blur`: 112px, `spread`: 0px<br>`alias_definitions`: `base.color.neutral.0`: #ffffff, `base.color.neutral.12`: #25292E, `base.color.neutral.13`: #1f2328, `borderColor.default`: #D1D9E0, `borderColor.muted`: `$value`: {borderColor.default}, `alpha`: 0.7, `overlay.borderColor`: `$value`: {borderColor.muted}, `alpha`: 0.5<br>Published shadow layers and alias definitions retain separate alpha, dimensions and inset. Alias syntax is preserved; this is source token data, not newly composed CSS. | [S38][S38], [S28][S28], [S39][S39], [S40][S40] |
| elevation.dark | `shadow.inset`: `color`: {base.color.neutral.0}, `alpha`: 0.24, `offsetX`: 0px, `offsetY`: 1px, `blur`: 0px, `spread`: 0px, `inset`: true<br>`shadow.resting.xsmall`: `color`: {base.color.neutral.0}, `alpha`: 0.8, `offsetX`: 0px, `offsetY`: 1px, `blur`: 1px, `spread`: 0px, `inset`: false<br>`shadow.resting.small`: `color`: {base.color.neutral.0}, `alpha`: 0.6, `offsetX`: 0px, `offsetY`: 1px, `blur`: 1px, `spread`: 0px, `inset`: false; `color`: {base.color.neutral.0}, `alpha`: 0.6, `offsetX`: 0px, `offsetY`: 1px, `blur`: 3px, `spread`: 0px, `inset`: false<br>`shadow.resting.medium`: `color`: {base.color.neutral.0}, `alpha`: 0.4, `offsetX`: 0px, `offsetY`: 1px, `blur`: 1px, `spread`: 0px; `color`: {base.color.neutral.0}, `alpha`: 0.8, `offsetX`: 0px, `offsetY`: 3px, `blur`: 6px, `spread`: 0px<br>`shadow.floating.small`: `color`: {overlay.borderColor}, `alpha`: 1, `offsetX`: 0px, `offsetY`: 0px, `blur`: 0px, `spread`: 1px; `color`: {base.color.neutral.0}, `alpha`: 0.4, `offsetX`: 0px, `offsetY`: 6px, `blur`: 12px, `spread`: -3px; `color`: {base.color.neutral.0}, `alpha`: 0.4, `offsetX`: 0px, `offsetY`: 6px, `blur`: 18px, `spread`: 0px<br>`shadow.floating.medium`: `color`: {overlay.borderColor}, `alpha`: 1, `offsetX`: 0px, `offsetY`: 0px, `blur`: 0px, `spread`: 1px; `color`: {base.color.neutral.0}, `alpha`: 0.4, `offsetX`: 0px, `offsetY`: 8px, `blur`: 16px, `spread`: -4px; `color`: {base.color.neutral.0}, `alpha`: 0.4, `offsetX`: 0px, `offsetY`: 4px, `blur`: 32px, `spread`: -4px; `color`: {base.color.neutral.0}, `alpha`: 0.4, `offsetX`: 0px, `offsetY`: 24px, `blur`: 48px, `spread`: -12px; `color`: {base.color.neutral.0}, `alpha`: 0.4, `offsetX`: 0px, `offsetY`: 48px, `blur`: 96px, `spread`: -24px<br>`shadow.floating.large`: `color`: {overlay.borderColor}, `alpha`: 1, `offsetX`: 0px, `offsetY`: 0px, `blur`: 0px, `spread`: 1px; `color`: {base.color.neutral.0}, `alpha`: 1, `offsetX`: 0px, `offsetY`: 24px, `blur`: 48px, `spread`: 0px<br>`shadow.floating.xlarge`: `color`: {overlay.borderColor}, `alpha`: 1, `offsetX`: 0px, `offsetY`: 0px, `blur`: 0px, `spread`: 1px; `color`: {base.color.neutral.0}, `alpha`: 1, `offsetX`: 0px, `offsetY`: 32px, `blur`: 64px, `spread`: 0px<br>`alias_definitions`: `base.color.neutral.0`: #010409, `base.color.neutral.12`: #F0F6FC, `base.color.neutral.13`: #ffffff, `borderColor.default`: #3D444D, `borderColor.muted`: `$value`: {borderColor.default}, `alpha`: 0.7, `overlay.borderColor`: `$value`: {borderColor.muted}, `alpha`: 1<br>Published shadow layers and alias definitions retain separate alpha, dimensions and inset. Alias syntax is preserved; this is source token data, not newly composed CSS. | [S38][S38], [S29][S29], [S39][S39], [S40][S40] |
| motion.durations | `base.duration.0`: 0ms<br>`base.duration.50`: 50ms<br>`base.duration.100`: 100ms<br>`base.duration.200`: 200ms<br>`base.duration.300`: 300ms<br>`base.duration.400`: 400ms<br>`base.duration.500`: 500ms<br>`base.duration.600`: 600ms<br>`base.duration.700`: 700ms<br>`base.duration.800`: 800ms<br>`base.duration.900`: 900ms<br>`base.duration.1000`: 1000ms | [S41][S41] |
| motion.easing curves | `base.easing.linear`: 0; 0; 1; 1<br>`base.easing.ease`: 0.25; 0.1; 0.25; 1<br>`base.easing.easeIn`: 0.7; 0.1; 0.75; 0.9<br>`base.easing.easeOut`: 0.3; 0.8; 0.6; 1<br>`base.easing.easeInOut`: 0.6; 0; 0.2; 1 | [S42][S42] |
| motion.semantic tokens | `motion.duration.micro`: {base.duration.100}<br>`motion.duration.short`: {base.duration.200}<br>`motion.duration.medium`: {base.duration.300}<br>`motion.duration.long`: {base.duration.500}<br>`motion.easing.hover`: {base.easing.ease}<br>`motion.easing.enter`: {base.easing.easeOut}<br>`motion.easing.exit`: {base.easing.easeIn}<br>`motion.easing.move`: {base.easing.easeInOut}<br>`motion.easing.linear`: {base.easing.linear}<br>`motion.transition.hover`: `duration`: {motion.duration.micro}, `timingFunction`: {motion.easing.hover}<br>`motion.transition.stateChange`: `duration`: {motion.duration.short}, `timingFunction`: {motion.easing.move}<br>`motion.transition.enter`: `duration`: {motion.duration.medium}, `timingFunction`: {motion.easing.enter}<br>`motion.transition.exit`: `duration`: {motion.duration.short}, `timingFunction`: {motion.easing.exit} | [S43][S43], [S41][S41], [S42][S42] |
| icons.set | Octicons | [S44][S44] |
| icons.licence | MIT: use, modification and redistribution permitted with copyright and permission notice retained. This is the code/assets licence, not a general endorsement or brand-name licence. | [S44][S44] |
| terms | MIT: use, modification and redistribution permitted with copyright and permission notice retained. This is the code/assets licence, not a general endorsement or brand-name licence.<br>Font licences remain separate; no GitHub product-name/mark licence was established by this token licence. | [S45][S45] |

**Gaps.**

- `type.font_licences.Noto Sans Backtick Fix.web_licence`, `type.font_licences.Helvetica.web_licence`, `type.font_licences.Apple Color Emoji.web_licence`, `type.font_licences.SFMono-Regular.web_licence`, `type.font_licences.SF Mono.web_licence`, `type.font_licences.Menlo.web_licence`, `type.font_licences.Liberation Mono.web_licence`: Exact font-file web redistribution licence not verified. This face is only named as a local fallback; no font file should be bundled on this evidence.

## 6. Google — Material Design 3

**Status: full system published.** M3 publishes a system and Material Web publishes baseline v0.192 tokens. These are not a claim about every Google product or newer Expressive components. [S46][S46]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp | `neutral0`: #000<br>`neutral4`: #0f0d13<br>`neutral6`: #141218<br>`neutral10`: #1d1b20<br>`neutral12`: #211f26<br>`neutral17`: #2b2930<br>`neutral20`: #322f35<br>`neutral22`: #36343b<br>`neutral24`: #3b383e<br>`neutral30`: #48464c<br>`neutral40`: #605d64<br>`neutral50`: #79767d<br>`neutral60`: #938f96<br>`neutral70`: #aea9b1<br>`neutral80`: #cac5cd<br>`neutral87`: #ded8e1<br>`neutral90`: #e6e0e9<br>`neutral92`: #ece6f0<br>`neutral94`: #f3edf7<br>`neutral95`: #f5eff7<br>`neutral96`: #f7f2fa<br>`neutral98`: #fef7ff<br>`neutral99`: #fffbff<br>`neutral100`: #fff<br>Shared tonal palette, not a reversed dark ramp; mode-specific roles below select tones. | `neutral0`: #000<br>`neutral4`: #0f0d13<br>`neutral6`: #141218<br>`neutral10`: #1d1b20<br>`neutral12`: #211f26<br>`neutral17`: #2b2930<br>`neutral20`: #322f35<br>`neutral22`: #36343b<br>`neutral24`: #3b383e<br>`neutral30`: #48464c<br>`neutral40`: #605d64<br>`neutral50`: #79767d<br>`neutral60`: #938f96<br>`neutral70`: #aea9b1<br>`neutral80`: #cac5cd<br>`neutral87`: #ded8e1<br>`neutral90`: #e6e0e9<br>`neutral92`: #ece6f0<br>`neutral94`: #f3edf7<br>`neutral95`: #f5eff7<br>`neutral96`: #f7f2fa<br>`neutral98`: #fef7ff<br>`neutral99`: #fffbff<br>`neutral100`: #fff<br>Shared tonal palette, not a reversed dark ramp; mode-specific roles below select tones. | [S47][S47] |
| accent | #6750a4<br>primary -> primary40; baseline scheme, not a user-generated dynamic theme. | #d0bcff<br>primary -> primary80; baseline scheme, not a user-generated dynamic theme. | [S47][S47], [S46][S46] |
| success |  |  |  |
| warning |  |  |  |
| danger | #b3261e<br>error -> error40; baseline scheme, not a user-generated dynamic theme. | #f2b8b5<br>error -> error80; baseline scheme, not a user-generated dynamic theme. | [S47][S47], [S46][S46] |
| info |  |  |  |

| Additional publication | Value / scope | Sources |
|---|---|---|
| light.surface_roles | `on-surface`: #1d1b20<br>`on-surface-variant`: #49454f<br>`surface`: #fef7ff<br>`surface-bright`: #fef7ff<br>`surface-container`: #f3edf7<br>`surface-container-high`: #ece6f0<br>`surface-container-highest`: #e6e0e9<br>`surface-container-low`: #f7f2fa<br>`surface-container-lowest`: #fff<br>`surface-dim`: #ded8e1<br>`surface-tint`: #6750a4<br>`surface-variant`: #e7e0ec | [S47][S47], [S46][S46] |
| dark.surface_roles | `on-surface`: #e6e0e9<br>`on-surface-variant`: #cac4d0<br>`surface`: #141218<br>`surface-bright`: #3b383e<br>`surface-container`: #211f26<br>`surface-container-high`: #2b2930<br>`surface-container-highest`: #36343b<br>`surface-container-low`: #1d1b20<br>`surface-container-lowest`: #0f0d13<br>`surface-dim`: #141218<br>`surface-tint`: #d0bcff<br>`surface-variant`: #49454f | [S47][S47], [S46][S46] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces | Roboto (plain and brand) | [S48][S48] |
| fallback |  |  |
| text styles | See the existing baseline type sizes/leading and the complete pinned typescale; do not substitute Expressive values into this baseline snapshot. [Existing numbers report](2026-10-29-design-system-numbers.md#3-material-design-3-consumer-reference).<br>Reference only: sizes/targets already researched; do not duplicate or silently reconcile that report here. | [S49][S49] |
| weights | `regular`: 400<br>`medium`: 500<br>`bold`: 700 | [S48][S48] |

**Font licences.**

| Typeface / selector | Web licence | Source |
|---|---|---|
| Roboto | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S50][S50] |

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps | See prior report for the distinction between baseline token corners and the newer M3/Expressive radius scale. [Existing numbers report](2026-10-29-design-system-numbers.md#3-material-design-3-consumer-reference).<br>Reference only: sizes/targets already researched; do not duplicate or silently reconcile that report here. | [S51][S51] |
| shape and space.spacing scale |  |  |
| shape and space.control heights | Prior report records baseline button/text-field/list heights and unverified Expressive heights. [Existing numbers report](2026-10-29-design-system-numbers.md#3-material-design-3-consumer-reference).<br>Reference only: sizes/targets already researched; do not duplicate or silently reconcile that report here. | [S52][S52] |
| elevation | `level0`: 0<br>`level1`: 1<br>`level2`: 3<br>`level3`: 6<br>`level4`: 8<br>`level5`: 12<br>Published elevation levels, unitless in this Web token file. This satisfies the elevation-model field; no CSS shadow values are inferred. | [S53][S53] |
| motion.durations | `duration-extra-long1`: 700ms<br>`duration-extra-long2`: 800ms<br>`duration-extra-long3`: 900ms<br>`duration-extra-long4`: 1000ms<br>`duration-long1`: 450ms<br>`duration-long2`: 500ms<br>`duration-long3`: 550ms<br>`duration-long4`: 600ms<br>`duration-medium1`: 250ms<br>`duration-medium2`: 300ms<br>`duration-medium3`: 350ms<br>`duration-medium4`: 400ms<br>`duration-short1`: 50ms<br>`duration-short2`: 100ms<br>`duration-short3`: 150ms<br>`duration-short4`: 200ms | [S54][S54] |
| motion.easing curves | `easing-emphasized`: cubic-bezier(0.2, 0, 0, 1)<br>`easing-emphasized-accelerate`: cubic-bezier(0.3, 0, 0.8, 0.15)<br>`easing-emphasized-decelerate`: cubic-bezier(0.05, 0.7, 0.1, 1)<br>`easing-legacy`: cubic-bezier(0.4, 0, 0.2, 1)<br>`easing-legacy-accelerate`: cubic-bezier(0.4, 0, 1, 1)<br>`easing-legacy-decelerate`: cubic-bezier(0, 0, 0.2, 1)<br>`easing-linear`: cubic-bezier(0, 0, 1, 1)<br>`easing-standard`: cubic-bezier(0.2, 0, 0, 1)<br>`easing-standard-accelerate`: cubic-bezier(0.3, 0, 1, 1)<br>`easing-standard-decelerate`: cubic-bezier(0, 0, 0, 1) | [S54][S54] |
| icons.set | Material Icons / Material Symbols | [S55][S55] |
| icons.licence | Apache-2.0: retain licence and applicable notices, identify modifications; no general trademark permission. | [S55][S55] |
| terms | Apache-2.0: retain licence and applicable notices, identify modifications; no general trademark permission.<br>Applies to Material Web source. Fonts and symbols have their own licences; it does not authorize Google branding. | [S56][S56] |

**Gaps.**

- `colour.light.success`, `colour.light.warning`, `colour.light.info`, `colour.dark.success`, `colour.dark.warning`, `colour.dark.info`: Baseline M3 system colour tokens include error but no success/warning/info roles.
- `type.fallback`: The opened baseline typeface token only specifies Roboto; no fallback stack.
- `shape_and_space.spacing_scale`: The prior numbers research could not verify a general M3 spacing scale; no new value is asserted.

## 7. Microsoft — Fluent 2

**Status: full system published.** Fluent 2 and Fluent UI publish web themes, shared palettes, semantic aliases, type stacks, shadows and motion. This snapshot uses the standard web light/dark themes. [S57][S57]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp | `2`: #050505<br>`4`: #0a0a0a<br>`6`: #0f0f0f<br>`8`: #141414<br>`10`: #1a1a1a<br>`12`: #1f1f1f<br>`14`: #242424<br>`16`: #292929<br>`18`: #2e2e2e<br>`20`: #333333<br>`22`: #383838<br>`24`: #3d3d3d<br>`26`: #424242<br>`28`: #474747<br>`30`: #4d4d4d<br>`32`: #525252<br>`34`: #575757<br>`36`: #5c5c5c<br>`38`: #616161<br>`40`: #666666<br>`42`: #6b6b6b<br>`44`: #707070<br>`46`: #757575<br>`48`: #7a7a7a<br>`50`: #808080<br>`52`: #858585<br>`54`: #8a8a8a<br>`56`: #8f8f8f<br>`58`: #949494<br>`60`: #999999<br>`62`: #9e9e9e<br>`64`: #a3a3a3<br>`66`: #a8a8a8<br>`68`: #adadad<br>`70`: #b3b3b3<br>`72`: #b8b8b8<br>`74`: #bdbdbd<br>`76`: #c2c2c2<br>`78`: #c7c7c7<br>`80`: #cccccc<br>`82`: #d1d1d1<br>`84`: #d6d6d6<br>`86`: #dbdbdb<br>`88`: #e0e0e0<br>`90`: #e6e6e6<br>`92`: #ebebeb<br>`94`: #f0f0f0<br>`96`: #f5f5f5<br>`98`: #fafafa<br>`99`: #fcfcfc<br>Shared grey primitives, not a mode-reversed scale. Semantic neutral aliases choose different steps per theme. | `2`: #050505<br>`4`: #0a0a0a<br>`6`: #0f0f0f<br>`8`: #141414<br>`10`: #1a1a1a<br>`12`: #1f1f1f<br>`14`: #242424<br>`16`: #292929<br>`18`: #2e2e2e<br>`20`: #333333<br>`22`: #383838<br>`24`: #3d3d3d<br>`26`: #424242<br>`28`: #474747<br>`30`: #4d4d4d<br>`32`: #525252<br>`34`: #575757<br>`36`: #5c5c5c<br>`38`: #616161<br>`40`: #666666<br>`42`: #6b6b6b<br>`44`: #707070<br>`46`: #757575<br>`48`: #7a7a7a<br>`50`: #808080<br>`52`: #858585<br>`54`: #8a8a8a<br>`56`: #8f8f8f<br>`58`: #949494<br>`60`: #999999<br>`62`: #9e9e9e<br>`64`: #a3a3a3<br>`66`: #a8a8a8<br>`68`: #adadad<br>`70`: #b3b3b3<br>`72`: #b8b8b8<br>`74`: #bdbdbd<br>`76`: #c2c2c2<br>`78`: #c7c7c7<br>`80`: #cccccc<br>`82`: #d1d1d1<br>`84`: #d6d6d6<br>`86`: #dbdbdb<br>`88`: #e0e0e0<br>`90`: #e6e6e6<br>`92`: #ebebeb<br>`94`: #f0f0f0<br>`96`: #f5f5f5<br>`98`: #fafafa<br>`99`: #fcfcfc<br>Shared grey primitives, not a mode-reversed scale. Semantic neutral aliases choose different steps per theme. | [S58][S58] |
| accent | #0f6cbd<br>colorBrandBackground -> brandWeb[80]. Source comments beside some aliases are stale; use the assigned value. | #115ea3<br>colorBrandBackground -> brandWeb[70]. Source comments beside some aliases are stale; use the assigned value. | [S59][S59], [S60][S60], [S57][S57], [S59][S59], [S61][S61], [S62][S62] |
| success | #0e700e<br>colorStatusSuccessForeground1 -> green.shade10. Warning light has an explicit override. | #54b054<br>colorStatusSuccessForeground1 -> green.tint30. Warning light has an explicit override. | [S58][S58], [S63][S63], [S64][S64], [S58][S58], [S63][S63], [S65][S65] |
| warning | #bc4b09<br>colorStatusWarningForeground1 -> orange.shade20. Warning light has an explicit override. | #faa06b<br>colorStatusWarningForeground1 -> orange.tint30. Warning light has an explicit override. | [S58][S58], [S63][S63], [S64][S64], [S58][S58], [S63][S63], [S65][S65] |
| danger | #b10e1c<br>colorStatusDangerForeground1 -> cranberry.shade10. Warning light has an explicit override. | #dc626d<br>colorStatusDangerForeground1 -> cranberry.tint30. Warning light has an explicit override. | [S58][S58], [S63][S63], [S64][S64], [S58][S58], [S63][S63], [S65][S65] |
| info | #616161<br>MessageBar info icon uses colorNeutralForeground3. This is a documented component mapping, not a global blue info token. | #adadad<br>MessageBar info icon uses colorNeutralForeground3. This is a documented component mapping, not a global blue info token. | [S58][S58], [S60][S60], [S66][S66], [S58][S58], [S61][S61], [S66][S66] |

| Additional publication | Value / scope | Sources |
|---|---|---|
| light.surface_roles | `colorNeutralBackground1`: #ffffff<br>`colorNeutralBackground3`: #f5f5f5<br>`colorNeutralForeground1`: #242424<br>`colorNeutralForeground3`: #616161 | [S58][S58], [S60][S60] |
| dark.surface_roles | `colorNeutralBackground1`: #292929<br>`colorNeutralBackground3`: #141414<br>`colorNeutralForeground1`: #ffffff<br>`colorNeutralForeground3`: #adadad | [S58][S58], [S61][S61] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces | Segoe UI for base text; Consolas for monospace; Bahnschrift for numeric text. Actual selection follows the published fallback stacks. | [S67][S67] |
| fallback | `fontFamilyBase`: 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif<br>`fontFamilyMonospace`: Consolas, 'Courier New', Courier, monospace<br>`fontFamilyNumeric`: Bahnschrift, 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif | [S67][S67] |
| text styles | See the existing report for platform-specific type ramps; the source pins the web size and line-height token pairs. [Existing numbers report](2026-10-29-design-system-numbers.md#4-fluent-2-work-tool).<br>Reference only: sizes/targets already researched; do not duplicate or silently reconcile that report here. | [S67][S67] |
| weights | `fontWeightRegular`: 400<br>`fontWeightMedium`: 500<br>`fontWeightSemibold`: 600<br>`fontWeightBold`: 700 | [S67][S67] |

**Font licences.**

| Typeface / selector | Web licence | Source |
|---|---|---|
| Segoe UI, Consolas, Courier New, Bahnschrift | Installed-font CSS use permitted; the Windows font licence does not permit copying fonts to a web server or converting them to WOFF. Separate webfont rights would be needed for self-hosting. | [S16][S16] |
| Segoe UI Web (West European), Helvetica Neue, Courier |  |  |
| -apple-system, BlinkMacSystemFont, sans-serif, monospace | Generic family or platform selector, not a bundled font file. No separate font is supplied by this stack. | [S67][S67] |
| Roboto | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S50][S50] |

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps | `borderRadiusNone`: 0<br>`borderRadiusSmall`: 2px<br>`borderRadiusMedium`: 4px<br>`borderRadiusLarge`: 6px<br>`borderRadiusXLarge`: 8px<br>`borderRadius2XLarge`: 12px<br>`borderRadius3XLarge`: 16px<br>`borderRadius4XLarge`: 24px<br>`borderRadius5XLarge`: 32px<br>`borderRadius6XLarge`: 40px<br>`borderRadiusCircular`: 10000px<br>The current package differs from the website scale recorded in the earlier numbers report. Keep this package snapshot distinct; do not reconcile by guessing. | [S68][S68] |
| shape and space.spacing scale | See existing layout/spacing research. The pinned component package exposes horizontal/vertical steps through XXXL; do not assume every larger website spacing is a package token. [Existing numbers report](2026-10-29-design-system-numbers.md#4-fluent-2-work-tool).<br>Reference only: sizes/targets already researched; do not duplicate or silently reconcile that report here. | [S69][S69] |
| shape and space.control heights | See prior report for input heights, computed button-height caveat and platform touch targets. [Existing numbers report](2026-10-29-design-system-numbers.md#4-fluent-2-work-tool).<br>Reference only: sizes/targets already researched; do not duplicate or silently reconcile that report here. | [S70][S70] |
| elevation.light | `templates`: `shadow2`: 0 0 2px ${ambientColor}, 0 1px 2px ${keyColor}, `shadow4`: 0 0 2px ${ambientColor}, 0 2px 4px ${keyColor}, `shadow8`: 0 0 2px ${ambientColor}, 0 4px 8px ${keyColor}, `shadow16`: 0 0 2px ${ambientColor}, 0 8px 16px ${keyColor}, `shadow28`: 0 0 8px ${ambientColor}, 0 14px 28px ${keyColor}, `shadow64`: 0 0 8px ${ambientColor}, 0 32px 64px ${keyColor}<br>`ambientColor`: rgba(0,0,0,0.12)<br>`keyColor`: rgba(0,0,0,0.14)<br>Two-layer shadow model exactly as the generator publishes it; substitute the two supplied colours. No visual measurements. | [S71][S71], [S60][S60], [S72][S72] |
| elevation.dark | `templates`: `shadow2`: 0 0 2px ${ambientColor}, 0 1px 2px ${keyColor}, `shadow4`: 0 0 2px ${ambientColor}, 0 2px 4px ${keyColor}, `shadow8`: 0 0 2px ${ambientColor}, 0 4px 8px ${keyColor}, `shadow16`: 0 0 2px ${ambientColor}, 0 8px 16px ${keyColor}, `shadow28`: 0 0 8px ${ambientColor}, 0 14px 28px ${keyColor}, `shadow64`: 0 0 8px ${ambientColor}, 0 32px 64px ${keyColor}<br>`ambientColor`: rgba(0,0,0,0.24)<br>`keyColor`: rgba(0,0,0,0.28)<br>Two-layer shadow model exactly as the generator publishes it; substitute the two supplied colours. No visual measurements. | [S71][S71], [S61][S61], [S73][S73] |
| motion.durations | `durationUltraFast`: 50ms<br>`durationFaster`: 100ms<br>`durationFast`: 150ms<br>`durationNormal`: 200ms<br>`durationGentle`: 250ms<br>`durationSlow`: 300ms<br>`durationSlower`: 400ms<br>`durationUltraSlow`: 500ms | [S74][S74] |
| motion.easing curves | `curveAccelerateMax`: cubic-bezier(0.9,0.1,1,0.2)<br>`curveAccelerateMid`: cubic-bezier(1,0,1,1)<br>`curveAccelerateMin`: cubic-bezier(0.8,0,0.78,1)<br>`curveDecelerateMax`: cubic-bezier(0.1,0.9,0.2,1)<br>`curveDecelerateMid`: cubic-bezier(0,0,0,1)<br>`curveDecelerateMin`: cubic-bezier(0.33,0,0.1,1)<br>`curveEasyEaseMax`: cubic-bezier(0.8,0,0.2,1)<br>`curveEasyEase`: cubic-bezier(0.33,0,0.67,1)<br>`curveLinear`: cubic-bezier(0,0,1,1) | [S75][S75] |
| icons.set | Fluent UI System Icons | [S76][S76] |
| icons.licence | MIT: use, modification and redistribution permitted with copyright and permission notice retained. This is the code/assets licence, not a general endorsement or brand-name licence. | [S76][S76] |
| terms | MIT: use, modification and redistribution permitted with copyright and permission notice retained. This is the code/assets licence, not a general endorsement or brand-name licence.<br>The repository licence does not license Windows font files for web hosting; retain the separate font-use restrictions. | [S77][S77], [S16][S16] |

**Gaps.**

- `type.font_licences.Segoe UI Web (West European).web_licence`, `type.font_licences.Helvetica Neue.web_licence`, `type.font_licences.Courier.web_licence`: Exact font-file web redistribution licence not verified. This face is only named as a local fallback; no font file should be bundled on this evidence.

## 8. Stripe

**Status: partial.** Stripe Apps exposes a constrained Dashboard styling API, including semantic colours, text styles and a numeric spacing scale; this is not the stripe.com marketing-site design system. [S78][S78]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp |  |  |  |
| accent |  |  |  |
| success |  |  |  |
| warning |  |  |  |
| danger |  |  |  |
| info |  |  |  |

| Additional publication | Value / scope | Sources |
|---|---|---|
| published_roles | `background`: surface; container<br>`border`: neutral; critical<br>`text_and_icons`: primary; secondary; disabled; info; success; attention; critical<br>Names are published, but no light/dark literal colour table was verified. primary is text emphasis here, not a brand-accent value. | [S78][S78] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces |  |  |
| fallback |  |  |
| text styles |  |  |
| weights |  |  |
| published styles | heading; subheading; body; caption<br>The API does not allow arbitrary font faces. Family, sizes and line heights were not stated in the readable table. | [S78][S78] |

**Font licences.**

Typeface not confirmed; consequently its web licence is also unverified.

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps |  |  |
| shape and space.spacing scale | `0`: 0px<br>`xxsmall`: 2px<br>`xsmall`: 4px<br>`small`: 8px<br>`medium`: 16px<br>`large`: 24px<br>`xlarge`: 32px<br>`xxlarge`: 48px | [S78][S78] |
| shape and space.control heights |  |  |
| shape and space.radius names | small; medium<br>Shown as borderRadius values in examples; numeric radii not published in the opened page. | [S78][S78] |
| elevation |  |  |
| motion.durations |  |  |
| motion.easing curves |  |  |
| icons.set | Stripe Apps Icon component, with named built-in icons<br>The styling page demonstrates Icon and points to the component reference; standalone icon-set licence not verified. | [S78][S78] |
| icons.licence |  |  |
| terms | Stripe marks may identify Stripe in the permitted relationship to its services. Do not alter marks, imply endorsement or use them as your own identity. These mark terms do not establish a reusable Dashboard-token licence. | [S79][S79] |

**Gaps.**

- `colour.light.neutral_ramp`, `colour.light.accent`, `colour.light.success`, `colour.light.warning`, `colour.light.danger`, `colour.light.info`, `colour.dark.neutral_ramp`, `colour.dark.accent`, `colour.dark.success`, `colour.dark.warning`, `colour.dark.danger`, `colour.dark.info`: Stripe Apps semantic colour names were published; light/dark raw values were not verified.
- `type.typefaces`, `type.fallback`, `type.font_licences`, `type.text_styles`, `type.weights`: Stripe Apps exposes style names, without font family/licence or complete numeric text styles in the opened page.
- `shape_and_space.radius_steps`, `shape_and_space.control_heights`: Numeric radius and control-height values were not verified.
- `elevation`: No numeric shadows or elevation model confirmed.
- `motion.durations`, `motion.easing_curves`: No duration/easing scale confirmed.
- `icons.licence`: No standalone icon-set licence confirmed.

## 9. Notion

**Status: partial.** First-party help and API documents publish content-format choices. A complete product-token source was not found; the linked brand guideline could not be read. [S80][S80]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp |  |  |  |
| accent |  |  |  |
| success |  |  |  |
| warning |  |  |  |
| danger |  |  |  |
| info |  |  |  |

| Additional publication | Value / scope | Sources |
|---|---|---|
| published_roles | default; gray; brown; orange; yellow; green; blue; purple; pink; red; gray_background; brown_background; orange_background; yellow_background; green_background; blue_background; purple_background; pink_background; red_background<br>Rich-text annotation enum, not a light/dark palette or semantic-status mapping. | [S81][S81] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces |  |  |
| fallback |  |  |
| text styles |  |  |
| weights |  |  |
| published styles | Default; Serif; Mono<br>UI style labels; exact font families, numeric styles and font licences are unverified. | [S80][S80] |

**Font licences.**

Typeface not confirmed; consequently its web licence is also unverified.

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps |  |  |
| shape and space.spacing scale |  |  |
| shape and space.control heights |  |  |
| elevation |  |  |
| motion.durations |  |  |
| motion.easing curves |  |  |
| icons.set | Content can use emoji, built-in icons or uploaded images.<br>This is a content feature, not a verified redistributable icon library. | [S80][S80] |
| icons.licence |  |  |
| terms |  |  |

**Gaps.**

- `colour.light.neutral_ramp`, `colour.light.accent`, `colour.light.success`, `colour.light.warning`, `colour.light.danger`, `colour.light.info`, `colour.dark.neutral_ramp`, `colour.dark.accent`, `colour.dark.success`, `colour.dark.warning`, `colour.dark.danger`, `colour.dark.info`: Content-colour enums are not literal UI palette values.
- `type.typefaces`, `type.fallback`, `type.font_licences`, `type.text_styles`, `type.weights`: Default/Serif/Mono labels do not identify font families, fallback stacks, licences or numeric styles.
- `shape_and_space.radius_steps`, `shape_and_space.spacing_scale`, `shape_and_space.control_heights`: No first-party token scale confirmed.
- `elevation`: No first-party shadow/model confirmed.
- `motion.durations`, `motion.easing_curves`: No first-party duration/easing scale confirmed.
- `icons.licence`: No standalone icon library licence confirmed.
- `terms`: Brand guideline could not be read; no reuse terms asserted.

## 10. Raycast

**Status: partial.** Extension UI is provided through native components and semantic colour/icon APIs. The docs do not provide a complete fixed web theme. [S82][S82]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp |  |  |  |
| accent |  |  |  |
| success |  |  |  |
| warning |  |  |  |
| danger |  |  |  |
| info |  |  |  |

| Additional publication | Value / scope | Sources |
|---|---|---|
| published_roles | Color.Blue; Color.Green; Color.Magenta; Color.Orange; Color.Purple; Color.Red; Color.Yellow; Color.PrimaryText; Color.SecondaryText<br>Dynamic semantic values adapt to appearance. Raw-colour code examples are not default palette values and are deliberately excluded. | [S83][S83] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces |  |  |
| fallback |  |  |
| text styles |  |  |
| weights |  |  |

**Font licences.**

Typeface not confirmed; consequently its web licence is also unverified.

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps |  |  |
| shape and space.spacing scale |  |  |
| shape and space.control heights |  |  |
| elevation |  |  |
| motion.durations |  |  |
| motion.easing curves |  |  |
| icons.set | Built-in Icon enumeration from @raycast/api<br>Available to extension actions and list items; general redistribution licence not verified. | [S84][S84] |
| icons.licence |  |  |
| terms |  |  |

**Gaps.**

- `colour.light.neutral_ramp`, `colour.light.accent`, `colour.light.success`, `colour.light.warning`, `colour.light.danger`, `colour.light.info`, `colour.dark.neutral_ramp`, `colour.dark.accent`, `colour.dark.success`, `colour.dark.warning`, `colour.dark.danger`, `colour.dark.info`: Dynamic colour names are published, but no literal mode-specific palette/status mapping was confirmed.
- `type.typefaces`, `type.fallback`, `type.font_licences`, `type.text_styles`, `type.weights`: Extension UI docs do not identify a complete font family/licence/fallback/style table.
- `shape_and_space.radius_steps`, `shape_and_space.spacing_scale`, `shape_and_space.control_heights`: No fixed web radius/spacing/control-height scale confirmed.
- `elevation`: No shadow/elevation model confirmed.
- `motion.durations`, `motion.easing_curves`: No general duration/easing scale confirmed.
- `icons.licence`: Extension Icon API availability does not establish general icon redistribution rights.
- `terms`: No applicable token/brand reuse grant was confirmed.

## 11. Atlassian Design System

**Status: full system published.** ADS publishes a complete system. This audit pins the standard atlassian-light/dark token exports in Atlassian’s official Bitbucket mirror, separately from the live catalogue examples. The tokens package has its own Apache-2.0 licence. [S85][S85], [S86][S86]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp | `color.palette.Neutral0`: #FFFFFF<br>`color.palette.Neutral100`: #F8F8F8<br>`color.palette.Neutral200`: #F0F1F2<br>`color.palette.Neutral300`: #DDDEE1<br>`color.palette.Neutral400`: #B7B9BE<br>`color.palette.Neutral500`: #8C8F97<br>`color.palette.Neutral600`: #7D818A<br>`color.palette.Neutral700`: #6B6E76<br>`color.palette.Neutral800`: #505258<br>`color.palette.Neutral900`: #3B3D42<br>`color.palette.Neutral1000`: #292A2E<br>`color.palette.Neutral1100`: #1E1F21<br>`color.palette.Neutral1200`: #000000<br>`color.palette.Neutral100A`: #17171708<br>`color.palette.Neutral200A`: #0515240F<br>`color.palette.Neutral300A`: #0B120E24<br>`color.palette.Neutral400A`: #080F214A<br>`color.palette.Neutral500A`: #050C1F75<br>Pinned package primitives, including alpha entries. Standard light/dark exports; no future/finesse/increased-contrast theme is substituted. | `color.palette.DarkNeutral-100`: #111213<br>`color.palette.DarkNeutral0`: #18191A<br>`color.palette.DarkNeutral100`: #1F1F21<br>`color.palette.DarkNeutral200`: #242528<br>`color.palette.DarkNeutral250`: #2B2C2F<br>`color.palette.DarkNeutral300`: #303134<br>`color.palette.DarkNeutral350`: #3D3F43<br>`color.palette.DarkNeutral400`: #4B4D51<br>`color.palette.DarkNeutral500`: #63666B<br>`color.palette.DarkNeutral600`: #7E8188<br>`color.palette.DarkNeutral700`: #96999E<br>`color.palette.DarkNeutral800`: #A9ABAF<br>`color.palette.DarkNeutral900`: #BFC1C4<br>`color.palette.DarkNeutral1000`: #CECFD2<br>`color.palette.DarkNeutral1100`: #E2E3E4<br>`color.palette.DarkNeutral1200`: #FFFFFF<br>`color.palette.DarkNeutral-100A`: #01040475<br>`color.palette.DarkNeutral100A`: #BDBDBD0A<br>`color.palette.DarkNeutral200A`: #CECED912<br>`color.palette.DarkNeutral250A`: #D9DAE71A<br>`color.palette.DarkNeutral300A`: #E3E4F21F<br>`color.palette.DarkNeutral350A`: #E8EDFD2E<br>`color.palette.DarkNeutral400A`: #E5E9F640<br>`color.palette.DarkNeutral500A`: #E9F0FB5C<br>Pinned package primitives, including alpha entries. Standard light/dark exports; no future/finesse/increased-contrast theme is substituted. | [S87][S87] |
| accent | #1868DB<br>color.background.brand.bold.[default] in the pinned standard theme; differs from the live llms-tokens example palette. | #669DF1<br>color.background.brand.bold.[default] in the pinned standard theme; differs from the live llms-tokens example palette. | [S85][S85], [S88][S88] |
| success | #4C6B1F<br>color.text.success.[default] in the pinned standard theme; differs from the live llms-tokens example palette. | #B3DF72<br>color.text.success.[default] in the pinned standard theme; differs from the live llms-tokens example palette. | [S85][S85], [S88][S88] |
| warning | #9E4C00<br>color.text.warning.[default] in the pinned standard theme; differs from the live llms-tokens example palette. | #FBC828<br>color.text.warning.[default] in the pinned standard theme; differs from the live llms-tokens example palette. | [S85][S85], [S88][S88] |
| danger | #AE2E24<br>color.text.danger.[default] in the pinned standard theme; differs from the live llms-tokens example palette. | #FD9891<br>color.text.danger.[default] in the pinned standard theme; differs from the live llms-tokens example palette. | [S85][S85], [S88][S88] |
| info | #1558BC<br>color.text.information.[default] in the pinned standard theme; differs from the live llms-tokens example palette. | #8FB8F6<br>color.text.information.[default] in the pinned standard theme; differs from the live llms-tokens example palette. | [S85][S85], [S88][S88] |

| Additional publication | Value / scope | Sources |
|---|---|---|
| light.neutral_semantics | `color.text.[default]`: #292A2E<br>`color.text.subtle`: #505258<br>`color.text.subtlest`: #6B6E76<br>`color.text.disabled`: #080F214A<br>`color.background.neutral.[default].[default]`: #0515240F<br>`color.background.neutral.subtle.[default]`: #00000000<br>`elevation.surface.[default].[default]`: #FFFFFF | [S85][S85] |
| dark.neutral_semantics | `color.text.[default]`: #CECFD2<br>`color.text.subtle`: #A9ABAF<br>`color.text.subtlest`: #96999E<br>`color.text.disabled`: #E5E9F640<br>`color.background.neutral.[default].[default]`: #CECED912<br>`color.background.neutral.subtle.[default]`: #00000000<br>`elevation.surface.[default].[default]`: #1F1F21 | [S88][S88] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces | `UI`: Atlassian Sans (Inter derivative)<br>`code`: Atlassian Mono (JetBrains Mono derivative) | [S89][S89] |
| fallback | `font.family.heading`: "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.family.body`: "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.family.code`: "Atlassian Mono", ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace<br>`font.family.brand.heading`: "Charlie Display", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.family.brand.body`: "Charlie Text", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif | [S90][S90] |
| text styles | `font.heading.xxlarge`: normal 653 32px/36px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.heading.xlarge`: normal 653 28px/32px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.heading.large`: normal 653 24px/28px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.heading.medium`: normal 653 20px/24px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.heading.small`: normal 653 16px/20px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.heading.xsmall`: normal 653 14px/20px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.heading.xxsmall`: normal 653 12px/16px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.body.large`: normal 400 16px/24px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.body.[default]`: normal 400 14px/20px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.body.small`: normal 400 12px/16px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.metric.large`: normal 653 28px/32px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.metric.medium`: normal 653 24px/28px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.metric.small`: normal 653 16px/20px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif<br>`font.code.[default]`: normal 400 0.875em/1 "Atlassian Mono", ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace<br>Exact generated shorthands. In this snapshot headings/metrics use weight 653 and code is relative, 0.875em/1; these differ from the live documentation summaries. | [S90][S90] |
| weights | `font.weight.regular`: 400<br>`font.weight.medium`: 500<br>`font.weight.semibold`: 600<br>`font.weight.bold`: 653 | [S90][S90] |
| brand typeface | Charlie Sans; brand use, download requires authentication. | [S91][S91] |
| licence context | The tokens source package is Apache-2.0. This does not license the font binaries named by its CSS stacks. No separate licence for Atlassian Sans/Mono or Charlie fonts was confirmed; the site-wide ADS licence and its OSS exceptions remain relevant to other assets. | [S86][S86], [S92][S92] |

**Font licences.**

| Typeface / selector | Web licence | Source |
|---|---|---|
| Atlassian Sans, Atlassian Mono, Charlie Display, Charlie Text, Ubuntu, Helvetica Neue, Menlo, Segoe UI Mono, Ubuntu Mono, Charlie Sans |  |  |
| ui-sans-serif | Generic family selector, not a bundled font file. | [S90][S90] |
| -apple-system, BlinkMacSystemFont, sans-serif, ui-monospace, monospace | Generic family or platform selector, not a bundled font file. No separate font is supplied by this stack. | [S90][S90] |
| Segoe UI | Installed-font CSS use permitted; the Windows font licence does not permit copying fonts to a web server or converting them to WOFF. Separate webfont rights would be needed for self-hosting. | [S16][S16] |

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps | `radius.xsmall`: 2px<br>`radius.small`: 4px<br>`radius.medium`: 6px<br>`radius.large`: 8px<br>`radius.xlarge`: 12px<br>`radius.xxlarge`: 16px<br>`radius.full`: 9999px<br>`radius.tile`: 25%<br>Pinned package scale, including radius.tile 25%. | [S93][S93] |
| shape and space.spacing scale | `space.0`: 0px<br>`space.025`: 2px<br>`space.050`: 4px<br>`space.075`: 6px<br>`space.100`: 8px<br>`space.150`: 12px<br>`space.200`: 16px<br>`space.250`: 20px<br>`space.300`: 24px<br>`space.400`: 32px<br>`space.500`: 40px<br>`space.600`: 48px<br>`space.800`: 64px<br>`space.1000`: 80px<br>`space.gap.large`: 12px<br>`space.gap.medium`: 8px<br>`space.gap.small`: 6px<br>`space.gap.xlarge`: 16px<br>`space.gap.xsmall`: 4px<br>`space.gap.xxlarge`: 24px<br>`space.gap.xxsmall`: 2px<br>`space.inset.3xlarge`: 48px<br>`space.inset.large`: 20px<br>`space.inset.medium`: 16px<br>`space.inset.small`: 12px<br>`space.inset.xlarge`: 24px<br>`space.inset.xsmall`: 8px<br>`space.inset.xxlarge`: 32px<br>`space.inset.xxsmall`: 4px<br>`space.negative.025`: -2px<br>`space.negative.050`: -4px<br>`space.negative.075`: -6px<br>`space.negative.100`: -8px<br>`space.negative.150`: -12px<br>`space.negative.200`: -16px<br>`space.negative.250`: -20px<br>`space.negative.300`: -24px<br>`space.negative.400`: -32px<br>Pinned package spacing, including negative values and gap/inset aliases; retain published px units. | [S94][S94] |
| shape and space.control heights |  |  |
| elevation.light | `elevation.shadow.overflow.[default]`: `radius`: 8, `offset`: `x`: 0, `y`: 0, `color`: #1E1F21, `opacity`: 0.16; `radius`: 1, `offset`: `x`: 0, `y`: 0, `color`: #1E1F21, `opacity`: 0.12<br>`elevation.shadow.overflow.perimeter`: #1E1F211f<br>`elevation.shadow.overflow.spread`: #1E1F2129<br>`elevation.shadow.overlay`: `radius`: 12, `offset`: `x`: 0, `y`: 8, `color`: #1E1F21, `opacity`: 0.15; `radius`: 1, `offset`: `x`: 0, `y`: 0, `color`: #1E1F21, `opacity`: 0.31<br>`elevation.shadow.raised`: `radius`: 1, `offset`: `x`: 0, `y`: 1, `color`: #1E1F21, `opacity`: 0.25; `radius`: 1, `offset`: `x`: 0, `y`: 0, `color`: #1E1F21, `opacity`: 0.31<br>Published structured shadow layers preserve radius, offset, colour, opacity and optional spread/inset. No new CSS shadow is calculated. | [S85][S85] |
| elevation.dark | `elevation.shadow.overflow.[default]`: `radius`: 12, `offset`: `x`: 0, `y`: 0, `color`: #01040475, `opacity`: 0.56; `radius`: 1, `offset`: `x`: 0, `y`: 0, `color`: #01040475, `opacity`: 0.5<br>`elevation.shadow.overflow.perimeter`: #01040480<br>`elevation.shadow.overflow.spread`: #0104048f<br>`elevation.shadow.overlay`: `radius`: 0, `spread`: 1, `color`: #BDBDBD, `offset`: `x`: 0, `y`: 0, `opacity`: 0.12; `radius`: 12, `offset`: `x`: 0, `y`: 8, `color`: #01040475, `opacity`: 0.36; `radius`: 1, `spread`: 1, `offset`: `x`: 0, `y`: 0, `color`: #01040475, `opacity`: 0.5<br>`elevation.shadow.raised`: `radius`: 0, `spread`: 1, `color`: #000000, `offset`: `x`: 0, `y`: 0, `opacity`: 0; `radius`: 1, `offset`: `x`: 0, `y`: 1, `color`: #01040475, `opacity`: 0.5; `radius`: 1, `offset`: `x`: 0, `y`: 0, `color`: #01040475, `opacity`: 0.5<br>Published structured shadow layers preserve radius, offset, colour, opacity and optional spread/inset. No new CSS shadow is calculated. | [S88][S88] |
| motion.durations | `motion.duration.instant`: 0ms<br>`motion.duration.long`: 250ms<br>`motion.duration.medium`: 200ms<br>`motion.duration.short`: 150ms<br>`motion.duration.xlong`: 400ms<br>`motion.duration.xshort`: 100ms<br>`motion.duration.xxlong`: 600ms<br>`motion.duration.xxshort`: 50ms<br>Package tokens; the live motion foundation is early access, not a guarantee of deployment in every Atlassian product. | [S95][S95] |
| motion.easing curves | `motion.easing.in.practical`: cubic-bezier(0.6, 0, 0.8, 0.6)<br>`motion.easing.inout.bold`: cubic-bezier(0.4, 0, 0, 1)<br>`motion.easing.out.practical`: cubic-bezier(0.4, 1, 0.6, 1)<br>`motion.easing.out.bold`: cubic-bezier(0, 0.4, 0, 1)<br>`motion.easing.spring`: linear(0, 0.021, 0.058, 0.107, 0.164, 0.227, 0.292, 0.359, 0.425, 0.49, 0.552, 0.61, 0.664, 0.714, 0.759, 0.8, 0.837, 0.869, 0.898, 0.922, 0.943, 0.961, 0.976, 0.988, 0.998, 1.006, 1.013, 1.017, 1.02, 1.023, 1.024, 1.024, 1.024, 1.024, 1.023, 1.022, 1.02, 1.019, 1.017, 1.015, 1.014, 1.012, 1.011, 1.009, 1.008, 1.007, 1.006, 1.005, 1.004, 1.003, 1.002, 1.002, 1.001, 1.001, 1.001, 1, 1, 1, 1, 1, 0.999, 0.999, 0.999, 0.999, 1)<br>Includes the published sampled spring linear() curve; it is not replaced with an approximate cubic-bezier. | [S95][S95] |
| icons.set | ADS icons | [S96][S96] |
| icons.licence | Default ADS licence restricts use to Atlassian-integrated Add-Ons; a separate icon-package OSS exception was not verified. | [S92][S92] |
| terms | The official @atlaskit/tokens package is Apache-2.0. Separately, the site-wide ADS licence covers integrated Add-Ons and allows identified OSS exceptions. Do not extend the token-package licence to proprietary fonts, visual assets or Atlassian marks. | [S86][S86], [S92][S92] |

**Gaps.**

- `type.font_licences.Atlassian Sans.web_licence`, `type.font_licences.Atlassian Mono.web_licence`, `type.font_licences.Charlie Display.web_licence`, `type.font_licences.Charlie Text.web_licence`, `type.font_licences.Ubuntu.web_licence`, `type.font_licences.Helvetica Neue.web_licence`, `type.font_licences.Menlo.web_licence`, `type.font_licences.Segoe UI Mono.web_licence`, `type.font_licences.Ubuntu Mono.web_licence`, `type.font_licences.Charlie Sans.web_licence`: Exact font-file web licence not verified for this named face. The token source licence does not grant font-binary rights.
- `shape_and_space.control_heights`: Numeric control-height scale not confirmed in the opened foundations/token package.

## 12. Ant Design 5

**Status: full system published.** Version 5.29.3 publishes seed/map/alias tokens and default/dark algorithms. The current unversioned main site is 6.x; it is excluded from this snapshot. [S97][S97]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp | `colorBgBase`: #fff<br>`colorTextBase`: #000<br>`colorText`: rgba(0, 0, 0, 0.88)<br>`colorTextSecondary`: rgba(0, 0, 0, 0.65)<br>`colorTextTertiary`: rgba(0, 0, 0, 0.45)<br>`colorTextQuaternary`: rgba(0, 0, 0, 0.25)<br>`colorFill`: rgba(0, 0, 0, 0.15)<br>`colorFillSecondary`: rgba(0, 0, 0, 0.06)<br>`colorFillTertiary`: rgba(0, 0, 0, 0.04)<br>`colorFillQuaternary`: rgba(0, 0, 0, 0.02)<br>`colorBgLayout`: #f5f5f5<br>`colorBgContainer`: #ffffff<br>`colorBgElevated`: #ffffff<br>`colorBorder`: #d9d9d9<br>`colorBorderSecondary`: #f0f0f0<br>Semantic neutral series from the Default Value table, not an invented numbered ramp. |  | [S98][S98], [S99][S99] |
| accent | #1677ff<br>Default colorPrimary seed; default algorithm selects palette step 6. |  | [S97][S97], [S100][S100], [S99][S99] |
| success | #52c41a<br>Default colorSuccess seed; default algorithm selects palette step 6. |  | [S97][S97], [S100][S100], [S99][S99] |
| warning | #faad14<br>Default colorWarning seed; default algorithm selects palette step 6. |  | [S97][S97], [S100][S100], [S99][S99] |
| danger | #ff4d4f<br>Default colorError seed; default algorithm selects palette step 6. |  | [S97][S97], [S100][S100], [S99][S99] |
| info | #1677ff<br>Default colorInfo seed; default algorithm selects palette step 6. |  | [S97][S97], [S100][S100], [S99][S99] |

| Additional publication | Value / scope | Sources |
|---|---|---|
| light.neutral_recipe | `colorText`: getAlphaColor(colorTextBase, 0.88)<br>`colorTextSecondary`: getAlphaColor(colorTextBase, 0.65)<br>`colorTextTertiary`: getAlphaColor(colorTextBase, 0.45)<br>`colorTextQuaternary`: getAlphaColor(colorTextBase, 0.25)<br>`colorFill`: getAlphaColor(colorTextBase, 0.15)<br>`colorFillSecondary`: getAlphaColor(colorTextBase, 0.06)<br>`colorFillTertiary`: getAlphaColor(colorTextBase, 0.04)<br>`colorFillQuaternary`: getAlphaColor(colorTextBase, 0.02)<br>`colorBgSolid`: getAlphaColor(colorTextBase, 1)<br>`colorBgSolidHover`: getAlphaColor(colorTextBase, 0.75)<br>`colorBgSolidActive`: getAlphaColor(colorTextBase, 0.95)<br>`colorBgLayout`: getSolidColor(colorBgBase, 4)<br>`colorBgContainer`: getSolidColor(colorBgBase, 0)<br>`colorBgElevated`: getSolidColor(colorBgBase, 0)<br>`colorBgSpotlight`: getAlphaColor(colorTextBase, 0.85)<br>`colorBorder`: getSolidColor(colorBgBase, 15)<br>`colorBorderSecondary`: getSolidColor(colorBgBase, 6)<br>Published generator expressions, not claimed literal colour outputs. Dark starts from #000 background / #fff text; default starts from #fff / #000. | [S99][S99], [S101][S101] |
| dark.neutral_recipe | `colorText`: getAlphaColor(colorTextBase, 0.85)<br>`colorTextSecondary`: getAlphaColor(colorTextBase, 0.65)<br>`colorTextTertiary`: getAlphaColor(colorTextBase, 0.45)<br>`colorTextQuaternary`: getAlphaColor(colorTextBase, 0.25)<br>`colorFill`: getAlphaColor(colorTextBase, 0.18)<br>`colorFillSecondary`: getAlphaColor(colorTextBase, 0.12)<br>`colorFillTertiary`: getAlphaColor(colorTextBase, 0.08)<br>`colorFillQuaternary`: getAlphaColor(colorTextBase, 0.04)<br>`colorBgSolid`: getAlphaColor(colorTextBase, 0.95)<br>`colorBgSolidHover`: getAlphaColor(colorTextBase, 1)<br>`colorBgSolidActive`: getAlphaColor(colorTextBase, 0.9)<br>`colorBgElevated`: getSolidColor(colorBgBase, 12)<br>`colorBgContainer`: getSolidColor(colorBgBase, 8)<br>`colorBgLayout`: getSolidColor(colorBgBase, 0)<br>`colorBgSpotlight`: getSolidColor(colorBgBase, 26)<br>`colorBgBlur`: getAlphaColor(colorTextBase, 0.04)<br>`colorBorder`: getSolidColor(colorBgBase, 26)<br>`colorBorderSecondary`: getSolidColor(colorBgBase, 19)<br>Published generator expressions, not claimed literal colour outputs. Dark starts from #000 background / #fff text; default starts from #fff / #000. | [S102][S102], [S103][S103] |
| dark.palette_recipe | generate(baseColor, { theme: 'dark' }); palette[6] = colors[5]<br>All five dark semantic colours are generated from the seeds. Literal outputs matching this exact version/dependency were not confirmed; their fields remain null. | [S102][S102], [S97][S97], [S100][S100] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces | Platform system stack; no bundled proprietary typeface is licensed by the component package. | [S97][S97] |
| fallback | `fontFamily`: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'<br>`fontFamilyCode`: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace | [S97][S97] |
| text styles | `fontSizeSM`: 12<br>`fontSize`: 14<br>`fontSizeLG`: 16<br>`fontSizeXL`: 20<br>`fontSizeHeading1`: 38<br>`fontSizeHeading2`: 30<br>`fontSizeHeading3`: 24<br>`fontSizeHeading4`: 20<br>`fontSizeHeading5`: 16<br>`lineHeight`: 1.5714285714285714<br>`lineHeightSM`: 1.6666666666666667<br>`lineHeightLG`: 1.5<br>`lineHeightHeading1`: 1.2105263157894737<br>`lineHeightHeading2`: 1.2666666666666666<br>`lineHeightHeading3`: 1.3333333333333333<br>`lineHeightHeading4`: 1.4<br>`lineHeightHeading5`: 1.5<br>Sizes are CSS px defaults; line heights are unitless. Published defaults, not newly generated typography. | [S98][S98], [S104][S104] |
| weights | `fontWeightStrong`: 600 | [S105][S105] |

**Font licences.**

| Typeface / selector | Web licence | Source |
|---|---|---|
| -apple-system, BlinkMacSystemFont, sans-serif, monospace | Generic family or platform selector, not a bundled font file. No separate font is supplied by this stack. | [S97][S97] |
| Segoe UI, Arial, Segoe UI Emoji, Segoe UI Symbol, Consolas | Installed-font CSS use permitted; the Windows font licence does not permit copying fonts to a web server or converting them to WOFF. Separate webfont rights would be needed for self-hosting. | [S16][S16] |
| Roboto | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S50][S50] |
| Helvetica Neue, Apple Color Emoji, SFMono-Regular, Liberation Mono, Menlo, Courier |  |  |
| Noto Sans | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S34][S34] |
| Noto Color Emoji | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S106][S106] |

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps | `borderRadiusXS`: 2<br>`borderRadiusSM`: 4<br>`borderRadius`: 6<br>`borderRadiusLG`: 8<br>`borderRadiusOuter`: 4<br>CSS px; default configuration only. | [S98][S98], [S107][S107] |
| shape and space.spacing scale | `sizeXXS`: 4<br>`sizeXS`: 8<br>`sizeSM`: 12<br>`size`: 16<br>`sizeMS`: 16<br>`sizeMD`: 20<br>`sizeLG`: 24<br>`sizeXL`: 32<br>`sizeXXL`: 48<br>CSS px, default sizeUnit/sizeStep; compact algorithm differs. | [S98][S98], [S108][S108] |
| shape and space.control heights | `controlHeightXS`: 16<br>`controlHeightSM`: 24<br>`controlHeight`: 32<br>`controlHeightLG`: 40<br>CSS px. | [S98][S98], [S109][S109] |
| elevation | `boxShadow`: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)<br>`boxShadowSecondary`: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)<br>`boxShadowTertiary`: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)<br>Common alias shadow definitions; no dark-specific shadow override appears in the opened dark algorithm. | [S105][S105] |
| motion.durations | `motionDurationFast`: 0.1s<br>`motionDurationMid`: 0.2s<br>`motionDurationSlow`: 0.3s | [S98][S98], [S110][S110] |
| motion.easing curves | `motionEaseOutCirc`: cubic-bezier(0.08, 0.82, 0.17, 1)<br>`motionEaseInOutCirc`: cubic-bezier(0.78, 0.14, 0.15, 0.86)<br>`motionEaseOut`: cubic-bezier(0.215, 0.61, 0.355, 1)<br>`motionEaseInOut`: cubic-bezier(0.645, 0.045, 0.355, 1)<br>`motionEaseOutBack`: cubic-bezier(0.12, 0.4, 0.29, 1.46)<br>`motionEaseInBack`: cubic-bezier(0.71, -0.46, 0.88, 0.6)<br>`motionEaseInQuint`: cubic-bezier(0.755, 0.05, 0.855, 0.06)<br>`motionEaseOutQuint`: cubic-bezier(0.23, 1, 0.32, 1) | [S97][S97] |
| icons.set | Ant Design Icons | [S111][S111] |
| icons.licence | MIT: use, modification and redistribution permitted with copyright and permission notice retained. This is the code/assets licence, not a general endorsement or brand-name licence. | [S111][S111] |
| terms | MIT: use, modification and redistribution permitted with copyright and permission notice retained. This is the code/assets licence, not a general endorsement or brand-name licence.<br>Applies to code and published tokens; no separate permission to brand another product as Ant Design was established. | [S112][S112] |

**Gaps.**

- `colour.dark.neutral_ramp`, `colour.dark.accent`, `colour.dark.success`, `colour.dark.warning`, `colour.dark.danger`, `colour.dark.info`: Published dark generator is recorded, but literal outputs for the exact 5.29.3 dependency set were not verified.
- `type.font_licences.Helvetica Neue.web_licence`, `type.font_licences.Apple Color Emoji.web_licence`, `type.font_licences.SFMono-Regular.web_licence`, `type.font_licences.Liberation Mono.web_licence`, `type.font_licences.Menlo.web_licence`, `type.font_licences.Courier.web_licence`: Exact font-file web redistribution licence not verified. This face is only named as a local fallback; no font file should be bundled on this evidence.

## 13. TDesign — Tencent

**Status: full system published.** The common repository publishes web light/dark tokens, typography, sizes, shadows and animation constants; icon assets have a separate official repository. [S113][S113]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp | `--td-gray-color-1`: #f3f3f3<br>`--td-gray-color-2`: #eee<br>`--td-gray-color-3`: #e8e8e8<br>`--td-gray-color-4`: #ddd<br>`--td-gray-color-5`: #c6c6c6<br>`--td-gray-color-6`: #a6a6a6<br>`--td-gray-color-7`: #8b8b8b<br>`--td-gray-color-8`: #777<br>`--td-gray-color-9`: #5e5e5e<br>`--td-gray-color-10`: #4b4b4b<br>`--td-gray-color-11`: #393939<br>`--td-gray-color-12`: #2c2c2c<br>`--td-gray-color-13`: #242424<br>`--td-gray-color-14`: #181818<br>Same primitive greys in both modes; surface and text roles change. | `--td-gray-color-1`: #f3f3f3<br>`--td-gray-color-2`: #eee<br>`--td-gray-color-3`: #e8e8e8<br>`--td-gray-color-4`: #ddd<br>`--td-gray-color-5`: #c6c6c6<br>`--td-gray-color-6`: #a6a6a6<br>`--td-gray-color-7`: #8b8b8b<br>`--td-gray-color-8`: #777<br>`--td-gray-color-9`: #5e5e5e<br>`--td-gray-color-10`: #4b4b4b<br>`--td-gray-color-11`: #393939<br>`--td-gray-color-12`: #2c2c2c<br>`--td-gray-color-13`: #242424<br>`--td-gray-color-14`: #181818<br>Same primitive greys in both modes; surface and text roles change. | [S113][S113], [S114][S114] |
| accent | #0052d9<br>--td-brand-color alias resolved.  | #4582e6<br>--td-brand-color alias resolved.  | [S113][S113], [S114][S114] |
| success | #2ba471<br>--td-success-color alias resolved.  | #059465<br>--td-success-color alias resolved.  | [S113][S113], [S114][S114] |
| warning | #e37318<br>--td-warning-color alias resolved.  | #cf6e2d<br>--td-warning-color alias resolved.  | [S113][S113], [S114][S114] |
| danger | #d54941<br>--td-error-color alias resolved.  | #c64751<br>--td-error-color alias resolved.  | [S113][S113], [S114][S114] |
| info | #0052d9<br>--td-brand-color alias resolved. Info uses the Alert info icon mapping to @brand-color. | #4582e6<br>--td-brand-color alias resolved. Info uses the Alert info icon mapping to @brand-color. | [S113][S113], [S115][S115], [S114][S114], [S115][S115] |

| Additional publication | Value / scope | Sources |
|---|---|---|
| light.surface_roles | `--td-bg-color-page`: #eee<br>`--td-bg-color-container`: #fff<br>`--td-bg-color-secondarycontainer`: #f3f3f3<br>`--td-bg-color-component`: #e8e8e8<br>`--td-text-color-primary`: rgba(0, 0, 0, 90%)<br>`--td-text-color-secondary`: rgba(0, 0, 0, 60%)<br>`--td-text-color-disabled`: rgba(0, 0, 0, 26%) | [S113][S113] |
| dark.surface_roles | `--td-bg-color-page`: #181818<br>`--td-bg-color-container`: #242424<br>`--td-bg-color-secondarycontainer`: #2c2c2c<br>`--td-bg-color-component`: #393939<br>`--td-text-color-primary`: rgba(255, 255, 255, 90%)<br>`--td-text-color-secondary`: rgba(255, 255, 255, 55%)<br>`--td-text-color-disabled`: rgba(255, 255, 255, 22%) | [S114][S114] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces | PingFang SC first in the published stack; installation determines the selected face. | [S116][S116] |
| fallback | `--td-font-family`: PingFang SC, Microsoft YaHei, Arial Regular<br>`--td-font-family-medium`: PingFang SC, Microsoft YaHei, Arial Medium<br>Preserves the literal Arial Regular / Arial Medium names; their availability is not assumed. | [S116][S116] |
| text styles | `link-small`: `size`: 12px, `line_height`: 20px, `font_shorthand`: var(--td-font-size-link-small) / var(--td-line-height-link-small) var(--td-font-family)<br>`link-medium`: `size`: 14px, `line_height`: 22px, `font_shorthand`: var(--td-font-size-link-medium) / var(--td-line-height-link-medium) var(--td-font-family)<br>`link-large`: `size`: 16px, `line_height`: 24px, `font_shorthand`: var(--td-font-size-link-large) / var(--td-line-height-link-large) var(--td-font-family)<br>`mark-small`: `size`: 12px, `line_height`: 20px, `font_shorthand`: 600 var(--td-font-size-mark-small) / var(--td-line-height-mark-small) var(--td-font-family)<br>`mark-medium`: `size`: 14px, `line_height`: 22px, `font_shorthand`: 600 var(--td-font-size-mark-medium) / var(--td-line-height-mark-medium) var(--td-font-family)<br>`body-small`: `size`: 12px, `line_height`: 20px, `font_shorthand`: var(--td-font-size-body-small) / var(--td-line-height-body-small) var(--td-font-family)<br>`body-medium`: `size`: 14px, `line_height`: 22px, `font_shorthand`: var(--td-font-size-body-medium) / var(--td-line-height-body-medium) var(--td-font-family)<br>`body-large`: `size`: 16px, `line_height`: 24px, `font_shorthand`: var(--td-font-size-body-large) / var(--td-line-height-body-large) var(--td-font-family)<br>`title-small`: `size`: 14px, `line_height`: 22px, `font_shorthand`: 600 var(--td-font-size-title-small) / var(--td-line-height-title-small) var(--td-font-family)<br>`title-medium`: `size`: 16px, `line_height`: 24px, `font_shorthand`: 600 var(--td-font-size-title-medium) / var(--td-line-height-title-medium)     var(--td-font-family)<br>`title-large`: `size`: 18px, `line_height`: 26px, `font_shorthand`: 600 var(--td-font-size-title-large) / var(--td-line-height-title-large) var(--td-font-family)<br>`title-extraLarge`: `size`: 20px, `line_height`: 28px, `font_shorthand`: 600 var(--td-font-size-title-extraLarge) / var(--td-line-height-title-extraLarge)     var(--td-font-family)<br>`headline-small`: `size`: 24px, `line_height`: 32px, `font_shorthand`: 600 var(--td-font-size-headline-small) / var(--td-line-height-headline-small)     var(--td-font-family)<br>`headline-medium`: `size`: 28px, `line_height`: 36px, `font_shorthand`: 600 var(--td-font-size-headline-medium) / var(--td-line-height-headline-medium)     var(--td-font-family)<br>`headline-large`: `size`: 36px, `line_height`: 44px, `font_shorthand`: 600 var(--td-font-size-headline-large) / var(--td-line-height-headline-large)     var(--td-font-family)<br>`display-medium`: `size`: 48px, `line_height`: 56px, `font_shorthand`: 600 var(--td-font-size-display-medium) / var(--td-line-height-display-medium)     var(--td-font-family)<br>`display-large`: `size`: 64px, `line_height`: 72px, `font_shorthand`: 600 var(--td-font-size-display-large) / var(--td-line-height-display-large)     var(--td-font-family)<br>Shorthands are preserved, including implicit normal weight for body/link; no numeric weight is invented where the shorthand omits it. | [S116][S116] |
| weights | 600 is explicit for mark/title/headline/display; link/body shorthands omit weight (CSS normal). | [S116][S116] |

**Font licences.**

| Typeface / selector | Web licence | Source |
|---|---|---|
| PingFang SC, Arial Regular, Arial Medium |  |  |
| Microsoft YaHei | Installed-font CSS use permitted; the Windows font licence does not permit copying fonts to a web server or converting them to WOFF. Separate webfont rights would be needed for self-hosting. | [S16][S16] |

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps | `--td-radius-small`: 2px<br>`--td-radius-default`: 3px<br>`--td-radius-medium`: 6px<br>`--td-radius-large`: 9px<br>`--td-radius-extraLarge`: 12px<br>`--td-radius-round`: 999px<br>`--td-radius-circle`: 50% | [S117][S117] |
| shape and space.spacing scale | `--td-size-1`: 2px<br>`--td-size-2`: 4px<br>`--td-size-3`: 6px<br>`--td-size-4`: 8px<br>`--td-size-5`: 12px<br>`--td-size-6`: 16px<br>`--td-size-7`: 20px<br>`--td-size-8`: 24px<br>`--td-size-9`: 28px<br>`--td-size-10`: 32px<br>`--td-size-11`: 36px<br>`--td-size-12`: 40px<br>`--td-size-13`: 48px<br>`--td-size-14`: 56px<br>`--td-size-15`: 64px<br>`--td-size-16`: 72px<br>Published size primitives; component padding/margin aliases in the same file select these steps. | [S118][S118] |
| shape and space.control heights | `--td-comp-size-xxxs`: 16px<br>`--td-comp-size-xxs`: 20px<br>`--td-comp-size-xs`: 24px<br>`--td-comp-size-s`: 28px<br>`--td-comp-size-m`: 32px<br>`--td-comp-size-l`: 36px<br>`--td-comp-size-xl`: 40px<br>`--td-comp-size-xxl`: 48px<br>`--td-comp-size-xxxl`: 56px<br>`--td-comp-size-xxxxl`: 64px<br>`--td-comp-size-xxxxxl`: 72px<br>Component size tokens. Button S/M/L map to comp-size-xs/m/xl. | [S118][S118], [S119][S119] |
| elevation.light | `--td-shadow-1`: 0 1px 10px rgba(0, 0, 0, 5%), 0 4px 5px rgba(0, 0, 0, 8%), 0 2px 4px -1px rgba(0, 0, 0, 12%)<br>`--td-shadow-2`: 0 3px 14px 2px rgba(0, 0, 0, 5%), 0 8px 10px 1px rgba(0, 0, 0, 6%), 0 5px 5px -3px rgba(0, 0, 0, 10%)<br>`--td-shadow-3`: 0 6px 30px 5px rgba(0, 0, 0, 5%), 0 16px 24px 2px rgba(0, 0, 0, 4%), 0 8px 10px -5px rgba(0, 0, 0, 8%) | [S113][S113] |
| elevation.dark | `--td-shadow-1`: 0 4px 6px rgba(0, 0, 0, 6%), 0 1px 10px rgba(0, 0, 0, 8%), 0 2px 4px rgba(0, 0, 0, 12%)<br>`--td-shadow-2`: 0 8px 10px rgba(0, 0, 0, 12%), 0 3px 14px rgba(0, 0, 0, 10%), 0 5px 5px rgba(0, 0, 0, 16%)<br>`--td-shadow-3`: 0 16px 24px rgba(0, 0, 0, 14%), 0 6px 30px rgba(0, 0, 0, 12%), 0 8px 10px rgba(0, 0, 0, 20%) | [S114][S114] |
| motion.durations | `@anim-duration-base`: 0.2s<br>`@anim-duration-moderate`: 0.24s<br>`@anim-duration-slow`: 0.28s | [S120][S120] |
| motion.easing curves | `@anim-time-fn-easing`: cubic-bezier(0.38, 0, 0.24, 1)<br>`@anim-time-fn-ease-out`: cubic-bezier(0, 0, 0.15, 1)<br>`@anim-time-fn-ease-in`: cubic-bezier(0.82, 0, 1, 0.9) | [S120][S120] |
| icons.set | TDesign Icons | [S121][S121] |
| icons.licence | MIT: use, modification and redistribution permitted with copyright and permission notice retained. This is the code/assets licence, not a general endorsement or brand-name licence. | [S121][S121] |
| terms | MIT: use, modification and redistribution permitted with copyright and permission notice retained. This is the code/assets licence, not a general endorsement or brand-name licence.<br>System-font redistribution is not covered by the component-token licence. | [S122][S122] |

**Gaps.**

- `type.font_licences.PingFang SC.web_licence`, `type.font_licences.Arial Regular.web_licence`, `type.font_licences.Arial Medium.web_licence`: Exact font-file web redistribution licence not verified. This face is only named as a local fallback; no font file should be bundled on this evidence.

## 14. Arco Design — ByteDance

**Status: full system published.** The official React repository publishes colour primitives, semantic aliases, dark overrides, type and size tokens, shadows and motion. [S123][S123]

### Colour

| Role | Light | Dark | Sources |
|---|---|---|---|
| neutral ramp | `gray-1`: #f7f8fa<br>`gray-2`: #f2f3f5<br>`gray-3`: #e5e6eb<br>`gray-4`: #c9cdd4<br>`gray-5`: #a9aeb8<br>`gray-6`: #86909c<br>`gray-7`: #6b7785<br>`gray-8`: #4e5969<br>`gray-9`: #272e3b<br>`gray-10`: #1d2129<br>Neutral primitives selected by the mode-specific CSS variable mapping. | `gray-1`: #17171a<br>`gray-2`: #2e2e30<br>`gray-3`: #484849<br>`gray-4`: #5f5f60<br>`gray-5`: #78787a<br>`gray-6`: #929293<br>`gray-7`: #ababac<br>`gray-8`: #c5c5c5<br>`gray-9`: #dfdfdf<br>`gray-10`: #f6f6f6<br>Neutral primitives selected by the mode-specific CSS variable mapping. | [S124][S124], [S125][S125] |
| accent | rgb(22, 93, 255)<br>Published RGB channels for arcoblue-6, selected by semantic colour aliases.  | rgb(60, 126, 255)<br>Published RGB channels for arcoblue-6, selected by semantic colour aliases.  | [S126][S126], [S124][S124], [S125][S125] |
| success | rgb(0, 180, 42)<br>Published RGB channels for green-6, selected by semantic colour aliases.  | rgb(39, 195, 70)<br>Published RGB channels for green-6, selected by semantic colour aliases.  | [S126][S126], [S124][S124], [S125][S125] |
| warning | rgb(255, 125, 0)<br>Published RGB channels for orange-6, selected by semantic colour aliases.  | rgb(255, 150, 38)<br>Published RGB channels for orange-6, selected by semantic colour aliases.  | [S126][S126], [S124][S124], [S125][S125] |
| danger | rgb(245, 63, 63)<br>Published RGB channels for red-6, selected by semantic colour aliases.  | rgb(247, 105, 101)<br>Published RGB channels for red-6, selected by semantic colour aliases.  | [S126][S126], [S124][S124], [S125][S125] |
| info | rgb(22, 93, 255)<br>Published RGB channels for arcoblue-6, selected by semantic colour aliases. Alert info icon uses primary-6. | rgb(60, 126, 255)<br>Published RGB channels for arcoblue-6, selected by semantic colour aliases. Alert info icon uses primary-6. | [S126][S126], [S124][S124], [S125][S125], [S127][S127] |

| Additional publication | Value / scope | Sources |
|---|---|---|
| surface_roles | `@color-bg-1`: #fff<br>`@color-bg-2`: #fff<br>`@color-bg-3`: #fff<br>`@color-bg-4`: #fff<br>`@color-bg-5`: #fff<br>`@dark-color-bg-1`: #17171a<br>`@dark-color-bg-2`: #232324<br>`@dark-color-bg-3`: #2a2a2b<br>`@dark-color-bg-4`: #313132<br>`@dark-color-bg-5`: #373739 | [S123][S123] |

### Type

| Field | Published value / scope | Sources |
|---|---|---|
| typefaces | Inter first in the default UI stack; Consolas first in the code stack. | [S128][S128] |
| fallback | `@font-family`: Inter,-apple-system,BlinkMacSystemFont,PingFang SC,Hiragino Sans GB,noto sans,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif<br>`@code-family`: Consolas, Menlo | [S128][S128] |
| text styles | `h1`: `size`: 36px, `line_height`: 1.23, `weight`: 500<br>`h2`: `size`: 32px, `line_height`: 1.25, `weight`: 500<br>`h3`: `size`: 28px, `line_height`: 1.29, `weight`: 500<br>`h4`: `size`: 24px, `line_height`: 1.33, `weight`: 500<br>`h5`: `size`: 20px, `line_height`: 1.4, `weight`: 500<br>`h6`: `size`: 16px, `line_height`: 1.5, `weight`: 500<br>`body`: `size`: 14px, `line_height`: 1.5715<br>Typography component styles. Heading line heights come from its implementation; body size/leading come from defaults. No explicit body weight is asserted. | [S129][S129], [S130][S130], [S123][S123], [S128][S128] |
| weights | `@font-weight-100`: 100<br>`@font-weight-200`: 200<br>`@font-weight-300`: 300<br>`@font-weight-400`: 400<br>`@font-weight-500`: 500<br>`@font-weight-600`: 600<br>`@font-weight-700`: 700<br>`@font-weight-800`: 800<br>`@font-weight-900`: 900<br>Weight primitives; Typography headings and bold text specifically select 500. | [S123][S123] |
| size tokens | `@font-size-display-3`: 56px<br>`@font-size-display-2`: 48px<br>`@font-size-display-1`: 36px<br>`@font-size-title-3`: 24px<br>`@font-size-title-2`: 20px<br>`@font-size-title-1`: 16px<br>`@font-size-body-3`: 14px<br>`@font-size-body-2`: 13px<br>`@font-size-body-1`: 12px<br>`@font-size-caption`: 12px | [S123][S123] |

**Font licences.**

| Typeface / selector | Web licence | Source |
|---|---|---|
| Inter | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S12][S12] |
| -apple-system, BlinkMacSystemFont, sans-serif | Generic family or platform selector, not a bundled font file. No separate font is supplied by this stack. | [S128][S128] |
| PingFang SC, Hiragino Sans GB, Helvetica Neue, Helvetica, Menlo |  |  |
| noto sans | SIL OFL 1.1: web embedding and redistribution permitted; retain copyright and licence; do not sell the font by itself; observe any Reserved Font Names for derivatives. | [S34][S34] |
| Microsoft YaHei, Arial, Consolas | Installed-font CSS use permitted; the Windows font licence does not permit copying fonts to a web server or converting them to WOFF. Separate webfont rights would be needed for self-hosting. | [S16][S16] |

### Shape, elevation, motion and reuse

| Field | Published value / scope | Sources |
|---|---|---|
| shape and space.radius steps | `@border-radius-none`: 0<br>`@border-radius-small`: 2px<br>`@border-radius-medium`: 4px<br>`@border-radius-large`: 8px<br>`@border-radius-circle`: 50% | [S123][S123] |
| shape and space.spacing scale | `@spacing-none`: 0<br>`@spacing-1`: 2px<br>`@spacing-2`: 4px<br>`@spacing-3`: 6px<br>`@spacing-4`: 8px<br>`@spacing-5`: 10px<br>`@spacing-6`: 12px<br>`@spacing-7`: 16px<br>`@spacing-8`: 20px<br>`@spacing-9`: 24px<br>`@spacing-10`: 32px<br>`@spacing-11`: 36px<br>`@spacing-12`: 40px<br>`@spacing-13`: 48px<br>`@spacing-14`: 56px<br>`@spacing-15`: 60px<br>`@spacing-16`: 64px<br>`@spacing-17`: 72px<br>`@spacing-18`: 80px<br>`@spacing-19`: 84px<br>`@spacing-20`: 96px<br>`@spacing-21`: 100px<br>`@spacing-22`: 120px | [S123][S123] |
| shape and space.control heights | `@size-mini`: 24px<br>`@size-small`: 28px<br>`@size-default`: 32px<br>`@size-large`: 36px<br>Button height aliases select the global mini/small/default/large sizes. | [S123][S123], [S131][S131] |
| elevation | `@shadow-none`: none<br>`@shadow-special`: 0 0 1px rgba(0, 0, 0, 0.3)<br>`@shadow1-center`: 0 0 5px rgba(0, 0, 0, 0.1)<br>`@shadow1-up`: 0 -2px 5px rgba(0, 0, 0, 0.1)<br>`@shadow1-down`: 0 2px 5px rgba(0, 0, 0, 0.1)<br>`@shadow1-left`: -2px 0 5px rgba(0, 0, 0, 0.1)<br>`@shadow1-right`: 2px 0 5px rgba(0, 0, 0, 0.1)<br>`@shadow1-left-up`: -2px -2px 5px rgba(0, 0, 0, 0.1)<br>`@shadow1-left-down`: -2px 2px 5px rgba(0, 0, 0, 0.1)<br>`@shadow1-right-up`: 2px -2px 5px rgba(0, 0, 0, 0.1)<br>`@shadow1-right-down`: 2px 2px 5px rgba(0, 0, 0, 0.1)<br>`@shadow2-center`: 0 0 10px rgba(0, 0, 0, 0.1)<br>`@shadow2-up`: 0 -4px 10px rgba(0, 0, 0, 0.1)<br>`@shadow2-down`: 0 4px 10px rgba(0, 0, 0, 0.1)<br>`@shadow2-left`: -4px 0 10px rgba(0, 0, 0, 0.1)<br>`@shadow2-right`: 4px 0 10px rgba(0, 0, 0, 0.1)<br>`@shadow2-left-up`: -4px -4px 10px rgba(0, 0, 0, 0.1)<br>`@shadow2-left-down`: -4px 4px 10px rgba(0, 0, 0, 0.1)<br>`@shadow2-right-up`: 4px -4px 10px rgba(0, 0, 0, 0.1)<br>`@shadow2-right-down`: 4px 4px 10px rgba(0, 0, 0, 0.1)<br>`@shadow3-center`: 0 0 20px rgba(0, 0, 0, 0.1)<br>`@shadow3-up`: 0 -8px 20px rgba(0, 0, 0, 0.1)<br>`@shadow3-down`: 0 8px 20px rgba(0, 0, 0, 0.1)<br>`@shadow3-left`: -8px 0 20px rgba(0, 0, 0, 0.1)<br>`@shadow3-right`: 8px 0 20px rgba(0, 0, 0, 0.1)<br>`@shadow3-left-up`: -8px -8px 20px rgba(0, 0, 0, 0.1)<br>`@shadow3-left-down`: -8px 8px 20px rgba(0, 0, 0, 0.1)<br>`@shadow3-right-up`: 8px -8px 20px rgba(0, 0, 0, 0.1)<br>`@shadow3-right-down`: 8px 8px 20px rgba(0, 0, 0, 0.1)<br>Shared shadow recipes, including directional variants; no separate dark shadow scale in the opened theme. | [S123][S123] |
| motion.durations | `@transition-duration-1`: 0.1s<br>`@transition-duration-2`: 0.2s<br>`@transition-duration-3`: 0.3s<br>`@transition-duration-4`: 0.4s<br>`@transition-duration-5`: 0.5s<br>`@transition-duration-loading`: 1s | [S128][S128] |
| motion.easing curves | `@transition-timing-function-linear`: cubic-bezier(0, 0, 1, 1)<br>`@transition-timing-function-standard`: cubic-bezier(0.34, 0.69, 0.1, 1)<br>`@transition-timing-function-overshoot`: cubic-bezier(0.3, 1.3, 0.3, 1)<br>`@transition-timing-function-decelerate`: cubic-bezier(0.4, 0.8, 0.74, 1)<br>`@transition-timing-function-accelerate`: cubic-bezier(0.26, 0, 0.6, 0.2) | [S128][S128] |
| icons.set | Arco built-in React icons (icon directory) | [S132][S132] |
| icons.licence | MIT: use, modification and redistribution permitted with copyright and permission notice retained. This is the code/assets licence, not a general endorsement or brand-name licence.<br>Repository licence; logo/trademark icons are not permission to imply endorsement. | [S133][S133] |
| terms | MIT: use, modification and redistribution permitted with copyright and permission notice retained. This is the code/assets licence, not a general endorsement or brand-name licence.<br>No separate ByteDance/Arco product-name or brand-mark permission was established. | [S133][S133] |

**Gaps.**

- `type.font_licences.PingFang SC.web_licence`, `type.font_licences.Hiragino Sans GB.web_licence`, `type.font_licences.Helvetica Neue.web_licence`, `type.font_licences.Helvetica.web_licence`, `type.font_licences.Menlo.web_licence`: Exact font-file web redistribution licence not verified. This face is only named as a local fallback; no font file should be bundled on this evidence.

## Not verified

- **Apple:** no numeric macOS neutral ramp, radius/spacing scale, push-button height scale or general motion curves/durations confirmed. iOS greys are specifically UIKit `systemGray*`; no claim of matching SwiftUI gray is made. Increased-contrast variants exist but are outside the default-light/default-dark table. SF Symbols general web redistribution rights were not established. [HIG colour](https://developer.apple.com/design/human-interface-guidelines/color), [SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols).
- **Linear:** the [brand page](https://linear.app/brand) prints inconsistent Nordic Gray hex/RGB. A numeric accent and the LCH generator inputs/implementation were not found in the opened article. No reconstruction from the application was attempted.
- **Anthropic:** the [official brand skill](https://github.com/anthropics/skills/blob/ca45fc496a3436251f191354091d557da31c15b5/skills/brand-guidelines/SKILL.md) is not a Claude UI specification. Claude-specific application colours, fonts, radii, shadows, spacing, icons and motion remain unverified.
- **Vercel:** the [colour page](https://vercel.com/geist/colors) advertises raw-value copying, but the browser host was unavailable and the text reader did not expose those values. `/geist/colors.md`, `/geist/typography.md` and `/geist/materials.md` did not open. The [icon link](https://vercel.com/geist/geistcn-icons) redirected to Introduction. [design.md](https://vercel.com/design.md) and [design.dark.md](https://vercel.com/design.dark.md) returned the same report/brand-site guidance; neither established light/dark UI token values. No stylesheet was mined to fill the gaps.
- **Primer:** the current stack starts with Mona Sans VF; do not silently replace it with a remembered older system stack. The [existing numbers report](2026-10-29-design-system-numbers.md#6-github-primer-work-tool-short) records a token-versus-prose line-height mismatch. Exact webfont licences for Noto Sans Backtick Fix, Helvetica, Apple Color Emoji, SFMono-Regular, SF Mono, Menlo and Liberation Mono were not verified in this audit.
- **Material 3:** the pinned Material Web baseline is v0.192. Newer Expressive measurements are not interchangeable. No success/warning/info role, general spacing scale or fallback stack was confirmed in this baseline. Elevation levels were recorded without inventing CSS shadows. The current Buttons Specs page returned a JavaScript shell; sizes remain a reference to the existing numbers report, not a new verification of that page.
- **Fluent 2:** the package radius scale differs from the earlier website table; both are identified rather than merged. The info colour is specifically MessageBar’s neutral icon, not a global info token. Segoe UI Web (West European), Helvetica Neue and Courier font-file licences were not confirmed.
- **Stripe:** readable [Apps styling docs](https://docs.stripe.com/stripe-apps/style) establish numeric spacing but only named colours/text/radii. The separate Icon component URL returned no usable text. `/marks` returned 404; the applicable page read was [legal/marks](https://stripe.com/legal/marks). Marketing-site tokens and a standalone icon licence were not confirmed.
- **Notion:** [notion.com/brand](https://www.notion.com/brand) returned 401; the linked [Notion Brand Guidelines](https://notion.notion.site/Notion-Brand-Guidelines-db8fda2d1f0048bba1f4e547dfc48830) could not be fetched (reader 400 / connector 404; text fallback only returned an unrendered shell). The attempted `/help/notions-logo` page was inaccessible. No values from unofficial Notion-inspired kits were used.
- **Raycast:** the [colour API](https://developers.raycast.com/api-reference/user-interface/colors) examples demonstrate user-supplied raw/dynamic colours; they are not default theme tokens. Native typography, shape, elevation, motion, icon reuse rights and brand terms were not confirmed.
- **Atlassian:** [llms-tokens.txt](https://atlassian.design/llms-tokens.txt) explicitly labels its values as examples and differs from the pinned package: palette, bold weight and code typography differ. This report uses the [official Bitbucket token export](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/d0f0e4cc8e8d0c44b1ae27991d6399d1b1589f1d/design-system/tokens/src/artifacts/tokens-raw/atlassian-light.tsx), not those examples, for numerical fields. The attempted GitHub mirror returned 404; the official Bitbucket mirror was readable. A guessed typography package directory returned 404. Separate font-file licences for Atlassian Sans/Mono, Charlie Sans/Display/Text, Ubuntu/Ubuntu Mono, Helvetica Neue, Menlo and Segoe UI Mono, and a control-height scale, remain unverified. The live site calls motion early access. [Token-package Apache-2.0](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/d0f0e4cc8e8d0c44b1ae27991d6399d1b1589f1d/design-system/tokens/LICENSE) and [site-wide ADS restrictions](https://atlassian.design/license/) have different scopes; neither establishes the missing font licences.
- **Ant Design 5:** the [official colours repository snapshot](https://github.com/ant-design/ant-design-colors/blob/89b4a5b7e989b792610087abe855bf4a2fb1d322/tests/__snapshots__/presets.test.ts.snap) was opened, but it is a different dependency snapshot and its red preset is not the v5 error seed. It was not substituted for the exact v5.29.3 dark output. Dark colour fields therefore remain null with the published generator recorded separately. Exact webfont licences for Helvetica Neue, Apple Color Emoji, SFMono-Regular, Liberation Mono, Menlo and Courier were not confirmed.
- **TDesign:** PingFang SC and the literal `Arial Regular` / `Arial Medium` font-file web licences were not verified. The React Message page was inaccessible, but official common-source Alert mappings establish info/status colours. Its message dismissal timeout was deliberately not used as a motion duration.
- **Arco:** the icon website returned no readable content; the repository icon directory/package and root licence were read instead. A guessed Icon README and palette Less path returned 404; actual colour definitions and compiled token source were used. PingFang SC, Hiragino Sans GB, Helvetica Neue, Helvetica and Menlo webfont licences remain unverified.

No behaviour claims were tested or added to a product page: this is a publication audit. No application build, browser suite, deployment, package publication or model API call is needed for the two research deliverables.

## Source index

Reference labels above link directly to the source file/page. Repository URLs include an immutable commit or the explicit Ant Design 5.29.3 tag.

[S1]: https://developer.apple.com/design/human-interface-guidelines/color
[S2]: https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color.json
[S3]: https://developer.apple.com/design/human-interface-guidelines/typography
[S4]: https://developer.apple.com/fonts/
[S5]: https://developer.apple.com/design/human-interface-guidelines/buttons
[S6]: https://developer.apple.com/videos/play/wwdc2025/356/
[S7]: https://developer.apple.com/design/human-interface-guidelines/materials
[S8]: https://developer.apple.com/design/human-interface-guidelines/motion
[S9]: https://developer.apple.com/design/human-interface-guidelines/sf-symbols
[S10]: https://linear.app/now/how-we-redesigned-the-linear-ui
[S11]: https://linear.app/brand
[S12]: https://github.com/rsms/inter/blob/353b61b9f4430d5f420d56605a6e7993e0941470/LICENSE.txt
[S13]: https://github.com/anthropics/skills/blob/ca45fc496a3436251f191354091d557da31c15b5/skills/brand-guidelines/SKILL.md
[S14]: https://github.com/google/fonts/blob/6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec/ofl/poppins/OFL.txt
[S15]: https://github.com/google/fonts/blob/6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec/ofl/lora/OFL.txt
[S16]: https://learn.microsoft.com/en-us/typography/fonts/font-faq
[S17]: https://github.com/anthropics/skills/blob/ca45fc496a3436251f191354091d557da31c15b5/skills/brand-guidelines/LICENSE.txt
[S18]: https://vercel.com/geist/introduction
[S19]: https://vercel.com/geist/colors
[S20]: https://github.com/vercel/geist-font/blob/2e554ff2ea3979b63afe770af6424eb8b9490a74/readme.md
[S21]: https://vercel.com/geist/typography
[S22]: https://github.com/vercel/geist-font/blob/2e554ff2ea3979b63afe770af6424eb8b9490a74/OFL.txt
[S23]: https://vercel.com/geist/materials
[S24]: https://vercel.com/design/guidelines
[S25]: https://vercel.com/geist/icons
[S26]: https://vercel.com/geist/brands
[S27]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/functional/color/fgColor.json5
[S28]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/base/color/light/light.json5
[S29]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/base/color/dark/dark.json5
[S30]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/functional/typography/font-stack.json5
[S31]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/functional/typography/typography.json5
[S32]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/base/typography/typography.json5
[S33]: https://github.com/github/mona-sans/blob/4bc6ba8b354c36b4fb66d32cd67b4c1f2beb0a06/LICENSE
[S34]: https://github.com/google/fonts/blob/6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec/ofl/notosans/OFL.txt
[S35]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/functional/size/radius.json5
[S36]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/base/size/size.json5
[S37]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/functional/size/size.json5
[S38]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/functional/shadow/shadow.json5
[S39]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/component/overlay.json5
[S40]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/functional/color/borderColor.json5
[S41]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/base/motion/timing.json5
[S42]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/base/motion/easing.json5
[S43]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/src/tokens/functional/motion/motion.json5
[S44]: https://github.com/primer/octicons/blob/9c3c9d7426881584f6f507f3f4a54aea5879648e/LICENSE
[S45]: https://github.com/primer/primitives/blob/ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9/LICENSE
[S46]: https://github.com/material-components/material-web/blob/de5470f7ed6a653457ca8f5cc0e7f7602c7a8391/tokens/versions/v0_192/_md-sys-color.scss
[S47]: https://github.com/material-components/material-web/blob/de5470f7ed6a653457ca8f5cc0e7f7602c7a8391/tokens/versions/v0_192/_md-ref-palette.scss
[S48]: https://github.com/material-components/material-web/blob/de5470f7ed6a653457ca8f5cc0e7f7602c7a8391/tokens/versions/v0_192/_md-ref-typeface.scss
[S49]: https://github.com/material-components/material-web/blob/de5470f7ed6a653457ca8f5cc0e7f7602c7a8391/tokens/versions/v0_192/_md-sys-typescale.scss
[S50]: https://github.com/google/fonts/blob/6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec/ofl/roboto/OFL.txt
[S51]: https://github.com/material-components/material-web/blob/de5470f7ed6a653457ca8f5cc0e7f7602c7a8391/tokens/versions/v0_192/_md-sys-shape.scss
[S52]: https://m3.material.io/components/buttons/specs
[S53]: https://github.com/material-components/material-web/blob/de5470f7ed6a653457ca8f5cc0e7f7602c7a8391/tokens/versions/v0_192/_md-sys-elevation.scss
[S54]: https://github.com/material-components/material-web/blob/de5470f7ed6a653457ca8f5cc0e7f7602c7a8391/tokens/versions/v0_192/_md-sys-motion.scss
[S55]: https://github.com/google/material-design-icons/blob/10ecc14790612ca8fd164e3f4ffe9c16fc50d5b7/LICENSE
[S56]: https://github.com/material-components/material-web/blob/de5470f7ed6a653457ca8f5cc0e7f7602c7a8391/LICENSE
[S57]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/themes/web/lightTheme.ts
[S58]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/global/colors.ts
[S59]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/global/brandColors.ts
[S60]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/alias/lightColor.ts
[S61]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/alias/darkColor.ts
[S62]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/themes/web/darkTheme.ts
[S63]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/statusColorMapping.ts
[S64]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/alias/lightColorPalette.ts
[S65]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/alias/darkColorPalette.ts
[S66]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/react-components/react-message-bar/library/src/components/MessageBar/useMessageBarStyles.styles.ts
[S67]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/global/fonts.ts
[S68]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/global/borderRadius.ts
[S69]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/global/spacings.ts
[S70]: https://fluent2.microsoft.design/layout
[S71]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/utils/shadows.ts
[S72]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/utils/createLightTheme.ts
[S73]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/utils/createDarkTheme.ts
[S74]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/global/durations.ts
[S75]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/packages/tokens/src/global/curves.ts
[S76]: https://github.com/microsoft/fluentui-system-icons/blob/9eb184e96268d3293462f9d9d19225b4c7b07774/LICENSE
[S77]: https://github.com/microsoft/fluentui/blob/a22af26f14588c5af093871bbf6150641250610e/LICENSE
[S78]: https://docs.stripe.com/stripe-apps/style
[S79]: https://stripe.com/legal/marks
[S80]: https://www.notion.com/help/customize-and-style-your-content
[S81]: https://developers.notion.com/reference/rich-text
[S82]: https://developers.raycast.com/api-reference/user-interface
[S83]: https://developers.raycast.com/api-reference/user-interface/colors
[S84]: https://developers.raycast.com/api-reference/user-interface/icons-and-images
[S85]: https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/d0f0e4cc8e8d0c44b1ae27991d6399d1b1589f1d/design-system/tokens/src/artifacts/tokens-raw/atlassian-light.tsx
[S86]: https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/d0f0e4cc8e8d0c44b1ae27991d6399d1b1589f1d/design-system/tokens/LICENSE
[S87]: https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/d0f0e4cc8e8d0c44b1ae27991d6399d1b1589f1d/design-system/tokens/src/artifacts/palettes-raw/palette.tsx
[S88]: https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/d0f0e4cc8e8d0c44b1ae27991d6399d1b1589f1d/design-system/tokens/src/artifacts/tokens-raw/atlassian-dark.tsx
[S89]: https://atlassian.design/foundations/typography/product-typefaces-and-scale/
[S90]: https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/d0f0e4cc8e8d0c44b1ae27991d6399d1b1589f1d/design-system/tokens/src/artifacts/tokens-raw/atlassian-typography.tsx
[S91]: https://atlassian.design/foundations/typography/
[S92]: https://atlassian.design/license/
[S93]: https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/d0f0e4cc8e8d0c44b1ae27991d6399d1b1589f1d/design-system/tokens/src/artifacts/tokens-raw/atlassian-shape.tsx
[S94]: https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/d0f0e4cc8e8d0c44b1ae27991d6399d1b1589f1d/design-system/tokens/src/artifacts/tokens-raw/atlassian-spacing.tsx
[S95]: https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/d0f0e4cc8e8d0c44b1ae27991d6399d1b1589f1d/design-system/tokens/src/artifacts/tokens-raw/atlassian-motion.tsx
[S96]: https://atlassian.design/llms.txt
[S97]: https://github.com/ant-design/ant-design/blob/5.29.3/components/theme/themes/seed.ts
[S98]: https://5x.ant.design/docs/react/customize-theme/
[S99]: https://github.com/ant-design/ant-design/blob/5.29.3/components/theme/themes/default/colors.ts
[S100]: https://github.com/ant-design/ant-design/blob/5.29.3/components/theme/themes/shared/genColorMapToken.ts
[S101]: https://github.com/ant-design/ant-design/blob/5.29.3/components/theme/themes/default/colorAlgorithm.ts
[S102]: https://github.com/ant-design/ant-design/blob/5.29.3/components/theme/themes/dark/colors.ts
[S103]: https://github.com/ant-design/ant-design/blob/5.29.3/components/theme/themes/dark/colorAlgorithm.ts
[S104]: https://github.com/ant-design/ant-design/blob/5.29.3/components/theme/themes/shared/genFontMapToken.ts
[S105]: https://github.com/ant-design/ant-design/blob/5.29.3/components/theme/util/alias.ts
[S106]: https://github.com/google/fonts/blob/6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec/ofl/notocoloremoji/OFL.txt
[S107]: https://github.com/ant-design/ant-design/blob/5.29.3/components/theme/themes/shared/genRadius.ts
[S108]: https://github.com/ant-design/ant-design/blob/5.29.3/components/theme/themes/shared/genSizeMapToken.ts
[S109]: https://github.com/ant-design/ant-design/blob/5.29.3/components/theme/themes/shared/genControlHeight.ts
[S110]: https://github.com/ant-design/ant-design/blob/5.29.3/components/theme/themes/shared/genCommonMapToken.ts
[S111]: https://github.com/ant-design/ant-design-icons/blob/7f2516ac91226d2b41f93b35cb5197c8d94f7189/LICENSE
[S112]: https://github.com/ant-design/ant-design/blob/5.29.3/LICENSE
[S113]: https://github.com/Tencent/tdesign-common/blob/d41f945f19a5d7fff2bcf9bfb5aad818293719bc/style/web/theme/_light.less
[S114]: https://github.com/Tencent/tdesign-common/blob/d41f945f19a5d7fff2bcf9bfb5aad818293719bc/style/web/theme/_dark.less
[S115]: https://github.com/Tencent/tdesign-common/blob/d41f945f19a5d7fff2bcf9bfb5aad818293719bc/style/web/components/alert/_var.less
[S116]: https://github.com/Tencent/tdesign-common/blob/d41f945f19a5d7fff2bcf9bfb5aad818293719bc/style/web/theme/_font.less
[S117]: https://github.com/Tencent/tdesign-common/blob/d41f945f19a5d7fff2bcf9bfb5aad818293719bc/style/web/theme/_radius.less
[S118]: https://github.com/Tencent/tdesign-common/blob/d41f945f19a5d7fff2bcf9bfb5aad818293719bc/style/web/theme/_size.less
[S119]: https://github.com/Tencent/tdesign-common/blob/d41f945f19a5d7fff2bcf9bfb5aad818293719bc/style/web/components/button/_var.less
[S120]: https://github.com/Tencent/tdesign-common/blob/d41f945f19a5d7fff2bcf9bfb5aad818293719bc/style/web/_variables.less
[S121]: https://github.com/Tencent/tdesign-icons/blob/baf75693231b53188df110fbcbdfb50b090d76e5/LICENSE
[S122]: https://github.com/Tencent/tdesign-common/blob/d41f945f19a5d7fff2bcf9bfb5aad818293719bc/LICENSE
[S123]: https://github.com/arco-design/arco-design/blob/e34b8bd23971aff86df2fa7ac2717b8010c4d531/components/style/theme/global.less
[S124]: https://github.com/arco-design/arco-design/blob/e34b8bd23971aff86df2fa7ac2717b8010c4d531/components/style/theme/color/colors.less
[S125]: https://github.com/arco-design/arco-design/blob/e34b8bd23971aff86df2fa7ac2717b8010c4d531/components/style/theme/color/css-variables.less
[S126]: https://github.com/arco-design/arco-design/blob/e34b8bd23971aff86df2fa7ac2717b8010c4d531/components/style/theme/color/compiled-colors.less
[S127]: https://github.com/arco-design/arco-design/blob/e34b8bd23971aff86df2fa7ac2717b8010c4d531/components/Alert/style/token.less
[S128]: https://github.com/arco-design/arco-design/blob/e34b8bd23971aff86df2fa7ac2717b8010c4d531/components/style/theme/default.less
[S129]: https://github.com/arco-design/arco-design/blob/e34b8bd23971aff86df2fa7ac2717b8010c4d531/components/Typography/style/token.less
[S130]: https://github.com/arco-design/arco-design/blob/e34b8bd23971aff86df2fa7ac2717b8010c4d531/components/Typography/style/index.less
[S131]: https://github.com/arco-design/arco-design/blob/e34b8bd23971aff86df2fa7ac2717b8010c4d531/components/Button/style/token.less
[S132]: https://github.com/arco-design/arco-design/blob/e34b8bd23971aff86df2fa7ac2717b8010c4d531/icon/package.json
[S133]: https://github.com/arco-design/arco-design/blob/e34b8bd23971aff86df2fa7ac2717b8010c4d531/LICENSE
