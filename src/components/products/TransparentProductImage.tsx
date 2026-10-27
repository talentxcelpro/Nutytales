'use client'

import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'

export interface TransparentProductImageProps {
  src: string
  alt: string
  aspectRatio?: 'square' | '4/5' | '3/4' | '16/9' | 'auto'
  cardBg?: string
  hoverZoom?: boolean
  priority?: boolean
  sizes?: string
  quality?: number
  className?: string
  imageClassName?: string
  padding?: string
  showNaturalShadow?: boolean
  fill?: boolean
  width?: number
  height?: number
  onClick?: () => void
  badge?: React.ReactNode
  fallbackIcon?: string
}

/**
 * Maps any legacy image URL (e.g. .jpg) to its transparent WebP asset if available,
 * with fallback support to ensure 100% reliability.
 */
export function getTransparentImageUrl(rawSrc: string): { webp: string; png: string; original: string } {
  if (!rawSrc) {
    return {
      webp: '/images/almonds-pouch-250g.webp',
      png: '/images/almonds-pouch-250g.png',
      original: '/images/almonds-pouch-250g.webp',
    }
  }

  // Strip query params or hash if any
  const cleanPath = rawSrc.split('?')[0].split('#')[0]

  // If already .webp or .png, formulate companion paths
  if (cleanPath.endsWith('.webp')) {
    return {
      webp: cleanPath,
      png: cleanPath.replace(/\.webp$/, '.png'),
      original: cleanPath.replace(/\.webp$/, '.jpg'),
    }
  }

  if (cleanPath.endsWith('.png')) {
    return {
      webp: cleanPath.replace(/\.png$/, '.webp'),
      png: cleanPath,
      original: cleanPath,
    }
  }

  // If .jpg or .jpeg
  return {
    webp: cleanPath.replace(/\.(jpe?g)$/, '.webp'),
    png: cleanPath.replace(/\.(jpe?g)$/, '.png'),
    original: cleanPath,
  }
}

/**
 * Universal Transparent Background Product Image Component
 * Compliant with Nuty Tales Universal Transparent Background Image Standard:
 * - Genuine alpha-transparency canvas
 * - Responsive aspect ratio & object-fit containment
 * - Card background supplied by website UI container (never baked into image pixels)
 * - Subtle hover zoom without bounding-box clipping
 * - Graceful fallback on missing/broken images
 * - Realistic soft grounding shadow for floating packaging
 */
export default function TransparentProductImage({
  src,
  alt,
  aspectRatio = 'square',
  cardBg = 'bg-[#FAF5ED]',
  hoverZoom = true,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality = 85,
  className = '',
  imageClassName = '',
  padding = 'p-4',
  showNaturalShadow = true,
  fill = true,
  width,
  height,
  onClick,
  badge,
  fallbackIcon = '🥜',
}: TransparentProductImageProps) {
  const [hasError, setHasError] = useState(false)
  const [useFallbackFormat, setUseFallbackFormat] = useState(0) // 0: webp, 1: png, 2: original

  const urls = getTransparentImageUrl(src)

  // Current active source candidate based on fallback state
  const currentSrc =
    useFallbackFormat === 0
      ? urls.webp
      : useFallbackFormat === 1
      ? urls.png
      : urls.original

  const handleImageError = () => {
    if (useFallbackFormat === 0) {
      // Try transparent PNG
      setUseFallbackFormat(1)
    } else if (useFallbackFormat === 1) {
      // Try original source
      setUseFallbackFormat(2)
    } else {
      // Fallback UI
      setHasError(true)
    }
  }

  // Aspect ratio class helper
  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === '4/5'
      ? 'aspect-[4/5]'
      : aspectRatio === '3/4'
      ? 'aspect-[3/4]'
      : aspectRatio === '16/9'
      ? 'aspect-video'
      : ''

  return (
    <div
      onClick={onClick}
      className={`relative w-full overflow-hidden flex items-center justify-center transition-colors duration-500 ${aspectClass} ${cardBg} ${className}`}
    >
      {badge && <div className="absolute top-3 left-3 z-10">{badge}</div>}

      {hasError ? (
        <div className="flex flex-col items-center justify-center text-stone-300 p-6 select-none">
          <span className="text-4xl sm:text-5xl">{fallbackIcon}</span>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mt-2 text-center line-clamp-1">
            {alt || 'Product Image'}
          </span>
        </div>
      ) : fill ? (
        <div className={`relative w-full h-full flex items-center justify-center ${padding}`}>
          <Image
            src={currentSrc}
            alt={alt || 'Nuty Tales Authentic Packaging'}
            fill
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            quality={quality}
            sizes={sizes}
            onError={handleImageError}
            className={`object-contain transition-transform duration-700 ease-out will-change-transform ${
              hoverZoom ? 'group-hover:scale-105' : ''
            } ${
              showNaturalShadow
                ? 'drop-shadow-[0_10px_20px_rgba(0,0,0,0.07)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.04)]'
                : ''
            } ${imageClassName}`}
          />
        </div>
      ) : (
        <div className={`relative flex items-center justify-center ${padding}`}>
          <Image
            src={currentSrc}
            alt={alt || 'Nuty Tales Authentic Packaging'}
            width={width || 300}
            height={height || 300}
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            quality={quality}
            onError={handleImageError}
            className={`object-contain transition-transform duration-700 ease-out ${
              hoverZoom ? 'group-hover:scale-105' : ''
            } ${
              showNaturalShadow
                ? 'drop-shadow-[0_10px_20px_rgba(0,0,0,0.07)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.04)]'
                : ''
            } ${imageClassName}`}
          />
        </div>
      )}
    </div>
  )
}
