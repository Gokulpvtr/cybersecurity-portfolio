import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa'
import { timeline } from '../data'
import Section from './Section'
import TiltCard from './TiltCard'

export default function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })

  return (
    <Section id="experience" title="Experience and education">
      <div className="timeline" ref={ref}>
        <div className="tl-track" aria-hidden="true">
          <motion.div className="tl-fill" style={{ scaleY: grow }} />
        </div>
        <ol>
          {timeline.map((item) => {
            const Icon = item.type === 'work' ? FaBriefcase : FaGraduationCap
            return (
              <motion.li
                key={item.title}
                className="tl-item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <span className="tl-dot">
                  <Icon aria-hidden="true" />
                </span>
                <TiltCard className="tl-card" innerClassName="tl-inner" max={4}>
                  <h3 className="pop-sm">{item.title}</h3>
                  <p className="tl-org">{item.org}</p>
                  <p className="tl-period">{item.period}</p>
                  <ul>
                    {item.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </TiltCard>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </Section>
  )
}
