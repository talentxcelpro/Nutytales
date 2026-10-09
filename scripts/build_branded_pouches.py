import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def generate_branded_pouch(
    output_filename: str,
    window_image_filename: str,
    subhead: str,
    title_line1: str,
    title_line2: str,
    subtitle: str,
    base_pouch_path: str = 'public/images/mamra-almonds-pouch-250g.jpg'
):
    base = Image.open(base_pouch_path).convert('RGB')
    
    # 1. Clean the text area between y=365 and y=592
    y_top = 365
    y_bot = 592
    for x in range(240, 780):
        c_t = base.getpixel((x, y_top))
        c_b = base.getpixel((x, y_bot))
        for y in range(y_top, y_bot):
            t = (y - y_top) / float(y_bot - y_top)
            r = int(c_t[0] * (1 - t) + c_b[0] * t)
            g = int(c_t[1] * (1 - t) + c_b[1] * t)
            b = int(c_t[2] * (1 - t) + c_b[2] * t)
            base.putpixel((x, y), (r, g, b))
            
    crop_box = (240, y_top, 780, y_bot)
    cleared = base.crop(crop_box).filter(ImageFilter.GaussianBlur(0.8))
    base.paste(cleared, crop_box)

    # 2. Circular Window (cx=501, cy=730, radius=128)
    cx, cy, radius = 501, 730, 128
    window_full_path = os.path.join('public/images', window_image_filename) if not os.path.isabs(window_image_filename) else window_image_filename
    
    if os.path.exists(window_full_path):
        raw_img = Image.open(window_full_path).convert('RGB')
        min_dim = min(raw_img.size)
        left = (raw_img.width - min_dim) // 2
        top = (raw_img.height - min_dim) // 2
        raw_img = raw_img.crop((left, top, left + min_dim, top + min_dim))
        raw_img = raw_img.resize((radius * 2, radius * 2), Image.Resampling.LANCZOS)
        
        mask = Image.new('L', (radius * 2, radius * 2), 0)
        m_draw = ImageDraw.Draw(mask)
        m_draw.ellipse((0, 0, radius * 2 - 1, radius * 2 - 1), fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(0.8))
        
        base.paste(raw_img, (cx - radius, cy - radius), mask)
        
        # Inner bezel vignette ring
        vignette = Image.new('RGBA', (radius * 2, radius * 2), (0, 0, 0, 0))
        v_draw = ImageDraw.Draw(vignette)
        v_draw.ellipse((0, 0, radius * 2 - 1, radius * 2 - 1), outline=(0, 0, 0, 75), width=3)
        vignette = vignette.filter(ImageFilter.GaussianBlur(1.5))
        base.paste(vignette, (cx - radius, cy - radius), vignette)

    # 3. Clean Luxury Typography with Auto-Fitting
    draw = ImageDraw.Draw(base)
    font_dir = os.path.join(os.environ.get('WINDIR', 'C:\\Windows'), 'Fonts')
    georgia_path = os.path.join(font_dir, 'georgiab.ttf')
    segoe_path = os.path.join(font_dir, 'segoeuib.ttf')

    def get_fitted_font(f_path, init_size, text, max_w=480):
        size = init_size
        while size >= 12:
            try:
                f = ImageFont.truetype(f_path, size)
                bb = draw.textbbox((0, 0), text, font=f)
                if (bb[2] - bb[0]) <= max_w:
                    return f
            except:
                return ImageFont.load_default()
            size -= 2
        try:
            return ImageFont.truetype(f_path, 12)
        except:
            return ImageFont.load_default()

    # Subhead (Teal / Slate)
    if subhead:
        font_subhead = get_fitted_font(georgia_path, 17, subhead, 480)
        bb = draw.textbbox((0, 0), subhead, font=font_subhead)
        w_sub = bb[2] - bb[0]
        draw.text((cx - w_sub // 2, 386), subhead, font=font_subhead, fill=(28, 70, 72))

    # Title Line 1 (Dark Slate Navy)
    if title_line1:
        font_title1 = get_fitted_font(georgia_path, 38, title_line1, 480)
        bb1 = draw.textbbox((0, 0), title_line1, font=font_title1)
        w_t1 = bb1[2] - bb1[0]
        draw.text((cx - w_t1 // 2, 418), title_line1, font=font_title1, fill=(23, 35, 59))

    # Title Line 2 (Warm Gold)
    if title_line2:
        font_title2 = get_fitted_font(georgia_path, 32, title_line2, 480)
        bb2 = draw.textbbox((0, 0), title_line2, font=font_title2)
        w_t2 = bb2[2] - bb2[0]
        draw.text((cx - w_t2 // 2, 472), title_line2, font=font_title2, fill=(184, 147, 74))

    # Subtitle (Dark Charcoal Sans)
    if subtitle:
        font_sub = get_fitted_font(segoe_path, 15, subtitle, 490)
        bb_s = draw.textbbox((0, 0), subtitle, font=font_sub)
        w_s = bb_s[2] - bb_s[0]
        draw.text((cx - w_s // 2, 532), subtitle, font=font_sub, fill=(65, 55, 50))

    out_path = os.path.join('public/images', output_filename)
    base.save(out_path, quality=96)
    print(f"Generated {out_path} successfully.")

POUCH_DEFINITIONS = [
    {
        'output_filename': 'almonds-pouch-250g.jpg',
        'window_image_filename': 'mamra-kernels-macro.jpg',
        'subhead': 'SAN JOAQUIN VALLEY • CALIFORNIA',
        'title_line1': 'CALIFORNIA',
        'title_line2': 'ALMONDS',
        'subtitle': 'EXTRA BOLD CRUNCH • GRADE A',
    },
    {
        'output_filename': 'cashews-pouch-250g.jpg',
        'window_image_filename': 'cashews-w180-macro.jpg',
        'subhead': 'GOAN SUN-DRIED • WHOLE KERNELS',
        'title_line1': 'W240 PREMIUM',
        'title_line2': 'CASHEWS',
        'subtitle': 'SWEET CREAMY WHOLE NUTS',
    },
    {
        'output_filename': 'cashews-w180-pouch-250g.jpg',
        'window_image_filename': 'cashews-w180-macro.jpg',
        'subhead': 'ROYAL RESERVE • SINGLE ORIGIN',
        'title_line1': 'KING JUMBO W180',
        'title_line2': 'CASHEWS',
        'subtitle': 'LARGEST WHITE WHOLE KERNELS',
    },
    {
        'output_filename': 'anjeer-pouch-250g.jpg',
        'window_image_filename': 'anjeer-macro.jpg',
        'subhead': 'AYDIN VALLEY • SUN-DRIED',
        'title_line1': 'TURKISH JUMBO',
        'title_line2': 'ANJEER',
        'subtitle': 'HONEYED PLUMP DRIED FIGS',
    },
    {
        'output_filename': 'anjeer-mala-pouch-250g.jpg',
        'window_image_filename': 'anjeer-macro.jpg',
        'subhead': 'KANDAHAR MOUNTAINS • AFGHANISTAN',
        'title_line1': 'AFGHAN MALA',
        'title_line2': 'ANJEER',
        'subtitle': 'TRADITIONAL STRING WREATH FIGS',
    },
    {
        'output_filename': 'black-raisins-pouch-250g.jpg',
        'window_image_filename': 'black-munakka-macro.jpg',
        'subhead': 'NATURAL SEEDLESS • HIGH IRON',
        'title_line1': 'BLACK MUNAKKA',
        'title_line2': 'RAISINS',
        'subtitle': 'JUMBO ANTIOXIDANT SWEET GRAPES',
    },
    {
        'output_filename': 'apricots-pouch-250g.jpg',
        'window_image_filename': 'apricot-halman-macro.jpg',
        'subhead': 'LADAKH VALLEY • ORGANIC HARVEST',
        'title_line1': 'HALMAN WILD',
        'title_line2': 'APRICOTS',
        'subtitle': 'SUN-DRIED WITH EDIBLE SWEET KERNEL',
    },
    {
        'output_filename': 'ajwa-dates-pouch-250g.jpg',
        'window_image_filename': 'ajwa-dates-macro.jpg',
        'subhead': 'MADINAH AL-ALIYA • SAUDI ARABIA',
        'title_line1': 'ROYAL AJWA',
        'title_line2': 'DATES',
        'subtitle': 'SACRED HEALING FRUIT • GRADE A',
    },
    {
        'output_filename': 'pista-slivers-pouch-250g.jpg',
        'window_image_filename': 'pista-slivers-macro.jpg',
        'subhead': 'ROYAL PESHAWARI • RAW KERNELS',
        'title_line1': 'GREEN PEELED',
        'title_line2': 'PISTA SLIVERS',
        'subtitle': 'FINE EMERALD GARNISH KERNELS',
    },
    {
        'output_filename': 'gurbandi-almonds-pouch-250g.jpg',
        'window_image_filename': 'mamra-kernels-macro.jpg',
        'subhead': 'AFGHAN HIGH-ALTITUDE • CHHOTI GIRI',
        'title_line1': 'GURBANDI BADAM',
        'title_line2': 'ALMONDS',
        'subtitle': 'HIGH OIL MEDICINAL ALMONDS',
    },
    # ── New Regional Specialities ──────────────────────────────────────────
    # 1. Afghanistan: Chilgoza (Pine Nuts)
    {
        'output_filename': 'chilgoza-pouch-250g.jpg',
        'window_image_filename': 'chilgoza-macro.jpg',
        'subhead': 'HINDU KUSH • AFGHANISTAN',
        'title_line1': 'ROYAL JUMBO',
        'title_line2': 'CHILGOZA',
        'subtitle': 'WILD HARVEST PINE NUTS IN-SHELL',
    },
    # 2. Afghanistan: Kandahari Abjosh Long Sultanas
    {
        'output_filename': 'abjosh-raisins-pouch-250g.jpg',
        'window_image_filename': 'black-munakka-macro.jpg',
        'subhead': 'KANDAHAR VALLEY • AFGHANISTAN',
        'title_line1': 'KANDAHARI ABJOSH',
        'title_line2': 'GOLDEN RAISINS',
        'subtitle': 'EXTRA LONG JUMBO SULTANAS',
    },
    # 3. Middle East: Mabroom Dates (Madinah)
    {
        'output_filename': 'mabroom-dates-pouch-250g.jpg',
        'window_image_filename': 'mabroom-dates-macro.jpg',
        'subhead': 'MADINAH AL-MUNAWWARAH',
        'title_line1': 'ROYAL MABROOM',
        'title_line2': 'DATES',
        'subtitle': 'VIP GRADE 1 SLENDER CHEWY DATES',
    },
    # 4. Middle East: Iranian Ruby Barberries (Zereshk)
    {
        'output_filename': 'barberries-pouch-250g.jpg',
        'window_image_filename': 'barberries-macro.jpg',
        'subhead': 'SOUTH KHORASAN • IRAN',
        'title_line1': 'POFAKI RUBY',
        'title_line2': 'BARBERRIES (ZERESHK)',
        'subtitle': 'SUN-DRIED TART WILD SUPERBERRY',
    },
    # 5. USA: Cranberries
    {
        'output_filename': 'cranberries-pouch-250g.jpg',
        'window_image_filename': 'cranberries-macro.jpg',
        'subhead': 'WISCONSIN BOGS • USA',
        'title_line1': 'WHOLE DRIED',
        'title_line2': 'CRANBERRIES',
        'subtitle': 'GRADE A PLUMP TART-SWEET BERRIES',
    },
    # 6. USA: Blueberries
    {
        'output_filename': 'blueberries-pouch-250g.jpg',
        'window_image_filename': 'blueberries-macro.jpg',
        'subhead': 'PACIFIC NORTHWEST • USA',
        'title_line1': 'WILD DRIED',
        'title_line2': 'BLUEBERRIES',
        'subtitle': 'ANTIOXIDANT SUPERFOOD GRADE A',
    },
    # 7. USA: California Prunes
    {
        'output_filename': 'prunes-pouch-250g.jpg',
        'window_image_filename': 'ajwa-dates-macro.jpg',
        'subhead': 'SACRAMENTO VALLEY • CALIFORNIA',
        'title_line1': 'CALIFORNIA PITTED',
        'title_line2': 'PRUNES',
        'subtitle': 'MOIST SUN-DRIED SWEET PLUMS',
    },
    # 8. USA: California Pecan Halves
    {
        'output_filename': 'pecans-pouch-250g.jpg',
        'window_image_filename': 'pecans-macro.jpg',
        'subhead': 'ORCHARDS OF CALIFORNIA • USA',
        'title_line1': 'GOLDEN MAMMOTH',
        'title_line2': 'PECAN HALVES',
        'subtitle': 'BUTTERY RICH RAW TREE NUTS',
    },
    # 9. India (Kerala): Tellicherry Black Pepper Cashews
    {
        'output_filename': 'pepper-cashews-pouch-250g.jpg',
        'window_image_filename': 'pepper-cashews-macro.jpg',
        'subhead': 'MALABAR COAST • KERALA',
        'title_line1': 'TELLICHERRY PEPPER',
        'title_line2': 'ROASTED CASHEWS',
        'subtitle': 'SLOW-ROASTED JUMBO W210 KERNELS',
    },
    # 10. India (Himachal Pradesh): Kinnaur Wild Walnuts
    {
        'output_filename': 'himachal-walnuts-pouch-250g.jpg',
        'window_image_filename': 'cashews-walnuts-macro.jpg',
        'subhead': 'KINNAUR VALLEY • HIMACHAL',
        'title_line1': 'KINNAUR WILD',
        'title_line2': 'MOUNTAIN WALNUTS',
        'subtitle': 'ORGANIC HIGH-OIL MOUNTAIN AKHROT',
    },
]

if __name__ == '__main__':
    for p in POUCH_DEFINITIONS:
        generate_branded_pouch(**p)
