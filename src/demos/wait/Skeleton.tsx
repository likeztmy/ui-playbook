import { useEffect, useState } from 'react';
import { Button } from '../../ui/Button';
import { useTimers } from '../novelty/useTimers';
import { Compare, localized } from '../shell';
import { Profile } from './Profile';
import { Spinner } from './Spinner';
import { useBusy } from './useBusy';
import s from './wait.module.scss';

const PAGE = 1500;
const PART = 900;
const RECENT = ['Type scale.fig', 'Critique notes', 'Tokens v4.json'];

/** The files section: its rows, bones while loading, or rows kept while a refresh runs. */
function Files({ state }: { state: 'shown' | 'bones' | 'refreshing' }) {
  return (
    <div className={s.waitFiles}>
      <span className={s.waitFilesHead}>
        Recent files
        {state === 'refreshing' && <Spinner />}
      </span>
      {RECENT.map((f, i) =>
        state === 'bones' ? (
          <span key={f} className={s.waitFileRow} aria-hidden>
            <span className={s.waitBone} style={{ width: [120, 96, 108][i], height: 12 }} />
          </span>
        ) : (
          <span key={f} className={s.waitFileRow}>
            {f}
          </span>
        ),
      )}
    </div>
  );
}

/**
 * A profile page that takes 1.5 s, and its files list, refreshed on its own in 0.9 s. `right`
 * gives the page a skeleton and the part a spinner; otherwise the page gets a spinner and the part
 * goes back to bones.
 */
function ProfilePage({ right }: { right?: boolean }) {
  const [page, setPage] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [part, setPart] = useState(false);
  const later = useTimers();
  // The button that was pressed says it's busy; the first load, which nobody pressed for, doesn't.
  const reloadBusy = useBusy(page && reloading);
  const refreshBusy = useBusy(part);
  const load = () => {
    setPage(true);
    later(() => {
      setPage(false);
      setReloading(false);
    }, PAGE);
  };
  const reload = () => {
    if (page) return;
    setReloading(true);
    load();
  };
  const refresh = () => {
    if (page || part) return;
    setPart(true);
    later(() => setPart(false), PART);
  };
  useEffect(load, []);
  return (
    <div className={s.waitProfileDemo}>
      <div className={s.waitProfileStage} aria-busy={page || part || undefined}>
        {page && !right ? (
          <span className={s.waitCentre}>
            <Spinner />
          </span>
        ) : (
          <div className={s.waitPage}>
            <Profile bones={page} />
            <Files state={page ? 'bones' : part ? (right ? 'refreshing' : 'bones') : 'shown'} />
          </div>
        )}
      </div>
      <div className={s.waitButtons}>
        <Button size="sm" variant="ghost" onClick={reload} loading={reloadBusy} loadingLabel="Reloading">
          Reload page
        </Button>
        <Button size="sm" variant="ghost" onClick={refresh} loading={refreshBusy} loadingLabel="Refreshing">
          Refresh files
        </Button>
      </div>
    </div>
  );
}

export const WaitSkeleton = localized(function WaitSkeleton() {
  return (
    <Compare
      beforeLabel="Page spinner, list bones"
      afterLabel="Page skeleton, list spinner"
      height={0}
      before={<ProfilePage />}
      after={<ProfilePage right />}
      beforeNote="A spinner in the middle of the page says something is coming, but not what or where, and everything then appears at once. Refreshing one list blanks it into bones, though its rows were already there."
      afterNote={
        <>
          The page holds its shape in a skeleton while it loads; refreshing one list keeps its rows and puts a small spinner by its title. NN/g keeps
          skeletons for full-page loads and spinners for a single part, a card or a video (
          <a href="https://www.nngroup.com/articles/skeleton-screens/">Skeleton screens</a>).
        </>
      }
    />
  );
});
