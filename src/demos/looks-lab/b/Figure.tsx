import type { ReactNode } from 'react';
import type { Theme } from '../address';
import type { LabLook } from '../looks';
import { Panel } from '../../looks/Panel';
import { Ship } from '../ship/Ship';
import type { Nav } from '../ship/Shell';
import type { PageId, Platform } from '../ship/model';
import s from './Specimens.module.scss';

type Props = {
  id: PageId;
  title: string;
  look: LabLook;
  theme: Theme;
  platform: Platform;
  onPlatform: (p: Platform) => void;
  caption: ReactNode;
};

/**
 * One of Ship's screens at true size, whole, in a frame: a figure on the page, not a box in the UI
 * (decision C3). Ship's places link to the figure that shows them.
 */
export function Figure({ id, title, look, theme, platform, onPlatform, caption }: Props) {
  const nav: Nav = {
    current: { page: id, platform: id === 'releases' ? platform : 'any' },
    href: (to) => `#${to.page}`,
    go: (to) => {
      if (to.page === 'releases') onPlatform(to.platform);
      document.getElementById(to.page)?.scrollIntoView();
      history.replaceState(null, '', `${location.pathname}${location.search}#${to.page}`);
    },
  };
  return (
    <figure id={id} className={s.figure} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <div className={s.frame}>
        <Panel values={look.values} theme={theme}>
          <Ship nav={nav} fit="content" />
        </Panel>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
