import { ISSUES } from './issues';
import type { Issue } from './model';

// Track keeps its issues in this browser, so a visit picks up where the last left off. Reset brings
// the sample back. A stored shape from an older build is dropped rather than read wrong.
const KEY = 'track:issues:v2';

export function load(): Issue[] {
  try {
    localStorage.removeItem('track:issues:v1');
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Issue[];
  } catch {}
  return ISSUES;
}

export function save(issues: Issue[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(issues));
  } catch {}
}

export function clear() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
