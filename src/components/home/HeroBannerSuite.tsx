'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SlideData {
  id: string
  tag: string
  tagColor: string
  title: string
  highlight: string
  description: string
  priceText?: string
  originalPrice?: string
  discountBadge?: string
  primaryCtaText: string
  primaryCtaAction: 'checkout' | 'link'
  primaryCtaHref?: string
  secondaryCtaText: string
  secondaryCtaHref: string
  image: string
  alt: string
  bgGradient: string
}

const SLIDES: SlideData[] = [
  {
    id: 'mamra-almonds',
    tag: 'Unpolished Superfood',
    tagColor: 'bg-amber-50 text-[#704B32] border-[#C9A45C]/40',
    title: '50%+ Natural Oil Potency',
    highlight: 'Authentic Mamra Almonds',
    description:
      'Zero chemical polishing, unbleached, and naturally packed with vital vitamin E. Handpicked from certified mountain groves for clean, daily vitality.',
    priceText: 'Premium Harvest',
    discountBadge: 'Zero Additives',
    primaryCtaText: 'Shop Mamra',
    primaryCtaAction: 'link',
    primaryCtaHref: '/shop/mamra-almonds-kashmiri-badam',
    secondaryCtaText: 'All Dry Fruits',
    secondaryCtaHref: '/shop',
    image: '/images/mamra-almonds-pouch-250g.webp',
    alt: 'Authentic High-Oil Kashmiri Mamra Almonds',
    bgGradient: 'from-[#FAF7F2] via-[#FDFBF7] to-[#F5ECE0]',
  },
  {
    id: 'makhana-special',
    tag: 'Introductory Offer',
    tagColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    title: 'Crunch That Loves You Back',
    highlight: 'Mithila Jumbo Makhana',
    description:
      '100% sun-popped 6 Suta whole lotus seeds from Mithila wetlands. Rich in plant protein, zero trans fat, and nitrogen-sealed for unmatched cloud crunch.',
    priceText: '₹899 / kg',
    originalPrice: '₹1,499',
    discountBadge: 'Save 40%',
    primaryCtaText: 'Instant Buy',
    primaryCtaAction: 'checkout',
    secondaryCtaText: 'View All Pack Sizes',
    secondaryCtaHref: '/shop/makhana-grade-a-fox-nuts',
    image: '/images/makhana-pouch-250g.webp',
    alt: 'NutyTales Premium Makhana Jumbo 6 Suta',
    bgGradient: 'from-[#FDFBF7] via-[#FAF5EB] to-[#F5ECE0]',
  },
  {
    id: 'kashmir-walnuts',
    tag: 'Budgam Orchards',
    tagColor: 'bg-stone-100 text-stone-800 border-stone-300',
    title: 'Snow-Fed Mountain Goodness',
    highlight: 'Kashmir Kagzi Walnuts',
    description:
      'Paper-thin shell you can crack with your bare hands. Extra-light, buttery walnut halves with cold-climate omega-3 fatty acids directly from valley growers.',
    priceText: '100% In-Shell Raw',
    discountBadge: 'GI Certified',
    primaryCtaText: 'Shop Walnuts',
    primaryCtaAction: 'link',
    primaryCtaHref: '/shop/kashmiri-kagzi-walnuts-in-shell',
    secondaryCtaText: 'Explore Harvest',
    secondaryCtaHref: '/shop?origin=Kashmir%2C+India',
    image: '/images/walnuts-pouch-250g.webp',
    alt: 'Kashmiri Kagzi Walnuts',
    bgGradient: 'from-[#FAF8F5] via-[#F6EFE6] to-[#EDE3D4]',
  },
  {
    id: 'pampore-saffron',
    tag: 'Grade A1 Pure Mongra',
    tagColor: 'bg-rose-50 text-rose-900 border-rose-200',
    title: 'World-Renowned Filaments',
    highlight: 'Pampore Golden Harvest',
    description:
      'Certified Kashmiri Mongra saffron stigmas with intense natural crocin aroma and deep crimson coloring. Lab-tested, chemical-free, and vacuum sealed for potency.',
    priceText: 'Lab Certified Pure',
    discountBadge: 'Highest Grade',
    primaryCtaText: 'Shop Saffron',
    primaryCtaAction: 'link',
    primaryCtaHref: '/shop/kashmir-mongra-saffron-grade-a1',
    secondaryCtaText: 'Specialty Harvest',
    secondaryCtaHref: '/shop?category=wellness-and-specialty',
    image: '/images/saffron-jar-5g.webp',
    alt: 'Pampore Mongra Saffron Grade A1',
    bgGradient: 'from-[#FFF8F8] via-[#FCF3F3] to-[#F8E7E7]',
  },
  {
    id: 'afghan-anjeer',
    tag: 'Naturally Sweet & Pure',
    tagColor: 'bg-amber-50 text-amber-900 border-amber-200',
    title: 'Ancestral Orchard Selection',
    highlight: 'Royal Afghan Anjeer',
    description:
      'Sun-dried mountain figs bursting with natural dietary fiber and zero added sugars, paired with king-sized cashews for royal everyday family snacking.',
    priceText: 'Zero Refined Sugars',
    discountBadge: 'Wild Harvest',
    primaryCtaText: 'Shop Anjeer',
    primaryCtaAction: 'link',
    primaryCtaHref: '/shop/afghan-anjeer-wild-figs',
    secondaryCtaText: 'All Dry Fruits',
    secondaryCtaHref: '/shop',
    image: '/images/anjeer-pouch-250g.webp',
    alt: 'Royal Afghan Anjeer Dried Figs',
    bgGradient: 'from-[#FAF6EE] via-[#FDFBF7] to-[#F3ECD8]',
  },
  {
    id: 'gifting-luxury',
    tag: 'Bespoke Curations',
    tagColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    title: 'Festive & Weddings',
    highlight: 'Artisanal Gift Hampers',
    description:
      'Handcrafted solid walnut wood chests, royal velvet keepsake boxes, and customizable brass jars filled with single-origin harvests. Custom corporate branding available.',
    priceText: 'Pan-India Air Delivery',
    discountBadge: 'Custom Branding',
    primaryCtaText: 'Explore Gifting',
    primaryCtaAction: 'link',
    primaryCtaHref: '/gifting',
    secondaryCtaText: 'Weddings',
    secondaryCtaHref: '/weddings',
    image: '/images/corporate-diwali-gifting.jpg',
    alt: 'Nuty Tales Artisanal Gift Hampers',
    bgGradient: 'from-[#F5FAF8] via-[#FAFDFB] to-[#E6F3EE]',
  },
]

const CATEGORY_TILES = [
  {
    title: 'Jumbo Makhana',
    subtitle: '6 Suta · ₹899/kg',
    tag: '★ 40% OFF',
    href: '/shop/makhana-grade-a-fox-nuts',
    image: '/images/makhana-pouch-250g.webp',
    bgColor: 'bg-[#FAF6EE] hover:bg-[#F5ECD8] border-amber-200/70',
  },
  {
    title: 'Kagzi Walnuts',
    subtitle: 'Thin Shell · High Oil',
    tag: 'GI Certified',
    href: '/shop/kashmiri-kagzi-walnuts-in-shell',
    image: '/images/walnuts-pouch-250g.webp',
    bgColor: 'bg-[#FAF7F2] hover:bg-[#F2EAE0] border-stone-200/70',
  },
  {
    title: 'Mamra Almonds',
    subtitle: '100% Unpolished',
    tag: 'Ancestral',
    href: '/shop/mamra-almonds-kashmiri-badam',
    image: '/images/mamra-almonds-pouch-250g.webp',
    bgColor: 'bg-[#FAF5EC] hover:bg-[#F5ECE0] border-orange-200/70',
  },
  {
    title: 'Mongra Saffron',
    subtitle: 'Pampore Crimson',
    tag: 'A1 Purity',
    href: '/shop/kashmir-mongra-saffron-grade-a1',
    image: '/images/saffron-jar-5g.webp',
    bgColor: 'bg-[#FCF5F5] hover:bg-[#F9ECEC] border-rose-200/70',
  },
  {
    title: 'Afghan Anjeer',
    subtitle: 'Sun-Dried Figs',
    tag: 'Zero Sugar',
    href: '/shop/afghan-anjeer-wild-figs',
    image: '/images/anjeer-pouch-250g.webp',
    bgColor: 'bg-[#FAF7F0] hover:bg-[#F4ECE0] border-amber-200/70',
  },
  {
    title: 'Gift Hampers',
    subtitle: 'Wedding & Corporate',
    tag: 'Bespoke',
    href: '/gifting',
    image: '/images/corporate-diwali-gifting.jpg',
    bgColor: 'bg-[#F4F9F6] hover:bg-[#EAF4EE] border-emerald-200/70',
  },
]

const SLIDE_INTERVAL_MS = 4500

export default function HeroBannerSuite() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Touch swipe support
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  // Unconditional Auto-Advance Timer (Always rotates automatically every 4.5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, SLIDE_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [currentSlide])

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    if (diff > 40) {
      goToNextSlide()
    } else if (diff < -40) {
      goToPrevSlide()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const handleInstantBuyMakhana = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const cartItem = {
        productId: 'mkh-001',
        name: 'NutyTales Premium Makhana (Jumbo 6 Suta)',
        slug: 'makhana-grade-a-fox-nuts',
        mode: 'retail',
        sizeLabel: '1 kg Best Value',
        unitPrice: 899,
        quantity: 1,
        totalPrice: 899,
        image: '/images/promo-makhana-899.webp',
      }
      existing.push(cartItem)
      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      router.push('/checkout')
    } catch {
      router.push('/checkout')
    }
  }

  const slide = SLIDES[currentSlide]

  return (
    <div className="w-full pt-16 lg:pt-20 bg-white overflow-hidden select-none">
      {/* ─── 1. Luxury Announcement Bar (Compact on mobile) ─── */}
      <div className="bg-[#0F1828] text-[#EAE5D9] h-7 sm:h-8 min-h-[28px] sm:min-h-[32px] flex items-center border-b border-[#C9A45C]/30 text-[10px] sm:text-xs tracking-wide overflow-hidden shadow-xs">
        <div className="animate-marquee items-center gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Free Pan-India Express Air Shipping</span> on Orders Over ₹999
          </span>
          <span className="text-[#C9A45C]">✦</span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-400">✨</span>
            <span>Harvest Special: Mithila Jumbo Makhana</span>
            <span className="text-[#C9A45C] font-bold">₹899 / kg ONLY</span>
            <span className="text-stone-400 line-through">₹1,499</span>
          </span>
          <span className="text-[#C9A45C]">✦</span>
          <span className="flex items-center gap-1.5">
            <span>🏷️</span> Use Code: <span className="font-mono font-bold bg-[#C9A45C] text-[#0F1828] px-1.5 py-0.2 rounded text-[10px]">NUTY10</span> for 10% Extra Off
          </span>
          <span className="text-[#C9A45C]">✦</span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">✓</span> 100% Certified Single-Origin Kashmir &amp; Mithila Harvest · FSSAI Certified
          </span>
          <span className="text-[#C9A45C]">✦</span>
          {/* Marquee loop repetition */}
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Free Pan-India Express Air Shipping</span> on Orders Over ₹999
          </span>
          <span className="text-[#C9A45C]">✦</span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-400">✨</span>
            <span>Harvest Special: Mithila Jumbo Makhana</span>
            <span className="text-[#C9A45C] font-bold">₹899 / kg ONLY</span>
          </span>
          <span className="text-[#C9A45C]">✦</span>
          <span className="flex items-center gap-1.5">
            <span>🏷️</span> Use Code: <span className="font-mono font-bold bg-[#C9A45C] text-[#0F1828] px-1.5 py-0.2 rounded text-[10px]">NUTY10</span> for 10% Extra Off
          </span>
        </div>
      </div>

      {/* ─── 2. Mobile-Native Hero Campaign Billboard ─── */}
      <section
        className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-3 pb-2.5 sm:pb-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`relative rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs bg-gradient-to-br ${slide.bgGradient} transition-colors duration-700 min-h-[200px] sm:min-h-[280px] lg:min-h-[320px] flex items-center`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-200/15 blur-3xl rounded-full pointer-events-none -z-10" />

          {/* Active Slide Body with Side-by-Side Mobile Proportions */}
          <div
            key={slide.id}
            className="w-full grid grid-cols-12 gap-2 sm:gap-6 items-center p-3 sm:p-6 lg:p-7 relative z-10 transition-opacity duration-300"
          >
            {/* Left Column: Text & Conversion Cluster (7 cols on mobile, 7 cols on lg) */}
            <div className="col-span-7 space-y-1 sm:space-y-3">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[9.5px] font-bold uppercase tracking-wider border shadow-2xs ${slide.tagColor}`}>
                  {slide.tag}
                </span>
                {slide.discountBadge && (
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#17233B] text-[#F3E5C8] text-[8px] sm:text-[9.5px] font-bold uppercase tracking-wider shadow-2xs">
                    {slide.discountBadge}
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                <p className="text-[8.5px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#8B6D3B] font-bold line-clamp-1">
                  {slide.title}
                </p>
                <h2 className="font-serif text-base sm:text-2xl lg:text-[32px] font-bold text-[#17233B] tracking-tight leading-tight line-clamp-2">
                  {slide.highlight}
                </h2>
              </div>

              <p className="text-xs sm:text-[13px] text-stone-600 line-clamp-2 leading-relaxed max-w-lg hidden sm:block">
                {slide.description}
              </p>

              {/* Price & Status Row */}
              {slide.priceText && (
                <div className="flex items-baseline gap-1.5 sm:gap-2.5 pt-0.5">
                  <span className="text-base sm:text-2xl font-extrabold text-[#17233B] font-sans">
                    {slide.priceText}
                  </span>
                  {slide.originalPrice && (
                    <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                      {slide.originalPrice}
                    </span>
                  )}
                  <span className="text-[9px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/80 hidden sm:inline">
                    ● Dispatches in 24h
                  </span>
                </div>
              )}

              {/* Action Button: Mobile Native Tap Target */}
              <div className="flex items-center gap-2 pt-0.5 sm:pt-1">
                {slide.primaryCtaAction === 'checkout' ? (
                  <button
                    type="button"
                    onClick={handleInstantBuyMakhana}
                    className="h-8 sm:h-11 px-3 sm:px-5 rounded-lg sm:rounded-xl bg-[#17233B] hover:bg-[#203050] text-[#F3E5C8] font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border border-[#C9A45C]/40 active:scale-95"
                  >
                    <span className="text-amber-400 text-xs">⚡</span>
                    <span>{slide.primaryCtaText}</span>
                    <span>→</span>
                  </button>
                ) : (
                  <Link
                    href={slide.primaryCtaHref || '/shop'}
                    className="h-8 sm:h-11 px-3 sm:px-5 rounded-lg sm:rounded-xl bg-[#17233B] hover:bg-[#203050] text-[#F3E5C8] font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border border-[#C9A45C]/40 active:scale-95"
                  >
                    <span>{slide.primaryCtaText}</span>
                    <span>→</span>
                  </Link>
                )}

                <Link
                  href={slide.secondaryCtaHref}
                  className="h-8 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-white/90 hover:bg-white text-stone-800 font-bold text-[10px] sm:text-xs uppercase tracking-wider border border-stone-300 shadow-2xs transition-all flex items-center justify-center cursor-pointer active:scale-95 hidden sm:flex"
                >
                  {slide.secondaryCtaText}
                </Link>
              </div>
            </div>

            {/* Right Column: Floating Product Standing Pouch (5 cols on mobile, 5 cols on lg) */}
            <div className="col-span-5 flex items-center justify-center">
              <div className="relative w-full aspect-square max-h-[130px] sm:max-h-[220px] lg:max-h-[250px] flex items-center justify-center">
                {/* Soft ambient back glow behind pouch */}
                <div className="absolute inset-0 bg-white/40 blur-xl rounded-full scale-90 pointer-events-none" />
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 640px) 140px, (max-width: 1024px) 240px, 300px"
                  className="object-contain p-1 sm:p-2 drop-shadow-md transition-transform duration-700 hover:scale-105"
                  priority={currentSlide === 0}
                  fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
                  quality={85}
                />
              </div>
            </div>
          </div>

          {/* Frosted Left / Right Navigation Controls (Hidden on narrow mobile, touch swipe is primary) */}
          <button
            type="button"
            onClick={goToPrevSlide}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/80 shadow-xs hidden sm:flex items-center justify-center text-xs transition-all cursor-pointer z-20 backdrop-blur-sm hover:scale-105 active:scale-95"
            aria-label="Previous Slide"
          >
            ←
          </button>
          <button
            type="button"
            onClick={goToNextSlide}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/80 shadow-xs hidden sm:flex items-center justify-center text-xs transition-all cursor-pointer z-20 backdrop-blur-sm hover:scale-105 active:scale-95"
            aria-label="Next Slide"
          >
            →
          </button>

          {/* Centered Segmented Slide Indicators with Live Auto-Timer Fill */}
          <div className="absolute bottom-2 sm:bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 z-20 bg-white/90 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-stone-200/80 shadow-2xs">
            {SLIDES.map((s, idx) => {
              const isActive = currentSlide === idx
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className="relative h-1 sm:h-1.5 rounded-full overflow-hidden transition-all cursor-pointer"
                  style={{ width: isActive ? '22px' : '6px' }}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div className={`w-full h-full ${isActive ? 'bg-[#17233B]' : 'bg-stone-300 hover:bg-stone-400'}`} />
                  {/* Visual auto-advance timer bar on active slide */}
                  {isActive && (
                    <div
                      key={currentSlide}
                      className="absolute inset-0 bg-[#C9A45C] origin-left animate-[timerFill_4.5s_linear]"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 3. Quick Harvest Categories (Mobile App Horizontal Swipe Bar) ─── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-3">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-1.5">
            <h3 className="font-serif text-sm sm:text-lg font-bold text-[#17233B]">
              Explore By Harvest
            </h3>
            <span className="text-[10px] text-stone-500 font-medium hidden sm:inline">
              · Direct Sourcing from Certified Growers
            </span>
          </div>
          <Link
            href="/shop"
            className="text-[10px] sm:text-[11px] font-semibold text-[#704B32] hover:text-[#17233B] uppercase tracking-wider flex items-center gap-0.5 group"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* Mobile Horizontal Snap-Scroll Carousel / Desktop Grid */}
        <div className="flex overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory gap-2.5 sm:grid sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORY_TILES.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className={`snap-start flex-shrink-0 w-28 sm:w-auto p-2 sm:p-2.5 rounded-xl border transition-all duration-300 hover:shadow-xs hover:-translate-y-0.5 flex flex-col justify-between group active:scale-95 ${tile.bgColor}`}
            >
              <div className="flex items-start justify-between">
                <span className="px-1.5 py-0.2 rounded-full bg-white text-[#17233B] text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider shadow-2xs">
                  {tile.tag}
                </span>
                <span className="text-[10px] text-stone-400 group-hover:translate-x-0.5 group-hover:text-stone-800 transition-all">
                  →
                </span>
              </div>

              <div className="relative w-14 h-14 sm:w-20 sm:h-20 mx-auto my-1 flex items-center justify-center">
                <Image
                  src={tile.image}
                  alt={tile.title}
                  fill
                  sizes="(max-width: 640px) 60px, 80px"
                  loading="lazy"
                  quality={80}
                  className="object-contain p-0.5 group-hover:scale-108 transition-transform duration-500 drop-shadow-2xs"
                />
              </div>

              <div>
                <h4 className="font-bold text-[10px] sm:text-[11px] text-[#17233B] leading-tight line-clamp-1">
                  {tile.title}
                </h4>
                <p className="text-[8.5px] sm:text-[9.5px] text-stone-500 mt-0.5 font-medium line-clamp-1">
                  {tile.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
