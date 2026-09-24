import { methodology } from '../data'
import { iconMap } from './icons'
import Reveal from './Reveal'
import Section from './Section'
import TiltCard from './TiltCard'

export default function Methodology() {
  return (
    <Section id="methodology" title="Methodology" meta="How I approach a target">
      <ol className="method-line">
        {methodology.map((m, i) => {
          const Icon = iconMap[m.icon] || iconMap.code
          return (
            <Reveal as="li" key={m.step} delay={i * 0.1} y={40}>
              <TiltCard className="method-card" innerClassName="method-inner" max={6}>
                <span className="method-step pop-sm">{m.step}</span>
                <span className="method-icon pop">
                  <Icon aria-hidden="true" />
                </span>
                <h3 className="pop">{m.title}</h3>
                <p>{m.text}</p>
              </TiltCard>
              {i < methodology.length - 1 && <span className="method-arrow" aria-hidden="true" />}
            </Reveal>
          )
        })}
      </ol>
    </Section>
  )
}
