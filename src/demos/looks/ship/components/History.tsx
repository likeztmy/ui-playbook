import { Badge } from '../../../../ui/Badge';
import { Table } from '../../../../ui/Table';
import { releaseById, releaseName, tone, type Release } from '../model';
import { Section } from '../Section';

// One release in each state, from Ship's own data: info, warning, danger and success in one column.
const rows = ['r1', 'r2', 'r5', 'r3'].map(releaseById);

/** A small table with a status column: the table's own frame is the section's one edge. */
export function History() {
  return (
    <Section title="Releases">
      <Table<Release>
        label="Releases"
        rowKey={(r) => r.id}
        rows={rows}
        columns={[
          { key: 'release', header: 'Release', render: releaseName },
          {
            key: 'status',
            header: 'Status',
            render: (r) => (
              <Badge tone={tone(r.status)} status>
                {r.status}
              </Badge>
            ),
          },
        ]}
      />
    </Section>
  );
}
