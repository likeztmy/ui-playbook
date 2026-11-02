import { Badge, type Tone } from '../../../ui/Badge';
import { Table } from '../../../ui/Table';
import s from './Wall.module.scss';

type Row = { version: string; state: string; tone: Tone };
const rows: Row[] = [
  { version: '4.2.0', state: 'Rolling out', tone: 'info' },
  { version: '4.1.3', state: 'In review', tone: 'warning' },
  { version: '4.1.2', state: 'Failed', tone: 'danger' },
  { version: '4.1.1', state: 'Live', tone: 'success' },
];

/** The table, with status badges. */
export function History() {
  return (
    <section className={s.card} aria-label="Releases">
      <div className={s.head}>
        <h3>Releases</h3>
      </div>
      <Table
        label="Releases"
        rowKey={(r) => r.version}
        rows={rows}
        columns={[
          { key: 'version', header: 'Version', render: (r) => r.version },
          {
            key: 'state',
            header: 'Status',
            render: (r) => (
              <Badge tone={r.tone} status>
                {r.state}
              </Badge>
            ),
          },
        ]}
      />
    </section>
  );
}
