// A team handbook in a work tool: enough pages to fill the sidebar, one long enough to scroll.

export const WORKSPACE = 'Northwind';
export const ACCOUNT = { name: 'Mira Chen', initials: 'MC' };

export const PAGES = [
  'Welcome',
  'How we work',
  'Release process',
  'On-call',
  'Incident reviews',
  'Code review',
  'Design reviews',
  'Writing specs',
  'Hiring loop',
  'Interview rubric',
  'Onboarding',
  'Expenses',
  'Travel',
  'Time off',
  'Security basics',
  'Access requests',
  'Customer calls',
  'Support rotation',
  'Roadmap',
  'Quarterly planning',
  'Brand',
  'Glossary',
];

export const CURRENT = 'Release process';

export const DOC: { heading?: string; text: string }[] = [
  {
    text: 'Every Tuesday we cut a release from main. Anything merged by noon goes out that afternoon; anything later waits a week unless it fixes something customers can see.',
  },
  {
    heading: 'Before the cut',
    text: 'The release owner checks that main is green, reads the merged pull requests since last week, and flags anything that changes billing, sign-in or data export.',
  },
  { text: 'Flagged changes need a second reviewer from the owning team before noon. If nobody is free, the change waits.' },
  {
    heading: 'Cutting',
    text: 'Run the release script from a clean checkout. It tags main, writes the changelog from pull-request titles, and opens the staging deploy.',
  },
  {
    text: 'Staging runs the smoke suite and the billing checks. A failure stops the release; the owner posts the failing check in the release channel and pings its team.',
  },
  {
    heading: 'Rolling out',
    text: 'Production goes out to 5% of workspaces for an hour, then 50%, then everyone. Each step waits for error rates to hold steady against the previous week.',
  },
  { text: 'If error rates climb, roll back first and investigate second. Rolling back is one command and takes about two minutes.' },
  {
    heading: 'After',
    text: 'The owner posts the changelog in the company channel and closes the release issue. Anything that slipped gets a line in next week’s issue.',
  },
  { text: 'Hotfixes skip the schedule but not the steps: a reviewer, the smoke suite, and the staged rollout, compressed to fifteen minutes each.' },
  {
    heading: 'Who owns it',
    text: 'Release ownership rotates weekly through the platform team. The rota lives in the On-call page; swaps are fine, as long as the rota is updated.',
  },
];
