import os
import re
from PIL import Image
import numpy as np

print("=== 1. VERIFYING src/lib/products-data.ts ===")
txt = open('src/lib/products-data.ts', 'r', encoding='utf-8').read()
matches = re.findall(r'id:\s*[\'"](?P<id>[^\'"]+)[\'"].*?name:\s*[\'"](?P<name>[^\'"]+)[\'"].*?image:\s*[\'"](?P<image>[^\'"]+)[\'"]', txt, re.DOTALL)
print(f"Total products in products-data.ts: {len(matches)}")
all_ok = True

for pid, name, raw_image in matches:
    clean = raw_image.lstrip('/')
    stem = os.path.splitext(clean)[0]
    webp_path = os.path.join('public', f"{stem}.webp")
    png_path = os.path.join('public', f"{stem}.png")
    
    webp_exists = os.path.exists(webp_path)
    png_exists = os.path.exists(png_path)
    
    if not (webp_exists and png_exists):
        print(f"MISSING TRANSPARENT VERSION FOR: {pid} | {name} | {raw_image}")
        all_ok = False
    else:
        with Image.open(webp_path) as im:
            mode = im.mode
            if mode != 'RGBA':
                print(f"NOT RGBA: {webp_path} ({mode})")
                all_ok = False
            else:
                alpha = np.array(im.split()[-1])
                min_a = alpha.min()
                trans_ratio = np.sum(alpha == 0) / float(alpha.size)
                if min_a != 0 or trans_ratio < 0.20:
                    print(f"FAILED ALPHA CHECK: {webp_path} (min_a={min_a}, ratio={trans_ratio:.2f})")
                    all_ok = False

if all_ok:
    print("ALL products in products-data.ts have verified transparent WebP & PNG!\n")

print("=== 2. VERIFYING src/lib/gifting-marketplace-data.ts PRODUCTS ===")
txt_gift = open('src/lib/gifting-marketplace-data.ts', 'r', encoding='utf-8').read()
gift_products = re.findall(r'id:\s*[\'"](?P<id>gft-[^\'"]+|prd-[^\'"]+)[\'"].*?name:\s*[\'"](?P<name>[^\'"]+)[\'"].*?image:\s*[\'"](?P<image>[^\'"]+)[\'"]', txt_gift, re.DOTALL)
print(f"Total gift products found: {len(gift_products)}")
for gid, gname, gimage in gift_products:
    clean = gimage.lstrip('/')
    stem = os.path.splitext(clean)[0]
    webp_path = os.path.join('public', f"{stem}.webp")
    if os.path.exists(webp_path):
        with Image.open(webp_path) as im:
            alpha = np.array(im.split()[-1])
            print(f"  OK [{gid}] {gname[:30]:30} | {webp_path:45} | Trans: {np.sum(alpha == 0)/alpha.size*100:.1f}%")
    else:
        print(f"  MISSING: [{gid}] {gname} -> {gimage}")
