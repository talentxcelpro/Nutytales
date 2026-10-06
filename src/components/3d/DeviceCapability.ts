// ─── Nutty Tales 3D Device Capability & Quality Tier Detector ──────────────────

export type QualityTier = 'HIGH' | 'MEDIUM' | 'LOW' | 'FALLBACK'

export interface Device3DCapabilities {
  tier: QualityTier
  maxDpr: number
  supportsWebGL: boolean
  isReducedMotion: boolean
  isMobile: boolean
}

export function detect3DCapabilities(): Device3DCapabilities {
  if (typeof window === 'undefined') {
    return {
      tier: 'FALLBACK',
      maxDpr: 1,
      supportsWebGL: false,
      isReducedMotion: false,
      isMobile: false,
    }
  }

  // Check prefers-reduced-motion
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (isReducedMotion) {
    return {
      tier: 'FALLBACK',
      maxDpr: 1,
      supportsWebGL: false,
      isReducedMotion: true,
      isMobile: false,
    }
  }

  // Check WebGL availability
  let supportsWebGL = false
  let gl: WebGLRenderingContext | null = null
  try {
    const canvas = document.createElement('canvas')
    gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null
    supportsWebGL = !!gl
  } catch {
    supportsWebGL = false
  }

  if (!supportsWebGL || !gl) {
    return {
      tier: 'FALLBACK',
      maxDpr: 1,
      supportsWebGL: false,
      isReducedMotion: false,
      isMobile: false,
    }
  }

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768

  // Device memory & CPU cores heuristic
  const nav = navigator as unknown as { deviceMemory?: number; hardwareConcurrency?: number }
  const memory = nav.deviceMemory || 4 // in GB
  const cores = nav.hardwareConcurrency || 4

  let tier: QualityTier = 'MEDIUM'
  if (isMobile) {
    tier = memory >= 4 && cores >= 6 ? 'MEDIUM' : 'LOW'
  } else {
    tier = memory >= 6 && cores >= 6 ? 'HIGH' : 'MEDIUM'
  }

  // Cap DPR for battery & thermal efficiency
  const maxDpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2.0)

  return {
    tier,
    maxDpr,
    supportsWebGL,
    isReducedMotion,
    isMobile,
  }
}
