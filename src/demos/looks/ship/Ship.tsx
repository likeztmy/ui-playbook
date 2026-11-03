import { Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '../../../ui/Button';
import { usePortalContainer } from '../../../ui/portal';
import { ToastProvider, useToast } from '../../../ui/Toast';
import { params } from '../address';
import { Components } from './components/Components';
import { Dashboard } from './dashboard/Dashboard';
import { Marketing } from './marketing/Marketing';
import { at, releaseName } from './model';
import { useNav } from './nav';
import { Overlays } from './overlays/Overlays';
import { Release } from './release/Release';
import { Releases } from './releases/Releases';
import { Settings } from './settings/Settings';
import { Shell } from './Shell';
import { States } from './states/States';
import { draft, useChanges } from './store';
import s from './Ship.module.scss';

/**
 * The one filled button on the pages it belongs to; detail and specimen pages have their own. It drafts
 * the next release for the platform in view and opens it; Undo discards the draft and, if it's still
 * open, goes back to where it came from.
 */
function NewRelease() {
  const { current, go } = useNav();
  const toast = useToast();
  const create = () => {
    const from = current;
    const { release, undo } = draft(current.platform === 'any' ? 'iOS' : current.platform);
    go(at('release', { release: release.id }));
    toast({
      title: `Drafted ${releaseName(release)}`,
      action: {
        label: 'Undo',
        onClick: () => {
          const open = params().get('release') === release.id;
          undo();
          if (open) go(from);
        },
      },
    });
  };
  return (
    <Button size="sm" variant="primary" onClick={create}>
      <Plus size={16} aria-hidden /> New release
    </Button>
  );
}
const newRelease = <NewRelease />;

function Page() {
  const { current, go } = useNav();
  switch (current.page) {
    case 'dashboard':
      return (
        <Shell actions={newRelease}>
          <Dashboard />
        </Shell>
      );
    case 'releases':
      return (
        <Shell actions={newRelease}>
          <Releases platform={current.platform} onPlatform={(p) => go(at('releases', { platform: p }))} />
        </Shell>
      );
    case 'release':
      return <Release key={current.release} id={current.release} />;
    case 'settings':
      return (
        <Shell>
          <Settings />
        </Shell>
      );
    case 'components':
      return (
        <Shell>
          <Components />
        </Shell>
      );
    case 'overlays':
      return (
        <Shell>
          <Overlays />
        </Shell>
      );
    case 'states':
      return (
        <Shell>
          <States />
        </Shell>
      );
    case 'marketing':
      return <Marketing />;
  }
}

/**
 * Ship at its current place. A move that takes away the control it came from (into the website and
 * out of it) hands focus to the new place: the lit sidebar link, else the scrolling page. Only a move
 * made from inside Ship does: opening the page or picking a look leaves focus where it was.
 */
export function Ship() {
  const { current } = useNav();
  useChanges();
  const root = useRef<HTMLDivElement>(null);
  const last = useRef<Element | null>(null);
  const where = `${current.page}:${current.platform}:${current.release}`;
  useEffect(() => {
    const came = last.current;
    if (!came || came.isConnected) return;
    const active = document.activeElement;
    if (active && active !== document.body && active.isConnected) return;
    const el = root.current;
    const target = el?.querySelector<HTMLElement>('[aria-current="page"]') ?? el?.querySelector<HTMLElement>('[data-pane]');
    target?.focus({ preventScroll: true });
  }, [where]);
  return (
    <div ref={root} className={s.ship} onFocus={(e) => (last.current = e.target)}>
      <ToastProvider container={usePortalContainer()}>
        <Page />
      </ToastProvider>
    </div>
  );
}
