import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaTerminal } from 'react-icons/fa'
import { usePrefersReducedMotion } from '../hooks/useMedia'

export default function Loader({ onDone }) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const t = setTimeout(onDone, reduced ? 500 : 1900)
    return () => clearTimeout(t)
  }, [onDone, reduced])

  return (
    <motion.div
      className="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.9, ease: [0.22, 0.8, 0.2, 1] } }}
    >
      <div className="loader-box">
        <div className="loader-icon">
          <FaTerminal aria-hidden="true" />
        </div>
        <p className="loader-text">
          Initializing
          <span className="dots" aria-hidden="true">
            <i>.</i>
            <i>.</i>
            <i>.</i>
          </span>
        </p>
        <div className="loader-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </motion.div>
  )
}
