import { ChevronDown } from 'lucide-react';
import { Popover } from '../../ui/Popover';
import { Avatar } from './Avatar';
import type { Message } from './model';
import { called, person } from './people';
import s from './Recipients.module.scss';

/**
 * Who it went to, every name while it's three or fewer: "to you, Priya and Jonas". More than that,
 * the first two and "+3". What's hidden is missed, so name everyone who fits; first names, so they
 * fit a phone too (the full names and addresses are a click away).
 */
export const summary = (m: Message) => {
  const all = [...m.to, ...(m.cc ?? [])];
  // The reader first: whether it's addressed to you is the first thing to know.
  const ordered = [...all.filter((id) => person(id).me), ...all.filter((id) => !person(id).me)];
  const names = ordered.map(called);
  if (names.length <= 3) return `to ${names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0]}`;
  return `to ${names.slice(0, 2).join(', ')} +${names.length - 2}`;
};

/** One role's people, each as the app shows a person elsewhere: avatar, name, address. */
function People({ label, ids }: { label: string; ids: string[] }) {
  return (
    <div className={s.group}>
      <span className={s.label}>{label}</span>
      <ul className={s.people} aria-label={label}>
        {ids.map((id) => (
          <li key={id} className={s.person}>
            <Avatar id={id} size="sm" />
            <span className={s.name}>{person(id).name}</span>
            <span className={s.email}>{person(id).email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Who a message went to, summarised, opening to every address. */
export function Recipients({ m }: { m: Message }) {
  return (
    <Popover
      title="Recipients"
      hideTitle
      trigger={
        <button type="button" className={s.trigger}>
          <span className={s.names}>{summary(m)}</span>
          <ChevronDown size={14} strokeWidth={1.5} nonScalingStroke aria-hidden />
        </button>
      }
    >
      <div className={s.lists}>
        <People label="From" ids={[m.from]} />
        <People label="To" ids={m.to} />
        {m.cc?.length ? <People label="Cc" ids={m.cc} /> : null}
      </div>
    </Popover>
  );
}
