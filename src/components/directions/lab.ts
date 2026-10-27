// The directions lab: the face picker, and Workbench's dials, each a real setting of its canvas.

const PALETTES = ['blue', 'clay', 'petrol', 'moss', 'ink'];
const CORNERS: Record<string, Record<string, string>> = {
  Default: {},
  Sharp: { '--radius-xs': '2px', '--radius-sm': '3px', '--radius-md': '4px', '--radius-lg': '6px', '--radius-xl': '8px' },
  Round: { '--radius-xs': '6px', '--radius-sm': '9px', '--radius-md': '12px', '--radius-lg': '16px', '--radius-xl': '24px' },
};
const STILL = ['--duration-instant', '--duration-fast', '--duration-base', '--spring-snappy-duration', '--spring-smooth-duration', '--spring-gentle-duration'];

const next = <T>(list: T[], current: T) => list[(list.indexOf(current) + 1) % list.length];
const title = (id: string) => id[0].toUpperCase() + id.slice(1);

// Each canvas starts in the site's theme and follows it, until Workbench's dial sets its own.
const dark = matchMedia('(prefers-color-scheme: dark)');
const siteTheme = () => document.documentElement.dataset.theme ?? (dark.matches ? 'dark' : 'light');
const follow = () => {
  for (const canvas of document.querySelectorAll<HTMLElement>('[data-canvas]:not([data-own-theme])')) canvas.dataset.theme = siteTheme();
  for (const value of document.querySelectorAll('[data-dial=theme]:not([data-own-theme]) code')) value.textContent = title(siteTheme());
};
follow();
dark.addEventListener('change', follow);
new MutationObserver(follow).observe(document.documentElement, { attributeFilter: ['data-theme'] });

for (const chip of document.querySelectorAll<HTMLButtonElement>('[data-dial]')) {
  const section = chip.closest<HTMLElement>('section')!;
  const canvas = section.querySelector<HTMLElement>('[data-canvas]')!;
  const value = chip.querySelector('code')!;
  chip.addEventListener('click', () => {
    switch (chip.dataset.dial) {
      case 'palette': {
        const id = next(PALETTES, section.dataset.palette ?? 'blue');
        if (id === 'blue' || id === 'mono') delete section.dataset.palette;
        else section.dataset.palette = id;
        value.textContent = title(id);
        break;
      }
      case 'theme': {
        canvas.dataset.theme = canvas.dataset.theme === 'dark' ? 'light' : 'dark';
        canvas.dataset.ownTheme = chip.dataset.ownTheme = '';
        value.textContent = title(canvas.dataset.theme);
        break;
      }
      case 'corners': {
        const name = next(Object.keys(CORNERS), value.textContent!);
        for (const v of Object.keys(CORNERS.Round)) canvas.style.removeProperty(v);
        for (const [v, px] of Object.entries(CORNERS[name])) canvas.style.setProperty(v, px);
        value.textContent = name;
        break;
      }
      case 'motion': {
        const on = value.textContent === 'Off';
        for (const v of STILL) on ? canvas.style.removeProperty(v) : canvas.style.setProperty(v, '0ms');
        value.textContent = on ? 'On' : 'Off';
        break;
      }
    }
  });
}

// The title face and the note's hand: each picker sets one attribute on the lab.
const lab = document.querySelector<HTMLElement>('[data-faces]')!;
// [the button's data key, the lab's data key]
const pickers = [
  ['face', 'faces'],
  ['handPick', 'hand'],
] as const;
for (const [key, attr] of pickers) {
  const buttons = [...lab.querySelectorAll<HTMLButtonElement>('button')].filter((b) => b.dataset[key]);
  for (const button of buttons) {
    button.addEventListener('click', () => {
      lab.dataset[attr] = button.dataset[key];
      for (const b of buttons) b.setAttribute('aria-pressed', String(b === button));
    });
  }
}

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-scheme-pick]')) {
  button.addEventListener('click', () => {
    const section = button.closest<HTMLElement>('section')!;
    const id = button.dataset.schemePick!;
    section.dataset.scheme = id;
    if (id === 'blue' || id === 'mono') delete section.dataset.palette;
    else section.dataset.palette = id;
    for (const b of section.querySelectorAll('[data-scheme-pick]')) b.setAttribute('aria-pressed', String(b === button));
  });
}
