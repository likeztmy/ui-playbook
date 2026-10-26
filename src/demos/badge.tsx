import { Search } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Badge, type Tone } from '../ui/Badge';
import { cx } from '../ui/cx';
import { TextField } from '../ui/Field';
import { Compare, Frame, Gallery } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

type Task = { name: string; tone: Tone; state: string };

const TASKS: Task[] = [
  { name: 'Export cuts off long titles', tone: 'danger', state: 'Failed' },
  { name: 'Search ranks archived files', tone: 'warning', state: 'In review' },
  { name: 'Dark mode for charts', tone: 'success', state: 'Shipped' },
  { name: 'Bulk rename', tone: 'info', state: 'Scheduled' },
  { name: 'Keyboard map', tone: 'neutral', state: 'Draft' },
];

/** Tasks with their state as a badge, the way a list or table shows them. */
function TaskList({ badge }: { badge: (t: Task) => ReactNode }) {
  return (
    <ul className={s.taskList}>
      {TASKS.map((t) => (
        <li key={t.name}>
          <span>{t.name}</span>
          {badge(t)}
        </li>
      ))}
    </ul>
  );
}

const withWords = (t: Task) => (
  <Badge tone={t.tone} status>
    {t.state}
  </Badge>
);

const dotsOnly = (t: Task) => (
  <span className={m.dotOnly} role="img" aria-label={t.state} title={t.state}>
    <Badge tone={t.tone} status>
      {''}
    </Badge>
  </span>
);

type Issue = { id: string; title: string; tone: Tone; state: string; tag?: string };

const ISSUES: Issue[] = [
  { id: 'PB-142', title: 'Export cuts off long titles', tone: 'danger', state: 'Failed' },
  { id: 'PB-139', title: 'Search ranks archived files first', tone: 'warning', state: 'In review' },
  { id: 'PB-137', title: 'Smart folders', tone: 'info', state: 'Scheduled', tag: 'Beta' },
  { id: 'PB-131', title: 'Dark mode for charts', tone: 'success', state: 'Shipped' },
  { id: 'PB-128', title: 'Comments on exported PDFs', tone: 'warning', state: 'In review' },
  { id: 'PB-120', title: 'Keyboard map', tone: 'neutral', state: 'Draft' },
  { id: 'PB-117', title: 'Offline sync', tone: 'success', state: 'Shipped', tag: 'Beta' },
];

/** An issue list you can filter by any word, the states' included. */
function Issues() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = ISSUES.filter((i) => !q || [i.id, i.title, i.state, i.tag ?? ''].some((w) => w.toLowerCase().includes(q)));
  return (
    <div className={s.issues}>
      <TextField
        label="Filter"
        placeholder="Title, state or ID"
        value={query}
        onValueChange={setQuery}
        leading={<Search size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />}
      />
      {shown.length ? (
        <div className={s.issueList} role="list">
          {shown.map((i) => (
            <div key={i.id} className={s.issueRow} role="listitem">
              <span className={s.issueId}>{i.id}</span>
              <span className={s.issueTitle}>
                {i.title}
                {i.tag && <Badge tone="info">{i.tag}</Badge>}
              </span>
              <Badge tone={i.tone} status>
                {i.state}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.issueEmpty}>No issue matches “{query.trim()}”.</div>
      )}
    </div>
  );
}

export function BadgeScene() {
  return (
    <Frame label="Issues" height={0}>
      <Issues />
    </Frame>
  );
}

export function BadgeVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Status',
          use: 'Where something stands. A dot, then the state in words.',
          render: () => (
            <div className={s.leftRow}>
              {TASKS.map((t) => (
                <Badge key={t.state} tone={t.tone} status>
                  {t.state}
                </Badge>
              ))}
            </div>
          ),
        },
        {
          name: 'Attribute',
          use: 'What something is: a role, a plan, a stage of release. No dot.',
          render: () => (
            <div className={s.leftRow}>
              <Badge>Admin</Badge>
              <Badge tone="info">Beta</Badge>
              <Badge>Pro plan</Badge>
            </div>
          ),
        },
        {
          name: 'Beside a title',
          use: 'After the name it qualifies, on the name’s baseline.',
          render: () => (
            <div className={s.titledBadge}>
              <h4>Smart folders</h4>
              <Badge tone="info">Beta</Badge>
            </div>
          ),
        },
      ]}
    />
  );
}

export function BadgeAll() {
  return (
    <Frame label="Tones" height={0}>
      <div className={s.badgeGrid}>
        {TASKS.map((t) => (
          <div key={t.state} className={s.row}>
            <Badge tone={t.tone} status>
              {t.state}
            </Badge>
            <Badge tone={t.tone}>{t.state}</Badge>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// ── Comparisons ──────────────────────────────────────────

export function BadgeWords() {
  return (
    <Compare
      height={220}
      before={<TaskList badge={dotsOnly} />}
      after={<TaskList badge={withWords} />}
      beforeNote={
        <>
          A dot alone leaves anyone who can’t tell red from amber with a legend to learn;{' '}
          <a href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html">WCAG</a> asks that colour never be the only signal.
        </>
      }
      afterNote={
        <>
          The words carry the state, and they can be searched; the colour only speeds the scan. <a href="/principles/colour-means-one-thing">Colour means one thing</a>.
        </>
      }
    />
  );
}

export function BadgeGreyscale() {
  return (
    <Frame label="Without colour" height={220}>
      <div className={cx(s.row, m.greyscale)}>
        <TaskList badge={dotsOnly} />
        <TaskList badge={withWords} />
      </div>
    </Frame>
  );
}

export function BadgeSoft() {
  return (
    <Compare
      height={220}
      before={<TaskList badge={(t) => <Badge tone={t.tone} status className={m.solidBadge}>{t.state}</Badge>} />}
      after={<TaskList badge={withWords} />}
      beforeNote={
        <>
          Solid fills outweigh the names they describe, and a column of them becomes a patchwork. They’re the default in{' '}
          <a href="https://getbootstrap.com/docs/5.3/components/badge/">Bootstrap</a>.
        </>
      }
      afterNote="A tint is there when you look for it and quiet while you read."
    />
  );
}

export function BadgeDot() {
  const attrs = (dot: boolean) => (
    <div className={s.row}>
      <Badge status={dot}>Admin</Badge>
      <Badge tone="info" status={dot}>
        Beta
      </Badge>
      <Badge tone="success" status>
        Online
      </Badge>
    </div>
  );
  return (
    <Compare
      height={120}
      before={attrs(true)}
      after={attrs(false)}
      beforeNote="Admin and Beta read as states that could change at any moment, like Online."
      afterNote="A dot marks what can change; what something is goes without, so the one live state stands out."
    />
  );
}

export function BadgePreview() {
  return (
    <div className={s.row}>
      <Badge tone="success" status>
        Shipped
      </Badge>
      <Badge tone="warning" status>
        In review
      </Badge>
      <Badge tone="info">Beta</Badge>
    </div>
  );
}
