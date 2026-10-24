"""Read-only document acceptance for topic-backlog Review 1.

Run from any directory, optionally passing an older Markdown file to show
regressions. These checks validate the document contract, not source truth.
"""
from collections import Counter
from pathlib import Path
import re
import sys
import unittest

ROOT = Path(__file__).resolve().parents[2]
PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'docs/research/2026-10-25-topic-backlog.md'
TEXT = PATH.read_text()
INTRO, BODY = TEXT.split('## Ranked backlog\n', 1)
BODY, TAIL = BODY.split('## Evidence limits', 1)
FIELDS = {'Kind', 'Working title', 'The mechanism', 'The Before', 'Demo idea',
          'Primary sources', 'Reference product', 'Scores (1–5)', 'Priority',
          'Coverage / boundary'}
REMOVED = {'undo': 'Undo instead of asking', 'copy': 'Words can invert a state',
           'disabled': 'A disabled action needs an explanation', 'errors': 'Errors need a next step',
           'password': 'Password field', 'upload': 'File upload', 'breadcrumb': 'Breadcrumbs',
           'pagination': 'Pagination', 'empty': 'Empty state', 'accordion': 'Accordion',
           'mobile': 'Compare in one viewport'}


def entries():
    result = []
    for title, chunk in re.findall(r'^### ([^\n]+)\n(.*?)(?=^### |\Z)', BODY, re.M | re.S):
        meta = re.search(r'^Rank: (\d+) · ID: ([a-z]+)$', chunk, re.M)
        fields = dict(re.findall(r'^- \*\*([^\n]+?):\*\* (.+)$', chunk, re.M))
        score = re.fullmatch(r'depth ([1-5]); felt ([1-5]); coverage ([1-5]); effort ([1-5]) \(inverse cost\)', fields['Scores (1–5)'])
        result.append({'id': meta[2], 'rank': int(meta[1]), 'title': title,
                       'chunk': chunk, 'fields': fields, 'scores': tuple(map(int, score.groups()))})
    return result


ROWS = entries()
BY_ID = {e['id']: e for e in ROWS}


class BacklogReviewTests(unittest.TestCase):
    def includes(self, text, *terms):
        for term in terms:
            self.assertIn(term, text)

    def test_required_fields_and_provenance(self):
        for row in ROWS:
            fields = row['fields']
            self.assertTrue(FIELDS <= fields.keys())
            self.assertTrue(all(fields[k].strip() for k in FIELDS))
            self.assertEqual(fields['Working title'], row['title'])
            self.assertIn(fields['Kind'], {'component', 'principle', 'site'})
            self.assertRegex(fields['The Before'], r'no named product|^UI Playbook：')
            self.assertRegex(fields['Demo idea'], r'New reusable tool: (yes|no)')

    def test_unique_ids_and_continuous_ranks(self):
        self.assertEqual([e['rank'] for e in ROWS], list(range(1, len(ROWS)+1)))
        self.assertEqual(len(BY_ID), len(ROWS))
        self.assertEqual(len({e['title'] for e in ROWS}), len(ROWS))

    def test_revision_counts(self):
        self.assertEqual(len(ROWS), 37)
        self.assertEqual(Counter(e['fields']['Kind'] for e in ROWS),
                         {'component': 10, 'principle': 20, 'site': 7})

    def test_priority_formula_and_tool_bonus(self):
        for row in ROWS:
            d, f, _, _ = row['scores']
            bonus = 2 if 'New reusable tool: yes' in row['fields']['Demo idea'] else 0
            self.assertEqual(row['fields']['Priority'],
                             f'{3*d+3*f+bonus} = 3×{d} + 3×{f} + {bonus} (tool bonus)')

    def test_ranking_and_coverage_references(self):
        def order(row):
            d, f, c, effort = row['scores']
            bonus = 2 if 'New reusable tool: yes' in row['fields']['Demo idea'] else 0
            return -(3*d+3*f+bonus), -c, -effort, row['title']
        self.assertEqual([e['id'] for e in ROWS], [e['id'] for e in sorted(ROWS, key=order)])
        for n, title in re.findall(r'#(\d+) ([^|;\n]+)', INTRO):
            self.assertEqual(ROWS[int(n)-1]['title'], title.strip())

    def test_tagged_sources(self):
        verified = 0
        for row in ROWS:
            sources = row['fields']['Primary sources']
            tags = re.findall(r'\[[^\]]+\]\(https?://[^)]+\) — \*\*(verified|secondary only)\*\*', sources)
            self.assertTrue(tags, row['id'])
            self.assertEqual(len(re.findall(r'\]\(https?://', sources)), len(tags))
            verified += 'verified' in tags
        self.assertGreaterEqual(verified, 20)

    def test_deep_briefs_follow_top_ten(self):
        for row in ROWS:
            self.assertEqual('**Top-10 page-plan brief.**' in row['chunk'], row['rank'] <= 10)
            if row['rank'] <= 10:
                for field in ['Before / After', 'Felt demo', 'Acceptance and limits']:
                    self.assertIn(field, row['fields'])

    def test_removed_entries_and_register(self):
        self.assertFalse(REMOVED.keys() & BY_ID.keys())
        self.assertEqual(INTRO.count('### Already covered or common knowledge\n'), 1)
        register = INTRO.split('### Already covered or common knowledge\n', 1)[1].split('## Coverage', 1)[0]
        for title in REMOVED.values():
            self.assertIn('- '+title+' ', register)
        self.assertIn('toast.mdx:15', register)
        self.assertFalse({'Skeleton', 'Progress', 'How waiting feels'} & {e['title'] for e in ROWS})

    def test_merges_keep_boundaries(self):
        self.includes(BY_ID['filters']['chunk'], 'combobox.mdx:27', '两侧均有', '并没有推荐 clear filters')
        self.includes(BY_ID['comparison']['chunk'], 'Accordion', 'Compare in one viewport',
                      'reference strip', 'New reusable tool: yes')

    def test_keyboard_felt_and_pointer_focus(self):
        for key in ['press', 'status', 'role', 'tree', 'split']:
            self.assertEqual(BY_ID[key]['scores'][1], 2, key)
        self.includes(BY_ID['focus']['fields']['Demo idea'], '先选中一行', '点击搜索框', 'caret', 'selection')

    def test_raycast_and_linear_scope(self):
        command = BY_ID['command']['chunk']
        self.includes(command, '↵', '⌘K', '右侧', '2019-12-19', 'menu.mdx:40', 'focus 或 view', '只改变 Open / ↵')
        self.assertNotIn('只切换动作是否按当前对象分组', command)

    def test_edge_target_replaces_settings_row(self):
        target = BY_ID['target']['chunk']
        self.includes(target, '无限', '减速', 'edge-target simulator', '物理屏幕', '触屏')
        self.assertNotIn('设置行', target)

    def test_timed_glyph_flash_and_measured_finding(self):
        self.includes(BY_ID['type']['chunk'], 'timed glyph flash', 'New reusable tool: yes',
                      '48%', '39%', '56%', '49%', '36 pt', 'F=29.3', 'p=.0001', '没有更好认', 'reading-speed')

    def test_api_claims_match_contract(self):
        self.assertIn('只变 snapOnStep', BY_ID['number']['chunk'])
        self.assertNotIn('只变是否按该 locale 解释输入', BY_ID['number']['chunk'])
        self.includes(BY_ID['otp']['chunk'], 'input-paste', 'onValueComplete', 'normalizeValue')
        self.assertNotIn('只变 paste 是否分发', BY_ID['otp']['chunk'])

    def test_modes_and_density_match_sources(self):
        self.includes(BY_ID['mode']['chunk'], 'Photoshop', 'Reply All', '至少两个视觉指标', 'cursor shape')
        self.assertNotIn('指针旁', BY_ID['mode']['fields']['Demo idea'])
        self.assertIn('视觉强调程度', BY_ID['density']['fields']['Demo idea'])
        self.assertNotIn('只改变分隔线', BY_ID['density']['fields']['Demo idea'])

    def test_defaults_controlled_finding(self):
        self.assertEqual(BY_ID['defaults']['scores'][1], 3)
        self.includes(BY_ID['defaults']['fields']['The mechanism'], '控制', '+16.3%', 'p<0.02')
        self.assertNotIn('不能把跨国相关性全当', BY_ID['defaults']['chunk'])

    def test_carousel_historical_exposure(self):
        self.includes(BY_ID['carousel']['fields']['The mechanism'], '2013', 'Siemens', '20%', '5 s')
        self.assertIn('no named product', BY_ID['carousel']['fields']['The Before'])
        self.assertIn('Current-product checks requested in Review 1', TAIL)

    def test_motion_distinct_sources(self):
        interrupt = BY_ID['interrupt']['fields']['Primary sources']
        origin = BY_ID['origin']['fields']['Primary sources']
        urls = lambda text: set(re.findall(r'\]\((https?://[^)]+)\)', text))
        self.assertFalse(urls(interrupt) & urls(origin))
        self.includes(origin, 'm2.material.io', 'archived')

    def test_colour_primary_source_and_access_limits(self):
        self.assertRegex(BY_ID['colour']['fields']['Primary sources'],
                         r'\]\(http://persci.mit.edu/gallery/checkershadow\) — \*\*verified\*\*')
        self.includes(TAIL, 'curl --insecure', '证书过期')

    def test_self_check_linked_not_embedded(self):
        self.assertNotIn('```python', TEXT)
        self.assertIn('](../../shots/topic-backlog/validate_backlog.py)', TEXT)


if __name__ == '__main__':
    print(f'Checking {PATH}', flush=True)
    unittest.main(argv=[sys.argv[0]], verbosity=2)
