import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { lenisRef, pointerX, pointerY, shared } from './state/shared'
import Scene3D from './components/Scene3D'
import CursorFX from './components/CursorFX'
import Loader from './components/Loader'
import Nav from './components/Nav'
import SocialDock from './components/SocialDock'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Methodology from './components/Methodology'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Certifications from './components/Certifications'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'

// Weak devices start in "lite" mode (fewer particles, no blur).
function startsLite() {
  const params = new URLSearchParams(window.location.search)
  if (params.has('lite')) return true
  const cores = navigator.hardwareConcurrency || 8
  const mem = navigator.deviceMemory || 8
  return cores <= 2 || mem <= 2
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [lite, setLite] = useState(startsLite)
  const finish = useCallback(() => setReady(true), [])

  // Scroll progress and speed for the 3D scene.
  useEffect(() => {
    let lastY = window.scrollY
    let lastT = performance.now()
    const onScroll = () => {
      const y = window.scrollY
      const now = performance.now()
      const max = document.documentElement.scrollHeight - window.innerHeight
      shared.scroll = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0
      const dtm = now - lastT
      if (dtm > 0) shared.vel = ((y - lastY) / dtm) * 16.67
      lastY = y
      lastT = now
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Pointer position for the particles, shapes, and floating tags.
  useEffect(() => {
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -((e.clientY / window.innerHeight) * 2 - 1)
      shared.pointer.x = nx
      shared.pointer.y = ny
      shared.hasPointer = true
      pointerX.set(nx)
      pointerY.set(ny)
    }
    const onEnd = (e) => {
      if (e.pointerType !== 'mouse') shared.hasPointer = false
    }
    const onLeave = () => {
      shared.hasPointer = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onEnd, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  // Lock scrolling while the intro plays.
  useEffect(() => {
    document.body.style.overflow = ready ? '' : 'hidden'
  }, [ready])

  // Smooth, inertial scrolling (skipped when the visitor prefers reduced motion).
  useEffect(() => {
    if (!ready) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 1 })
    lenisRef.current = lenis
    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [ready])

  // Quality switch: "lite" removes glass blur and lowers particle counts.
  useEffect(() => {
    document.documentElement.classList.toggle('lite', lite)
  }, [lite])

  // If the page runs slowly, switch to lite automatically.
  useEffect(() => {
    if (!ready || lite) return undefined
    let raf
    let frames = 0
    let start = performance.now()
    let warmup = 2
    let slow = 0
    const tick = (now) => {
      frames += 1
      if (now - start >= 1500) {
        const fps = (frames * 1000) / (now - start)
        frames = 0
        start = now
        if (warmup > 0) {
          warmup -= 1
        } else if (fps < 40) {
          slow += 1
          if (slow >= 2) {
            setLite(true)
            return
          }
        } else {
          slow = 0
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ready, lite])

  return (
    <>
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <Scene3D lite={lite} />
      <div className="vignette" aria-hidden="true" />
      <CursorFX />
      <AnimatePresence>{!ready && <Loader onDone={finish} />}</AnimatePresence>

      <Nav show={ready} />
      <SocialDock show={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Methodology />
        <Skills />
        <Projects />
        <Certifications />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
