import { CircleCheck, CircleDashed, CircleX } from 'lucide-react';
import { Section } from './Section';
import c from './Charts.module.scss';

// Running is progress, not a caution: it takes info (decision C35), so amber keeps one meaning.
const parts = [
  { label: 'Passed', n: 41, tone: 'success', Icon: CircleCheck },
  { label: 'Failed', n: 6, tone: 'danger', Icon: CircleX },
  { label: 'Running', n: 3, tone: 'accent-text', Icon: CircleDashed },
] as const;

/** Check outcomes: status colours, each with its icon and word in the legend. */
export function Donut({ className }: { className?: string }) {
  const total = parts.reduce((a, p) => a + p.n, 0);
  let at = 0;
  const stops = parts.map((p) => {
    const from = at;
    at += (p.n / total) * 100;
    return `var(--${p.tone}) ${from}% calc(${at}% - 1%), transparent calc(${at}% - 1%) ${at}%`;
  });
  return (
    <Section title="Checks this week" meta={`${total} runs`} className={className}>
      <div className={c.donutRow}>
        <div
          className={c.donut}
          style={{ background: `conic-gradient(${stops.join(', ')})` }}
          role="img"
          aria-label={parts.map((p) => `${p.n} ${p.label.toLowerCase()}`).join(', ')}
        />
        <ul className={c.legend}>
          {parts.map(({ label, n, tone, Icon }) => (
            <li key={label}>
              <Icon size={16} style={{ color: `var(--${tone})` }} aria-hidden />
              <span>{label}</span>
              <span className={c.n}>{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
