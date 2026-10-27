import os
import json
import re

manifest = json.load(open('public/images/transparency-manifest.json', 'r', encoding='utf-8'))
converted_map = {}
for item in manifest['items']:
    if 'webp' in item:
        # e.g. /images/almonds-pouch-250g.jpg -> /images/almonds-pouch-250g.webp
        src_rel = '/' + item['source'].replace('\\', '/').replace('public/', '')
        converted_map[src_rel] = item['webp']

print(f"Loaded {len(converted_map)} converted image mappings from manifest.")

def update_file(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    replacements = 0
    new_content = content
    for old_path, new_path in converted_map.items():
        if old_path in new_content:
            new_content = new_content.replace(f"'{old_path}'", f"'{new_path}'")
            new_content = new_content.replace(f'"{old_path}"', f'"{new_path}"')
            replacements += 1
            
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path} ({replacements} replacements)")
    else:
        print(f"No changes needed for {file_path}")

target_files = [
    'src/lib/products-data.ts',
    'src/lib/gifting-marketplace-data.ts',
    'src/components/home/PopularProducts.tsx',
    'src/components/home/CategoryTiles.tsx',
    'src/components/shop/MakhanaPromoSpotlight.tsx'
]

for tf in target_files:
    update_file(tf)
