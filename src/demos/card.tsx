import { Copy, CopyPlus, Ellipsis, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Card, CardGrid } from '../ui/Card';
import { cx } from '../ui/cx';
import { Menu } from '../ui/Menu';
import { Swap } from '../ui/Swap';
import { Tip } from '../ui/Tooltip';
import { Compare, Frame, Gallery } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

// Stage contents: small compositions in content colours, so the colour on
// the page comes from the work, not the card.
type Art = 'bars' | 'swatches' | 'phone' | 'grid' | 'type' | 'chart';

function Thumb({ art }: { art: Art }) {
  return <div className={s.thumb} data-art={art} aria-hidden />;
}

type Project = { id: string; title: string; sub: string; art: Art };

const PROJECTS: Project[] = [
  { id: 'q4', title: 'Q4 roadmap', sub: 'Edited 2 hours ago', art: 'bars' },
  { id: 'brand', title: 'Brand refresh', sub: 'Edited yesterday', art: 'swatches' },
  { id: 'onboard', title: 'Onboarding', sub: 'Edited 3 days ago', art: 'phone' },
  { id: 'grid', title: 'Layout grid', sub: 'Edited last week', art: 'grid' },
  { id: 'type', title: 'Type scale', sub: 'Edited last week', art: 'type' },
  { id: 'metrics', title: 'Metrics', sub: 'Edited in March', art: 'chart' },
];

function MoreMenu({ title }: { title: string }) {
  return (
    <Menu.Root>
      <Tip label="More">
        <Menu.Trigger render={<Button variant="ghost" size="sm" icon aria-label={`More for ${title}`} />}>
          <Ellipsis size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
        </Menu.Trigger>
      </Tip>
      <Menu.Popup align="end">
        <Menu.Item icon={Pencil}>Rename</Menu.Item>
        <Menu.Item icon={CopyPlus}>Duplicate</Menu.Item>
        <Menu.Item icon={Copy}>Copy link</Menu.Item>
        <Menu.Separator />
        <Menu.Item icon={Trash2} danger>
          Delete
        </Menu.Item>
      </Menu.Popup>
    </Menu.Root>
  );
}

/** Replays a grid's entrance by remounting it. */
function Replayable({ children }: { children: (key: number) => ReactNode }) {
  const [n, setN] = useState(0);
  return (
    <div className={cx(s.stack, s.cardArea)}>
      {children(n)}
      <Button size="sm" variant="ghost" onClick={() => setN((x) => x + 1)}>
        <RotateCcw size={14} strokeWidth={1.5} nonScalingStroke aria-hidden />
        Replay
      </Button>
    </div>
  );
}

export function CardLive() {
  const [opened, setOpened] = useState<string | null>(null);
  return (
    <Frame label="Projects" height={420}>
      <div className={cx(s.stack, s.cardArea)}>
        <Replayable>
          {(n) => (
            <CardGrid key={n} minWidth={180}>
              {PROJECTS.map((p) => (
                <Card key={p.id} stage={<Thumb art={p.art} />} title={p.title} subtitle={p.sub} onOpen={() => setOpened(p.title)} action={<MoreMenu title={p.title} />} />
              ))}
            </CardGrid>
          )}
        </Replayable>
        <p className={s.meter} aria-live="polite">
          {opened ? (
            <>
              Opened <b>{opened}</b>
            </>
          ) : (
            'Nothing opened yet'
          )}
        </p>
      </div>
    </Frame>
  );
}

export function CardVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Link',
          use: 'Opens a project or a page. The whole card is the target.',
          render: () => <Card className={s.cardOne} stage={<Thumb art="bars" />} title="Q4 roadmap" subtitle="Edited 2 hours ago" onOpen={() => {}} />,
        },
        {
          name: 'With an action',
          use: 'A ghost icon button for the card’s own menu, apart from opening it.',
          render: () => (
            <Card className={s.cardOne} stage={<Thumb art="swatches" />} title="Brand refresh" subtitle="Edited yesterday" onOpen={() => {}} action={<MoreMenu title="Brand refresh" />} />
          ),
        },
        {
          name: 'Static',
          use: 'A sample or a specimen to look at. No hover: nothing to click.',
          render: () => <Card className={s.cardOne} stage={<Thumb art="type" />} title="Type scale" subtitle="A specimen" />,
        },
      ]}
    />
  );
}

export function CardStates() {
  return (
    <Frame label="All states" height={0} still>
      <div className={s.cardStates}>
        {(
          [
            ['Default', undefined],
            ['Hover', 'hover'],
            ['Pressed', 'hover active'],
            ['Focus', 'focus'],
          ] as [string, string | undefined][]
        ).map(([name, pin]) => (
          <div key={name} className={s.sliderState}>
            <span>{name}</span>
            <Card stage={<Thumb art="chart" />} title="Metrics" subtitle="Edited in March" onOpen={() => {}} pin={pin} />
          </div>
        ))}
      </div>
    </Frame>
  );
}

// ── Comparisons ──────────────────────────────────────────

export function CardAnatomy() {
  return (
    <Frame label="Stage" height={0}>
      <figure className={s.anatomyItem}>
        <div className={s.magnify}>
          <Card className={s.cardSmall} stage={<Thumb art="swatches" />} title="Brand refresh" />
        </div>
        <figcaption className={s.anatomyCaption}>radius-xl 18 − space-2 8 = radius-lg 10: the gap is as wide at the corners as along the sides. Shown at 2×.</figcaption>
      </figure>
    </Frame>
  );
}

export function CardHonest() {
  return (
    <Compare
      height={240}
      before={<Card className={cx(s.cardOne, m.fakeLift)} stage={<Thumb art="type" />} title="Type scale" subtitle="A specimen" />}
      after={<Card className={s.cardOne} stage={<Thumb art="type" />} title="Type scale" subtitle="A specimen" />}
      beforeNote="A static card that lifts on hover. It promises a click, the click does nothing, and people stop trusting the cards that do open."
      afterNote="No hover on a card that goes nowhere. Lift is a promise only a link or a button can keep."
    />
  );
}

export function CardLift() {
  return (
    <Compare
      height={240}
      before={<Card className={cx(s.cardOne, m.bigLift)} stage={<Thumb art="phone" />} title="Onboarding" subtitle="Edited 3 days ago" onOpen={() => {}} />}
      after={<Card className={s.cardOne} stage={<Thumb art="phone" />} title="Onboarding" subtitle="Edited 3 days ago" onOpen={() => {}} />}
      beforeNote="The same spring, up to 1.05 with a heavy shadow. In a grid the neighbours seem to shrink, and sweeping across leaves a wake of moving cards."
      afterNote="hover-lift 1.01 and shadow-sm on the gentle spring: enough to say “this one”, too little to disturb the grid."
    />
  );
}

export function CardStagger() {
  const grid = (key: number, className?: string) => (
    <CardGrid key={key} minWidth={64} className={className}>
      {Array.from({ length: 12 }, (_, i) => (
        <Card key={i} className={s.cardTiny} stage={<Thumb art={PROJECTS[i % 6].art} />} title={PROJECTS[i % 6].title} />
      ))}
    </CardGrid>
  );
  return (
    <Compare
      height={300}
      before={<Replayable>{(n) => grid(n, m.slowStagger)}</Replayable>}
      after={<Replayable>{(n) => grid(n)}</Replayable>}
      beforeNote="120ms between every card, uncapped: the twelfth waits 1.3 seconds. The grid performs instead of loading."
      afterNote="30ms apart, capped at eight: the whole grid is in within a quarter of a second, and the order still reads left to right."
    />
  );
}

function NumberCard({ animated }: { animated: boolean }) {
  const [v, setV] = useState('65.78');
  // Always two digits before the point, so the number never changes width.
  const next = () => setV((10 + Math.random() * 89).toFixed(2));
  return (
    <Card
      className={s.cardOne}
      stage={animated ? <Swap value={v} className={s.bigNumber} /> : <span className={s.bigNumber}>{v}</span>}
      title="Conversion"
      subtitle="Click to refresh"
      onOpen={next}
    />
  );
}

export function CardNumber() {
  return (
    <Compare
      height={240}
      before={<NumberCard animated={false} />}
      after={<NumberCard animated />}
      beforeNote="The new number replaces the old in one frame. Did it change? Only if you remembered the old one."
      afterNote="Each digit rises out of a blur, 30ms after the one before: the change is visible without a flash or a colour."
    />
  );
}

export function CardPreview() {
  return <Card className={s.cardOne} stage={<Thumb art="bars" />} title="Q4 roadmap" subtitle="Edited 2 hours ago" onOpen={() => {}} />;
}
