'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface StoryScene {
  id: number
  stage: string
  title: string
  subtitle: string
  description: string
  image: string
  provenanceStat: string
  statLabel: string
  artisanQuote: string
  craftSecret: string
  tag: string
}

const STORY_SCENES: StoryScene[] = [
  {
    id: 1,
    stage: 'Scene 01 · The High Altitude Origin',
    title: 'Beneath the Pir Panjal Snows',
    subtitle: 'Where sub-zero alpine winds sculpt the world’s finest natural fibers.',
    description:
      'High in the wind-swept Changthang plateau bordering Ladakh and Kashmir at altitudes exceeding 14,000 feet, winter temperatures plummet to -40°C. Nature responds with a miracle: indigenous Capra Hircus goats develop a delicate, gossamer underfleece of extraordinary warmth and lightness.',
    image: '/images/crafts-kashmir-landscape.jpg',
    provenanceStat: '14,000+ ft',
    statLabel: 'Plateau Altitude',
    artisanQuote: 'The harsher the winter snows, the softer the protective cashmere underfleece becomes.',
    craftSecret: 'Harvested only in spring by gentle hand-combing, never shearing.',
    tag: 'Alpine Origin',
  },
  {
    id: 2,
    stage: 'Scene 02 · Downtown Srinagar (Shehr-e-Khaas)',
    title: 'The Handloom Sanctuary',
    subtitle: '700 years of Persian and Kashmiri heritage echoing through carved cedar beams.',
    description:
      'In the historic quarters of Downtown Srinagar along the Jhelum River, multi-generational master weavers sit at hand-carved deodar wood looms. Here, the art form introduced in the 14th century by Sufi scholar Mir Sayyid Ali Hamadani lives on without mechanical shortcuts.',
    image: '/images/crafts-winter-hero.jpg',
    provenanceStat: '700 Years',
    statLabel: 'Continuous Tradition',
    artisanQuote: 'The rhythm of the wooden shuttle is like a heartbeat. One wrong pass unravels weeks of effort.',
    craftSecret: 'Every loom uses walnut-wood tujis (carved wooden spools) ground by hand.',
    tag: 'Master Workshop',
  },
  {
    id: 3,
    stage: 'Scene 03 · The Gossamer Fiber',
    title: '14.5 Microns of Pure Air',
    subtitle: 'Six times finer than human hair, so delicate it cannot withstand power looms.',
    description:
      'True Pashmina fiber measures between 12 and 14.5 microns in thickness. Because modern industrial weaving machines snap fibers this fragile, every authentic Kashmir Pashmina MUST be hand-spun on the traditional wooden Charkha (Yender) by master women spinners.',
    image: '/images/crafts-pashmina-shawl.jpg',
    provenanceStat: '14.5 µm',
    statLabel: 'Fiber Fineness',
    artisanQuote: 'Touch a pure Pashmina in the dark, and you will feel warmth before you even sense weight.',
    craftSecret: 'Tested under polarized microscopic light for GI Tag certification.',
    tag: 'Changthangi Cashmere',
  },
  {
    id: 4,
    stage: 'Scene 04 · Microscopic Needlework',
    title: 'The Sozni & Tilla Precision',
    subtitle: 'A single needle, fine silk filaments, and months of patient devotion.',
    description:
      'Sozni embroidery is among the most sophisticated needlework techniques known to mankind. Using needles as fine as horsehair, artisans sew microscopic satin stitches that replicate delicate Paisley botehs and floral jals with identical perfection on both sides of the textile.',
    image: '/images/crafts-velvet-pheran.jpg',
    provenanceStat: '240+ Hours',
    statLabel: 'Hand-Stitching Time',
    artisanQuote: 'Our eyes tire, but our hearts steady. We stitch prayer and memory into every petal.',
    craftSecret: 'Antiques from this craft hang in the Victoria & Albert Museum in London.',
    tag: 'Sozni Needlework',
  },
  {
    id: 5,
    stage: 'Scene 05 · The Draped Silhouette',
    title: 'The Royal Pheran & Jamawar',
    subtitle: 'Timeless Kashmiri warmth meets modern luxury fashion editorial elegance.',
    description:
      'When draped, the Pheran and Jamawar shawl do not simply cover—they transform. Rich jewel-toned velvets, pure woolens, and hand-woven cashmeres create an architectural silhouette that has dressed Himalayan royalty and global connoisseurs alike.',
    image: '/images/crafts-men-pheran.jpg',
    provenanceStat: '100% Pure',
    statLabel: 'Natural Materials',
    artisanQuote: 'Elegance without arrogance. Warmth without heavy burden.',
    craftSecret: 'Try with SI allows you to view this drape on your own silhouette instantly.',
    tag: 'Haute Editorial',
  },
  {
    id: 6,
    stage: 'Scene 06 · The Sacred Harvest',
    title: 'Kagzi Walnuts & Pampore Saffron',
    subtitle: 'The edible treasures cultivated on the same glacial terraces.',
    description:
      'Where craft blooms, gastronomy thrives. The same mineral-rich glacial soil yields paper-shelled Kagzi Walnuts—crackable with gentle palm pressure—and deep crimson Pampore Mongra Saffron stigmas with unmatched crocin coloring strength and intoxicating aroma.',
    image: '/images/dark-wood-gourmet-tray.jpg',
    provenanceStat: 'Grade A1',
    statLabel: 'GI Lab Certified',
    artisanQuote: 'Two stigmas in morning tea warm the spirit through the harshest winter freeze.',
    craftSecret: 'Packed in airtight ultraviolet-shielded glass jars within 48 hours of drying.',
    tag: 'Glacial Gastronomy',
  },
  {
    id: 7,
    stage: 'Scene 07 · The Living Legacy',
    title: 'From Kashmir Valley to Your World',
    subtitle: 'Taste the nuts. Wear the heritage. Stay in the orchards. Explore the craft.',
    description:
      'Nuty Tales brings these sacred crafts directly from verified Kashmiri artisan cooperatives to your doorstep, backed by official GI certification, virtual drape previews, and complete provenance dossiers.',
    image: '/images/crafts-gifting-box.jpg',
    provenanceStat: 'PAN-India',
    statLabel: 'Bespoke Fulfilment',
    artisanQuote: 'Every purchase sustains an artisan family and preserves an ancient art form.',
    craftSecret: 'Bespoke personalization and corporate packaging available PAN-India.',
    tag: 'Living Heritage',
  },
]

export default function KashmirStory4D() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [soundscapeActive, setSoundscapeActive] = useState(false)

  const currentScene = STORY_SCENES[activeSceneIndex]

  // Auto-advance loop when playing
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setActiveSceneIndex((prev) => (prev + 1) % STORY_SCENES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPlaying])

  return (
    <div className="relative bg-[#17233B] text-white rounded-3xl overflow-hidden shadow-2xl border border-[#C9A45C]/30 my-16">
      {/* Top Experience Navigation Bar */}
      <div className="px-6 py-4 bg-[#10192A] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9A45C] animate-ping" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9A45C] block">
              4D Cinematic Scroll Experience
            </span>
            <h3 className="font-serif text-sm sm:text-base font-bold text-white">
              The Journey of a Kashmiri Masterpiece
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Ambient Soundscape Toggle */}
          <button
            type="button"
            onClick={() => setSoundscapeActive(!soundscapeActive)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              soundscapeActive
                ? 'bg-[#176B68] text-white border border-emerald-400/40 shadow-sm'
                : 'bg-white/10 text-stone-300 hover:bg-white/20'
            }`}
          >
            <span>{soundscapeActive ? '🔊 Valley Soundscape On' : '🔈 Mute Ambient'}</span>
            {soundscapeActive && (
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-white h-2 animate-bounce" />
                <span className="w-0.5 bg-white h-3 animate-bounce [animation-delay:0.15s]" />
                <span className="w-0.5 bg-white h-1.5 animate-bounce [animation-delay:0.3s]" />
              </span>
            )}
          </button>

          {/* Play / Pause Auto-Tour */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] transition-colors shadow-sm"
          >
            {isPlaying ? '⏸ Pause Tour' : '▶ Auto Experience'}
          </button>
        </div>
      </div>

      {/* Main Multi-Scene Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Left Visual Cinematic Canvas (7 cols) */}
        <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[540px] bg-black overflow-hidden group">
          <Image
            key={currentScene.id}
            src={currentScene.image}
            alt={currentScene.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover opacity-85 transition-transform duration-1000 scale-105 group-hover:scale-100"
          />

          {/* Ambient Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#17233B] via-transparent to-black/40" />

          {/* Inset Provenance Metric Badge */}
          <div className="absolute top-6 left-6 p-3 rounded-2xl bg-[#17233B]/90 backdrop-blur-md border border-white/20 text-center shadow-lg">
            <span className="block font-serif text-2xl font-extrabold text-[#C9A45C]">
              {currentScene.provenanceStat}
            </span>
            <span className="text-[10px] text-stone-300 uppercase tracking-widest block font-medium">
              {currentScene.statLabel}
            </span>
          </div>

          {/* Inset Tag */}
          <div className="absolute top-6 right-6">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[11px] uppercase font-bold tracking-wider border border-white/30">
              {currentScene.tag}
            </span>
          </div>

          {/* Artisan Quote Caption */}
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/15">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block mb-1">
              Voice of the Artisan:
            </span>
            <p className="font-serif italic text-xs sm:text-sm text-stone-200">
              &ldquo;{currentScene.artisanQuote}&rdquo;
            </p>
          </div>
        </div>

        {/* Right Narrative & Dossier (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-[#17233B] to-[#121C30]">
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C9A45C] block">
              {currentScene.stage}
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              {currentScene.title}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-200/90 font-serif italic">
              {currentScene.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              {currentScene.description}
            </p>

            {/* Craft Secret Card */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A45C] block">
                Provenance Note
              </span>
              <p>{currentScene.craftSecret}</p>
            </div>
          </div>

          {/* Interactive CTAs */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/crafts/try-with-si"
                className="flex-1 py-3 px-4 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] text-xs font-bold uppercase tracking-wider rounded-xl transition-all text-center shadow-md"
              >
                Virtual Drape with SI ✨
              </Link>
              <Link
                href="/crafts"
                className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all text-center border border-white/20"
              >
                Shop Collection →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scene Step Scrubber */}
      <div className="p-4 bg-[#10192A] border-t border-white/10 flex items-center justify-between gap-2 overflow-x-auto">
        {STORY_SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            type="button"
            onClick={() => {
              setIsPlaying(false)
              setActiveSceneIndex(idx)
            }}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-left transition-all ${
              activeSceneIndex === idx
                ? 'bg-[#176B68] text-white shadow-sm ring-1 ring-[#C9A45C]'
                : 'bg-white/5 hover:bg-white/10 text-stone-400'
            }`}
          >
            <span className="text-[9px] uppercase tracking-wider block font-bold text-[#C9A45C]">
              0{scene.id}
            </span>
            <span className="text-[11px] font-medium truncate block text-stone-200">
              {scene.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
