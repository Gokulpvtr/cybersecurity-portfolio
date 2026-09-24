import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './useMedia'

// Simple, clean fade-and-settle reveal: normal reading order, no scrambling.
// Kept as a hook (same name/shape) so Hero.jsx doesn't need to change.
export function useScramble(text) {
  return text
}

export function useRevealClass(start = true) {
  const reduced = usePrefersReducedMotion()
  const [on, setOn] = useState(reduced ? true : false)
  useEffect(() => {
    if (!start) return undefined
    const t = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(t)
  }, [start])
  return on
}
