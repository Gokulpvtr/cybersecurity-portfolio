import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'

/*
  Glass card that tilts in 3D toward the cursor with a moving highlight.
  Anything inside with the class "pop" floats above the glass in 3D.
*/
export default function TiltCard({ children, className = '', innerClassName = '', max = 8, ...rest }) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 170, damping: 20, mass: 0.6 })
  const sry = useSpring(ry, { stiffness: 170, damping: 20, mass: 0.6 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glare = useMotionTemplate`radial-gradient(360px circle at ${gx}% ${gy}%, rgba(255,255,255,0.13), rgba(0,255,136,0.07) 38%, transparent 66%)`

  const onMove = (e) => {
    if (e.pointerType === 'touch' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2)
    rx.set(-(py - 0.5) * max * 2)
    gx.set(px * 100)
    gy.set(py * 100)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt ${className}`}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...rest}
    >
      <span className="tilt-glass" aria-hidden="true" />
      <motion.span className="tilt-glare" style={{ background: glare }} aria-hidden="true" />
      <div className={`tilt-inner ${innerClassName}`}>{children}</div>
    </motion.div>
  )
}
