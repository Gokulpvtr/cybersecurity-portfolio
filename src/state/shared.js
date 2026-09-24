import { motionValue } from 'framer-motion'

// Shared, non-React state. Updating these never re-renders anything,
// so the 3D scene and cursor can read them every frame for free.
export const shared = {
  scroll: 0, // 0 (top) to 1 (bottom)
  vel: 0, // recent scroll speed, decays back to 0
  hasPointer: false, // true while a mouse/finger is over the page
  pointer: { x: 0, y: 0 }, // -1 to 1, y is up
}

// Same pointer as framer-motion values, for parallax on DOM elements.
export const pointerX = motionValue(0)
export const pointerY = motionValue(0)

export const lenisRef = { current: null }
