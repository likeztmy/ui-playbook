import type { Person } from './model';

// Everyone in Post's sample mail. Names and companies are made up.
const LIST: Person[] = [
  { id: 'me', name: 'You', email: 'alex@post.example', me: true },
  { id: 'mira', name: 'Mira Okafor', email: 'mira@northwind.example' },
  { id: 'priya', name: 'Priya Natarajan', email: 'priya@northwind.example' },
  { id: 'jonas', name: 'Jonas Weber', email: 'jonas@northwind.example' },
  { id: 'hana', name: 'Hana Sato', email: 'hana@northwind.example' },
  { id: 'chidi', name: 'Chidi Eze', email: 'chidi@northwind.example' },
  { id: 'lena', name: 'Lena Park', email: 'lena@studio.example' },
  { id: 'daniel', name: 'Daniel Brooks', email: 'daniel@brooks.example' },
  { id: 'sam', name: 'Sam Lee', email: 'sam@lee.example' },
  { id: 'atlas', name: 'Atlas Travel', email: 'bookings@atlas.example', org: true },
  { id: 'billing', name: 'Northwind Billing', email: 'billing@northwind.example', org: true },
  { id: 'notes', name: 'Field Notes', email: 'letters@fieldnotes.example', org: true },
  { id: 'security', name: 'Post Security', email: 'security@post.example', org: true },
  { id: 'ferro', name: 'Ferro Coffee', email: 'receipts@ferro.example', org: true },
  { id: 'books', name: 'Harbour Books', email: 'orders@harbour.example', org: true },
  { id: 'climb', name: 'Northside Climbing', email: 'members@northside.example', org: true },
  { id: 'ledger', name: 'Ledger & Co', email: 'docs@ledger.example', org: true },
  { id: 'diff', name: 'The Weekly Diff', email: 'hello@weeklydiff.example', org: true },
  { id: 'green', name: 'Greenhouse Supply', email: 'hello@greenhouse.example', org: true },
];

export const PEOPLE: Record<string, Person> = Object.fromEntries(LIST.map((p) => [p.id, p]));

export const person = (id: string) => PEOPLE[id] ?? { id, name: id, email: `${id}@example.com` };

/** How someone is named in running text: "me" for the reader, a person by first name, a company in full. */
export const shortName = (id: string) => {
  const p = person(id);
  return p.me ? 'me' : p.org ? p.name : p.name.split(' ')[0];
};

/** Who wrote in a conversation, oldest first, each once: "Mira, me, Priya". At most three names. */
export const participants = (from: string[]) => {
  const seen = [...new Set(from)].map(shortName);
  return seen.length > 3 ? `${seen.slice(0, 2).join(', ')} … ${seen[seen.length - 1]}` : seen.join(', ');
};
