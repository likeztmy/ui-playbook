import { Circle, CircleCheck, CircleDashed, CircleDot, CircleEllipsis, type LucideIcon } from 'lucide-react';
import type { Status } from './model';
import s from './icons.module.scss';

// Read by shape, so no colour is spent on it: a dashed ring while it isn't planned, an empty one
// while it waits, a dot once it's under way, an ellipsis while it waits on review, a tick when done.
const ICON: Record<Status, LucideIcon> = {
  backlog: CircleDashed,
  todo: Circle,
  progress: CircleDot,
  review: CircleEllipsis,
  done: CircleCheck,
};

export function StatusIcon({ status }: { status: Status }) {
  const Icon = ICON[status];
  return <Icon className={s.status} data-status={status} size={14} strokeWidth={1.5} nonScalingStroke aria-hidden />;
}
