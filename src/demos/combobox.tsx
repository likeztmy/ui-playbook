import { useState } from 'react';
import { Combobox, type ComboGroup, type ComboItem } from '../ui/Combobox';
import { Compare, Frame, Gallery } from './shell';
import s from './demos.module.scss';

const PLACES: [string, string, string][] = [
  ['Auckland', 'New Zealand', 'Oceania'],
  ['Sydney', 'Australia', 'Oceania'],
  ['Tokyo', 'Japan', 'Asia'],
  ['Seoul', 'South Korea', 'Asia'],
  ['Shanghai', 'China', 'Asia'],
  ['Singapore', 'Singapore', 'Asia'],
  ['Bangkok', 'Thailand', 'Asia'],
  ['Mumbai', 'India', 'Asia'],
  ['Dubai', 'United Arab Emirates', 'Asia'],
  ['Istanbul', 'Türkiye', 'Europe'],
  ['Kraków', 'Poland', 'Europe'],
  ['Zürich', 'Switzerland', 'Europe'],
  ['Malmö', 'Sweden', 'Europe'],
  ['Berlin', 'Germany', 'Europe'],
  ['Paris', 'France', 'Europe'],
  ['London', 'United Kingdom', 'Europe'],
  ['Reykjavík', 'Iceland', 'Europe'],
  ['Lisbon', 'Portugal', 'Europe'],
  ['Lagos', 'Nigeria', 'Africa'],
  ['Nairobi', 'Kenya', 'Africa'],
  ['Cape Town', 'South Africa', 'Africa'],
  ['São Paulo', 'Brazil', 'Americas'],
  ['Bogotá', 'Colombia', 'Americas'],
  ['Mexico City', 'Mexico', 'Americas'],
  ['New York', 'United States', 'Americas'],
  ['Montréal', 'Canada', 'Americas'],
  ['San Francisco', 'United States', 'Americas'],
];

const CITIES: ComboItem[] = PLACES.map(([label, meta]) => ({ value: label, label, meta }));
const byName = (name: string) => CITIES.find((c) => c.label === name) ?? null;

const BY_REGION: ComboGroup[] = ['Americas', 'Europe', 'Africa', 'Asia', 'Oceania'].map((region) => ({
  value: region,
  items: PLACES.filter((p) => p[2] === region).map(([label, meta]) => ({ value: label, label, meta })),
}));

const PEOPLE: ComboItem[] = [
  ['Ana Ruiz', 'Design'],
  ['Kenji Mori', 'Engineering'],
  ['Lea Novak', 'Data'],
  ['Sam Okafor', 'Research'],
  ['Zoë Laurent', 'Design'],
  ['Mateo Álvarez', 'Engineering'],
  ['Priya Raman', 'Product'],
].map(([label, meta]) => ({ value: label, label, meta }));

const cityEmpty = (q: string) => (
  <>
    No city matches “{q}”. Try the country instead.
  </>
);

function TimeZone() {
  const [city, setCity] = useState<ComboItem | null>(byName('Lisbon'));
  return (
    <div className={s.comboDemo}>
      <Combobox
        label="Time zone"
        items={CITIES}
        value={city}
        onValueChange={setCity}
        placeholder="Search cities or countries"
        empty={cityEmpty}
        className={s.fieldWide}
      />
      <span className={s.comboNote}>{city ? `Meetings shown in ${city.label} time` : 'Pick a city'}</span>
    </div>
  );
}

export function ComboboxLive() {
  return (
    <Frame label="Live · type “sao”, “zur” or a country, then Enter" height={400}>
      <div className={s.top}>
        <TimeZone />
      </div>
    </Frame>
  );
}

export function ComboboxVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Single',
          use: 'One value from a list too long to scan: cities, countries, people.',
          render: () => <TimeZone />,
        },
        {
          name: 'Grouped',
          use: 'When the list has a natural order of its own. Groups hide as their matches run out.',
          render: () => (
            <Combobox label="Office" items={BY_REGION} defaultValue={byName('Berlin')} placeholder="Search offices" empty={cityEmpty} className={s.fieldWide} />
          ),
        },
        {
          name: 'Multiple',
          use: 'Several values as chips in the field. Backspace removes the last one.',
          render: () => (
            <Combobox
              multiple
              label="Assignees"
              items={PEOPLE}
              defaultValue={[PEOPLE[0], PEOPLE[2]]}
              placeholder="Add people"
              empty={(q) => <>No one called “{q}” in this workspace.</>}
              className={s.fieldWide}
            />
          ),
        },
      ]}
    />
  );
}

// ── Comparisons ──────────────────────────────────────────

const LIST_HEIGHT = 380;

export function ComboboxForgiving() {
  return (
    <Compare
      height={LIST_HEIGHT}
      before={<Combobox label="Time zone" items={CITIES} placeholder="Search cities" strict empty={cityEmpty} />}
      after={<Combobox label="Time zone" items={CITIES} placeholder="Search cities or countries" empty={cityEmpty} />}
      beforeNote="Type “sao” or “zurich”: nothing. The match is exact, so it fails on the case and accents most people don’t type, and only the city is searched."
      afterNote="Case and accents are ignored, so “sao” finds São Paulo and “zurich” Zürich; the country is searched too, so “japan” finds Tokyo."
    />
  );
}

export function ComboboxEnter() {
  return (
    <Compare
      height={LIST_HEIGHT}
      before={<Combobox label="Time zone" items={CITIES} placeholder="Search cities" autoHighlight={false} empty={cityEmpty} />}
      after={<Combobox label="Time zone" items={CITIES} placeholder="Search cities" empty={cityEmpty} />}
      beforeNote="Type “tok” and press Enter: nothing happens. The one match isn’t highlighted, so you reach for the arrow keys or the mouse."
      afterNote="The first match is highlighted as you type: “tok”, Enter, done. The arrow keys still move to any other row."
    />
  );
}

export function ComboboxMatch() {
  return (
    <Compare
      height={LIST_HEIGHT}
      before={<Combobox label="Time zone" items={CITIES} placeholder="Search cities" showMatch={false} empty={cityEmpty} />}
      after={<Combobox label="Time zone" items={CITIES} placeholder="Search cities" empty={cityEmpty} />}
      beforeNote="Type “an”: Bangkok, Istanbul, Cape Town, Montréal, San Francisco… Why is each one here? You read every row to find out."
      afterNote="The letters that matched are a step bolder, in the city or its country. The eye finds the reason in each row without reading it."
    />
  );
}

export function ComboboxEmpty() {
  return (
    <Compare
      height={240}
      before={<Combobox label="Time zone" items={CITIES} placeholder="Search cities" empty={() => 'No results'} />}
      after={<Combobox label="Time zone" items={CITIES} placeholder="Search cities" empty={cityEmpty} />}
      beforeNote="Type “Atlantis”. “No results”: of what, for what? Did it search at all, and is there something else to try?"
      afterNote="It repeats what you typed and names the next step: “No city matches “Atlantis”. Try the country instead.”"
    />
  );
}

export function ComboboxPreview() {
  return <Combobox label="Time zone" items={CITIES} defaultValue={byName('Lisbon')} className={s.fieldWide} />;
}
