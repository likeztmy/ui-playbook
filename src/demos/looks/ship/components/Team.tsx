import { Button } from '../../../../ui/Button';
import { TextField } from '../../../../ui/Field';
import r from '../Rows.module.scss';
import { Section } from '../Section';
import t from './Team.module.scss';

const people = [
  { name: 'Mira Chen', role: 'Owner' },
  { name: 'Jonas Berg', role: 'Can publish' },
  { name: 'Ada Okafor', role: 'Can view' },
];
const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('');

/** People with their role, and a way to add one. Faces are grey: the accent stays off identity. */
export function Team() {
  return (
    <Section title="Release team" meta="3 people">
      <ul className={r.rows}>
        {people.map((p) => (
          <li key={p.name}>
            <span className={t.face} aria-hidden>
              {initials(p.name)}
            </span>
            <span className={r.grow}>{p.name}</span>
            <span className={r.muted}>{p.role}</span>
          </li>
        ))}
      </ul>
      <div className={t.invite}>
        <TextField label="Invite by email" type="text" inputMode="email" placeholder="name@company.com" />
        <Button>Invite</Button>
      </div>
    </Section>
  );
}
