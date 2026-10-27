import { useState, type CSSProperties } from 'react';
import { Slider } from '../ui/Slider';
import { cx } from '../ui/cx';
import { Compare, Measured, Tweak, localized } from './shell';
import s from './demos.module.scss';

// ── An inbox in sections ─────────────────────────────────

const SECTIONS = [
  {
    title: 'Today',
    rows: [
      ['Mira Okafor', 'Q4 roadmap: final draft', '9:41'],
      ['Atlas Travel', 'Your trip to Lisbon is confirmed', '8:15'],
    ],
  },
  {
    title: 'Yesterday',
    rows: [
      ['Northwind Billing', 'Invoice #2041 is ready', '16:02'],
      ['Daniel Brooks', 'Lunch Friday?', '12:30'],
    ],
  },
  {
    title: 'This week',
    rows: [
      ['Priya Natarajan', 'Design review notes', 'Mon'],
      ['Field Notes', 'The case for slower software', 'Mon'],
    ],
  },
] as const;

/**
 * The sections, flat, so Measured sees every header and row. `above` is the
 * share of a header's space that goes above it; `scale` multiplies every gap.
 */
function Sections({ above, scale = 1, show, count }: { above: number; scale?: number; show?: boolean; count?: number }) {
  const vars = { '--rat-scale': scale, '--rat-above': above } as CSSProperties;
  return (
    <Measured className={s.ratList} show={show}>
      {SECTIONS.slice(0, count).flatMap((sec, i) => [
        <div key={sec.title} className={s.ratHead} data-first={i === 0 ? '' : undefined} style={vars}>
          {sec.title}
        </div>,
        ...sec.rows.map(([from, subject, time]) => (
          <div key={subject} className={s.ratRow} style={vars}>
            <span className={s.ratFrom}>{from}</span>
            <span className={s.ratSubject}>{subject}</span>
            <span className={s.ratTime}>{time}</span>
          </div>
        )),
      ])}
    </Measured>
  );
}

export const RatioScene = localized(function RatioScene() {
  return (
    <Compare
      beforeLabel="Half above, half below"
      afterLabel="85% above, 15% below"
      height={0}
      measure
      before={<Sections above={0.5} />}
      after={<Sections above={0.85} />}
      beforeNote="Each date header has as much space above it as below. “Yesterday” is as close to Today’s last message as to its own first one, so it reads as neither the end of one group nor the start of the next."
      afterNote={
        <>
          The same space, split unevenly: most of it above the header, little below, so the header joins the messages it names.
          Grouping by nearness follows the ratio of the gaps; in Kubovy’s dot lattices, once one spacing was about 1.6 times the other,
          people almost never grouped along it (
          <a href="https://doi.org/10.1006/cogp.1997.0673">Kubovy, Holcombe &amp; Wagemans, 1998</a>).
        </>
      }
    />
  );
});

/** The home page's card: the sections as the page settles them, with their gaps measured. */
export function RatioPreview() {
  return (
    <div className={s.ratPreview} aria-hidden>
      <Sections above={0.85} show count={2} />
    </div>
  );
}

// ── More space doesn't fix it ────────────────────────────

export const RatioScale = localized(function RatioScale() {
  const [scale, setScale] = useState(1);
  const [above, setAbove] = useState(50);
  // The gaps around a header, in the text's em boxes: the rows' and header's leading plus the spacing.
  const up = 3.5 + 4 * scale + 24 * scale * (above / 100) + 2;
  const down = 2 + 24 * scale * (1 - above / 100) + 4 * scale + 3.5;
  return (
    <Tweak
      height={0}
      readout={<code className={s.readout}>above ÷ below = {(up / down).toFixed(1)}×</code>}
      stage={<Sections above={above / 100} scale={scale} show />}
      controls={
        <>
          <Slider label="All spacing" value={scale} onValueChange={setScale} min={1} max={3} step={0.25} unit="×" />
          <Slider label="Header space above" value={above} onValueChange={setAbove} min={50} max={90} step={5} unit="%" />
        </>
      }
    />
  );
});

// ── A fill beats any gap ─────────────────────────────────

const LEDGER = [
  ['Ferro Coffee', '−$9.40', 'Food and drink · 22 Oct'],
  ['Harbour Books', '−$24.00', 'Shopping · 21 Oct'],
  ['Salary', '+$4,200.00', 'Income · 20 Oct'],
  ['Northside Climbing', '−$35.00', 'Health · 19 Oct'],
] as const;

/** Two-line transactions, striped by `by`: each line, or each transaction. */
function Ledger({ by }: { by: 'line' | 'record' }) {
  return (
    <div className={s.ratLedger}>
      {LEDGER.flatMap(([who, amount, meta], i) => [
        <div key={who} className={cx(s.ratLine, s.ratLineTop)} data-stripe={(by === 'line' ? i * 2 : i) % 2 ? '' : undefined}>
          <span>{who}</span>
          <span className={s.ratAmount}>{amount}</span>
        </div>,
        <div key={meta} className={cx(s.ratLine, s.ratLineMeta)} data-stripe={(by === 'line' ? i * 2 + 1 : i) % 2 ? '' : undefined}>
          {meta}
        </div>,
      ])}
    </div>
  );
}

export const RatioRegion = localized(function RatioRegion() {
  return (
    <Compare
      beforeLabel="Stripe per line"
      afterLabel="Stripe per transaction"
      height={0}
      before={<Ledger by="line" />}
      after={<Ledger by="record" />}
      beforeNote="The stripes alternate every line, so a transaction’s name and its details sit in different bands. Nothing but the fill differs: the spacing keeps each pair together, and the stripes pull them apart."
      afterNote={
        <>
          The stripes alternate every transaction. A shared background groups what it holds more strongly than nearness, and the smallest
          enclosing area wins (
          <a href="https://doi.org/10.1016/0010-0285(92)90014-S">Palmer, 1992</a>; reaction-time evidence reviewed in{' '}
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/">Wagemans et al., 2012</a>).
        </>
      }
    />
  );
});

// ── One left edge per kind ───────────────────────────────

const STREAM = [
  ['Build Bot', 'Deploy to staging passed', '9:58'],
  ['Build Bot', 'Deploy to production failed', '9:41'],
  ['Mira Okafor', 'Q4 roadmap: final draft', '9:30'],
  ['Build Bot', 'Nightly tests passed', '6:00'],
  ['Northwind Billing', 'Invoice #2041 is ready', '5:12'],
] as const;

/** One-line rows. `ragged` starts each subject wherever its sender ends. */
function Stream({ ragged }: { ragged?: boolean }) {
  return (
    <div className={cx(s.ratStream, ragged && s.ratRagged)}>
      {STREAM.map(([from, subject, time]) => (
        <div key={subject} className={s.ratRow}>
          <span className={s.ratFrom}>{from}</span>
          <span className={s.ratSubject}>{subject}</span>
          <span className={s.ratTime}>{time}</span>
        </div>
      ))}
    </div>
  );
}

export const RatioEdge = localized(function RatioEdge() {
  return (
    <Compare
      beforeLabel="Subjects start after sender"
      afterLabel="Subjects share one edge"
      height={0}
      before={<Stream ragged />}
      after={<Stream />}
      beforeNote="Each subject starts where its sender’s name ends, so every line’s news begins at a different place and the eye hunts for it on each return."
      afterNote={
        <>
          Subjects share one left edge, as wide as the longest sender. When many lines open with the same words, readers learn to skip them
          (NN/g’s <a href="https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/">bypassing pattern</a>); a fixed
          edge lets the skip land in the same place every time.
        </>
      }
    />
  );
});
