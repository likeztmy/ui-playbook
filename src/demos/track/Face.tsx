import { PEOPLE } from './people';
import s from './Face.module.scss';

/** Whose an issue is, as a face; no one yet is an empty dashed ring in the same place. */
export function Face({ id, size = 'row' }: { id?: string; /** In a row, or smaller, beside a menu row's text. */ size?: 'row' | 'sm' | 'lg' }) {
  const p = id ? PEOPLE[id] : undefined;
  if (!p) return <span className={s.none} data-size={size} data-face="none" aria-hidden />;
  // Open Peeps by Pablo Stanley (CC0), drawn with DiceBear, one look picked per person.
  return <img className={s.face} data-size={size} src={`/track/${p.id}.svg`} alt="" width={20} height={20} decoding="async" />;
}
