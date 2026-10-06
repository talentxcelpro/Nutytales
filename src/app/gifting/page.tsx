import Image from 'next/image'
import Link from 'next/link'

const GIFTING_VERTICALS = [
  {
    title: 'Weddings by Nutty Tales',
    subtitle: 'Bespoke Trousseau & Favours',
    desc: 'Custom monogrammed rigid boxes, couple name foil printing, and scheduled multi-address delivery across hotels and residences in India.',
    link: '/weddings',
    cta: 'Plan Wedding Gifts →',
    image: '/images/crafts-gifting-box.jpg',
    badge: 'PAN-INDIA WEDDING DELIVERY',
  },
  {
    title: 'Corporate Diwali Gifting',
    subtitle: 'Festive Client & Employee Hampers',
    desc: 'Luxury dry-fruit boxes with company logo embossing, customized greeting cards, GST invoices, and door-to-door pan-India delivery.',
    link: '/corporate-gifting',
    cta: 'Explore Corporate Gifting →',
    image: '/images/corporate-diwali-gifting.jpg',
    badge: 'MULTI-CITY CORPORATE DELIVERY',
  },
  {
    title: 'Kashmir Heritage Keepsake Boxes',
    subtitle: 'Heirloom Crafts & Saffron',
    desc: 'Handcrafted papier-mâché and carved walnut wood boxes paired with pure Pampore saffron, single-origin walnuts, and raw acacia honey.',
    link: '/crafts',
    cta: 'Discover Heritage Hampers →',
    image: '/images/luxury-hamper-jars.png',
    badge: 'GI AUTHENTICITY CERTIFIED',
  },
  {
    title: 'Custom Packaging Studio',
    subtitle: 'Your Gift. Your Story. Your Packaging.',
    desc: 'Pantone-matched sleeves, wax seals, QR video messages, custom ribbon printing, and digital wedding invite color extraction.',
    link: '/weddings#hamper-builder',
    cta: 'Design Your Packaging →',
    image: '/images/luxury-teal-gift-box.jpg',
    badge: 'BESPOKE BRANDING',
  },
]

export default function GiftingPage() {
  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4">
          <nav className="text-xs text-[#704B32] flex items-center gap-2">
            <Link href="/" className="hover:text-[#176B68]">Home</Link>
            <span>/</span>
            <span className="text-[#17233B] font-semibold">Gifting by Nutty Tales</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#17233B]/10 pb-8">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-bold block">
                Gifts for Every Story
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#17233B]">
                Gifting, Made Memorable.
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Whether celebrating a grand Indian wedding, rewarding corporate teams for Diwali 2026,
                or honoring relationships with authentic Kashmiri heirlooms — Nutty Tales designs,
                custom-packages, and delivers across India.
              </p>
            </div>

            <Link
              href="/weddings"
              className="px-6 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex-shrink-0"
            >
              💍 Plan Wedding Gifting →
            </Link>
          </div>
        </div>

        {/* Categories Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GIFTING_VERTICALS.map((g, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-[#17233B]/10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={g.image}
                    alt={g.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#17233B]/90 backdrop-blur-sm text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {g.badge}
                  </div>
                </div>

                <div className="p-8 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                    {g.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#17233B]">{g.title}</h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed pt-1">{g.desc}</p>
                </div>
              </div>

              <div className="p-8 pt-0">
                <Link
                  href={g.link}
                  className="inline-flex items-center gap-2 py-3 px-6 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  {g.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
