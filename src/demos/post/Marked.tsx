import s from './List.module.scss';

/** Marks every match of `q` in `text`, ignoring case. */
export function Marked({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'));
  return <>{parts.map((p, i) => (i % 2 ? <mark key={i} className={s.mark}>{p}</mark> : p))}</>;
}
