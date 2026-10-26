# Human and modern: references, recurring patterns, and what they suggest for Post

Research for a visual-direction exploration of **Post**, the playbook's mail app (https://ui-playbook.suspense.site/practice/mail). The owner says it reads like an enterprise back-office tool: dense rows that look like a table, hairlines everywhere, no imagery, one uniform type treatment, flat white. Screenshot of the current state: `refs/00-post-current.jpg`. This note also feeds future consumer-side playbook topics: identity anchors, density, materials and depth, reading typography, personality, and motion.

All screenshots are in `/private/tmp/claude-501/-Users-polar-code/c3da3f51-7c2d-49c0-86c1-49aa8f6db2db/scratchpad/refs/`. That folder is session scratch, so copy anything worth keeping. Below, `refs/NN-…` is short for that folder.

**Verified** means the claim was read in the source named. **Secondary** means it was read only in press coverage or a third-party summary, not the primary source. **Observed** means I saw it on the live page or screenshot myself (2026-10-26). Sources collected 2026-10-26, mostly with Claude in Chrome. X was read signed-in, read-only. X screenshots are cropped to the post so the viewer's account doesn't show.

---

## Part 1. References

### Evidence and design-system guidance

**R1. Google Material Design, *Expressive design: Google's UX research* (Material 3 Expressive)**
- URL: https://design.google/library/expressive-material-design-google-research. Undated on the page; tagged I/O 2025, so May 2025. Credits Bradley Patrie, Dallas Barnes, Viviane Herdel and others. Screenshot: `refs/03-material-expressive-research.jpg`.
- Verified:
  - 46 studies with "more than 18,000 participants", using eye tracking, surveys, focus groups and usability tests.
  - Participants spotted key UI elements "up to four times faster". The enlarged, prominently placed **email Send button** was found four times faster than the standard toolbar version.
  - Users aged 45+ found key elements about as fast as younger users.
  - Preference for expressive designs reached up to 87% among 18–24-year-olds.
  - Limits: a playlist with unstructured album art scored lower on usability, and **removing text labels from email actions reduced usability**.
  - The levers are named: "color, shape, size, motion, and containment".
- Why it reads as fresh: hierarchy is carried by size, shape and containment, not by more hairlines. Its own caveat: "No amount of emotion can compensate for a lack of clarity."
- This is the only large dataset in this note that ties "expressive" to speed. It is Google measuring Google, with no independent replication found.

**R2. Gmail for Android, M3 Expressive containers (rollout 2025)**
- URL: https://9to5google.com/2025/09/02/gmail-material-3-expressive-containers/ (Abner Li, 2 Sep 2025). **Secondary**: no Google primary post was found. Screenshot: `refs/23-gmail-m3e-containers-9to5google.jpg`.
- Reported: each email sits in its own container, with "a small gap between every item". The first and last items get more pronounced curvature.
- Observed in the screenshot: every row starts with a coloured monogram or logo avatar.
- Mechanism: rows are separated by space and surface rather than by rules, and the avatar column gives the eye an anchor on every line.

**R3. Apple, *Apple introduces a delightful and elegant new software design* (Liquid Glass)**
- URLs: https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/ (9 Jun 2025) and the developer overview https://developer.apple.com/documentation/technologyoverviews/liquid-glass. Screenshot: `refs/07-apple-liquid-glass-newsroom.jpg`.
- Verified in the newsroom post:
  - The material "reflects and refracts its surroundings".
  - Controls sit on a separate layer above content, "recede to reveal content" and expand on demand.
  - Tab bars shrink on scroll.
  - Shapes are concentric with the hardware.
- Verified in the developer overview: "Be judicious with your use of color in controls and navigation so they stay legible and allow your content to infuse them and shine through." It also says to choose a layout that "puts the most important content in focus".
- Mechanism: depth is split into two planes, content and a floating control layer. The material is reserved for the control layer and is not applied to content.

**R4. Apple WWDC23, *Animate with springs* (session 10158, Jacob Xiao)**
- URL: https://developer.apple.com/videos/play/wwdc2023/10158/ (June 2023). Screenshot: `refs/24-wwdc23-animate-with-springs.jpg`.
- Verified in the transcript:
  - Springs are "the only type of animation that maintains continuity" for both static starts and starts with initial velocity, and they preserve velocity when retargeted.
  - Two parameters: duration and bounce.
  - "When you're not sure, use a spring with bounce 0." Add bounce to feel "a little more playful". Be "cautious about using values higher than around 0.4".
  - "Think about what kind of character your app has. Is it serious or playful?"
- Mechanism: physical continuity, with bounce used as a deliberate personality dial rather than a default.

**R5. Linear, *Behind the latest design refresh* (Charlie Aufmann and Maxime Heckel)**
- URL: https://linear.app/now/behind-the-latest-design-refresh (12 Mar 2026). Screenshot: `refs/04-linear-refresh-2026.jpg`.
- Verified:
  - Principles: "Don't compete for attention you haven't earned" and "Structure should be felt not seen."
  - Dividers "had multiplied". The team rounded their edges, softened their contrast and used fewer of them.
  - The palette moved from cool blue-grey toward a warmer, less saturated grey. The authors warn that too warm looks muddy.
  - The sidebar was made "a few notches dimmer".
  - Icons were reduced and scaled down, and coloured team-icon backgrounds were removed.
- Why it matters for Post: this is a dense productivity app stepping *away* from the hairline look while keeping its density. It shows hairlines-everywhere is not a necessary cost of density.

**R6. Tractinsky, Katz & Ikar, *What is beautiful is usable* (foundational, 2000)**
- Interacting with Computers 13(2):127–145, doi:10.1016/S0953-5438(00)00031-X. **Abstract read via search snippets only.**
- Perceived aesthetics correlated strongly with perceived usability before use, and still after use. Post-use usability judgments were affected by aesthetics, not by actual usability.
- Flagged foundational (pre-2023). It is the standard citation for why "looks like a back office" also changes how usable Post *feels*. No 2023+ replication was read.

**R7. Crouzet, Kirchner & Thorpe, *Fast saccades toward faces: face detection in just 100 ms* (foundational, 2010)**
- Journal of Vision 10(4):16, doi:10.1167/10.4.16, PMID 20465335. **Abstract read via the Europe PMC API.**
- Saccades toward faces were faster than toward animals. The earliest reliable face-directed saccades came at about 100–110 ms, and they stayed biased toward faces even when vehicles were the target.
- A 2025 follow-up (Grandjean et al., JoV 25(14):16, doi:10.1167/jov.25.14.16, abstract read) found the face advantage did not differ between meridians.
- Relevance: a face is among the fastest things the visual system finds. Whether a 32 px avatar in a list row gets the same advantage is **not tested** in either paper.

**R8. Rello, Pielot & Marcos, *Make It Big! The effect of font size and line spacing on online readability* (foundational, CHI 2016)**
- doi:10.1145/2858036.2858204. **Secondary**: the ACM abstract was blocked and only a BYU editing-research summary was read.
- Reported: readability and comprehension rose with font size up to 18 pt across 10–26 pt. Line spacing mattered less, and the extremes hurt comprehension.
- Use it as direction only until the paper itself is read.

### Craft writing by designers and design engineers

**R9. Rauno Freiberg, *Invisible Details of Interaction Design***
- URL: https://rauno.me/craft/interaction-design (July 2023). Screenshot: `refs/18-rauno-invisible-details.jpg`. His home page is a pan-and-zoom canvas (`refs/01-rauno-home.jpg`, observed).
- Verified sections: Metaphors ("Great interaction design rewards learning by reusing metaphors"), Kinetic Physics (gestures keep momentum and angle), Spatial Consistency (a view should come from its source), Frequency & Novelty (frequent animations "feel more like cognitive burden"), Fidgetability, and Responsive Gestures (respond to the finger immediately).

**R10. Rauno Freiberg, *Devouring Details***
- URL: https://devouringdetails.com (2024–2025; the login-page post on X is dated 3 Mar 2025). Screenshot: `refs/02-devouring-details.jpg`.
- Verified chapter list includes Inferring Intent, Simulating Physics, Motion Choreography and Drawing Inspiration.
- Observed: the page itself is warm grey, uses a ruler-and-tick motif, has an orange accent line, and uses large reading-size body text.

**R11. Emil Kowalski, *You Don't Need Animations***
- URL: https://emilkowal.ski/ui/you-dont-need-animations. Undated on the page; announced on X on 4 Sep 2025 (https://x.com/emilkowalski/status/1963593549221347685). Screenshot: `refs/25-emil-you-dont-need-animations.jpg`.
- Verified:
  - Raycast, opened "hundreds of times a day", has no open animation.
  - Keyboard-initiated actions "should never be animated".
  - UI animations should "generally stay under 300ms". A 180 ms dropdown feels more responsive than a 400 ms one.
  - A morphing feedback component is delightful only because it is rarely seen.

**R12. Emil Kowalski, *Building a Toast Component* (Sonner)**
- URL: https://emilkowal.ski/ui/building-a-toast-component (Sonner started "Back in 2023"; the post embeds a July 2024 tweet).
- Verified:
  - Stacked toasts are offset and scaled (14 px at 95%, 28 px at 90%), which creates depth from layering.
  - Swipe-to-dismiss triggers on distance or velocity (> 0.11).
  - Hovering the stack expands it.
  - The timer pauses when the tab is hidden.
  - Transitions are used because they "can be interrupted and retargeted".

**R13. Emil Kowalski on X, Linear's dithered logo**
- URL: https://x.com/emilkowalski/status/2036778116748542220 (25 Mar 2026). Screenshot: `refs/19-emil-x-dithered-logo-cursor.png`.
- Verified: a canvas of tiny dots with "an invisible circle around the cursor". Dots inside it are pushed outward "with a cubic falloff so it's gentle on the edges, and strong at the center".
- Mechanism: a cursor reaction confined to a brand surface, never to a work surface.

**R14. Jakub Krehel, *Details that make interfaces feel better***
- URL: https://jakub.kr/writing/details-that-make-interfaces-feel-better. Undated; the companion skill repo was created 13 Mar 2026 (GitHub API). Screenshot: `refs/06-jakub-details.jpg`.
- Verified:
  - **"Shadows instead of borders"**: a three-layer `box-shadow` at `rgba(0,0,0,0.06)`, and in dark mode a 1 px ring at white 0.08.
  - Image outlines: `outline: 1px solid rgba(0,0,0,0.1)` with `outline-offset: -1px`.
  - Concentric radius: outer radius = inner radius + padding.
  - `text-wrap: balance` and `pretty`, and tabular numbers.
  - Exits are softer than entrances.
  - Staggered enters of 8 px translate plus 8 px blur.

**R15. Josh W. Comeau, *Whimsical Animations* (blog post and course)**
- URLs: https://www.joshwcomeau.com/blog/whimsical-animations/ (24 Feb 2025, updated 5 May 2026) and https://whimsy.joshwcomeau.com/. Screenshot: `refs/14-josh-whimsical-animations.jpg`.
- Verified:
  - Mechanisms: "boop" hover overrides, particles flung in polar coordinates, spring easing via `linear()`, and sound with "multiple samples per sound" and separate press and release sounds.
  - Fireworks are deliberately silent, because a looping sound would become irritating.
  - "A crucial ingredient for whimsy is novelty." Generic NPM confetti feels stale, and "A charming, delightful effect becomes mundane and annoying surprisingly quickly!"

**R16. Josh W. Comeau, *Designing Beautiful Shadows in CSS* (foundational, 2021, updated 27 Apr 2026)**
- URL: https://www.joshwcomeau.com/css/designing-shadows/.
- Verified:
  - Use one light source, so "every shadow on the page should share the same ratio".
  - Layer several shadows for realism.
  - Tint shadows with the background's hue instead of grey black.
  - For elevation, larger offset and blur go with lower opacity.

**R17. Family (crypto wallet), *Family Values***
- URL: https://benji.org/family-values (8 Jul 2024; written by the Family team, hosted on Benji Taylor's site). Screenshot: `refs/05-family-values.jpg`.
- Verified:
  - Principles: simplicity, fluidity, delight.
  - "Trays" overlay the current screen, so you keep your context.
  - Tab switches move in the direction of the tapped tab: "We fly instead of teleport."
  - A sound plays when items are dropped in a skeuomorphic trash can.
  - Confetti appears after backup.
  - An empty state uses an animated arrow pointing to the next step.
  - "Continue" morphs into "Confirm" by reusing shared letters.
- Follow-up on X, Benji Taylor, 27 Jun 2026: https://x.com/benjitaylor/status/2070553472488145323 (`refs/20-benji-x-dynamic-trays.png`). Trays "keep the underlying product UI simple while still creating advanced features that leverage progressive disclosure".

**R18. Mariana Castilho, *uilabs: Small laboratory of fine UI***
- URL: https://uilabs.dev (2024; launch post on X, 8 Mar 2024: https://x.com/mrncst/status/1766117470207647836). Screenshot: `refs/21-uilabs-mariana-castilho.jpg`.
- Observed:
  - A pixel-serif display title next to a quiet sans.
  - Each component is shown with realistic content (commit hashes, guests "3", "In 15 mins").
  - Notes are candid: "Not quite there yet but hey, all of this is experimental." On the tags container: "I wouldn't ship it in production because of the sudden change of position."
- Mechanism: the author's voice and honest annotations make it human. Visual flourish is not what does it.

**R19. Alana Goyal, personal site**
- URL: https://alanagoyal.com (live, viewed 26 Oct 2026; no publication date). Screenshot: `refs/08-alanagoyal-notes-site.jpg`.
- Observed:
  - The site is a working macOS Notes and Messages pastiche on a wallpaper.
  - Every note carries an emoji glyph (📍, 📎, 📖, 🎧, 🍽).
  - Pinned and Today/Yesterday/Previous 7 Days groups.
  - A warm yellow selection.
  - Lowercase voice ("my name is alana (rhymes with 'banana')").
- Mechanism: a per-item glyph gives each row a recognisable face. This is a replica, so use it only as evidence of the glyph mechanism, never as a model.

### Products and their own pages

**R20. Apple Mail, iOS 18.2 redesign**
- Apple primary, verified: the iPhone User Guide, *Use categories* (https://support.apple.com/guide/iphone/use-categories-iphfe4a36baf/ios, read in the zh-CN locale it redirects to).
  - Mail sorts into Primary, Transactions, Updates and Promotions.
  - Tapping a non-Primary message opens a **digest of all mail from that sender**. Primary is not grouped by sender.
- **Secondary**: 9to5Mac (https://9to5mac.com/2024/11/22/ios-182-upgrades-apple-mail-with-its-biggest-redesign-ever/, updated 18 Dec 2024). Screenshot: `refs/13-apple-mail-ios182-9to5mac.jpg`.
  - Apple is "emphasizing contact photos for senders", so rows look like Messages.
  - Businesses can supply a logo. Otherwise Mail uses an Apple Maps icon.
  - The contact-photo detail is **not** in the Apple guide page that was read.
- Mechanism: the inbox is reorganised around *who* sent each message, with a face or logo as the anchor.

**R21. HEY (37signals), features page**
- URL: https://www.hey.com/features/ (live; the product launched 2020, so flagged foundational). Screenshot: `refs/10-hey-features.jpg`.
- Verified:
  - The Screener: "The first time someone emails you, you get to decide if you want to hear from them again."
  - "New For You & Previously Seen": new mail always on top.
  - Cover Art: "a cover will slide up over your previously seen emails … add some life to your Imbox".
  - Bundles collapse a dominating sender into one row.
  - Sticky notes can go on any email. Notifications are "Quiet by default".
- Observed: saturated gradient type and blob illustrations.
- Mechanism: personality comes from *behaviour named in plain words* (Imbox, Paper Trail, Feed) and from user-chosen imagery, not from decoration of the list itself.

**R22. Notion Mail, *Introducing Notion Mail, a new inbox that thinks like you* (Andrew Milich and Jason Ginsberg)**
- URL: https://www.notion.com/blog/introducing-notion-mail (15 Apr 2025). Screenshot: `refs/12-notion-mail-launch.jpg`.
- Verified: custom views "that show different focus areas". AI labels.
- Observed in the hero screenshot:
  - The list is as dense and table-like as Post's: sender, subject, time, with colour-dot unread marks.
  - Each sidebar view has a coloured icon.
  - List sections have coloured pill headers (Hiring, Support, Travel).
  - The whole thing is wrapped in hand-drawn postage-stamp illustrations and hand-drawn author avatars.
- Takeaway: a dense list can still feel warm when colour and drawing live in the *chrome* (navigation, group headers, brand).

**R23. Notion Faces**
- URL: https://faces.notion.com. Product Hunt launch 10 Jan 2025 (**secondary**: hunted.space). Agency BUCK: https://buck.co/work/notion-faces. Screenshot: `refs/15-notion-faces.jpg`.
- Observed: a portrait maker in Notion's hand-drawn line style, with a shuffle button.
- **Secondary** (a podcast with Notion's Head of Creative, Rob Giampietro): the team chose human illustrators over AI to keep the hand-made quality.
- Mechanism: an identity image people make for themselves, with a consistent drawn style that works even without a photo.

**R24. Airbnb 2025 Summer Release**
- URL: https://news.airbnb.com/product-releases/airbnb-2025-summer-release/ (13 May 2025). Screenshot: `refs/22-airbnb-2025-icons.jpg`.
- Observed: dimensional, rendered icons for Homes, Experiences and Services (a house, a hot-air balloon, a reception bell).
- **Secondary**: It's Nice That (14 May 2025, https://www.itsnicethat.com/articles/airbnb-app-redesign-140525) quotes VP of design Teo Connor: icons as "a universal language" with "loads of fun details". It reports softer curves and an animated interface. Bloomberg (13 Jun 2025, paywalled, not read) frames it with Liquid Glass as the end of flat design.
- Mechanism: a few rendered objects in the main navigation add tactility. Content photography then carries the rest.

**R25. The Browser Company, *The strategy behind Dia's design* (Charlie Deets)**
- URL: https://browsercompany.substack.com/p/the-strategy-behind-dias-design (17 Jun 2025). Screenshot: `refs/16-dia-design-strategy.jpg`.
- Verified:
  - "anyone to switch to Dia at 10am on a Tuesday morning".
  - A familiar baseline plus an "elevated" layer.
  - A **novelty budget** spent only on Chat.
  - The page's colour extends into the active tab.
  - Update banners are never shown. Icons appear on hover.
  - The stated aim is to "humanize the browser UI".
- Mechanism: concentrate expressiveness in one place and keep the core plain. Content colour bleeding into the chrome ties the two together.

**R26. Bear, *Meet Bear Sans, the new (type)face of Bear***
- URL: https://blog.bear.app/2023/08/learn-about-our-new-custom-font-bear-sans/ (9 Aug 2023, updated 29 Aug 2023). Screenshot: `refs/11-bear-sans.jpg`.
- Verified:
  - Avenir "could be tiring to read" at small body sizes.
  - Bear Sans has a larger x-height, tighter spacing, larger apertures in e, c and s, more width variation and stroke contrast, and true italics.
  - The team wanted "a workhorse font that didn't sacrifice personality or beauty".
- Observed: a small drawn bird perches on the "a" in the hero.
- Mechanism: personality through the face itself and a mascot touch, while body legibility improves.

**R27. Granola, home page**
- URL: https://www.granola.ai (live 2026). Screenshot: `refs/09-granola-home.jpg`.
- Observed: computed styles show the h1 in **Quadrant** (a serif) at 87 px and body text in **Melange** (a grotesque).
- Also observed: the product window is warm off-white, there is a collage of textured imagery and real faces in a video call, and the primary button is olive.
- Mechanism: a serif display face plus texture and photography against a calm product surface. The warmth comes from type and material, not from UI chrome.

**R28. Raycast, *The New Raycast* and its technical deep dive**
- URLs: https://www.raycast.com/blog/the-new-raycast and https://www.raycast.com/blog/a-technical-deep-dive-into-the-new-raycast (both 14 May 2026). Screenshot: `refs/17-raycast-new-2026.jpg`.
- Verified:
  - Liquid Glass is used "in tasteful ways to enhance the functional nature of a launcher".
  - The aim is a professional, dense feel.
  - Interactive controls show no pointer cursor or hover highlights, "to avoid a web-page feel".
  - Views appear with "No flickering".
- Use it as a counterweight: a dense tool can feel native and calm without imagery, through material and the absence of web tics.

---

## Part 2. Recurring patterns

Each pattern has a mechanism (why it reads as human or modern), evidence, the references that show it, and how it could apply to Post, argued from what a person reading mail needs. None of these is "do what X does".

### P1. Every row needs a face: an identity anchor in a fixed column
- **Mechanism.** In mail, people look for *who* before *what*. A per-sender image (photo, logo, or a coloured monogram) gives each row a shape-and-colour target that can be found before reading. Faces in particular draw very fast saccades (R7, about 100 ms). A fixed left column also gives the eye a return point on every line.
- **Evidence.** Face-speed evidence is from natural scenes, not 32 px avatars (R7, untested at UI scale). M3 Expressive's speed gains come from size, shape and colour contrast (R1).
- **Shown by.** Apple Mail contact photos and logos plus sender digests (R20); Gmail monograms (R2); Alana Goyal's per-note glyphs (R19); Notion Faces as an identity system (R23).
- **For Post.** The task is "is this from someone I know?". Give each sender a stable identity mark: photo if known, otherwise a monogram whose colour derives from the address, so the same person always looks the same. Logos for services.
  - The colour must not collide with the unread accent (see `2026-10-27-colour-and-unread.md`: one hue per meaning).
  - Group consecutive mail from one sender under one face, to ease the "who flooded me" problem (R20 digest, R21 bundles).

### P2. Separate with space and surface, not rules
- **Mechanism.** Hairlines between every row turn a list into a grid of cells. The eye reads the rules as structure to process. Spacing, soft containers and tonal steps group without adding marks.
- **Evidence.** Linear's 2026 refresh, a dense tool, cut and softened dividers because they "had multiplied" (R5). "Structure should be felt not seen" (R5). M3E names containment as a lever (R1). No controlled study of hairlines versus spacing was found (searched 2026-10-26), so this is practitioner consensus.
- **Shown by.** R5, R2 (gaps between containers), R14 ("shadows instead of borders").
- **For Post.** The reader is scanning, not auditing a ledger. Drop per-row rules.
  - Use date sections as the only hard grouping, with the section label carrying the boundary.
  - Rows are separated by height and padding.
  - Selection and hover use a soft filled surface with a concentric radius (R14).
  - Keep one boundary per region (sidebar, list, reader), as the owner's grid rule requires.

### P3. Two planes of depth: content on the page, controls float above
- **Mechanism.** Real depth (layered shadow, translucency) says "this is a thing you can act on, lying over what you are reading". When everything is flat white, every element weighs the same.
- **Evidence.** Liquid Glass reserves the material for a control layer that recedes so content stays in focus (R3). Shadows read as realistic when they share one light source and are layered and hue-tinted (R16). Sonner builds depth by stacking (R12).
- **Shown by.** R3, R12, R14, R16, R28.
- **For Post.**
  - The message the user is reading is the content plane: no glass, high contrast.
  - The composer, the toolbar over the reader, and popovers float: one consistent soft shadow, maybe a translucent toolbar that dims as the user scrolls into a long thread.
  - The list and sidebar sit on a slightly tinted ground (warm, not cool grey, per R5), so the white reading surface is the brightest thing on screen.
  - That puts the eye where the reading is and keeps the user's place.

### P4. Reading typography differs from interface typography
- **Mechanism.** Mail is read, not just scanned. A reading face at a larger size, with generous leading and a contrasting display face, signals "this is for you to read" and slows the eye in the right place. One uniform UI size everywhere reads as a form.
- **Evidence.** Font size improved readability up to 18 pt in Rello et al. (R8, secondary). Bear rebuilt its face because Avenir was "tiring to read" small (R26).
- **Shown by.** Granola's serif display face with a grotesque body (R27); Bear Sans (R26); Devouring Details' large body text (R10); uilabs' pixel-serif title (R18).
- **For Post.**
  - Keep the list in the UI face, but give the open message a reading measure (about 60–75 characters) at a larger size and taller leading.
  - Consider a contrasting face for the subject heading of the open thread.
  - Sender names in the list could get one step more weight or size than subjects, because who comes first (P1).
  - Avoid using type for decoration in the list: it is a scanning surface.

### P5. Concentrate expressiveness, keep the core plain: a novelty budget
- **Mechanism.** Delight wears off with repetition. Expressiveness spent everywhere becomes noise, and spent nowhere the product feels clinical. Products that feel human pick one or two places to be expressive and keep everything frequent quiet.
- **Evidence.**
  - Dia's "novelty budget" (R25).
  - Emil: frequent and keyboard actions are never animated; a delightful morph works because it is rare (R11).
  - Rauno: frequent animation becomes "cognitive burden" (R9).
  - Josh: delight goes "mundane and annoying surprisingly quickly" (R15).
  - M3E: a strong minority preferred calmer versions, and breaking basic paradigms hurt usability (R1).
- **Shown by.** R1, R9, R11, R15, R25, R28.
- **For Post.** Spend the budget on rare, emotional moments:
  - inbox zero
  - first send
  - an empty folder that names the next step
  - maybe the Send action itself, which deserves to be the most findable control (R1's four-times result is for exactly this button).

  Never spend it on archive, j/k navigation, or opening a message.

### P6. Motion with physical continuity, not decoration
- **Mechanism.** Springs keep velocity across interruptions, so motion feels caused by the user rather than played at them. Direction-aware motion ("fly instead of teleport") tells you where something went.
- **Evidence.** Springs keep velocity through retargeting; bounce 0 is the default, and above 0.4 is too much (R4). Family's tab and tray motion (R17). Sonner uses transitions because they retarget (R12). Exits are softer than entrances (R14).
- **Shown by.** R4, R9, R12, R14, R17.
- **For Post.**
  - Archiving a row should collapse it in place while the next row slides up, so the user's place in the list is kept.
  - The composer grows out of the Reply button it came from.
  - Undo reverses the same path.
  - All of it is interruptible. Nothing animates on keyboard-driven triage.
  - Overlaps the existing backlog topics *Motion has a source* and *The more often, the less motion*.

### P7. Warmth through material, imagery, and drawn touches, kept in the chrome
- **Mechanism.** Hand-drawn illustration, texture, rendered objects and warm neutrals carry signs of a maker. They read as made by people. Kept to navigation, empty states and brand, they warm the product without cluttering the work surface.
- **Evidence.** No controlled study found. Aesthetic judgments shape perceived usability (R6, foundational). M3E reports higher "friendly" and "positive vibe" ratings (R1).
- **Shown by.**
  - Notion Mail's stamp illustrations and coloured view icons around a dense list (R22).
  - Notion Faces' hand-made portraits (R23).
  - Airbnb's rendered nav icons (R24).
  - HEY's Cover Art (R21).
  - Bear's bird (R26), Granola's collage (R27), Linear's warmer grey (R5).
- **For Post.**
  - Warm the ground (sidebar and list) a few degrees.
  - Give each folder or view a small coloured glyph.
  - Put drawn illustration only in empty states and onboarding.
  - Optionally let users choose a cover image for "previously seen" mail. User-chosen imagery is personal, not decoration (R21).
  - Rows themselves stay calm.

### P8. Disclose in place: trays and sheets that keep context
- **Mechanism.** Opening a full page for a small decision loses the user's place. A tray that rises over the current view, sized to the step, keeps context and makes the product feel attentive.
- **Evidence.** The Family team: trays let users keep their context (R17). Benji Taylor on X: trays keep "the underlying product UI simple" (R17 follow-up). Apple's controls "recede" and expand on demand (R3).
- **Shown by.** R3, R17, R18 (dynamic forms inside a dropdown).
- **For Post.** Snooze, move and label all happen in place, in a small surface anchored to the row or the toolbar, then dismiss back to the list with the row's position kept. This is about the user keeping their place, not about style.

### P9. Voice: name things in the user's words, write like a person
- **Mechanism.** Plain, slightly personal names for features and states (Imbox, Paper Trail, "Quiet by default") and candid notes signal a person behind the product. Uniform system nouns ("Folder", "Item") signal a database.
- **Evidence.** None experimental. Only practitioner sources.
- **Shown by.** HEY (R21); uilabs' candid annotations (R18); Alana Goyal's lowercase voice (R19); Family's constant copy where only the changing part updates (R17).
- **For Post.** Put the voice in empty states and confirmations ("Nothing new since this morning"). Labels stay plain, per the owner's "label only" rule; no explanatory text in controls.

---

## Part 3. Candidate playbook topics

**T1. Who, before what: identity anchors in lists**
- Claim: in person-to-person lists, a stable per-entity mark in a fixed column is the fastest way to find a row, and it must not share a hue with state cues.
- Cite:
  - Crouzet et al. 2010 (R7) and Grandjean et al. 2025.
  - Wolfe & Horowitz 2004 and 2017 (already in `2026-10-27-colour-and-unread.md`).
  - M3 Expressive research (R1).
  - Apple *Use categories* guide (R20).
- Open: no study of avatar size versus search time in mail lists was found. The playbook demo would be the test (with and without avatars, task "find Priya's last message").

**T2. Structure felt, not seen: separating without lines**
- Claim: spacing, surface and tone group more quietly than rules. Hairlines are a cost paid per row.
- Cite:
  - Linear 2026 refresh (R5).
  - Palmer & Rock 1994 and Palmer 1992 on grouping (already in `2026-10-26-layout-and-guidance.md`).
  - Jakub's shadows-instead-of-borders (R14).
- Open: needs a primary study on rules versus whitespace in list scanning; none was found in this pass.

**T3. Two planes: when depth earns its place**
- Claim: a material belongs to the layer you act on, never to the layer you read. A shadow is believable only with one light source.
- Cite: Apple Liquid Glass newsroom and developer overview (R3); Josh's shadows (R16); Sonner's stacking (R12); Raycast's restrained glass (R28).

**T4. A reading face is not a UI face**
- Claim: content meant for reading needs size, measure and leading of its own. Interface text needs compactness.
- Cite:
  - Rello et al. 2016 (R8, read the full paper first).
  - Bear Sans (R26).
  - Apple HIG Typography (not read in this pass).
  - Dyson's line-length work (to find).

**T5. A novelty budget**
- Claim: expressiveness has a frequency cost. Spend it on rare, emotional moments, and keep frequent actions instant.
- Cite: Dia (R25); Emil (R11); Rauno's Frequency & Novelty (R9); Josh on novelty (R15); the M3E limits section (R1); WWDC23 springs on character (R4).
- Overlaps the existing backlog topic *The more often, the less motion*. Merge it there, or make this the visual counterpart.

---

## Gaps and cautions

- Not found or not reached: Things, Craft, Arc (beyond Dia), Figma UI3 (only press coverage, not used), Vercel's design guidelines (page not fetched), the Mariana Castilho personal site beyond uilabs, and paco.me (its craft index is undated and was dropped).
- The Apple Mail contact-photo claim and the Gmail container claim are secondary only.
- The M3E figures are self-reported by Google.
- Every "for Post" item above is a proposal for the visual-direction exploration, not a decision. The owner's process (2–3 directions on the same real content, owner picks) still applies.
