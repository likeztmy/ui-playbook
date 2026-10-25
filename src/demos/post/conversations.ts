import type { Attachment, Block, Conversation, Inline, Message } from './model';

// Post's sample mailbox. Today is a Thursday; `day` counts back from it.

const p = (...text: Inline[]): Block => ({ kind: 'p', text });
const h = (text: string): Block => ({ kind: 'h', text });
const ul = (...items: string[]): Block => ({ kind: 'ul', items: items.map((i) => [i]) });
const ol = (...items: string[]): Block => ({ kind: 'ol', items: items.map((i) => [i]) });
const sign = (...lines: string[]): Block => ({ kind: 'signature', lines });
const pdf = (name: string, size: string): Attachment => ({ name, size, kind: 'pdf' });
/** A photo of an artwork; the file in public/post/ shares its name. Every one is public domain (CC0). */
const photo = (name: string, size: string, tint: string, ratio: number, alt: string, credit: string): Attachment => ({
  name: `${name}.jpg`,
  size,
  kind: 'image',
  tint,
  src: `/post/${name}.webp`,
  alt,
  ratio,
  credit,
});

const msg = (id: string, from: string, to: string[], at: string, body: Block[], more: Partial<Message> = {}): Message => ({
  id,
  from,
  to,
  at,
  body,
  ...more,
});

const ROADMAP_FIRST: Block[] = [
  p('Hi both,'),
  p('Here’s the Q4 roadmap as we left it on Thursday. Two changes since the draft:'),
  ul('Search moves to January, behind the offline work.', 'The beta goes to the design partners first, then everyone.'),
  p('Two open questions at the end. Can we settle them before Monday’s review?'),
  sign('Mira Okafor', 'Head of Product, Northwind'),
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'roadmap',
    subject: 'Q4 roadmap: final draft',
    folder: 'inbox',
    day: 0,
    time: '9:41',
    messages: [
      msg('roadmap-1', 'mira', ['me', 'priya'], 'Tue 16:20', ROADMAP_FIRST, { cc: ['jonas'] }),
      msg(
        'roadmap-2',
        'me',
        ['mira', 'priya'],
        'Tue 17:05',
        [p('Looks right to me. On the first question: I’d keep the migration with platform, since they own the schema.'), sign('Alex')],
        { cc: ['jonas'], quoted: ROADMAP_FIRST },
      ),
      msg(
        'roadmap-3',
        'priya',
        ['mira', 'me'],
        'Wed 10:12',
        [
          p('Agree on platform. For the beta, two things from the design side:'),
          ol('The empty states need a next step before partners see them.', 'Table numbers should line up on the right.'),
          { kind: 'quote', text: ['Search moves to January, behind the offline work.'] },
          p('Fine by me, as long as we keep the search box in the header so nothing shifts when it arrives.'),
          sign('Priya'),
        ],
        { cc: ['jonas'] },
      ),
      msg(
        'roadmap-4',
        'mira',
        ['me', 'priya'],
        'Thu 9:41',
        [
          p('Thanks both. Settled:'),
          {
            kind: 'table',
            head: ['Milestone', 'Owner', 'Date'],
            rows: [
              ['Offline sync', 'Platform', '14 Nov'],
              ['Design partner beta', 'Product', '28 Nov'],
              ['Everyone', 'Product', '12 Dec'],
              ['Search', 'Platform', '20 Jan'],
            ],
          },
          p('The final version is attached. I’ll walk through it on Monday.'),
          sign('Mira'),
        ],
        { cc: ['jonas'], unread: true, attachments: [pdf('Q4-roadmap-final.pdf', '1.2 MB')] },
      ),
    ],
  },
  {
    id: 'lisbon',
    subject: 'Your trip to Lisbon is confirmed',
    folder: 'inbox',
    day: 0,
    time: '8:15',
    messages: [
      msg(
        'lisbon-1',
        'atlas',
        ['me'],
        'Thu 8:15',
        [
          p('Your booking is confirmed. Booking reference ', { text: 'K7Q2', bold: true }, '.'),
          {
            kind: 'table',
            head: ['', 'Flight', 'Departs', 'Arrives'],
            rows: [
              ['Out', 'AT 412', 'Thu 14 Nov 07:25', '10:05'],
              ['Back', 'AT 419', 'Sun 17 Nov 18:40', '21:15'],
            ],
          },
          p('Check-in opens 24 hours before departure. ', { text: 'Manage your booking', href: '#' }),
          sign('Atlas Travel'),
        ],
        { unread: true },
      ),
    ],
  },
  {
    id: 'invoice',
    subject: 'Invoice #2041 is ready',
    folder: 'inbox',
    day: 1,
    time: '16:02',
    messages: [
      msg(
        'invoice-1',
        'billing',
        ['me'],
        'Wed 16:02',
        [
          p('Your October invoice is available.'),
          {
            kind: 'table',
            head: ['Item', 'Qty', 'Amount'],
            rows: [
              ['Team plan', '4 seats', '$48.00'],
              ['Tax', '', '$0.00'],
              ['Total', '', '$48.00'],
            ],
          },
          p('It will be charged to the card ending 4242 on 1 November.'),
        ],
        { attachments: [pdf('Invoice-2041.pdf', '84 KB')] },
      ),
    ],
  },
  {
    id: 'lunch',
    subject: 'Lunch Friday?',
    folder: 'inbox',
    day: 1,
    time: '12:30',
    messages: [
      msg('lunch-1', 'daniel', ['me'], 'Wed 11:58', [p('There’s a new ramen place by the office. 12:30?'), sign('D')]),
      msg('lunch-2', 'me', ['daniel'], 'Wed 12:10', [p('Yes! 12:30 works.')]),
      msg('lunch-3', 'daniel', ['me'], 'Wed 12:30', [p('Booked for two. See you there.')]),
    ],
  },
  {
    id: 'standup',
    subject: 'Standup notes, Tuesday',
    folder: 'inbox',
    day: 2,
    time: 'Tue',
    messages: [
      msg('standup-1', 'jonas', ['me', 'mira', 'priya', 'hana', 'chidi'], 'Tue 10:05', [
        h('Done'),
        ul('Offline queue retries with backoff', 'Schema migration dry run on staging'),
        h('Next'),
        ul('Search behind a flag on Thursday', 'Review the API change with Hana'),
        h('Blocked'),
        ul('Waiting on the API review'),
      ]),
    ],
  },
  {
    id: 'receipt',
    subject: 'Your receipt from Ferro Coffee',
    folder: 'inbox',
    day: 2,
    time: 'Tue',
    messages: [
      msg(
        'receipt-1',
        'ferro',
        ['me'],
        'Tue 8:02',
        [
          {
            kind: 'table',
            head: ['Item', 'Price'],
            rows: [
              ['Flat white', '$4.20'],
              ['Almond croissant', '$5.20'],
              ['Total', '$9.40'],
            ],
          },
          p('Thanks for stopping by.'),
        ],
        { unread: true },
      ),
    ],
  },
  {
    id: 'interview',
    subject: 'Interview loop for Friday',
    folder: 'inbox',
    day: 2,
    time: 'Tue',
    messages: [
      msg(
        'interview-1',
        'hana',
        ['me', 'chidi'],
        'Tue 9:30',
        [
          p('Four slots are booked for Friday. Can you take the systems design one?'),
          {
            kind: 'table',
            head: ['Time', 'Session', 'Interviewer'],
            rows: [
              ['10:00', 'Intro', 'Hana'],
              ['11:00', 'Coding', 'Chidi'],
              ['14:00', 'Systems design', '—'],
              ['15:30', 'Team chat', 'Mira'],
            ],
          },
          sign('Hana'),
        ],
        { cc: ['mira'], unread: true },
      ),
    ],
  },
  {
    id: 'review',
    subject: 'Design review notes',
    folder: 'inbox',
    starred: true,
    day: 3,
    time: 'Mon',
    messages: [
      msg('review-1', 'priya', ['me'], 'Mon 15:40', [
        p('Mostly small things. Three worth fixing before the beta:'),
        ol(
          'The empty state needs a next step, not just “Nothing here”.',
          'Numbers in the usage table should line up on the right.',
          'The save toast covers the primary button on small screens.',
        ),
        { kind: 'image', alt: 'The usage table, numbers aligned left', tint: 'oklch(0.9 0.03 250), oklch(0.82 0.05 260)', ratio: 16 / 7 },
        p('For the table, this is all it takes:'),
        { kind: 'code', text: 'td.number {\n  text-align: right;\n  font-variant-numeric: tabular-nums;\n}' },
        { kind: 'quote', text: ['Line up what people compare.'] },
        p('Happy to pair on it tomorrow.'),
        sign('Priya'),
      ]),
    ],
  },
  {
    id: 'notes',
    subject: 'This week: the case for slower software',
    folder: 'inbox',
    day: 3,
    time: 'Mon',
    messages: [
      msg(
        'notes-1',
        'notes',
        ['me'],
        'Mon 7:00',
        [
          h('The case for slower software'),
          {
            kind: 'image',
            alt: 'Claude Monet, Stacks of Wheat (End of Summer), 1890–91',
            credit: 'Art Institute of Chicago, CC0',
            src: '/post/stacks-of-wheat.webp',
            tint: 'oklch(0.8 0.05 80), oklch(0.68 0.07 300)',
            ratio: 1600 / 945,
          },
          p(
            'Monet painted the same two stacks of wheat for a year, one light at a time. Three essays on doing less, and one on doing it well. Read time: 12 minutes.',
          ),
          h('In this issue'),
          ul('Why the fastest teams ship less', 'Defaults are a decision', 'A short history of the undo button'),
          p({ text: 'Read on the web', href: '#' }),
          { kind: 'rule' },
          sign('Field Notes · You subscribed at fieldnotes.example', 'Unsubscribe'),
        ],
        { letter: true },
      ),
    ],
  },
  {
    id: 'security',
    subject: 'New sign-in from Safari on macOS',
    folder: 'inbox',
    day: 3,
    time: 'Mon',
    messages: [
      msg('security-1', 'security', ['me'], 'Mon 21:14', [
        p('Your account was signed in to from ', { text: 'Safari on macOS', bold: true }, ' near Lisbon.'),
        p('If this was you, there’s nothing to do. If not, ', { text: 'secure your account', href: '#' }, '.'),
      ]),
    ],
  },
  {
    id: 'books',
    subject: 'Your order has shipped',
    folder: 'inbox',
    day: 3,
    time: 'Mon',
    messages: [
      msg('books-1', 'books', ['me'], 'Mon 13:02', [
        p('Thinking in Systems is on its way and arrives Thursday.'),
        p({ text: 'Track your parcel', href: '#' }),
      ]),
    ],
  },
  {
    id: 'offsite',
    subject: 'Photos from the offsite',
    folder: 'inbox',
    day: 4,
    time: 'Sun',
    messages: [
      msg(
        'offsite-1',
        'sam',
        ['me', 'mira', 'priya', 'jonas', 'hana', 'chidi'],
        'Sat 19:20',
        [p('Shared album is up: 148 photos, mostly of the lake. Attached the postcards from Saturday’s museum stop.'), sign('Sam')],
        {
          attachments: [
            photo(
              'water-lilies',
              '1.8 MB',
              'oklch(0.7 0.06 230), oklch(0.6 0.07 160)',
              1600 / 1536,
              'Claude Monet, Water Lilies, 1906',
              'Art Institute of Chicago, CC0',
            ),
            photo(
              'great-wave',
              '2.1 MB',
              'oklch(0.9 0.03 85), oklch(0.5 0.1 255)',
              1600 / 1076,
              'Katsushika Hokusai, Under the Wave off Kanagawa, c. 1830–32',
              'The Met, CC0',
            ),
          ],
        },
      ),
      msg(
        'offsite-2',
        'sam',
        ['me', 'mira', 'priya', 'jonas', 'hana', 'chidi'],
        'Sun 10:02',
        [p('And the three I nearly forgot, from the gift shop.')],
        {
          attachments: [
            photo(
              'red-fuji',
              '2.3 MB',
              'oklch(0.6 0.12 35), oklch(0.55 0.1 245)',
              1600 / 1103,
              'Katsushika Hokusai, South Wind, Clear Sky (Red Fuji), c. 1830–32',
              'The Met, CC0',
            ),
            photo(
              'sudden-shower',
              '2.2 MB',
              'oklch(0.6 0.06 220), oklch(0.75 0.06 80)',
              1098 / 1600,
              'Utagawa Hiroshige, Sudden Shower over Shin-Ōhashi Bridge and Atake, 1857',
              'The Met, CC0',
            ),
            photo(
              'dance-class',
              '2.6 MB',
              'oklch(0.7 0.05 160), oklch(0.6 0.05 60)',
              1484 / 1600,
              'Edgar Degas, The Dance Class, 1874',
              'The Met, CC0',
            ),
          ],
        },
      ),
    ],
  },
  {
    id: 'retro',
    subject: 'Retro: what slowed us down',
    folder: 'inbox',
    day: 4,
    time: 'Sun',
    messages: [
      msg('retro-1', 'chidi', ['me', 'lena', 'jonas'], 'Fri 17:10', [
        p('Three themes came up:'),
        ol('Review queues', 'Flaky tests', 'Unclear owners'),
        p('Ideas welcome before Monday.'),
        sign('Chidi'),
      ]),
      msg('retro-2', 'lena', ['chidi', 'me', 'jonas'], 'Sat 9:44', [
        p('On owners: a one-line “who decides” at the top of each doc would have saved us a week.'),
      ]),
      msg('retro-3', 'jonas', ['chidi', 'me', 'lena'], 'Sun 11:30', [p('Flaky tests: I’ll quarantine the worst five on Monday and post the list.')]),
    ],
  },
  {
    id: 'gym',
    subject: 'Your membership renews next week',
    folder: 'inbox',
    day: 5,
    time: 'Sat',
    messages: [msg('gym-1', 'climb', ['me'], 'Sat 8:00', [p('Annual plan · $420. Manage it from your account.')])],
  },
  {
    id: 'figma',
    subject: 'Comments on the onboarding flow',
    folder: 'inbox',
    day: 5,
    time: 'Sat',
    messages: [
      msg(
        'figma-1',
        'lena',
        ['me'],
        'Sat 14:25',
        [
          p('Left eleven comments. The main ones:'),
          ol(
            'Step two asks for a team name before anyone knows why.',
            'The progress bar restarts when you go back.',
            'Empty states again: each should name the next step.',
          ),
          sign('Lena'),
        ],
        { unread: true },
      ),
    ],
  },
  {
    id: 'tax',
    subject: 'Documents needed by 15 November',
    folder: 'inbox',
    day: 6,
    time: 'Fri',
    messages: [
      msg('tax-1', 'ledger', ['me'], 'Fri 9:00', [
        p('Please upload these before 15 November:'),
        ol('Last year’s bank statements', 'Invoices over $1,000', 'Your company registration'),
      ]),
    ],
  },
  {
    id: 'diff',
    subject: 'Issue 112: the cost of a click',
    folder: 'inbox',
    day: 7,
    time: '17 Oct',
    messages: [
      msg(
        'diff-1',
        'diff',
        ['me'],
        '17 Oct 7:30',
        [
          h('The cost of a click'),
          p('Every extra step loses a share of the people who reach it. This week: how three products cut a step, and what it cost them.'),
          { kind: 'image', alt: 'A funnel chart, narrowing at each step', tint: 'oklch(0.88 0.05 140), oklch(0.74 0.08 160)', ratio: 2.2 },
          {
            kind: 'table',
            head: ['Product', 'Steps before', 'Steps after', 'Completion'],
            rows: [
              ['Checkout', '5', '3', '+11%'],
              ['Signup', '4', '2', '+18%'],
              ['Export', '3', '1', '+6%'],
            ],
          },
          p({ text: 'Read the full issue', href: '#' }),
          { kind: 'rule' },
          sign('The Weekly Diff', 'Unsubscribe'),
        ],
        { letter: true },
      ),
    ],
  },
  {
    id: 'plants',
    subject: 'Back in stock: the fiddle-leaf fig',
    folder: 'inbox',
    day: 7,
    time: '17 Oct',
    messages: [msg('plants-1', 'green', ['me'], '17 Oct 10:12', [p('The one you saved is available again.')])],
  },
  {
    id: 'feedback',
    subject: 'Interview feedback: systems design',
    folder: 'sent',
    day: 1,
    time: '18:40',
    messages: [
      msg('feedback-1', 'me', ['hana'], 'Wed 18:40', [p('Strong on trade-offs, a little quick on failure modes. I’d move forward.'), sign('Alex')]),
    ],
  },
  {
    id: 'oncall',
    subject: 'Reminder: on-call handover',
    folder: 'archive',
    day: 9,
    time: '15 Oct',
    messages: [msg('oncall-1', 'jonas', ['me'], '15 Oct 9:00', [p('Handover is Monday at 10:00. Bring the open incidents.')])],
  },
];
