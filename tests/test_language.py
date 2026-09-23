import importlib.util
from pathlib import Path
import unittest

import markdown


spec = importlib.util.spec_from_file_location(
    'docs_language', Path(__file__).parents[1] / 'overrides/hooks/language.py'
)
language = importlib.util.module_from_spec(spec)
spec.loader.exec_module(language)


class LanguageContentTests(unittest.TestCase):
    def render(self, source):
        return markdown.markdown(language.on_page_markdown(source), extensions=[
            'md_in_html', 'tables', 'pymdownx.superfences', 'pymdownx.tabbed',
        ])

    def test_both_languages_preserve_tables_code_and_following_prose(self):
        rendered = self.render('''=== "TypeScript"
    | Field | Type |
    | --- | --- |
    | key | string |

    ```typescript
    const key = "a";
    ```

=== ".NET"
    ```csharp
    var key = "a";
    ```

## Following
Shared text.
''')
        self.assertIn('data-lang="ts"', rendered)
        self.assertIn('data-lang="net"', rendered)
        self.assertIn('<table>', rendered)
        self.assertIn('<h2>Following</h2>', rendered)
        self.assertNotIn('tabbed-set', rendered)
        self.assertEqual(rendered.count('<code>'), 2)

    def test_qualifiers_and_single_language_availability(self):
        rendered = self.render('===! "TypeScript (Express)"\n    Example.\n')
        self.assertIn('<strong>Express</strong>', rendered)
        self.assertIn('not available in the selected language', rendered)

    def test_markers_inside_code_and_non_language_tabs_are_untouched(self):
        source = '```text\n=== "TypeScript"\n    literal\n```\n\n=== "PostgreSQL"\n    database\n'
        self.assertEqual(language.on_page_markdown(source), source)

    def test_existing_wrappers_are_not_transformed_twice(self):
        source = '<div data-lang="ts" markdown="1">\n\nExample.\n\n</div>\n'
        self.assertEqual(language.on_page_markdown(source), source)


if __name__ == '__main__':
    unittest.main()
