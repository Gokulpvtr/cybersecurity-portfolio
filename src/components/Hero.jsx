import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
import { FaDownload } from 'react-icons/fa'
import { certifications, floatTags, profile, projects, stats } from '../data'
import { useRevealClass } from '../hooks/useScramble'
import { useTypewriter } from '../hooks/useTypewriter'
import { usePrefersReducedMotion } from '../hooks/useMedia'
import { pointerX, pointerY } from '../state/shared'
import { asset, scrollToId } from '../lib/scroll'
import Magnetic from './Magnetic'
import { SocialRow } from './Socials'

function Stat({ item }) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const target =
    item.from === 'certifications' ? certifications.length : item.from === 'projects' ? projects.length : item.value
  const [n, setN] = useState(reduced ? target : 0)

  useEffect(() => {
    if (!inView) return undefined
    if (reduced) {
      setN(target)
      return undefined
    }
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, target, reduced])

  return (
    <div className="stat glass" ref={ref}>
      <div className="stat-value">
        {n}
        {item.suffix || ''}
      </div>
      <div className="stat-label">{item.label}</div>
    </div>
  )
}

// Glass tags that levitate around the sphere and drift with cursor and scroll.
function FloatTag({ tag, index, px, py, scrollY }) {
  const x = useTransform(px, (v) => v * -34 * tag.depth)
  const y = useTransform([py, scrollY], ([p, s]) => p * 26 * tag.depth - s * 0.22 * tag.depth)
  return (
    <motion.div className="float-tag" style={{ left: `${tag.x}%`, top: `${tag.y}%`, x, y }}>
      <span className="float-bob" style={{ animationDelay: `${-index * 1.3}s`, '--c': tag.color }}>
        <i />
        {tag.text}
      </span>
    </motion.div>
  )
}

export default function Hero({ ready }) {
  const heroRef = useRef(null)
  const role = useTypewriter(profile.roles)
  const nameIn = useRevealClass(ready)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -110])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const { scrollY } = useScroll()
  const px = useSpring(pointerX, { stiffness: 55, damping: 18 })
  const py = useSpring(pointerY, { stiffness: 55, damping: 18 })

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-float" aria-hidden="true">
        {floatTags.map((t, i) => (
          <FloatTag key={t.text} tag={t} index={i} px={px} py={py} scrollY={scrollY} />
        ))}
      </div>

      <div className="container hero-inner">
        <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <h1 className={`hero-name ${nameIn ? 'in' : ''}`}>{profile.name}</h1>
          <p className="hero-role" aria-label={profile.roles[0]}>
            <span aria-hidden="true">{role}</span>
            <i className="caret" aria-hidden="true" />
          </p>
          <p className="hero-intro">{profile.intro}</p>

          <ul className="chips hero-tags">
            {profile.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <div className="hero-cta">
            <Magnetic>
              <a
                href="#projects"
                className="btn"
                data-cursor="Explore"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId('projects')
                }}
              >
                View projects
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="btn alt"
                data-cursor="Say hi"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId('contact')
                }}
              >
                Contact me
              </a>
            </Magnetic>
            {profile.resume && (
              <Magnetic>
                <a href={asset(profile.resume)} className="btn ghost" download data-cursor="Download">
                  <FaDownload /> Resume
                </a>
              </Magnetic>
            )}
          </div>

          <SocialRow className="hero-social" />
        </motion.div>
      </div>

      <div className="container">
        <motion.div
          className="stats"
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {stats.map((s) => (
            <Stat key={s.label} item={s} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
