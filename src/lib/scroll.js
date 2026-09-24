import { lenisRef } from '../state/shared'

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisRef.current) {
    lenisRef.current.scrollTo(el, { offset: id === 'home' ? 0 : -60, duration: 1.3 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function scrollToTop() {
  if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.3 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Turns 'certs/a.png' into a path that works on any host.
export function asset(path) {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
