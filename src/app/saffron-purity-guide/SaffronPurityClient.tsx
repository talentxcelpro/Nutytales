'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function SaffronPurityClient() {
  const [activeTest, setActiveTest] = useState<'water' | 'bakingSoda' | 'rub' | 'shape'>('water')
  const [trimester, setTrimester] = useState<'t1' | 't2' | 't3'>('t2')
  const [waterTimer, setWaterTimer] = useState<number>(0)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const startWaterSimulation = () => {
    setIsSimulating(true)
    setWaterTimer(0)
    const interval = setInterval(() => {
      setWaterTimer((prev) => {
        if (prev >= 15) {
          clearInterval(interval)
          setIsSimulating(false)
          return 15
        }
        return prev + 1
      })
    }, 250)
  }

  return (
    <div className="space-y-16">
      {/* Interactive At-Home Purity Test Studio */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-lg overflow-hidden">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Laboratory & Kitchen Verification
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 mt-3 mb-2">
            The 4-Point Kashmiri Saffron Purity Test
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Over 80% of commercial saffron sold in tourist markets and online is adulterated with dyed corn silk, safflower, or plastic threads. Use these 4 kitchen tests to authenticate real Grade-1 Mongra.
          </p>
        </div>

        {/* Test Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => setActiveTest('water')}
            className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition text-left ${
              activeTest === 'water'
                ? 'bg-[#3D2B1F] text-amber-100 border-[#3D2B1F] shadow-md'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div className="text-lg mb-1">💧</div>
            1. Warm Water Diffusion
          </button>

          <button
            onClick={() => setActiveTest('bakingSoda')}
            className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition text-left ${
              activeTest === 'bakingSoda'
                ? 'bg-[#3D2B1F] text-amber-100 border-[#3D2B1F] shadow-md'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div className="text-lg mb-1">🧪</div>
            2. Baking Soda Alkaline
          </button>

          <button
            onClick={() => setActiveTest('rub')}
            className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition text-left ${
              activeTest === 'rub'
                ? 'bg-[#3D2B1F] text-amber-100 border-[#3D2B1F] shadow-md'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div className="text-lg mb-1">✋</div>
            3. Damp Finger Rub
          </button>

          <button
            onClick={() => setActiveTest('shape')}
            className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition text-left ${
              activeTest === 'shape'
                ? 'bg-[#3D2B1F] text-amber-100 border-[#3D2B1F] shadow-md'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div className="text-lg mb-1">🔍</div>
            4. Trumpet Anatomy
          </button>
        </div>

        {/* Active Test Display Panel */}
        {activeTest === 'water' && (
          <div className="bg-[#FAF7F2] rounded-2xl border border-stone-200 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
                  Test 01 · Diffusion Kinetics
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  The Warm Water Color Release Test
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Drop 3–4 threads into a clear glass of warm water (approx. 45°C). Observe how the color diffuses and whether the physical threads change color.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                    <div className="font-bold text-emerald-900 text-xs sm:text-sm mb-1">
                      ✅ Authentic Kashmiri Mongra
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Releases delicate, pale golden streamers that slowly spiral outward over 15–20 minutes. Water turns luminous sunset yellow. The red threads remain red and never turn white.
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                    <div className="font-bold text-red-900 text-xs sm:text-sm mb-1">
                      ❌ Fake / Adulterated Saffron
                    </div>
                    <p className="text-xs text-red-800 leading-relaxed">
                      Bleeds dark red or violent orange within 3–5 seconds like synthetic food dye (Tartrazine). The artificial threads quickly turn white or dissolve completely.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={startWaterSimulation}
                    disabled={isSimulating}
                    className="bg-[#3D2B1F] hover:bg-[#2A1810] disabled:opacity-50 text-amber-100 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm"
                  >
                    {isSimulating ? 'Simulating Water Diffusion...' : '▶ Simulate Water Test'}
                  </button>
                  <span className="text-xs text-stone-500 ml-3">
                    Elapsed time: {waterTimer} mins
                  </span>
                </div>
              </div>

              {/* Visual Glass Simulator */}
              <div className="w-full sm:w-64 h-72 rounded-2xl border-2 border-stone-300 relative overflow-hidden flex flex-col justify-end p-4 shadow-inner bg-white">
                <div
                  className="w-full rounded-b-xl transition-all duration-300 flex items-center justify-center text-xs font-bold text-stone-800 text-center"
                  style={{
                    height: '80%',
                    backgroundColor:
                      waterTimer === 0
                        ? '#F0F9FF'
                        : waterTimer < 5
                        ? '#FEF08A'
                        : waterTimer < 10
                        ? '#FDE047'
                        : '#FACC15',
                  }}
                >
                  <div className="space-y-1">
                    <div>{waterTimer === 0 ? 'Clear Water' : 'Luminous Golden Amber'}</div>
                    <div className="text-[10px] text-stone-600 font-normal">
                      {waterTimer === 0
                        ? 'Click Simulate button'
                        : `Natural Crocin Release (${waterTimer * 6}% Optical Density)`}
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-0 right-0 text-center text-[11px] font-semibold text-stone-500">
                  Pure Water (45°C)
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTest === 'bakingSoda' && (
          <div className="bg-[#FAF7F2] rounded-2xl border border-stone-200 p-6 sm:p-8">
            <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
              Test 02 · Chemical Alkaline pH Reaction
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1 mb-3">
              The Baking Soda Alkaline pH Test
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-6">
              Mix a teaspoon of standard kitchen baking soda in a small bowl of water. Drop 2 threads of saffron into the solution.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                <span className="text-2xl">🟡</span>
                <div className="font-bold text-emerald-950 text-base mt-2 mb-1">
                  Pure Saffron Stays Bright Clear Yellow
                </div>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                  Real crocin carotenoids are stable in alkaline pH environments. The baking soda solution will remain a clear, radiant golden-yellow without cloudiness.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 p-5 rounded-2xl">
                <span className="text-2xl">🔴</span>
                <div className="font-bold text-red-950 text-base mt-2 mb-1">
                  Fake Saffron Turns Dark Dull Red
                </div>
                <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                  Synthetic textile and chemical food dyes (such as coal-tar derivatives and sunset yellow) turn murky red, brown, or cloudy in alkaline solutions.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTest === 'rub' && (
          <div className="bg-[#FAF7F2] rounded-2xl border border-stone-200 p-6 sm:p-8">
            <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
              Test 03 · Structural Integrity
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1 mb-3">
              The Damp Finger Friction & Rub Test
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-6">
              Moisten your index finger with water. Take a soaked saffron thread and rub it back and forth against your thumb.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                <div className="font-bold text-emerald-950 text-base mb-1">
                  ✅ Holds Fiber Integrity & Stains Gold
                </div>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                  Real stigmas remain firm and fibrous. They will leave a bright yellow-golden sheen on your skin, but the thread itself will not disintegrate into mush.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 p-5 rounded-2xl">
                <div className="font-bold text-red-950 text-base mb-1">
                  ❌ Shatters into Mush or Powdery Paste
                </div>
                <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                  Shredded corn silk, shredded paper, or dyed animal fibers collapse into a sticky, greasy, or powdery mush immediately upon friction.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTest === 'shape' && (
          <div className="bg-[#FAF7F2] rounded-2xl border border-stone-200 p-6 sm:p-8">
            <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
              Test 04 · Botanical Morphology
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1 mb-3">
              The Trumpet Flute Stigma Inspection
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-6">
              Use a magnifying glass or your smartphone macro camera to inspect the dry saffron threads against a white surface.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                <div className="font-bold text-emerald-950 text-base mb-1">
                  ✅ Fluted Trumpet-Shaped Apex
                </div>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                  Authentic Kashmiri Mongra stigmas are naturally wider at the top tip (like a tiny trumpet or bell) and narrow at the bottom stem. No two threads are identical.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 p-5 rounded-2xl">
                <div className="font-bold text-red-950 text-base mb-1">
                  ❌ Uniform Flat Ribbons or Strands
                </div>
                <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                  Adulterated saffron threads are straight, flat, razor-cut strips of uniform thickness with blunt square ends—a dead giveaway of factory-cut corn silk.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Pregnancy Trimester Saffron Protocol */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-orange-50/50 rounded-3xl border border-amber-200 p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
            Ayurvedic Terroir & Maternal Wellness
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 mt-3 mb-2">
            Kashmiri Saffron in Pregnancy: Trimester Protocol
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Known in Ayurveda as <em>Kumkuma</em>, pure saffron milk has been revered for centuries to ease digestion, regulate mood swings, and promote restful sleep during pregnancy.
          </p>
        </div>

        {/* Trimester Tabs */}
        <div className="grid grid-cols-3 gap-3 max-w-xl mb-8">
          <button
            onClick={() => setTrimester('t1')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
              trimester === 't1'
                ? 'bg-amber-900 text-amber-100 shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Trimester 1<span className="block text-[10px] font-normal">Weeks 1 – 12</span>
          </button>

          <button
            onClick={() => setTrimester('t2')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
              trimester === 't2'
                ? 'bg-amber-900 text-amber-100 shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Trimester 2 ⭐<span className="block text-[10px] font-normal">Weeks 13 – 27</span>
          </button>

          <button
            onClick={() => setTrimester('t3')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
              trimester === 't3'
                ? 'bg-amber-900 text-amber-100 shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Trimester 3<span className="block text-[10px] font-normal">Weeks 28 – 40</span>
          </button>
        </div>

        {/* Trimester Content Card */}
        {trimester === 't1' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <span>⚠️</span>
              <h4>First Trimester Recommendation: Exercise Caution</h4>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              During the initial 12 weeks of embryo implantation and organogenesis, Ayurveda and modern obstetrics advise avoiding active uterine stimulants. It is best to wait until your 14th or 15th week when the pregnancy has safely stabilized, and always consult your obstetrician before introducing medicinal herbs.
            </p>
            <div className="text-xs bg-stone-50 p-3 rounded-xl border border-stone-200 text-stone-600">
              📌 Recommended Dosage in Trimester 1: <strong>0 to 1 strand occasionally</strong> (only after doctor confirmation).
            </div>
          </div>
        )}

        {trimester === 't2' && (
          <div className="bg-white rounded-2xl border border-amber-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
              <span>✨</span>
              <h4>Second Trimester: The Golden Window (Ideal Start)</h4>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Week 14 onwards is the classical time when mothers start the nightly saffron milk ritual. Pure crocin helps calm digestive bloating, relaxes mood swings, and provides soothing safranal aromatics for restful sleep.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-stone-200">
                <div className="text-xs text-stone-500 font-medium">Safe Daily Dosage</div>
                <div className="text-xl font-bold font-serif text-amber-900 mt-1">2 to 3 Strands</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Approx. 15–20 mg per day</div>
              </div>
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-stone-200">
                <div className="text-xs text-stone-500 font-medium">Optimal Time</div>
                <div className="text-xl font-bold font-serif text-amber-900 mt-1">Bedtime</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Warm A2 cow milk</div>
              </div>
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-stone-200">
                <div className="text-xs text-stone-500 font-medium">Synergy Pairing</div>
                <div className="text-xl font-bold font-serif text-amber-900 mt-1">+ Cardamom</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Aids lactation & digestion</div>
              </div>
            </div>
          </div>
        )}

        {trimester === 't3' && (
          <div className="bg-white rounded-2xl border border-amber-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <span>🌙</span>
              <h4>Third Trimester: Muscle Relaxation & Maternal Rest</h4>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              In the final trimester, saffron milk helps alleviate leg cramps, supports pelvic muscle tone, and soothes nocturnal anxiety.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-stone-200">
                <div className="text-xs text-stone-500 font-medium">Daily Dosage</div>
                <div className="text-xl font-bold font-serif text-amber-900 mt-1">3 to 4 Strands</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Do not exceed 5 strands per day</div>
              </div>
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-stone-200">
                <div className="text-xs text-stone-500 font-medium">Preparation Rule</div>
                <div className="text-xl font-bold font-serif text-amber-900 mt-1">Pre-Soak 15 Mins</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Infuse in 2 tbsp warm milk before adding to cup</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Direct Order: Acquire Certified Pampore Saffron */}
      <section className="bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-10 shadow-xl text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
          Direct From Pampore Karewas · Grade-1 Mongra
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#2A1810] mt-3 mb-2">
          Order 100% Tested Pure Kashmiri Mongra Saffron
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto mb-8">
          Individually certified Category-I stigmas with Crocin &gt; 240, zero yellow style waste, and zero chemical dyes. Vacuum-sealed in crystal jars with hologram authenticity seal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-stone-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-500">Trial / Starter</span>
              <h3 className="font-serif font-bold text-xl text-stone-900 mt-1 mb-2">1 Gram Jar</h3>
              <div className="text-2xl font-bold text-[#2A1810] mb-1">₹420</div>
              <div className="text-xs text-stone-400 line-through mb-4">MRP ₹499 (16% OFF)</div>
              <p className="text-[11px] text-stone-600 mb-4">
                Contains ~400–450 authentic stigmas. Ideal for 1 month of pregnancy rituals.
              </p>
            </div>
            <Link
              href="/shop/kashmiri-mongra-saffron"
              className="block w-full bg-[#3D2B1F] hover:bg-[#2A1810] text-amber-100 font-semibold py-2.5 px-4 rounded-xl text-xs transition"
            >
              Order 1g Jar →
            </Link>
          </div>

          <div className="bg-amber-50/70 p-6 rounded-2xl border-2 border-amber-400 flex flex-col justify-between relative shadow-md">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-800 text-amber-100 text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full">
              Most Popular
            </span>
            <div>
              <span className="text-xs font-semibold text-amber-900">Maternal Wellness Pack</span>
              <h3 className="font-serif font-bold text-xl text-stone-900 mt-1 mb-2">2 Grams Jar</h3>
              <div className="text-2xl font-bold text-[#2A1810] mb-1">₹820</div>
              <div className="text-xs text-stone-400 line-through mb-4">MRP ₹975 (16% OFF)</div>
              <p className="text-[11px] text-stone-600 mb-4">
                Contains ~900 stigmas. Ideal for Trimester 2 & 3 daily milk protocol.
              </p>
            </div>
            <Link
              href="/shop/kashmiri-mongra-saffron?variant=2g"
              className="block w-full bg-amber-900 hover:bg-amber-950 text-amber-100 font-semibold py-2.5 px-4 rounded-xl text-xs transition shadow-sm"
            >
              Order 2g Jar →
            </Link>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-stone-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-500">Connoisseur Crystal</span>
              <h3 className="font-serif font-bold text-xl text-stone-900 mt-1 mb-2">5 Grams Royal Jar</h3>
              <div className="text-2xl font-bold text-[#2A1810] mb-1">₹1,950</div>
              <div className="text-xs text-stone-400 line-through mb-4">MRP ₹2,350 (17% OFF)</div>
              <p className="text-[11px] text-stone-600 mb-4">
                Air-tight preservation crystal jar with luxury velvet packaging.
              </p>
            </div>
            <Link
              href="/shop/kashmiri-mongra-saffron?variant=5g"
              className="block w-full bg-[#3D2B1F] hover:bg-[#2A1810] text-amber-100 font-semibold py-2.5 px-4 rounded-xl text-xs transition"
            >
              Order 5g Jar →
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hi Nuty Tales, I am looking to order pure certified Kashmiri Saffron for pregnancy / home testing. Please share details.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition shadow-md"
          >
            <span>💬</span> Order via WhatsApp ({WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE})
          </a>
        </div>
      </section>
    </div>
  )
}
