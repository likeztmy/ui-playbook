import { Copy, CopyPlus, FolderInput, Grid3x3, TextCursorInput, Trash2, Undo2, type LucideIcon } from 'lucide-react';

// One real menu, rendered by every direction: a canvas object's Edit menu.
// It exercises each item kind a menu page has to cover: disabled, checkbox,
// submenu, destructive, and shortcuts with modifiers.

export type Keys = string[];

export type Row =
  | { kind: 'item'; id: string; label: string; icon?: LucideIcon; keys?: Keys; disabled?: boolean; danger?: boolean }
  | { kind: 'check'; id: string; label: string; icon: LucideIcon; keys?: Keys; checked: boolean }
  | { kind: 'submenu'; id: string; label: string; icon: LucideIcon; items: string[] };

export type Group = { id: string; label?: string; rows: Row[] };

export const GROUPS: Group[] = [
  {
    id: 'edit',
    label: 'Edit',
    rows: [
      { kind: 'item', id: 'undo', label: 'Undo', icon: Undo2, keys: ['⌘', 'Z'], disabled: true },
      { kind: 'item', id: 'copy', label: 'Copy', icon: Copy, keys: ['⌘', 'C'] },
      { kind: 'item', id: 'duplicate', label: 'Duplicate', icon: CopyPlus, keys: ['⌘', 'D'] },
      { kind: 'item', id: 'rename', label: 'Rename', icon: TextCursorInput, keys: ['⌘', 'R'] },
    ],
  },
  {
    id: 'organize',
    label: 'Organize',
    rows: [
      { kind: 'submenu', id: 'move', label: 'Move to', icon: FolderInput, items: ['Inbox', 'Projects', 'Archive'] },
      { kind: 'check', id: 'grid', label: 'Snap to grid', icon: Grid3x3, keys: ['⇧', 'G'], checked: true },
    ],
  },
  {
    id: 'danger',
    rows: [{ kind: 'item', id: 'delete', label: 'Delete', icon: Trash2, keys: ['⌘', '⌫'], danger: true }],
  },
];
