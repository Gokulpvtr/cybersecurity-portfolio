import { useState } from 'react'
import { FaUserSecret } from 'react-icons/fa'
import { about, profile } from '../data'
import { asset } from '../lib/scroll'
import Reveal from './Reveal'
import Section from './Section'
import TiltCard from './TiltCard'

function Photo() {
  const [broken, setBroken] = useState(!profile.photo)
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="photo-wrap">
      <div className="photo-glow" aria-hidden="true" />
      <TiltCard className="photo-frame" max={3}>
        <div className="photo-inner">
          {!broken ? (
            <img
              src={asset(profile.photo)}
              alt={`Portrait of ${profile.name}`}
              loading="lazy"
              decoding="async"
              onError={() => setBroken(true)}
            />
          ) : (
            <div className="photo-fallback">
              <FaUserSecret aria-hidden="true" />
              <span>{initials}</span>
            </div>
          )}
          <span className="scanline" aria-hidden="true" />
        </div>
        <span className="photo-badge b1">Offensive security</span>
        <span className="photo-badge b2">BCA, University of Kerala</span>
      </TiltCard>
    </div>
  )
}

export default function About() {
  return (
    <Section id="about" title="About me">
      <div className="about-grid">
        <div className="about-copy">
          {about.paragraphs.map((p, i) => (
            <Reveal key={p} delay={i * 0.08} y={22} tilt={4}>
              <p>{p}</p>
            </Reveal>
          ))}
          <Reveal delay={0.2} y={22} tilt={4}>
            <dl className="facts">
              {about.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <Reveal y={70} delay={0.1}>
          <Photo />
        </Reveal>
      </div>
    </Section>
  )
}
