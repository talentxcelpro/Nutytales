import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-[#17233B]/5 border border-[#17233B]/10 flex items-center justify-center text-4xl shadow-inner">
        🧭
      </div>
      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold uppercase tracking-widest text-[#704B32]">
          Error 404
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          Page Not Found
        </h1>
        <p className="text-sm text-stone-600 font-light leading-relaxed">
          The requested address could not be located. It may have been moved, renamed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
        >
          Return Home
        </Link>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-xl bg-white hover:bg-stone-50 text-[#17233B] font-bold text-xs uppercase tracking-wider border border-stone-300 transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    </div>
  )
}
