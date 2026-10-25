import { Archive, File, Inbox, Send, Star, type LucideIcon } from 'lucide-react';
import type { Folder } from './model';

export const FOLDERS: { id: Folder; icon: LucideIcon }[] = [
  { id: 'inbox', icon: Inbox },
  { id: 'starred', icon: Star },
  { id: 'sent', icon: Send },
  { id: 'drafts', icon: File },
  { id: 'archive', icon: Archive },
];

export const FOLDER_NAME: Record<Folder, string> = { inbox: 'Inbox', starred: 'Starred', sent: 'Sent', drafts: 'Drafts', archive: 'Archive' };
