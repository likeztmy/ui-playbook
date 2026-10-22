import { Tabs } from '../ui/Tabs';
import { cx } from '../ui/cx';
import { Compare, Frame, Gallery } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

type TabDef = { value: string; label: string; count?: number; body: string };

const PROJECT: TabDef[] = [
  { value: 'overview', label: 'Overview', body: 'Q4 roadmap: 3 milestones, due 19 December. Led by Ana.' },
  { value: 'issues', label: 'Issues', count: 12, body: '12 open issues, 4 assigned to you. Newest: “Export cuts off long titles”.' },
  { value: 'activity', label: 'Activity', body: 'Ana moved “Search” to In review, 2 hours ago.' },
  { value: 'settings', label: 'Settings', body: 'Visibility, members, and integrations for this project.' },
];

type ProjectTabsProps = {
  tabs?: TabDef[];
  defaultValue?: string;
  listClass?: string;
  tabClass?: string;
  /** Show the counts as plain text in parentheses. */
  parenCounts?: boolean;
  panels?: boolean;
};

function ProjectTabs({ tabs = PROJECT, defaultValue = 'overview', listClass, tabClass, parenCounts, panels = true }: ProjectTabsProps) {
  return (
    <Tabs.Root defaultValue={defaultValue} className={s.tabsDemo}>
      <Tabs.List className={listClass} aria-label="Project">
        {tabs.map((t) => (
          <Tabs.Tab key={t.value} value={t.value} count={parenCounts ? undefined : t.count} className={tabClass}>
            {parenCounts && t.count != null ? `${t.label} (${t.count})` : t.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {panels &&
        tabs.map((t) => (
          <Tabs.Panel key={t.value} value={t.value}>
            <p className={s.panelText}>{t.body}</p>
          </Tabs.Panel>
        ))}
    </Tabs.Root>
  );
}

export function TabsLive() {
  return (
    <Frame label="Live · arrows move and open, Home and End jump" height={180}>
      <ProjectTabs />
    </Frame>
  );
}

const MANY: TabDef[] = ['Overview', 'Issues', 'Pull requests', 'Discussions', 'Actions', 'Wiki', 'Insights', 'Settings'].map((l) => ({
  value: l.toLowerCase(),
  label: l,
  body: `${l} for this repository.`,
}));

export function TabsVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Sections',
          use: 'Views of one object. Labels are nouns.',
          render: () => <ProjectTabs tabs={PROJECT.map((t) => ({ ...t, count: undefined }))} panels={false} />,
        },
        {
          name: 'With counts',
          use: 'How much is behind a tab, when that’s why you’d open it.',
          render: () => <ProjectTabs panels={false} />,
        },
        {
          name: 'Overflowing',
          use: 'More than fit: the row scrolls sideways. Past about six, rethink.',
          render: () => <ProjectTabs tabs={MANY} panels={false} listClass={s.narrowTabs} />,
        },
      ]}
    />
  );
}

export function TabsStates() {
  return (
    <Frame label="All states" height={0}>
      <Tabs.Root defaultValue="current" className={s.tabsDemo}>
        <Tabs.List aria-label="States">
          <Tabs.Tab value="current">Current</Tabs.Tab>
          <Tabs.Tab value="default">Default</Tabs.Tab>
          <Tabs.Tab value="hover" pin="hover">
            Hover
          </Tabs.Tab>
          <Tabs.Tab value="focus" pin="focus">
            Focus
          </Tabs.Tab>
          <Tabs.Tab value="disabled" disabled>
            Disabled
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
    </Frame>
  );
}

// ── Comparisons ──────────────────────────────────────────

export function TabsWeight() {
  return (
    <Compare
      height={120}
      before={<ProjectTabs panels={false} tabClass={m.boldActiveTab} />}
      after={<ProjectTabs panels={false} />}
      beforeNote="The current tab turns bold. Bold is wider, so every tab after it shifts sideways each time you switch. Click along the row and watch Settings move."
      afterNote="Every tab is weight 500 all the time; only the colour changes. Nothing moves except the bar."
    />
  );
}

export function TabsIndicator() {
  return (
    <Compare
      height={120}
      before={<ProjectTabs panels={false} listClass={m.accentTabs} />}
      after={<ProjectTabs panels={false} />}
      beforeNote="An accent bar and accent text. The current tab is the one place you can’t usefully click, yet it’s the bluest thing in the row."
      afterNote="Ink, the colour of the content below. Blue stays with things that act, and the current tab reads as “here”, not “press”."
    />
  );
}

export function TabsOverflow() {
  return (
    <Compare
      height={140}
      before={<ProjectTabs tabs={MANY} panels={false} listClass={cx(s.narrowTabs, m.wrapTabs)} />}
      after={<ProjectTabs tabs={MANY} panels={false} listClass={s.narrowTabs} />}
      beforeNote="Wrapped onto more rows. Now there are several rows and one bar, and the rows below the first look like a different set of tabs."
      afterNote="One row that scrolls sideways; the cut-off label says there’s more. Arrow keys bring the next tab into view."
    />
  );
}

export function TabsCounts() {
  return (
    <Compare
      height={120}
      before={<ProjectTabs panels={false} parenCounts />}
      after={<ProjectTabs panels={false} />}
      beforeNote="“Issues (12)”: the number is part of the label, as loud as the word, and the label grows and shrinks as issues are closed."
      afterNote="A quiet mono chip beside the label. The name stays the name, and digits keep their width as the count changes."
    />
  );
}

export function TabsPreview() {
  return <ProjectTabs defaultValue="issues" panels={false} />;
}
