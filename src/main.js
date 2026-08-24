import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import './style.css'

gsap.registerPlugin(ScrollTrigger)

let scrollProgressBar = null
let bootScreen = null

function mountChrome() {
  const atmosphere =
    document.createElement('div')

  atmosphere.className =
    'atmosphere'

  atmosphere.setAttribute(
    'aria-hidden',
    'true'
  )

  atmosphere.innerHTML = `
    <div class="atmosphere-vignette"></div>
    <div class="atmosphere-grain"></div>
  `

  document.body.appendChild(
    atmosphere
  )

  const progress =
    document.createElement('div')

  progress.className =
    'scroll-progress'

  progress.setAttribute(
    'aria-hidden',
    'true'
  )

  document.body.appendChild(
    progress
  )

  scrollProgressBar =
    progress

  const boot =
    document.createElement('div')

  boot.className =
    'boot-screen'

  boot.setAttribute(
    'aria-live',
    'polite'
  )

  boot.innerHTML = `
    <div class="boot-screen-inner">
      <img
        src="/metaminds-logo.png"
        alt="MetaMinds STEM Academy"
        class="boot-logo"
      >
      <p>Loading</p>
    </div>
  `

  document.body.appendChild(
    boot
  )

  bootScreen =
    boot
}

mountChrome()

// ======================================================
// DEVICE / ACCESSIBILITY
// ======================================================

const MOBILE_AT_LOAD =
  window.matchMedia('(max-width: 767px)').matches

const TOUCH_DEVICE =
  window.matchMedia('(hover: none)').matches

const REDUCED_MOTION =
  window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

// Desktop keeps the richer visual.
// Mobile gets a much safer workload.
const PARTICLE_COUNT =
  MOBILE_AT_LOAD
    ? 9000
    : 26000

console.log({
  PARTICLE_COUNT,
  TOUCH_DEVICE,
  REDUCED_MOTION,
})

// ======================================================
// VISUAL SETTINGS
// ======================================================

const BRAIN_SIZE = 4.7
const LIGHTBULB_SIZE = 4.45
const EARTH_SIZE = 4.35
const LOGO_SIZE = 4.6

const RIGHT_X = 1.45
const LEFT_X = -1.25
const CENTER_X = 0.45
const LOGO_X = 0.55

const MOBILE_X = 0

// Tighter hover effect.
const INTERACTION_RADIUS = 0.28
const REPULSION_FORCE = 0.12
const DEPTH_BULGE = 0.16

// How quickly actual particles chase the story target.
const POSITION_LERP =
  MOBILE_AT_LOAD
    ? 0.12
    : 0.085

// Once every particle gets sufficiently close,
// stop touching the instance matrices.
const SETTLE_EPSILON = 0.0015

// ======================================================
// SCENE
// ======================================================

const scene =
  new THREE.Scene()

scene.background =
  new THREE.Color(0x03060c)

scene.fog =
  new THREE.FogExp2(
    0x03060c,
    0.026
  )

// ======================================================
// CAMERA
// ======================================================

const camera =
  new THREE.PerspectiveCamera(
    72,
    window.innerWidth /
      window.innerHeight,
    0.1,
    1000
  )

camera.position.z = 5.5

// ======================================================
// RENDERER
// ======================================================

const renderer =
  new THREE.WebGLRenderer({
    antialias: !MOBILE_AT_LOAD,
    powerPreference: 'high-performance',
  })

renderer.setSize(
  window.innerWidth,
  window.innerHeight
)

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    MOBILE_AT_LOAD
      ? 1.25
      : 1.5
  )
)

renderer.outputColorSpace =
  THREE.SRGBColorSpace

renderer.toneMapping =
  THREE.ACESFilmicToneMapping

renderer.toneMappingExposure = 1.08

renderer.domElement.className =
  'scene-canvas'

document.body.appendChild(
  renderer.domElement
)

// ======================================================
// BLOOM
// ======================================================

const composer =
  new EffectComposer(renderer)

composer.setSize(
  window.innerWidth,
  window.innerHeight
)

composer.addPass(
  new RenderPass(
    scene,
    camera
  )
)

// Enough threshold reduction for bright orange/blue
// fragments to actually catch bloom without turning
// everything into a glowing cloud.
const bloomPass =
  new UnrealBloomPass(
    new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    ),
    0.22, // strength
    0.12, // radius
    0.52  // threshold
  )

composer.addPass(
  bloomPass
)

// ======================================================
// COLORS
// ======================================================

const ORANGE =
  new THREE.Color(
    0xd65108
  )

const BURNT_ORANGE =
  new THREE.Color(
    0xa65335
  )

const NAVY =
  new THREE.Color(
    0x00205b
  )

const BLUE =
  new THREE.Color(
    0x2a4f91
  )

const MINDS_BLUE =
  new THREE.Color(
    0x5D8EE6
  )

const HOT_BLUE =
  new THREE.Color(
    0xA9B7C9
  )

const WHITE =
  new THREE.Color(
    0xffffff
  )

const EARTH_ICE =
  new THREE.Color(
    0xc8e0ff
  )

const tempColor =
  new THREE.Color()

// ======================================================
// TARGETS
// ======================================================

let brainPositions = null
let lightbulbPositions = null
let earthPositions = null
let logoPositions = null
let earthParticleLatLon = null

let brainExplosion = null
let lightbulbExplosion = null
let earthExplosion = null

let modelsReady = false

// What scroll currently wants.
const storyTargetPositions =
  new Float32Array(
    PARTICLE_COUNT * 3
  )

// What the renderer is currently showing.
const currentPositions =
  new Float32Array(
    PARTICLE_COUNT * 3
  )

// ======================================================
// PARTICLE GEOMETRY
// ======================================================

const particleGeometry =
  new THREE.TetrahedronGeometry(
    MOBILE_AT_LOAD
      ? 0.018
      : 0.015,
    0
  )

const particleMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xffffff,

    wireframe: true,

    transparent: true,

    opacity: 0.78,

    toneMapped: false,
  })

const particles =
  new THREE.InstancedMesh(
    particleGeometry,
    particleMaterial,
    PARTICLE_COUNT
  )

// Important performance hints.
particles.instanceMatrix.setUsage(
  THREE.DynamicDrawUsage
)

particles.instanceColor =
  new THREE.InstancedBufferAttribute(
    new Float32Array(
      PARTICLE_COUNT * 3
    ),
    3
  )

particles.instanceColor.setUsage(
  THREE.DynamicDrawUsage
)

scene.add(particles)

// ======================================================
// PARTICLE PERSONALITY
// ======================================================

const rotations =
  new Float32Array(
    PARTICLE_COUNT * 3
  )

const scales =
  new Float32Array(
    PARTICLE_COUNT
  )

const morphOffsets =
  new Float32Array(
    PARTICLE_COUNT
  )

const noiseSeeds =
  new Float32Array(
    PARTICLE_COUNT
  )

for (
  let i = 0;
  i < PARTICLE_COUNT;
  i++
) {
  const i3 = i * 3

  rotations[i3] =
    Math.random() *
    Math.PI

  rotations[i3 + 1] =
    Math.random() *
    Math.PI

  rotations[i3 + 2] =
    Math.random() *
    Math.PI

  scales[i] =
    0.72 +
    Math.random() *
    1.0

  morphOffsets[i] =
    Math.random() *
    0.10

  noiseSeeds[i] =
    Math.random() *
    100
}

// ======================================================
// POINTER
// ======================================================

const pointer =
  new THREE.Vector2(
    100,
    100
  )

const pointerTarget =
  new THREE.Vector2(
    100,
    100
  )

const offscreenPointer =
  new THREE.Vector2(
    100,
    100
  )

let pointerActive = false

function updatePointerWorld(
  clientX,
  clientY
) {
  const normalizedX =
    (
      clientX /
      window.innerWidth
    ) *
      2 -
    1

  const normalizedY =
    -(
      clientY /
        window.innerHeight
    ) *
      2 +
    1

  const distance =
    camera.position.z

  const fov =
    THREE.MathUtils.degToRad(
      camera.fov
    )

  const visibleHeight =
    2 *
    Math.tan(
      fov / 2
    ) *
    distance

  const visibleWidth =
    visibleHeight *
    camera.aspect

  pointerTarget.x =
    normalizedX *
    visibleWidth *
    0.5

  pointerTarget.y =
    normalizedY *
    visibleHeight *
    0.5
}

// IMPORTANT:
// No pointer interaction at all on touch-only devices.
if (
  !TOUCH_DEVICE &&
  !REDUCED_MOTION
) {
  window.addEventListener(
    'pointermove',
    (event) => {
      pointerActive = true

      updatePointerWorld(
        event.clientX,
        event.clientY
      )
    }
  )

  document.documentElement.addEventListener(
    'mouseleave',
    () => {
      pointerActive = false
    }
  )
}

// ======================================================
// GLTF LOADER
// ======================================================

const loader =
  new GLTFLoader()

function loadGLB(url) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      loader.load(
        url,
        resolve,
        undefined,
        reject
      )
    }
  )
}

// ======================================================
// MODEL -> PARTICLES
// ======================================================

function modelToParticlePositions(
  model,
  desiredSize
) {
  model.updateMatrixWorld(true)

  // Collect triangles from every mesh, weighted by face area.
  // This eliminates the "layered" look that comes from sampling
  // vertices linearly (front-face vertices → back-face vertices → sides).
  const tris = []
  let totalArea = 0

  const vA = new THREE.Vector3()
  const vB = new THREE.Vector3()
  const vC = new THREE.Vector3()
  const edge1 = new THREE.Vector3()
  const edge2 = new THREE.Vector3()
  const cross = new THREE.Vector3()

  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity

  model.traverse((child) => {
    if (!child.isMesh) return
    const geo = child.geometry
    if (!geo?.attributes?.position) return

    const pos = geo.attributes.position
    const idx = geo.index
    const faceCount = idx ? idx.count / 3 : pos.count / 3

    for (let f = 0; f < faceCount; f++) {
      const a = idx ? idx.getX(f * 3)     : f * 3
      const b = idx ? idx.getX(f * 3 + 1) : f * 3 + 1
      const c = idx ? idx.getX(f * 3 + 2) : f * 3 + 2

      vA.fromBufferAttribute(pos, a).applyMatrix4(child.matrixWorld)
      vB.fromBufferAttribute(pos, b).applyMatrix4(child.matrixWorld)
      vC.fromBufferAttribute(pos, c).applyMatrix4(child.matrixWorld)

      edge1.subVectors(vB, vA)
      edge2.subVectors(vC, vA)
      cross.crossVectors(edge1, edge2)
      const area = cross.length() * 0.5
      if (area < 1e-10) continue

      tris.push(
        vA.x, vA.y, vA.z,
        vB.x, vB.y, vB.z,
        vC.x, vC.y, vC.z,
        area
      )
      totalArea += area

      minX = Math.min(minX, vA.x, vB.x, vC.x)
      minY = Math.min(minY, vA.y, vB.y, vC.y)
      minZ = Math.min(minZ, vA.z, vB.z, vC.z)
      maxX = Math.max(maxX, vA.x, vB.x, vC.x)
      maxY = Math.max(maxY, vA.y, vB.y, vC.y)
      maxZ = Math.max(maxZ, vA.z, vB.z, vC.z)
    }
  })

  if (!tris.length) return null

  const STRIDE = 10 // 9 floats + 1 area
  const triCount = tris.length / STRIDE

  // Build CDF for area-weighted triangle selection
  const cdf = new Float64Array(triCount)
  let cumulative = 0
  for (let t = 0; t < triCount; t++) {
    cumulative += tris[t * STRIDE + 9] / totalArea
    cdf[t] = cumulative
  }

  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  const centerZ = (minZ + maxZ) / 2
  const scale = desiredSize / Math.max(maxX - minX, maxY - minY, maxZ - minZ)

  const output = new Float32Array(PARTICLE_COUNT * 3)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Binary search: pick a triangle weighted by surface area
    const r = Math.random()
    let lo = 0, hi = triCount - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cdf[mid] < r) lo = mid + 1
      else hi = mid
    }
    const base = lo * STRIDE

    // Random point inside the triangle via barycentric coords
    let u = Math.random(), v = Math.random()
    if (u + v > 1) { u = 1 - u; v = 1 - v }
    const w = 1 - u - v

    const i3 = i * 3
    output[i3]     = (w * tris[base]     + u * tris[base + 3] + v * tris[base + 6] - centerX) * scale
    output[i3 + 1] = (w * tris[base + 1] + u * tris[base + 4] + v * tris[base + 7] - centerY) * scale
    output[i3 + 2] = (w * tris[base + 2] + u * tris[base + 5] + v * tris[base + 8] - centerZ) * scale
  }

  return output
}

// ======================================================
// LOGO GENERATION (mini brain.glb + MetaMinds text only)
// ======================================================

// Samples only the front/back flat faces of the MetaMinds text from logo.glb,
// filtering out the STEM ACADEMY text (Y < 5) and the brain icon (X < -30).
// Front/back faces have |normalZ| > 0.7; the thick extrusion side-walls are excluded
// so particles fill the letter silhouettes cleanly.
function sampleLogoTextOnly(model, count) {
  model.updateMatrixWorld(true)
  const tris = []
  let totalArea = 0
  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3()
  const edge1 = new THREE.Vector3(), edge2 = new THREE.Vector3(), cross = new THREE.Vector3()
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

  model.traverse((child) => {
    if (!child.isMesh) return
    const geo = child.geometry
    if (!geo?.attributes?.position) return
    const pos = geo.attributes.position
    const idx = geo.index
    const faceCount = idx ? idx.count / 3 : pos.count / 3

    for (let f = 0; f < faceCount; f++) {
      const a = idx ? idx.getX(f * 3)     : f * 3
      const b = idx ? idx.getX(f * 3 + 1) : f * 3 + 1
      const c = idx ? idx.getX(f * 3 + 2) : f * 3 + 2
      vA.fromBufferAttribute(pos, a).applyMatrix4(child.matrixWorld)
      vB.fromBufferAttribute(pos, b).applyMatrix4(child.matrixWorld)
      vC.fromBufferAttribute(pos, c).applyMatrix4(child.matrixWorld)

      // Filter: MetaMinds text only (not STEM ACADEMY, not logo brain icon)
      // Logo GLB world-space coords: X ±10.1, Y ±2.663 (1/10 Blender export scale)
      // Brain icon: x < -5; STEM ACADEMY: y < 0.5
      const cx = (vA.x + vB.x + vC.x) / 3
      const cy = (vA.y + vB.y + vC.y) / 3
      if (cx < -5 || cy < 0.5) continue

      edge1.subVectors(vB, vA)
      edge2.subVectors(vC, vA)
      cross.crossVectors(edge1, edge2)

      // Only flat front/back faces — skips extrusion side-walls so letter
      // shapes are filled solid rather than appearing as outline tubes.
      const len = cross.length()
      if (len < 1e-10) continue
      if (Math.abs(cross.z) / len < 0.7) continue

      const area = len * 0.5
      tris.push(vA.x, vA.y, vA.z, vB.x, vB.y, vB.z, vC.x, vC.y, vC.z, area)
      totalArea += area
      minX = Math.min(minX, vA.x, vB.x, vC.x)
      maxX = Math.max(maxX, vA.x, vB.x, vC.x)
      minY = Math.min(minY, vA.y, vB.y, vC.y)
      maxY = Math.max(maxY, vA.y, vB.y, vC.y)
    }
  })

  if (!tris.length) return new Float32Array(count * 3)

  const STRIDE = 10
  const triCount = tris.length / STRIDE
  const cdf = new Float64Array(triCount)
  let cumulative = 0
  for (let t = 0; t < triCount; t++) {
    cumulative += tris[t * STRIDE + 9] / totalArea
    cdf[t] = cumulative
  }

  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  const textHeight = maxY - minY
  const textWidth = maxX - minX
  // Scale to ~0.6 scene units tall — legible at viewport height while fitting beside the brain.
  const scale = 0.6 / textHeight
  const TEXT_OFFSET_X = 0.15

  const output = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = Math.random()
    let lo = 0, hi = triCount - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cdf[mid] < r) lo = mid + 1
      else hi = mid
    }
    const base = lo * STRIDE
    let u = Math.random(), v = Math.random()
    if (u + v > 1) { u = 1 - u; v = 1 - v }
    const w = 1 - u - v
    const i3 = i * 3
    output[i3]     = (w * tris[base]     + u * tris[base + 3] + v * tris[base + 6] - centerX) * scale + TEXT_OFFSET_X
    output[i3 + 1] = (w * tris[base + 1] + u * tris[base + 4] + v * tris[base + 7] - centerY) * scale
    output[i3 + 2] = 0
  }
  return output
}

// Combines a mini version of brain.glb (left) with MetaMinds text only (right).
function generateLogoPositions(brainGLBScene, logoGLBScene) {
  const BRAIN_COUNT = Math.floor(PARTICLE_COUNT * 0.30)
  const TEXT_COUNT = PARTICLE_COUNT - BRAIN_COUNT

  // Mini brain: scale brain.glb down to ~1.3 units tall, offset left
  const MINI_BRAIN_SIZE = 1.3
  const miniScale = MINI_BRAIN_SIZE / BRAIN_SIZE
  const BRAIN_OFFSET_X = -2.9

  const brainOut = new Float32Array(BRAIN_COUNT * 3)
  for (let i = 0; i < BRAIN_COUNT; i++) {
    brainOut[i * 3]     = brainPositions[i * 3]     * miniScale + BRAIN_OFFSET_X
    brainOut[i * 3 + 1] = brainPositions[i * 3 + 1] * miniScale
    brainOut[i * 3 + 2] = brainPositions[i * 3 + 2] * miniScale
  }

  // MetaMinds text — front faces only, no STEM ACADEMY
  const textOut = sampleLogoTextOnly(logoGLBScene, TEXT_COUNT)

  const output = new Float32Array(PARTICLE_COUNT * 3)
  output.set(brainOut, 0)
  output.set(textOut, BRAIN_COUNT * 3)
  return output
}

// ======================================================
// GLOBE GENERATION (Natural Earth GeoJSON)
// ======================================================

let earthParticleLand = null

function buildLandPolygons(landGeoJSON) {
  const polys = []

  for (const feature of landGeoJSON.features) {
    const geom = feature.geometry

    const addRing = (coords) => {
      const ring = coords[0]
      let minLon = Infinity, maxLon = -Infinity
      let minLat = Infinity, maxLat = -Infinity
      for (const pt of ring) {
        if (pt[0] < minLon) minLon = pt[0]
        if (pt[0] > maxLon) maxLon = pt[0]
        if (pt[1] < minLat) minLat = pt[1]
        if (pt[1] > maxLat) maxLat = pt[1]
      }
      polys.push({ ring, minLon, maxLon, minLat, maxLat })
    }

    if (geom.type === 'Polygon') {
      addRing(geom.coordinates)
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.coordinates) {
        addRing(poly)
      }
    }
  }

  return polys
}

function pointInRing(lon, lat, ring) {
  let inside = false
  for (
    let i = 0, j = ring.length - 1;
    i < ring.length;
    j = i++
  ) {
    const xi = ring[i][0], yi = ring[i][1]
    const xj = ring[j][0], yj = ring[j][1]
    if (
      (yi > lat) !== (yj > lat) &&
      lon < (xj - xi) * (lat - yi) / (yj - yi) + xi
    ) {
      inside = !inside
    }
  }
  return inside
}

function generateGlobePositions(landGeoJSON) {
  const output =
    new Float32Array(PARTICLE_COUNT * 3)

  const radius = EARTH_SIZE / 2
  const PHI = (1 + Math.sqrt(5)) / 2

  earthParticleLatLon =
    new Float32Array(PARTICLE_COUNT * 2)

  earthParticleLand =
    new Uint8Array(PARTICLE_COUNT)

  const landPolys =
    buildLandPolygons(landGeoJSON)

  for (
    let i = 0;
    i < PARTICLE_COUNT;
    i++
  ) {
    const i3 = i * 3
    const t = i / (PARTICLE_COUNT - 1)
    const sinLat = 1 - 2 * t
    const cosLat = Math.sqrt(Math.max(0, 1 - sinLat * sinLat))
    const lonRad = (2 * Math.PI * i / PHI) % (2 * Math.PI)

    output[i3]     = radius * cosLat * Math.cos(lonRad)
    output[i3 + 1] = radius * sinLat
    output[i3 + 2] = radius * cosLat * Math.sin(lonRad)

    const latDeg =
      Math.asin(Math.max(-1, Math.min(1, sinLat))) *
      (180 / Math.PI)

    const lonDeg = lonRad * (180 / Math.PI) - 180

    earthParticleLatLon[i * 2]     = latDeg
    earthParticleLatLon[i * 2 + 1] = lonDeg

    let isLand = false
    for (const poly of landPolys) {
      if (
        lonDeg < poly.minLon || lonDeg > poly.maxLon ||
        latDeg < poly.minLat || latDeg > poly.maxLat
      ) continue
      if (pointInRing(lonDeg, latDeg, poly.ring)) {
        isLand = true
        break
      }
    }
    earthParticleLand[i] = isLand ? 1 : 0
  }

  return output
}

// ======================================================
// EXPLOSION
// ======================================================

function createExplosion(
  source,
  intensity = 2.3
) {
  const output =
    new Float32Array(
      PARTICLE_COUNT * 3
    )

  for (
    let i = 0;
    i < PARTICLE_COUNT;
    i++
  ) {
    const i3 = i * 3

    const x =
      source[i3]

    const y =
      source[i3 + 1]

    const z =
      source[i3 + 2]

    const length =
      Math.sqrt(
        x * x +
        y * y +
        z * z
      ) || 1

    let nx =
      x / length

    let ny =
      y / length

    let nz =
      z / length

    const seed =
      noiseSeeds[i]

    const swirlX =
      Math.sin(
        seed * 1.7
      ) *
      0.65

    const swirlY =
      Math.cos(
        seed * 2.2
      ) *
      0.65

    const swirlZ =
      Math.sin(
        seed * 0.9
      ) *
      0.65

    const distance =
      0.65 +
      Math.random() *
      intensity

    nx +=
      (
        Math.random() -
        0.5
      ) *
      0.35

    ny +=
      (
        Math.random() -
        0.5
      ) *
      0.35

    nz +=
      (
        Math.random() -
        0.5
      ) *
      0.35

    output[i3] =
      x +
      nx *
      distance +
      swirlX

    output[i3 + 1] =
      y +
      ny *
      distance +
      swirlY

    output[i3 + 2] =
      z +
      nz *
      distance +
      swirlZ
  }

  return output
}

// ======================================================
// HELPERS
// ======================================================

function clamp01(value) {
  return Math.max(
    0,
    Math.min(
      1,
      value
    )
  )
}

function smoothstep(value) {
  const t =
    clamp01(value)

  return (
    t *
    t *
    (
      3 -
      2 * t
    )
  )
}

function smootherstep(value) {
  const t =
    clamp01(value)

  return (
    t *
    t *
    t *
    (
      t *
      (
        t * 6 -
        15
      ) +
      10
    )
  )
}

function lerp(
  a,
  b,
  t
) {
  return (
    a +
    (
      b -
      a
    ) *
      t
  )
}

// ======================================================
// STORY TARGET MORPH
// ======================================================
//
// IMPORTANT CHANGE:
//
// This NO LONGER writes currentPositions.
//
// Scroll only decides WHERE particles WANT to go.
//
// animate() handles getting them there smoothly.
//
// ======================================================

function writeMorphTarget(
  start,
  end,
  progress,
  direction = 1
) {
  for (
    let i = 0;
    i < PARTICLE_COUNT;
    i++
  ) {
    const i3 = i * 3

    const x =
      start[i3]

    const normalizedX =
      clamp01(
        (
          x + 3
        ) /
          6
      )

    const wave =
      direction === 1
        ? normalizedX
        : 1 -
          normalizedX

    const delay =
      wave *
        0.18 +
      morphOffsets[i]

    const local =
      smootherstep(
        clamp01(
          (
            progress -
            delay
          ) /
            (
              1 -
              delay
            )
        )
      )

    storyTargetPositions[i3] =
      lerp(
        start[i3],
        end[i3],
        local
      )

    storyTargetPositions[i3 + 1] =
      lerp(
        start[i3 + 1],
        end[i3 + 1],
        local
      )

    storyTargetPositions[i3 + 2] =
      lerp(
        start[i3 + 2],
        end[i3 + 2],
        local
      )
  }

  particlesNeedUpdate = true
  colorsNeedUpdate = true
}

function writeStaticTarget(
  source
) {
  storyTargetPositions.set(
    source
  )

  particlesNeedUpdate = true
  colorsNeedUpdate = true
}

// ======================================================
// STORY / TRANSFORM STATE
// ======================================================

const story = {
  progress: 0,
}

const transformTarget = {
  x: RIGHT_X,
  y: 0,

  rx: 0,
  ry: 0,
  rz: 0,
}

let currentStage = 'brain'

let particlesNeedUpdate = true
let colorsNeedUpdate = true

// ======================================================
// POSITION HELPERS
// ======================================================

function isMobile() {
  return (
    window.innerWidth <
    768
  )
}

function desktopOrMobileX(
  desktopX
) {
  return (
    isMobile()
      ? MOBILE_X
      : desktopX
  )
}

// ======================================================
// REDUCED MOTION STORY
// ======================================================

function updateReducedMotionStory(
  progress
) {
  /*
    No explosions, spinning or constant motion.

    User simply lands on the major visual
    associated with the part of the page.
  */

  if (progress < 0.20) {
    currentStage = 'brain'

    writeStaticTarget(
      brainPositions
    )

    transformTarget.x =
      desktopOrMobileX(
        progress < 0.10
          ? RIGHT_X
          : LEFT_X
      )
  }

  else if (progress < 0.50) {
    currentStage = 'lightbulb'

    writeStaticTarget(
      lightbulbPositions
    )

    transformTarget.x =
      desktopOrMobileX(
        RIGHT_X
      )
  }

  else if (progress < 0.82) {
    currentStage = 'earth'

    writeStaticTarget(
      earthPositions
    )

    transformTarget.x =
      desktopOrMobileX(
        CENTER_X
      )
  }

  else {
    currentStage = 'logo'

    writeStaticTarget(
      logoPositions
    )

    transformTarget.x =
      desktopOrMobileX(
        LOGO_X
      )
  }

  transformTarget.y = 0

  transformTarget.rx = 0
  transformTarget.ry = 0
  transformTarget.rz = 0
}

// ======================================================
// MASTER STORY
// ======================================================
//
// Ten chapters share one 0→1 scrub. Holds sit on the
// even tenths so copy and 3D land together:
//
// 0.00 - 0.10 Brain right            s1
// 0.10 - 0.20 Brain left + rotation  s2
// 0.20 - 0.30 Brain explosion        s3
// 0.30 - 0.40 Lightbulb formation    s4
// 0.40 - 0.50 Lightbulb hold         s5
// 0.50 - 0.58 Lightbulb explosion    s6
// 0.58 - 0.68 Earth formation        s7
// 0.68 - 0.82 Earth hold             s8
// 0.82 - 0.90 Earth explosion        s9
// 0.90 - 0.96 Logo formation
// 0.96 - 1.00 Logo hold              consultation
//
// ======================================================

function updateStory() {
  if (!modelsReady) {
    return
  }

  const p =
    story.progress

  if (scrollProgressBar) {
    scrollProgressBar.style.transform =
      `scaleX(${p})`
  }

  syncNavHighlight(p)

  if (REDUCED_MOTION) {
    updateReducedMotionStory(
      p
    )

    return
  }

  // ==================================================
  // 1. BRAIN HERO
  // ==================================================

  if (p < 0.10) {
    currentStage =
      'brain'

    writeStaticTarget(
      brainPositions
    )

    const t =
      p / 0.10

    transformTarget.x =
      desktopOrMobileX(
        RIGHT_X
      )

    transformTarget.y =
      Math.sin(
        t * Math.PI
      ) *
      0.04

    transformTarget.rx =
      -0.02

    transformTarget.ry =
      lerp(
        -0.12,
        0.08,
        t
      )

    transformTarget.rz =
      0
  }

  // ==================================================
  // 2. BRAIN MOVES LEFT / CIRCULAR ROTATION
  // ==================================================

  else if (p < 0.20) {
    currentStage =
      'brain-moving'

    writeStaticTarget(
      brainPositions
    )

    const t =
      smoothstep(
        (
          p -
          0.10
        ) /
          0.10
      )

    transformTarget.x =
      desktopOrMobileX(
        lerp(
          RIGHT_X,
          LEFT_X,
          t
        )
      )

    transformTarget.y =
      Math.sin(
        t *
        Math.PI
      ) *
      0.55

    transformTarget.ry =
      0.08 +
      t *
      Math.PI *
      2.2

    transformTarget.rx =
      Math.sin(
        t *
        Math.PI *
        2
      ) *
      0.22

    transformTarget.rz =
      Math.sin(
        t *
        Math.PI
      ) *
      0.10
  }

  // ==================================================
  // 3. BRAIN EXPLOSION
  // ==================================================

  else if (p < 0.30) {
    currentStage =
      'brain-explosion'

    const t =
      (
        p -
        0.20
      ) /
      0.10

    writeMorphTarget(
      brainPositions,
      brainExplosion,
      t,
      1
    )

    transformTarget.x =
      desktopOrMobileX(
        LEFT_X
      )

    transformTarget.y = 0

    transformTarget.ry =
      Math.PI *
        2.28 +
      t *
        0.30

    transformTarget.rx =
      0.04

    transformTarget.rz =
      0
  }

  // ==================================================
  // 4. LIGHTBULB FORMS
  // ==================================================

  else if (p < 0.40) {
    currentStage =
      'lightbulb-forming'

    const t =
      (
        p -
        0.30
      ) /
      0.10

    writeMorphTarget(
      brainExplosion,
      lightbulbPositions,
      t,
      -1
    )

    transformTarget.x =
      desktopOrMobileX(
        RIGHT_X
      )

    transformTarget.y = 0

    transformTarget.ry =
      lerp(
        0.35,
        -0.10,
        t
      )

    transformTarget.rx =
      lerp(
        0.10,
        0,
        t
      )

    transformTarget.rz = 0
  }

  // ==================================================
  // 5. LIGHTBULB HOLD
  // ==================================================

  else if (p < 0.50) {
    currentStage =
      'lightbulb'

    writeStaticTarget(
      lightbulbPositions
    )

    transformTarget.x =
      desktopOrMobileX(
        RIGHT_X
      )

    transformTarget.y = 0

    transformTarget.rx = 0

    transformTarget.ry =
      0.05

    transformTarget.rz = 0
  }

  // ==================================================
  // 6. LIGHTBULB EXPLOSION
  // ==================================================

  else if (p < 0.58) {
    currentStage =
      'lightbulb-explosion'

    const t =
      (
        p -
        0.50
      ) /
      0.08

    writeMorphTarget(
      lightbulbPositions,
      lightbulbExplosion,
      t,
      -1
    )

    transformTarget.x =
      desktopOrMobileX(
        RIGHT_X
      )

    transformTarget.y = 0

    transformTarget.ry =
      0.05 +
      t *
        0.28
  }

  // ==================================================
  // 7. EARTH FORMS
  // ==================================================

  else if (p < 0.68) {
    currentStage =
      'earth-forming'

    const t =
      (
        p -
        0.58
      ) /
      0.10

    writeMorphTarget(
      lightbulbExplosion,
      earthPositions,
      t,
      1
    )

    transformTarget.x =
      desktopOrMobileX(
        CENTER_X
      )

    transformTarget.y = 0

    transformTarget.ry =
      lerp(
        0.50,
        0,
        t
      )

    transformTarget.rx =
      lerp(
        0.12,
        -0.08,
        t
      )

    transformTarget.rz = 0
  }

  // ==================================================
  // 8. EARTH HOLD
  // ==================================================

  else if (p < 0.82) {
    currentStage =
      'earth'

    writeStaticTarget(
      earthPositions
    )

    transformTarget.x =
      desktopOrMobileX(
        CENTER_X
      )

    transformTarget.y = 0

    // Spin is handled cheaply in animate().
    transformTarget.rx =
      -0.08

    transformTarget.rz =
      0
  }

  // ==================================================
  // 9. EARTH EXPLODES
  // ==================================================

  else if (p < 0.90) {
    currentStage =
      'earth-explosion'

    const t =
      (
        p -
        0.82
      ) /
      0.08

    writeMorphTarget(
      earthPositions,
      earthExplosion,
      t,
      1
    )

    transformTarget.x =
      desktopOrMobileX(
        CENTER_X
      )

    transformTarget.y = 0

    transformTarget.rx =
      -0.05

    transformTarget.ry =
      0.2 +
      t *
        0.35

    transformTarget.rz =
      0
  }

  // ==================================================
  // 10. LOGO FORMS
  // ==================================================

  else if (p < 0.96) {
    currentStage =
      'logo-forming'

    const t =
      (
        p -
        0.90
      ) /
      0.06

    writeMorphTarget(
      earthExplosion,
      logoPositions,
      t,
      -1
    )

    transformTarget.x =
      desktopOrMobileX(
        LOGO_X
      )

    transformTarget.y =
      lerp(
        0,
        0.04,
        t
      )

    transformTarget.rx =
      lerp(
        0.08,
        0,
        t
      )

    // Let logo settle front-facing
    // before it begins its idle spin.
    transformTarget.ry =
      lerp(
        0.45,
        0,
        smoothstep(t)
      )

    transformTarget.rz =
      0
  }

  // ==================================================
  // 11. LOGO FULLY FORMED
  // ==================================================

  else {
    currentStage =
      'logo'

    writeStaticTarget(
      logoPositions
    )

    transformTarget.x =
      desktopOrMobileX(
        LOGO_X
      )

    transformTarget.y =
      0.04

    transformTarget.rx =
      0

    transformTarget.rz =
      0

    // Continuous cheap global spin
    // handled in animate().
  }
}

// ======================================================
// LOAD MODELS
// ======================================================


Promise.all([
  loadGLB(
    '/models/brain.glb'
  ),

  loadGLB(
    '/models/lightbulb.glb'
  ),

  fetch('/geojson/ne_110m_land.json')
    .then(r => r.json()),

  loadGLB(
    '/models/metaminds-logo.glb'
  ),
])
  .then(
    ([
      brainGLB,
      bulbGLB,
      landGeoJSON,
      logoGLB,
    ]) => {
      brainPositions =
        modelToParticlePositions(
          brainGLB.scene,
          BRAIN_SIZE
        )

      lightbulbPositions =
        modelToParticlePositions(
          bulbGLB.scene,
          LIGHTBULB_SIZE
        )

      earthPositions =
        generateGlobePositions(landGeoJSON)

      logoPositions =
        generateLogoPositions(
          brainGLB.scene,
          logoGLB.scene
        )

      if (
        !brainPositions ||
        !lightbulbPositions ||
        !logoPositions
      ) {
        throw new Error(
          'One or more models contained no usable mesh vertices.'
        )
      }

      brainExplosion =
        createExplosion(
          brainPositions,
          2.2
        )

      lightbulbExplosion =
        createExplosion(
          lightbulbPositions,
          2.0
        )

      earthExplosion =
        createExplosion(
          earthPositions,
          2.5
        )

      currentPositions.set(
        brainPositions
      )

      storyTargetPositions.set(
        brainPositions
      )

      modelsReady = true

      createPage()

      if (bootScreen) {
        bootScreen.classList.add(
          'is-done'
        )
      }

      // Build initial matrices/colors once.
      updateParticleInstances(
        true
      )

      updateStory()

      console.log(
        'MetaMinds visual story ready.'
      )
    }
  )
  .catch(
    (error) => {
      console.error(
        'Model loading failed:',
        error
      )

      if (bootScreen) {
        const label =
          bootScreen.querySelector('p')

        if (label) {
          label.textContent =
            'Could not load the sketch'
        }
      }
    }
  )

// ======================================================
// NAV
// ======================================================

let navLinks = []

function createNavbar() {
  const nav =
    document.createElement(
      'nav'
    )

  nav.className =
    'metaminds-nav'

  nav.setAttribute(
    'aria-label',
    'MetaMinds'
  )

  nav.innerHTML = `
    <a class="brand" href="#s1">
      <img
        src="/metaminds-logo.png"
        alt="MetaMinds STEM Academy"
        class="brand-logo"
      >
    </a>

    <a
      class="nav-cta"
      href="#consultation"
    >
      Book a Free Consultation
    </a>

    <button
      class="menu-button"
      type="button"
      aria-label="Open chapters"
      aria-expanded="false"
      aria-controls="nav-panel"
    >
      <span></span>
      <span></span>
    </button>

    <div class="nav-panel" id="nav-panel">
      <div class="nav-links">
        <a href="#s1">Home</a>
        <a href="#s2">Assess</a>
        <a href="#s3">Analyze</a>
        <a href="#s4">Ignite</a>
        <a href="#s5">Build</a>
        <a href="#s6">Connect</a>
        <a href="#s7">System</a>
        <a href="#s8">Grow</a>
        <a href="#s9">Transform</a>
        <a href="#consultation">Begin</a>
      </div>
      <a
        class="nav-cta nav-panel-cta"
        href="#consultation"
      >
        Book a Free Consultation
      </a>
    </div>
  `

  document.body.appendChild(
    nav
  )
}

function closeNav() {
  const nav =
    document.querySelector(
      '.metaminds-nav'
    )

  if (!nav) {
    return
  }

  const button =
    nav.querySelector(
      '.menu-button'
    )

  nav.classList.remove(
    'is-open'
  )

  document.body.classList.remove(
    'nav-open'
  )

  if (button) {
    button.setAttribute(
      'aria-expanded',
      'false'
    )

    button.setAttribute(
      'aria-label',
      'Open chapters'
    )
  }
}

function setupNav() {
  const nav =
    document.querySelector(
      '.metaminds-nav'
    )

  if (!nav) {
    return
  }

  const button =
    nav.querySelector(
      '.menu-button'
    )

  const panel =
    nav.querySelector(
      '.nav-panel'
    )

  navLinks =
    Array.from(
      nav.querySelectorAll(
        '.nav-links a'
      )
    )

  button.addEventListener(
    'click',
    () => {
      const open =
        nav.classList.toggle(
          'is-open'
        )

      document.body.classList.toggle(
        'nav-open',
        open
      )

      button.setAttribute(
        'aria-expanded',
        String(open)
      )

      button.setAttribute(
        'aria-label',
        open
          ? 'Close chapters'
          : 'Open chapters'
      )
    }
  )

  navLinks.forEach(
    (link) => {
      link.addEventListener(
        'click',
        closeNav
      )
    }
  )

  nav.querySelector(
    '.brand'
  )?.addEventListener(
    'click',
    closeNav
  )

  nav.querySelectorAll(
    '.nav-cta'
  ).forEach(
    (link) => {
      link.addEventListener(
        'click',
        closeNav
      )
    }
  )

  panel.addEventListener(
    'click',
    (event) => {
      if (event.target === panel) {
        closeNav()
      }
    }
  )

  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        closeNav()
      }
    }
  )
}

function syncNavHighlight(
  progress
) {
  if (!navLinks.length) {
    return
  }

  const ids = [
    '#s1',
    '#s2',
    '#s3',
    '#s4',
    '#s5',
    '#s6',
    '#s7',
    '#s8',
    '#s9',
    '#consultation',
  ]

  const index =
    Math.min(
      ids.length - 1,
      Math.max(
        0,
        Math.floor(
          progress * 10
        )
      )
    )

  const active =
    ids[index]

  navLinks.forEach(
    (link) => {
      link.classList.toggle(
        'is-active',
        link.getAttribute(
          'href'
        ) ===
          active
      )
    }
  )
}

// ======================================================
// PAGE
// ======================================================

let experienceElement = null

function createPage() {
  createNavbar()

  const main =
    document.createElement(
      'main'
    )

  main.className =
    'experience'

  main.innerHTML = `

    <section class="chapter" id="s1">

      <div class="copy copy-left">

        <div class="eyebrow orange">
          PERSONALIZED LEARNING
        </div>

        <h1>
          Every mind
          <br>learns
          <br><span>differently.</span>
        </h1>

        <p>
          Tailored tutoring and mentorship
          built around how your student
          actually thinks, learns, and grows.
        </p>

        <a
          href="#consultation"
          class="primary-button"
        >
          Book a Free Consultation
          <strong>→</strong>
        </a>

      </div>

      <div class="scroll-marker">
        SCROLL TO EXPLORE
        <span></span>
      </div>

    </section>


    <section class="chapter" id="s2">

      <div class="copy copy-right">

        <div class="eyebrow orange">
          UNDERSTAND THE WHOLE STUDENT
        </div>

        <h2>
          Look at learning
          <br>from every
          <br><span>angle.</span>
        </h2>

        <p>
          Scores tell only part of the story.
          We look at skills, habits, confidence,
          pacing, strengths, and goals together.
        </p>

      </div>

    </section>


    <section class="chapter" id="s3">

      <div class="copy copy-right">

        <div class="eyebrow orange">
          FIND THE GAPS
        </div>

        <h2>
          Break the
          <br>problem
          <br><span>apart.</span>
        </h2>

        <p>
          Complex challenges become manageable
          when we identify the individual skills
          underneath — and understand exactly
          what is holding your student back.
        </p>

      </div>

    </section>


    <section class="chapter" id="s4">

      <div class="copy copy-left">

        <div class="eyebrow blue">
          THE BREAKTHROUGH
        </div>

        <h2>
          The right explanation
          <br>changes
          <br><span>everything.</span>
        </h2>

        <p>
          A well-chosen strategy, example,
          or question can turn months of
          confusion into a moment of clarity.
        </p>

      </div>

    </section>


    <section class="chapter" id="s5">

      <div class="copy copy-left">

        <div class="eyebrow blue">
          BUILD ON EVERY WIN
        </div>

        <h2>
          One breakthrough
          <br>leads to
          <br><span>another.</span>
        </h2>

        <p>
          Learning compounds. Each skill
          mastered becomes the foundation
          for the next challenge. Progress
          builds confidence, and confidence
          builds progress.
        </p>

      </div>

    </section>


    <section class="chapter" id="s6">

      <div class="copy copy-right">

        <div class="eyebrow blue">
          CONNECTED LEARNING
        </div>

        <h2>
          See the
          <br>bigger
          <br><span>picture.</span>
        </h2>

        <p>
          Math, reading, science, test prep,
          technology, and study habits all
          influence one another. Understanding
          the connections is how we accelerate growth.
        </p>

      </div>

    </section>


    <section class="chapter" id="s7">

      <div class="copy copy-left">

        <div class="eyebrow blue">
          ONE LEARNING SYSTEM
        </div>

        <h2>
          Everything
          <br>is
          <br><span>connected.</span>
        </h2>

        <p>
          MetaMinds brings together tutoring,
          targeted practice, progress tracking,
          and mentorship around one student —
          not one subject.
        </p>

      </div>

    </section>


    <section class="chapter" id="s8">

      <div class="copy copy-right">

        <div class="eyebrow orange">
          GROW BEYOND THE CLASSROOM
        </div>

        <h2>
          Build skills
          <br>that keep
          <br><span>growing.</span>
        </h2>

        <p>
          We want students to become stronger,
          more confident, and more independent
          learners — not just better at homework.
        </p>

      </div>

    </section>


    <section class="chapter" id="s9">

      <div class="copy copy-left">

        <div class="eyebrow orange">
          METAMINDS
        </div>

        <h2>
          Built around
          <br>how students
          <br><span>learn.</span>
        </h2>

        <p>
          Every decision — from session pacing
          to practice problems — is driven by
          what the student actually needs next.
        </p>

      </div>

    </section>


    <section
      id="consultation"
      class="chapter logo-hold-chapter"
    >

      <div class="copy copy-right">

        <div class="eyebrow blue">
          METAMINDS
        </div>

        <h2>
          Let's build
          <br>what comes
          <br><span>next.</span>
        </h2>

        <p>
          Start with a free consultation and
          tell us about your student's goals,
          strengths, and challenges.
        </p>

        <a
          href="mailto:hello@metaminds.com"
          class="primary-button"
        >
          Book a Free Consultation
          <strong>→</strong>
        </a>

      </div>

    </section>

    <footer class="sketch-footer">
      <span>MetaMinds STEM Academy</span>
      <a href="mailto:hello@metaminds.com">hello@metaminds.com</a>
    </footer>

  `

  document.body.appendChild(
    main
  )

  experienceElement =
    main

  setupNav()

  // ==================================================
  // MASTER SCROLL
  // ==================================================

  gsap.to(
    story,
    {
      progress: 1,

      ease: 'none',

      scrollTrigger: {
        trigger:
          main,

        start:
          'top top',

        end:
          'bottom bottom',

        scrub:
          REDUCED_MOTION
            ? false
            : 0.55,

        onUpdate:
          updateStory,
      },
    }
  )

  // ==================================================
  // COPY MOTION
  // ==================================================

  const chapters =
    document.querySelectorAll(
      '.chapter'
    )

  chapters.forEach(
    (
      chapter,
      index
    ) => {
      const copy =
        chapter.querySelector(
          '.copy'
        )

      if (
        !copy
      ) {
        return
      }

      if (
        REDUCED_MOTION
      ) {
        return
      }

      if (
        index === 0
      ) {
        const marker =
          chapter.querySelector(
            '.scroll-marker'
          )

        if (marker) {
          gsap.to(
            marker,
            {
              opacity: 0,

              scrollTrigger: {
                trigger:
                  chapter,

                start:
                  '20% top',

                end:
                  '55% top',

                scrub:
                  true,
              },
            }
          )
        }
      }

      if (
        index !== 0
      ) {
        gsap.fromTo(
          copy,
          {
            opacity: 0,
            y: 48,
          },
          {
            opacity: 1,
            y: 0,

            scrollTrigger: {
              trigger:
                chapter,

              start:
                'top 78%',

              end:
                '42% center',

              scrub:
                true,
            },
          }
        )
      }

      if (
        index <
        chapters.length - 1
      ) {
        gsap.to(
          copy,
          {
            opacity: 0,
            y: -40,

            scrollTrigger: {
              trigger:
                chapter,

              start:
                '62% center',

              end:
                'bottom 18%',

              scrub:
                true,
            },
          }
        )
      }
    }
  )

  setupVisibilityObserver()
}



// ======================================================
// INSTANCE UPDATE
// ======================================================

const dummy =
  new THREE.Object3D()

function updateParticleInstances(
  forceColors = false
) {
  let stillMoving =
    false

  const shouldHandlePointer =
    pointerActive &&
    !TOUCH_DEVICE &&
    !REDUCED_MOTION

  const localPointerX =
    pointer.x -
    particles.position.x

  const localPointerY =
    pointer.y -
    particles.position.y

  const updateColors =
    forceColors ||
    colorsNeedUpdate ||
    shouldHandlePointer

  for (
    let i = 0;
    i < PARTICLE_COUNT;
    i++
  ) {
    const i3 = i * 3

    // ----------------------------------
    // SMOOTHLY CHASE STORY TARGET
    // ----------------------------------

    const tx =
      storyTargetPositions[i3]

    const ty =
      storyTargetPositions[
        i3 + 1
      ]

    const tz =
      storyTargetPositions[
        i3 + 2
      ]

    let x =
      currentPositions[i3]

    let y =
      currentPositions[
        i3 + 1
      ]

    let z =
      currentPositions[
        i3 + 2
      ]

    const dxTarget =
      tx - x

    const dyTarget =
      ty - y

    const dzTarget =
      tz - z

    const maxDelta =
      Math.max(
        Math.abs(
          dxTarget
        ),
        Math.abs(
          dyTarget
        ),
        Math.abs(
          dzTarget
        )
      )

    if (
      maxDelta >
      SETTLE_EPSILON
    ) {
      stillMoving = true

      x +=
        dxTarget *
        POSITION_LERP

      y +=
        dyTarget *
        POSITION_LERP

      z +=
        dzTarget *
        POSITION_LERP

      currentPositions[i3] =
        x

      currentPositions[
        i3 + 1
      ] =
        y

      currentPositions[
        i3 + 2
      ] =
        z
    } else {
      currentPositions[i3] =
        tx

      currentPositions[
        i3 + 1
      ] =
        ty

      currentPositions[
        i3 + 2
      ] =
        tz

      x = tx
      y = ty
      z = tz
    }

    // ----------------------------------
    // POINTER EFFECT — DESKTOP ONLY
    // ----------------------------------

    let influence = 0

    if (
      shouldHandlePointer
    ) {
      const pointerDX =
        x -
        localPointerX

      const pointerDY =
        y -
        localPointerY

      const pointerDistance =
        Math.sqrt(
          pointerDX *
            pointerDX +
          pointerDY *
            pointerDY
        )

      if (
        pointerDistance <
        INTERACTION_RADIUS
      ) {
        influence =
          1 -
          pointerDistance /
            INTERACTION_RADIUS

        influence *=
          influence

        const safeDistance =
          pointerDistance ||
          0.001

        x +=
          (
            pointerDX /
            safeDistance
          ) *
          influence *
          REPULSION_FORCE

        y +=
          (
            pointerDY /
            safeDistance
          ) *
          influence *
          REPULSION_FORCE

        z +=
          influence *
          DEPTH_BULGE
      }
    }

    // ----------------------------------
    // MATRIX
    // ----------------------------------

    dummy.position.set(
      x,
      y,
      z
    )

    dummy.rotation.set(
      rotations[i3],
      rotations[
        i3 + 1
      ],
      rotations[
        i3 + 2
      ]
    )

    const scale =
      scales[i] *
      (
        1 +
        influence *
          0.30
      )

    dummy.scale.set(
      scale,
      scale,
      scale
    )

    dummy.updateMatrix()

    particles.setMatrixAt(
      i,
      dummy.matrix
    )

    // ----------------------------------
    // COLOR
    // ----------------------------------

    if (updateColors) {
      const isEarthStage =
        earthParticleLatLon &&
        (
          currentStage === 'earth' ||
          currentStage === 'earth-forming' ||
          currentStage === 'earth-explosion'
        )

      if (isEarthStage) {
        const lat =
          earthParticleLatLon[i * 2]

        const absLat = Math.abs(lat)

        if (absLat > 70) {
          tempColor.lerpColors(
            BLUE,
            EARTH_ICE,
            (absLat - 70) / 20
          )
        } else if (earthParticleLand[i] === 1) {
          tempColor.lerpColors(
            BURNT_ORANGE,
            ORANGE,
            absLat / 70
          )
        } else {
          const oceanT = (lat + 70) / 140
          if (oceanT < 0.5) {
            tempColor.lerpColors(NAVY, BLUE, oceanT * 2)
          } else {
            tempColor.lerpColors(BLUE, MINDS_BLUE, (oceanT - 0.5) * 2)
          }
        }
      } else {
        const normalizedX =
          THREE.MathUtils.clamp(
            (x + 2.6) / 5.2,
            0,
            1
          )

        if (normalizedX < 0.45) {
          tempColor.lerpColors(
            ORANGE,
            BURNT_ORANGE,
            normalizedX / 0.45
          )
        } else if (normalizedX < 0.72) {
          tempColor.lerpColors(
            NAVY,
            BLUE,
            (normalizedX - 0.45) / 0.27
          )
        } else {
          tempColor.lerpColors(
            BLUE,
            MINDS_BLUE,
            (normalizedX - 0.72) / 0.28
          )
        }

        if (influence > 0) {
          tempColor.lerp(
            normalizedX > 0.5
              ? MINDS_BLUE
              : WHITE,
            influence * 0.35
          )
        }
      }

      particles.setColorAt(
        i,
        tempColor
      )
    }
  }

  particles.instanceMatrix.needsUpdate =
    true

  if (updateColors) {
    particles.instanceColor.needsUpdate =
      true

    colorsNeedUpdate =
      false
  }

  particlesNeedUpdate =
    stillMoving

  return stillMoving
}

// ======================================================
// ANIMATION LOOP
// ======================================================

let loopRunning =
  false

let experienceVisible =
  true

let lastFrameTime =
  performance.now()

function animate() {
  if (
    document.hidden ||
    !experienceVisible
  ) {
    return
  }

  const now =
    performance.now()

  const dt =
    Math.min(
      (
        now -
        lastFrameTime
      ) /
        1000,
      0.05
    )

  lastFrameTime =
    now

  // ----------------------------------
  // POINTER SMOOTHING
  // ----------------------------------

  if (
    !TOUCH_DEVICE &&
    !REDUCED_MOTION
  ) {
    pointer.lerp(
      pointerActive
        ? pointerTarget
        : offscreenPointer,

      0.12
    )
  }

  // ----------------------------------
  // CHEAP WHOLE-OBJECT MOTION
  // ----------------------------------

  /*
    This does NOT rebuild 26k matrices.

    We are rotating / moving the
    InstancedMesh as a single object.
  */

  particles.position.x +=
    (
      transformTarget.x -
      particles.position.x
    ) *
    (
      REDUCED_MOTION
        ? 1
        : 0.10
    )

  particles.position.y +=
    (
      transformTarget.y -
      particles.position.y
    ) *
    (
      REDUCED_MOTION
        ? 1
        : 0.10
    )

  particles.rotation.x +=
    (
      transformTarget.rx -
      particles.rotation.x
    ) *
    (
      REDUCED_MOTION
        ? 1
        : 0.10
    )

  particles.rotation.z +=
    (
      transformTarget.rz -
      particles.rotation.z
    ) *
    (
      REDUCED_MOTION
        ? 1
        : 0.10
    )

  // ----------------------------------
  // CHEAP IDLE ROTATION
  // ----------------------------------

  if (!REDUCED_MOTION) {
    if (
      currentStage ===
      'earth'
    ) {
      /*
        Earth continues rotating even
        when the user stops scrolling.

        Cheap because it is only the
        parent object transform.
      */

      particles.rotation.y +=
        dt *
        0.32
    }

    else if (
      currentStage ===
      'logo'
    ) {
      /*
        Gentle oscillation keeps the logo
        facing roughly forward so MetaMinds
        text stays legible at all times.
      */

      particles.rotation.y +=
        (
          Math.sin(
            lastFrameTime *
            0.0008
          ) *
          0.18 -
          particles.rotation.y
        ) *
        0.025
    }

    else {
      particles.rotation.y +=
        (
          transformTarget.ry -
          particles.rotation.y
        ) *
        0.10
    }
  } else {
    particles.rotation.y =
      transformTarget.ry
  }

  // ----------------------------------
  // EXPENSIVE PARTICLE LOOP
  // ONLY WHEN REQUIRED
  // ----------------------------------

  const needParticleLoop =
    particlesNeedUpdate ||
    (
      pointerActive &&
      !TOUCH_DEVICE &&
      !REDUCED_MOTION
    )

  if (needParticleLoop) {
    updateParticleInstances(
      false
    )
  }

  composer.render()
}

// ======================================================
// LOOP START / STOP
// ======================================================

function startLoop() {
  if (loopRunning) {
    return
  }

  loopRunning = true

  lastFrameTime =
    performance.now()

  renderer.setAnimationLoop(
    animate
  )
}

function stopLoop() {
  if (!loopRunning) {
    return
  }

  loopRunning = false

  renderer.setAnimationLoop(
    null
  )
}

startLoop()

// ======================================================
// TAB VISIBILITY
// ======================================================

document.addEventListener(
  'visibilitychange',
  () => {
    if (
      document.hidden
    ) {
      stopLoop()
    } else if (
      experienceVisible
    ) {
      startLoop()
    }
  }
)

// ======================================================
// EXPERIENCE VISIBILITY
// ======================================================

function setupVisibilityObserver() {
  if (!experienceElement) {
    return
  }

  const observer =
    new IntersectionObserver(
      (entries) => {
        const entry =
          entries[0]

        experienceVisible =
          entry.isIntersecting

        if (
          experienceVisible &&
          !document.hidden
        ) {
          startLoop()
        } else {
          stopLoop()
        }
      },
      {
        root: null,

        /*
          Keep animation running slightly
          before / after the animated zone,
          but stop it once we're deep
          into normal homepage/footer.
        */
        rootMargin:
          '100px 0px 100px 0px',

        threshold: 0,
      }
    )

  observer.observe(
    experienceElement
  )
}

// ======================================================
// RESIZE
// ======================================================

let lastViewportWidth =
  window.innerWidth

let refreshTimer = null

window.addEventListener(
  'resize',
  () => {
    camera.aspect =
      window.innerWidth /
      window.innerHeight

    camera.updateProjectionMatrix()

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    )

    composer.setSize(
      window.innerWidth,
      window.innerHeight
    )

    const ratio =
      Math.min(
        window.devicePixelRatio,

        window.innerWidth <
          768
          ? 1.25
          : 1.5
      )

    renderer.setPixelRatio(
      ratio
    )

    composer.setPixelRatio(
      ratio
    )

    /*
      Mobile browser chrome frequently
      changes viewport HEIGHT while scrolling.

      Don't refresh ScrollTrigger for that.

      Only refresh when WIDTH actually changes.
    */

    const width =
      window.innerWidth

    if (
      Math.abs(
        width -
        lastViewportWidth
      ) >
      2
    ) {
      lastViewportWidth =
        width

      clearTimeout(
        refreshTimer
      )

      refreshTimer =
        setTimeout(
          () => {
            updateStory()

            ScrollTrigger.refresh()
          },
          180
        )
    }
  }
)