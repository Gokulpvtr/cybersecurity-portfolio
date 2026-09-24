import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { marquee } from '../data'
import { usePrefersReducedMotion } from '../hooks/useMedia'

const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

// One sliding band. It speeds up, reverses, and skews with your scroll speed.
function Band({ items, base, outline }) {
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const boost = useTransform(smooth, [0, 1200], [0, 4], { clamp: false })
  const skew = useTransform(smooth, [-1600, 0, 1600], [7, 0, -7], { clamp: true })
  const dir = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduced) return
    let move = dir.current * base * (delta / 1000)
    const b = boost.get()
    if (b < 0) dir.current = -1
    else if (b > 0) dir.current = 1
    move += dir.current * move * b
    x.set(x.get() + move)
  })

  const translate = useTransform(x, (v) => `${wrap(-25, -50, v)}%`)

  return (
    <div className="band">
      <motion.div className={`band-track ${outline ? 'outline' : ''}`} style={{ x: translate, skewX: skew }}>
        {[0, 1, 2, 3].map((copy) => (
          <div className="band-set" key={copy} aria-hidden={copy > 0}>
            {items.map((t) => (
              <span className="band-item" key={`${copy}-${t}`}>
                {t}
                <i className="band-sep" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function Marquee() {
  return (
    <div className="marquee" aria-label="Focus areas and tools">
      <Band items={marquee.top} base={-2.2} />
      <Band items={marquee.bottom} base={2.2} outline />
    </div>
  )
}
