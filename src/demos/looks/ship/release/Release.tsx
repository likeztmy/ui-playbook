import { ChevronRight, MessageSquare, Pause, Play } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../../ui/Button';
import { Tabs } from '../../../../ui/Tabs';
import { useToast } from '../../../../ui/Toast';
import { CheckList } from '../CheckList';
import { at, releaseById, releaseName } from '../model';
import { PlaceLink } from '../PlaceLink';
import { Shell } from '../Shell';
import { Composer } from './Composer';
import { Properties } from './Properties';
import { story, type Event } from './story';
import { Timeline } from './Timeline';
import t from './Release.module.scss';

/**
 * One release: its history, checks and notes in tabs, its facts beside them. The header leads back to
 * the list it came from. Pausing a rollout runs at once and offers Undo (Toast), as Halt did not.
 */
export function Release({ id }: { id: string }) {
  const r = releaseById(id);
  const told = story(r);
  const [posted, setPosted] = useState<Event[]>([]);
  const [paused, setPaused] = useState(false);
  const toast = useToast();
  const name = releaseName(r);
  const pause = () => {
    setPaused(true);
    toast({ title: `Paused the rollout of ${name}`, action: { label: 'Undo', onClick: () => setPaused(false) } });
  };
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
        r.status === 'Rolling out' &&
        (paused ? (
          <Button size="sm" onClick={() => setPaused(false)}>
            <Play size={16} aria-hidden /> Resume rollout
          </Button>
        ) : (
          <Button size="sm" onClick={pause}>
            <Pause size={16} aria-hidden /> Pause rollout
          </Button>
        ))
      }
    >
      <div className={t.layout}>
        <div className={t.main}>
          <div>
            <h3 className={t.title}>{r.name}</h3>
            <p className={t.meta}>
              {r.version} for {r.platform} · {r.owner}
            </p>
          </div>
          <Tabs.Root defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="checks" count={told.checks.length}>
                Checks
              </Tabs.Tab>
              <Tabs.Tab value="notes">Notes</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="overview" className={t.panel}>
              <Timeline events={[...posted, ...told.events]} />
              <Composer onPost={(quote) => setPosted((p) => [{ Icon: MessageSquare, who: 'Mira Chen', what: 'commented', hours: 0, quote }, ...p])} />
            </Tabs.Panel>
            <Tabs.Panel value="checks" className={t.panel}>
              {told.checks.length ? <CheckList checks={told.checks} /> : <p className={t.meta}>Checks run when a release is sent for review.</p>}
            </Tabs.Panel>
            <Tabs.Panel value="notes" className={t.panel}>
              <p className={t.notes}>{told.notes}</p>
            </Tabs.Panel>
          </Tabs.Root>
        </div>
        <Properties release={r} paused={paused} />
      </div>
    </Shell>
  );
}
