# Plan: a whole product for the looks gallery

Status: agreed by the owner on 2026-11-02, with a marketing page added. The owner allowed switching
Linear to its dark theme to sample it (switch back afterwards).

## Why

The gallery shows one wall of cards. The owner judged it rough: a look is a whole system, and the
references (tweakcn's Cards / Dashboard / Application / Marketing tabs, shadcn/ui create's block
wall, Astryx themes' full template site) each show a complete product redrawn in the theme.

## What

One product, Ship (a release tool), built only from `src/ui` components and the look's variables,
shown as pages the toolbar switches between, like tweakcn's tabs:

| Page | What it shows of a look |
| --- | --- |
| Dashboard | stats, charts (bar, line, donut), recent activity, the card wall's best cards |
| Releases | app shell: sidebar with sections and counts, header with search and actions, a table with filters, selection, a bulk toolbar, sorting and pagination |
| Release | detail: title, tabs (Overview, Checks, Notes), activity timeline, comment composer, a properties side panel |
| Settings | grouped form sections: fields, selects, combobox, radios, switches, a danger zone |
| Overlays | the Releases page with a menu open, a dialog, a toast, a popover and a tooltip pinned open, so floating surfaces, scrim and shadows show |
| States | empty, loading (skeletons), error and sign-in |
| Marketing | Ship's landing page: nav, hero with headline and call to action, a product shot (the app shell, scaled), feature grid, pricing table, testimonial, FAQ, footer |

Every size, colour, edge and gap comes from the look; nothing is styled per look. The wall's
current cards are reused where they fit. Pages are one component per file under
`src/demos/looks/ship/`.

## Values

- Linear dark: allowed; switch Linear to dark in its preferences, read the same variables and elements as the light pass, switch back.
- After Apple stays out until it has sampled values.

## Order

1. Releases (app shell + table) and Release detail: the work-tool core.
2. Dashboard and Settings.
3. Overlays, States and Marketing.
4. Measure: no sideways scroll at 1280 and 375, frame time on switching looks, both themes.
