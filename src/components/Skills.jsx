import { skills } from '../data'
import { iconMap } from './icons'
import Reveal from './Reveal'
import Section from './Section'
import TiltCard from './TiltCard'

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="skills-grid">
        {skills.map((group, i) => {
          const Icon = iconMap[group.icon] || iconMap.code
          return (
            <Reveal key={group.title} delay={i * 0.12}>
              <TiltCard className="skill-panel" innerClassName="skill-inner" max={5}>
                <h3 className="pop">
                  <span className="skill-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  {group.title}
                </h3>
                <ul className="chips">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
