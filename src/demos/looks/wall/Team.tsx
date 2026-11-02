import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/Field';
import s from './Wall.module.scss';
import c from './Team.module.scss';

const people = [
  { name: 'Mira Chen', role: 'Owner' },
  { name: 'Jonas Berg', role: 'Can publish' },
  { name: 'Ade Okafor', role: 'Can view' },
];

/** People with their role, and a way to add one. */
export function Team() {
  return (
    <section className={s.card} aria-label="Release team">
      <div className={s.head}>
        <h3>Release team</h3>
        <span className={s.meta}>3 people</span>
      </div>
      <ul className={s.rows}>
        {people.map((p) => (
          <li key={p.name}>
            <span className={c.avatar} aria-hidden>
              {p.name
                .split(' ')
                .map((w) => w[0])
                .join('')}
            </span>
            <span className={s.grow}>{p.name}</span>
            <span className={s.muted}>{p.role}</span>
          </li>
        ))}
      </ul>
      <div className={c.invite}>
        <TextField label="Invite by email" placeholder="name@company.com" />
        <Button>Invite</Button>
      </div>
    </section>
  );
}
