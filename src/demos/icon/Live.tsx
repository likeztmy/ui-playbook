import { Ellipsis, ListFilter, Plus, Search } from 'lucide-react';
import { TipGroup } from '../../ui/Tooltip';
import { StatusIcon } from '../track/StatusIcon';
import type { Status } from '../track/model';
import { Frame } from '../shell';
import { IconButton } from './IconButton';
import { Nav } from './Nav';
import s from './icon.module.scss';

const ISSUES: [string, Status][] = [
  ['Sign-up drops the workspace name', 'progress'],
  ['Export keeps the old column order', 'todo'],
  ['Settings page loads twice', 'review'],
  ['Archive shortcut on Windows', 'done'],
];

/** The page's own scene: places in words beside their icons, and four conventional actions in icons alone. */
export function IconLive() {
  return (
    <Frame label="A work tool’s sidebar and toolbar" height={280}>
      <div className={s.scene}>
        <div className={s.app}>
          <Nav />
          <section className={s.main} aria-label="My issues">
            <header className={s.bar}>
              <h3 className={s.barTitle}>My issues</h3>
              <div className={s.tools}>
                <TipGroup>
                  <IconButton label="Search" Icon={Search} />
                  <IconButton label="Filter" Icon={ListFilter} />
                  <IconButton label="New issue" Icon={Plus} />
                  <IconButton label="More" Icon={Ellipsis} />
                </TipGroup>
              </div>
            </header>
            <ul className={s.issues}>
              {ISSUES.map(([title, status]) => (
                <li key={title} className={s.issue}>
                  <StatusIcon status={status} />
                  <span className={s.issueTitle}>{title}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Frame>
  );
}
