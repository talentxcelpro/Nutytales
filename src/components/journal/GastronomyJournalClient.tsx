'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatGlobalPrice } from '@/lib/global-config'

// Journal Article Specification
export interface JournalArticle {
  id: string
  volume: string
  title: string
  subtitle: string
  category: string
  categorySlug: 'rituals' | 'saffron' | 'terroir' | 'ancient' | 'pairings'
  readTime: string
  labCertification: string
  heroImage: string
  summary: string
  leadQuote: string
  botanicalScience: {
    heading: string
    paragraphs: string[]
    keyMetrics: { label: string; value: string; hint: string }[]
  }
  theProtocol: {
    heading: string
    steps: { stepNumber: string; stepTitle: string; instruction: string }[]
    connoisseurTip: string
  }
  products: {
    id: string
    slug: string
    name: string
    image: string
    tag: string
    variants: { label: string; retailPrice: number; mrp?: number }[]
  }[]
}

const ARTICLES: JournalArticle[] = [
  {
    id: 'mamra-enzymatic-awakening',
    volume: 'Monograph No. 01 · Autumn Archives',
    title: 'The Connoisseur Morning Ritual: Overnight Water-Soaked Mamra Badam & Wild Acacia Honey',
    subtitle: 'The biochemical mechanics of phytic acid deactivation, cold-climate lipid synthesis, and non-glycemic Levulose synergy.',
    category: 'Bioactive Lipids & Cognitive Vitality',
    categorySlug: 'rituals',
    readTime: '6 min read',
    labCertification: 'NABL Tested · 52.8% Cold-Pressed Lipids',
    heroImage: '/images/mamra-kernels-macro.jpg',
    summary:
      'Why wild mountain seedling almonds grown at 1,850m elevation in Dachigam yield unmatched monounsaturated fatty acids, and why unsoaked commercial nuts rob the body of bioavailable micronutrients.',
    leadQuote:
      '“A raw Himalayan Mamra almond is a dormant biological engine. Cold spring water does not merely soften the kernel—it acts as an enzymatic key, disarming phytic inhibitors and releasing 52.8% pristine lipids directly into cellular digestion.”',
    botanicalScience: {
      heading: 'The Phytate Inhibitor Paradox & High-Altitude Fatty Acid Synthesis',
      paragraphs: [
        'Commercial mass-farmed almonds grown under heavy irrigation in temperate valleys synthesize relatively low lipid concentrations (averaging 16% to 19%), yielding mostly bland bulk cellulose. In contrast, wild Himalayan Mamra trees (Prunus amygdalus var. dulcis) endure sub-zero mountain winters and mineral-dense glacial runoff on the slopes of Dachigam and Budgam.',
        'This severe cold-stress triggers a defensive botanical response: the seedling stores concentrated unsaturated fatty acids—principally oleic (Omega-9) and linoleic (Omega-6) acids—reaching an extraordinary 52.8% essential oil volume in third-party NABL chromatographic assays.',
        'However, raw unsoaked almonds naturally contain phytic acid (myo-inositol 1,2,3,4,5,6-hexakisphosphate) in their papery outer pellicle. This compound binds firmly to dietary zinc, iron, and calcium in the human gastrointestinal tract, creating insoluble chelates that pass unabsorbed. Overnight soaking in cold mountain water activates native phytase enzymes, breaking down phytic acid bonds within 8 hours and softening the astringent tannins for effortless peeling.',
      ],
      keyMetrics: [
        { label: 'Essential Oil Index', value: '52.8%', hint: 'vs. 18.2% in California commercial almonds' },
        { label: 'Phytic Acid Reduction', value: '-87.4%', hint: 'Achieved after 8-hour cold spring water soak' },
        { label: 'Altitude of Terroir', value: '1,850m', hint: 'Dachigam & Budgam high-altitude slopes, Kashmir' },
        { label: 'Native Lipid Purity', value: '100% Raw', hint: 'Zero chemical pasteurization or steam heating' },
      ],
    },
    theProtocol: {
      heading: 'The 5-Step Aristocratic Dawn Protocol',
      steps: [
        {
          stepNumber: '01',
          stepTitle: 'Selection & Rationing',
          instruction: 'Select 5 to 7 whole Kashmiri Mamra kernels. Note the characteristic curved boat silhouette, deep cleft furrow, and natural earthy pigmentation—hallmarks of wild mountain seedling genetics.',
        },
        {
          stepNumber: '02',
          stepTitle: 'Cold Spring Water Immersion',
          instruction: 'Submerge kernels in 100ml of fresh spring or filtered water within a glass or unglazed terracotta vessel. Allow to rest at cool ambient temperature (16°C–20°C) for a minimum of 8 hours overnight.',
        },
        {
          stepNumber: '03',
          stepTitle: 'The Papery Pellicle Slide',
          instruction: 'At dawn, notice how the soaking water has turned lightly amber from released tannins. With a gentle slide of thumb and forefinger, slip off the thin outer skin. Never discard the kernel oil.',
        },
        {
          stepNumber: '04',
          stepTitle: 'The Acacia Honey Synergy',
          instruction: 'Plate the pearl-white activated kernels. Drizzle with 1 teaspoon of raw Kashmiri Acacia Honey. Pure Acacia honey is naturally rich in Levulose (fruit sugar), which does not trigger rapid insulin spikes and provides steady neural fuel.',
        },
        {
          stepNumber: '05',
          stepTitle: 'Mindful Mastication',
          instruction: 'Chew slowly before morning tea or coffee. The unctuous, rich natural oil immediately emulsifies on the palate, delivering neuro-protective oleic acid directly to brain cells.',
        },
      ],
      connoisseurTip:
        'Connoisseur Insight: Never soak almonds in boiling water. Rapid thermal shock destroys delicate vitamin E (alpha-tocopherol) isomers and halts the natural enzymatic phytase breakdown.',
    },
    products: [
      {
        id: 'alm-002',
        slug: 'mamra-almonds-kashmiri-badam',
        name: 'Mamra Almonds (Kashmiri Badam)',
        image: '/images/mamra-almonds-pouch-250g.webp',
        tag: 'Glacial Sourced · 52.8% Oil',
        variants: [
          { label: '250g', retailPrice: 1103, mrp: 1301 },
          { label: '500g', retailPrice: 2184, mrp: 2577 },
          { label: '1 kg', retailPrice: 4200, mrp: 4956 },
        ],
      },
      {
        id: 'hny-001',
        slug: 'pure-kashmiri-acacia-honey',
        name: 'Pure Kashmiri Acacia Honey',
        image: '/images/kashmir-honey-jar-500g.webp',
        tag: 'Single-Bloom · Non-Crystallizing',
        variants: [
          { label: '250g Jar', retailPrice: 420, mrp: 499 },
          { label: '500g Jar', retailPrice: 780, mrp: 920 },
          { label: '1 kg Jar', retailPrice: 1450, mrp: 1750 },
        ],
      },
    ],
  },
  {
    id: 'pampore-saffron-chemistry',
    volume: 'Monograph No. 02 · Terroir Chemistry',
    title: 'The Pampore Chemistry: Crocin Extraction Kinetics & The Science of the Saffron Bloom',
    subtitle: 'Why authentic Grade-1 Mongra stigmas take 20 minutes to infuse, and the destructive fallacy of instantaneous color.',
    category: 'Terroir & Phytonutrient Chemistry',
    categorySlug: 'saffron',
    readTime: '7 min read',
    labCertification: 'ISO 3632 Cat-I · Crocin Reading >240',
    heroImage: '/images/saffron-threads-macro.jpg',
    summary:
      'The spectrophotometric science of Crocus sativus: understanding why synthetic dyes bleed red in seconds, while Himalayan Mongra releases pale golden ribbons that gradually intensify into deep imperial amber.',
    leadQuote:
      '“True saffron does not bleed crimson upon touch. It breathes. If your saffron turns boiling liquid violent orange in three seconds, you are drinking dyed corn silk or tartrazine. Authentic Mongra is a slow, luminous alchemical bloom.”',
    botanicalScience: {
      heading: 'The Holy Triad: Crocin, Picrocrocin & Safranal Kinetics',
      paragraphs: [
        'The saffron fields of Pampore sit on high lacustrine plateau terraces known locally as Karewas. Composed of ancient silt and glacial loess, this soil delivers ideal drainage and intense solar radiation, giving Kashmiri Crocus sativus stigmas their famed trumpet-shaped thickness and deep blood-crimson coloring.',
        'At the molecular level, authentic saffron quality is governed by three primary phytochemicals: Crocin (a water-soluble carotenoid glycoside responsible for coloring power), Picrocrocin (responsible for bitter, earthy flavor undertones), and Safranal (a volatile monoterpene aldehyde that imparts the intoxicating, honey-floral aroma).',
        'When dry Grade-1 Mongra stigmas touch liquid, their cellular membranes must rehydrate before crocin molecules can diffuse into the water column. This process is governed by Fickian diffusion kinetics. Real saffron releases delicate, pale yellow streamers that slowly spiral outwards. Only after 15 to 25 minutes does the solution reach full optical density and peak spectroscopic absorption (lambda max 440nm).',
      ],
      keyMetrics: [
        { label: 'Crocin Coloring Strength', value: '> 240', hint: 'ISO 3632 Category-I Gold Standard' },
        { label: 'Safranal Aroma Volatiles', value: '> 35', hint: 'Natural sun-cured mountain distillation' },
        { label: 'Picrocrocin Bitterness', value: '> 75', hint: 'Distinctive medicinal and culinary complexity' },
        { label: 'Adulterant Reading', value: '0.00%', hint: 'Zero Tartrazine, Sunset Yellow, or Amaranth' },
      ],
    },
    theProtocol: {
      heading: 'The Royal Ice-Shock Bloom Masterclass',
      steps: [
        {
          stepNumber: '01',
          stepTitle: 'The Mortar Pinch',
          instruction: 'Take 4 to 6 threads of pure Kashmiri Mongra Saffron. Place them in a small marble or glass mortar with a tiny pinch of raw sugar crystals (sugar acts as a micro-abrasive to crush the stigmas without heat).',
        },
        {
          stepNumber: '02',
          stepTitle: 'The Ice Cube Shock',
          instruction: 'Instead of pouring scalding water directly over the saffron—which cooks off delicate safranal aroma compounds—place one crushed ice cube directly onto the crushed stigmas.',
        },
        {
          stepNumber: '03',
          stepTitle: 'Slow Glacial Extraction',
          instruction: 'Allow the ice to melt at ambient room temperature over 15 to 20 minutes. As the ice liquefies, the cold water gently draws out 38% more crocin pigment without thermal degradation.',
        },
        {
          stepNumber: '04',
          stepTitle: 'The Liquid Canvas',
          instruction: 'Add the resulting concentrated sunset-gold liqueur to warm whole milk, biryani cooking broth, or steep into green tea leaves for the royal Kashmiri Kehwa.',
        },
        {
          stepNumber: '05',
          stepTitle: 'The Stigma Verification',
          instruction: 'Examine the spent threads. Authentic Kashmiri Mongra stigmas retain their red-burgundy physical shape and do not turn white or disintegrate, proving zero chemical exhaustion.',
        },
      ],
      connoisseurTip:
        'Chef Rule: Never discard the spent saffron threads after brewing. Add them directly into the dish as visual proof of single-origin luxury provenance.',
    },
    products: [
      {
        id: 'saf-001',
        slug: 'kashmiri-mongra-saffron',
        name: 'Pure Kashmiri Mongra Saffron',
        image: '/images/saffron-jar-5g.webp',
        tag: 'Pampore Karewas · Grade-1 Stigmas',
        variants: [
          { label: '1g Jar', retailPrice: 420, mrp: 499 },
          { label: '2g Jar', retailPrice: 820, mrp: 975 },
          { label: '5g Jar', retailPrice: 1950, mrp: 2350 },
        ],
      },
      {
        id: 'pst-003',
        slug: 'green-peeled-pista-slivers',
        name: 'Green Peeled Pista Slivers',
        image: '/images/pista-slivers-pouch-250g.webp',
        tag: 'Vibrant Emerald · Wazwan Garnish',
        variants: [
          { label: '250g', retailPrice: 1011, mrp: 1193 },
          { label: '500g', retailPrice: 2002, mrp: 2362 },
          { label: '1 kg', retailPrice: 3850, mrp: 4543 },
        ],
      },
    ],
  },
  {
    id: 'kagzi-walnut-pellicle',
    volume: 'Monograph No. 03 · Harvest Truths',
    title: 'The Fragile Bioactive Pellicle: Why Bleached Commercial Walnuts Turn Bitter vs. Sun-Cured Kagzi',
    subtitle: 'The fragile chemistry of Alpha-Linolenic Acid (ALA), chemical peroxide bleaching, and the single-hand palm crack.',
    category: 'Terroir Lipids & Cardiovascular Integrity',
    categorySlug: 'terroir',
    readTime: '5 min read',
    labCertification: 'Zero Chemical Bleach · Cold Mountain Dried',
    heroImage: '/images/cashews-walnuts-macro.jpg',
    summary:
      'Understanding how commercial chlorine wash oxidizes precious Omega-3 fats inside the shell, and why authentic Himalayan Kagzi walnuts are sweet, creamy, and crackable with light palm pressure.',
    leadQuote:
      '“When you taste an astringent, throat-catching walnut, you are not tasting nature. You are tasting oxidized lipids and chemical wash residue. A true Kagzi walnut kernel from Shopian tastes like sweet mountain cream.”',
    botanicalScience: {
      heading: 'Peroxide Penetration vs. Himalayan River-Pebble Sun-Curing',
      paragraphs: [
        'Walnut kernels (Juglans regia) boast the highest concentration of plant-based Omega-3 fatty acid—specifically alpha-linolenic acid (ALA)—of any nut. However, polyunsaturated fats with double-bond lipid chains are notoriously vulnerable to auto-oxidation when exposed to heat, UV radiation, and industrial chemical washes.',
        'In mass-market industrial processing, harvested walnuts are dipped in hydrogen peroxide or chlorine baths to produce an artificially pristine, uniform white shell for supermarket displays. This chemical solution seeps through the micro-pores of the shell, oxidizing the thin brown pellicle surrounding the kernel and causing it to turn bitter, acidic, and astringent.',
        'At Nuty Tales, our Kashmiri Kagzi walnuts are never chemically bleached. After harvest from hundred-year-old wild seedling trees in Shopian and Budgam, they are washed only in glacial stream water and sun-dried on river pebble terraces. The natural sunlight slowly reduces moisture below 4.5% while locking the delicate omega oils securely inside their airtight paper shell.',
      ],
      keyMetrics: [
        { label: 'Omega-3 ALA per 100g', value: '9.08g', hint: 'Cardiovascular arterial elasticity support' },
        { label: 'Moisture Content', value: '< 4.2%', hint: 'Prevents mould while preserving kernel crispness' },
        { label: 'Shell Resistance', value: 'Paper-Thin', hint: 'Cracks open easily under single-hand palm squeeze' },
        { label: 'Bleach & Chemical Wash', value: '0.00%', hint: '100% Raw unbleached mountain harvest' },
      ],
    },
    theProtocol: {
      heading: 'The Connoisseur Palm Crack & Storage Rule',
      steps: [
        {
          stepNumber: '01',
          stepTitle: 'The Two-Kernel Palm Press',
          instruction: 'Place two Kagzi walnuts in the hollow of your palm. Close your fingers and apply steady, gentle squeeze pressure. Hear the crisp, clean crack of the paper-thin shell yielding effortlessly.',
        },
        {
          stepNumber: '02',
          stepTitle: 'Inspection of the Pellicle',
          instruction: 'Separate the two brain-shaped halves. Notice the light golden or ivory pellicle. There should be zero dark chemical discoloration or powdery residue around the central septum.',
        },
        {
          stepNumber: '03',
          stepTitle: 'Aroma & Palate Assessment',
          instruction: 'Smell the kernel immediately upon cracking. The scent should be faintly sweet, nutty, and reminiscent of autumn leaves—never paint-like or sharp.',
        },
        {
          stepNumber: '04',
          stepTitle: 'Cold Dark Storage',
          instruction: 'Once shelled, store walnut kernels in an airtight glass container in the refrigerator (4°C) or freezer. Without chemical preservatives, pure cold-climate lipids must be shielded from heat.',
        },
      ],
      connoisseurTip:
        'Gastronomic Pairing: Toast Kagzi walnut halves in a dry cast iron skillet for 90 seconds, then pair with artisanal blue cheese and raw honeycomb for an unforgettable terroir board.',
    },
    products: [
      {
        id: 'wln-001',
        slug: 'kashmiri-walnuts-in-shell',
        name: 'Kashmiri Kagzi Akhrot (Paper Shell)',
        image: '/images/kashmir-kagzi-akhrot-250g.webp',
        tag: 'Paper-Thin Shell · Hand-Cracked',
        variants: [
          { label: '250g', retailPrice: 257, mrp: 304 },
          { label: '500g', retailPrice: 510, mrp: 601 },
          { label: '1 kg', retailPrice: 980, mrp: 1156 },
        ],
      },
    ],
  },
  {
    id: 'mithila-makhana-ancient-nectar',
    volume: 'Monograph No. 04 · Wetland Ethnobotany',
    title: 'Mithila Popped Nectar: 7-Suta Makhana as an Ancient Low-GI Ayurvedic Fasting Superfood',
    subtitle: 'The underwater harvesting of Euryale ferox, 7-Suta sieve precision, and resistant starch cellular architecture.',
    category: 'Ancient Superfoods & Metabolic Precision',
    categorySlug: 'ancient',
    readTime: '6 min read',
    labCertification: 'Glycemic Index: 35 · Zero Trans-Fat',
    heroImage: '/images/makhana-pouch-250g.webp',
    summary:
      'The breathtaking mud-diving harvest of fox nuts in the oxbow lakes of Mithila, and why slow roasting in A2 Desi Ghee preserves delicate flavonoid antioxidants while delivering pure crunch.',
    leadQuote:
      '“Makhana is nature’s most miraculous wetland alchemy. Deep beneath thorny lily pads, mud-divers collect black seeds that burst under intense wood-fire heat into cloud-white spheres of pure cellular vitality.”',
    botanicalScience: {
      heading: 'The Mallah Harvesters of Mithila & 7-Suta Sieve Science',
      paragraphs: [
        'Makhana (Euryale ferox), known globally as Gorgon nut or fox nut, flourishes in the undisturbed wetland ponds and oxbow lakes (chaurs) of North Bihar. The harvesting process remains an extraordinary feat of human endurance: indigenous Mallah fishermen plunge into three-meter mud depths without oxygen apparatus, sweeping the lakebed to gather spiny black seeds in woven bamboo baskets (gaanja).',
        'Once sundried and tempered, the seeds are roasted in earthen pots over wood fires, then cracked on wooden anvils using heavy mallets. In a fraction of a second, the hard black hull shatters and the white perisperm pops outward into a pristine sphere.',
        'At Nuty Tales, we sort strictly through a 7-Suta mechanical calibration sieve (kernels exceeding 20mm in diameter). This produces dense, cloud-like spheres with zero black hull debris and an ultra-low Glycemic Index of 35—making it the quintessential restorative superfood documented in Charaka Samhita as Vrushya and Balya.',
      ],
      keyMetrics: [
        { label: 'Sieve Calibration', value: '7-Suta (>20mm)', hint: 'Jumbo spherical kernels with zero seed grit' },
        { label: 'Glycemic Index', value: '35 (Ultra-Low)', hint: 'Steadily fuels metabolic satiety' },
        { label: 'Magnesium : Sodium', value: '18 : 1', hint: 'Exceptional ratio for blood pressure health' },
        { label: 'Kaempferol Bioflavonoids', value: 'High', hint: 'Cellular anti-inflammatory antioxidant' },
      ],
    },
    theProtocol: {
      heading: 'The A2 Desi Ghee Cast-Iron Roasting Ritual',
      steps: [
        {
          stepNumber: '01',
          stepTitle: 'The Pre-Roast Aeration',
          instruction: 'Spread 100g of Jumbo 7-Suta Makhana on a parchment tray. Allow them to air-dry for 10 minutes at ambient warmth to ensure zero retained humidity in the internal cellular honeycomb.',
        },
        {
          stepNumber: '02',
          stepTitle: 'Heavy Cast Iron Vessel',
          instruction: 'Warm a seasoned heavy cast-iron skillet over low flame. Add 1 tablespoon of pure A2 Desi Cow Ghee. Swirl until the ghee coats the pan with a golden shimmer.',
        },
        {
          stepNumber: '03',
          stepTitle: 'The Low-Flame Toss',
          instruction: 'Add the Makhana and toss continuously for 6 to 8 minutes on low flame. Listen for the gentle audible rustle changing from soft muffled thuds to crisp porcelain clicks.',
        },
        {
          stepNumber: '04',
          stepTitle: 'Pink Himalayan Finishing Salt',
          instruction: 'Turn off the heat. Immediately dust with hand-crushed Himalayan pink rock salt and freshly cracked Malabar black peppercorns while the residual ghee bonds the spices to each kernel.',
        },
      ],
      connoisseurTip:
        'Crispness Test: Take a roasted makhana and press between thumb and forefinger. It should shatter cleanly into powdery crisp crystals without rubbery chewiness.',
    },
    products: [
      {
        id: 'mkh-001',
        slug: 'makhana-grade-a-fox-nuts',
        name: 'Makhana Grade A (Fox Nuts)',
        image: '/images/makhana-pouch-250g.webp',
        tag: '7-Suta Jumbo · North Bihar Oxbow Lakes',
        variants: [
          { label: '250g', retailPrice: 551, mrp: 650 },
          { label: '500g', retailPrice: 1092, mrp: 1289 },
          { label: '1 kg', retailPrice: 2100, mrp: 2478 },
        ],
      },
    ],
  },
  {
    id: 'silk-route-culinary-pairings',
    volume: 'Monograph No. 05 · Imperial Banquets',
    title: 'The Silk Route Symphony: Zereshk Barberries, Emerald Pista Slivers & Kandahari Mala Anjeer',
    subtitle: 'The Persian-Kashmiri court gastronomy: balancing sour wild mountain berries, unctuous nuts, and sun-stringed wreath figs.',
    category: 'Culinary Heritage & Connoisseur Pairings',
    categorySlug: 'pairings',
    readTime: '5 min read',
    labCertification: 'Authentic Silk Route Terroir Curations',
    heroImage: '/images/pista-slivers-macro.jpg',
    summary:
      'How historical trade caravans crossing the Khyber Pass created the sensory balance of the Kashmiri Wazwan: contrasting tart wild mountain barberries with sweet sun-cured figs and emerald pistachios.',
    leadQuote:
      '“A banquet without acidic contrast is a monotonous burden on the palate. The master chefs of Kashmir use the tart ruby snap of Zereshk barberries and the emerald richness of Peshawari pistachios to turn rice and slow-braised meats into poetry.”',
    botanicalScience: {
      heading: 'The Science of Sour-Sweet-Fat Harmony in High Altitude Cuisine',
      paragraphs: [
        'The classical gastronomy of the Silk Route was engineered around gastro-intestinal vitality. In cold mountain winter climates, heavy protein and fat preparations—such as Rogan Josh, Gushtaba, and saffron-scented pilafs—demand acidic balancing agents to stimulate saliva and digestive enzyme secretions.',
        'Wild Iranian Barberries (Berberis vulgaris, known as Pofaki Zereshk) provide natural malic, citric, and tartaric acids, alongside the powerful antimicrobial alkaloid berberine. When flash-sautéed in clarified butter with emerald slivered pistachios and studded over basmati rice, the tart ruby jewels cut through rich animal fats with vibrant elegance.',
        'To complete the meal, Afghan Kandahari Mala Anjeer—sun-cured figs strung on natural cotton twine wreaths—offer soluble pectin fibers and crunchy seed texture that cleanse the palate while assisting glycemic regulation.',
      ],
      keyMetrics: [
        { label: 'Organic Acid Profile', value: 'High Malic & Tartaric', hint: 'Natural digestive stimulant in Zereshk' },
        { label: 'Pistachio Chlorophyll', value: '100% Natural', hint: 'Unblemished emerald slivers without green dye' },
        { label: 'Fig Curing Method', value: 'Sun-Drying on String', hint: 'Kandahar cotton string wreath sun-cure' },
        { label: 'Culinary Pairings', value: 'Wazwan, Shufta, Kehwa', hint: 'Imperial Persian-Kashmiri banquet classics' },
      ],
    },
    theProtocol: {
      heading: 'The Royal Shufta & Kehwa Assembly',
      steps: [
        {
          stepNumber: '01',
          stepTitle: 'The Shufta Foundation',
          instruction: 'Rehydrate dried cottage cheese cubes and quartered Kandahari Mala Anjeer in warm rosewater for 15 minutes until plump and tender.',
        },
        {
          stepNumber: '02',
          stepTitle: 'Ghee Infusion & Spices',
          instruction: 'Warm ghee with crushed green cardamom pods, dry ginger powder (sonth), and black pepper. Add Kagzi walnut halves, Mamra almonds, and plump golden sultanas.',
        },
        {
          stepNumber: '03',
          stepTitle: 'The Emerald Finishing Touch',
          instruction: 'Right before serving, shower the steaming dish with Green Peeled Pista Slivers and flash-sautéed ruby Zereshk barberries. The temperature contrast preserves the vibrant green chlorophyll.',
        },
      ],
      connoisseurTip:
        'Pairing Suggestion: Serve alongside piping hot brass samovar Kehwa infused with saffron stigmas and crushed cardamom for the ultimate winter banquet finish.',
    },
    products: [
      {
        id: 'pst-003',
        slug: 'green-peeled-pista-slivers',
        name: 'Green Peeled Pista Slivers',
        image: '/images/pista-slivers-pouch-250g.webp',
        tag: 'Peshawari Green · Emerald Grade',
        variants: [
          { label: '250g', retailPrice: 1011, mrp: 1193 },
          { label: '500g', retailPrice: 2002, mrp: 2362 },
          { label: '1 kg', retailPrice: 3850, mrp: 4543 },
        ],
      },
      {
        id: 'ber-001',
        slug: 'iranian-ruby-barberries-zereshk',
        name: 'Iranian Ruby Wild Barberries (Zereshk)',
        image: '/images/barberries-pouch-250g.webp',
        tag: 'Tart Ruby Jewels · Silk Route',
        variants: [
          { label: '250g', retailPrice: 381, mrp: 449 },
          { label: '500g', retailPrice: 754, mrp: 890 },
          { label: '1 kg', retailPrice: 1450, mrp: 1711 },
        ],
      },
      {
        id: 'anj-003',
        slug: 'afghan-kandahari-mala-anjeer',
        name: 'Afghan Kandahari Mala Anjeer',
        image: '/images/anjeer-mala-pouch-250g.webp',
        tag: 'Cotton-Wreath String Figs',
        variants: [
          { label: '250g', retailPrice: 643, mrp: 759 },
          { label: '500g', retailPrice: 1274, mrp: 1503 },
          { label: '1 kg', retailPrice: 2450, mrp: 2891 },
        ],
      },
    ],
  },
]

export default function GastronomyJournalClient() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedArticleId, setExpandedArticleId] = useState<string>('mamra-enzymatic-awakening')
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({})
  const [addedItemKey, setAddedItemKey] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Saffron Blooming Simulator State
  const [saffronLiquid, setSaffronLiquid] = useState<'water' | 'milk' | 'kehwa' | 'ice'>('ice')
  const [saffronThreads, setSaffronThreads] = useState<number>(6)
  const [simulatedMinutes, setSimulatedMinutes] = useState<number>(18)

  // Mamra Soaking Helper State
  const [mamraCount, setMamraCount] = useState<number>(7)

  const filteredArticles =
    activeCategory === 'all'
      ? ARTICLES
      : ARTICLES.filter((a) => a.categorySlug === activeCategory)

  const handleSelectVariant = (productId: string, variantIndex: number) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }))
  }

  const handleAddToCart = (product: JournalArticle['products'][0]) => {
    try {
      const variantIdx = selectedVariants[product.id] || 0
      const currentVariant = product.variants[variantIdx] || product.variants[0]
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const item = {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        mode: 'retail',
        sizeLabel: currentVariant.label,
        unitPrice: currentVariant.retailPrice,
        quantity: 1,
        totalPrice: currentVariant.retailPrice,
        image: product.image,
      }
      existing.push(item)
      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))

      const itemKey = `${product.id}-${currentVariant.label}`
      setAddedItemKey(itemKey)
      setTimeout(() => setAddedItemKey(null), 2500)
    } catch {
      // Fallback
    }
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B]">
      {/* ── 1. Masthead & Editorial Header ── */}
      <section className="border-b border-[#EAE3D5] bg-[#FAF5ED]/60 pt-28 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17233B]/5 border border-[#17233B]/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#704B32]">
            <span>📖</span> Nuty Tales Himalayan Terroir Archives
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#17233B] leading-[1.08]">
            The Gastronomy Journal
          </h1>

          <p className="font-serif italic text-lg sm:text-2xl text-[#8C7E70] max-w-3xl mx-auto font-normal">
            Botanical science, bioactive lipid profiles, and ancient culinary rituals from the high valleys of Kashmir and the Silk Route.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-[#8C7E70] font-mono">
            <span>Volume IV · Year 2026</span>
            <span>•</span>
            <span>Central FSSAI: 22724441000048</span>
            <span>•</span>
            <span>Himalayan Single-Origin Verified</span>
            <span>•</span>
            <button
              onClick={handleCopyLink}
              className="text-[#17233B] hover:text-[#C9A45C] underline underline-offset-4 font-sans font-semibold transition"
            >
              {copiedLink ? '✓ Link Copied' : 'Share Journal'}
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. Editorial Filter Nav ── */}
      <section className="sticky top-20 z-30 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE3D5] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 flex-nowrap">
            {[
              { id: 'all', label: 'All Monographs' },
              { id: 'rituals', label: 'Morning Rituals & Lipids' },
              { id: 'saffron', label: 'Saffron Chemistry' },
              { id: 'terroir', label: 'Walnut Pellicle & Terroir' },
              { id: 'ancient', label: 'Mithila Makhana Ethnobotany' },
              { id: 'pairings', label: 'Silk Route Pairings & Wazwan' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#17233B] text-white shadow-xs'
                    : 'bg-white text-[#704B32] hover:bg-stone-100 border border-[#EAE3D5]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-[#17233B] hover:text-[#C9A45C] transition uppercase tracking-wider whitespace-nowrap"
          >
            <span>Explore All Gourmet Harvest</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* ── 3. Interactive Saffron & Bioactive Connoisseur Labs (Top Bar Feature) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lab 1: Saffron Crocin Bloom Kinetics Simulator */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-2xs space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8934A]">
                  Interactive Micro-Lab · Spectrophotometry
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
                  Saffron Crocin Blooming Simulator
                </h3>
              </div>
              <span className="text-2xl">✨</span>
            </div>

            <p className="text-xs text-[#7A6D5E] leading-relaxed">
              Experience why authentic Grade-1 Pampore Mongra takes 20 minutes to reach its peak imperial sunset hue, rather than bleeding synthetic color instantly.
            </p>

            {/* Preparation Liquid Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7E70] block">
                Infusion Medium
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'ice', label: '🧊 Ice Shock (Royal)' },
                  { id: 'water', label: '💧 Spring Water (22°C)' },
                  { id: 'milk', label: '🥛 Warm A2 Milk (45°C)' },
                  { id: 'kehwa', label: '🍵 Kashmiri Kehwa' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSaffronLiquid(item.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition text-center ${
                      saffronLiquid === item.id
                        ? 'bg-[#17233B] text-white shadow-xs'
                        : 'bg-[#FAF5ED] text-[#704B32] hover:bg-stone-200 border border-[#EAE3D5]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thread Count & Time Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8C7E70] font-medium">Stigma Threads:</span>
                  <span className="font-mono font-bold text-[#17233B]">{saffronThreads} threads</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="14"
                  value={saffronThreads}
                  onChange={(e) => setSaffronThreads(Number(e.target.value))}
                  className="w-full accent-[#B8934A]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8C7E70] font-medium">Steeping Duration:</span>
                  <span className="font-mono font-bold text-[#17233B]">{simulatedMinutes} minutes</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={simulatedMinutes}
                  onChange={(e) => setSimulatedMinutes(Number(e.target.value))}
                  className="w-full accent-[#B8934A]"
                />
              </div>
            </div>

            {/* Visual Bloom Gauge */}
            <div className="p-4 rounded-2xl bg-[#FAF5ED] border border-[#EAE3D5] flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex-shrink-0 border-2 border-white shadow-inner flex items-center justify-center transition-colors duration-500"
                style={{
                  backgroundColor:
                    simulatedMinutes < 5
                      ? '#FEF3C7'
                      : simulatedMinutes < 12
                      ? '#FBBF24'
                      : simulatedMinutes < 20
                      ? '#F59E0B'
                      : '#D97706',
                }}
              >
                <span className="text-sm font-bold text-[#17233B]">
                  {Math.min(100, Math.round((simulatedMinutes / 20) * 100))}%
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-semibold text-[#17233B]">
                  {simulatedMinutes < 5 && 'Phase 1: Pale Tendril Diffusion (Delicate golden streamers)'}
                  {simulatedMinutes >= 5 && simulatedMinutes < 12 && 'Phase 2: Carotenoid Dissolution (Crocin active dispersion)'}
                  {simulatedMinutes >= 12 && simulatedMinutes < 20 && 'Phase 3: Deep Sunset Amber (Peak optical density & Safranal release)'}
                  {simulatedMinutes >= 20 && 'Phase 4: Imperial Royal Extraction (Maximum bio-availability attained)'}
                </p>
                <p className="text-[#8C7E70]">
                  Crocin Index reading: ~{(simulatedMinutes * 8.5 + saffronThreads * 12).toFixed(0)} units. Authentic Mongra stigmas remain completely intact.
                </p>
              </div>
            </div>
          </div>

          {/* Lab 2: Mamra Soaking & Activation Helper */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-2xs space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8934A]">
                  Interactive Micro-Lab · Enzymatic Phytase
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
                  Mamra Dawn Soaking Calculator
                </h3>
              </div>
              <span className="text-2xl">🌱</span>
            </div>

            <p className="text-xs text-[#7A6D5E] leading-relaxed">
              Calculate your personal morning ration of wild mountain seedling Mamra badam, water volume, and unlocked lipid bio-availability.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#8C7E70] font-medium">Daily Connoisseur Kernels:</span>
                <span className="font-mono font-bold text-[#17233B]">{mamraCount} Kernels (~{(mamraCount * 1.1).toFixed(1)}g)</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                value={mamraCount}
                onChange={(e) => setMamraCount(Number(e.target.value))}
                className="w-full accent-[#B8934A]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-[#FAF5ED] rounded-2xl border border-[#EAE3D5]">
                <span className="text-[10px] text-[#8C7E70] uppercase font-bold block">Water Volume</span>
                <span className="font-mono text-base font-bold text-[#17233B]">{mamraCount * 15} ml</span>
                <span className="text-[9px] text-[#8C7E70]">Glass / terracotta</span>
              </div>

              <div className="p-3 bg-[#FAF5ED] rounded-2xl border border-[#EAE3D5]">
                <span className="text-[10px] text-[#8C7E70] uppercase font-bold block">Soak Duration</span>
                <span className="font-mono text-base font-bold text-[#17233B]">8 Hours</span>
                <span className="text-[9px] text-[#8C7E70]">Overnight at 18°C</span>
              </div>

              <div className="p-3 bg-[#FAF5ED] rounded-2xl border border-[#EAE3D5]">
                <span className="text-[10px] text-[#8C7E70] uppercase font-bold block">Lipid Yield</span>
                <span className="font-mono text-base font-bold text-emerald-800">
                  +310%
                </span>
                <span className="text-[9px] text-[#8C7E70]">Enzyme access</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-[#5C4F41] flex items-center gap-3">
              <span className="text-lg">🍯</span>
              <p className="leading-snug">
                <strong>Synergy Pairing:</strong> Combine with 1 tsp raw Kashmiri Acacia Honey. The non-crystallizing levulose prevents morning glycemic spikes while assisting cellular absorption of oleic acid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Main Monographs Catalog ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {filteredArticles.map((article, idx) => {
          const isExpanded = expandedArticleId === article.id

          return (
            <article
              key={article.id}
              id={article.id}
              className="bg-white rounded-3xl border border-[#EAE3D5] overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300"
            >
              {/* Article Hero Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#EAE3D5]">
                {/* Visual Image Canvas (5 cols) */}
                <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full bg-stone-100">
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    priority={idx === 0}
                    quality={80}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                  <div className="absolute bottom-4 left-4 right-4 lg:hidden text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Editorial Monograph Details (7 cols) */}
                <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#B8934A]">
                        {article.volume}
                      </span>
                      <span className="text-[#8C7E70] font-mono">
                        {article.readTime} • {article.labCertification}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#17233B] leading-tight">
                      {article.title}
                    </h2>

                    <p className="text-sm sm:text-base text-[#7A6D5E] font-light leading-relaxed">
                      {article.subtitle}
                    </p>

                    <blockquote className="border-l-2 border-[#B8934A] pl-4 italic text-sm text-[#5C4F41] bg-[#FAF5ED]/50 py-2 rounded-r-xl">
                      {article.leadQuote}
                    </blockquote>
                  </div>

                  <div className="pt-4 border-t border-[#F0EBE1] flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={() => setExpandedArticleId(isExpanded ? '' : article.id)}
                      className="px-6 py-2.5 rounded-full bg-[#17233B] hover:bg-[#203050] text-white text-xs font-semibold uppercase tracking-wider transition shadow-2xs"
                    >
                      {isExpanded ? 'Collapse Monograph ▴' : 'Read Full Scientific Monograph ▾'}
                    </button>

                    <div className="flex items-center gap-2 text-xs text-[#8C7E70]">
                      <span>Terroir: High Himalayas</span>
                      <span>•</span>
                      <span className="text-emerald-800 font-semibold">100% Single-Tree Traceable</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Deep Scientific Monograph & Protocol */}
              {isExpanded && (
                <div className="p-6 sm:p-10 space-y-12 bg-[#FAF5ED]/30 animate-in fade-in duration-300">
                  {/* Botanical Science & Metrics */}
                  <div className="space-y-6">
                    <div className="border-b border-[#EAE3D5] pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8934A]">
                        Section I · Phytochemical Analysis
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                        {article.botanicalScience.heading}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#5C4F41] leading-relaxed font-light">
                      <div className="space-y-4">
                        <p>{article.botanicalScience.paragraphs[0]}</p>
                        {article.botanicalScience.paragraphs[1] && (
                          <p>{article.botanicalScience.paragraphs[1]}</p>
                        )}
                      </div>
                      <div className="space-y-4">
                        {article.botanicalScience.paragraphs[2] && (
                          <p>{article.botanicalScience.paragraphs[2]}</p>
                        )}
                        {article.botanicalScience.paragraphs[3] && (
                          <p>{article.botanicalScience.paragraphs[3]}</p>
                        )}
                      </div>
                    </div>

                    {/* Scientific Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                      {article.botanicalScience.keyMetrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="bg-white p-4 rounded-2xl border border-[#EAE3D5] space-y-1"
                        >
                          <span className="text-[10px] text-[#8C7E70] uppercase font-bold block">
                            {metric.label}
                          </span>
                          <span className="font-mono text-xl font-bold text-[#17233B] block">
                            {metric.value}
                          </span>
                          <span className="text-[10px] text-[#8C7E70] block leading-tight">
                            {metric.hint}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* The Culinary / Medicinal Protocol */}
                  <div className="space-y-6">
                    <div className="border-b border-[#EAE3D5] pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8934A]">
                        Section II · The Connoisseur Ritual
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                        {article.theProtocol.heading}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {article.theProtocol.steps.map((st) => (
                        <div
                          key={st.stepNumber}
                          className="bg-white p-5 rounded-2xl border border-[#EAE3D5] space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <span className="font-mono text-sm font-bold text-[#B8934A]">
                              {st.stepNumber}
                            </span>
                            <h4 className="font-serif text-base font-bold text-[#17233B]">
                              {st.stepTitle}
                            </h4>
                            <p className="text-xs text-[#5C4F41] leading-relaxed font-light">
                              {st.instruction}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-[#17233B] text-white text-xs flex items-center gap-3">
                      <span className="text-lg">💡</span>
                      <p className="leading-relaxed">
                        {article.theProtocol.connoisseurTip}
                      </p>
                    </div>
                  </div>

                  {/* Harvest Used in this Ritual (Direct Commerce Integration) */}
                  <div className="space-y-6 pt-4 border-t border-[#EAE3D5]">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8934A]">
                          Section III · Sourced Harvest
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                          Gourmet Harvest Used in this Ritual
                        </h3>
                      </div>
                      <span className="text-xs text-[#8C7E70]">
                        Packed in airtight nitrogen-flushed standing pouches
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {article.products.map((prod) => {
                        const variantIdx = selectedVariants[prod.id] || 0
                        const currentVariant = prod.variants[variantIdx] || prod.variants[0]
                        const isAdded = addedItemKey === `${prod.id}-${currentVariant.label}`

                        return (
                          <div
                            key={prod.id}
                            className="bg-white rounded-2xl border border-[#EAE3D5] p-5 space-y-4 flex flex-col justify-between hover:border-[#B8934A] transition-colors"
                          >
                            <div className="space-y-3">
                              <div className="relative h-44 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 flex items-center justify-center">
                                <Image
                                  src={prod.image}
                                  alt={prod.name}
                                  fill
                                  sizes="(max-width: 640px) 100vw, 30vw"
                                  className="object-contain p-2"
                                />
                                <span className="absolute top-2.5 left-2.5 text-[9px] bg-[#17233B]/85 text-white uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full">
                                  {prod.tag}
                                </span>
                              </div>

                              <Link
                                href={`/shop/${prod.slug}`}
                                className="font-serif text-lg font-bold text-[#17233B] hover:text-[#B8934A] transition-colors block line-clamp-1"
                              >
                                {prod.name}
                              </Link>

                              {/* Pack Size Segmented Toggle */}
                              <div className="flex rounded-full bg-[#FAF5ED] p-1 border border-[#EAE3D5]">
                                {prod.variants.map((v, vIndex) => (
                                  <button
                                    key={v.label}
                                    type="button"
                                    onClick={() => handleSelectVariant(prod.id, vIndex)}
                                    className={`flex-1 py-1 text-xs font-semibold rounded-full transition-all text-center ${
                                      variantIdx === vIndex
                                        ? 'bg-[#17233B] text-white shadow-2xs'
                                        : 'text-[#704B32] hover:text-[#17233B]'
                                    }`}
                                  >
                                    {v.label}
                                  </button>
                                ))}
                              </div>

                              {/* Price */}
                              <div className="flex items-baseline justify-between pt-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-serif text-xl font-bold text-[#17233B]">
                                    {formatGlobalPrice(currentVariant.retailPrice)}
                                  </span>
                                  {currentVariant.mrp && currentVariant.mrp > currentVariant.retailPrice && (
                                    <span className="text-xs text-stone-400 line-through">
                                      {formatGlobalPrice(currentVariant.mrp)}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-emerald-800 font-semibold uppercase">
                                  ✓ In Stock
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 pt-2">
                              <button
                                type="button"
                                onClick={() => handleAddToCart(prod)}
                                className={`w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-1.5 ${
                                  isAdded
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-[#17233B] hover:bg-[#203050] text-white'
                                }`}
                              >
                                <span>{isAdded ? '✓ Added to Basket' : 'Add Harvest to Basket'}</span>
                              </button>

                              <Link
                                href={`/shop/${prod.slug}`}
                                className="block text-center text-[11px] text-[#8C7E70] hover:text-[#17233B] underline underline-offset-2"
                              >
                                View Detailed Terroir &amp; Specs →
                              </Link>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </section>

      {/* ── 5. Editorial Footer & Connoisseur Guild Invitation ── */}
      <section className="bg-[#FAF5ED] border-t border-[#EAE3D5] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8934A]">
            The Himalayan Terroir Charter
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Preserving Single-Origin Himalayan Heritage
          </h2>

          <p className="text-sm sm:text-base text-[#7A6D5E] font-light leading-relaxed max-w-2xl mx-auto">
            Every harvest documented in this journal is procured directly from family-tended mountain orchards and aquatic wetlands, tested by NABL-accredited laboratories, and shipped in nitrogen-flushed barrier pouches.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-[#17233B] hover:bg-[#203050] text-white rounded-full text-xs font-semibold uppercase tracking-widest shadow-sm transition"
            >
              Shop All Harvest Collections
            </Link>
            <Link
              href="/explore"
              className="px-8 py-3.5 bg-white hover:bg-stone-100 text-[#17233B] border border-[#EAE3D5] rounded-full text-xs font-semibold uppercase tracking-widest transition"
            >
              Discover Terroir Map
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
