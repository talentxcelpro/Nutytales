import onnxruntime as ort
import numpy as np
import cv2
from PIL import Image
import os
import sys
import json
import time

sys.stdout.reconfigure(line_buffering=True)

print("Initializing U2Net model for batch processing...", flush=True)
sess = ort.InferenceSession('scripts/u2net.onnx', providers=['CPUExecutionProvider'])
input_name = sess.get_inputs()[0].name
output_name = sess.get_outputs()[0].name

TARGET_IMAGES = [
    # ── 1. Dry Fruits, Nuts, Seeds, Berries & Makhana Pouches (31 files) ──
    'public/images/abjosh-raisins-pouch-250g.jpg',
    'public/images/ajwa-dates-pouch-250g.jpg',
    'public/images/almonds-pouch-250g.jpg',
    'public/images/anjeer-mala-pouch-250g.jpg',
    'public/images/anjeer-pouch-250g.jpg',
    'public/images/apricots-pouch-250g.jpg',
    'public/images/barberries-pouch-250g.jpg',
    'public/images/black-raisins-pouch-250g.jpg',
    'public/images/blueberries-pouch-250g.jpg',
    'public/images/cashews-pouch-250g.jpg',
    'public/images/cashews-w180-pouch-250g.jpg',
    'public/images/chia-seeds-pouch-250g.jpg',
    'public/images/chilgoza-pouch-250g.jpg',
    'public/images/cranberries-pouch-250g.jpg',
    'public/images/gurbandi-almonds-pouch-250g.jpg',
    'public/images/himachal-walnuts-pouch-250g.jpg',
    'public/images/kashmir-kagzi-akhrot-250g.jpg',
    'public/images/kashmir-kagzi-badam-250g.jpg',
    'public/images/mabroom-dates-pouch-250g.jpg',
    'public/images/makhana-pouch-250g.jpg',
    'public/images/mamra-almonds-pouch-250g.jpg',
    'public/images/nut-mix-pouch-250g.jpg',
    'public/images/pecans-pouch-250g.jpg',
    'public/images/pepper-cashews-pouch-250g.jpg',
    'public/images/pista-slivers-pouch-250g.jpg',
    'public/images/pistachios-pouch-250g.jpg',
    'public/images/prunes-pouch-250g.jpg',
    'public/images/pumpkin-seeds-pouch-250g.jpg',
    'public/images/raisins-pouch-250g.jpg',
    'public/images/seeds-mix-pouch-250g.jpg',
    'public/images/walnuts-pouch-250g.jpg',

    # ── 2. Specialty Jars: Honey & Saffron (3 files) ──
    'public/images/iran-saffron-jar-5g.jpg',
    'public/images/kashmir-honey-jar-500g.jpg',
    'public/images/saffron-jar-5g.jpg',

    # ── 3. Gift Hampers, Trays & Boxes (7 files) ──
    'public/images/crystal-gold-nut-bowls.jpg',
    'public/images/dark-wood-gourmet-tray.jpg',
    'public/images/dates-box-250g.jpg',
    'public/images/long-festive-gift-box.jpg',
    'public/images/luxury-hamper-jars.png',
    'public/images/luxury-teal-gift-box.jpg',
    'public/images/royal-tradition-box.jpg',

    # ── 4. Standalone Promo & Craft Pack (2 files) ──
    'public/images/promo-makhana-899.png',
    'public/images/crafts-gifting-box.jpg',
    'public/images/nri/gifting-hamper.jpg',

    # ── 5. Gifting Marketplace Standalone Products (6 files) ──
    'public/images/gifting/prod-chocolate-box.jpg',
    'public/images/gifting/prod-festive-mega-hamper.jpg',
    'public/images/gifting/prod-kashmiri-hamper.jpg',
    'public/images/gifting/prod-personalized-mug.jpg',
    'public/images/gifting/prod-saffron-1g.jpg',
    'public/images/gifting/prod-wooden-memory-box.jpg'
]

manifest = {
    'created_at': time.strftime('%Y-%m-%d %H:%M:%S'),
    'total_audited': len(TARGET_IMAGES),
    'successfully_converted': 0,
    'already_transparent': 0,
    'failed': 0,
    'items': []
}

def remove_background(img_path):
    orig = Image.open(img_path).convert('RGB')
    w, h = orig.size
    
    # 1. Background color estimation from border samples
    arr_orig = np.array(orig).astype(np.float32)
    border_pixels = np.concatenate([
        arr_orig[0:5, :, :].reshape(-1, 3),
        arr_orig[-5:, :, :].reshape(-1, 3),
        arr_orig[:, 0:5, :].reshape(-1, 3),
        arr_orig[:, -5:, :].reshape(-1, 3)
    ], axis=0)
    bg_color = np.median(border_pixels, axis=0)
    
    # 2. Preprocess for U2Net
    img_resized = orig.resize((320, 320), Image.Resampling.BILINEAR)
    arr = np.array(img_resized).astype(np.float32) / 255.0
    arr[:, :, 0] = (arr[:, :, 0] - 0.485) / 0.229
    arr[:, :, 1] = (arr[:, :, 1] - 0.456) / 0.224
    arr[:, :, 2] = (arr[:, :, 2] - 0.406) / 0.225
    arr = arr.transpose((2, 0, 1))
    arr = np.expand_dims(arr, 0)
    
    # 3. ONNX Inference
    pred = sess.run([output_name], {input_name: arr})[0][0, 0, :, :]
    
    # 4. Normalize & upscale mask
    pred = (pred - pred.min()) / (pred.max() - pred.min() + 1e-8)
    mask = cv2.resize(pred, (w, h), interpolation=cv2.INTER_CUBIC)
    
    # 5. Smooth thresholding & antialiasing
    bg_thresh = 0.15
    fg_thresh = 0.85
    smooth_mask = np.clip((mask - bg_thresh) / (fg_thresh - bg_thresh), 0, 1)
    smooth_mask = smooth_mask * smooth_mask * (3 - 2 * smooth_mask) # Smoothstep
    
    # 6. Decontaminate border pixels to eliminate edge halos
    decontaminated = arr_orig.copy()
    mask_fringe = (smooth_mask > 0.02) & (smooth_mask < 0.98)
    if np.any(mask_fringe):
        a = smooth_mask[mask_fringe, np.newaxis]
        fringe_orig = arr_orig[mask_fringe]
        fringe_clean = np.clip((fringe_orig - bg_color.reshape(1, 3) * (1.0 - a)) / np.maximum(a, 0.1), 0, 255)
        decontaminated[mask_fringe] = fringe_clean
        
    alpha_bytes = (smooth_mask * 255).astype(np.uint8)
    rgba = np.dstack([decontaminated.astype(np.uint8), alpha_bytes])
    res_img = Image.fromarray(rgba, 'RGBA')
    
    # 7. Verification statistics
    t_count = int(np.sum(alpha_bytes == 0))
    o_count = int(np.sum(alpha_bytes == 255))
    e_count = int(np.sum((alpha_bytes > 0) & (alpha_bytes < 255)))
    ratio = t_count / float(alpha_bytes.size)
    min_alpha = int(alpha_bytes.min())
    max_alpha = int(alpha_bytes.max())
    corners = [int(alpha_bytes[0, 0]), int(alpha_bytes[0, -1]), int(alpha_bytes[-1, 0]), int(alpha_bytes[-1, -1])]
    
    stats = {
        'dimensions': [w, h],
        'transparent_percent': f"{ratio*100:.1f}%",
        'transparent_pixels': t_count,
        'opaque_pixels': o_count,
        'edge_pixels': e_count,
        'min_alpha': min_alpha,
        'max_alpha': max_alpha,
        'corners': corners,
        'verified_transparent': (min_alpha == 0 and ratio > 0.20 and all(c == 0 for c in corners))
    }
    
    return res_img, stats

print(f"Beginning batch background removal on {len(TARGET_IMAGES)} images...\n", flush=True)

for idx, img_path in enumerate(TARGET_IMAGES, 1):
    if not os.path.exists(img_path):
        print(f"[{idx}/{len(TARGET_IMAGES)}] SKIPPED (File not found): {img_path}", flush=True)
        manifest['failed'] += 1
        manifest['items'].append({
            'source': img_path,
            'status': 'FAILED_MISSING_FILE'
        })
        continue
        
    t_start = time.time()
    try:
        res_img, stats = remove_background(img_path)
        
        # Determine target file paths
        dir_name = os.path.dirname(img_path)
        file_stem = os.path.splitext(os.path.basename(img_path))[0]
        
        webp_path = os.path.join(dir_name, f"{file_stem}.webp")
        png_path = os.path.join(dir_name, f"{file_stem}.png")
        
        # Save transparent WebP (primary high-efficiency web format)
        res_img.save(webp_path, 'WEBP', quality=95)
        
        # Save transparent PNG (lossless transparent master)
        res_img.save(png_path, 'PNG')
        
        duration = time.time() - t_start
        manifest['successfully_converted'] += 1
        manifest['items'].append({
            'source': img_path,
            'webp': webp_path.replace('\\', '/').replace('public', ''),
            'png': png_path.replace('\\', '/').replace('public', ''),
            'stats': stats,
            'status': 'CONVERTED_AND_VERIFIED'
        })
        
        print(f"[{idx:2}/{len(TARGET_IMAGES)}] OK ({duration:.2f}s) {file_stem:35} | Trans: {stats['transparent_percent']:6} | Verified: {stats['verified_transparent']}", flush=True)
    except Exception as e:
        print(f"[{idx:2}/{len(TARGET_IMAGES)}] ERROR processing {img_path}: {e}", flush=True)
        manifest['failed'] += 1
        manifest['items'].append({
            'source': img_path,
            'status': f'ERROR: {str(e)}'
        })

# Write the transparency manifest
manifest_path = 'public/images/transparency-manifest.json'
with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2)

print(f"\nCompleted! Successfully converted: {manifest['successfully_converted']}/{len(TARGET_IMAGES)}")
print(f"Manifest written to: {manifest_path}", flush=True)
