import { Download, Pause, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../../ui/Badge';
import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/Field';
import { SegmentedControl } from '../../../ui/SegmentedControl';
import { Select } from '../../../ui/Select';
import { Table, type Column, type Sort } from '../../../ui/Table';
import { releases, tone, type Release } from './data';
import { Shell } from './Shell';
import s from './Page.module.scss';

const PAGE = 8;

export const columns: Column<Release>[] = [
  {
    key: 'version',
    header: 'Release',
    sortBy: (r) => r.version,
    render: (r) => (
      <span className={s.version}>
        <span>{r.version}</span>
        <span>{r.name}</span>
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortBy: (r) => r.status,
    render: (r) => (
      <Badge tone={tone(r.status)} status>
        {r.status}
      </Badge>
    ),
  },
  { key: 'platform', header: 'Platform', optional: true, render: (r) => r.platform, sortBy: (r) => r.platform },
  { key: 'owner', header: 'Owner', muted: true, optional: true, render: (r) => r.owner, sortBy: (r) => r.owner },
  { key: 'rollout', header: 'Rollout', numeric: true, optional: true, render: (r) => `${r.rollout}%`, sortBy: (r) => r.rollout },
  { key: 'updated', header: 'Updated', muted: true, render: (r) => r.updated, sortBy: (r) => -r.age },
];

const filters = {
  all: () => true,
  active: (r: Release) => r.status === 'Rolling out' || r.status === 'In review',
  live: (r: Release) => r.status === 'Live',
  halted: (r: Release) => r.status === 'Halted',
};

/** The list: filter, search, sort, select some and act on them, page through. */
export function Releases() {
  const [filter, setFilter] = useState<keyof typeof filters>('all');
  const [platform, setPlatform] = useState<string | null>('any');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>({ key: 'updated', dir: 'desc' });
  const [selected, setSelected] = useState<string[]>(['r1', 'r5']);
  const [page, setPage] = useState(0);

  const col = columns.find((c) => c.key === sort.key)!;
  const shown = releases
    .filter(filters[filter])
    .filter((r) => platform === 'any' || r.platform === platform)
    .filter((r) => `${r.version} ${r.name} ${r.owner}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const [x, y] = [col.sortBy!(a), col.sortBy!(b)];
      const d = x < y ? -1 : x > y ? 1 : 0;
      return sort.dir === 'asc' ? d : -d;
    });
  const pages = Math.max(1, Math.ceil(shown.length / PAGE));
  const at = Math.min(page, pages - 1);
  const rows = shown.slice(at * PAGE, at * PAGE + PAGE);

  return (
    <Shell section="releases" place="Releases">
      {selected.length > 0 ? (
        <div className={s.bar}>
          <span className={s.selected}>{selected.length} selected</span>
          <span className={s.end}>
            <Button size="sm">
              <Pause size={16} aria-hidden /> Pause rollout
            </Button>
            <Button size="sm">
              <Download size={16} aria-hidden /> Export
            </Button>
            <Button size="sm" variant="ghost" icon aria-label="Clear selection" onClick={() => setSelected([])}>
              <X size={16} aria-hidden />
            </Button>
          </span>
        </div>
      ) : (
        <div className={s.bar}>
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
          <span className={s.end}>
            <Select
              label="Platform"
              className={s.bare}
              value={platform}
              onValueChange={setPlatform}
              options={[
                { value: 'any', label: 'Any platform' },
                { value: 'iOS', label: 'iOS' },
                { value: 'Android', label: 'Android' },
                { value: 'Web', label: 'Web' },
              ]}
            />
            <TextField
              label="Search"
              className={s.bare}
              placeholder="Search"
              leading={<Search size={16} aria-hidden />}
              value={query}
              onValueChange={setQuery}
            />
          </span>
        </div>
      )}
      <Table
        label="Releases"
        className={s.flush}
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        selected={selected}
        onSelectedChange={setSelected}
        sort={sort}
        onSortChange={setSort}
      />
      <div className={s.footer}>
        <span>{shown.length ? `${at * PAGE + 1}–${at * PAGE + rows.length} of ${shown.length}` : 'No releases match'}</span>
        <span className={s.end}>
          <Button size="sm" disabled={at === 0} onClick={() => setPage(at - 1)}>
            Previous
          </Button>
          <Button size="sm" disabled={at >= pages - 1} onClick={() => setPage(at + 1)}>
            Next
          </Button>
        </span>
      </div>
    </Shell>
  );
}
