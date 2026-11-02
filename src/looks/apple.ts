// Apple's published system greys (iOS, default contrast) and its system font, from the HIG.
import type { Look, Source } from './look';

const colour: Source = { label: 'HIG, Color', href: 'https://developer.apple.com/design/human-interface-guidelines/color' };
const fonts: Source = { label: 'Apple Fonts', href: 'https://developer.apple.com/fonts/' };
const sans = '-apple-system, BlinkMacSystemFont, system-ui, sans-serif';

export const apple: Look = {
  id: 'apple',
  name: 'After Apple',
  font: {
    name: 'SF Pro, as the system font',
    licence:
      'Apple licenses SF Pro for mockups of Apple-platform interfaces, not for embedding on the web; the system stack shows it on Apple devices and each platform’s own font elsewhere.',
    from: fonts,
  },
  values: {
    bg: { light: '#f2f2f7', dark: '#1c1c1e', from: colour, note: 'systemGray6' },
    surface: { light: '#ffffff', dark: '#2c2c2e', from: colour, note: 'white; in dark, systemGray5' },
    'surface-raised': { light: '#ffffff', dark: '#3a3a3c', from: colour, note: 'white; in dark, systemGray4' },
    'surface-sunken': { light: '#e5e5ea', dark: '#1c1c1e', from: colour, note: 'systemGray5; in dark, systemGray6' },
    line: { light: '#d1d1d6', dark: '#48484a', from: colour, note: 'systemGray4; in dark, systemGray3' },
    'line-strong': { light: '#8e8e93', dark: '#8e8e93', from: colour, note: 'systemGray, 3.3:1 on white' },
    'font-sans': { light: sans, dark: sans, from: fonts, note: 'the system font, never SF Pro’s files' },
  },
};
