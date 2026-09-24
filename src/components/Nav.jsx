import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { FaBars, FaTimes } from 'react-icons/fa'
import { nav, profile } from '../data'
import { lenisRef } from '../state/shared'
import { scrollToId } from '../lib/scroll'

export default function Nav({ show }) {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (open) lenisRef.current?.stop()
    else lenisRef.current?.start()
    document.body.style.overflow = open || !show ? 'hidden' : ''
    return () => lenisRef.current?.start()
  }, [open, show])

  const go = (e, id) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollToId(id), 40)
  }

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: bar }} />

      <motion.header
        className="nav"
        initial={{ y: -90, opacity: 0 }}
        animate={show ? { y: 0, opacity: 1 } : { y: -90, opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="nav-capsule">
          <a href="#home" className="logo" onClick={(e) => go(e, 'home')} data-cursor="Top">
            {profile.logo}
          </a>

          <nav className="nav-links" aria-label="Main">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={active === n.id ? 'active' : ''}
                onClick={(e) => go(e, n.id)}
              >
                {active === n.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="nav-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="nav-text">{n.label}</span>
              </a>
            ))}
          </nav>

          <button
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </motion.header>

      {open && (
        <div className="nav-sheet">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={(e) => go(e, n.id)} className={active === n.id ? 'active' : ''}>
              {n.label}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
