import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { MoonIcon, SunIcon } from '../ui/icons';
import { Tip } from '../ui/Tooltip';

type Theme = 'light' | 'dark';

function current(): Theme {
  const pinned = document.documentElement.dataset.theme;
  if (pinned === 'light' || pinned === 'dark') return pinned;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

type Props = {
  /** Classes that show one icon per theme in CSS, so the first paint is right before hydration. */
  sunClass: string;
  moonClass: string;
  lang?: 'en' | 'zh';
};

/** Flips the page theme and remembers it. Shows the theme it switches to. */
export function ThemeToggle({ sunClass, moonClass, lang = 'en' }: Props) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(current());
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setTheme(current());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  const label =
    lang === 'zh'
      ? theme
        ? `切换到${next === 'dark' ? '深色' : '浅色'}模式`
        : '切换主题'
      : theme
        ? `Switch to ${next} theme`
        : 'Switch theme';

  return (
    <Tip label={label} side="bottom">
      <Button
        variant="ghost"
        icon
        aria-label={label}
        onClick={() => {
          const next: Theme = current() === 'dark' ? 'light' : 'dark';
          document.documentElement.dataset.theme = next;
          try {
            localStorage.setItem('theme', next);
          } catch {}
          setTheme(next);
        }}
      >
        <span className={sunClass}>
          <SunIcon />
        </span>
        <span className={moonClass}>
          <MoonIcon />
        </span>
      </Button>
    </Tip>
  );
}
