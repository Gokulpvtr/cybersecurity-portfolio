import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaCheck, FaCopy, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa'
import { profile, socials } from '../data'
import { socialIcons } from './icons'
import Magnetic from './Magnetic'
import Reveal from './Reveal'
import Section from './Section'
import TiltCard from './TiltCard'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return undefined
    const t = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(t)
  }, [copied])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      // older browsers: fall back to a hidden textarea
      const ta = document.createElement('textarea')
      ta.value = profile.email
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
  }

  return (
    <Section id="contact" title="Get in touch">
      <div className="contact">
        <Reveal y={40}>
          <div className="contact-lead">
            <p className="contact-title">{profile.contactTitle}</p>
            <p className="contact-text">{profile.contactText}</p>
            <div className="contact-actions">
              <Magnetic>
                <a className="btn" href={`mailto:${profile.email}`} data-cursor="Email me">
                  <FaEnvelope aria-hidden="true" /> Email me
                </a>
              </Magnetic>
              <Magnetic>
                <button type="button" className="btn ghost" onClick={copyEmail} data-cursor="Copy">
                  {copied ? <FaCheck aria-hidden="true" /> : <FaCopy aria-hidden="true" />} Copy email
                </button>
              </Magnetic>
            </div>
          </div>
        </Reveal>

        <ul className="social-cards">
          {socials.map((s, i) => {
            const Icon = socialIcons[s.key]
            const external = s.key !== 'mail'
            return (
              <Reveal as="li" key={s.key} delay={i * 0.09} y={50}>
                <a
                  className={`social-card ${s.key}`}
                  href={s.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer noopener' : undefined}
                  data-cursor={s.label}
                >
                  <TiltCard innerClassName="sc-inner" max={13}>
                    <span className="sc-icon pop-lg">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="sc-name pop">{s.label}</span>
                    <span className="sc-handle pop-sm">{s.handle}</span>
                    <span className="sc-go pop">
                      <FaExternalLinkAlt aria-hidden="true" />
                    </span>
                  </TiltCard>
                </a>
              </Reveal>
            )
          })}
        </ul>
      </div>

      <div className="toast-wrap">
        <AnimatePresence>
          {copied && (
            <motion.div
              className="toast"
              role="status"
              initial={{ opacity: 0, y: 30, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            >
              <FaCheck aria-hidden="true" /> Email copied to clipboard
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  )
}
