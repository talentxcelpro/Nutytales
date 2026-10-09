import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def get_clean_logo():
    mamra_base = Image.open('public/images/mamra-almonds-pouch-250g.jpg')
    # Stop right below 'WholesomeNutty Delights' at y=370 to eliminate 'KASHMIRI'
    logo = mamra_base.crop((305, 180, 720, 368)).convert('RGB')
    return logo.resize((360, 160), Image.Resampling.LANCZOS)

def create_quality_seal_badge():
    im = Image.new('RGB', (1024, 1024), (250, 247, 242))
    draw = ImageDraw.Draw(im)
    
    # Outer luxury gold border
    draw.rectangle([40, 40, 984, 984], outline=(200, 168, 105), width=2)
    draw.rectangle([48, 48, 976, 976], outline=(23, 35, 59), width=1)
    
    logo = get_clean_logo()
    im.paste(logo, (332, 90))
    
    font_dir = os.path.join(os.environ.get('WINDIR', 'C:\\Windows'), 'Fonts')
    font_title = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 36)
    font_sub = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 20)
    font_body = ImageFont.truetype(os.path.join(font_dir, 'segoeuib.ttf'), 18)
    font_small = ImageFont.truetype(os.path.join(font_dir, 'segoeui.ttf'), 15)

    # Title
    t1 = "100% CERTIFIED PURITY & ORIGIN"
    bb1 = draw.textbbox((0, 0), t1, font=font_title)
    draw.text(((1024 - (bb1[2] - bb1[0])) // 2, 290), t1, font=font_title, fill=(23, 35, 59))

    t2 = "THE NUTY TALES HARVEST PROMISE"
    bb2 = draw.textbbox((0, 0), t2, font=font_sub)
    draw.text(((1024 - (bb2[2] - bb2[0])) // 2, 345), t2, font=font_sub, fill=(184, 147, 74))

    # 4 Trust Pillars with Gold Badges
    pillars = [
        ("ZERO CHEMICAL BLEACH", "100% unbleached raw kernels preserved in natural oil skin"),
        ("FSSAI CENTRAL GOVT CERTIFIED", "FSSAI Lic. No. 21024414000302 • Triple Batch Lab Tested"),
        ("NITROGEN-FLUSHED FRESHNESS", "Sealed at source in multi-barrier pouches to prevent rancidity"),
        ("DIRECT ORCHARD HARVEST", "Ethically sourced directly from grower cooperatives in Kashmir & worldwide")
    ]

    for idx, (p_title, p_desc) in enumerate(pillars):
        y_box = 420 + idx * 125
        # Card container
        draw.rounded_rectangle([100, y_box, 924, y_box + 105], radius=16, fill=(255, 255, 255), outline=(225, 218, 205), width=1)
        # Navy pill
        draw.rounded_rectangle([125, y_box + 22, 185, y_box + 82], radius=12, fill=(23, 35, 59))
        # Golden checkmark
        draw.line([(140, y_box + 52), (150, y_box + 64)], fill=(200, 168, 105), width=4)
        draw.line([(150, y_box + 64), (170, y_box + 40)], fill=(200, 168, 105), width=4)
        
        # Pillar text
        draw.text((210, y_box + 25), p_title, font=font_body, fill=(23, 35, 59))
        draw.text((210, y_box + 58), p_desc, font=font_small, fill=(100, 90, 80))

    footer = "AUTHENTIC VALLEY HARVEST • HANDPICKED & VACUUM SEALED"
    bb_f = draw.textbbox((0, 0), footer, font=font_small)
    draw.text(((1024 - (bb_f[2] - bb_f[0])) // 2, 940), footer, font=font_small, fill=(140, 130, 120))

    im.save('public/images/nutytales-seal-quality.jpg', quality=96)
    print("Created public/images/nutytales-seal-quality.jpg")

def create_freshness_lock_badge():
    im = Image.new('RGB', (1024, 1024), (247, 244, 238))
    draw = ImageDraw.Draw(im)
    
    draw.rectangle([40, 40, 984, 984], outline=(184, 147, 74), width=2)
    draw.rectangle([48, 48, 976, 976], outline=(23, 35, 59), width=1)
    
    logo = get_clean_logo()
    im.paste(logo, (332, 90))
    
    font_dir = os.path.join(os.environ.get('WINDIR', 'C:\\Windows'), 'Fonts')
    font_title = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 36)
    font_sub = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 20)
    font_body = ImageFont.truetype(os.path.join(font_dir, 'segoeuib.ttf'), 18)
    font_small = ImageFont.truetype(os.path.join(font_dir, 'segoeui.ttf'), 15)

    t1 = "HERMETIC FRESHNESS LOCK"
    bb1 = draw.textbbox((0, 0), t1, font=font_title)
    draw.text(((1024 - (bb1[2] - bb1[0])) // 2, 290), t1, font=font_title, fill=(23, 35, 59))

    t2 = "MULTI-BARRIER MATTE POUCH PACKAGING"
    bb2 = draw.textbbox((0, 0), t2, font=font_sub)
    draw.text(((1024 - (bb2[2] - bb2[0])) // 2, 345), t2, font=font_sub, fill=(184, 147, 74))

    features = [
        ("RESEALABLE ZIP-LOCK", "Preserves natural moisture and oil index up to 18 months after first unsealing"),
        ("OXYGEN & UV BARRIER", "Blocks oxidative breakdown, preventing rancidity and off-flavors"),
        ("FOOD GRADE METALLIZED FOIL", "BPA-free inner lining certified for direct raw organic food contact"),
        ("CLEAR INSPECTION WINDOW", "Full transparency — verify kernel size, grade, and color before opening")
    ]

    for idx, (f_title, f_desc) in enumerate(features):
        y_box = 420 + idx * 125
        draw.rounded_rectangle([100, y_box, 924, y_box + 105], radius=16, fill=(255, 255, 255), outline=(225, 218, 205), width=1)
        draw.rounded_rectangle([125, y_box + 22, 185, y_box + 82], radius=12, fill=(184, 147, 74))
        draw.line([(140, y_box + 52), (150, y_box + 64)], fill=(255, 255, 255), width=4)
        draw.line([(150, y_box + 64), (170, y_box + 40)], fill=(255, 255, 255), width=4)
        
        draw.text((210, y_box + 25), f_title, font=font_body, fill=(23, 35, 59))
        draw.text((210, y_box + 58), f_desc, font=font_small, fill=(100, 90, 80))

    footer = "KEEP REFRIGERATED FOR MAXIMUM CRUNCH • ZERO PRESERVATIVES"
    bb_f = draw.textbbox((0, 0), footer, font=font_small)
    draw.text(((1024 - (bb_f[2] - bb_f[0])) // 2, 940), footer, font=font_small, fill=(140, 130, 120))

    im.save('public/images/nutytales-freshness-lock.jpg', quality=96)
    print("Created public/images/nutytales-freshness-lock.jpg")

def create_nutrition_seal_badge():
    im = Image.new('RGB', (1024, 1024), (252, 250, 246))
    draw = ImageDraw.Draw(im)
    
    draw.rectangle([40, 40, 984, 984], outline=(23, 35, 59), width=2)
    draw.rectangle([48, 48, 976, 976], outline=(184, 147, 74), width=1)
    
    logo = get_clean_logo()
    im.paste(logo, (332, 90))
    
    font_dir = os.path.join(os.environ.get('WINDIR', 'C:\\Windows'), 'Fonts')
    font_title = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 36)
    font_sub = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 20)
    font_body = ImageFont.truetype(os.path.join(font_dir, 'segoeuib.ttf'), 18)
    font_small = ImageFont.truetype(os.path.join(font_dir, 'segoeui.ttf'), 15)

    t1 = "NUTRITIONAL EXCELLENCE"
    bb1 = draw.textbbox((0, 0), t1, font=font_title)
    draw.text(((1024 - (bb1[2] - bb1[0])) // 2, 290), t1, font=font_title, fill=(23, 35, 59))

    t2 = "PURE UNPROCESSED WHOLE FOODS • ZERO ADDED SUGAR"
    bb2 = draw.textbbox((0, 0), t2, font=font_sub)
    draw.text(((1024 - (bb2[2] - bb2[0])) // 2, 345), t2, font=font_sub, fill=(184, 147, 74))

    facts = [
        ("HEART-HEALTHY OMEGA FATS", "Rich in monounsaturated & polyunsaturated fats for healthy cholesterol"),
        ("PLANT-BASED HIGH PROTEIN", "Dense source of natural clean amino acids and satiety energy"),
        ("ESSENTIAL MINERALS & FIBRE", "High Magnesium, Potassium, Zinc, and digestive prebiotic prebiotic dietary fiber"),
        ("100% NON-GMO & GLUTEN FREE", "Naturally gluten-free, vegan, keto-friendly, and whole-food plant-based")
    ]

    for idx, (ft_title, ft_desc) in enumerate(facts):
        y_box = 420 + idx * 125
        draw.rounded_rectangle([100, y_box, 924, y_box + 105], radius=16, fill=(255, 255, 255), outline=(225, 218, 205), width=1)
        draw.rounded_rectangle([125, y_box + 22, 185, y_box + 82], radius=12, fill=(28, 70, 72))
        draw.line([(140, y_box + 52), (150, y_box + 64)], fill=(255, 255, 255), width=4)
        draw.line([(150, y_box + 64), (170, y_box + 40)], fill=(255, 255, 255), width=4)
        
        draw.text((210, y_box + 25), ft_title, font=font_body, fill=(23, 35, 59))
        draw.text((210, y_box + 58), ft_desc, font=font_small, fill=(100, 90, 80))

    footer = "BATCH TESTED FOR HEAVY METALS & AFLATOXIN RESIDUES • FSSAI COMPLIANT"
    bb_f = draw.textbbox((0, 0), footer, font=font_small)
    draw.text(((1024 - (bb_f[2] - bb_f[0])) // 2, 940), footer, font=font_small, fill=(140, 130, 120))

    im.save('public/images/nutytales-nutrition-seal.jpg', quality=96)
    print("Created public/images/nutytales-nutrition-seal.jpg")

if __name__ == '__main__':
    create_quality_seal_badge()
    create_freshness_lock_badge()
    create_nutrition_seal_badge()
