import { useRef, useState } from 'react';
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

/**
 * People with their role, and a way to add one. Faces are grey: the accent stays off identity. Invite
 * adds the address as a row; pressed with nothing typed, it puts the caret in the field (as Post comment).
 */
export function Team() {
  const [invited, setInvited] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const field = useRef<HTMLInputElement>(null);
  const rows = [...people, ...invited.map((name) => ({ name, role: 'Invited' }))];
  const invite = () => {
    const to = email.trim();
    if (!to) return field.current?.focus();
    setInvited((list) => (list.includes(to) ? list : [...list, to]));
    setEmail('');
  };
  return (
    <Section title="Release team" meta={`${rows.length} people`}>
      <ul className={`${r.rows} ${t.people}`}>
        {rows.map((p) => (
          <li key={p.name}>
            <span className={t.face} aria-hidden>
              {initials(p.name)}
            </span>
            <span className={r.grow}>{p.name}</span>
            <span className={r.muted}>{p.role}</span>
          </li>
        ))}
      </ul>
      <form
        className={t.invite}
        onSubmit={(e) => {
          e.preventDefault();
          invite();
        }}
      >
        <TextField
          label="Invite by email"
          type="text"
          inputMode="email"
          placeholder="name@company.com"
          value={email}
          onValueChange={setEmail}
          inputRef={field}
        />
        <Button type="submit">Invite</Button>
      </form>
    </Section>
  );
}
