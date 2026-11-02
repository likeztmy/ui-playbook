import { Check, Copy } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../../ui/Button';
import { Select } from '../../../ui/Select';
import { addressOf, params, usePageTheme, usePopState, write } from '../address';
import { factsOf, lookOptions, type LabLook } from '../looks';
import { follow } from '../ship/Shell';
import type { Platform } from '../ship/model';
import { Figure } from './Figure';
import s from './Specimens.module.scss';

/**
 * Direction B: a look is a page to read. The looks are a list of links beside it; Ship's screens are
 * figures at true size, each captioned with the rules it shows. The page scrolls as one, as a document
 * does; the figures follow the page's own theme.
 */
export function Specimens({ looks, path }: { looks: LabLook[]; path: string }) {
  const [id, setId] = useState(looks[0].id);
  // One Ship across the figures: a platform picked in one is the Releases figure's filter.
  const [platform, setPlatform] = useState<Platform>('any');
  const [copied, setCopied] = useState(false);
  const theme = usePageTheme();
  const look = looks.find((l) => l.id === id) ?? looks[0];

  const read = useCallback(
    (q: URLSearchParams) => {
      const asked = q.get('look');
      setId(asked && looks.some((l) => l.id === asked) ? asked : looks[0].id);
    },
    [looks],
  );
  useEffect(() => read(params()), [read]);
  usePopState(read);

  const at = (lookId: string) => addressOf(path, { look: lookId === looks[0].id ? null : lookId });
  const open = (next: string) => {
    setId(next);
    setCopied(false);
    write(at(next), true);
  };
  const copy = async () => {
    await navigator.clipboard.writeText(look.root);
    setCopied(true);
  };

  return (
    <div className={s.sheet}>
      <nav className={s.rail} aria-label="Looks">
        <ul>
          {looks.map((l) => (
            <li key={l.id}>
              <a href={at(l.id)} aria-current={l.id === look.id ? 'page' : undefined} onClick={(e) => follow(e, () => open(l.id))}>
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <article className={s.doc}>
        <header className={s.head}>
          {/* Narrow: the list of looks folds into a Select above the title. */}
          <Select label="Look" className={s.picker} value={id} onValueChange={(v) => v && open(v)} options={lookOptions(looks)} />
          <h1>{look.name}</h1>
          <p className={s.facts}>{factsOf(look).join(' · ')}</p>
          <div className={s.actions}>
            <Button size="sm" onClick={copy}>
              {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              {copied ? 'Copied' : 'Copy :root'}
            </Button>
            <a href={look.href}>Values and sources</a>
          </div>
        </header>
        <Figure
          id="dashboard"
          title="Dashboard"
          look={look}
          theme={theme}
          platform={platform}
          onPlatform={setPlatform}
          caption={
            <>
              Four figures read together share one row, a line between them; the charts below are held by their headings and space, with no box on the
              page (<a href="/principles/the-lightest-boundary-that-holds">The lightest boundary that holds</a>). The accent fills one button, New
              release (<a href="/principles/colour-means-one-thing">Colour means one thing</a>).
            </>
          }
        />
        <Figure
          id="releases"
          title="Releases"
          look={look}
          theme={theme}
          platform={platform}
          onPlatform={setPlatform}
          caption={
            <>
              The pane is the table’s frame: lines between rows, numbers on the right, owners and dates muted, one arrow on the sorted column (
              <a href="/components/table">Table</a>). Each status is a word with a dot, in a soft tint (<a href="/components/badge">Badge</a>).
            </>
          }
        />
      </article>
    </div>
  );
}
