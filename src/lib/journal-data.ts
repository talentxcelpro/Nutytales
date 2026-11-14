// Gastronomy Journal Master Data & Botanical Science Monographs
// High-authority editorial archives for Himalayan terroir, clinical lipids, and culinary protocols.

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

export const JOURNAL_ARTICLES: JournalArticle[] = [
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

export function getJournalArticleById(id: string): JournalArticle | undefined {
  return JOURNAL_ARTICLES.find((a) => a.id === id)
}

export function getAllJournalSlugs(): string[] {
  return JOURNAL_ARTICLES.map((a) => a.id)
}
