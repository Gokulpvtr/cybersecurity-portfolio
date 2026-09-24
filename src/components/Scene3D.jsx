import { Component, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { shared } from '../state/shared'
import { usePrefersReducedMotion } from '../hooks/useMedia'

const GREEN = new THREE.Color('#00ff88')
const CYAN = new THREE.Color('#00d9ff')
const ALERT = new THREE.Color('#ff2d87')
const RADIUS = 1.9
const { lerp, damp, smoothstep } = THREE.MathUtils

/* ------------------------------------------------------------------
   1. Flowing particle field (all motion runs on the GPU)
   Particles drift upward against gravity, ride a swirling flow, and are
   pushed away from the cursor. Scrolling fast speeds the flow up.
------------------------------------------------------------------ */
const FLOW_VERT = /* glsl */ `
uniform float uTime;
uniform float uFlow;
uniform vec2 uMouse;
uniform float uPixelRatio;
uniform float uSize;
uniform float uPush;
attribute vec3 aSeed;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 p = position;
  float ph = aSeed.x * 6.2831853;
  float t = uFlow;

  // layered swirling motion
  p.x += sin(p.y * 0.32 + t * 1.10 + ph) * 0.90 + sin(p.z * 0.21 + t * 0.70) * 0.60;
  p.y += cos(p.x * 0.28 + t * 0.90 + ph) * 0.80 + sin(p.z * 0.30 + t * 0.55) * 0.50;
  p.z += sin(p.x * 0.24 + p.y * 0.18 + t * 0.80) * 0.90;

  // slow rise against gravity, wrapping around
  float span = 20.0;
  p.y = mod(p.y + uTime * (0.16 + aSeed.z * 0.30) + span * 0.5, span) - span * 0.5;

  // the cursor pushes particles away and lifts them toward you
  vec2 d = p.xy - uMouse;
  float dist = length(d);
  float f = (1.0 - smoothstep(0.0, 3.6, dist)) * uPush;
  p.xy += (d / max(dist, 0.0001)) * f * 1.9;
  p.z += f * 1.6;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = max(-mv.z, 1.0);

  gl_PointSize = min(uSize * uPixelRatio * (0.5 + aSeed.z) * (10.0 / depth), 46.0 * uPixelRatio);

  vec3 g = vec3(0.0, 1.0, 0.53);
  vec3 c = vec3(0.0, 0.85, 1.0);
  vec3 v = vec3(0.45, 0.36, 1.0);
  vec3 col = mix(g, c, smoothstep(0.0, 0.55, aSeed.y));
  col = mix(col, v, smoothstep(0.6, 1.0, aSeed.y));

  vColor = col * (0.6 + f * 0.8);
  float fade = 1.0 - smoothstep(20.0, 34.0, depth);
  vAlpha = (0.30 + aSeed.z * 0.55) * fade + f * 0.35;
}
`

const FLOW_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float a = 1.0 - smoothstep(0.0, 0.5, d);
  a = a * a;
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`

function Flow({ count, motion }) {
  const flow = useRef(0)
  const { viewport } = useThree()

  const { position, seed } = useMemo(() => {
    const position = new Float32Array(count * 3)
    const seed = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      position[i * 3] = (Math.random() - 0.5) * 36
      position[i * 3 + 1] = (Math.random() - 0.5) * 20
      position[i * 3 + 2] = -16 + Math.random() * 22
      seed[i * 3] = Math.random()
      seed[i * 3 + 1] = Math.random()
      seed[i * 3 + 2] = Math.random()
    }
    return { position, seed }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFlow: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uPixelRatio: { value: 1 },
      uSize: { value: 5.5 },
      uPush: { value: 1 },
    }),
    []
  )

  useFrame((state, dt) => {
    shared.vel = damp(shared.vel, 0, 3, dt)
    flow.current += dt * motion * (0.5 + Math.min(Math.abs(shared.vel), 80) * 0.025)
    uniforms.uTime.value = state.clock.elapsedTime * motion
    uniforms.uFlow.value = flow.current
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()

    const m = uniforms.uMouse.value
    if (!shared.hasPointer) {
      m.set(999, 999)
    } else {
      const tx = shared.pointer.x * viewport.width * 0.5
      const ty = shared.pointer.y * viewport.height * 0.5
      if (m.x > 500) m.set(tx, ty)
      else m.set(damp(m.x, tx, 10, dt), damp(m.y, ty, 10, dt))
    }
  })

  return (
    <points key={count} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={position} itemSize={3} />
        <bufferAttribute attach="attributes-aSeed" count={count} array={seed} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={FLOW_VERT}
        fragmentShader={FLOW_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ------------------------------------------------------------------
   2. Floating wireframe shapes that drift and dodge the cursor
------------------------------------------------------------------ */
const SHAPES = [
  { kind: 'octa', pos: [-6.2, 2.6, -2], s: 0.9, color: '#00d9ff', speed: 0.5, depth: 1.0 },
  { kind: 'tetra', pos: [5.6, -3.1, -3], s: 1.0, color: '#00ff88', speed: 0.6, depth: 0.8 },
  { kind: 'ico', pos: [-3.6, -3.3, 1], s: 0.6, color: '#7c6bff', speed: 0.7, depth: 1.3 },
  { kind: 'dodeca', pos: [7.4, 3.6, -6], s: 1.3, color: '#7c6bff', speed: 0.4, depth: 0.6 },
  { kind: 'octa', pos: [-9, -1.2, -6], s: 1.4, color: '#00ff88', speed: 0.45, depth: 0.5 },
  { kind: 'torus', pos: [1.6, 4.4, -4], s: 0.8, color: '#00d9ff', speed: 0.55, depth: 0.9 },
]

function ShapeGeometry({ kind }) {
  if (kind === 'tetra') return <tetrahedronGeometry args={[1, 0]} />
  if (kind === 'ico') return <icosahedronGeometry args={[1, 0]} />
  if (kind === 'dodeca') return <dodecahedronGeometry args={[1, 0]} />
  if (kind === 'torus') return <torusGeometry args={[0.9, 0.28, 8, 24]} />
  return <octahedronGeometry args={[1, 0]} />
}

function Shape({ def, index, motion }) {
  const ref = useRef()
  const off = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  useFrame((state, dt) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime * motion
    let tx = 0
    let ty = 0
    if (shared.hasPointer) {
      const mx = shared.pointer.x * viewport.width * 0.5
      const my = shared.pointer.y * viewport.height * 0.5
      const dx = def.pos[0] - mx
      const dy = def.pos[1] - my
      const dist = Math.hypot(dx, dy) || 1
      const f = Math.max(0, 1 - dist / 4.5)
      tx = (dx / dist) * f * 1.8
      ty = (dy / dist) * f * 1.8
    }
    off.current.x = damp(off.current.x, tx, 3, dt)
    off.current.y = damp(off.current.y, ty, 3, dt)

    g.position.x = def.pos[0] + off.current.x
    g.position.y = def.pos[1] + Math.sin(t * def.speed + index) * 0.4 + off.current.y + shared.scroll * 6 * def.depth
    g.position.z = def.pos[2]
    g.rotation.x += dt * 0.25 * def.speed * motion
    g.rotation.y += dt * 0.35 * def.speed * motion
  })

  return (
    <mesh ref={ref} position={def.pos} scale={def.s}>
      <ShapeGeometry kind={def.kind} />
      <meshBasicMaterial
        color={def.color}
        wireframe
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------
   3. The asset under test: a sphere of network nodes.
   A scan plane sweeps it. Nodes it touches flash red (a "finding"),
   then cool back to green.
------------------------------------------------------------------ */
function useSprite() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 64
    c.height = 64
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.4, 'rgba(255,255,255,0.8)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  }, [])
}

function Asset({ presence, motion, sprite }) {
  const ringRef = useRef()
  const discRef = useRef()
  const coreRef = useRef()
  const orbitA = useRef()
  const orbitB = useRef()
  const lineMat = useRef()
  const pointMat = useRef()
  const ringMat = useRef()
  const discMat = useRef()
  const coreMat = useRef()

  const { wire, points, count, heat, colors } = useMemo(() => {
    let g = new THREE.IcosahedronGeometry(RADIUS, 3)
    g.deleteAttribute('normal')
    g.deleteAttribute('uv')
    g = mergeVertices(g)

    const wireGeo = new THREE.WireframeGeometry(g)
    const n = g.attributes.position.count
    const col = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      col[i * 3] = GREEN.r
      col[i * 3 + 1] = GREEN.g
      col[i * 3 + 2] = GREEN.b
    }
    const pts = new THREE.BufferGeometry()
    pts.setAttribute('position', g.attributes.position)
    pts.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return { wire: wireGeo, points: pts, count: n, heat: new Float32Array(n), colors: col }
  }, [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const p = presence.value
    const scanY = Math.sin(t * 0.7 * motion) * RADIUS * 0.95

    const pos = points.attributes.position
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i)
      const d = Math.abs(y - scanY)
      const hit = d < 0.32 ? 1 - d / 0.32 : 0
      heat[i] = Math.max(heat[i] * 0.965, hit)
      const h = heat[i]
      const k = (y / RADIUS + 1) * 0.5 * 0.6
      colors[i * 3] = lerp(lerp(GREEN.r, CYAN.r, k), ALERT.r, h)
      colors[i * 3 + 1] = lerp(lerp(GREEN.g, CYAN.g, k), ALERT.g, h)
      colors[i * 3 + 2] = lerp(lerp(GREEN.b, CYAN.b, k), ALERT.b, h)
    }
    points.attributes.color.needsUpdate = true

    const s = Math.sqrt(Math.max(0.04, 1 - (scanY / RADIUS) ** 2))
    if (ringRef.current) {
      ringRef.current.position.y = scanY
      ringRef.current.scale.set(s, s, s)
    }
    if (discRef.current) {
      discRef.current.position.y = scanY
      discRef.current.scale.set(s, s, s)
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= dt * 0.7 * motion
      coreRef.current.rotation.x += dt * 0.4 * motion
    }
    if (orbitA.current) orbitA.current.rotation.z += dt * 0.28 * motion
    if (orbitB.current) orbitB.current.rotation.y -= dt * 0.2 * motion

    if (lineMat.current) lineMat.current.opacity = 0.3 * p
    if (pointMat.current) pointMat.current.opacity = 0.95 * p
    if (ringMat.current) ringMat.current.opacity = 0.9 * p
    if (discMat.current) discMat.current.opacity = 0.07 * p
    if (coreMat.current) coreMat.current.opacity = 0.85 * p
  })

  return (
    <group>
      <lineSegments geometry={wire}>
        <lineBasicMaterial ref={lineMat} color="#00ff88" transparent opacity={0.3} depthWrite={false} />
      </lineSegments>

      <points geometry={points}>
        <pointsMaterial
          ref={pointMat}
          size={0.14}
          map={sprite}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      <mesh ref={ringRef} rotation-x={Math.PI / 2}>
        <torusGeometry args={[RADIUS * 1.06, 0.012, 8, 128]} />
        <meshBasicMaterial ref={ringMat} color="#00d9ff" transparent opacity={0.9} depthWrite={false} />
      </mesh>
      <mesh ref={discRef} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[RADIUS * 1.06, 64]} />
        <meshBasicMaterial
          ref={discMat}
          color="#00d9ff"
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshBasicMaterial ref={coreMat} color="#00ff88" wireframe transparent opacity={0.85} />
      </mesh>

      <group ref={orbitA} rotation={[1.1, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[2.75, 0.008, 6, 160]} />
          <meshBasicMaterial color="#00d9ff" transparent opacity={0.35} />
        </mesh>
        <mesh position={[2.75, 0, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#00d9ff" />
        </mesh>
      </group>
      <group ref={orbitB} rotation={[0.4, 0, 0.9]}>
        <mesh>
          <torusGeometry args={[3.25, 0.008, 6, 160]} />
          <meshBasicMaterial color="#7c6bff" transparent opacity={0.3} />
        </mesh>
        <mesh position={[-3.25, 0, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#ff2d87" />
        </mesh>
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------
   Rig: moves the asset and camera with scroll and cursor
------------------------------------------------------------------ */
function Rig({ presence, motion, sprite }) {
  const group = useRef()
  const spin = useRef(0)
  const { size, viewport } = useThree()
  const mobile = size.width < 820

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const s = shared.scroll
    const hero = 1 - smoothstep(s, 0.02, 0.13)
    presence.value = lerp(0.32, 1, hero)

    const sideX = mobile ? 0 : viewport.width * 0.2
    const bob = Math.sin(state.clock.elapsedTime * 0.9 * motion) * 0.16
    const tx = sideX * Math.cos(s * 7)
    const ty = (mobile ? 1.5 : 0) + Math.sin(s * 14) * 0.5 + bob
    const sc = (mobile ? 0.62 : 1) * lerp(0.8, 1, hero)

    g.position.x = damp(g.position.x, tx, 3, dt)
    g.position.y = damp(g.position.y, ty, 6, dt)
    const scNow = damp(g.scale.x, sc, 3, dt)
    g.scale.set(scNow, scNow, scNow)

    spin.current += dt * 0.16 * motion
    g.rotation.y = spin.current + shared.pointer.x * 0.45 + s * 5
    g.rotation.x = damp(g.rotation.x, -shared.pointer.y * 0.3 + s * 1.2, 3, dt)

    const cam = state.camera
    cam.position.x = damp(cam.position.x, shared.pointer.x * 0.7, 2.5, dt)
    cam.position.y = damp(cam.position.y, shared.pointer.y * 0.45, 2.5, dt)
    cam.lookAt(0, 0, 0)
  })

  return (
    <group ref={group}>
      <Asset presence={presence} motion={motion} sprite={sprite} />
    </group>
  )
}

function Contents({ presence, motion, lite }) {
  const { size } = useThree()
  const sprite = useSprite()
  const mobile = size.width < 820
  const count = lite ? (mobile ? 2500 : 6000) : mobile ? 5000 : 14000
  const shapes = lite ? SHAPES.slice(0, 3) : SHAPES
  return (
    <>
      <Flow count={count} motion={motion} />
      {shapes.map((def, i) => (
        <Shape key={i} def={def} index={i} motion={motion} />
      ))}
      <Rig presence={presence} motion={motion} sprite={sprite} />
    </>
  )
}

// If WebGL is not available the page still works, just without the scene.
class SafeBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.warn('3D scene disabled:', error)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function Scene3D({ lite = false }) {
  const reduced = usePrefersReducedMotion()
  const presence = useRef({ value: 1 })
  const motion = reduced ? 0.25 : 1

  return (
    <SafeBoundary>
      <div className="scene" aria-hidden="true">
        <Canvas
          dpr={lite ? [1, 1.1] : [1, 1.5]}
          camera={{ position: [0, 0, 9], fov: 55, near: 0.1, far: 80 }}
          gl={{ antialias: !lite, alpha: true, powerPreference: 'high-performance' }}
        >
          <Contents presence={presence.current} motion={motion} lite={lite} />
        </Canvas>
      </div>
    </SafeBoundary>
  )
}
