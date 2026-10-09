'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NriFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#090D17] text-stone-300 border-t border-[#C9A45C]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-1 border border-[#C9A45C]/40 flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="Nuty Tales NRI"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                    Nuty Tales
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold tracking-wider bg-[#C9A45C] text-[#090D17]">
                    NRI
                  </span>
                </div>
                <span className="text-[10px] tracking-wide text-[#C9A45C] font-semibold block">
                  Global India-Management Platform
                </span>
              </div>
            </Link>

            <p className="text-xs text-stone-300 leading-relaxed font-light">
              <strong className="text-white font-medium">India, handled. From anywhere in the world.</strong>
              <br />
              Your family, property, home, documents, healthcare coordination, and plans in India—managed through one trusted operating platform, wherever life takes you.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-stone-400">
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">🇺🇸 United States</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">🇬🇧 United Kingdom</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">🇦🇪 UAE & Gulf</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">🇨🇦 Canada</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">🇦🇺 Australia</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">🇸🇬 Singapore</span>
            </div>
          </div>

          {/* Core Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              Core Service Verticals
            </h4>
            <ul className="space-y-2 text-xs font-light text-stone-300">
              <li>
                <Link href="/services/property-management" className="hover:text-white transition-colors">
                  🏡 Property & Home Management
                </Link>
              </li>
              <li>
                <Link href="/services/parent-care" className="hover:text-white transition-colors">
                  ❤️ Parents & Senior Assistance
                </Link>
              </li>
              <li>
                <Link href="/services/healthcare" className="hover:text-white transition-colors">
                  🏥 Healthcare Coordination
                </Link>
              </li>
              <li>
                <Link href="/services/legal-services" className="hover:text-white transition-colors">
                  📜 Legal, Documents & POA
                </Link>
              </li>
              <li>
                <Link href="/services/tax-services" className="hover:text-white transition-colors">
                  📊 Tax, FEMA & CA Assistance
                </Link>
              </li>
              <li>
                <Link href="/services/home-services" className="hover:text-white transition-colors">
                  🔧 Home Services & Repairs
                </Link>
              </li>
              <li>
                <Link href="/services/travel" className="hover:text-white transition-colors">
                  ✈️ Kashmir Travel & Chauffeurs
                </Link>
              </li>
              <li>
                <Link href="/services/weddings" className="hover:text-white transition-colors">
                  💍 Destination Weddings
                </Link>
              </li>
              <li>
                <Link href="/services/gifting" className="hover:text-white transition-colors">
                  🎁 Festive & Family Gifting
                </Link>
              </li>
              <li>
                <Link href="/services/business" className="hover:text-white transition-colors">
                  🏢 Business Setup & Sourcing
                </Link>
              </li>
            </ul>
          </div>

          {/* Operational Hubs & Diaspora Gateways (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              Operational Hubs
            </h4>
            <ul className="space-y-1.5 text-xs font-light text-stone-300">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Srinagar & Kashmir Valley (Tier 1)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Delhi NCR (Delhi, Noida, Gurugram)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Mumbai & Pune (Maharashtra)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Bengaluru & Hyderabad (South Hub)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Chandigarh & Amritsar (Punjab)</span>
              </li>
            </ul>

            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A45C] pt-3">
              Diaspora Gateways
            </h4>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-300">
              <Link href="/country/usa" className="hover:underline">USA to India</Link>
              <Link href="/country/uk" className="hover:underline">UK to India</Link>
              <Link href="/country/canada" className="hover:underline">Canada to India</Link>
              <Link href="/country/uae" className="hover:underline">UAE to India</Link>
            </div>
          </div>

          {/* Platform & Safety (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              Platform & Safety
            </h4>
            <ul className="space-y-2 text-xs font-light text-stone-300">
              <li>
                <Link href="/dashboard" className="text-[#C9A45C] font-semibold hover:underline">
                  🏛️ My India Dashboard
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white">
                  Execution & Proof Loop
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-white">
                  Verified Provider Registry
                </Link>
              </li>
              <li>
                <Link href="/providers" className="hover:text-white">
                  Become a Service Provider
                </Link>
              </li>
              <li>
                <Link href="/provider-workspace" className="hover:text-white">
                  Provider Workspace
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="text-rose-400 font-semibold hover:underline">
                  🚨 Emergency Assistance
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-stone-400 hover:text-white">
                  Staff Operations Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Trust Disclaimers */}
        <div className="pt-8 border-t border-white/10 space-y-3 text-[11px] text-stone-400 leading-relaxed font-light">
          <p>
            <strong className="text-stone-300">Operational & Coordination Platform Notice:</strong> Nuty Tales NRI is a technology orchestration and execution platform connecting global clients with verified on-ground service partners, advocates, Chartered Accountants, and property coordinators in India.
          </p>
          <p>
            <strong className="text-stone-300">Professional Advice Distinction:</strong> Legal consultations and title searches are rendered exclusively by independent Bar Council enrolled advocates. Tax certifications (15CA/15CB) and ITR filings are executed exclusively by independent ICAI Chartered Accountants. Medical appointments and logistics are supportive and non-clinical; we do not prescribe, diagnose, or replace medical specialists.
          </p>
          <p>
            <strong className="text-stone-300">Emergency Services:</strong> Nuty Tales is not a replacement for government emergency first responders. For life-threatening medical emergencies or criminal incidents in India, immediately contact the national emergency response number (112) or medical ambulance (102 / 108).
          </p>
          <p>
            <strong className="text-stone-300">Pricing Transparency:</strong> Sample fees and planning rates displayed across the platform are illustrative estimates based on configured standard service parameters. Binding quotations are confirmed directly through the platform prior to milestone funding.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {currentYear} Nuty Tales. All rights reserved. Operating platform at{' '}
            <span className="text-[#C9A45C] font-mono">nri.nutytales.com</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy & Cross-Border Data
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Engagement
            </Link>
            <Link href="/sitemap.xml" className="hover:text-white">
              XML Sitemap
            </Link>
            <span className="text-[#C9A45C]">One Place. Your People. Your Property. Your India.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
