import { motion } from 'framer-motion'
import { SocialRow } from './Socials'

// A floating glass dock on the left edge (wide screens only).
export default function SocialDock({ show }) {
  return (
    <div className="dock-wrap">
      <motion.aside
        className="dock"
        aria-label="Social links"
        initial={{ opacity: 0, x: -30 }}
        animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 0.9, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <SocialRow side="right" />
      </motion.aside>
    </div>
  )
}
