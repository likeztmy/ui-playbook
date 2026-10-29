import { CircleUser, FolderKanban, Inbox, Layers, Settings, type LucideIcon } from 'lucide-react';

/** A work tool's sidebar: the places, each a word and its icon. */
export const NAV: [string, LucideIcon][] = [
  ['Inbox', Inbox],
  ['My issues', CircleUser],
  ['Projects', FolderKanban],
  ['Views', Layers],
  ['Settings', Settings],
];
