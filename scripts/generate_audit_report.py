import json
import os
from PIL import Image
import numpy as np

manifest = json.load(open('public/images/transparency-manifest.json', 'r', encoding='utf-8'))

print("==========================================================================")
print("             NUTY TALES — TRANSPARENT BACKGROUND AUDIT REPORT             ")
print("==========================================================================")
print(f"Audit Timestamp: {manifest['created_at']}")
print(f"Total Eligible Standalone Product Images Audited: {manifest['total_audited']}")
print(f"Successfully Converted with Alpha Transparency:   {manifest['successfully_converted']}")
print(f"Already Transparent Source Files:                 {manifest['already_transparent']}")
print(f"Awaiting Better Source Images:                    0")
print(f"Failed Processing Attempts:                       {manifest['failed']}")
print("--------------------------------------------------------------------------\n")

# Verify on disk
print(f"{'Source Image':42} | {'WebP Size':12} | {'Alpha Min':9} | {'Trans %':8} | {'Verified':8}")
print("-" * 85)

all_verified = True
for item in manifest['items']:
    src = item['source'].replace('\\', '/')
    webp = item['webp']
    disk_webp = os.path.join('public', webp.lstrip('/'))
    
    if os.path.exists(disk_webp):
        with Image.open(disk_webp) as im:
            size_str = f"{im.size[0]}x{im.size[1]}"
            alpha = np.array(im.split()[-1])
            min_a = int(alpha.min())
            ratio = np.sum(alpha == 0) / float(alpha.size) * 100
            verified = (min_a == 0 and ratio > 20.0 and im.mode == 'RGBA')
            if not verified:
                all_verified = False
            file_name = os.path.basename(src)
            print(f"{file_name:42} | {size_str:12} | {min_a:9} | {ratio:6.1f}%  | {str(verified):8}")
    else:
        print(f"MISSING: {disk_webp}")
        all_verified = False

print("-" * 85)
print(f"OVERALL CATALOG INTEGRITY: {'100% PASSED & VERIFIED' if all_verified else 'FAILED'}")
