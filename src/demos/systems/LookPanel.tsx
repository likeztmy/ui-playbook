import type { CSSProperties } from 'react';
import { valuesOf, type Look } from '../../looks';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { TextField } from '../../ui/Field';
import s from './systems.module.scss';

// Both themes ride on the panel as --l-* and --d-*; the stylesheet picks one by the page's theme.
const vars = (look: Look) =>
  Object.fromEntries(
    valuesOf(look).flatMap(([n, v]) => [
      [`--l-${n}`, v.light],
      [`--d-${n}`, v.dark],
    ]),
  ) as CSSProperties;

/** A look's own field, badge and button, in its values. Without a look, the page's own (its palette too). */
export function LookPanel({ look, field = true }: { look?: Look; field?: boolean }) {
  return (
    <div className={look ? s.look : s.ours} style={look && vars(look)}>
      {field && <TextField label="Project" defaultValue="Q4 roadmap" />}
      <div className={s.lookRow}>
        <Badge tone="info" status>
          In review
        </Badge>
        <Button variant="primary">Publish</Button>
      </div>
    </div>
  );
}
