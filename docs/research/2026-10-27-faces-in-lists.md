# Who, before what: faces in lists

Research for topic T1 in `2026-10-27-human-modern-references.md`. The claim to test: in person-to-person lists (mail, chat, contacts), a stable per-person mark in a fixed column is the fastest way to find a row, and it must not share a hue with state cues. Post's rows now start with a 36px face in a fixed first column (`src/demos/post/List.module.scss`, `Line.tsx`, `Avatar.tsx`): initials on a pastel disc whose hue is hashed from the person's id. Compact density shrinks it to 24px.

Not repeated here:
- Wolfe & Horowitz on guiding attributes, pop-out slopes, presence vs absence, and the blue unread dot are in `2026-10-27-colour-and-unread.md`.
- "Scanners read the left of each line" (NN/g left-lean, bypassing) is in `2026-10-26-layout-and-guidance.md` §2.
- One left edge per kind is a Detail on `space-groups-by-ratio`. One accent, red means wrong, hover isn't selection are on `colour-means-one-thing`. The eye guessing before it reads is on `where-the-eye-goes`.

**Labels.**
- **Verified**: read in the primary source this session: the paper's full text, its abstract on Europe PMC (marked "abstract"), the design system's own page or source code, or the vendor's own help page.
- **Secondary**: known only from press, a vendor blog about another vendor, or a paper citing the claim.
- **Unverified**: from memory or inference. Keep off pages.
- **Measured**: read from Post's source and data in this repo (2026-10-26).
- **Computed**: worked out here; method stated.

Sources were collected 2026-10-26. Europe PMC REST (`ebi.ac.uk/europepmc/webservices/rest`) supplied abstracts and open full texts; design-system pages were read in a browser.

---

## 1. Faces and search speed

### What the fast-face papers measured

- **Crouzet, Kirchner & Thorpe 2010**, *Fast saccades toward faces: face detection in just 100 ms*, J. Vis. 10(4):16, https://doi.org/10.1167/10.4.16. **Verified (abstract).** Two images flashed left and right; saccade to the target category. Faces: "the earliest reliable saccades occurring in just 100-110 ms, and mean reaction times of roughly 140 ms" (animals: 120–130 ms). The bias is partly involuntary: "fast saccades were still biased toward faces even when the subject was targeting vehicles."
- **Campbell & Tanaka 2024**, *Fast saccades to faces during the feedforward sweep*, J. Vis. 24(4):16, https://doi.org/10.1167/jov.24.4.16. **Verified (full text).** Recent replication with backward masking. Face saccades "within 110 to 160 ms", still obtainable "under extreme masking conditions that limit perceptual awareness", though masking raised the median latency. The authors put the true detection time at "as little as 70 to 80 ms" after subtracting oculomotor time. Stimuli "subtended approximately 14° of visual angle" at 80 cm; 12 participants.
- **Grandjean, Kauffmann, Roux-Sibilon & Goffaux 2025**, *Does radial bias contribute to fast saccades toward faces in the periphery?*, J. Vis. 25(14):16, https://doi.org/10.1167/jov.25.14.16 (open: https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12721439/fullTextXML). **Verified (full text); the paper exists as cited in the earlier note.** 50 participants, faces vs vehicles at 15° eccentricity on the horizontal and vertical meridians. "Saccades were faster and more accurate toward faces than vehicles"; the face advantage "did not differ between meridians". Stimuli were 300 × 300 px subtending 8° × 8° at 90 cm. Their review line: faces are detected in the periphery in "100–130 ms".
- **Martin, Davis, Riesenhuber & Thorpe 2018**, *Zapping 500 faces in less than 100 seconds*, Sci. Rep. 8:12482, https://doi.org/10.1038/s41598-018-30245-8. **Verified (full text).** Continuous search: each face appears once the previous one is fixated. "500 small 3° upright faces at 4° eccentricities in only 96 seconds" (fastest subject); peak "6.5 faces targeted/second"; average 111 s for 500 (≈ 222 ms per face, **computed**). Hiding faces in a cluttered scene "had little effect". Upright beat inverted from 4° to 16°.

### What they did not measure

- **Every study above asks "where is a face?", not "where is Daniel's face?".** In a mail list every row has a face, so detecting faces gives no information. The task is identification.
- **Qarooni, Prunty, Bindemann & Jenkins 2022**, *Capacity limits in face detection*, Cognition 225:105227, https://doi.org/10.1016/j.cognition.2022.105227. **Verified (abstract).** "Additional faces could be detected with no cost to efficiency", and "strict capacity limits in face perception occur after the detection step." Detection is parallel; who it is is the bottleneck.
- **Dunn, Kemp & White 2018**, *Search templates that incorporate within-face variation improve visual search for faces*, Cogn. Res. 3:37, https://pmc.ncbi.nlm.nih.gov/articles/PMC6156691/ (full text via Europe PMC). **Verified (full text).** Find one identity among 20 faces, target always present, using a different photo from the cue:
  - Exp. 1: familiar faces found in **5.7 s** with **90.4 %** accuracy; unfamiliar **7.8 s**, **45.8 %**.
  - Exp. 3, set sizes 5/10/20: familiar 3.4 s vs unfamiliar 3.9 s overall; accuracy slopes were shallower for familiar faces, but response-time slopes did not differ by familiarity.
  - Studio-photo studies (same photo, ideal conditions) report targets "located on average within 2 s" with ≤ 1.3 % errors (their review). A mail avatar is the same photo each time, so it is closer to that easier case.
- **Miti, Ciaramidaro, Rubichi & Iani 2025**, *Attentional capture by real and illusory faces: a failure to replicate*, Psychol. Res., https://doi.org/10.1007/s00426-025-02211-3. **Verified (abstract and methods).** When a face was an irrelevant distractor (search for a butterfly), "neither real nor illusory faces captured attention." When the face was the target, "real faces were detected more efficiently" than butterflies or illusory faces. Items ≈ 3 × 3 cm at 60 cm (≈ 2.9°, **computed**). Faces help when you are looking for one, and don't grab attention when you aren't.
- **Bindemann & Burton 2009**, *The role of color in human face detection*, Cogn. Sci. 33:1144, https://doi.org/10.1111/j.1551-6709.2009.01035.x. **Verified (abstract); foundational.** Detection "declines when color information is removed from faces" and faces "in unnatural colors are hard to detect"; detection uses "a face template combining diagnostic color and face-shape information". Paired with **Prunty et al. 2024**, *A cognitive template for human face detection*, Cognition, https://doi.org/10.1016/j.cognition.2024.105792 (**verified, abstract**): the template may be a statistical average of faces seen. An initials disc has neither skin colour nor face shape, so the face-detection route does not apply to it at all (inference).

### Does a 24–36px face still get the advantage? (computed)

- CSS Values 4 defines the reference pixel as the visual angle of one pixel at 96 dpi "at an arm's length", about **0.0213°** (https://www.w3.org/TR/css-values-4/#reference-pixel).
  | Avatar | Reference px | MacBook-class laptop (0.199 mm/px, 50 cm) | Phone (0.163 mm/pt, 30 cm) |
  | --- | --- | --- | --- |
  | 24px | 0.51° | 0.55° | 0.75° |
  | 28px | 0.60° | 0.64° | 0.87° |
  | 36px | 0.77° | 0.82° | 1.12° |
  | 40px | 0.85° | 0.91° | 1.25° |
- The smallest faces in the studies above are 3° (Martin), then 8° (Grandjean) and 14° (Crouzet, Campbell). At the reference pixel those are **141 px, 376 px and 657 px**. A 36px avatar is a quarter of the smallest tested face, and a twentieth of Crouzet's.
- **Long, Yuan, Wu & Oruc 2025**, *The blur paradox: Better recognition at a distance*, J. Vis. 25(14):3, https://doi.org/10.1167/jov.25.14.3. **Verified (abstract).** Blurred celebrity faces were recognised better when smaller or further away. Coarse information carries familiar identity a long way down in size. This concerns recognition of known faces, not search speed.
- **No study was found of face detection or identification at under 1° in a list or grid** (searches 2026-10-26: Europe PMC "face detection stimulus size", "face pop-out eccentricity", Google Scholar-style web queries). **This is the gap.** The ~100 ms number should not appear on a page as if it applied to a 36px disc.

## 2. Recognising known people: faces, names, initials, colour

### Familiar and unfamiliar faces

- **Jenkins, White, Van Montfort & Burton 2011**, *Variability in photos of the same face*, Cognition 121:313, https://doi.org/10.1016/j.cognition.2011.08.001. **Verified (abstract).** "Within-person variability is often very large compared to the differences between people." Unfamiliar viewers saw photos of one person as different people; "familiar viewers perfectly identified the same photos." The often-quoted "7.5 identities" figure was not found in any source read: **unverified**.
- **Young & Burton 2018**, *Are we face experts?*, Trends Cogn. Sci. 22:100, https://doi.org/10.1016/j.tics.2017.11.007. **Verified (abstract).** "For identity recognition, most of us show only limited expertise with unfamiliar faces"; we are "familiar face experts."
- **Kramer, Young & Burton 2018**, *Understanding face familiarity*, Cognition 172:46, https://doi.org/10.1016/j.cognition.2017.12.005. **Verified (abstract).** Familiarity is graded, and its benefit comes from "being able to extract consistent information across different photos of the same face."
- **Yang & Beck 2023**, *Familiarity influences visual detection in a task that does not require explicit recognition*, Atten. Percept. Psychophys., https://doi.org/10.3758/s13414-023-02703-7. **Verified (abstract).** Famous faces and logos were better discriminated from scrambled versions than novel ones, at shorter durations than recognition needed. Familiarity speeds perception itself, for logos as well as faces.
- **Consequence for mail.** A photo helps for the dozen people you know well. For a first-time sender, a recruiter or a support agent, the photo is almost no help in finding the row later, and the Dunn 2018 accuracy (46 % for unfamiliar targets among 20) is the warning.

### Faces vs names

- **Moret-Tatay et al. 2021**, *Word and face recognition processing based on response times and ex-Gaussian components*, Entropy 23(5):580, https://doi.org/10.3390/e23050580. **Verified (full text).** 100 students, masked priming; "faces were processed faster than names", F(1,98) = 20.x (decimal lost in extraction). Means not extracted. This is a familiarity decision on famous people, not search in a list, and a modest venue. Use as direction only.
- The classic finding that faces are categorised faster than names are named, and that very familiar people reverse it (Brédart et al. 2005; Abdel Rahman et al. 2004), was seen only in search summaries: **secondary**.
- **No study compares finding a row by name, by photo and by initials in a list.** Searched 2026-10-26 (Europe PMC, web). The closest numbers are serial: eye-movement-paced search costs 150–300 ms per item (Wolfe & Horowitz 2004, already in `colour-and-unread`), and Dunn's 5.7 s for a familiar face among 20. Neither shows photos beating names in a list.

### Initials-only fallbacks and colour as identity

- **What the systems do.** All verified in source or docs:
  - **Fluent 2 React Avatar** (source: https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-avatar/library/src/components/Avatar/useAvatar.tsx and `Avatar.types.ts`). Colour defaults to `neutral` ("gray"). `colorful` "picks a color from a set of pre-defined colors, based on a hash of the name (or idForColor if provided)". The set has **30** named colours, including `dark-red`, `cranberry` and `red`. Initials drop to one letter at 16px. Sizes: 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 120, 128.
  - **Material 3 lists** (tokens: https://github.com/material-components/material-web/blob/main/tokens/versions/latest/sass/_md-comp-list.scss). `leading-avatar.color` is `primary-container`; label `on-primary-container`, Title Medium. **One colour for every person**: Material's list avatar carries identity in the letter, not the hue.
  - **Gmail Help**, *Change your Gmail profile picture* (https://support.google.com/mail/answer/35529): "If you don't have a photo, your initials show in your profile picture instead." The colour rule is not documented.
  - **Gravatar** (https://docs.gravatar.com/sdk/images/): URL from a "SHA256 hash of the user's email address"; fallbacks include `initials` and `color` (both beta), `identicon`, `mp` (one silhouette for everyone) and others.
  - **GitHub, *Identicons!*** (Jason Long, 14 Aug 2013, https://github.blog/news-insights/company-news/identicons/; foundational): 5×5 sprites "generated using a hash of the user's ID", with "hash-determined color values", for "anyone without a Gravatar".
  - **Atlassian Design System, Avatar** (https://atlassian.design/components/avatar/usage): users "generally upload their own image. If they haven't uploaded an image, the avatar will use a default image." No colour rule given.
  - Slack's fallback was not read: **unverified**.
- **Is a hashed colour a stable cue?** Stable, yes: the same id always gives the same hue. Distinctive, rarely:
  - Hues collide. With *k* hues and *n* visible senders, a target's hue is shared by about (*n* − 1)/*k* other rows on average (**computed**). Post's inbox: 19 rows, 8 hues → ≈ 2.25 others per hue; measured collisions in §7.
  - Small marks need bigger colour steps. **Szafir 2018**, *Modeling color difference for visualization design*, IEEE TVCG 24(1), https://doi.org/10.1109/TVCG.2017.2744359, replicated by **Hye, McNutt & Isaacs 2026**, *Ten years later: replicating two color discrimination studies*, arXiv:2608.24789, https://arxiv.org/abs/2608.24789 (**verified, full text of the replication; preprint, not peer-reviewed**). N = 144; 50 % thresholds in CIELAB at **0.25°: L\* 8.46, a\* 13.89, b\* 20.56**; at **2.0°: 4.61, 5.62, 8.00**. Changes in hue (a\*, b\*) need two to three times the step of changes in lightness. An avatar at 0.8° sits between the two sizes. The Szafir paper itself was not opened, so its own numbers are **secondary** (via the replication).
  - Wolfe & Horowitz's rule (already in `colour-and-unread`): guidance needs a difference "much greater than the just noticeable difference" among homogeneous distractors. Eight pastel hues, each repeated, are heterogeneous distractors by construction.
  - Learning a person–colour pairing. Wolfe & Horowitz 2017 report that search history and learned value persist (priming "can last for at least a week"), so a hue seen beside the same name every day could become a learned cue. **No study of learning arbitrary colour–person associations in interfaces was found.** Unknown how many people a user can hold by colour.
- **Conclusion.** In an initials avatar, the letters identify and the hue only narrows the search, and only when the target's hue happens to be rare on screen. Colour is a tiebreaker, not a code.

## 3. A fixed column and the habit of where to look

- **Location probability learning.**
  - **Jiang, Swallow, Rosenbaum & Herzig 2013**, *Rapid acquisition but slow extinction of an attentional bias in space*, JEP:HPP 39(1):87, https://doi.org/10.1037/a0027611. **Verified (abstract).** When targets were more often in one region, "an attentional bias toward the rich region developed over dozens of trials", and it "persisted for at least a week and for hundreds of trials" after the distribution became even.
  - **Jiang 2018**, *Habitual versus goal-driven attention*, Cortex 102:107, https://doi.org/10.1016/j.cortex.2017.06.018. **Verified (abstract).** "A search habit forms when people frequently find a visual search target in one region of space." It is "implicit", "viewer-centered", and "insensitive to secondary working memory load and aging". Goals set *where* attention goes; habits set *how one moves attention in space*.
  - The RT gain sizes are in the full texts, which were not reachable (403): **unverified**.
  - **Caution: Gaál et al. 2026**, *Revisiting object contextual cueing: a replication study*, Acta Psychol., https://doi.org/10.1016/j.actpsy.2026.106214 (**verified, abstract**). Chun & Jiang's object contextual cueing did not replicate across three experiments, one of them with faces, and individuals varied widely. Contextual cueing is a different effect from location probability learning, but pages shouldn't claim every learned-layout effect is robust.
- **Design systems.**
  - **Material 3, Lists: Guidelines** (https://m3.material.io/components/lists/guidelines, read in browser): "A list should be easy to scan. Any element can be used to anchor and align list item content." "Place supporting visuals and primary text in the same position in each list item." "Don't vary the position of elements within a list." "Anchor visuals to the leading edge of the list to improve scannability." Caution: "Avoid placing visuals in the center of a row because it makes the list difficult to scan." Avatars: "circular or expressive shapes to represent a person or entity. Use square or rectangular images for other content". No study is cited.
  - **Apple HIG, Lists and tables** (https://developer.apple.com/design/human-interface-guidelines/lists-and-tables, JSON source): "Prefer displaying text in a list or table"; "you might need to display a small image in the leading end of a row, followed by a brief explanatory label." The HIG has no avatar or contact-photo page.
  - **NN/g, Harley, *List Thumbnails on Mobile: When to Use Them and Where to Place Them*** (6 Dec 2015, https://www.nngroup.com/articles/mobile-list-thumbnail/; foundational, no data). Don't show images just because you have them; test whether a user could choose an item from the image alone. Left when the image is "essential to choosing", right when secondary. If you "cannot always include an image with each list item, place the thumbnails on the right to support text scanning." This is the only source found that names the cost of an anchor present on some rows and absent on others: the text's left edge goes ragged.
- **Cost when the anchor's position or presence varies.** No controlled list study was found (searched 2026-10-26). The argument is from mechanism: a viewer-centred habit (Jiang) is spent when the column moves, when it empties on some rows, or when a mode swaps it for something else. Mark this **inference** on any page.

## 4. Product guidance and stated reasons

- **Apple Mail (macOS).**
  - Mail 11 (macOS 10.13): "To show pictures in the message list, choose Mail > Preferences, click Viewing, then select 'Show contact photos in the message list.'" (https://support.apple.com/guide/mail/mail28012/11.0/mac/10.13, verified).
  - Mail 15 guide: "You can display senders' pictures when you view their emails", View > Show Contact Photo (https://support.apple.com/fr-afri/guide/mail/show-peoples-pictures-mail28012/15.0/mac/13.0, read in French, verified). Pictures come from Contacts. The current macOS 27 guide page did not load the article body.
- **Apple Mail (iOS).** Settings > Apps > Mail > Message List > Show Contact Photos, and an in-app toggle in iOS 18.5: **secondary** (webnots; iDownloadBlog, 3 Apr 2025). Business logos: **Apple Business, *Branded Mail*** (https://business.apple.com/partners/assets/branded-mail.pdf, verified): businesses can "Display a brand name and logo in the Mail app and on iCloud Mail", "Assure customers that they are communicating with a company verified by Apple Business", "Apple checks DNS records for DMARC." The iOS 18.2 claim that rows now emphasise contact photos stays **secondary** (9to5Mac, R20).
- **Gmail.**
  - Brand logos: **Google Workspace Updates**, *Additional BIMI protections* (24 Sep 2024, https://workspaceupdates.googleblog.com/2024/09/gmail-additional-bimi-protections.html, verified): "requiring strong authentication and verification of logos before they're displayed in Gmail as avatars". With a CMC "the sender's brand avatar will be displayed without the Gmail verified checkmark that's displayed for VMCs."
  - Android compact density replacing sender images with checkboxes: **secondary** (9to5Google, 2019).
- **Outlook (iOS, Android).** *Show contact photos* (https://support.microsoft.com/en-US/Outlook/show-contact-photos, verified): it controls "whether to have contact photos displayed next to messages in your inbox"; "contact photos are made available by your organization or email provider"; some account types have it off by default. The 2012 Outlook blog ("people-first inbox") was read in the earlier note for unread, not for photos.
- **Spark.** *Avatars in Spark* (https://support.readdle.com/spark/manage-your-inbox/avatars-in-spark, verified): Settings > General > Appearance > Show avatars, then "In the Mail List / Inside the Email Viewer". Sources: team profiles, the system address book, Gravatar, and Clearbit for services "such as Trello, Jira, and Google". Whether it is on by default is not stated.
- **Superhuman, HEY.** No first-party page on list avatars or their reasons was found. **Unverified.**
- **Stated reasons, across all of them:** "assure customers… verified" (Apple), "strong authentication and verification of logos" (Google). The reasons given for sender images are about trust in the sender, not search speed. No vendor publishes a speed claim for avatars. The M3 Expressive "4× faster" result (R1) is about a larger Send button, not avatars.
- **Entity vs person shape.** Atlassian: "Use circle avatars to represent a person", "hexagon avatars to represent an agent entity", "square avatars to represent other entities, such as a project, repository or space" (verified). Fluent: circular for an individual; square "Group" avatars "represent many people, like teams, organizations, or companies" (https://fluent2.microsoft.design/components/web/react/core/avatar/usage, verified). Material: circles for "a person or entity", squares for other content. Two of three systems use shape to separate people from organisations.
- **Sizes.**
  | System | List or row avatar | Other leading slots |
  | --- | --- | --- |
  | Material 3 lists (tokens) | 40dp; one-, two- and three-line items 56, 72 and 88dp | icon 24dp, image 56dp, video 100 × 56 or 114 × 64dp |
  | Fluent 2 | set of 16–128; presence badge hard to read "on medium avatars (32px) and smaller" | — |
  | Post | 36px comfortable, 24px compact (measured) | — |

## 5. Costs

- **Density.** A 36px face plus a 12px gap takes 48px of every row. That is 15 % of a 320px list pane (**computed**). Material's 40dp avatar implies a 72dp two-line row. Gmail compact on Android drops images for checkboxes (**secondary**).
- **Organisations and automated senders.** In Post's inbox **10 of 19 rows are organisations** (measured). For them a person-style monogram ("N", "F") says less than the name, and a logo needs either a verified-logo programme (BIMI with VMC or CMC; Apple Branded Mail) or a third-party logo service (Spark uses Clearbit). Yang & Beck 2023 suggest a familiar logo is perceived faster, but only if it is the real logo.
- **Privacy.**
  - Remote images leak: **Englehardt, Han & Narayanan 2018**, *I never signed up for this! Privacy implications of email tracking*, PoPETs 2018(1):109, https://doi.org/10.1515/popets-2018-0006 (**verified, abstract**). "About 30% of emails leak the recipient's email address to one or more of these third parties when they are viewed"; 16 clients' defences were "far from comprehensive." Foundational (2018), paired with **Apple's** current *Mail Privacy Protection & Privacy* page (https://www.apple.com/legal/privacy/data/en/mail-privacy-protection/; **secondary**, search snippet only): remote content routed through "two separate relays operated by different entities".
  - Avatar lookups are their own channel. Gravatar resolves an avatar from an email hash with "no further authentication from the user needed" (Gravatar docs, verified). A client that fetches it tells a third party which addresses you receive mail from. That last step is **inference**; no measurement was read.
- **When faces don't help.**
  - Lists of things (invoices, files, orders): NN/g's test, "could a user choose from the image alone?".
  - Unfamiliar senders: Dunn 2018 accuracy for unfamiliar targets was 46 %.
  - Rows from one sender repeated many times: the face is identical down the column. This is the "bypassing" condition of the layout note, where the eye learns to skip.
  - Sent mail, where what you look for is the recipient.

## 6. The identity mark's colour vs state cues

- **The rule already on the site.** `colour-means-one-thing`: "Each colour says one thing"; the accent is for the action at hand and the current selection; `danger` never means "new". Apple HIG, Color: "Avoid using the same color to mean different things" (in `colour-and-unread` §4).
- **Evidence that colourful distractors cost state search.**
  - **Shaikh et al. 2025**, *Distractor avoidance and early quitting in visual search*, Atten. Percept. Psychophys., https://doi.org/10.3758/s13414-025-03188-2 (**verified, abstract**). Salient distractors meant "fewer eye movements occurred before target-absent responses, and less of the display area was searched", and they "increased both search errors … and decision errors". Observers avoided looking at the distractor, and still missed more.
  - **Reppa & McDougall 2022**, *Aesthetic appeal influences visual search performance*, Atten. Percept. Psychophys. 84:2483, https://doi.org/10.3758/s13414-022-02567-3 (**verified, abstract**). N = 112, icon search; "compared to neutral distractors, appealing distractors slowed search RT down."
  - Wolfe & Horowitz 2017 (in `colour-and-unread`): salience falls with distractor heterogeneity, and efficiency falls with "the number of features shared by targets and distractors".
- **No study of colourful avatars beside coloured status marks was found** (searched 2026-10-26). The prediction: a row of saturated avatar hues is a field of salient, heterogeneous distractors for the unread dot. One of those hues near the accent is a direct target lookalike. **Inference.**
- **Separating them by chroma, not only hue.** Post's own values (**computed**, OKLCH from `tokens.css`):
  - accent `#0071e3` = L 0.563, C 0.193, h 256°
  - danger = C 0.169, h 33°; warning = C 0.120, h 66°; success = C 0.102, h 166°
  - avatar fills: C 0.04 (light) and 0.05 (dark); avatar text C 0.06. State marks carry 2.5–5× the chroma of any avatar, so the avatar can share a hue family with a status colour and still not read as one.
  - The exception is the selection tint, which is itself pale. `--accent-soft` `#e8f2ff` (C 0.021, h 255°) sits **ΔE76 6.3** from the hue-250 avatar fill and 9.4 from hue 290. Against the other six hues it is 11.7–23.0. A blue avatar on a selected row nearly vanishes into the selection.

---

## 7. Synthesis for the playbook

### Counterintuitive mechanisms worth a principle page

1. **The famous face speed is for finding *a* face, not *whose*.**
   - Saccades reach a face in 100–110 ms (Crouzet 2010; Campbell 2024; Grandjean 2025), and people can target 6.5 faces a second (Martin 2018). But detection is capacity-free and identity is not (Qarooni 2022).
   - In a list where every row has a face, detection tells you nothing. Finding one familiar face among 20 took 5.7 s (Dunn 2018).
   - And the lab faces were 3–14°, while a 36px avatar is about 0.8°.
2. **A face is only an identity for people you already know.**
   - Unfamiliar viewers split photos of one person into several people (Jenkins 2011). Searching for an unfamiliar target among 20 faces was 46 % accurate against 90 % for familiar ones (Dunn 2018).
   - Most of a real inbox is unfamiliar people and organisations; in Post, 10 of 19 rows are organisations. The face column earns its width on the few people you know.
3. **A fallback colour narrows; the letters decide.**
   - With 8 hues, each hue is shared by about one in eight senders: Jonas shares his with five other rows in Post's inbox.
   - Hue differences need 2–3× the step of lightness differences, and more at small sizes: 50 % thresholds of a\* 13.9 and b\* 20.6 at 0.25° vs 5.6 and 8.0 at 2° (Szafir 2018, replicated 2026).
   - Post's adjacent avatar hues differ by ΔE 8.3–12.7 in light mode. Fluent defaults avatars to grey and Material gives every avatar one colour; both make colour optional.
4. **The column's value is *where*, not *what*.**
   - A search habit for a region forms in dozens of trials and outlasts a week (Jiang 2013, 2018), and Material says "Don't vary the position of elements within a list."
   - What breaks it: an anchor that some rows lack, that moves, or that a mode swaps out. NN/g's fix for images some rows lack is to move them right, so the text keeps the left edge.
5. **Identity in pastel, state in colour.**
   - Salient distractors make people quit early and miss targets (Shaikh 2025); appealing distractors slow search (Reppa 2022).
   - In Post, state marks carry 2.5–5× the chroma of any avatar, which keeps the unread dot the only saturated mark at the row's start. The hue to keep off avatars is the accent's, because the selection tint is pale too (ΔE 6.3).

Strongest page: 1 + 2 + 4 as "Who, before what". Its counterintuitive core: the face's value is the column and the people you know, not face magic. Mechanism 5 is a Detail on that page, or a cross-link from `colour-means-one-thing`.

### Concrete rules with values

- **Column.**
  - One fixed leading column, the same x on every row and in every folder.
  - Never empty: no photo means a monogram, and an organisation without a logo gets a monogram in a square.
  - In selection mode, ticked rows show a check in the face's place; unticked rows keep their face.
- **Size by density.**
  | Density | Row | Face | Initials |
  | --- | --- | --- | --- |
  | Comfortable, two or three lines | 64–72px | 36–40px (≈ 0.8°) | 13px / 600 |
  | Compact, one line | 32–44px | 24px (≈ 0.5°) | 10px, or one letter at ≤ 20px (Fluent drops to one at 16px) |
  | Phone | — | 36–40pt (≈ 1.1–1.25°) | 13–15pt |

  Below 28px, treat the mark as a colour-and-letter anchor, not a face.
- **Fallback colour.**
  - Seed from the stable id (the address), never the display name, which changes. Fluent hashes the name unless `idForColor` is given.
  - Low chroma: OKLCH C ≤ 0.05 for the fill, at L ≈ 0.93 in light and ≈ 0.36 in dark.
  - Text on the fill ≥ 4.5:1 (Post: 9.1–9.3:1 light, 8.5–8.7:1 dark, computed).
  - Exclude the accent's hue band: accent 256° ± 30°, i.e. drop 250 and reconsider 290. Keep every avatar fill at least ΔE76 15 from the selection tint.
  - Don't rely on hue for identity. Seven or eight hues is plenty, since more hues only shrink the differences.
- **People vs organisations.**
  - Circle for a person, rounded square for an organisation (Atlassian, Fluent).
  - A verified logo where the provider supplies one (BIMI, Branded Mail). Otherwise one letter on a neutral square, not a hashed hue: an organisation's colour is its brand, and a hashed one is wrong.
- **What not to colour.** Unread, selection, focus and danger keep their saturated hues and never appear on an avatar. Stars keep their own yellow glyph. No presence or status badge on a mail avatar: mail has no presence, and Fluent warns badges are hard to see at ≤ 32px.
- **Privacy.** Use only images from the user's own contacts and verified brand logos. No Gravatar or remote lookups by default, and none while remote content is blocked.

### Demo ideas, on Post's real list

1. **Find Daniel (timed, three conditions).**
   - Post's 19 inbox rows, shuffled each trial. The prompt names the target ("Open Daniel's message").
   - Conditions: names only (face column removed, text on the same x) / initials on hashed hues (current) / initials on one neutral grey.
   - The reader does five trials per condition; the page shows their own medians side by side. Then it reveals that Daniel's violet is shared with Northside Climbing, and Jonas's blue-green with five other rows.
   - Expect hue to help for Daniel and hardly at all for Jonas. Whichever way it falls, the reader has measured it on themselves, which is the point.
2. **Known faces vs strangers.**
   - Two short lists with illustrated (not photographed) faces, to avoid real likenesses. In one, the reader sees the target's face once beforehand and then a differently lit version in the list; in the other, the same image.
   - The task is the same "open X's message". The gap shows why photos need familiarity. CC0 portrait sets with model releases could replace illustrations if found; otherwise keep illustrations.
3. **The column that comes and goes (Before/After).**
   - Before: faces only on people's rows, with organisation rows starting at the text edge, so text starts at two x positions. After: every row has a mark, people in circles and organisations in squares.
   - Task: "How many messages from Jonas?" A second toggle reproduces the selection state: all faces vanish when one row is ticked (today) vs only the ticked row's face.
4. **Pastel identity beside an unread dot (Tweak).**
   - One chroma slider for the avatar fills, 0 → 0.15, and one toggle that adds hue 250.
   - Task: "How many unread?", timed, with a counter of misses. At high chroma the avatars compete with the dot; with hue 250 on a selected row the avatar merges into the selection.

### Audit of Post's current avatars

Files: `src/demos/post/Avatar.tsx`, `Avatar.module.scss`, `people.ts`, `List.module.scss`, `Line.tsx`, and inbox data in `conversations.ts`. All values are measured or computed.

**What holds**
- A fixed 36px first column on every row, organisations included, with section headers aligned to the sender text edge. Compact 24px, phone 36px.
- Hue is hashed from `id`, so it is stable across the list, the conversation and recipient chips.
- Fills are low chroma (C 0.04 light, 0.05 dark), as the code's comment intends. Text contrast is 9.1–9.3:1 in light and 8.5–8.7:1 in dark.
- The unread dot sits left of the face in its own 20px inset, at C 0.193 against the avatars' ≤ 0.06. It is the only saturated mark at the row's start.
- `aria-hidden` on the avatar, with the name in text.

**Issues, by priority**
1. **The face hides in selection mode.** `[data-selecting] .line > .face { opacity: 0 }` removes every face once one row is ticked. That is exactly when you pick rows by sender. Show the check only on ticked rows and on the hovered row, and keep other faces (mechanism 4).
2. **Hue collisions.** Inbox rows by hue: 200° ×6 (Atlas, Weekly Diff, Northwind Billing, Greenhouse, Jonas ×2), 20° ×4 (Sam ×2, Priya, Ledger), 150° ×3 (Hana, Harbour Books, Lena), 100° ×2 (Mira, Field Notes), 290° ×2 (Daniel, Northside Climbing), 60° ×1, 330° ×1, and 250° unused. A third of the rows are one blue-green.
3. **Organisations look like people.** Ten organisation rows use a one-letter monogram in the same circle. Initials collide: "N" for Northwind Billing and Northside Climbing, "F" for Field Notes and Ferro Coffee, both pairs in the inbox. Use a rounded square on a neutral fill for `org: true`, and keep hashed hues for people only.
4. **Hue 250 is the accent's.** It is 6° from the accent's 256° and ΔE 6.3 from `--accent-soft`, so a selected row with a blue avatar loses its face. No current contact hashes to it, but any new one may. Drop it from `HUES` (seven remain) and check 290 (ΔE 9.4).
5. **Sent shows your own face.** `Line.tsx` renders `latest(c).from`, which is "me" in Sent, while the text says "To …". In Sent, show the first recipient's face. The same applies anywhere you replied last: today no inbox row's latest message is from you, but the code would show "Y".
6. **Names and face can disagree.** The names list participants oldest first ("Mira, me, Priya") while the face is the latest sender. Either is defensible. Choose one and make the face the first name, or the latest sender the first name.

### Folklore vs evidence

| Folklore | Evidence | Verdict |
| --- | --- | --- |
| "Faces are found in 100 ms, so avatars make rows instant to find." | 100–110 ms is for finding *a* face at 3–14°, not a particular one at 0.8° (Crouzet 2010; Campbell 2024; Martin 2018); a familiar face among 20 took 5.7 s (Dunn 2018). | Misapplied |
| "Faces pop out." | Among objects, real faces are found efficiently as targets, but irrelevant faces didn't capture attention (Miti 2025); among faces nothing pops out (Qarooni 2022). | Partly true |
| "A photo tells you who it is." | Only for familiar people; unfamiliar identities are poorly matched (Jenkins 2011; Young & Burton 2018; Dunn 2018: 46 %). | True for known people only |
| "Each person's colour makes them easy to spot." | 8 hues across 19 rows → shared hues; small marks need large hue steps (Szafir 2018 via 2026 replication). Fluent and Material default to no per-person colour. | Weak cue |
| "Avatars should be big and colourful to feel human." | Salient distractors cause misses (Shaikh 2025); appealing distractors slow search (Reppa 2022). | Costs state search |
| "Consistent position speeds scanning." | Location habits form fast and persist (Jiang 2013, 2018); Material: "Don't vary the position". No list study measured the cost. | Mechanism supported, size unmeasured |
| "Mail clients show avatars because they're faster." | Vendors' stated reasons are trust and verification (Apple Branded Mail, Gmail BIMI); no vendor publishes a speed claim. | Unsupported |
| "Fetching sender images is harmless." | ~30 % of commercial emails leak the address when viewed (Englehardt 2018); Gravatar resolves by email hash without user authentication. | False by default |

## Not verified, kept off pages

- The "7.5 identities" figure from Jenkins 2011's card sort.
- Szafir 2018's own threshold numbers (only the 2026 replication's were read).
- Jiang 2013 and 2018 RT gain sizes (full texts 403).
- Gmail's colour rule for initials avatars; Gmail Android compact dropping images (9to5Google only).
- iOS Mail's Show Contact Photos setting and iOS 18.2's row redesign (third-party sources only).
- Apple Mail Privacy Protection wording (snippet only).
- Superhuman, HEY and Slack avatar behaviour and reasons.
- Faces categorised faster than names are named, and its reversal for very familiar people (search summaries only).
- That initials discs bypass face detection entirely (inference from Bindemann & Burton 2009 and Prunty 2024).
- The cost of an anchor that varies row to row (inference; no study found).

## Gaps

- No study of face detection or identification below 1°, in a list, or at avatar sizes.
- No study comparing names, photos and initials for finding a row in a mail or chat list.
- No study of learning colour–person pairings, or of colourful avatars interfering with status marks.
- Demos 1 and 4 are the closest thing to evidence the page can offer, and the page should say so plainly.
