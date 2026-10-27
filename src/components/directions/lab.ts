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

for (const chip of document.querySelectorAll<HTMLButtonElement>('[data-dial]')) {
  const section = chip.closest<HTMLElement>('section')!;
  const canvas = section.querySelector<HTMLElement>('[data-canvas]')!;
  const value = chip.querySelector('code')!;
  chip.addEventListener('click', () => {
    switch (chip.dataset.dial) {
      case 'palette': {
        const id = next(PALETTES, section.dataset.palette ?? 'blue');
        if (id === 'blue') delete section.dataset.palette;
        else section.dataset.palette = id;
        value.textContent = title(id);
        break;
      }
      case 'theme': {
        canvas.dataset.theme = canvas.dataset.theme === 'dark' ? 'light' : 'dark';
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

const lab = document.querySelector<HTMLElement>('[data-faces]')!;
for (const button of lab.querySelectorAll<HTMLButtonElement>('[data-face]')) {
  button.addEventListener('click', () => {
    lab.dataset.faces = button.dataset.face;
    for (const b of lab.querySelectorAll('[data-face]')) b.setAttribute('aria-pressed', String(b === button));
  });
}
