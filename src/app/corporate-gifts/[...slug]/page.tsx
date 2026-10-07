import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generatePageMetadata, buildBreadcrumbSchema, schemaToJsonLd } from '@/lib/seo/metadata';
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const GIFT_PAGES: Record<string, {
  name: string;
  tagline: string;
  desc: string;
  priceFrom: number;
  currency: string;
  moq: number;
  boxOptions: string[];
  nutsIncluded: string[];
}> = {
  'diwali': {
    name: 'Diwali Corporate Gift Hampers',
    tagline: 'Festive gold-foiled presentation boxes with premium dry fruits & pure saffron.',
    desc: 'Celebrate Diwali with your team, executive clients, and partners. Handcrafted luxury boxes featuring California Almonds, Jumbo Cashews, Afghan Green Raisins, and Pampore Saffron with custom logo branding.',
    priceFrom: 850,
    currency: 'INR',
    moq: 25,
    boxOptions: ['Velvet Rigid Box with Gold Foil Monogram', 'Handcrafted Walnut Wood Chest', 'Contemporary Sliding Sleeve Tin'],
    nutsIncluded: ['California Almonds (200g)', 'W240 Jumbo Cashews (200g)', 'Afghan Green Raisins (200g)', 'Pure Pampore Mongra Saffron (1g)'],
  },
  'diwali/dubai': {
    name: 'Corporate Diwali Gifts Dubai & UAE Delivery',
    tagline: 'Turnkey PAN-Emirates corporate gifting with GCC customs clearance & express dispatch.',
    desc: 'Deliver auspicious Diwali wishes to corporate partners, clients, and staff across Dubai, Abu Dhabi, and Sharjah. Single-origin Kashmiri nuts and dates packaged to perfection.',
    priceFrom: 75,
    currency: 'AED',
    moq: 50,
    boxOptions: ['Dubai Gold Foil Gift Chest', 'Laser-Cut Islamic Geometric Box', 'Hermetic Glass Jar Set'],
    nutsIncluded: ['Jumbo Roasted Cashews', 'California Almonds', 'Medjool Dates', 'Iranian Pistachios'],
  },
  'diwali/mumbai': {
    name: 'Diwali Corporate Gifts Mumbai',
    tagline: 'Rapid corporate delivery to BKC, Nariman Point, Lower Parel, and Andheri corporate parks.',
    desc: 'Mumbai executive gifting desk with same-week bulk dispatch, customized greeting sleeves, and company logo foil stamping.',
    priceFrom: 850,
    currency: 'INR',
    moq: 25,
    boxOptions: ['Royal Blue & Gold Rigid Box', 'Artisan Brass Platter Curation', 'Eco Kraft Minimal Box'],
    nutsIncluded: ['Mamra Almonds', 'W240 Cashews', 'Afghan Raisins', 'Roasted Peri-Peri Makhana'],
  },
  'employee-gifts': {
    name: 'Employee Welcome & Recognition Gift Hampers',
    tagline: 'Thoughtful onboarding and milestone recognition kits with healthy gourmet superfoods.',
    desc: 'Welcome new hires or recognize years of dedication with wholesome dry fruit snack boxes, personalized welcome letters, and company-branded swag.',
    priceFrom: 550,
    currency: 'INR',
    moq: 15,
    boxOptions: ['Modern Magnetic Closure Box', 'Canvas Drawstring Potli Duo', 'Desk Snack Jar Carousel'],
    nutsIncluded: ['Roasted Salted Almonds', 'Fox Nuts (Phool Makhana)', 'Trail Mix with Cranberries', 'Chia Seed Power Crunch'],
  },
  'client-gifts': {
    name: 'Executive & VIP Client Corporate Hampers',
    tagline: 'Ultra-luxury heritage curation for board members, key accounts, and HNW relationships.',
    desc: 'Leave an indelible impression with single-origin Kagzi Walnuts, Medjool dates, pure Acacia honey, and Changthangi Cashmere stoles presented in walnut chests.',
    priceFrom: 2200,
    currency: 'INR',
    moq: 5,
    boxOptions: ['Hand-Carved Kashmir Walnut Wood Chest', 'Laser-Engraved Brass Thali Presentation', 'Leatherette Executive Trunk'],
    nutsIncluded: ['Single-Origin Kashmiri Walnuts', 'Imperial Medjool Dates', 'Pure Kashmiri Acacia Honey (250g)', 'Pampore Mongra Saffron (2g)'],
  },
};

export async function generateStaticParams() {
  return [
    { slug: ['diwali'] },
    { slug: ['diwali', 'dubai'] },
    { slug: ['diwali', 'mumbai'] },
    { slug: ['employee-gifts'] },
    { slug: ['client-gifts'] },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pathKey = slug.join('/');
  const item = GIFT_PAGES[pathKey];

  if (!item) return { title: 'Corporate Gifts | Nutty Tales' };

  return generatePageMetadata({
    business: 'gifting',
    pageType: 'occasion',
    intentType: 'transactional',
    slug: `/corporate-gifts/${pathKey}`,
    primaryKeyword: item.name,
    title: `${item.name} | Nutty Tales Gifting`,
    description: `${item.desc} From ${item.currency} ${item.priceFrom}. MOQ: ${item.moq} boxes.`,
    priceFrom: item.priceFrom,
    currency: item.currency,
  });
}

export default async function CorporateGiftDetail({ params }: PageProps) {
  const { slug } = await params;
  const pathKey = slug.join('/');
  const item = GIFT_PAGES[pathKey];

  if (!item) {
    notFound();
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '');

  const breadcrumbs = [
    { name: 'Home', url: 'https://nutytales.com' },
    { name: 'Gifting', url: 'https://nutytales.com/gifting' },
    { name: 'Corporate Gifts', url: 'https://nutytales.com/corporate-gifts' },
    { name: item.name, url: `https://nutytales.com/corporate-gifts/${pathKey}` },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32 text-[#17233B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#176B68]">Home</Link>
          <span>/</span>
          <Link href="/gifting" className="hover:text-[#176B68]">Gifting</Link>
          <span>/</span>
          <Link href="/corporate-gifts" className="hover:text-[#176B68]">Corporate Gifts</Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">{item.name}</span>
        </nav>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
              🎁 MOQ: {item.moq} BOXES
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
              From {item.currency} {item.priceFrom.toLocaleString('en-IN')} / Hamper
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17233B] font-serif leading-tight">
            {item.name}
          </h1>
          <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
            {item.desc}
          </p>
        </div>

        {/* Contents & Packaging */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold font-serif text-[#17233B]">What&apos;s Inside The Hamper</h2>
            <ul className="space-y-2">
              {item.nutsIncluded.map((n, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold font-serif text-[#17233B]">Packaging &amp; Presentation</h2>
            <ul className="space-y-2">
              {item.boxOptions.map((b, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                  <span className="text-emerald-600 font-bold">▪</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Conversion Action */}
        <div className="bg-gradient-to-r from-[#17233B] to-[#176B68] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold">Request Bulk Quote &amp; Digital Mockup</h2>
            <p className="text-xs text-stone-200">
              Submit your company logo. We generate a 3D digital box render and dispatch sample hampers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gifting/designer"
              className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Design a Gift
            </Link>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                `Hello Nuty Tales! 🎁 I want to enquire about "${item.name}". Target quantity: ${item.moq}+ hampers. Please share quotation.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-white/20 shadow-md inline-flex items-center gap-1.5 transition-colors"
            >
              <span>WhatsApp Quote Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
