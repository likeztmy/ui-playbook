import type { Person } from './model';

// The team. Names are made up.
const LIST: Person[] = [
  { id: 'me', name: 'Alex Morgan', me: true },
  { id: 'ana', name: 'Ana Ruiz' },
  { id: 'tom', name: 'Tom Becker' },
  { id: 'yuki', name: 'Yuki Mori' },
  { id: 'kofi', name: 'Kofi Mensah' },
];

export const PEOPLE: Record<string, Person> = Object.fromEntries(LIST.map((p) => [p.id, p]));
export const TEAM = LIST;
