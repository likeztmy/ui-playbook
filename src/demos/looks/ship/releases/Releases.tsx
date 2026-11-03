import { Download, Pause, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '../../../../ui/Badge';
import { Button } from '../../../../ui/Button';
import { TextField } from '../../../../ui/Field';
import { SegmentedControl } from '../../../../ui/SegmentedControl';
import { Select } from '../../../../ui/Select';
import { Table, type Column, type Sort } from '../../../../ui/Table';
import { at, hoursAgo, releaseName, releases, tone, type Platform, type Release } from '../model';
import { PlaceLink } from '../PlaceLink';
import r from './Releases.module.scss';

const PAGE = 8;

const columns: Column<Release>[] = [
  {
    key: 'version',
    header: 'Release',
    sortBy: (x) => x.version,
    // The release's name opens it; the checkbox selects (Table: one target, one job).
    render: (x) => (
      <span className={r.version}>
        <PlaceLink className={r.open} to={at('release', { release: x.id })}>
          {x.version}
        </PlaceLink>
        <span>{x.name}</span>
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortBy: (x) => x.status,
    render: (x) => (
      <Badge tone={tone(x.status)} status>
        {x.status}
      </Badge>
    ),
  },
  { key: 'platform', header: 'Platform', optional: true, render: (x) => x.platform, sortBy: (x) => x.platform },
  { key: 'owner', header: 'Owner', muted: true, optional: true, render: (x) => x.owner, sortBy: (x) => x.owner },
  { key: 'rollout', header: 'Rollout', numeric: true, optional: true, render: (x) => `${x.rollout}%`, sortBy: (x) => x.rollout },
  // Sorted on hours, so "Updated, newest first" is true row by row.
  { key: 'updated', header: 'Updated', muted: true, render: (x) => x.updated, sortBy: (x) => -hoursAgo(x) },
];

const filters = {
  all: () => true,
  active: (x: Release) => x.status === 'Rolling out' || x.status === 'In review',
  live: (x: Release) => x.status === 'Live',
  halted: (x: Release) => x.status === 'Halted',
};

type Props = { platform: Platform; onPlatform: (p: Platform) => void };

/** The list: filter, search, sort, select some and act on them, page through. The pane is its frame. */
export function Releases({ platform, onPlatform }: Props) {
  const [filter, setFilter] = useState<keyof typeof filters>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>({ key: 'updated', dir: 'desc' });
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const table = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  // Clearing the selection removes the bar the focus was in: it moves to select-all, never to <body>.
  const [cleared, setCleared] = useState(false);
  useEffect(() => {
    if (!cleared) return;
    table.current?.querySelector<HTMLElement>('thead [role="checkbox"]')?.focus();
    setCleared(false);
  }, [cleared]);

  const col = columns.find((c) => c.key === sort.key)!;
  const shown = releases
    .filter(filters[filter])
    .filter((x) => platform === 'any' || x.platform === platform)
    .filter((x) => `${x.version} ${x.name} ${x.owner}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const [x, y] = [col.sortBy!(a), col.sortBy!(b)];
      const d = x < y ? -1 : x > y ? 1 : 0;
      return sort.dir === 'asc' ? d : -d;
    });
  const pages = Math.max(1, Math.ceil(shown.length / PAGE));
  const at = Math.min(page, pages - 1);
  const rows = shown.slice(at * PAGE, at * PAGE + PAGE);
  const narrowed = filter !== 'all' || platform !== 'any' || query !== '';

  // Clear filters goes with the empty state it sits in, so focus goes to the search field.
  const clear = () => {
    setFilter('all');
    onPlatform('any');
    setQuery('');
    requestAnimationFrame(() => root.current?.querySelector<HTMLElement>(`.${r.search} input`)?.focus());
  };

  return (
    <div ref={root} className={r.page}>
      {selected.length > 0 ? (
        <div className={r.bar}>
          <span className={r.selected}>{selected.length} selected</span>
          <span className={r.end}>
            <Button size="sm">
              <Pause size={16} aria-hidden /> Pause rollout
            </Button>
            <Button size="sm">
              <Download size={16} aria-hidden /> Export
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon
              label="Clear selection"
              onClick={() => {
                setSelected([]);
                setCleared(true);
              }}
            >
              <X size={16} aria-hidden />
            </Button>
          </span>
        </div>
      ) : (
        <div className={r.bar}>
          <SegmentedControl
            label="Show"
            value={filter}
            onValueChange={(v) => {
              setFilter(v as keyof typeof filters);
              setPage(0);
            }}
            segments={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'live', label: 'Live' },
              { value: 'halted', label: 'Halted' },
            ]}
          />
          <span className={r.end}>
            <Select
              label="Platform"
              className={r.bare}
              value={platform}
              onValueChange={(v) => onPlatform((v ?? 'any') as Platform)}
              options={[
                { value: 'any', label: 'Any platform' },
                { value: 'iOS', label: 'iOS' },
                { value: 'Android', label: 'Android' },
                { value: 'Web', label: 'Web' },
              ]}
            />
            <TextField
              label="Search"
              className={`${r.bare} ${r.search}`}
              placeholder="Search"
              leading={<Search size={16} aria-hidden />}
              value={query}
              onValueChange={setQuery}
            />
          </span>
        </div>
      )}
      {shown.length ? (
        <>
          <div ref={table}>
            <Table
              label="Releases"
              className={r.flush}
              columns={columns}
              rows={rows}
              // The key names the row's checkbox ("Select 4.2.0 iOS"), so it is the name people read, not the id.
              rowKey={releaseName}
              selected={selected}
              onSelectedChange={setSelected}
              sort={sort}
              onSortChange={setSort}
            />
          </div>
          <div className={r.foot}>
            <span>{`${at * PAGE + 1}–${at * PAGE + rows.length} of ${shown.length}`}</span>
            <span className={r.end}>
              <Button size="sm" disabled={at === 0} onClick={() => setPage(at - 1)}>
                Previous
              </Button>
              <Button size="sm" disabled={at >= pages - 1} onClick={() => setPage(at + 1)}>
                Next
              </Button>
            </span>
          </div>
        </>
      ) : (
        <div className={r.empty}>
          <p>{query ? `No releases match “${query}”` : 'No releases match these filters'}</p>
          {narrowed && (
            <Button size="sm" onClick={clear}>
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
