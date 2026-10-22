import type { ReactNode } from 'react';
import { Badge, type Tone } from '../ui/Badge';
import { cx } from '../ui/cx';
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
  <span className={m.dotOnly} aria-label={t.state} title={t.state}>
    <Badge tone={t.tone} status>
      {''}
    </Badge>
  </span>
);

export function BadgeVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Status',
          use: 'Where something stands. A dot, then the state in words.',
          render: () => (
            <div className={s.row}>
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
            <div className={s.row}>
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
    <Frame label="Every tone, light and dark: switch the theme" height={0}>
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
      beforeNote="Colour alone. Which dot is In review and which is Failed? You'd need the legend, and red and amber sit at nearly the same lightness."
      afterNote="The words say the state; the colour only helps you scan. It reads the same to someone who can't tell red from amber."
    />
  );
}

export function BadgeGreyscale() {
  return (
    <Frame label="The same two lists, without colour" height={220}>
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
      beforeNote="Solid fills with white text. Five of them shout over the task names they describe, and a table of them becomes a patchwork."
      afterNote="A soft tint with the colour in the words: present when you look for it, quiet when you read the names."
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
      beforeNote="A dot on every badge. Admin and Beta now look like states that could change any moment, like Online."
      afterNote="The dot marks a state, which can change. Attributes, what something is, go without, so the one live state stands out."
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
