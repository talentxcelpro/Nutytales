// ─── Nuty Tales Seller Central — Multipart File Upload Pipeline ───────────────
// Handles genuine binary multipart file uploads for product photos and legal documents.
// Supports Supabase Storage bucket streaming with local durable storage fallback.

import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getVerifiedSellerSession } from '@/lib/seller-portal/auth-server'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
]

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const MAX_DOC_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  try {
    const session = await getVerifiedSellerSession(req)
    // Only authenticated users or applicants can upload assets
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required to upload files.' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'products' // 'products' | 'compliance' | 'branding'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    // 1. MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type "${file.type}". Allowed: JPG, PNG, WEBP, SVG, PDF.`,
        },
        { status: 400 }
      )
    }

    // 2. File size validation
    const maxSize = file.type === 'application/pdf' ? MAX_DOC_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds limit of ${maxSize / (1024 * 1024)}MB.`,
        },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${sanitizedFilename}`
    const storagePath = `${folder}/${uniqueFileName}`

    // 3. Try Supabase Storage Bucket first
    const supabaseAdmin = getSupabaseAdmin()
    const bucketName = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'nuttytales-assets'

    if (supabaseAdmin) {
      try {
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from(bucketName)
          .upload(storagePath, buffer, {
            contentType: file.type,
            upsert: false,
          })

        if (!uploadError && uploadData) {
          const { data: urlData } = supabaseAdmin.storage
            .from(bucketName)
            .getPublicUrl(storagePath)

          return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
            fileName: uniqueFileName,
            fileSize: file.size,
            storageType: 'supabase_storage',
          })
        }
      } catch (storageErr) {
        console.warn('[Upload] Supabase Storage upload failed; falling back to local asset store:', storageErr)
      }
    }

    // 4. Fallback to Local Public Asset Directory
    const publicDir = path.resolve(process.cwd(), 'public', 'uploads', 'seller-central', folder)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    const localFilePath = path.join(publicDir, uniqueFileName)
    fs.writeFileSync(localFilePath, buffer)

    const publicUrl = `/uploads/seller-central/${folder}/${uniqueFileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      fileSize: file.size,
      storageType: 'local_durable',
    })
  } catch (err: any) {
    console.error('[Upload] File upload exception:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'File upload failed' },
      { status: 500 }
    )
  }
}
