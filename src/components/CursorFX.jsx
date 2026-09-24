import { useEffect, useRef } from 'react'

/*
  Cursor system (runs in one requestAnimationFrame loop, no React re-renders):
   - a bright dot that follows the mouse exactly
   - a ring that trails it smoothly
   - over buttons and links the ring "locks on" like a targeting reticle,
     morphing to the element's exact shape with corner brackets
   - over big cards it grows and takes the card's label
   - a glowing comet trail that flows behind the mouse
   - clicks send out a shockwave and sparks that float upward
  Only runs on devices with a real mouse.
*/
const TAU = Math.PI * 2
const TRAIL_LIFE = 520
const MAX_TRAIL = 140

export default function CursorFX() {
  const layerRef = useRef(null)
  const canvasRef = useRef(null)
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const tagRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    const layer = layerRef.current
    const canvas = canvasRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    const tag = tagRef.current
    const tagText = tag.firstChild
    const ctx = canvas.getContext('2d')

    let W = window.innerWidth
    let H = window.innerHeight
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const s = {
      mx: -300, my: -300, // mouse
      hx: -300, hy: -300, // trail head (smoothed mouse)
      rx: -300, ry: -300, rw: 34, rh: 34, rr: 17, // ring
      el: null,
      lock: false,
      br: 8,
      down: false,
      seen: false,
    }
    const trail = []
    const sparks = []
    const waves = []
    let dirty = false

    const setTarget = (el) => {
      if (el === s.el) return
      s.el = el
      if (!el) {
        s.lock = false
        ring.classList.remove('locked', 'big')
        tag.classList.remove('on')
        return
      }
      const r = el.getBoundingClientRect()
      s.lock = r.width <= 380 && r.height <= 130
      s.br = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 8
      ring.classList.toggle('locked', s.lock)
      ring.classList.toggle('big', !s.lock)
      const label = el.getAttribute('data-cursor') || ''
      tagText.textContent = label
      tag.classList.toggle('on', Boolean(label))
    }

    const onMove = (e) => {
      s.mx = e.clientX
      s.my = e.clientY
      if (!s.seen) {
        s.seen = true
        s.hx = s.rx = s.mx
        s.hy = s.ry = s.my
        layer.classList.add('on')
      }
    }
    const onOver = (e) => {
      const el = e.target instanceof Element ? e.target.closest('a, button, [data-cursor]') : null
      setTarget(el)
    }
    const onDown = (e) => {
      s.down = true
      ring.classList.add('down')
      waves.push({ x: e.clientX, y: e.clientY, t0: performance.now() })
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * TAU
        const v = 90 + Math.random() * 230
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          t0: performance.now(),
          hue: 150 + Math.random() * 110,
        })
      }
    }
    const onUp = () => {
      s.down = false
      ring.classList.remove('down')
    }
    const onLeave = () => {
      s.seen = false
      layer.classList.remove('on')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('resize', resize)
    root.addEventListener('mouseleave', onLeave)

    let last = performance.now()
    let raf

    const drawFx = (dt, now) => {
      // extend the trail behind the smoothed head
      if (s.seen) {
        const tail = trail[trail.length - 1]
        if (!tail) {
          trail.push({ x: s.hx, y: s.hy, t: now })
        } else {
          const dx = s.hx - tail.x
          const dy = s.hy - tail.y
          const dist = Math.hypot(dx, dy)
          if (dist > 1.5) {
            const steps = Math.min(40, Math.ceil(dist / 3))
            for (let i = 1; i <= steps; i++) {
              trail.push({ x: tail.x + (dx * i) / steps, y: tail.y + (dy * i) / steps, t: now })
            }
          }
        }
      }
      while (trail.length && now - trail[0].t > TRAIL_LIFE) trail.shift()
      if (trail.length > MAX_TRAIL) trail.splice(0, trail.length - MAX_TRAIL)

      if (!trail.length && !sparks.length && !waves.length) {
        if (dirty) {
          ctx.clearRect(0, 0, W, H)
          dirty = false
        }
        return
      }
      dirty = true
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'

      // trail: soft glow first, bright core on top
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i]
        const age = (now - p.t) / TRAIL_LIFE
        const life = Math.max(0, 1 - age)
        const hue = 150 + age * 115
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${0.07 * life})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 4 + 15 * life, 0, TAU)
        ctx.fill()
        ctx.fillStyle = `hsla(${hue}, 100%, 66%, ${0.32 * life * life})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 0.8 + 3.2 * life, 0, TAU)
        ctx.fill()
      }

      // click shockwaves
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i]
        const p = (now - w.t0) / 650
        if (p >= 1) {
          waves.splice(i, 1)
          continue
        }
        const e = 1 - Math.pow(1 - p, 3)
        ctx.strokeStyle = `hsla(160, 100%, 60%, ${0.55 * (1 - p)})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(w.x, w.y, 8 + 96 * e, 0, TAU)
        ctx.stroke()
      }

      // sparks that float upward (anti-gravity)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i]
        const p = (now - sp.t0) / 850
        if (p >= 1) {
          sparks.splice(i, 1)
          continue
        }
        sp.x += sp.vx * dt
        sp.y += sp.vy * dt
        sp.vx *= 0.94
        sp.vy = sp.vy * 0.94 - 140 * dt
        ctx.fillStyle = `hsla(${sp.hue}, 100%, 65%, ${0.9 * (1 - p)})`
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, 2.4 * (1 - p) + 0.4, 0, TAU)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const kh = 1 - Math.exp(-dt * 24)
      s.hx += (s.mx - s.hx) * kh
      s.hy += (s.my - s.hy) * kh

      let tx = s.mx
      let ty = s.my
      let tw = 34
      let th = 34
      let tr = 17
      if (s.el && s.lock && s.el.isConnected) {
        const r = s.el.getBoundingClientRect()
        const pad = 8
        tx = r.left + r.width / 2
        ty = r.top + r.height / 2
        tw = r.width + pad * 2
        th = r.height + pad * 2
        tr = Math.min(s.br + pad, th / 2, tw / 2)
      } else if (s.el) {
        tw = 60
        th = 60
        tr = 30
      } else if (s.down) {
        tw = 24
        th = 24
        tr = 12
      }

      const kr = 1 - Math.exp(-dt * (s.lock ? 17 : 13))
      s.rx += (tx - s.rx) * kr
      s.ry += (ty - s.ry) * kr
      s.rw += (tw - s.rw) * kr
      s.rh += (th - s.rh) * kr
      s.rr += (tr - s.rr) * kr

      ring.style.width = `${s.rw.toFixed(1)}px`
      ring.style.height = `${s.rh.toFixed(1)}px`
      ring.style.borderRadius = `${s.rr.toFixed(1)}px`
      ring.style.transform = `translate3d(${(s.rx - s.rw / 2).toFixed(1)}px, ${(s.ry - s.rh / 2).toFixed(1)}px, 0)`
      dot.style.transform = `translate3d(${s.mx}px, ${s.my}px, 0)`
      tag.style.transform = `translate3d(${s.rx.toFixed(1)}px, ${(s.ry + s.rh / 2 + 12).toFixed(1)}px, 0)`

      drawFx(dt, now)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', resize)
      root.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="cursor-layer" ref={layerRef} aria-hidden="true">
      <canvas className="cursor-canvas" ref={canvasRef} />
      <div className="cursor-ring" ref={ringRef}>
        <span className="ring-body" />
        <i className="rc tl" />
        <i className="rc tr" />
        <i className="rc bl" />
        <i className="rc br" />
      </div>
      <div className="cursor-tag" ref={tagRef}>
        <span />
      </div>
      <div className="cursor-dot" ref={dotRef} />
    </div>
  )
}
