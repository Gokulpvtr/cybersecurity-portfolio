import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaCertificate, FaExpand, FaExternalLinkAlt, FaTimes } from 'react-icons/fa'
import { certifications } from '../data'
import { asset } from '../lib/scroll'
import Reveal from './Reveal'
import Section from './Section'

function CertCard({ c, onZoom, index }) {
  const [flipped, setFlipped] = useState(false)
  const [broken, setBroken] = useState(false)
  const hasImage = c.image && !broken

  return (
    <Reveal as="li" className="cert-item" delay={(index % 4) * 0.08} y={46}>
      <div className="cert-wrap">
        <button
          type="button"
          className="cert"
          aria-pressed={flipped}
          aria-label={`${c.title}, ${c.issuer}. ${flipped ? 'Show details' : 'Show certificate'}`}
          onClick={() => setFlipped((f) => !f)}
          data-cursor={flipped ? 'Flip back' : 'Flip'}
        >
          <motion.span
            className="cert-inner"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.65, ease: [0.3, 0.7, 0.2, 1] }}
          >
            <span className="cert-face cert-front">
              <FaCertificate className="cert-icon" aria-hidden="true" />
              <span className="cert-title">{c.title}</span>
              <span className="cert-issuer">{c.issuer}</span>
              {c.date && <span className="cert-date">{c.date}</span>}
            </span>
            <span className="cert-face cert-back">
              {hasImage ? (
                <img src={asset(c.image)} alt={`${c.title} certificate`} loading="lazy" decoding="async" onError={() => setBroken(true)} />
              ) : (
                <span className="cert-empty">Certificate image not added yet.</span>
              )}
            </span>
          </motion.span>
        </button>
      </div>

      <div className="cert-actions">
        {flipped && hasImage && (
          <button type="button" className="text-btn" onClick={() => onZoom(c)} data-cursor="Zoom">
            <FaExpand aria-hidden="true" /> View full size
          </button>
        )}
        {c.url && (
          <a className="text-btn" href={c.url} target="_blank" rel="noreferrer noopener" data-cursor="Verify">
            Verify credential <FaExternalLinkAlt aria-hidden="true" />
          </a>
        )}
      </div>
    </Reveal>
  )
}

export default function Certifications() {
  const [zoom, setZoom] = useState(null)

  useEffect(() => {
    if (!zoom) return undefined
    const onKey = (e) => e.key === 'Escape' && setZoom(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  return (
    <Section id="certifications" title="Certifications" meta="Click a card to flip it">
      <ul className="cert-grid">
        {certifications.map((c, i) => (
          <CertCard key={c.title} c={c} onZoom={setZoom} index={i} />
        ))}
      </ul>

      <AnimatePresence>
        {zoom && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={zoom.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
          >
            <button type="button" className="lightbox-close" aria-label="Close" onClick={() => setZoom(null)}>
              <FaTimes />
            </button>
            <motion.img
              src={asset(zoom.image)}
              alt={`${zoom.title} certificate`}
              initial={{ scale: 0.92, rotateX: 12 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
