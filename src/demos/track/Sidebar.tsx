import { ArrowLeft, Box, PanelLeft, ChevronDown, CircleDot, CircleUserRound, Inbox, IterationCw, Layers, RotateCcw, Search, ShoppingBag, SquarePen, Store, Users, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode, type Ref } from 'react';
import { Button } from '../../ui/Button';
import { Menu } from '../../ui/Menu';
import { Tip } from '../../ui/Tooltip';
import type { Place, Track } from './useTrack';
import s from './Sidebar.module.scss';

const ic = { size: 16, strokeWidth: 1.5, 'aria-hidden': true } as const;

type Props = {
  track: Track;
  onSearch: () => void;
  onNewIssue: () => void;
  /** After a place is picked: on a phone, the sidebar gets out of the way. */
  onGo?: () => void;
  onHide: () => void;
  hideRef?: Ref<HTMLButtonElement>;
  /** At full screen: the page Track came from. */
  back?: string;
};

/**
 * The sidebar, as trackers lay one out: the workspace, New issue then your places, then the
 * workspace's and each team's. Track builds the Shop app's issues and yours; the rest are there to
 * be seen where a tracker keeps them, and go nowhere. It lies on Post's desk, where you are lifted
 * onto the page's white.
 */
export function Sidebar({ track, onSearch, onNewIssue, onGo, onHide, hideRef, back }: Props) {
  const [teams, setTeams] = useState({ shop: true, brand: false });
  const at = (p: Place) => track.place === p;
  const go = (p: Place) => {
    track.go(p, 'all');
    onGo?.();
  };

  return (
    <nav className={s.sidebar} aria-label="Track">
      <div className={s.top}>
        <Tip label="Hide sidebar">
          <Button ref={hideRef} variant="ghost" icon size="sm" aria-label="Hide sidebar" onClick={onHide}>
            <PanelLeft {...ic} />
          </Button>
        </Tip>
        <Menu.Root>
          <Menu.Trigger className={s.workspace}>
            <span className={s.mark} aria-hidden>
              F
            </span>
            <span className={s.label}>Fernhill</span>
            <ChevronDown size={14} strokeWidth={1.5} aria-hidden className={s.muted} />
          </Menu.Trigger>
          <Menu.Popup>
            <Menu.Item icon={RotateCcw} onClick={track.reset}>
              Reset sample issues
            </Menu.Item>
            {back && (
              <Menu.Item icon={ArrowLeft} onClick={() => location.assign(back)}>
                Back to UI Playbook
              </Menu.Item>
            )}
          </Menu.Popup>
        </Menu.Root>
        <Tip label="Search" keys={['⌘', 'K']}>
          <Button variant="ghost" icon size="sm" aria-label="Search" onClick={onSearch}>
            <Search {...ic} />
          </Button>
        </Tip>
      </div>

      <div className={s.scroll}>
        <ul className={s.list}>
          {/* The one action among the places: first, and drawn like them, as in a chat app's New chat. */}
          <Item icon={SquarePen} onClick={onNewIssue}>
            New issue
          </Item>
          <Item icon={Inbox} current={at('inbox')} onClick={() => go('inbox')} meta={track.inbox.unread || undefined}>
            Inbox
          </Item>
          <Item icon={CircleUserRound} current={at('mine')} onClick={() => go('mine')}>
            My issues
          </Item>
        </ul>

        <Section label="Workspace">
          <Item icon={Box}>Projects</Item>
          <Item icon={Layers}>Views</Item>
          <Item icon={Users}>Members</Item>
        </Section>

        <Section label="Your teams">
          <Team icon={ShoppingBag} name="Shop app" open={teams.shop} holdsCurrent={at('issues')} onToggle={() => setTeams((t) => ({ ...t, shop: !t.shop }))}>
            <Item icon={CircleDot} sub current={at('issues')} onClick={() => go('issues')}>
              Issues
            </Item>
            <Item icon={IterationCw} sub>
              Cycles
            </Item>
            <Item icon={Box} sub>
              Projects
            </Item>
            <Item icon={Layers} sub>
              Views
            </Item>
          </Team>
          <Team icon={Store} name="Storefront" open={teams.brand} onToggle={() => setTeams((t) => ({ ...t, brand: !t.brand }))}>
            <Item icon={CircleDot} sub>
              Issues
            </Item>
            <Item icon={Box} sub>
              Projects
            </Item>
          </Team>
        </Section>
      </div>
    </nav>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={s.section}>
      <div className={s.sectionLabel}>{label}</div>
      <ul className={s.list} aria-label={label}>
        {children}
      </ul>
    </div>
  );
}

type ItemProps = {
  icon: LucideIcon;
  children: ReactNode;
  /** Under a team, one step in. */
  sub?: boolean;
  current?: boolean;
  /** None: a place Track doesn't build, shown where it would be. */
  onClick?: () => void;
  /** At the row's end: how many are unread there. */
  meta?: number;
};

function Item({ icon: Icon, children, sub, current, onClick, meta }: ItemProps) {
  return (
    <li>
      <button
        type="button"
        className={s.item}
        data-sub={sub ? '' : undefined}
        aria-current={current ? 'page' : undefined}
        aria-disabled={onClick ? undefined : true}
        onClick={onClick}
      >
        <Icon {...ic} />
        <span className={s.label}>{children}</span>
        {meta != null && (
          <span className={s.meta} aria-label={`${meta} unread`}>
            {meta}
          </span>
        )}
      </button>
    </li>
  );
}

type TeamProps = { icon: LucideIcon; name: string; open: boolean; /** Where you are is one of its places. */ holdsCurrent?: boolean; onToggle: () => void; children: ReactNode };

/** A team and its places. Folded with where you are inside, the team's row takes the mark, so it's never lost. */
function Team({ icon: Icon, name, open, holdsCurrent, onToggle, children }: TeamProps) {
  return (
    <li>
      <button type="button" className={s.item} aria-expanded={open} data-holds={!open && holdsCurrent ? '' : undefined} onClick={onToggle}>
        <span className={s.team} aria-hidden>
          <Icon size={12} strokeWidth={2} />
        </span>
        <span className={s.label}>{name}</span>
        <ChevronDown size={14} strokeWidth={1.5} aria-hidden className={s.fold} />
      </button>
      {open && <ul className={s.list}>{children}</ul>}
    </li>
  );
}
