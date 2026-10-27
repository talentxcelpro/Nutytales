import os
import glob
import re
from PIL import Image

def check_alpha(img_path):
    if not os.path.exists(img_path):
        return False, 'MISSING', (0, 0)
    try:
        with Image.open(img_path) as im:
            size = im.size
            mode = im.mode
            if mode in ('RGBA', 'LA') or (mode == 'P' and 'transparency' in im.info):
                alpha = im.convert('RGBA').split()[-1]
                extrema = alpha.getextrema()
                has_transparent_pixels = extrema[0] < 250
                alpha_bytes = list(alpha.getdata())
                transparent_count = sum(1 for a in alpha_bytes if a < 128)
                ratio = transparent_count / float(len(alpha_bytes))
                return has_transparent_pixels, f"{mode} (min_alpha={extrema[0]}, {ratio*100:.1f}% transparent)", size
            else:
                return False, f"Opaque ({mode})", size
    except Exception as e:
        return False, f"Error: {e}", (0, 0)

print("=== 1. AUDITING src/lib/products-data.ts ===")
txt = open('src/lib/products-data.ts', 'r', encoding='utf-8').read()
# Extract each product block
product_blocks = re.findall(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"].*?tags:\s*\[[^\]]*\]\s*\}', txt, re.DOTALL)
print(f"Products matched by block: {len(product_blocks)}")

# Let's also extract all id, name, slug, image, images from PRODUCTS
p_entries = []
for m in re.finditer(r'id:\s*[\'"](?P<id>[^\'"]+)[\'"].*?name:\s*[\'"](?P<name>[^\'"]+)[\'"].*?slug:\s*[\'"](?P<slug>[^\'"]+)[\'"].*?image:\s*[\'"](?P<image>[^\'"]+)[\'"]', txt, re.DOTALL):
    d = m.groupdict()
    p_entries.append(d)

print(f"Found {len(p_entries)} products with primary image:")
for p in p_entries:
    disk = os.path.join('public', p['image'].lstrip('/'))
    has_trans, desc, size = check_alpha(disk)
    print(f"  [{p['id']}] {p['name'][:35]:35} | {p['image']:35} | Trans: {str(has_trans):5} | {desc}")

print("\n=== 2. AUDITING src/lib/gifting-marketplace-data.ts ===")
txt_gift = open('src/lib/gifting-marketplace-data.ts', 'r', encoding='utf-8').read()
gift_images = set(re.findall(r'[\'"](/images/[^\'"]+\.(?:jpg|jpeg|png|webp))[\'"]', txt_gift))
for g in sorted(gift_images):
    disk = os.path.join('public', g.lstrip('/'))
    has_trans, desc, size = check_alpha(disk)
    print(f"  {g:45} | Trans: {str(has_trans):5} | {desc}")

print("\n=== 3. AUDITING src/lib/b2b-data.ts & business-supply-data.ts ===")
for path in ['src/lib/b2b-data.ts', 'src/lib/business-supply-data.ts', 'src/lib/inventory-data.ts']:
    if os.path.exists(path):
        txt_b = open(path, 'r', encoding='utf-8').read()
        b_images = set(re.findall(r'[\'"](/images/[^\'"]+\.(?:jpg|jpeg|png|webp))[\'"]', txt_b))
        print(f"File {path}: {len(b_images)} images")
        for b in sorted(b_images):
            disk = os.path.join('public', b.lstrip('/'))
            has_trans, desc, size = check_alpha(disk)
            print(f"    {b:45} | Trans: {str(has_trans):5} | {desc}")
