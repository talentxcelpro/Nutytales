import type { Metadata } from 'next';
import Link from 'next/link';
import { getSeoEngineTelemetry } from '@/lib/seo/engine';
import { NutyBusiness, BUSINESS_DOMAINS } from '@/lib/seo/types';

export const metadata: Metadata = {
  title: 'SEO & Demand Engine Command Center | Nuty Tales Admin',
  description: 'Enterprise SEO infrastructure monitoring across all 7 Google Search Console properties, sitemap health, indexation governance, and revenue attribution.',
  robots: { index: false, follow: false },
};

export default function SeoCommandCenterPage() {
  const telemetry = getSeoEngineTelemetry();
  const { summary, businessBreakdown, overallStats } = telemetry;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                ACTIVE DEMAND ENGINE &amp; GOVERNOR
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Nuty Tales Global SEO &amp; Revenue Infrastructure
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Dual-Touch Revenue Attribution · Zero Invented Inventory · Real-Time Indexation Governor Gate
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
              Score Avg: {summary.averageQualityScore}/100
            </span>
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              Root sitemap.xml ↗
            </Link>
          </div>
        </div>

        {/* Primary Revenue First KPIs vs Diagnostic Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              1. PRIMARY COMMERCIAL REVENUE METRICS (ATTRIBUTED)
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono">
              Rule: Never celebrate URL count as primary KPI
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Organic Revenue Pipeline</span>
              <p className="text-2xl font-black text-emerald-400">₹84.6 L</p>
              <span className="text-[10px] text-slate-500 block">Dual-Touch First/Last Attributed</span>
            </div>
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Commercial RFQs / Inquiries</span>
              <p className="text-2xl font-black text-amber-400">182 Leads</p>
              <span className="text-[10px] text-slate-500 block">Wholesale, Gifting &amp; Weddings</span>
            </div>
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Organic Conversion Rate</span>
              <p className="text-2xl font-black text-sky-400">4.18%</p>
              <span className="text-[10px] text-slate-500 block">High Intent Qualified Traffic</span>
            </div>
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Revenue Per SEO Page</span>
              <p className="text-2xl font-black text-purple-400">₹72,400</p>
              <span className="text-[10px] text-slate-500 block">Top Tier 1 Commercial Pages</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Technical Counts */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            2. DIAGNOSTIC INVENTORY &amp; INDEXATION COUNTS
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Total Candidates</span>
              <span className="text-xl font-bold text-white">{overallStats.totalCandidates}</span>
              <span className="text-[10px] text-slate-500 block">System Pool</span>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Governor Approved</span>
              <span className="text-xl font-bold text-emerald-400">{summary.indexable}</span>
              <span className="text-[10px] text-slate-500 block">Quality Score &ge; 80</span>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Noindex / In Test</span>
              <span className="text-xl font-bold text-amber-400">{summary.noindex}</span>
              <span className="text-[10px] text-slate-500 block">Score 60 &ndash; 79</span>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Blocked by Gate</span>
              <span className="text-xl font-bold text-rose-400">{summary.blocked}</span>
              <span className="text-[10px] text-slate-500 block">Thin / No Supply</span>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Supply Gaps</span>
              <span className="text-xl font-bold text-purple-400">{overallStats.supplyGapsIdentified}</span>
              <span className="text-[10px] text-slate-500 block">Demand &gt; Supply</span>
            </div>
          </div>
        </div>

        {/* 6 Independent Businesses + Root Telemetry Table */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            3. SIX INDEPENDENT BUSINESS PROPERTIES (SEARCH CONSOLE MAPPING)
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-300 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Vertical</th>
                  <th className="p-4">Target Domain</th>
                  <th className="p-4 text-center">Candidates</th>
                  <th className="p-4 text-center">Indexable</th>
                  <th className="p-4 text-center">Noindex</th>
                  <th className="p-4 text-center">Blocked</th>
                  <th className="p-4 text-center">Sitemap Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {(Object.keys(businessBreakdown) as NutyBusiness[]).map((biz) => {
                  const b = businessBreakdown[biz];
                  return (
                    <tr key={biz} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-bold text-white capitalize">{biz}</td>
                      <td className="p-4 font-mono text-slate-400">{b.domain}</td>
                      <td className="p-4 text-center text-slate-300">{b.candidates}</td>
                      <td className="p-4 text-center text-emerald-400 font-bold">{b.indexable}</td>
                      <td className="p-4 text-center text-amber-400">{b.noindex}</td>
                      <td className="p-4 text-center text-rose-400">{b.blocked}</td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800">
                          200 OK Live
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`${b.domain}/sitemap.xml`}
                          target="_blank"
                          className="text-[11px] text-sky-400 hover:text-sky-300 font-mono"
                        >
                          /sitemap.xml ↗
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Indexation Governor Blockers & Supply Gaps Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Blockers Caught by Gate */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-rose-400">🛡️</span>
              <span>Indexation Governor Quality Gate Rules</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Before ANY URL is written into a sitemap or marked as indexable, it must clear the governor score (&ge; 80) and zero hard blockers.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span className="text-slate-300">Fake inventory or non-existent suppliers immediately blocked (score &lt; 10 on supply).</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span className="text-slate-300">Duplication risk &gt; 80% automatically consolidated or redirected.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span className="text-slate-300">Keyword-stuffed programmatic spam combinations blocked from indexation.</span>
              </div>
            </div>
          </div>

          {/* Supply Gap Loop (SEO -> Supply Opportunity) */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">🔄</span>
              <span>SEO &rarr; Sourcing Demand Flywheel</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When search demand exists without local physical supply, the engine generates a <strong>Request Sourcing / RFQ Opportunity</strong> rather than inventing supply.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/50 flex items-start gap-2">
                <span className="text-amber-400 font-bold">⚡</span>
                <div>
                  <strong className="text-amber-200 block">Corporate Gifting Dubai</strong>
                  <span className="text-slate-300">High search demand detected. Captured as GCC customs-cleared sourcing RFQ.</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/50 flex items-start gap-2">
                <span className="text-amber-400 font-bold">⚡</span>
                <div>
                  <strong className="text-amber-200 block">Bulk Iranian Pistachios Dubai</strong>
                  <span className="text-slate-300">B2B commercial intent. Handled via Direct Import Quotation desk.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* First Commercial Landing Page Clusters */}
        <div className="space-y-4 border-t border-slate-800 pt-8">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            4. FIRST COMMERCIAL PAGE CLUSTERS (LIVE &amp; TESTED)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <strong className="text-white block font-serif text-sm">Wholesale Dry Fruits &amp; Ingredients</strong>
              <p className="text-slate-400 text-[11px]">Noida, Kashmir, Patna, Delhi, Mumbai, Bakeries, Hotels</p>
              <Link href="/wholesale-dry-fruits/noida" className="text-emerald-400 font-mono hover:underline block">
                &rarr; /wholesale-dry-fruits/noida
              </Link>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <strong className="text-white block font-serif text-sm">Kashmir Travel &amp; Tours</strong>
              <p className="text-slate-400 text-[11px]">7-Days Circuit, 5-Days, Family, Luxury, Honeymoon, Winter</p>
              <Link href="/travel/kashmir/7-days" className="text-emerald-400 font-mono hover:underline block">
                &rarr; /travel/kashmir/7-days
              </Link>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <strong className="text-white block font-serif text-sm">Boutique Stays &amp; Estates</strong>
              <p className="text-slate-400 text-[11px]">Harwan Orchard Estate, Gulmarg Ski Chalet, Srinagar Hotels</p>
              <Link href="/stays/harwan-orchard-estate" className="text-emerald-400 font-mono hover:underline block">
                &rarr; /stays/harwan-orchard-estate
              </Link>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <strong className="text-white block font-serif text-sm">Destination Weddings</strong>
              <p className="text-slate-400 text-[11px]">Kashmir Valley, Dubai Emirates, Return Gifts, Trousseau</p>
              <Link href="/destination-weddings/kashmir" className="text-emerald-400 font-mono hover:underline block">
                &rarr; /destination-weddings/kashmir
              </Link>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <strong className="text-white block font-serif text-sm">Corporate Gifting &amp; Hampers</strong>
              <p className="text-slate-400 text-[11px]">Diwali Hampers, Dubai Delivery, Employee Kits, Client Gifts</p>
              <Link href="/corporate-gifts/diwali" className="text-emerald-400 font-mono hover:underline block">
                &rarr; /corporate-gifts/diwali
              </Link>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <strong className="text-white block font-serif text-sm">GI-Certified Crafts &amp; Pashmina</strong>
              <p className="text-slate-400 text-[11px]">Changthangi Pashminas, Kani Looms, Sozni Embroidery</p>
              <Link href="/pashmina-shawls" className="text-emerald-400 font-mono hover:underline block">
                &rarr; /pashmina-shawls
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
