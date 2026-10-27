# Playful teaching sites: what makes them feel consumer-grade

Screenshots taken on 2026-10-27 are in `assets/2026-10-27-playful/`. Widths are read off 1440px
screenshots. Companion notes: `2026-10-27-dialkit-josh-puckett.md`. Audit:
`../plans/2026-10-27-consumer-audit.md`.

## The sites

| Site | Text column | Figures | The move that makes it feel like a product, not a manual |
| --- | --- | --- | --- |
| [joshwcomeau.com](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/) | ≈ 718px, sans 19px, sticky TOC on the right | Demos break out ≈ 30px left; a dark stage for a live demo, a tinted blue well for code | A hand-written “Drag me!” with an arrow on the first demo; a cloud illustration behind the title; a like heart with a count; a sound toggle in the header |
| [ciechanow.ski](https://ciechanow.ski/mechanical-watch/) | ≈ 700px, IBM Plex Sans ≈ 18px on `#f8f8f8` | No frame at all: the object floats on the page with its slider under it | **Words in the prose are coloured as the parts they name** (arbor gold, barrel red), so the text is a legend for the figure |
| [emilkowal.ski](https://emilkowal.ski/) | ≈ 644px, 16px, grey text | Same width as the text, with a hairline frame and a gradient wash at one edge | A real product (Sonner) in the figure; the story is told in the first person |
| [animations.dev](https://animations.dev/) | ≈ 700px | White card with a hairline; caption under it, small and grey | Exercises built on believable content (app icons with names and jokes); module numbers like a course |
| [devouringdetails.com](https://devouringdetails.com/) | ≈ 896px, large sans | A full prototype platform in a rounded frame, caption centred under it | A minimap of tick marks down the left edge that tracks the reading position; one orange accent |
| [rauno.me](https://rauno.me/) | — | Poster frames on a grey wall | Very large type set like a poster, one pure-yellow disc; the site reads as an object |
| [interfacecraft.dev](https://www.interfacecraft.dev/) | ≈ 540px, grey sans | — | Section cards like book covers, each its own colour, tilted, in a serif; a pull-quote in serif |
| [paco.me](https://paco.me/), [linear.app/method](https://linear.app/method) | ≈ 600–680px | — | Restraint: a voice and a little type, nothing else |

## The mechanisms that make these sites delightful without noise

1. **An invitation at the first demo.** Comeau's hand-drawn “Drag me!” appears once, on the first
   demo, then never again. It teaches at the moment of need, and it is the only hand-drawn thing.
2. **Colour-keyed prose.** Ciechanowski names a part in the colour it has in the figure. The text
   and the picture share one legend, and colour means exactly one thing on that page.
3. **Real objects, not wireframes.** Sonner, app icons with jokes, a watch. The demo is something a
   person would want, so touching it is a pleasure in itself.
4. **Figures without chrome.** Ciechanowski has no frame; Josh Puckett uses a flat well with the
   caption inside. The object sits on the page.
5. **One signature element per site.** Comeau's clouds, Rauno's disc, Interface Craft's tilted
   covers. One expressive move, repeated. Everything else stays quiet.
6. **A second face for voice.** A serif for titles and quotes (Interface Craft, Josh Puckett), or
   a hand for annotations (Comeau).
7. **Somewhere to be.** A sticky TOC (Comeau), a minimap that tracks the reading position
   (Devouring Details): you always know where you are and what's left.
8. **Small rewards.** A like heart with a count, a "You made it!" section at the end (Comeau).

## What fits a site about restraint

The playbook argues that motion is brief, delight belongs to rare moments, and colour means one
thing. So:

- **Fits:**
  - 1: one invitation, the first time;
  - 2: colour-keyed prose, the strongest fit, because it *is* "colour means one thing";
  - 3, 4, 6 and 7.
- **Careful:** 8. A reward at the end of a page is a rare moment; confetti on every like is not.
- **Contradicts:** sound on by default, animated backgrounds, illustrations on every page. Each
  repeats an attention cost the pages tell readers to avoid.

## Three directions

### A. Workbench, after DialKit and Josh Puckett

Quiet and precise: the controls are the personality.

- **Type:** serif titles (Newsreader or Instrument Serif) over Geist text. Rank comes from ink:
  near-black headings, grey text.
- **Figures:** flat 3% wells with the caption inside, and no ring or shadow.
- **Controls:** one system, 36px rows, radius 8, one alpha ladder.
- **Home:** draggable control chips around the title, like dialkit.dev, with each chip a real
  setting of the site (density, palette, motion).

This is the lowest risk, and the closest to "practice what we teach".

### B. Field guide, after Ciechanowski and Comeau

Warm and explanatory: the page teaches like a good book.

- **Paper and colour:** warm paper (Clay).
- **Prose:** colour-keyed, naming the parts of each demo in their own colours.
- **Annotations:** one hand-drawn note, only on a page's first demo.
- **Figures:** they float without a frame.
- **Navigation:** a sticky contents list with a reading-position tick.
- **Endings:** each principle page ends with a short "You've seen" recap of its demos.

### C. Specimen book, after Interface Craft and Rauno

Bold and collectable: each component and principle is an object.

- **Home:** a shelf of covers, each in its own palette colour, with a serif name and a live
  miniature on the cover.
- **Page openings:** each opens with a poster-sized title and one large shape in the accent.
- **Inside:** quiet, as in A.

This is the most C端 and the most marketing-ready, but it is the furthest from today's code.
