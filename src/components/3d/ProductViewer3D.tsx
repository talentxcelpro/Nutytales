'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { detect3DCapabilities, QualityTier } from './DeviceCapability'

export type ModelType = 'gift-box' | 'walnut-chest' | 'papier-mache' | 'pouch'

interface ProductViewer3DProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  modelType: ModelType
  price?: number
  productImage?: string
  origin?: string
  onAddToCart?: () => void
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  fill: string = '#D4AF37'
) {
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.moveTo(x, y - s)
  ctx.lineTo(x + s, y)
  ctx.lineTo(x, y + s)
  ctx.lineTo(x - s, y)
  ctx.closePath()
  ctx.fill()
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r)
  } else {
    ctx.rect(x, y, w, h)
  }
}

/**
 * Creates an authentic high-resolution Nuty Tales front packaging texture.
 */
function createPouchFrontTexture(
  productName: string,
  baseColorHex: string,
  origin: string = 'Kashmir, India',
  productImage?: string,
  onImageLoad?: () => void
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1536
  const ctx = canvas.getContext('2d')!

  const renderContent = (loadedImg?: HTMLImageElement) => {
    // 1. Matte Luxury Base
    ctx.fillStyle = baseColorHex
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Soft satin sheen gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0)
    grad.addColorStop(0, 'rgba(0,0,0,0.32)')
    grad.addColorStop(0.2, 'rgba(255,255,255,0.04)')
    grad.addColorStop(0.5, 'rgba(255,255,255,0.14)')
    grad.addColorStop(0.8, 'rgba(255,255,255,0.04)')
    grad.addColorStop(1, 'rgba(0,0,0,0.38)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 2. Gold Foil Filigree Framing
    ctx.strokeStyle = '#D4AF37'
    ctx.lineWidth = 6
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72)
    ctx.lineWidth = 2
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96)

    // Corner diamonds
    drawDiamond(ctx, 42, 42, 12)
    drawDiamond(ctx, canvas.width - 42, 42, 12)
    drawDiamond(ctx, 42, canvas.height - 42, 12)
    drawDiamond(ctx, canvas.width - 42, canvas.height - 42, 12)

    // 3. Royal Emblem & Stars
    ctx.fillStyle = '#D4AF37'
    ctx.font = '28px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('✦   ✦   ✦', canvas.width / 2, 105)

    // 4. PROMINENT BRANDING: "NUTY TALES"
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 76px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('NUTY TALES', canvas.width / 2, 185)

    // Subtitle & Heritage
    ctx.fillStyle = '#D4AF37'
    ctx.font = 'bold 22px system-ui, sans-serif'
    ctx.fillText('THE PURE HARVEST COLLECTION', canvas.width / 2, 226)

    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.font = 'italic 18px Georgia, serif'
    ctx.fillText('Estd. Kashmir Valleys · 100% Origin Certified', canvas.width / 2, 260)

    // Gold divider line with diamond
    ctx.strokeStyle = '#D4AF37'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(100, 290)
    ctx.lineTo(canvas.width - 100, 290)
    ctx.stroke()
    drawDiamond(ctx, canvas.width / 2, 290, 8)

    // 5. Product Name Heading
    const cleanName = productName.replace(/\(.*?\)/g, '').trim().toUpperCase()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 48px Georgia, serif'
    ctx.fillText(cleanName, canvas.width / 2, 365)

    ctx.fillStyle = '#D4AF37'
    ctx.font = 'bold 20px system-ui, sans-serif'
    ctx.fillText('GRADE A+ CONNOISSEUR RESERVE', canvas.width / 2, 410)

    // 6. Central Arch / Medallion Showcase
    const centerX = canvas.width / 2
    const centerY = 690
    const radius = 230

    // Gold decorative outer rings
    ctx.strokeStyle = '#D4AF37'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()

    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - 10, 0, Math.PI * 2)
    ctx.stroke()

    // Inner window fill
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - 15, 0, Math.PI * 2)
    ctx.clip()

    if (loadedImg) {
      // Draw actual product photo clipped inside gold arch
      ctx.drawImage(loadedImg, centerX - (radius - 15), centerY - (radius - 15), (radius - 15) * 2, (radius - 15) * 2)
    } else {
      // Radiant golden glow fallback
      const winGrad = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, radius - 15)
      winGrad.addColorStop(0, 'rgba(212, 175, 55, 0.35)')
      winGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.45)')
      winGrad.addColorStop(1, 'rgba(0, 0, 0, 0.8)')
      ctx.fillStyle = winGrad
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2)

      // Fallback nut icon and text
      ctx.fillStyle = '#D4AF37'
      ctx.font = '84px serif'
      ctx.fillText('🌰', centerX, centerY - 15)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 26px Georgia, serif'
      ctx.fillText('100% PURE & RAW', centerX, centerY + 55)

      ctx.fillStyle = '#D4AF37'
      ctx.font = 'bold 16px system-ui, sans-serif'
      ctx.fillText('CRISP HIGH-OIL HARVEST', centerX, centerY + 85)
    }
    ctx.restore()

    // Gold seal label beneath medallion
    drawRoundedRect(ctx, centerX - 180, 955, 360, 36, 18)
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fill()
    ctx.strokeStyle = '#D4AF37'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.fillStyle = '#D4AF37'
    ctx.font = 'bold 15px system-ui, sans-serif'
    ctx.fillText('★ HAND-SELECTED ORCHARD RESERVE ★', centerX, 978)

    // 7. Feature Badges
    const drawBadge = (y: number, text: string) => {
      drawRoundedRect(ctx, 160, y, canvas.width - 320, 42, 21)
      ctx.fillStyle = 'rgba(255,255,255,0.07)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(212,175,55,0.7)'
      ctx.lineWidth = 1.2
      ctx.stroke()

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 15px system-ui, sans-serif'
      ctx.fillText(text, canvas.width / 2, y + 26)
    }

    drawBadge(1020, `✦ ORIGIN: ${origin.toUpperCase()}`)
    drawBadge(1075, '✦ ZERO CHEMICALS · UNBLEACHED')
    drawBadge(1130, '✦ NITROGEN SEALED VACUUM FRESHNESS')

    // 8. Bottom Footer
    ctx.strokeStyle = '#D4AF37'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(70, 1205)
    ctx.lineTo(canvas.width - 70, 1205)
    ctx.stroke()

    // Net Weight
    ctx.fillStyle = '#D4AF37'
    ctx.font = 'bold 24px system-ui, sans-serif'
    ctx.fillText('NET WT. 250g (8.8 OZ) · VACUUM PACKED', canvas.width / 2, 1245)

    // Certifications & Barcode
    // Green veg symbol
    ctx.strokeStyle = '#22C55E'
    ctx.lineWidth = 3
    ctx.strokeRect(100, 1290, 42, 42)
    ctx.fillStyle = '#22C55E'
    ctx.beginPath()
    ctx.arc(121, 1311, 11, 0, Math.PI * 2)
    ctx.fill()

    // FSSAI badge
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.font = 'bold 17px system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('fssai', 160, 1310)
    ctx.font = '14px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText('Lic. No. 22724441000048', 160, 1330)

    // Barcode block
    const barW = 160
    const barH = 55
    const barX = canvas.width - 260
    const barY = 1285
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(barX, barY, barW, barH)

    ctx.fillStyle = '#000000'
    let bx = barX + 10
    for (let i = 0; i < 22; i++) {
      const w = i % 3 === 0 || i % 7 === 0 ? 4 : 2
      ctx.fillRect(bx, barY + 5, w, 35)
      bx += i % 2 === 0 ? 6 : 5
    }
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('8 901234 567890', barX + barW / 2, barY + 50)
  }

  renderContent()

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true

  // If a real product image is provided, load and re-render inside the window
  if (productImage) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      renderContent(img)
      texture.needsUpdate = true
      if (onImageLoad) onImageLoad()
    }
    img.src = productImage
  }

  return texture
}

/**
 * Creates the back label texture with nutrition facts and origin promise.
 */
function createPouchBackTexture(
  productName: string,
  baseColorHex: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1536
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = baseColorHex
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0)
  grad.addColorStop(0, 'rgba(0,0,0,0.3)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.05)')
  grad.addColorStop(1, 'rgba(0,0,0,0.3)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Border
  ctx.strokeStyle = '#D4AF37'
  ctx.lineWidth = 4
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72)

  // Header
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 44px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('NUTY TALES FOODS', canvas.width / 2, 105)

  ctx.fillStyle = '#D4AF37'
  ctx.font = 'bold 18px system-ui, sans-serif'
  ctx.fillText('NUTRITIONAL INFORMATION (PER 100g)', canvas.width / 2, 150)

  // Nutrition Table Box
  const tableX = 80
  const tableY = 180
  const tableW = canvas.width - 160
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fillRect(tableX, tableY, tableW, 440)
  ctx.strokeStyle = 'rgba(212,175,55,0.6)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(tableX, tableY, tableW, 440)

  const rows = [
    ['Energy / Calories', '579 kcal'],
    ['Total Protein', '21.2 g'],
    ['Dietary Fiber', '12.5 g'],
    ['Healthy Unsaturated Fats', '49.9 g'],
    ['Total Carbohydrates', '21.6 g'],
    ['Calcium', '269 mg'],
    ['Iron', '3.7 mg'],
    ['Vitamin E (Alpha-tocopherol)', '25.6 mg (170% DV)'],
  ]

  ctx.font = '18px system-ui, sans-serif'
  rows.forEach((r, idx) => {
    const y = tableY + 45 + idx * 50
    ctx.fillStyle = '#EAE3D5'
    ctx.textAlign = 'left'
    ctx.fillText(r[0], tableX + 30, y)
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'right'
    ctx.fillText(r[1], tableX + tableW - 30, y)

    if (idx < rows.length - 1) {
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.beginPath()
      ctx.moveTo(tableX + 20, y + 16)
      ctx.lineTo(tableX + tableW - 20, y + 16)
      ctx.stroke()
    }
  })

  // Ingredients Box
  ctx.textAlign = 'center'
  ctx.fillStyle = '#D4AF37'
  ctx.font = 'bold 22px system-ui, sans-serif'
  ctx.fillText('✦ INGREDIENTS & PURITY DECLARATION ✦', canvas.width / 2, 690)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = '18px system-ui, sans-serif'
  ctx.fillText('100% Whole Hand-Graded Dry Fruits.', canvas.width / 2, 735)
  ctx.fillText('Zero chemical treatment. Unpasteurized. No added oil, salt or preservatives.', canvas.width / 2, 770)
  ctx.fillStyle = '#EAE3D5'
  ctx.font = 'italic 16px Georgia, serif'
  ctx.fillText('Hermetically vacuum-sealed under food-grade nitrogen to prevent oil oxidation.', canvas.width / 2, 805)

  // Kashmir Terroir Story
  ctx.fillStyle = '#D4AF37'
  ctx.font = 'bold 22px Georgia, serif'
  ctx.fillText('OUR KASHMIR HERITAGE COMMITMENT', canvas.width / 2, 885)

  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = 'italic 17px Georgia, serif'
  ctx.fillText('From generational grower estates nestled in high-altitude Kashmiri valleys,', canvas.width / 2, 925)
  ctx.fillText('Nuty Tales curates uncompromised purity directly to discerning culinary connoisseurs.', canvas.width / 2, 955)

  // QR Code Authenticity Box
  const qrX = canvas.width / 2 - 80
  const qrY = 1010
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(qrX, qrY, 160, 160)
  ctx.fillStyle = '#000000'
  ctx.fillRect(qrX + 15, qrY + 15, 45, 45)
  ctx.fillRect(qrX + 100, qrY + 15, 45, 45)
  ctx.fillRect(qrX + 15, qrY + 100, 45, 45)
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(qrX + 25, qrY + 25, 25, 25)
  ctx.fillRect(qrX + 110, qrY + 25, 25, 25)
  ctx.fillRect(qrX + 25, qrY + 110, 25, 25)

  ctx.fillStyle = '#D4AF37'
  ctx.font = 'bold 15px system-ui, sans-serif'
  ctx.fillText('SCAN FOR LAB BATCH CERTIFICATE', canvas.width / 2, 1205)

  // Footer & Compliance
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = '15px system-ui, sans-serif'
  ctx.fillText('Marketed By: Nuty Tales Foods · FSSAI Lic. 22724441000048', canvas.width / 2, 1260)
  ctx.fillText('Customer Support: care@nutytales.com · www.nutytales.com', canvas.width / 2, 1295)
  ctx.fillText('Batch: NT-2026-H89 · Best Before: 12 Months from Packaging', canvas.width / 2, 1330)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

/**
 * Creates the luxury gift box lid texture with satin ribbon and gold foiled seal.
 */
function createGiftBoxLidTexture(
  productName: string,
  baseColorHex: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 768
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = baseColorHex
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Gold Satin Ribbon (cross)
  ctx.fillStyle = '#D4AF37'
  ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60)
  ctx.fillRect(canvas.width / 2 - 30, 0, 60, canvas.height)

  // Center Gold Foil Royal Monogram Crest
  const cx = canvas.width / 2
  const cy = canvas.height / 2
  ctx.fillStyle = '#C9A45C'
  ctx.beginPath()
  ctx.arc(cx, cy, 140, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 4
  ctx.stroke()

  ctx.fillStyle = '#17233B'
  ctx.beginPath()
  ctx.arc(cx, cy, 126, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#D4AF37'
  ctx.font = 'bold 36px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('✦ NUTY TALES ✦', cx, cy - 20)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 16px system-ui, sans-serif'
  ctx.fillText('BESPOKE KASHMIR GIFTING', cx, cy + 20)

  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = '12px system-ui, sans-serif'
  ctx.fillText('CONNOISSEUR COLLECTION', cx, cy + 45)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

/**
 * Creates a brass engraved nameplate for the Kashmiri walnut wood box.
 */
function createBrassPlateTexture(productName: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 260
  const ctx = canvas.getContext('2d')!

  // Polished Antique Brass Base
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  grad.addColorStop(0, '#B8860B')
  grad.addColorStop(0.3, '#FFD700')
  grad.addColorStop(0.5, '#FFF8DC')
  grad.addColorStop(0.7, '#DAA520')
  grad.addColorStop(1, '#8B6508')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Beveled Edge Border
  ctx.strokeStyle = '#5B4010'
  ctx.lineWidth = 6
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)
  ctx.strokeStyle = '#FFF8DC'
  ctx.lineWidth = 2
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36)

  // Corner Screws
  const drawScrew = (x: number, y: number) => {
    ctx.fillStyle = '#4A3510'
    ctx.beginPath()
    ctx.arc(x, y, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x - 5, y)
    ctx.lineTo(x + 5, y)
    ctx.stroke()
  }
  drawScrew(25, 25)
  drawScrew(canvas.width - 25, 25)
  drawScrew(25, canvas.height - 25)
  drawScrew(canvas.width - 25, canvas.height - 25)

  // Engraved Text
  ctx.fillStyle = '#1A1208'
  ctx.font = 'bold 36px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('✦ NUTY TALES ✦', canvas.width / 2, 85)

  ctx.font = 'bold 20px system-ui, sans-serif'
  ctx.fillText('HAND-CARVED KASHMIRI WALNUT CHEST', canvas.width / 2, 135)

  ctx.font = 'italic 16px Georgia, serif'
  ctx.fillText('Connoisseur Reserve · Certified Artisan Origin', canvas.width / 2, 175)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export default function ProductViewer3D({
  isOpen,
  onClose,
  productName,
  modelType = 'pouch',
  price,
  productImage,
  origin,
  onAddToCart,
}: ProductViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [capabilities, setCapabilities] = useState<{ tier: QualityTier; maxDpr: number } | null>(null)
  const [activeColor, setActiveColor] = useState<string>('#17233B')
  const [autoRotate, setAutoRotate] = useState(true)
  const autoRotateRef = useRef(true)
  autoRotateRef.current = autoRotate
  const [addedNotice, setAddedNotice] = useState(false)
  const controlsRef = useRef<{
    setFront: () => void
    setBack: () => void
    reset: () => void
  } | null>(null)

  useEffect(() => {
    setCapabilities(detect3DCapabilities())
  }, [])

  useEffect(() => {
    if (!isOpen || !mountRef.current || capabilities?.tier === 'FALLBACK') return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // ── Three.js Scene Setup ───────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf7f2e8)

    // Calculate model-specific framing parameters so model is perfectly centered and large
    let targetY = 0.035
    let initCamY = 0.08
    let initCamZ = 2.45
    let groundY = -0.83

    if (modelType === 'gift-box') {
      targetY = -0.05
      initCamY = 0.65
      initCamZ = 2.2
      groundY = -0.51
    } else if (modelType === 'walnut-chest') {
      targetY = -0.05
      initCamY = 0.65
      initCamZ = 2.2
      groundY = -0.46
    } else if (modelType === 'papier-mache') {
      targetY = 0
      initCamY = 0.55
      initCamZ = 2.0
      groundY = -0.34
    }

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100)
    camera.position.set(0, initCamY, initCamZ)
    camera.lookAt(0, targetY, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: capabilities?.tier !== 'LOW', alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(capabilities?.maxDpr || 1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = capabilities?.tier === 'HIGH'
    container.appendChild(renderer.domElement)

    // ── Lighting Rig ───────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.05)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0xfff5e6, 2.2)
    dirLight1.position.set(3, 4.5, 3.5)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0xddeeff, 1.2)
    dirLight2.position.set(-3, 2, -2.5)
    scene.add(dirLight2)

    // Shadow ground plane
    const planeGeo = new THREE.PlaneGeometry(10, 10)
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.15 })
    const plane = new THREE.Mesh(planeGeo, planeMat)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = groundY
    plane.receiveShadow = true
    scene.add(plane)

    // Soft grounded contact shadow under model (anchors pouch realistically across all devices)
    const shadowCanvas = document.createElement('canvas')
    shadowCanvas.width = 256
    shadowCanvas.height = 256
    const sCtx = shadowCanvas.getContext('2d')
    if (sCtx) {
      const sGrad = sCtx.createRadialGradient(128, 128, 15, 128, 128, 120)
      sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.35)')
      sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.12)')
      sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      sCtx.fillStyle = sGrad
      sCtx.fillRect(0, 0, 256, 256)
    }
    const contactShadowTex = new THREE.CanvasTexture(shadowCanvas)
    const contactShadowGeo = new THREE.PlaneGeometry(1.6, 0.75)
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      depthWrite: false,
    })
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat)
    contactShadow.rotation.x = -Math.PI / 2
    contactShadow.position.y = groundY + 0.005
    scene.add(contactShadow)

    // ── Procedural PBR Model Construction ──────────────────────────────────────
    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    let mainMesh: THREE.Mesh | null = null

    if (modelType === 'gift-box') {
      // Luxury Rigid Presentation Box (Base + Lid)
      const boxGeo = new THREE.BoxGeometry(1.6, 0.6, 1.2)
      const boxMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColor),
        roughness: 0.35,
        metalness: 0.1,
      })
      mainMesh = new THREE.Mesh(boxGeo, boxMat)
      mainMesh.position.y = -0.2
      rootGroup.add(mainMesh)

      // Gold Foil Trim & Monogram Plate on Lid
      const lidGeo = new THREE.BoxGeometry(1.64, 0.15, 1.24)
      const lidMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColor),
        roughness: 0.3,
        metalness: 0.15,
      })
      const lid = new THREE.Mesh(lidGeo, lidMat)
      lid.position.y = 0.15
      rootGroup.add(lid)

      // Branded Lid Texture Plate
      const lidTexture = createGiftBoxLidTexture(productName, activeColor)
      const lidPlateGeo = new THREE.PlaneGeometry(1.6, 1.2)
      const lidPlateMat = new THREE.MeshStandardMaterial({
        map: lidTexture,
        roughness: 0.25,
        metalness: 0.15,
      })
      const lidPlate = new THREE.Mesh(lidPlateGeo, lidPlateMat)
      lidPlate.rotation.x = -Math.PI / 2
      lidPlate.position.set(0, 0.228, 0)
      rootGroup.add(lidPlate)
    } else if (modelType === 'walnut-chest') {
      // Hand-Carved Kashmiri Walnut Wood Box
      const chestGeo = new THREE.BoxGeometry(1.5, 0.7, 1.1)
      const woodMat = new THREE.MeshStandardMaterial({
        color: 0x4a3525,
        roughness: 0.55,
        metalness: 0.05,
      })
      mainMesh = new THREE.Mesh(chestGeo, woodMat)
      mainMesh.position.y = -0.1
      rootGroup.add(mainMesh)

      // Brass Hinges and Latch
      const latchGeo = new THREE.BoxGeometry(0.12, 0.18, 0.05)
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 })
      const latch = new THREE.Mesh(latchGeo, brassMat)
      latch.position.set(0, -0.05, 0.56)
      rootGroup.add(latch)

      // Engraved Nuty Tales Brass Nameplate
      const plateTexture = createBrassPlateTexture(productName)
      const plateGeo = new THREE.PlaneGeometry(0.95, 0.32)
      const plateMat = new THREE.MeshStandardMaterial({
        map: plateTexture,
        metalness: 0.85,
        roughness: 0.2,
      })
      const plate = new THREE.Mesh(plateGeo, plateMat)
      plate.position.set(0, 0.12, 0.554)
      rootGroup.add(plate)
    } else if (modelType === 'papier-mache') {
      // Lacquered Papier-Mâché Floral Trinket Box
      const cylGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.65, 32)
      const lacquerMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColor),
        roughness: 0.15,
        metalness: 0.25,
      })
      mainMesh = new THREE.Mesh(cylGeo, lacquerMat)
      rootGroup.add(mainMesh)

      // Gold leaf patterned rim
      const ringGeo = new THREE.TorusGeometry(0.71, 0.03, 16, 64)
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a45c, metalness: 0.95, roughness: 0.15 })
      const ring = new THREE.Mesh(ringGeo, goldMat)
      ring.rotation.x = Math.PI / 2
      ring.position.y = 0.3
      rootGroup.add(ring)

      // Top Lid Monogram Medal
      const topPlateGeo = new THREE.CircleGeometry(0.62, 32)
      const topPlateMat = new THREE.MeshStandardMaterial({
        map: createGiftBoxLidTexture(productName, activeColor),
        roughness: 0.2,
        metalness: 0.2,
      })
      const topPlate = new THREE.Mesh(topPlateGeo, topPlateMat)
      topPlate.rotation.x = -Math.PI / 2
      topPlate.position.set(0, 0.33, 0)
      rootGroup.add(topPlate)
    } else {
      // ── Nuty Tales Stand-Up Matte Resealable Barrier Pouch ───────────────────
      // Main pouch core
      const pouchGeo = new THREE.BoxGeometry(1.12, 1.62, 0.44)
      const pouchMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColor),
        roughness: 0.35,
        metalness: 0.08,
      })
      mainMesh = new THREE.Mesh(pouchGeo, pouchMat)
      rootGroup.add(mainMesh)

      // Branded Front Label
      const frontTex = createPouchFrontTexture(
        productName,
        activeColor,
        origin || 'Kashmir, India',
        productImage,
        () => renderer.render(scene, camera)
      )
      const frontLabelGeo = new THREE.PlaneGeometry(1.08, 1.56)
      const frontLabelMat = new THREE.MeshStandardMaterial({
        map: frontTex,
        roughness: 0.28,
        metalness: 0.12,
      })
      const frontLabel = new THREE.Mesh(frontLabelGeo, frontLabelMat)
      frontLabel.position.set(0, 0, 0.223)
      rootGroup.add(frontLabel)

      // Branded Back Label with Nutrition & Certifications
      const backTex = createPouchBackTexture(productName, activeColor)
      const backLabelGeo = new THREE.PlaneGeometry(1.08, 1.56)
      const backLabelMat = new THREE.MeshStandardMaterial({
        map: backTex,
        roughness: 0.38,
        metalness: 0.05,
      })
      const backLabel = new THREE.Mesh(backLabelGeo, backLabelMat)
      backLabel.position.set(0, 0, -0.223)
      backLabel.rotation.y = Math.PI
      rootGroup.add(backLabel)

      // Metallic Gold Foil Top Zip Strip
      const zipGeo = new THREE.BoxGeometry(1.14, 0.14, 0.06)
      const zipMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.2,
      })
      const zip = new THREE.Mesh(zipGeo, zipMat)
      zip.position.set(0, 0.81, 0)
      rootGroup.add(zip)

      // Sommelier Hanging Punch Hole Slot
      const holeGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.07, 16)
      const holeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 })
      const hole = new THREE.Mesh(holeGeo, holeMat)
      hole.rotation.x = Math.PI / 2
      hole.position.set(0, 0.825, 0)
      rootGroup.add(hole)
    }

    // ── Mouse & Touch Orbit Controls (No extra library needed) ────────────────
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true
      autoRotateRef.current = false
      setAutoRotate(false)
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      prevMouseX = clientX
      prevMouseY = clientY
    }

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const deltaX = clientX - prevMouseX
      const deltaY = clientY - prevMouseY
      prevMouseX = clientX
      prevMouseY = clientY

      rootGroup.rotation.y += deltaX * 0.01
      rootGroup.rotation.x = Math.max(-0.35, Math.min(0.35, rootGroup.rotation.x + deltaY * 0.007))
    }

    const onPointerUp = () => {
      isDragging = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z = Math.max(1.5, Math.min(3.8, camera.position.z + e.deltaY * 0.0025))
      camera.lookAt(0, targetY, 0)
    }

    // Expose quick snap view methods to UI buttons
    controlsRef.current = {
      setFront: () => {
        autoRotateRef.current = false
        setAutoRotate(false)
        rootGroup.rotation.set(0, 0, 0)
      },
      setBack: () => {
        autoRotateRef.current = false
        setAutoRotate(false)
        rootGroup.rotation.set(0, Math.PI, 0)
      },
      reset: () => {
        autoRotateRef.current = false
        setAutoRotate(false)
        rootGroup.rotation.set(0, 0, 0)
        camera.position.set(0, initCamY, initCamZ)
        camera.lookAt(0, targetY, 0)
      },
    }

    const domEl = renderer.domElement
    domEl.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)
    domEl.addEventListener('touchstart', onPointerDown, { passive: true })
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    window.addEventListener('touchend', onPointerUp)
    domEl.addEventListener('wheel', onWheel, { passive: false })

    // ── Animation Loop ────────────────────────────────────────────────────────
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      if (autoRotateRef.current) {
        rootGroup.rotation.y += 0.006
      }

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize Observer ───────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // ── Cleanup and Resource Disposal ─────────────────────────────────────────
    return () => {
      controlsRef.current = null
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      domEl.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      domEl.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('touchend', onPointerUp)
      domEl.removeEventListener('wheel', onWheel)

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose())
          } else {
            obj.material.dispose()
          }
        }
      })
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [isOpen, capabilities, modelType, activeColor, productName, productImage, origin])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF6EE] text-[#17233B] rounded-3xl max-w-4xl w-full overflow-hidden flex flex-col shadow-2xl border border-[#C9A45C]/40 max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#17233B] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C9A45C] text-[#17233B] flex items-center justify-center font-bold text-xs shadow-inner">
              3D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                  Nuty Tales Official Packaging
                </span>
                <span className="text-white/40">•</span>
                <span className="text-[10px] text-emerald-400 font-semibold">FSSAI Certified</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">{productName}</h3>
              <p className="text-[11px] text-stone-300 font-light">
                Interactive 360° Inspection · Front &amp; Back High-Definition PBR Viewer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="relative w-full h-[400px] sm:h-[480px] bg-[#F7F2E8] overflow-hidden cursor-grab active:cursor-grabbing select-none">
          <div ref={mountRef} className="w-full h-full" />

          {/* Floating Canvas Overlay Instructions */}
          <div className="absolute top-4 left-4 bg-[#17233B]/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-2 border border-white/15 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Drag to rotate 360° · Front &amp; Back Inspection · Scroll to zoom</span>
            <span className="sm:hidden">Drag to rotate 360° · Pinch/scroll to zoom</span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => controlsRef.current?.setFront()}
              className="bg-white/90 hover:bg-white text-[#17233B] text-[11px] font-bold px-2.5 py-1.5 rounded-full border border-stone-200 shadow-sm transition-colors"
              title="Snap to Front View"
            >
              Front
            </button>
            <button
              onClick={() => controlsRef.current?.setBack()}
              className="bg-white/90 hover:bg-white text-[#17233B] text-[11px] font-bold px-2.5 py-1.5 rounded-full border border-stone-200 shadow-sm transition-colors"
              title="Snap to Back Nutrition & Certifications"
            >
              Back
            </button>
            <button
              onClick={() => controlsRef.current?.reset()}
              className="bg-white/90 hover:bg-white text-[#17233B] text-[11px] font-bold px-2.5 py-1.5 rounded-full border border-stone-200 shadow-sm transition-colors hidden sm:inline-block"
              title="Reset View"
            >
              Reset
            </button>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="bg-white/90 hover:bg-white px-3 py-1.5 rounded-full text-[11px] font-semibold text-[#17233B] border border-stone-200 shadow-sm transition-colors"
            >
              {autoRotate ? '⏸ Pause' : '▶ Spin'}
            </button>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-5 sm:p-6 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Color Switcher */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#704B32] uppercase text-[10px] tracking-wider">
              Finish Shade:
            </span>
            <div className="flex items-center gap-2">
              {[
                { name: 'Imperial Navy', hex: '#17233B' },
                { name: 'Valley Emerald', hex: '#176B68' },
                { name: 'Royal Crimson', hex: '#581C25' },
                { name: 'Walnut Teak', hex: '#4A3525' },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => setActiveColor(c.hex)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    activeColor === c.hex ? 'scale-125 ring-2 ring-[#C9A45C]' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Actions & Certifications */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {price && (
              <span className="text-xl font-bold text-[#17233B] mr-2">
                ₹{price.toLocaleString('en-IN')}
              </span>
            )}
            {onAddToCart && (
              <button
                onClick={() => {
                  onAddToCart()
                  setAddedNotice(true)
                  setTimeout(() => setAddedNotice(false), 2500)
                }}
                className="flex-1 sm:flex-initial px-6 py-3 bg-[#17233B] hover:bg-[#176B68] text-white font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md"
              >
                {addedNotice ? '✓ Added to Basket' : 'Add to Basket'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
