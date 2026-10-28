import type { Activity, Issue } from './model';

// What a tracker knows about an issue beyond its row: its steps and what blocks it, the cycle and the
// date it's due, the pull requests that close it on GitHub, the build it ships in on Shipyard, and
// what the team said. Only the issues a team would have filled in have any of it.

type Detail = Pick<Issue, 'parent' | 'blockedBy' | 'cycle' | 'due' | 'estimate' | 'prs' | 'release'> & { history?: Activity[] };

const CYCLE = 'Cycle 14';

export const DETAILS: Record<number, Detail> = {
  48: {
    cycle: CYCLE,
    due: '2026-11-06',
    estimate: 8,
    blockedBy: [51],
    prs: [
      { repo: 'shop-ios', number: 482, title: 'Checkout: address, delivery and payment on one page', state: 'draft', checks: { passed: 7, total: 9 } },
      { repo: 'shop-web', number: 1290, title: 'One-page checkout behind a flag', state: 'open', checks: { passed: 14, total: 14 }, review: 'waiting' },
    ],
    history: [
      { who: 'github', text: 'linked shop-ios #482', at: '2026-10-27T15:10' },
      { who: 'ana', text: 'commented', at: '2026-10-27T16:02', body: 'Can the delivery section open on its own when the address is already saved? Most returning shoppers never touch it.' },
      { who: 'me', text: 'commented', at: '2026-10-27T16:20', body: 'Yes, it opens as a summary then. Waiting on SHOP-51 before the payment section goes in.' },
      { who: 'github', text: 'linked shop-web #1290', at: '2026-10-28T09:48' },
    ],
  },
  43: { parent: 48, cycle: CYCLE, estimate: 3, prs: [{ repo: 'shop-web', number: 1284, title: 'Delivery estimate on product and cart', state: 'open', checks: { passed: 14, total: 14 }, review: 'approved' }], history: [{ who: 'github', text: 'linked shop-web #1284', at: '2026-10-27T11:00' }, { who: 'tom', text: 'approved shop-web #1284', at: '2026-10-28T07:30' }] },
  40: { parent: 48, cycle: CYCLE, estimate: 2, prs: [{ repo: 'shop-ios', number: 476, title: 'Say what to try when a payment is declined', state: 'open', checks: { passed: 9, total: 9 }, review: 'waiting' }], history: [{ who: 'github', text: 'linked shop-ios #476', at: '2026-10-27T12:45' }] },
  64: { parent: 48, cycle: CYCLE, estimate: 1 },
  54: {
    parent: 48,
    cycle: CYCLE,
    estimate: 3,
    due: '2026-11-04',
    history: [{ who: 'tom', text: 'commented', at: '2026-10-27T17:45', body: 'Does this cover the app too? The iOS cart lives on the phone until checkout.' }],
  },
  51: {
    cycle: CYCLE,
    due: '2026-10-29',
    estimate: 3,
    prs: [{ repo: 'shop-ios', number: 479, title: 'Wait for the bank’s result after a 3-D Secure redirect', state: 'open', checks: { passed: 11, total: 12, failing: 'UI tests · iPhone SE' }, review: 'changes' }],
    history: [
      { who: 'kofi', text: 'commented', at: '2026-10-27T18:40', body: 'Reproduced with two banks. The redirect returns before the payment provider has a result, so we read it as failed.' },
      { who: 'github', text: 'linked shop-ios #479', at: '2026-10-28T08:20' },
      { who: 'tom', text: 'asked for changes on shop-ios #479', at: '2026-10-28T08:55' },
      { who: 'github', text: 'reported a failing check on shop-ios #479', at: '2026-10-28T09:05' },
    ],
  },
  41: { cycle: CYCLE, estimate: 2, prs: [{ repo: 'shop-web', number: 1281, title: 'Grey out sizes that are out of stock', state: 'open', checks: { passed: 14, total: 14 }, review: 'approved' }], release: { name: 'Web 2026.10.29', stage: 'QA', since: '2026-10-28T08:00' }, history: [{ who: 'shipyard', text: 'added it to Web 2026.10.29', at: '2026-10-28T08:00' }] },
  46: { cycle: CYCLE, estimate: 5, prs: [{ repo: 'shop-web', number: 1288, title: 'Search suggestions', state: 'draft', checks: { passed: 12, total: 14 } }] },
  38: { cycle: CYCLE, estimate: 3, prs: [{ repo: 'shop-ios', number: 461, title: 'Sign in with an email link', state: 'merged' }], release: { name: 'iOS 4.11', stage: 'Rollout', rollout: 20, since: '2026-10-27T14:00' }, history: [{ who: 'github', text: 'merged shop-ios #461 and moved it to Done', at: '2026-10-27T09:00' }, { who: 'shipyard', text: 'started rolling out iOS 4.11 to 20%', at: '2026-10-27T14:00' }] },
  36: { cycle: CYCLE, estimate: 2, prs: [{ repo: 'shop-ios', number: 455, title: 'Free delivery threshold', state: 'merged' }], release: { name: 'iOS 4.11', stage: 'Rollout', rollout: 20, since: '2026-10-27T14:00' }, history: [{ who: 'shipyard', text: 'started rolling out iOS 4.11 to 20%', at: '2026-10-27T14:00' }] },
  37: { estimate: 1, prs: [{ repo: 'shop-web', number: 1271, title: 'Count the cart badge from the cart', state: 'merged' }], release: { name: 'Web 2026.10.27', stage: 'Released', since: '2026-10-27T10:00' }, history: [{ who: 'shipyard', text: 'released Web 2026.10.27', at: '2026-10-27T10:00' }] },
  34: { estimate: 5, prs: [{ repo: 'shop-ios', number: 440, title: 'PayPal', state: 'merged' }, { repo: 'shop-web', number: 1250, title: 'PayPal', state: 'merged' }], release: { name: 'iOS 4.10', stage: 'Released', since: '2026-10-22T09:00' } },
};
