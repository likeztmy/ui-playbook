import { Dashboard } from './Dashboard';
import { Releases } from './Releases';
import { Shell, type Nav } from './Shell';

/** Ship at its current place: the shell, and the page that place opens. */
export function Ship({ nav, fit, onPane }: { nav: Nav; fit: 'window' | 'content'; onPane?: (el: HTMLDivElement | null) => void }) {
  const { page, platform } = nav.current;
  return (
    <Shell nav={nav} fit={fit} onPane={onPane}>
      {page === 'dashboard' ? <Dashboard /> : <Releases platform={platform} onPlatform={(p) => nav.go({ page: 'releases', platform: p })} />}
    </Shell>
  );
}
