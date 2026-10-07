'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { detect3DCapabilities, QualityTier } from './DeviceCapability'
import ProductViewer3D from './ProductViewer3D'

export default function HomepageHero3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [capabilities, setCapabilities] = useState<{ tier: QualityTier; maxDpr: number } | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setCapabilities(detect3DCapabilities())
  }, [])

  useEffect(() => {
    if (!capabilities || capabilities.tier === 'FALLBACK' || !containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || 500

    // ── Three.js Scene Setup ───────────────────────────────────────────────────
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0, 0, 8.5)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: capabilities.tier !== 'LOW',
      powerPreference: 'low-power',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(capabilities.maxDpr, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    container.appendChild(renderer.domElement)

    // ── Ambient & Soft Directional Lighting ────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xfff6ec, 1.2)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0xffedd5, 1.5)
    dirLight1.position.set(4, 5, 4)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0xc9a45c, 0.8)
    dirLight2.position.set(-4, -2, 2)
    scene.add(dirLight2)

    // ── Floating Nut Geometries ────────────────────────────────────────────────
    const group = new THREE.Group()
    scene.add(group)

    // Almond 1: Golden Mamra Almond
    const almondGeo = new THREE.SphereGeometry(0.7, 24, 24)
    almondGeo.scale(0.65, 1.25, 0.45)
    const almondMat = new THREE.MeshStandardMaterial({
      color: 0xd49b60,
      roughness: 0.65,
      metalness: 0.05,
    })
    const almondMesh = new THREE.Mesh(almondGeo, almondMat)
    almondMesh.position.set(3.2, 1.2, 0)
    almondMesh.rotation.set(0.4, 0.3, 0.6)
    group.add(almondMesh)

    // Almond 2: Smaller background almond
    const almond2Mesh = almondMesh.clone()
    almond2Mesh.scale.set(0.6, 0.6, 0.6)
    almond2Mesh.position.set(-3.5, 1.8, -1.5)
    almond2Mesh.rotation.set(-0.5, 0.8, -0.4)
    group.add(almond2Mesh)

    // Walnut: Kagzi Akhrot
    const walnutGeo = new THREE.DodecahedronGeometry(0.75, 2)
    walnutGeo.scale(1.0, 1.15, 0.9)
    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x7a5230,
      roughness: 0.75,
      metalness: 0.05,
    })
    const walnutMesh = new THREE.Mesh(walnutGeo, walnutMat)
    walnutMesh.position.set(-3.2, -1.0, 0.5)
    walnutMesh.rotation.set(0.2, 0.5, 0.3)
    group.add(walnutMesh)

    // Golden Saffron Pollen / Pistachio Accent Particle
    const accentGeo = new THREE.SphereGeometry(0.4, 16, 16)
    accentGeo.scale(0.8, 1.1, 0.7)
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x8a9a5b, // Pistachio Green
      roughness: 0.5,
      metalness: 0.1,
    })
    const pistachioMesh = new THREE.Mesh(accentGeo, accentMat)
    pistachioMesh.position.set(3.6, -1.6, -0.8)
    group.add(pistachioMesh)

    // Gold dust specs
    const particleCount = capabilities.tier === 'HIGH' ? 24 : 12
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10
      positions[i + 1] = (Math.random() - 0.5) * 6
      positions[i + 2] = (Math.random() - 0.5) * 4
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xc9a45c,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── Mouse Parallax ─────────────────────────────────────────────────────────
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 0.4
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // ── Render & Animation Loop ────────────────────────────────────────────────
    let animId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Smooth parallax interpolation
      currentX += (targetX - currentX) * 0.05
      currentY += (targetY - currentY) * 0.05
      group.rotation.y = currentX
      group.rotation.x = currentY

      // Subtle organic floating oscillations
      almondMesh.position.y = 1.2 + Math.sin(elapsed * 0.8) * 0.12
      almondMesh.rotation.y += 0.005
      almondMesh.rotation.z += 0.003

      almond2Mesh.position.y = 1.8 + Math.cos(elapsed * 0.7) * 0.08
      almond2Mesh.rotation.y -= 0.004

      walnutMesh.position.y = -1.0 + Math.cos(elapsed * 0.9) * 0.1
      walnutMesh.rotation.y += 0.004
      walnutMesh.rotation.x += 0.003

      pistachioMesh.position.y = -1.6 + Math.sin(elapsed * 1.1) * 0.09
      pistachioMesh.rotation.y -= 0.006

      particles.rotation.y = elapsed * 0.02

      renderer.render(scene, camera)
    }
    animate()
    setIsReady(true)

    // ── Resize Observer ────────────────────────────────────────────────────────
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── Cleanup ────────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
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
  }, [capabilities])

  return (
    <>
      {/* 3D Canvas Layer */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 z-0 overflow-hidden ${
          isReady ? 'opacity-70' : 'opacity-0'
        }`}
      />

      {/* Floating 3D Packaging Explorer Badge */}
      <div className="hidden sm:inline-flex items-center gap-2">
        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-[#17233B] text-[11px] font-bold tracking-wider uppercase border border-stone-300 shadow-sm transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-[#176B68] animate-ping" />
          <span>3D Pack Inspection</span>
          <span className="text-[#C9A45C]">✦</span>
        </button>
      </div>

      {/* Full 3D Modal */}
      <ProductViewer3D
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        productName="Nuty Tales Premium Almonds (250g)"
        modelType="pouch"
        price={425}
      />
    </>
  )
}
