import { MEMBERS } from './data';
import s from './boundary.module.scss';

/** The access list: one group, its rows split by hairlines that start at the text. */
export function Members() {
  return (
    <ul className={s.group}>
      {MEMBERS.map((m) => (
        <li key={m.email} className={s.member}>
          <span className={s.avatar} aria-hidden>
            {m.name[0]}
          </span>
          <span className={s.who}>
            <span>{m.name}</span>
            <span className={s.muted}>{m.email}</span>
          </span>
          <span className={s.muted}>{m.role}</span>
        </li>
      ))}
    </ul>
  );
}
