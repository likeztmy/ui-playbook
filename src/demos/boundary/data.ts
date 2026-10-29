/** A project's people, for the settings screen's access list. */
export const MEMBERS = [
  { name: 'Ana Ruiz', email: 'ana@studio.com', role: 'Owner' },
  { name: 'Kenji Mori', email: 'kenji@studio.com', role: 'Editor' },
  { name: 'Lea Fischer', email: 'lea@studio.com', role: 'Viewer' },
] as const;

/** The project overview's figures. */
export const STATS = [
  ['Open', '20'],
  ['Closed', '28'],
  ['Members', '6'],
] as const;

/** Three groups of preferences, for the left-edge demo. */
export const PREFS = [
  {
    title: 'Appearance',
    rows: [
      ['Theme', 'System'],
      ['Density', 'Comfortable'],
    ],
  },
  {
    title: 'Notifications',
    rows: [
      ['Email', 'Mentions only'],
      ['Desktop', 'All activity'],
    ],
  },
  {
    title: 'Language',
    rows: [
      ['Interface', 'English'],
      ['Date format', '30 Oct 2026'],
    ],
  },
] as const;
