import { ArrowBigUp, ChevronUp, Command, CornerDownLeft, Delete, Option, type LucideIcon } from 'lucide-react';

// Shortcut symbols, drawn as Lucide icons: Geist has no ⌃ ⌥ ⇧ ⌘ ⌫ ↵ glyphs,
// and borrowing them from another font mixes weights.
export const KEY_ICON: Record<string, LucideIcon> = {
  '⌃': ChevronUp,
  '⌥': Option,
  '⇧': ArrowBigUp,
  '⌘': Command,
  '⌫': Delete,
  '↵': CornerDownLeft,
};

const MODIFIER_ORDER = ['⌃', '⌥', '⇧', '⌘'];

/** Modifiers in Apple's order, ⌃ ⌥ ⇧ ⌘, then the key: ['⌘', '⇧', 'Z'] → ⇧⌘Z. */
export function inAppleOrder(keys: string[]): string[] {
  const mods = keys.filter((k) => MODIFIER_ORDER.includes(k)).sort((a, b) => MODIFIER_ORDER.indexOf(a) - MODIFIER_ORDER.indexOf(b));
  return [...mods, ...keys.filter((k) => !MODIFIER_ORDER.includes(k))];
}
