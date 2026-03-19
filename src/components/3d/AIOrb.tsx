'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function AIOrb() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    if (window.innerWidth < 768) return

    const w = 280, h = 280
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.z = 3.5

    const renderer = new THREE.WebGLRenderer({
      alpha: true, antialias: true })
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountRef.current.appendChild(renderer.domElement)

    // Outer wireframe sphere
    const sphereGeo = new THREE.SphereGeometry(1.2, 16, 16)
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x6366F1,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    scene.add(sphere)

    // Inner glowing core
    const coreGeo = new THREE.SphereGeometry(0.6, 32, 32)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.4,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    scene.add(core)

    // Orbiting ring 1
    const ring1Geo = new THREE.TorusGeometry(1.5, 0.015, 8, 80)
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x06B6D4, transparent: true, opacity: 0.5 })
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
    ring1.rotation.x = Math.PI / 2.5
    scene.add(ring1)

    // Orbiting ring 2
    const ring2Geo = new THREE.TorusGeometry(1.5, 0.015, 8, 80)
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xA5B4FC, transparent: true, opacity: 0.35 })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.x = Math.PI / 2.5
    ring2.rotation.z = Math.PI / 3
    scene.add(ring2)

    // Floating data points (small spheres orbiting)
    const dotGeo = new THREE.SphereGeometry(0.06, 8, 8)
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xC4B5FD })
    const dots: THREE.Mesh[] = []
    for (let i = 0; i < 8; i++) {
      const dot = new THREE.Mesh(dotGeo, dotMat)
      scene.add(dot)
      dots.push(dot)
    }

    const clock = new THREE.Clock()
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      sphere.rotation.y = t * 0.15
      sphere.rotation.x = t * 0.08
      core.rotation.y = -t * 0.2
      ring1.rotation.z = t * 0.3
      ring2.rotation.y = t * 0.25

      dots.forEach((dot, i) => {
        const angle = t * 0.5 + (i / dots.length) * Math.PI * 2
        const radius = 1.5
        dot.position.x = Math.cos(angle) * radius
        dot.position.y = Math.sin(angle * 0.7) * 0.6
        dot.position.z = Math.sin(angle) * radius * 0.5
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        width: '280px',
        height: '280px',
        pointerEvents: 'none',
        opacity: 0.85,
      }}
    />
  )
}
