import { useState } from 'react';
import { Badge, type Tone } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cx } from '../ui/cx';
import { Table, type Column, type Sort } from '../ui/Table';
import { Compare, Frame, Gallery } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

type File = { name: string; owner: string; status: [Tone, string]; size: number; modified: string; order: number; type: string; views: number; comments: number };

const FILES: File[] = [
  { name: 'Q4 roadmap.fig', owner: 'Ana Ruiz', status: ['success', 'Shipped'], size: 18.4, modified: 'Today', order: 6, type: 'Design', views: 1204, comments: 32 },
  { name: 'Brand guide.pdf', owner: 'Kenji Mori', status: ['warning', 'In review'], size: 4.2, modified: 'Yesterday', order: 5, type: 'Document', views: 388, comments: 7 },
  { name: 'Onboarding flow.fig', owner: 'Ana Ruiz', status: ['info', 'Scheduled'], size: 26.9, modified: 'Mon', order: 4, type: 'Design', views: 96, comments: 14 },
  { name: 'Metrics.csv', owner: 'Lea Novak', status: ['danger', 'Failed'], size: 0.8, modified: 'Last week', order: 3, type: 'Data', views: 41, comments: 0 },
  { name: 'Interview notes.md', owner: 'Sam Okafor', status: ['neutral', 'Draft'], size: 0.1, modified: 'In March', order: 2, type: 'Document', views: 12, comments: 3 },
];

const size = (mb: number) => `${mb.toFixed(1)} MB`;

const COLUMNS: Column<File>[] = [
  { key: 'name', header: 'Name', render: (f) => f.name, sortBy: (f) => f.name },
  { key: 'owner', header: 'Owner', muted: true, optional: true, render: (f) => f.owner, sortBy: (f) => f.owner },
  {
    key: 'status',
    header: 'Status',
    render: (f) => (
      <Badge tone={f.status[0]} status>
        {f.status[1]}
      </Badge>
    ),
  },
  { key: 'size', header: 'Size', numeric: true, render: (f) => size(f.size), sortBy: (f) => f.size },
  { key: 'modified', header: 'Modified', muted: true, render: (f) => f.modified, sortBy: (f) => f.order },
];

const WIDE: Column<File>[] = [
  ...COLUMNS,
  { key: 'type', header: 'Type', muted: true, render: (f) => f.type },
  { key: 'views', header: 'Views', numeric: true, render: (f) => f.views.toLocaleString('en') },
  { key: 'comments', header: 'Comments', numeric: true, render: (f) => f.comments },
];

/** A table that keeps its own sort and selection. */
function Files({ columns = COLUMNS, selectable, sortable = true, stickyFirst, className, initialSort = { key: 'modified', dir: 'desc' } as Sort }: {
  columns?: Column<File>[];
  selectable?: boolean;
  sortable?: boolean;
  stickyFirst?: boolean;
  className?: string;
  initialSort?: Sort;
}) {
  const [sort, setSort] = useState<Sort>(initialSort);
  const [selected, setSelected] = useState<string[]>([]);
  const cols = sortable ? columns : columns.map((c) => ({ ...c, sortBy: undefined }));
  return (
    <div className={cx(s.stack, s.fill)}>
      {selectable && (
        <div className={s.bulkBar} data-active={selected.length > 0 || undefined}>
          <span aria-live="polite">{selected.length ? `${selected.length} selected` : 'Select files to act on them'}</span>
          <Button size="sm" disabled={!selected.length}>
            Move…
          </Button>
          <Button size="sm" variant="danger" disabled={!selected.length}>
            Delete
          </Button>
        </div>
      )}
      <Table
        label="Files"
        columns={cols}
        rows={FILES}
        rowKey={(f) => f.name}
        sort={sortable ? sort : undefined}
        onSortChange={setSort}
        selected={selectable ? selected : undefined}
        onSelectedChange={setSelected}
        stickyFirst={stickyFirst}
        className={className}
      />
    </div>
  );
}

export function TableLive() {
  return (
    <Frame label="Files" height={0}>
      <Files selectable />
    </Frame>
  );
}

export function TableVariants() {
  return (
    <Gallery
      stacked
      rows={[
        { name: 'Plain', use: 'A few columns to read and compare.', render: () => <Files sortable={false} /> },
        { name: 'Sortable and selectable', use: 'For acting on many rows at once.', render: () => <Files selectable /> },
        { name: 'Wide', use: 'More columns than fit: scroll sideways, the name stays pinned.', render: () => <Files columns={WIDE} stickyFirst className={s.narrowTable} /> },
      ]}
    />
  );
}

export function TableStates() {
  return (
    <Frame label="All states: default, hover, selected" height={0} still>
      <div className={cx(s.stack, s.fill)}>
        <Table
          label="Row states"
          columns={COLUMNS.map((c) => ({ ...c, sortBy: undefined }))}
          rows={FILES.slice(0, 3)}
          rowKey={(f) => f.name}
          selected={['Onboarding flow.fig']}
          onSelectedChange={() => {}}
          pin={{ 'Brand guide.pdf': 'hover' }}
        />
      </div>
    </Frame>
  );
}

// ── Comparisons ──────────────────────────────────────────

export function TableNumbers() {
  const leftAligned = COLUMNS.map((c) => (c.numeric ? { ...c, numeric: false } : c));
  return (
    <Compare
      stacked
      height={260}
      before={<Files columns={leftAligned} sortable={false} className={m.proportionalTable} />}
      after={<Files sortable={false} />}
      beforeNote="Sizes left-aligned in proportional digits. 0.1 and 26.9 start at the same edge, so magnitude can't be read down the column."
      afterNote="Right-aligned, header too, in tabular figures: the decimal points line up, and the biggest file is the longest number."
    />
  );
}

export function TableLines() {
  return (
    <Compare
      stacked
      height={260}
      before={<Files sortable={false} className={m.zebraTable} />}
      after={<Files sortable={false} />}
      beforeNote="Zebra stripes. Every other row looks selected or hovered, and the real hover has nowhere left to go."
      afterNote="One line between rows. Fills are free for what they mean: hover is fill-hover, selected is accent-soft."
    />
  );
}

export function TableArrows() {
  return (
    <Compare
      stacked
      height={260}
      before={<Files className={m.allArrows} />}
      after={<Files />}
      beforeNote="An arrow on every sortable header. Which column is it sorted by? Five arrows, and only one of them means anything."
      afterNote="Only the sorted column keeps its arrow. The others show theirs on hover, which is all they need to say “you can sort by me”."
    />
  );
}

export function TableMuted() {
  const allInk = COLUMNS.map((c) => ({ ...c, muted: false }));
  return (
    <Compare
      stacked
      height={260}
      before={<Files columns={allInk} sortable={false} />}
      after={<Files sortable={false} />}
      beforeNote="Every column in ink. Owner and date weigh as much as the name, so the eye has no column to start from."
      afterNote="Secondary columns in ink-muted. Names lead; owners and dates are there when you look for them."
    />
  );
}

export function TableScroll() {
  return (
    <Compare
      stacked
      height={280}
      before={<Files columns={WIDE} sortable={false} className={cx(s.narrowTable, m.nothingPinned)} />}
      after={<Files columns={WIDE} sortable={false} stickyFirst className={s.narrowTable} />}
      beforeNote="Scroll right to see Views and the names scroll away with everything else. Whose row is 388 views?"
      afterNote="The name column stays pinned, with a line at its edge, while the rest scroll under it."
    />
  );
}

export function TablePreview() {
  return (
    <Table
      label="Files"
      columns={COLUMNS.filter((c) => c.key !== 'owner' && c.key !== 'modified').map((c) => ({ ...c, sortBy: undefined }))}
      rows={FILES.slice(0, 3)}
      rowKey={(f) => f.name}
    />
  );
}
