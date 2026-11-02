import { ChevronRight, CircleCheck, CircleX, GitCommitHorizontal, LoaderCircle, MessageSquare, Rocket } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../../ui/Badge';
import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/Field';
import { Tabs } from '../../../ui/Tabs';
import { initials } from './data';
import { Shell } from './Shell';
import s from './Page.module.scss';
import r from './Release.module.scss';

const timeline = [
  { Icon: Rocket, who: 'Mira Chen', what: 'raised the rollout to 25%', when: '2h ago' },
  { Icon: MessageSquare, who: 'Jonas Berg', what: 'commented', when: '3h ago', quote: 'Crash rate is flat after the first 10%. Fine to go on.' },
  { Icon: CircleCheck, who: 'Ship', what: 'finished checks: 3 passed, 1 changed', when: '5h ago' },
  { Icon: GitCommitHorizontal, who: 'Ada Okafor', what: 'added 12 changes from main', when: 'Yesterday' },
];

const checks = [
  { name: 'Unit tests', state: 'Passed in 4m 12s', tone: 'success', Icon: CircleCheck },
  { name: 'iOS build', state: 'Running, 6 of 9 steps', tone: 'warning', Icon: LoaderCircle },
  { name: 'Screenshot diff', state: '2 screens changed', tone: 'danger', Icon: CircleX },
  { name: 'Licence scan', state: 'Passed in 38s', tone: 'success', Icon: CircleCheck },
] as const;

const props = [
  [
    'Status',
    <Badge key="s" tone="info" status>
      Rolling out
    </Badge>,
  ],
  ['Platform', 'iOS'],
  ['Owner', 'Mira Chen'],
  ['Rollout', '25% of users'],
  ['Crash-free', '99.82%'],
  ['Target', 'Nov 6'],
] as const;

/** One release: its tabs, what happened, a reply box, and its properties on the side. */
export function Release() {
  const [reply, setReply] = useState('');
  return (
    <Shell
      section="releases"
      place={
        <>
          <span className={s.meta}>Releases</span>
          <ChevronRight size={16} className={r.chevron} aria-hidden />
          4.2.0 iOS
        </>
      }
    >
      <div className={r.layout}>
        <div className={r.main}>
          <div>
            <h2 className={s.title}>Offline drafts</h2>
            <p className={s.meta}>4.2.0 for iOS · 12 changes · started Oct 31</p>
          </div>
          <Tabs.Root defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="checks" count={4}>
                Checks
              </Tabs.Tab>
              <Tabs.Tab value="notes">Notes</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="overview" className={r.panel}>
              <ol className={r.timeline}>
                {timeline.map(({ Icon, who, what, when, quote }) => (
                  <li key={what}>
                    <span className={r.icon}>
                      <Icon size={16} aria-hidden />
                    </span>
                    <div>
                      <p>
                        <strong>{who}</strong> {what} <span className={s.meta}>· {when}</span>
                      </p>
                      {quote && <blockquote className={r.quote}>{quote}</blockquote>}
                    </div>
                  </li>
                ))}
              </ol>
              <div className={r.composer}>
                <span className={r.avatar} aria-hidden>
                  {initials('Sam Rivera')}
                </span>
                <TextField label="Reply" className={s.bare} multiline placeholder="Leave a comment" value={reply} onValueChange={setReply} />
                <div className={r.send}>
                  <Button size="sm" variant="primary" disabled={!reply.trim()} onClick={() => setReply('')}>
                    Comment
                  </Button>
                </div>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="checks" className={r.panel}>
              <ul className={r.rows}>
                {checks.map(({ name, state, tone, Icon }) => (
                  <li key={name}>
                    <Icon size={16} data-tone={tone} aria-hidden />
                    <span className={r.grow}>{name}</span>
                    <span className={s.meta}>{state}</span>
                  </li>
                ))}
              </ul>
            </Tabs.Panel>
            <Tabs.Panel value="notes" className={r.panel}>
              <div className={r.notes}>
                <h3>What’s new</h3>
                <p>Drafts now save on the device and sync when you’re back online. Nothing you write is lost on a train or a plane.</p>
                <h3>Fixed</h3>
                <p>The keyboard no longer covers the send button on smaller phones.</p>
              </div>
            </Tabs.Panel>
          </Tabs.Root>
        </div>
        <aside className={r.side} aria-label="Properties">
          <h3 className={r.sideTitle}>Properties</h3>
          <dl className={r.props}>
            {props.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <Button size="sm">Pause rollout</Button>
        </aside>
      </div>
    </Shell>
  );
}
