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

const BY_EMAIL: Record<string, Person> = Object.fromEntries(LIST.map((p) => [p.email, p]));

/** Someone by id; an address typed in that matches no one stands for itself. */
export const person = (id: string): Person => PEOPLE[id] ?? BY_EMAIL[id] ?? { id, name: id, email: id.includes('@') ? id : `${id}@example.com` };

/** Everyone you can write to, for suggestions. */
export const CONTACTS = LIST.filter((p) => !p.me);

/** Contacts a word of whose name, or whose address, starts with `q`: "h" finds Hana, not every "northwind". */
export function findContacts(q: string, exclude: string[] = [], limit = 6) {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const starts = (p: Person) => [...p.name.toLowerCase().split(/\s+/), p.email].some((w) => w.startsWith(query));
  return CONTACTS.filter((p) => !exclude.includes(p.email) && starts(p)).slice(0, limit);
}

/** How someone is named in running text: "me" for the reader, a person by first name, a company in full. */
export const shortName = (id: string) => {
  const p = person(id);
  return p.me ? 'me' : p.org || p.name.includes('@') ? p.name : p.name.split(' ')[0];
};

/** Someone in a sentence: "you" for the reader, else as shortName. */
export const called = (id: string) => (person(id).me ? 'you' : shortName(id));

/** Whose: "your", "Mira's". */
export const whose = (id: string) => (person(id).me ? 'your' : `${shortName(id)}’s`);

/** Who wrote in a conversation, oldest first, each once: "Mira, me, Priya". At most three names. */
export const participants = (from: string[]) => {
  const seen = [...new Set(from)].map(shortName);
  return seen.length > 3 ? `${seen.slice(0, 2).join(', ')} … ${seen[seen.length - 1]}` : seen.join(', ');
};
