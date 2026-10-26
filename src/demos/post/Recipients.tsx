import { ChevronDown } from 'lucide-react';
import { Popover } from '../../ui/Popover';
import { Avatar } from './Avatar';
import type { Message } from './model';
import { person, shortName } from './people';
import s from './Recipients.module.scss';

/** "to me, Priya and 2 others": two names, then a count. */
export const summary = (m: Message) => {
  const all = [...m.to, ...(m.cc ?? [])];
  // The reader first: whether it's addressed to me is the first thing to know.
  const ordered = [...all.filter((id) => person(id).me), ...all.filter((id) => !person(id).me)];
  const named = ordered.slice(0, 2).map(shortName);
  const rest = ordered.length - named.length;
  if (rest === 0) return `to ${named.join(' and ')}`;
  return `to ${named.join(', ')} and ${rest} ${rest === 1 ? 'other' : 'others'}`;
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
          {summary(m)}
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
