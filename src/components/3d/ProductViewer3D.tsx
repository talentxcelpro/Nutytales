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
  onAddToCart?: () => void
}

export default function ProductViewer3D({
  isOpen,
  onClose,
  productName,
  modelType = 'gift-box',
  price,
  onAddToCart,
}: ProductViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [capabilities, setCapabilities] = useState<{ tier: QualityTier; maxDpr: number } | null>(null)
  const [activeColor, setActiveColor] = useState<string>('#17233B')
  const [activeLighting, setActiveLighting] = useState<'daylight' | 'winter' | 'fireplace'>('daylight')
  const [autoRotate, setAutoRotate] = useState(true)
  const autoRotateRef = useRef(true)
  autoRotateRef.current = autoRotate
  const [addedNotice, setAddedNotice] = useState(false)

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

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 1.2, 3.2)

    const renderer = new THREE.WebGLRenderer({ antialias: capabilities?.tier !== 'LOW', alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(capabilities?.maxDpr || 1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.shadowMap.enabled = capabilities?.tier === 'HIGH'
    container.appendChild(renderer.domElement)

    // ── Lighting Rig ───────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0xfff5e6, 1.8)
    dirLight1.position.set(3, 5, 3)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0xddeeff, 0.9)
    dirLight2.position.set(-3, 2, -2)
    scene.add(dirLight2)

    // Shadow ground plane
    const planeGeo = new THREE.PlaneGeometry(10, 10)
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.15 })
    const plane = new THREE.Mesh(planeGeo, planeMat)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -0.7
    plane.receiveShadow = true
    scene.add(plane)

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

      // Gold Monogram Badge
      const badgeGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 32)
      const badgeMat = new THREE.MeshStandardMaterial({
        color: 0xc9a45c,
        metalness: 0.9,
        roughness: 0.2,
      })
      const badge = new THREE.Mesh(badgeGeo, badgeMat)
      badge.position.set(0, 0.23, 0)
      rootGroup.add(badge)
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
    } else {
      // Nuty Tales Stand-Up Matte Resealable Pouch
      const pouchGeo = new THREE.BoxGeometry(1.1, 1.6, 0.45)
      const pouchMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColor),
        roughness: 0.4,
        metalness: 0.05,
      })
      mainMesh = new THREE.Mesh(pouchGeo, pouchMat)
      rootGroup.add(mainMesh)

      // Top seal zip strip
      const zipGeo = new THREE.BoxGeometry(1.12, 0.12, 0.05)
      const zipMat = new THREE.MeshStandardMaterial({ color: 0xc9a45c, metalness: 0.8, roughness: 0.3 })
      const zip = new THREE.Mesh(zipGeo, zipMat)
      zip.position.set(0, 0.8, 0)
      rootGroup.add(zip)
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
      rootGroup.rotation.x = Math.max(-0.6, Math.min(0.6, rootGroup.rotation.x + deltaY * 0.008))
    }

    const onPointerUp = () => {
      isDragging = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z = Math.max(1.8, Math.min(5.0, camera.position.z + e.deltaY * 0.003))
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
  }, [isOpen, capabilities, modelType, activeColor])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF6EE] text-[#17233B] rounded-3xl max-w-4xl w-full overflow-hidden flex flex-col shadow-2xl border border-[#C9A45C]/40 max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#17233B] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C9A45C] text-[#17233B] flex items-center justify-center font-bold text-xs shadow-inner">
              3D
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">{productName}</h3>
              <p className="text-[11px] text-stone-300 font-light">
                Interactive 360° Inspection · Three.js PBR Material Viewer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="relative w-full h-[380px] sm:h-[460px] bg-[#F7F2E8] overflow-hidden cursor-grab active:cursor-grabbing">
          <div ref={mountRef} className="w-full h-full" />

          {/* Floating Canvas Overlay Instructions */}
          <div className="absolute top-4 left-4 bg-[#17233B]/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-2 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Drag to rotate 360° · Scroll to zoom</span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-[#17233B] border border-stone-200 shadow-sm hover:bg-white transition-colors"
            >
              {autoRotate ? '⏸ Pause Spin' : '▶ Auto Spin'}
            </button>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-6 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Color Switcher */}
          <div className="flex items-center gap-4">
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

          {/* Actions */}
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
