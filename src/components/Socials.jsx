import { socials } from '../data'
import { socialIcons } from './icons'
import Magnetic from './Magnetic'

// Round glass buttons. On hover they lift, glow, and pop a label.
// `side` decides where the label pops: 'top' (default) or 'right' (for the dock).
export function SocialRow({ side = 'top', className = '' }) {
  return (
    <ul className={`social-row ${side} ${className}`}>
      {socials.map((s) => {
        const Icon = socialIcons[s.key]
        const external = s.key !== 'mail'
        return (
          <li key={s.key}>
            <Magnetic strength={0.35}>
              <a
                className={`social-btn ${s.key}`}
                href={s.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                aria-label={s.label}
                data-cursor={s.label}
              >
                <Icon aria-hidden="true" />
                <span className="pop-tip" aria-hidden="true">
                  {s.label}
                </span>
              </a>
            </Magnetic>
          </li>
        )
      })}
    </ul>
  )
}
