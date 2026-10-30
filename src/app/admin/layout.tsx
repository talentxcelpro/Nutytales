import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminToken } from '@/lib/auth/jwt-verifier'

interface AdminLayoutProps {
  children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies()
  const token = cookieStore.get('nt_uid')?.value

  // Server-side cryptographic & role authorization check
  const authResult = await verifyAdminToken(token)

  if (!authResult.valid) {
    const errorParam = authResult.error || 'unauthorized'
    redirect(`/login?redirect=admin&error=${errorParam}`)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-[#17233B] text-white py-3 px-6 text-xs flex justify-between items-center shadow-sm">
        <span className="font-bold tracking-wider uppercase text-[#C9A45C]">Nuty Tales Operations Desk</span>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-semibold">● Verified Admin Session</span>
          <span className="text-stone-300">({authResult.payload?.email || authResult.payload?.uid})</span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
