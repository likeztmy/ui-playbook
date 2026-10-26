import type { ReactNode } from 'react';
import { Avatar } from '../post/Avatar';
import type { Row } from './data';
import s from './faces.module.scss';

type Props = {
  row: Row;
  /** What sits in the first column: a face, nothing (the text keeps the edge), or something else. */
  lead?: 'face' | 'none' | ReactNode;
  chroma?: number;
  /** A checkbox in a column of its own, before the lead. */
  check?: ReactNode;
  onClick?: () => void;
};

/** One of Post's rows, cut down to who, what and when, in one line. */
export function FaceRow({ row, lead = 'face', chroma, check, onClick }: Props) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={s.row}
      data-lead={lead === 'none' ? 'none' : undefined}
      data-check={check ? '' : undefined}
      data-unread={row.unread ? '' : undefined}
      onClick={onClick}
    >
      <span className={s.dot} aria-hidden />
      {check && <span className={s.check}>{check}</span>}
      {lead !== 'none' && <span className={s.lead}>{lead === 'face' ? <Avatar id={row.face} size="sm" chroma={chroma} /> : lead}</span>}
      <span className={s.from}>{row.from}</span>
      <span className={s.subject}>{row.subject}</span>
      <span className={s.time}>{row.time}</span>
    </Tag>
  );
}
