import { Archive, ChevronRight, MessageSquare, Pause, Play } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../../../../ui/Button';
import { Tabs } from '../../../../ui/Tabs';
import { useToast } from '../../../../ui/Toast';
import { CheckList } from '../CheckList';
import { at, releaseById, releaseName, type Status } from '../model';
import { PlaceLink } from '../PlaceLink';
import { Shell } from '../Shell';
import { isArchived, ME, pausedByArchive, setStatus, statusOf } from '../store';
import { Composer } from './Composer';
import { Properties } from './Properties';
import { story, type Event } from './story';
import { Timeline } from './Timeline';
import t from './Release.module.scss';

/**
 * One release: its history, checks and notes in tabs, its facts beside them. The header leads back to
 * the list it came from. Pausing a rollout, and resuming a paused or halted one, runs at once and
 * offers Undo (Toast); the history says who did it while it holds. In an archived project the page is
 * read-only: no rollout to pause or resume, no comment box.
 */
export function Release({ id }: { id: string }) {
  const r = releaseById(id);
  const told = story(r);
  const status = statusOf(r);
  const [posted, setPosted] = useState<Event[]>([]);
  const comments = useRef(0);
  const toast = useToast();
  const name = releaseName(r);
  const archived = isArchived();
  const change = (to: Status, title: string) => {
    const undo = setStatus([r.id], to);
    toast({ title, action: { label: 'Undo', onClick: undo } });
  };
  const changed: Event[] =
    status === r.status
      ? []
      : pausedByArchive(r)
        ? [{ Icon: Archive, who: ME, what: `archived the project, pausing the rollout at ${r.rollout}%`, hours: 0 }]
        : status === 'Paused'
          ? [{ Icon: Pause, who: ME, what: `paused the rollout at ${r.rollout}%`, hours: 0 }]
          : [{ Icon: Play, who: ME, what: `resumed the rollout at ${r.rollout}%`, hours: 0 }];
  return (
    <Shell
      title={
        <>
          <PlaceLink className={t.crumb} to={at('releases')}>
            Releases
          </PlaceLink>
          <ChevronRight className={t.chevron} size={16} aria-hidden />
          {name}
        </>
      }
      actions={
        archived ? undefined : status === 'Rolling out' ? (
          <Button size="sm" onClick={() => change('Paused', `Paused the rollout of ${name}`)}>
            <Pause size={16} aria-hidden /> Pause rollout
          </Button>
        ) : status === 'Paused' || status === 'Halted' ? (
          <Button size="sm" onClick={() => change('Rolling out', `Resumed the rollout of ${name}`)}>
            <Play size={16} aria-hidden /> Resume rollout
          </Button>
        ) : undefined
      }
    >
      <div className={t.layout}>
        <div className={t.main}>
          <h3 className={t.title}>{r.name}</h3>
          <Tabs.Root defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="checks" count={told.checks.length}>
                Checks
              </Tabs.Tab>
              <Tabs.Tab value="notes">Notes</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="overview" className={t.panel}>
              <Timeline events={[...posted, ...changed, ...told.events]} />
              {!archived && (
                <Composer
                  onPost={(quote) =>
                    setPosted((p) => [{ Icon: MessageSquare, who: ME, what: 'commented', hours: 0, quote, id: `c${++comments.current}` }, ...p])
                  }
                />
              )}
            </Tabs.Panel>
            <Tabs.Panel value="checks" className={t.panel}>
              {told.checks.length ? <CheckList checks={told.checks} /> : <p className={t.meta}>Checks run when a release is sent for review.</p>}
            </Tabs.Panel>
            <Tabs.Panel value="notes" className={t.panel}>
              {told.notes ? <p className={t.notes}>{told.notes}</p> : <p className={t.meta}>Notes are written when a release is sent for review.</p>}
            </Tabs.Panel>
          </Tabs.Root>
        </div>
        <Properties release={r} status={status} />
      </div>
    </Shell>
  );
}
