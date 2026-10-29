# Design-system numbers: Work tool vs Consumer app

Research for the two design systems the handbook will build on. The **Work tool** system covers trackers, admin, editors and settings on desktop. The **Consumer app** system covers social, commerce and personal apps, mostly on a phone. Every number below comes from the owning system's own documentation or its own source repo. If a number wasn't on a first-party page, the table says **not found**.

Leads checked: iOS body 17 pt (**confirmed**), iOS minimum target 44×44 pt (**confirmed, with a correction**: 44×44 is the *default* control size and 28×28 pt the stated *minimum*), macOS body 13 pt (**confirmed**), Material 3 Body Large 16 (**confirmed**, as `1rem` in tokens), Material touch target 48×48 dp (**confirmed**), Fluent 2 / Carbon / Primer body 14 px (**confirmed** for all three).

**Labels.**
- **Verified**: read on the system's own page this session (2026-10-29). Apple HIG pages render client-side, so they were read from their JSON source (`developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`), which is the same content. m3.material.io was read in a real browser.
- **Measured**: read from the system's own source repo (material-components/material-web, microsoft/fluentui, carbon-design-system/carbon, primer/primitives, Shopify/polaris). The file path is given.
- **Computed**: worked out here from verified or measured values, with the method stated.

Quotes are under 15 words. Where a value sits in a table on the page, the pointer names the table.

---

## 1. Apple HIG: iOS / iPadOS (Consumer reference)

| Property | Value | Quote / pointer | URL |
|---|---|---|---|
| Default body size | **17 pt** | "Ensuring legibility" table, row "iOS, iPadOS": Default size 17 pt (**verified**) | https://developer.apple.com/design/human-interface-guidelines/typography |
| Smallest text | **11 pt** | Same table, Minimum size 11 pt (**verified**) | same |
| Dynamic Type default | **Large**: Body 17/22, Callout 16/21, Subhead 15/20, Footnote 13/18, Caption 1 12/16, Caption 2 11/13 (size/leading, pt) | Specifications › "iOS, iPadOS Dynamic Type sizes" › heading "Large (default)" (**verified**) | same |
| Dynamic Type range for Body | 14 pt (xSmall) to 23 pt (xxxLarge), 53 pt at AX5 | Same section, xSmall and AX5 tables (**verified**) | same |
| Text enlargement | at least 200% | "give people the option to enlarge text by at least 200 percent" (**verified**) | https://developer.apple.com/design/human-interface-guidelines/accessibility |
| Control size | **default 44×44 pt, minimum 28×28 pt** | "Offer sufficiently sized controls" table, row "iOS, iPadOS" (**verified**) | same |
| Button hit region | 44×44 pt | "a button needs a hit region of at least 44x44 pt" (**verified**) | https://developer.apple.com/design/human-interface-guidelines/buttons |
| Spacing between controls | ~12 pt around bezelled elements, ~24 pt around bezel-less ones | "add about 12 points of padding around elements that include a bezel" (**verified**) | https://developer.apple.com/design/human-interface-guidelines/accessibility |
| Spacing base / grid unit | **not found** | Layout page gives safe areas, margins and layout guides, no unit | https://developer.apple.com/design/human-interface-guidelines/layout |
| Corner radius scale | **not found** | No radius values on Layout, Buttons or Color | — |
| Prominent buttons | one or two per view | "Keep the number of prominent buttons to one or two per view." (**verified**) | https://developer.apple.com/design/human-interface-guidelines/buttons |
| How much tint | colour only for emphasis | "Apply color sparingly to the Liquid Glass material" … "reserve it for elements that truly benefit from emphasis, such as status indicators or primary actions"; "Refrain from adding color to the background of multiple controls." (**verified**) | https://developer.apple.com/design/human-interface-guidelines/color |
| Brand colour as accent | fine when content is monochrome | "choosing your brand color as the app accent color can be an effective way" (context: apps "with primarily monochromatic content") (**verified**) | same |
| System backgrounds | two sets, **system** and **grouped**, each primary / secondary / tertiary | "Primary for the overall view", "Secondary for grouping content", "Tertiary for grouping content … within secondary" (**verified**) | same |

Change logs: Typography 16 Dec 2025, Buttons 16 Dec 2025, Color 16 Dec 2025, Accessibility 9 Jun 2025.

## 2. Apple HIG: macOS (Work-tool reference)

| Property | Value | Quote / pointer | URL |
|---|---|---|---|
| Default body size | **13 pt** | "Ensuring legibility" table, row "macOS": Default size 13 pt (**verified**) | https://developer.apple.com/design/human-interface-guidelines/typography |
| Smallest text | **10 pt** | Same table, Minimum size 10 pt (**verified**) | same |
| Built-in text styles | Body 13/16, Callout 12/15, Subheadline 11/14, Footnote 10/13, Caption 1 10/13, Caption 2 10/13 (size/line height, pt); Headline is Bold 13/16 | Specifications › "macOS built-in text styles" table (**verified**) | same |
| Dynamic Type | **not used**: macOS has fixed built-in styles; the macOS section lists dynamic font variant APIs instead | Platform considerations › macOS (**verified**) | same |
| Control size | **default 28×28 pt, minimum 20×20 pt** | "Offer sufficiently sized controls" table, row "macOS" (**verified**) | https://developer.apple.com/design/human-interface-guidelines/accessibility |
| Button hit region | 44×44 pt is stated as the general rule for all input | "whether they use a fingertip, a pointer, their eyes, or a remote" (**verified**). This conflicts with the 28×28 pt macOS default above; the page doesn't reconcile them | https://developer.apple.com/design/human-interface-guidelines/buttons |
| Push-button heights (mini/small/regular/large) | **not found** | Buttons › macOS describes push, square and help buttons, with no heights | same |
| Spacing base | **not found** | — | https://developer.apple.com/design/human-interface-guidelines/layout |
| Corner radius | **not found** | — | — |
| Accent colour | app accent applies to "buttons, selection highlighting, and sidebar icons"; the user's choice in System Settings replaces it unless set to multicolor | Color › macOS (**verified**) | https://developer.apple.com/design/human-interface-guidelines/color |
| System backgrounds | named dynamic colours: window background, control background ("a large interface element, such as a browser or table"), under page background, alternating content background, selected content background | Color › macOS system colour table (**verified**) | same |

## 3. Material Design 3 (Consumer reference)

| Property | Value | Quote / pointer | URL |
|---|---|---|---|
| Key base size | **14** (Body Medium) | "Major Second type scale with 14 as its key base size" (**verified**) | https://m3.material.io/styles/typography/type-scale-tokens |
| Body Large | **16 / 24**, tracking 0.5 px (`1rem` / `1.5rem` / `0.03125rem`) | `body-large-size`, `body-large-line-height` (**measured**) | https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-typescale.scss |
| Body Medium | **14 / 20** (`0.875rem` / `1.25rem`) | `body-medium-*` (**measured**) | same |
| Body Small | **12 / 16** | `body-small-*` (**measured**) | same |
| Label Large / Medium / Small | **14/20, 12/16, 11/16** | `label-*-size`, `label-*-line-height` (**measured**) | same |
| Smallest text | **11** (Label Small, `0.6875rem`) | (**measured**) | same |
| Touch target | **48×48 dp** | "consider making touch targets at least 48 x 48dp" (**verified**) | https://m3.material.io/foundations/designing/structure |
| Pointer target | 44×44 dp | "Consider making pointer targets minimums 44 x 44dp." (**verified**) | same |
| Target spacing | 8 dp | "targets separated by 8dp of space or more" (**verified**) | same |
| Button height (baseline M3) | **40 dp** | filled button `container-height: 40px` (**measured**) | https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-filled-button.scss |
| Button sizes (M3 Expressive) | XS / S (default) / M / L / XL exist; heights are only in a diagram | Buttons › Specs › "Measurements", alt "Diagram of measurements of all button sizes." Heights **not extracted** | https://m3.material.io/components/buttons/specs |
| Button corners | Full (round) by default; square XS–XL: 12/12/16/28/28 dp | "Corner sizes" table (**verified**) | same |
| Text field height | **56 dp** | Specs table, "Default container height 56dp" (**verified**) | https://m3.material.io/components/text-fields/specs |
| List item height | **56 / 72 / 88 dp** (1 / 2 / 3 lines) | `list-item-one-line-container-height` etc. (**measured**) | https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-list.scss |
| Corner radius scale | 0, 4, 8, 12, 16, 20, 28, 32, 48 dp, Full | "Corner radius scale" list: None 0dp … Extra extra large 48dp (**verified**). material-web v0_192 tokens have only the 7 older steps (0/4/8/12/16/28/full) | https://m3.material.io/styles/shape/corner-radius-scale |
| Radius on dense UI | avoid large radii | "Be careful not to apply large or full corners to information-dense components" (**verified**) | same |
| Density | scale 0, −1, −2, −3; each step usually −4 dp | "decreasing the top and bottom padding or overall height by 4dp" (**verified**) | https://m3.material.io/foundations/layout/grids-spacing/density |
| Density default | off; opt-in only | "Avoid applying component scaling by default" (**verified**) | same |
| Spacing base unit | **not found** | Grids & spacing pages give no unit | https://m3.material.io/foundations/layout/grids-spacing/spacing |
| Primary vs surface | Surface is the background; primary goes on the most prominent components only | "Surface – A role used for backgrounds and large, low-emphasis areas"; primary for "the FAB, high-emphasis buttons, and active states" (**verified**) | https://m3.material.io/styles/color/roles |
| Baseline colours | surface `#fef7ff` (neutral98), surface-container `#f3edf7` (neutral94), primary `#6750a4` (primary40) | (**measured**) | https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-color.scss |

## 4. Fluent 2 (Work-tool)

| Property | Value | Quote / pointer | URL |
|---|---|---|---|
| Web body | **Body 1, 14 / 20 px** | Type ramp › Web table (**verified**) | https://fluent2.microsoft.design/typography |
| Web smallest | **Caption 2, 10 / 14 px**; Caption 1 12/16 | same table (**verified**) | same |
| Windows body | Body 14/20 px; Caption 12/16; Body large 18/24 | Type ramp › Windows table (**verified**) | same |
| macOS / iOS / Android body | macOS Body 1 13/16 pt; iOS Body 1 17/22 pt; Android Body 1 16/24 sp | Type ramp tabs (**verified**). Fluent defers to native sizes on each platform | same |
| Control heights | **small 24, medium 32 (default), large 40 px** | Input `fieldHeights = { small: '24px', medium: '32px', large: '40px' }` (**measured**) | https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-input/library/src/components/Input/useInputStyles.styles.ts |
| Button heights | 24 / 32 / 40 px; default `medium` | icon-only `minWidth` 24/32/40 px (**measured**); text-button heights **computed** as padding×2 + line height + 1 px border×2: 3·2+16+2 = 24, 5·2+20+2 = 32, 8·2+22+2 = 40. Default `size = … 'medium'` in `useButton.ts` (**measured**) | https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-button/library/src/components/Button/useButtonStyles.styles.ts |
| Touch target | iOS & Web 44×44, Android 48×48 | "minimum touch targets on mobile devices, iOS & Web [44 x 44], Android [48 x 48]" (**verified**) | https://fluent2.microsoft.design/layout |
| Spacing base | **4 px** | "The base unit is four pixels" (**verified**). Ramp: 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40, 48, 52, 56 | same |
| Corner radius | **4 px default**; 2 px under 32 px; 8 and 12 px for large | "corner radiuses on rectangle shapes are 4 pixels by default" (**verified**). Tokens: None 0, Small 2, Medium 4 ("Buttons, dropdown"), Large 8, X-Large 12, Circle 50% | https://fluent2.microsoft.design/shapes |
| Brand vs neutral | neutrals carry the surface; brand stays off large areas | "Avoid overusing brand colors or using them on large surfaces"; neutrals "ground an interface"; shared colours "sparingly" (**verified**) | https://fluent2.microsoft.design/color |

## 5. IBM Carbon (Work-tool)

| Property | Value | Quote / pointer | URL |
|---|---|---|---|
| Base sizes | **productive 14 px, expressive 16 px** | "productive type set uses a base type size of 14px" (**verified**) | https://www.carbondesignsystem.com/building-blocks/foundations/typography/type-sets |
| body-compact-01 | 14 / 18 px, 0.16 px tracking (productive; short text in components) | Body styles section (**verified**) | same |
| body-01 | 14 / 20 px, 0.16 px (productive long paragraphs) | same (**verified**) | same |
| body-compact-02 / body-02 | 16/22 px and 16/24 px (expressive) | same (**verified**) | same |
| Smallest text | **12 / 16 px**: label-01, helper-text-01, legal-01 | Utility styles (**verified**) | same |
| Productive vs expressive | productive for product UI, expressive for editorial and marketing | expressive styles "would be distracting if used in product" (**verified**) | https://www.carbondesignsystem.com/building-blocks/foundations/typography/overview |
| Button heights | XS 24, S 32, M 40, **L (productive) 48**, L (expressive) 48, XL 64, 2XL 80 px | Specifications › Size table (**verified**) | https://www.carbondesignsystem.com/building-blocks/core/components/button/specifications |
| Most-used button | Large (productive) 48 px | "the most common button size in software products. Pairs with 14px body copy." (**verified**) | https://www.carbondesignsystem.com/building-blocks/core/components/button/guidelines |
| Field heights | XS 24, S 32, M 40, L 48 px | Text input Specifications › Size table (**verified**). Default size **not stated** on the page | https://www.carbondesignsystem.com/building-blocks/core/components/text-input/specifications |
| Spacing scale | 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160 px (`$spacing-01`…`13`) | "multiples of two, four, and eight" (**verified**) | https://www.carbondesignsystem.com/building-blocks/foundations/spacing/overview |
| 2x Grid | **8 px mini unit**; box padding 16 px; total gutter 32 px | "the 8-pixel square mini unit" (**verified**) | https://www.carbondesignsystem.com/building-blocks/foundations/2x-grid/overview |
| Corner radius | **0** for buttons today | `$button-border-radius: 0 !default;` (**measured**). New tokens `border-radius-00/02/04/08/16/24/max` exist in `@carbon/layout`; under the `enable-v12-release` flag buttons switch to `$border-radius-max` (**measured**; token px values not read) | https://github.com/carbon-design-system/carbon/blob/main/packages/styles/scss/components/button/_vars.scss |
| Colour use | grey dominant, blue for action, others sparingly | "The neutral gray family is dominant"; "Additional colors are used sparingly and purposefully." (**verified**) | https://www.carbondesignsystem.com/building-blocks/foundations/color/overview |
| Themes and layering | White (default), Gray 10, Gray 90, Gray 100; light themes alternate White / Gray 10 per layer, dark ones go one step lighter | "layers alternate between White and Gray 10 with each added layer" (**verified**) | same; default White per https://www.carbondesignsystem.com/building-blocks/foundations/themes/overview |

## 6. GitHub Primer (Work-tool, short)

| Property | Value | Quote / pointer | URL |
|---|---|---|---|
| Body | **Body medium 14 px** (`0.875rem`), line height 1.5 | primitives typography table (**verified**); described as "Default UI font. Most commonly used for body text." (**measured**, `src/tokens/functional/typography/typography.json5`) | https://primer.style/product/primitives/typography/ |
| Smaller text | Body small 12 px / 1.625; Caption 12 px / 1.25 | same table (**verified**). Caption's description: "the small sizing doesn't pass accessibility requirements" (**measured**) | same |
| Control heights | xsmall 24, small 28, **medium 32**, large 40, xlarge 48 px | `--control-*-size` (**verified**); "medium for standard forms" (**measured**, `src/tokens/functional/size/size.json5`) | https://primer.style/product/primitives/size/ |
| Min target | fine pointer 16 px, coarse pointer 44 px | `control.minTarget.fine` / `.coarse` (**measured**) | https://github.com/primer/primitives/blob/main/src/tokens/functional/size/size.json5 |
| Spacing base | **4 px grid** | line heights "align to the 4px grid" (**verified**); base-size tokens step by 4 | https://primer.style/product/getting-started/foundations/typography/ |
| Corner radius | small 3, **medium 6 (default)**, large 12 px, full | `--borderRadius-default` = medium (**verified**) | https://primer.style/product/primitives/size/ |
| Colour use | neutrals for backgrounds; semantic colours for status, action or emphasis | "The first six steps of the neutral scales are typically used for background colors." (**verified**); "Refrain from utilizing color as a primary method of emphasis." (**verified**, typography page) | https://primer.style/product/getting-started/foundations/color-usage/ |

## 7. Shopify Polaris (Work-tool, short)

polaris.shopify.com and polaris-react.shopify.com now redirect to https://shopify.dev/docs/api/polaris, which is an API reference for Polaris web components with no foundations pages. The Shopify/polaris repo is **archived** (last push 2026-09-11). Values below are **measured** from that repo and describe the last React release, not necessarily the web components.

| Property | Value | Quote / pointer | URL |
|---|---|---|---|
| Body | **body-md 13 / 20 px** | `text-body-md-font-size: font-size-325` = 13px; line height `font-line-height-500` = 20px (**measured**) | https://github.com/Shopify/polaris/blob/main/polaris-tokens/src/themes/base/text.ts |
| Smaller text | body-sm 12/16, body-xs 11/12 px | same file (**measured**) | same |
| Button heights | micro 28→24, **medium (default) 32→28**, large 36→32 px (below → above the `md` breakpoint) | `.sizeMedium { min-height: var(--p-height-800) }`, md-up `height-700` (**measured**); `@default 'medium'` in `Button.tsx` | https://github.com/Shopify/polaris/blob/main/polaris-react/src/components/Button/Button.module.css |
| Spacing base | **4 px** (`space-100`) | `size['100'] = '4px'` (**measured**) | https://github.com/Shopify/polaris/blob/main/polaris-tokens/src/size.ts |
| Corner radius | scale 0, 2, 4, 6, 8, 12, 16, 20, 30 px, full; buttons use `border-radius-200` = 8 px | (**measured**) | https://github.com/Shopify/polaris/blob/main/polaris-tokens/src/themes/base/border.ts |
| Text field height | **not found** (`--pg-control-height`, definition not located) | — | — |
| Colour guidance | **not found**: foundations site gone | — | — |

## 8. WCAG 2.2 (the floor)

| Property | Value | Quote / pointer | URL |
|---|---|---|---|
| 2.5.8 Target Size (Minimum), AA | **24×24 CSS px** | "The size of the target for pointer inputs is at least 24 by 24 CSS pixels" (**verified**). Exceptions include spacing: a 24 px circle centred on each undersized target must not intersect another | https://www.w3.org/TR/WCAG22/#target-size-minimum |
| 2.5.5 Target Size (Enhanced), AAA | **44×44 CSS px** | "at least 44 by 44 CSS pixels" (**verified**) | https://www.w3.org/TR/WCAG22/#target-size-enhanced |
| Version | W3C Recommendation, 12 December 2024 | document header (**verified**) | https://www.w3.org/TR/WCAG22/ |

---

## Where they agree / disagree

Desktop productivity: macOS HIG, Fluent 2, Carbon, Primer, Polaris. Phone and consumer: iOS HIG, Material 3.

| Property | Desktop productivity | Phone / consumer | Read |
|---|---|---|---|
| **Body size** | 13 (macOS, Polaris) to 14 px (Fluent, Carbon productive, Primer) | 16–17 (Material Body Large 16, iOS 17 pt). Material's *key* size is still 14 (Body Medium) | Agree in two bands: **13–14 for work, 16–17 for phone reading**. Fluent's own ramp switches to 17 pt on iOS and 16 sp on Android, so the band follows the device, not the brand. |
| **Smallest text** | 10 (macOS, Fluent Caption 2) to 11–12 px (Polaris 11, Carbon / Primer 12) | 11 (iOS minimum, Material Label Small) | Close agreement on **11–12** as the floor. macOS and Fluent web go to 10; Primer flags 12 px caption as failing accessibility. |
| **Control height** | Fluent, Carbon fields and Primer share 24 / 32 / 40 for small / medium / large. The default is **32** in Fluent and Primer, and in Polaris 32 below `md`, 28 above. Carbon's most common button is **48** | Material button 40, text field 56, list row 56–88; iOS default control 44 pt | Desktop clusters at **28–32 by default**, with Carbon an outlier at 40–48. Phone sits at **40–56**. |
| **Target size** | macOS 28×28 pt default, 20×20 minimum; Primer fine pointer 16, coarse 44; Fluent web 44 | iOS 44×44 default, 28×28 minimum; Material 48×48 touch, 44×44 pointer | Disagree on numbers but agree on the shape: **44–48 for touch, smaller allowed for a mouse**. WCAG AA (24×24) is the floor everywhere; every desktop default (28–32 px) clears it. |
| **Spacing base** | 4 px (Fluent, Primer, Polaris); Carbon scale of 2/4/8 on an 8 px mini-unit grid; macOS not found | iOS not found; Material not found (density steps are 4 dp, target spacing 8 dp) | Where stated, **4 px base, 8 px rhythm**. Neither Apple nor Material publishes a base unit. |
| **Radius** | Fluent 4 px default; Primer 6; Polaris buttons 8; Carbon 0 (pill under the v12 flag) | Material buttons full (pill), cards and sheets on a 4–48 dp scale; Apple not found | Big split: **desktop 0–8 px, consumer pill or 12–28**. Material itself warns against large radii on dense components. |
| **How much colour** | All say neutral surfaces, brand or accent for the primary action and status. Fluent: brand not on "large surfaces". Carbon: grey "dominant". Primer: colour not "a primary method of emphasis" | iOS: colour "sparingly", one or two prominent buttons per view. Material: surface for "large, low-emphasis areas", primary for the most prominent components | **Full agreement**: neutral surface, one accent for primary action and status. Material's baseline surfaces are lavender-tinted (`#fef7ff`), unlike everyone else's neutral greys. No system gives a ratio. |

## Not verified

- Material 3 Expressive button heights (XS–XL): only in a diagram on the Specs page. The 40 dp baseline comes from material-web v0_192 tokens, which predate Expressive.
- Material 3 spacing base unit: not stated on any Grids & spacing page read.
- Apple: spacing base, corner radius scale, and macOS push-button heights (mini / small / regular / large) are not on Layout, Buttons, Color or Accessibility.
- Apple's 44×44 pt "general rule" for buttons against the 28×28 pt macOS default control size: both are on first-party pages and the HIG doesn't reconcile them.
- Carbon `border-radius-*` token pixel values (generated file not read) and the default text-input size.
- Fluent text-button heights are computed from padding, line height and border, not read as a single value. The `lineHeightBase200/300/400` = 16/20/22 px values are inferred from the matching web ramp rows, not read from the tokens package.
- Primer line-height mismatch: tokens give Body medium 1.5 (21 px) and Caption 1.25 (15 px), while the descriptions say 20 px and 16 px.
- Polaris: everything comes from an archived repo; whether Polaris web components keep these values is unknown. Text field height and colour guidance were not found.
