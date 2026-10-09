import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { WEDDING_CURATIONS } from '@/lib/weddings-data';
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants';
import { generatePageMetadata, buildBreadcrumbSchema, schemaToJsonLd } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  business: 'weddings',
  pageType: 'occasion',
  intentType: 'transactional',
  slug: '/wedding-return-gifts',
  primaryKeyword: 'Wedding Return Gifts',
  title: 'Wedding Return Gifts & Favours | Dry Fruit Hampers | Nuty Tales',
  description: 'Bespoke wedding return gifts, shaadi favours, and hotel room hampers with couple monogramming, Kashmiri dry fruits, and Pan-India delivery. MOQ: 25 hampers.',
});

export default function WeddingReturnGiftsPage() {
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '');

  const breadcrumbs = [
    { name: 'Home', url: 'https://weddings.nutytales.com' },
    { name: 'Wedding Return Gifts', url: 'https://weddings.nutytales.com/wedding-return-gifts' },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32 text-[#17233B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#176B68]">Home</Link>
          <span>/</span>
          <Link href="/weddings" className="hover:text-[#176B68]">Weddings</Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">Wedding Return Gifts</span>
        </nav>

        <div className="space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            👑 BESPOKE WEDDING FAVOURS &amp; MONOGRAMMED TROUSSEAU
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17233B] font-serif leading-tight">
            Wedding Return Gifts &amp; Favours
          </h1>
          <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
            Grace your wedding guests with royal tokens of gratitude. Luxury rigid presentation boxes, Kashmiri walnut wood chests, and velvet potlis customized with your wedding date and couple monogram.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WEDDING_CURATIONS.map((cur) => (
            <div
              key={cur.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] w-full bg-stone-100">
                  <Image src={cur.image} alt={cur.name} fill className="object-cover" />
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                    {cur.subtitle}
                  </span>
                  <h2 className="font-serif font-bold text-base text-[#17233B] line-clamp-1">{cur.name}</h2>
                  <p className="text-xs font-bold text-[#176B68]">
                    From ₹{cur.price.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] text-stone-400 font-normal">/ hamper</span>
                  </p>
                  <ul className="text-[11px] text-stone-600 space-y-1 pt-2 border-t border-stone-100">
                    {cur.contents.map((item, idx) => (
                      <li key={idx} className="truncate">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nuty Tales! 💍 Please share sample box availability for "${cur.name}" (₹${cur.price}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Order / Inquire Sample
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Conversion Action */}
        <div className="bg-gradient-to-r from-[#17233B] to-[#176B68] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold">Request Complimentary Tasting &amp; Sample Box</h2>
            <p className="text-xs text-stone-200">
              Delivered directly to your home with finished packaging samples and pure single-origin nuts.
            </p>
          </div>
          <Link
            href="/weddings#hamper-builder"
            className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors"
          >
            Design Wedding Hamper ↓
          </Link>
        </div>
      </div>
    </div>
  );
}
