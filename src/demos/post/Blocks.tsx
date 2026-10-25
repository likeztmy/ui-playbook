import type { Block, Inline } from './model';
import s from './Blocks.module.scss';

export { s as blocksClasses };

function Text({ runs }: { runs: Inline[] }) {
  return (
    <>
      {runs.map((r, i) => {
        if (typeof r === 'string') return r;
        if (r.href)
          return (
            <a key={i} href={r.href} onClick={(e) => e.preventDefault()}>
              {r.text}
            </a>
          );
        if (r.code) return <code key={i}>{r.text}</code>;
        if (r.italic && r.bold)
          return (
            <strong key={i}>
              <em>{r.text}</em>
            </strong>
          );
        if (r.italic) return <em key={i}>{r.text}</em>;
        return <strong key={i}>{r.text}</strong>;
      })}
    </>
  );
}

function One({ b }: { b: Block }) {
  switch (b.kind) {
    case 'p':
      return (
        <p>
          <Text runs={b.text} />
        </p>
      );
    case 'h':
      return <h4 className={s.heading}>{b.text}</h4>;
    case 'ul':
    case 'ol': {
      const List = b.kind;
      return (
        <List>
          {b.items.map((item, i) => (
            <li key={i}>
              <Text runs={item} />
            </li>
          ))}
        </List>
      );
    }
    case 'quote':
      return (
        <blockquote>
          <Text runs={b.text} />
        </blockquote>
      );
    case 'code':
      return (
        <pre>
          <code>{b.text}</code>
        </pre>
      );
    case 'image':
      // Holds its box before anything loads, so the text below never moves; the tint shows until the picture arrives.
      return (
        <figure className={s.figure}>
          <div
            className={s.image}
            role={b.src ? undefined : 'img'}
            aria-label={b.src ? undefined : b.alt}
            style={{
              aspectRatio: b.ratio,
              backgroundImage: `linear-gradient(160deg, ${b.tint})`,
            }}
          >
            {b.src && <img src={b.src} alt={b.alt} loading="lazy" decoding="async" />}
          </div>
          <figcaption>
            {b.alt}
            {b.credit && <span className={s.credit}>{b.credit}</span>}
          </figcaption>
        </figure>
      );
    case 'table': {
      const right = b.head.map((_, j) => quantity(b.rows.map((r) => r[j])));
      // Scrolls inside its own box, never widening the message.
      return (
        <div className={s.table} tabIndex={0} role="region" aria-label="Table">
          <table>
            <thead>
              <tr>
                {b.head.map((c, i) => (
                  <th key={i} data-num={right[i] ? '' : undefined}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((c, j) => (
                    <td key={j} data-num={right[j] ? '' : undefined}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'rule':
      return <hr />;
    case 'signature':
      return (
        <p className={s.signature}>
          {b.lines.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </p>
      );
  }
}

/** A message's body, set for reading. */
/** A column of quantities (amounts, counts, changes), right-aligned so their digits line up. Dates and times aren't quantities. */
const quantity = (cells: string[]) => cells.some(Boolean) && cells.every((c) => !c || /^[+\-−$€£]?[\d.,]+%?$/.test(c));

export function Blocks({ blocks, className }: { blocks: Block[]; className?: string }) {
  return (
    <div className={[s.prose, className].filter(Boolean).join(' ')}>
      {blocks.map((b, i) => (
        <One key={i} b={b} />
      ))}
    </div>
  );
}
