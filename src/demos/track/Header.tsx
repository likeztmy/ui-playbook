import { Columns3, List, PanelLeft, ShoppingBag } from 'lucide-react';
import type { Ref } from 'react';
import { Button } from '../../ui/Button';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { Tabs } from '../../ui/Tabs';
import { Tip } from '../../ui/Tooltip';
import type { Scope, Track, View } from './useTrack';
import s from './Header.module.scss';

const TABS: { id: Scope; label: string }[] = [
  { id: 'all', label: 'All issues' },
  { id: 'active', label: 'Active' },
  { id: 'backlog', label: 'Backlog' },
];

type Props = {
  track: Track;
  view: View;
  /** While the sidebar is away, folded or on a phone: the button that brings it, where its own Hide was. */
  onShowSidebar?: () => void;
  showRef?: Ref<HTMLButtonElement>;
  /** Inside a page that has its own h1. */
  embedded?: boolean;
};

/** Where you are, which of its issues, and how they're laid out. */
export function Header({ track, view, onShowSidebar, showRef, embedded }: Props) {
  const Title = embedded ? 'span' : 'h1';
  return (
    <header className={s.header}>
      {onShowSidebar && (
        <Tip label="Show sidebar">
          <Button ref={showRef} variant="ghost" icon size="sm" aria-label="Show sidebar" className={s.show} onClick={onShowSidebar}>
            <PanelLeft size={16} strokeWidth={1.5} aria-hidden />
          </Button>
        </Tip>
      )}
      <Title className={s.title}>
        {track.place === 'issues' && (
          <span className={s.team} aria-hidden>
            <ShoppingBag size={12} strokeWidth={2} />
          </span>
        )}
        <span className={s.name}>{track.place === 'issues' ? 'Shop app' : 'My issues'}</span>
      </Title>
      {/* The playbook's tabs, on the header's own line: views of one set of issues, each with its count. */}
      <Tabs.Root value={track.scope} onValueChange={(v) => track.go(track.place, v as Scope)} className={s.tabsRoot}>
        <Tabs.List className={s.tabs} aria-label="Which issues">
          {TABS.map((t) => (
            <Tabs.Tab key={t.id} value={t.id} count={track.counts[t.id]} className={s.tab}>
              {t.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.Root>
      <SegmentedControl<View>
        className={s.view}
        label="Show as"
        value={view}
        onValueChange={track.setView}
        segments={[
          { value: 'list', label: 'List', icon: List },
          { value: 'board', label: 'Board', icon: Columns3 },
        ]}
      />
    </header>
  );
}
