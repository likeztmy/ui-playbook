# About Face, as it applies to the Skill

Cooper, Reimann, Cronin and Noessel, _About Face: The Essentials of Interaction Design_, 4th ed.
(Wiley, 2014, ISBN 978-1-118-76657-6).

**How sure this is.** Written from memory of the book, in our own words. Each idea is located by
chapter and the page its section starts on, from the publisher's own table of contents (the
[Wiley TOC excerpt](https://media.wiley.com/product_data/excerpt/71/11187665/1118766571-28.pdf)).
The text itself was not checked: the owner has no copy at hand. Nothing here goes onto a site page
until it has been read against the book. In the Skill it may guide the agent, marked as this
book's idea, not as a measured finding.

## The ideas that change what an agent builds

### What kind of thing it is: posture (ch. 9, "Product Postures", p. 206)

A product's posture is how it presents itself, set by how long and how attentively people use it.
The book's desktop postures:

- **Sovereign:** used for long stretches, often maximised, the main thing on screen. People become
  practised, so it can be dense, quiet in its visuals and rich in shortcuts; screen space goes to
  the work.
- **Transient:** comes up for one job and goes. It has to explain itself at a glance: larger,
  simpler, bolder, one thing at a time.
- **Daemonic:** runs unseen; its interface is mostly settings, met rarely.

It also covers the web and mobile (pp. 218, 225), where sites range from informational, read like
a document, to transactional, used like an app. Our kinds map onto it: a work tool is sovereign, a
quick consumer task leans transient, reading is the informational site, settings are where a
daemon is met.

### Design for people who already know enough: perpetual intermediates (ch. 10, p. 238)

Few people stay beginners and few become experts; most learn enough to get by and stop. So the
interface serves the middle: the frequent things in plain sight, the occasional things one step
away, and a faster way for those who want it on the path they already take. **Inflecting the
interface** (p. 240) is that ordering: what is used most is most prominent, and what is rare, or
dangerous, sits further in. A destructive action doesn't sit beside the one pressed all day.

### Don't break the flow (ch. 11, "Flow and Transparency" and "Orchestration", pp. 249–250)

Good tools let people forget the tool. Every question the product asks, every mode it switches,
every dialog it opens pulls attention from the work to the software. Prefer offering choices in
place to asking questions, act and let people correct rather than seek permission, keep the tools
for a job beside the job, and stay responsive while slow work runs. The book treats motion and
timing here too (p. 266).

### Excise: work that serves the software, not the goal (ch. 12, pp. 271–297)

A goal-directed task moves the person towards what they want; an excise task exists only because
of how the product is built. Kinds the book names include navigating between windows, panes and
pages to gather what one job needs, and modal interruptions: errors, alerts and confirmations. How
to remove it: remember what the person did last time, choose sensible defaults, never ask for what
the product already knows, put the controls where the work is, and don't make people ask
permission. Excise is contextual (p. 285): a step that's excise for the expert can guide the
beginner.

### Present the person's model, not the implementation (ch. 1, p. 16)

Software built the way it's implemented exposes its machinery (files, saving, records, ids).
People have their own model of what they're doing. The interface should present theirs: name
things as they do, and hide what only the implementation needs.

### Goals before tasks (ch. 1, p. 13; ch. 3, "Understanding Goals", p. 72)

Tasks change with the technology; the goal behind them doesn't. Asking what someone is trying to
get done leads to a different, usually simpler, design than listing the steps they take today.

### Save, storage and data entry (ch. 14, pp. 325–356)

The person thinks of their document as the document, not as a copy in memory and a file on disk
that have to be reconciled; saving should happen by itself, with versions to go back to. Data
entry should accept what people type and flag what's wrong rather than refuse it.

### Errors: feedback in place, and undo (ch. 15, pp. 357–376; ch. 21, p. 641)

Show state where people already look, continuously, instead of reporting it in a dialog (rich
modeless feedback, p. 358). Make actions reversible so exploring is safe (p. 363), and let people
preview or compare before committing (p. 376). Errors, alerts and confirmations are mostly
excise: do the thing, and offer undo (p. 641).

## Where each lands in the Skill

| Idea | Skill | Already argued by the playbook |
| --- | --- | --- |
| Posture | the kind of thing, first branch ([plan 4b](../plans/2026-11-01-looks-and-vague-words.md)) | the two systems |
| Perpetual intermediates, inflection | frequent in sight, rare and dangerous further in | The faster way lives on the slow way |
| Flow | no questions the product can answer itself; act, then offer to undo | Dialog, Toast |
| Excise | a check before finishing: count the steps that aren't the task; remember the last choice; default sensibly | none: new |
| The person's model | name things as people do, never by the implementation | Every line does a job |
| Goals before tasks | the brief asks the goal | none: new |
| Save and entry | a document saves itself; input is accepted and flagged | Error timing |
| Errors and undo | state in place, undo over confirm | Where the eye goes, Dialog, Toast |

New to the Skill: excise as a check, goals in the brief, and posture as the test for the kind.
