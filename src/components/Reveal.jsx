import { motion } from 'framer-motion'

// Floats a block in from below with a slight 3D tilt when it scrolls into view.
export default function Reveal({ children, delay = 0, y = 54, tilt = 14, className = '', as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, rotateX: tilt, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.75, 0.2, 1] }}
      style={{ transformPerspective: 1100 }}
    >
      {children}
    </Tag>
  )
}
