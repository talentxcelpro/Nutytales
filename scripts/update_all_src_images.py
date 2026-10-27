import os
import json
import re

manifest = json.load(open('public/images/transparency-manifest.json', 'r', encoding='utf-8'))
converted_map = {}
for item in manifest['items']:
    if 'webp' in item:
        src_rel = '/' + item['source'].replace('\\', '/').replace('public/', '')
        converted_map[src_rel] = item['webp']

updated_files = []

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.json', '.js', '.jsx')):
            fp = os.path.join(root, file)
            with open(fp, 'r', encoding='utf-8') as f:
                content = f.read()
            new_content = content
            rep_count = 0
            for old_p, new_p in converted_map.items():
                if old_p in new_content:
                    # replace 'path' or "path"
                    new_content = new_content.replace(f"'{old_p}'", f"'{new_p}'")
                    new_content = new_content.replace(f'"{old_p}"', f'"{new_p}"')
                    rep_count += 1
            if new_content != content:
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                updated_files.append((fp, rep_count))

print(f"Scanned entire src/ directory. Updated {len(updated_files)} files:")
for fp, count in updated_files:
    print(f"  {fp} ({count} replacements)")
