"""Render existing language tabs with the shared documentation selector."""

import re


TAB = re.compile(r'^===!? "(TypeScript|\.NET)([^\"]*)"\s*$')
FENCE = re.compile(r'^(`{3,}|~{3,})')


def on_page_markdown(markdown, **kwargs):
    lines = markdown.splitlines()
    output = []
    index = 0
    fence = None
    while index < len(lines):
        line = lines[index]
        marker = FENCE.match(line)
        if marker:
            token = marker[1]
            if fence is None:
                fence = token
            elif token[0] == fence[0] and len(token) >= len(fence):
                fence = None
        match = TAB.match(line) if fence is None else None
        if not match:
            output.append(line)
            index += 1
            continue

        variants = []
        while index < len(lines) and (match := TAB.match(lines[index])):
            language = 'ts' if match[1] == 'TypeScript' else 'net'
            qualifier = match[2].strip(' /()')
            index += 1
            body = []
            while index < len(lines):
                current = lines[index]
                if current and not current.startswith('    '):
                    break
                body.append(current[4:] if current.startswith('    ') else '')
                index += 1
            # Preserve labels such as Express, ASP.NET Core, and JSON.
            if qualifier:
                body.insert(0, f'**{qualifier}**\n')
            variants.append((language, '\n'.join(body).strip()))
        present = {language for language, _ in variants}
        for missing in {'ts', 'net'} - present:
            variants.append((missing, 'This example is not available in the selected language.'))
        for language, body in variants:
            output.extend([
                '', f'<div class="language-content" data-lang="{language}" markdown="1">',
                '', body, '', '</div>', '',
            ])
    return '\n'.join(output) + '\n'
