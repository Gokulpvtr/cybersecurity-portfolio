import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './useMedia'

// Cycles through `words`. Pass a stable array (defined outside the component).
export function useTypewriter(words, { type = 65, erase = 32, hold = 1700 } = {}) {
  const reduced = usePrefersReducedMotion()
  const [text, setText] = useState(reduced ? words[0] : '')

  useEffect(() => {
    if (reduced) {
      setText(words[0])
      return undefined
    }
    let i = 0
    let j = 0
    let dir = 1
    let timer
    const tick = () => {
      const w = words[i]
      j += dir
      setText(w.slice(0, j))
      let delay = dir === 1 ? type : erase
      if (dir === 1 && j === w.length) {
        dir = -1
        delay = hold
      } else if (dir === -1 && j === 0) {
        dir = 1
        i = (i + 1) % words.length
        delay = 400
      }
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [words, type, erase, hold, reduced])

  return text
}
