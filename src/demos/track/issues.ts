import { DETAILS } from './details';
import { byPriority, type Issue, type Priority, type Status } from './model';

// The shop app's issues as the team left them on Wednesday morning. Times are before NOW (when.ts).
type Row = [n: number, title: string, status: Status, priority: Priority, assignee: string | null, labels: string[], updated: string];

const ROWS: Row[] = [
  // Backlog
  [58, 'Wishlist: share a list with a link', 'backlog', 'low', null, ['Feature'], '2026-10-21T16:20'],
  [55, 'Gift cards at checkout', 'backlog', 'medium', null, ['Feature', 'Payments'], '2026-10-19T11:05'],
  [61, 'Recently viewed row on the home screen', 'backlog', 'low', 'yuki', ['Feature'], '2026-10-26T09:40'],
  [49, 'Size guide for shoes', 'backlog', 'none', null, ['Catalogue'], '2026-10-12T14:00'],
  [63, 'Dark mode product photos look washed out', 'backlog', 'medium', 'yuki', ['Design'], '2026-10-27T17:15'],
  [44, 'Back in stock alerts', 'backlog', 'low', null, ['Feature'], '2026-10-08T10:30'],
  [60, 'Apple Pay on the web', 'backlog', 'medium', 'kofi', ['Payments'], '2026-10-24T13:50'],
  [52, 'Order history: filter by year', 'backlog', 'none', null, ['Account'], '2026-10-15T15:25'],

  // Todo
  [64, 'Promo code field accepts spaces and fails', 'todo', 'high', 'tom', ['Bug', 'Checkout'], '2026-10-28T08:12'],
  [57, 'Filters: price range slider', 'todo', 'medium', 'ana', ['Search'], '2026-10-25T10:00'],
  [62, 'Product page: swipe between photos', 'todo', 'medium', 'yuki', ['Catalogue'], '2026-10-27T11:30'],
  [53, 'Saved addresses: set a default', 'todo', 'low', 'me', ['Account'], '2026-10-22T09:15'],
  [59, 'Empty cart says what to do next', 'todo', 'low', 'yuki', ['Design', 'Cart'], '2026-10-26T15:45'],
  [65, 'Search results jump when images load', 'todo', 'high', 'ana', ['Bug', 'Search'], '2026-10-28T09:20'],
  [56, 'Track parcel from the order page', 'todo', 'medium', 'kofi', ['Feature'], '2026-10-23T14:10'],
  [50, 'Reviews: sort by most helpful', 'todo', 'none', null, ['Catalogue'], '2026-10-16T12:00'],
  [54, 'Keep the cart when signing in', 'todo', 'high', 'me', ['Cart'], '2026-10-24T16:40'],

  // In progress
  [48, 'Checkout in one page', 'progress', 'high', 'me', ['Checkout'], '2026-10-28T09:48'],
  [51, 'Card payment fails on 3-D Secure redirect', 'progress', 'urgent', 'kofi', ['Bug', 'Payments'], '2026-10-28T09:05'],
  [46, 'Search suggestions as you type', 'progress', 'medium', 'ana', ['Search'], '2026-10-27T18:30'],
  [47, 'New product card design', 'progress', 'medium', 'yuki', ['Design', 'Catalogue'], '2026-10-27T14:55'],
  [42, 'Faster image loading on the category page', 'progress', 'medium', 'tom', ['Performance'], '2026-10-26T11:20'],
  [45, 'Quantity stepper in the cart', 'progress', 'low', 'tom', ['Cart'], '2026-10-27T10:05'],

  // In review
  [43, 'Show delivery dates before checkout', 'review', 'high', 'me', ['Checkout'], '2026-10-28T07:30'],
  [41, 'Out-of-stock sizes are greyed out, not hidden', 'review', 'medium', 'yuki', ['Catalogue'], '2026-10-27T16:10'],
  [40, 'Payment errors say what to do', 'review', 'high', 'kofi', ['Payments'], '2026-10-27T12:45'],
  [39, 'Search: typo tolerance', 'review', 'low', 'ana', ['Search'], '2026-10-25T17:00'],

  // Done
  [38, 'Sign in with email link', 'done', 'medium', 'tom', ['Account'], '2026-10-27T09:00'],
  [37, 'Cart badge shows the wrong count after removing', 'done', 'high', 'tom', ['Bug', 'Cart'], '2026-10-26T14:30'],
  [36, 'Free delivery threshold in the cart', 'done', 'medium', 'me', ['Cart'], '2026-10-24T11:10'],
  [35, 'Category pages: infinite scroll', 'done', 'low', 'ana', ['Catalogue'], '2026-10-22T10:20'],
  [34, 'PayPal', 'done', 'medium', 'kofi', ['Payments'], '2026-10-21T15:00'],
  [33, 'Product photos zoom on tap', 'done', 'low', 'yuki', ['Catalogue'], '2026-10-20T12:40'],
  [32, 'Order confirmation email', 'done', 'medium', 'me', ['Checkout'], '2026-10-17T09:30'],
  [31, 'Address lookup by postcode', 'done', 'medium', 'kofi', ['Checkout'], '2026-10-15T16:00'],
  [30, 'Search crashes on emoji', 'done', 'urgent', 'ana', ['Bug', 'Search'], '2026-10-14T10:50'],
  [29, 'App icon and splash screen', 'done', 'none', 'yuki', ['Design'], '2026-10-10T13:00'],
  [28, 'Guest checkout', 'done', 'high', 'me', ['Checkout'], '2026-10-09T11:15'],
  [27, 'Product list from the catalogue API', 'done', 'medium', 'tom', ['Catalogue'], '2026-10-06T10:00'],
];

// A few issues say more than their title; the rest wait for someone to write it.
const DESCRIPTIONS: Record<number, string> = {
  51: 'Some banks send the shopper back to the app without a result. We show "Payment failed" and the card is charged anyway. Seen on iOS with two banks so far.\n\nRepro: pay with the 3-D Secure test card, approve in the bank page, wait on the redirect.',
  48: 'Address, delivery and payment on one page instead of three steps. Each section collapses to a summary once it is filled in, and can be opened again to change it.',
  64: 'Codes pasted from emails often end in a space. Trim before checking, and say what was wrong when a code really is invalid.',
  65: 'The grid reflows as each image arrives, so the result you were about to tap moves. Give each tile its size before the image loads.',
  43: 'Show "Arrives Thu 30 Oct" on the product page and in the cart, from the warehouse and the shopper’s postcode.',
  40: 'Instead of "Payment declined", say what happened and what to try: another card, check the details, or contact the bank.',
  46: 'Suggest products and categories after two letters. Recent searches first when the field is empty.',
  54: 'A guest cart is thrown away on sign-in. Merge it into the account’s cart, keeping the larger quantity of anything in both.',
};

// Who opened each: whoever has it, or Alex when no one does.
const at = (iso: string, days: number) => new Date(new Date(iso).getTime() - days * 864e5).toISOString().slice(0, 16);

const made = ROWS.map(([n, title, status, priority, assignee, labels, updated]): Issue => {
  const { history = [], ...detail } = DETAILS[n] ?? {};
  return {
    n,
    title,
    status,
    priority,
    assignee: assignee ?? undefined,
    labels,
    updated,
    description: DESCRIPTIONS[n] ?? '',
    rank: 0,
    activity: [
      { who: assignee ?? 'me', text: 'created the issue', at: at(updated, 3 + (n % 5)) },
      ...(status === 'backlog' || status === 'todo' ? [] : [{ who: assignee ?? 'me', text: `moved it to ${status === 'progress' ? 'In progress' : status === 'review' ? 'In review' : 'Done'}`, at: updated }]),
      ...history,
    ].sort((a, b) => a.at.localeCompare(b.at)),
    ...detail,
  };
});

// Ranks start in the order a team would set: the most pressing first.
export const ISSUES: Issue[] = [...made].sort(byPriority).map((i, k) => ({ ...i, rank: (k + 1) * 1000 }));
