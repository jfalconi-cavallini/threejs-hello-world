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

// Phone-first 60fps-class budget. Density is secondary.
const PARTICLE_COUNT =
  MOBILE_AT_LOAD
    ? 1800
    : 4200

// Extra, dedicated fill just for the closing MetaMinds mark — never
// drawn until the final hold, so it costs nothing during the rest of
// the scroll. This is what makes the wordmark actually read as text.
const LOGO_DETAIL_COUNT =
  MOBILE_AT_LOAD
    ? 4200
    : 9500

// Same idea for the opening hero shot — the shared morph budget
// alone reads as a fuzzy blob at a glance, so a dedicated dense
// layer fades in just for the brain hold, then back out before it
// explodes into the lightbulb.
const HERO_BRAIN_DETAIL_COUNT =
  MOBILE_AT_LOAD
    ? 2200
    : 4800

const PIXEL_RATIO_CAP =
  MOBILE_AT_LOAD
    ? 1
    : 1.5

const PIXEL_RATIO =
  Math.min(
    window.devicePixelRatio || 1,
    PIXEL_RATIO_CAP
  )

const USE_COMPOSER =
  !MOBILE_AT_LOAD

console.log({
  PARTICLE_COUNT,
  PIXEL_RATIO,
  PIXEL_RATIO_CAP,
  USE_COMPOSER,
  TOUCH_DEVICE,
  REDUCED_MOTION,
})

// ======================================================
// VISUAL SETTINGS
// ======================================================

const BRAIN_SIZE = 3.2
const LIGHTBULB_SIZE = 4.45
const EARTH_SIZE = 4.35
const LOGO_SIZE = 4.6

const RIGHT_X = 3.22
const HERO_BRAIN_X = 2.45
const LEFT_X = -2.0
const CENTER_X = 0.35
const LOGO_X = 0

const MOBILE_X = 0

// Tighter hover effect.
const INTERACTION_RADIUS = 0.28
const REPULSION_FORCE = 0.12
const DEPTH_BULGE = 0.16

// How quickly actual particles chase the story target.
const POSITION_LERP =
  MOBILE_AT_LOAD
    ? 0.11
    : 0.055

let morphLerp =
  POSITION_LERP

// Once every particle gets sufficiently close,
// stop touching the instance matrices.
const SETTLE_EPSILON = 0.0015

// ======================================================
// SCENE
// ======================================================

const scene =
  new THREE.Scene()

scene.background =
  new THREE.Color(0x000000)

scene.fog = null

// ======================================================
// CAMERA
// ======================================================

const camera =
  new THREE.PerspectiveCamera(
    50,
    window.innerWidth /
      window.innerHeight,
    0.1,
    1000
  )

camera.position.z = 4.55
camera.position.x = -0.68

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
  PIXEL_RATIO
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
    MOBILE_AT_LOAD ? 0 : 0.22,
    MOBILE_AT_LOAD ? 0 : 0.18,
    MOBILE_AT_LOAD ? 1 : 0.48
  )

if (USE_COMPOSER) {
  composer.addPass(
    bloomPass
  )
}

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

const MUTE =
  new THREE.Color(
    0x7f91a8
  )

const WHITE =
  new THREE.Color(
    0xffffff
  )

const INK =
  new THREE.Color(
    0xf3f6f9
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

const displayPositions =
  new Float32Array(
    PARTICLE_COUNT * 3
  )

// ======================================================
// VOLUMETRIC POINT FIELD
// ======================================================

const ambientTime =
  { value: 0 }

const logoStill =
  { value: 0 }

const pointMaterials = []

function createPointMaterial({
  size,
  drift,
  alpha,
  additive = true,
}) {
  const uniforms = {
    uTime: ambientTime,
    uPixelRatio: {
      value: renderer.getPixelRatio(),
    },
    uSize: { value: size },
    uDrift: { value: drift },
    uAlpha: { value: alpha },
  }

  const material =
    new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: additive
        ? THREE.AdditiveBlending
        : THREE.NormalBlending,
      toneMapped: false,
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uSize;
        uniform float uDrift;
        attribute float aScale;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAngle;

        void main() {
          vColor = color;
          float seed = position.x * 1.73 + position.y * 2.11 + position.z * 1.37;
          vec3 pos = position;
          pos += vec3(
            sin(uTime * 0.53 + seed) * 1.15,
            cos(uTime * 0.41 + seed * 1.2) * 0.88,
            sin(uTime * 0.47 + seed * 0.8) * 1.02
          ) * uDrift;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float dist = max(0.42, -mvPosition.z);
          float atten = 12.4 / dist;
          float sz = uSize * aScale * atten * uPixelRatio;
          sz = min(sz, 33.0);
          gl_PointSize = max(sz, 1.4);
          gl_Position = projectionMatrix * mvPosition;
          // Slow tumble, unique per particle so the field doesn't
          // read as a uniform grid of identical facets.
          vAngle = uTime * (0.16 + fract(seed * 4.37) * 0.34) + seed * 6.2831853;
        }
      `,
      fragmentShader: `
        uniform float uAlpha;
        varying vec3 vColor;
        varying float vAngle;

        // iq's equilateral-triangle SDF — draws each particle as a
        // faceted wireframe triangle instead of a soft round blob.
        float sdEquilateralTriangle(vec2 p, float r) {
          const float k = 1.7320508;
          p.x = abs(p.x) - r;
          p.y = p.y + r / k;
          if (p.x + k * p.y > 0.0) {
            p = vec2(p.x - k * p.y, -k * p.x - p.y) * 0.5;
          }
          p.x -= clamp(p.x, -2.0 * r, 0.0);
          return -length(p) * sign(p.y);
        }

        void main() {
          vec2 c = (gl_PointCoord - vec2(0.5)) * 2.2;
          float ca = cos(vAngle);
          float sa = sin(vAngle);
          vec2 rc = vec2(ca * c.x - sa * c.y, sa * c.x + ca * c.y);

          float d = sdEquilateralTriangle(rc, 0.62);

          float lw = 0.07;
          float aa = 0.05;
          float edge = 1.0 - smoothstep(lw - aa, lw + aa, abs(d));
          float fill = smoothstep(0.0, -0.55, d) * 0.16;
          float core = clamp(edge + fill, 0.0, 1.0);

          if (core < 0.02) discard;

          gl_FragColor = vec4(vColor * 1.1, core * uAlpha);
        }
      `,
    })

  pointMaterials.push(material)
  return material
}

const particleColors =
  new Float32Array(
    PARTICLE_COUNT * 3
  )

const particleSizeAttr =
  new Float32Array(
    PARTICLE_COUNT
  )

particleSizeAttr.fill(1)

const particleGeometry =
  new THREE.BufferGeometry()

particleGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(
    displayPositions,
    3
  ).setUsage(
    THREE.DynamicDrawUsage
  )
)

particleGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute(
    particleColors,
    3
  ).setUsage(
    THREE.DynamicDrawUsage
  )
)

particleGeometry.setAttribute(
  'aScale',
  new THREE.BufferAttribute(
    particleSizeAttr,
    1
  )
)

const particleMaterial =
  createPointMaterial({
    size: MOBILE_AT_LOAD ? 8.5 : 7,
    drift: REDUCED_MOTION ? 0 : 0.042,
    alpha: 0.9,
    additive: true,
  })

const particles =
  new THREE.Points(
    particleGeometry,
    particleMaterial
  )

particles.frustumCulled = false

scene.add(particles)

// ======================================================
// AMBIENT DEBRIS — sparse large wireframes in the dark
// ======================================================

const DEBRIS_COUNT =
  MOBILE_AT_LOAD
    ? 10
    : 28

const debrisPositions =
  new Float32Array(
    DEBRIS_COUNT * 3
  )

const debrisColors =
  new Float32Array(
    DEBRIS_COUNT * 3
  )

const debrisSizes =
  new Float32Array(
    DEBRIS_COUNT
  )

{
  for (
    let i = 0;
    i < DEBRIS_COUNT;
    i++
  ) {
    const i3 = i * 3

    debrisPositions[i3] =
      (Math.random() - 0.5) * 16

    debrisPositions[i3 + 1] =
      (Math.random() - 0.5) * 11

    debrisPositions[i3 + 2] =
      (Math.random() - 0.5) * 14

    Math.random()
    Math.random()
    Math.random()

    debrisSizes[i] =
      0.35 +
      Math.random() *
      2.1

    if (i % 3 === 0) {
      tempColor.copy(ORANGE)
    } else if (i % 3 === 1) {
      tempColor.copy(NAVY)
    } else {
      tempColor.copy(BLUE)
    }

    tempColor.multiplyScalar(
      0.55 +
      Math.random() *
      0.45
    )

    debrisColors[i3] = tempColor.r
    debrisColors[i3 + 1] = tempColor.g
    debrisColors[i3 + 2] = tempColor.b
  }
}

const debrisGeometry =
  new THREE.BufferGeometry()

debrisGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(
    debrisPositions,
    3
  )
)

debrisGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute(
    debrisColors,
    3
  )
)

debrisGeometry.setAttribute(
  'aScale',
  new THREE.BufferAttribute(
    debrisSizes,
    1
  )
)

const debrisMaterial =
  createPointMaterial({
    size: MOBILE_AT_LOAD ? 20 : 26,
    drift: REDUCED_MOTION ? 0 : 0.11,
    alpha: 0.22,
    additive: true,
  })

const debris =
  new THREE.Points(
    debrisGeometry,
    debrisMaterial
  )

debris.frustumCulled = false

scene.add(debris)

// ======================================================
// VOLUME FIELD — particles in the dark around the form
// ======================================================

const FIELD_COUNT =
  MOBILE_AT_LOAD
    ? 0
    : 900

const fieldPositions =
  new Float32Array(
    FIELD_COUNT * 3
  )

const fieldColors =
  new Float32Array(
    FIELD_COUNT * 3
  )

const fieldSizes =
  new Float32Array(
    FIELD_COUNT
  )

{
  for (
    let i = 0;
    i < FIELD_COUNT;
    i++
  ) {
    const i3 = i * 3

    const radius =
      Math.pow(
        Math.random(),
        0.45
      ) *
      8.2

    const theta =
      Math.random() *
      Math.PI *
      2

    const phi =
      Math.acos(
        2 *
        Math.random() -
        1
      )

    fieldPositions[i3] =
      radius *
        Math.sin(phi) *
        Math.cos(theta)

    fieldPositions[i3 + 1] =
      radius *
        Math.sin(phi) *
        Math.sin(theta) *
        0.7

    fieldPositions[i3 + 2] =
      radius *
        Math.cos(phi)

    Math.random()
    Math.random()
    Math.random()

    fieldSizes[i] =
      0.45 +
      Math.random() *
      1.8

    if (i % 2 === 0) {
      tempColor.lerpColors(
        ORANGE,
        BURNT_ORANGE,
        Math.random()
      )
    } else {
      tempColor.lerpColors(
        NAVY,
        BLUE,
        Math.random()
      )
    }

    tempColor.multiplyScalar(
      0.35 +
      Math.random() *
      0.5
    )

    fieldColors[i3] = tempColor.r
    fieldColors[i3 + 1] = tempColor.g
    fieldColors[i3 + 2] = tempColor.b
  }
}

const fieldGeometry =
  new THREE.BufferGeometry()

fieldGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(
    fieldPositions,
    3
  )
)

fieldGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute(
    fieldColors,
    3
  )
)

fieldGeometry.setAttribute(
  'aScale',
  new THREE.BufferAttribute(
    fieldSizes,
    1
  )
)

const fieldMaterial =
  createPointMaterial({
    size: MOBILE_AT_LOAD ? 4 : 3.4,
    drift: REDUCED_MOTION ? 0 : 0.16,
    alpha: 0.55,
    additive: true,
  })

const field =
  new THREE.Points(
    fieldGeometry,
    fieldMaterial
  )

field.frustumCulled = false

if (FIELD_COUNT > 0) {
  scene.add(field)
}

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

particleSizeAttr.set(scales)
particleGeometry.attributes.aScale.needsUpdate =
  true

let volumeField = null
let logoDetail = null
let heroBrainDetail = null

// Extra volumetric dust — golden-ratio sphere, no Math.random
// so the existing RNG stream for forms/explosions stays intact.
const VOLUME_COUNT =
  MOBILE_AT_LOAD
    ? 0
    : 1150

console.log({
  FIELD_COUNT,
  DEBRIS_COUNT,
  VOLUME_COUNT,
})

if (VOLUME_COUNT > 0)
{
  const volumePositions =
    new Float32Array(
      VOLUME_COUNT * 3
    )

  const volumeColors =
    new Float32Array(
      VOLUME_COUNT * 3
    )

  const volumeSizes =
    new Float32Array(
      VOLUME_COUNT
    )

  const PHI = 1.618033988749895

  for (
    let i = 0;
    i < VOLUME_COUNT;
    i++
  ) {
    const i3 = i * 3
    const t = (i + 0.5) / VOLUME_COUNT
    const y = 1 - 2 * t
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = 2 * Math.PI * i * PHI
    const radius =
      1.6 +
      ((i * PHI) % 1) * 10.5

    volumePositions[i3] =
      radius * r * Math.cos(theta)
    volumePositions[i3 + 1] =
      radius * y * 0.72
    volumePositions[i3 + 2] =
      radius * r * Math.sin(theta)

    volumeSizes[i] =
      0.4 +
      ((i * 0.37) % 1) * 1.4

    if (i % 2 === 0) {
      tempColor.lerpColors(
        ORANGE,
        BURNT_ORANGE,
        (i * 0.13) % 1
      )
    } else {
      tempColor.lerpColors(
        NAVY,
        BLUE,
        (i * 0.19) % 1
      )
    }

    tempColor.multiplyScalar(
      0.22 +
      ((i * 0.29) % 1) * 0.4
    )

    volumeColors[i3] = tempColor.r
    volumeColors[i3 + 1] = tempColor.g
    volumeColors[i3 + 2] = tempColor.b
  }

  const volumeGeometry =
    new THREE.BufferGeometry()

  volumeGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
      volumePositions,
      3
    )
  )

  volumeGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(
      volumeColors,
      3
    )
  )

  volumeGeometry.setAttribute(
    'aScale',
    new THREE.BufferAttribute(
      volumeSizes,
      1
    )
  )

  const volumeMaterial =
    createPointMaterial({
      size: MOBILE_AT_LOAD ? 3.6 : 3,
      drift: REDUCED_MOTION ? 0 : 0.09,
      alpha: 0.62,
      additive: true,
    })

  volumeField =
    new THREE.Points(
      volumeGeometry,
      volumeMaterial
    )

  volumeField.frustumCulled = false
  scene.add(volumeField)
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
  desiredSize,
  puffScale = 1,
  count = PARTICLE_COUNT
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

  const output = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
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
    const px = (w * tris[base]     + u * tris[base + 3] + v * tris[base + 6] - centerX) * scale
    const py = (w * tris[base + 1] + u * tris[base + 4] + v * tris[base + 7] - centerY) * scale
    const pz = (w * tris[base + 2] + u * tris[base + 5] + v * tris[base + 8] - centerZ) * scale

    // Puff along the triangle's own face normal, not the vector from
    // the model's bounding-box center. A center-relative puff smears
    // points sideways across whatever is laid out along that axis —
    // fatal for a wide horizontal wordmark, where it blurs letters
    // into their neighbors instead of just thickening each stroke.
    const e1x = tris[base + 3] - tris[base]
    const e1y = tris[base + 4] - tris[base + 1]
    const e1z = tris[base + 5] - tris[base + 2]
    const e2x = tris[base + 6] - tris[base]
    const e2y = tris[base + 7] - tris[base + 1]
    const e2z = tris[base + 8] - tris[base + 2]
    let nx = e1y * e2z - e1z * e2y
    let ny = e1z * e2x - e1x * e2z
    let nz = e1x * e2y - e1y * e2x
    const nlen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
    nx /= nlen
    ny /= nlen
    nz /= nlen

    const puff = (Math.random() - 0.22) * 0.22 * puffScale
    output[i3]     = px + nx * puff
    output[i3 + 1] = py + ny * puff
    output[i3 + 2] = pz + nz * puff
  }

  return output
}

// ======================================================
// LOGO — sampled straight off the metaminds-logo.glb mesh,
// same area-weighted random fill as the brain / lightbulb.
// No grid, no glyph raster — just scatter within the model.
// ======================================================

function generateLogoPositions(logoScene) {
  return modelToParticlePositions(
    logoScene,
    LOGO_SIZE,
    0.25
  )
}

// Same trick as the logo hold below: a dedicated, denser sample of
// brain.glb, added as a child of `particles` (so it inherits the
// same transform as the sparse morph copy sitting underneath it),
// invisible except during the opening brain hold.
function buildHeroBrainDetail(brainScene) {
  const positions = modelToParticlePositions(
    brainScene,
    BRAIN_SIZE,
    0.25,
    HERO_BRAIN_DETAIL_COUNT
  )

  if (!positions) {
    return null
  }

  let minX = Infinity
  let maxX = -Infinity

  for (let i = 0; i < HERO_BRAIN_DETAIL_COUNT; i++) {
    const x = positions[i * 3]
    if (x < minX) minX = x
    if (x > maxX) maxX = x
  }

  const span = (maxX - minX) || 1

  const colors = new Float32Array(HERO_BRAIN_DETAIL_COUNT * 3)
  const sizes = new Float32Array(HERO_BRAIN_DETAIL_COUNT)

  for (let i = 0; i < HERO_BRAIN_DETAIL_COUNT; i++) {
    const i3 = i * 3
    const t = (positions[i3] - minX) / span

    // Same tri-color gradient the sparse morph particles use, so the
    // dense overlay reads as the same object, just sharper.
    if (t < 0.45) {
      tempColor.lerpColors(ORANGE, BURNT_ORANGE, t / 0.45)
    } else if (t < 0.72) {
      tempColor.lerpColors(NAVY, BLUE, (t - 0.45) / 0.27)
    } else {
      tempColor.lerpColors(BLUE, MUTE, (t - 0.72) / 0.28)
    }

    colors[i3]     = tempColor.r
    colors[i3 + 1] = tempColor.g
    colors[i3 + 2] = tempColor.b

    sizes[i] = 0.78 + Math.random() * 0.5
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(sizes, 1))

  const material = createPointMaterial({
    size: MOBILE_AT_LOAD ? 4.2 : 3.6,
    drift: 0,
    alpha: 0,
    additive: true,
  })

  const mesh = new THREE.Points(geometry, material)
  mesh.frustumCulled = false
  mesh.visible = false
  particles.add(mesh)

  return mesh
}

// A dedicated, much denser fill of the same logo mesh, added as a
// child of `particles` so it inherits the same position / rotation /
// scale. It stays invisible for the entire scroll and only fades in
// on the final hold — the morph system's shared PARTICLE_COUNT never
// has enough budget to make text actually legible without slowing
// down every other stage, so this exists purely to make the closing
// "MetaMinds" mark read as real type instead of a fuzzy suggestion.
//
// The logo mesh's own "icon" slice is just a flat badge graphic, not
// real brain geometry, so it never reads as a brain no matter how it's
// sampled. Instead we drop that slice entirely and sample the actual
// brain.glb into its slot — same detailed shape as the hero, just
// small and brand-colored.
function buildLogoDetail(
  logoScene,
  brainScene
) {
  // Oversample the full logo mesh, then keep only points that land
  // outside the icon's slice (the leftmost ~24% of its width) so we
  // end up with ~LOGO_DETAIL_COUNT text-only points.
  const oversample =
    Math.round(LOGO_DETAIL_COUNT / 0.6)

  const rawPositions = modelToParticlePositions(
    logoScene,
    LOGO_SIZE,
    0.1,
    oversample
  )

  if (!rawPositions) {
    return null
  }

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (let i = 0; i < oversample; i++) {
    const x = rawPositions[i * 3]
    const y = rawPositions[i * 3 + 1]
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }

  const span = (maxX - minX) || 1
  const iconEdge = minX + span * 0.26
  const textMidEdge = minX + span * 0.6

  const keptIdx = []
  for (let i = 0; i < oversample; i++) {
    if (rawPositions[i * 3] >= iconEdge) {
      keptIdx.push(i)
      if (keptIdx.length >= LOGO_DETAIL_COUNT) break
    }
  }

  const textCount = keptIdx.length
  const textPositions = new Float32Array(textCount * 3)
  const textColors = new Float32Array(textCount * 3)
  const textSizes = new Float32Array(textCount)

  for (let k = 0; k < textCount; k++) {
    const i = keptIdx[k]
    const i3 = i * 3
    const k3 = k * 3
    const x = rawPositions[i3]

    textPositions[k3]     = x
    textPositions[k3 + 1] = rawPositions[i3 + 1]
    textPositions[k3 + 2] = rawPositions[i3 + 2]

    if (x < textMidEdge) {
      tempColor.copy(WHITE)
      tempColor.lerp(INK, 0.12)
    } else {
      tempColor.copy(BLUE)
      tempColor.lerp(WHITE, 0.5)
    }

    textColors[k3]     = tempColor.r
    textColors[k3 + 1] = tempColor.g
    textColors[k3 + 2] = tempColor.b

    textSizes[k] = 0.78 + Math.random() * 0.5
  }

  const textGeometry = new THREE.BufferGeometry()
  textGeometry.setAttribute('position', new THREE.BufferAttribute(textPositions, 3))
  textGeometry.setAttribute('color', new THREE.BufferAttribute(textColors, 3))
  textGeometry.setAttribute('aScale', new THREE.BufferAttribute(textSizes, 1))

  const textMaterial = createPointMaterial({
    size: MOBILE_AT_LOAD ? 4.6 : 3.8,
    drift: 0,
    alpha: 0,
    additive: true,
  })

  const textMesh = new THREE.Points(textGeometry, textMaterial)
  textMesh.frustumCulled = false
  textMesh.visible = false
  particles.add(textMesh)

  // ---- ICON: the real brain, scaled and centered into the icon slot ----
  const iconCenterX = minX + span * 0.12
  const iconSlotHeight = (maxY - minY) || 1
  const iconBrainSize = iconSlotHeight * 0.86

  const brainRawCount =
    MOBILE_AT_LOAD
      ? 1300
      : 2800

  const brainRaw = modelToParticlePositions(
    brainScene,
    iconBrainSize,
    0.22,
    brainRawCount
  )

  let brainMinX = Infinity
  let brainMaxX = -Infinity

  for (let i = 0; i < brainRawCount; i++) {
    const x = brainRaw[i * 3]
    if (x < brainMinX) brainMinX = x
    if (x > brainMaxX) brainMaxX = x
  }

  const brainSpan = (brainMaxX - brainMinX) || 1

  const iconBrainPositions = new Float32Array(brainRawCount * 3)
  const brainColors = new Float32Array(brainRawCount * 3)
  const brainSizes = new Float32Array(brainRawCount)

  for (let i = 0; i < brainRawCount; i++) {
    const i3 = i * 3
    const localX = brainRaw[i3]

    iconBrainPositions[i3]     = localX + iconCenterX
    iconBrainPositions[i3 + 1] = brainRaw[i3 + 1]
    iconBrainPositions[i3 + 2] = brainRaw[i3 + 2]

    // Same brand gradient the hero brain reads in — hemisphere split,
    // circuit orange into deep navy/blue.
    const t = (localX - brainMinX) / brainSpan
    if (t < 0.5) {
      tempColor.lerpColors(ORANGE, BURNT_ORANGE, t * 2)
    } else {
      tempColor.lerpColors(NAVY, BLUE, (t - 0.5) * 2)
    }

    brainColors[i3]     = tempColor.r
    brainColors[i3 + 1] = tempColor.g
    brainColors[i3 + 2] = tempColor.b

    brainSizes[i] = 0.78 + Math.random() * 0.5
  }

  const brainGeometry = new THREE.BufferGeometry()
  brainGeometry.setAttribute('position', new THREE.BufferAttribute(iconBrainPositions, 3))
  brainGeometry.setAttribute('color', new THREE.BufferAttribute(brainColors, 3))
  brainGeometry.setAttribute('aScale', new THREE.BufferAttribute(brainSizes, 1))

  const brainMaterial = createPointMaterial({
    size: MOBILE_AT_LOAD ? 4.6 : 3.8,
    drift: 0,
    alpha: 0,
    additive: true,
  })

  const brainMesh = new THREE.Points(brainGeometry, brainMaterial)
  brainMesh.frustumCulled = false
  brainMesh.visible = false
  particles.add(brainMesh)

  return [textMesh, brainMesh]
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

    const jitter =
      1 +
      (Math.random() - 0.5) *
      0.04

    output[i3]     = radius * jitter * cosLat * Math.cos(lonRad)
    output[i3 + 1] = radius * jitter * sinLat
    output[i3 + 2] = radius * jitter * cosLat * Math.sin(lonRad)

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
  s: 1,
}

const cameraTarget = {
  z: 4.55,
  fov: 50,
  x: -0.68,
  y: 0,
  roll: 0,
}

const lookTarget =
  new THREE.Vector3()

let cameraRoll = 0
let bloomTarget = MOBILE_AT_LOAD ? 0 : 0.18

let currentStage = 'brain'
let stageIsTransform = false

let particlesNeedUpdate = true
let colorsNeedUpdate = true

function setHoldShot(
  _z,
  _fov,
  _x = 0
) {
  stageIsTransform = false
  morphLerp =
    POSITION_LERP * 0.55
  transformTarget.s = 1
  bloomTarget = MOBILE_AT_LOAD ? 0 : 0.14
}

function setTransformShot(
  _z,
  _fov,
  _x,
  _roll,
  scale = 1.14
) {
  stageIsTransform = true
  morphLerp =
    POSITION_LERP * 2.05
  transformTarget.s = scale
  bloomTarget = MOBILE_AT_LOAD ? 0 : 0.2
}

function applyScrollCamera(p) {
  // Copy holds stay OUT so type sits in a dark lane or over a
  // distant silhouette. Dolly IN only during morphs — no copy.
  const keys = [
    { p: 0.000, z: 4.55, fov: 50, x: -0.68 },
    { p: 0.070, z: 4.40, fov: 51, x: -0.62 },
    // Hold wide through the page-2 block — no dolly-in while there's
    // copy on screen — then dolly in fast for the brief explosion.
    { p: 0.199, z: 4.40, fov: 51, x: -0.62 },
    { p: 0.245, z: 1.38, fov: 74, x:  0.00 },
    { p: 0.284, z: 5.35, fov: 46, x:  0.00 },
    { p: 0.415, z: 5.20, fov: 46, x:  0.00 },
    { p: 0.454, z: 1.55, fov: 72, x:  0.00 },
    { p: 0.524, z: 1.72, fov: 68, x:  0.00 },
    { p: 0.573, z: 4.70, fov: 48, x: -0.72 },
    { p: 0.755, z: 4.55, fov: 48, x: -0.68 },
    { p: 0.804, z: 1.62, fov: 70, x:  0.00 },
    { p: 0.872, z: 3.55, fov: 48, x:  0.00 },
    { p: 0.909, z: 7.80, fov: 40, x:  0.00 },
    { p: 1.000, z: 9.35, fov: 34, x:  0.00 },
  ]

  let a = keys[0]
  let b = keys[keys.length - 1]
  for (let i = 0; i < keys.length - 1; i++) {
    if (p >= keys[i].p && p <= keys[i + 1].p) {
      a = keys[i]
      b = keys[i + 1]
      break
    }
  }

  const span = b.p - a.p || 1
  const t = smoothstep((p - a.p) / span)

  cameraTarget.z = lerp(a.z, b.z, t)
  cameraTarget.fov = lerp(a.fov, b.fov, t)
  cameraTarget.x = lerp(a.x, b.x, t)
  cameraTarget.y = 0
  cameraTarget.roll = 0

  if (isMobile()) {
    const onLogo = p >= 0.883
    const onCopyHold =
      p < 0.079 ||
      (p >= 0.115 && p < 0.199) ||
      (p >= 0.284 && p < 0.430) ||
      (p >= 0.547 && p < 0.781)

    cameraTarget.z *= onLogo
      ? 2.05
      : onCopyHold
        ? 2.15
        : 1.28
  }

  if (MOBILE_AT_LOAD || p >= 0.872) {
    bloomTarget = 0
  }
}

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

  if (progress < 0.22) {
    currentStage = 'brain'

    writeStaticTarget(
      brainPositions
    )

    transformTarget.x =
      desktopOrMobileX(
        progress < 0.18
          ? RIGHT_X
          : LEFT_X
      )
  }

  else if (progress < 0.52) {
    currentStage = 'lightbulb'

    writeStaticTarget(
      lightbulbPositions
    )

    transformTarget.x =
      desktopOrMobileX(
        CENTER_X
      )
  }

  else if (progress < 0.82) {
    currentStage = 'earth'

    writeStaticTarget(
      earthPositions
    )

    transformTarget.x =
      desktopOrMobileX(
        RIGHT_X
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
// Copy beats hold the 3D form. Morphs are short
// transitions between scenes:
//
// 0.00 - 0.16 Brain hold             hero
// 0.16 - 0.22 Brain moves
// 0.22 - 0.28 Brain explosion
// 0.28 - 0.36 Lightbulb formation
// 0.36 - 0.52 Lightbulb hold         plan / notes / teach
// 0.52 - 0.58 Lightbulb explosion
// 0.58 - 0.66 Earth formation
// 0.66 - 0.84 Earth hold             team
// 0.82 - 0.87 Earth explosion
// 0.87 - 0.91 Logo formation
// 0.91 - 1.00 Logo hold              consultation
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

    applyScrollCamera(p)

    return
  }

  // ==================================================
  // 1. BRAIN HERO
  // ==================================================

  if (p < 0.079) {
    if (currentStage !== 'brain') {
      writeStaticTarget(
        brainPositions
      )
    }

    currentStage =
      'brain'

    setHoldShot(
      4.38,
      47,
      0.04
    )

    transformTarget.x =
      isMobile()
        ? 0.6
        : HERO_BRAIN_X

    transformTarget.y =
      isMobile()
        ? -1.2
        : 0

    transformTarget.rx =
      -0.02

    transformTarget.ry =
      0.08

    transformTarget.rz =
      0
  }

  // ==================================================
  // 2. BRAIN MOVES LEFT / CIRCULAR ROTATION
  // ==================================================

  else if (p < 0.199) {
    currentStage =
      'brain-moving'

    writeStaticTarget(
      brainPositions
    )

    setTransformShot(
      6.85,
      68,
      -0.22,
      0.055,
      1.08
    )

    // Reach the resting pose within the first third of this window,
    // then hold there — the rest of the scroll is spent with the
    // page-2 content on screen, not still spinning/relocating.
    const localT =
      (
        p -
        0.079
      ) /
        0.120

    const t =
      smoothstep(
        Math.min(
          localT /
            0.3,
          1
        )
      )

    transformTarget.x =
      desktopOrMobileX(
        lerp(
          HERO_BRAIN_X,
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

  else if (p < 0.250) {
    currentStage =
      'brain-explosion'

    const t =
      (
        p -
        0.199
      ) /
      0.051

    writeMorphTarget(
      brainPositions,
      brainExplosion,
      t,
      1
    )

    setTransformShot(
      7.45,
      73,
      0.04,
      0.07,
      1.28
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

  else if (p < 0.284) {
    currentStage =
      'lightbulb-forming'

    const t =
      (
        p -
        0.250
      ) /
      0.034

    writeMorphTarget(
      brainExplosion,
      lightbulbPositions,
      t,
      -1
    )

    setTransformShot(
      5.08,
      49,
      0.14,
      -0.04,
      0.9
    )

    transformTarget.x =
      desktopOrMobileX(
        CENTER_X
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

  else if (p < 0.430) {
    if (currentStage !== 'lightbulb') {
      writeStaticTarget(
        lightbulbPositions
      )
    }

    currentStage =
      'lightbulb'

    setHoldShot(
      5.18,
      51,
      0.08
    )

    transformTarget.x =
      desktopOrMobileX(
        CENTER_X
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

  else if (p < 0.477) {
    currentStage =
      'lightbulb-explosion'

    const t =
      (
        p -
        0.430
      ) /
      0.047

    writeMorphTarget(
      lightbulbPositions,
      lightbulbExplosion,
      t,
      -1
    )

    setTransformShot(
      7.12,
      71,
      0.1,
      0.06,
      1.26
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

  else if (p < 0.547) {
    currentStage =
      'earth-forming'

    const t =
      (
        p -
        0.477
      ) /
      0.070

    writeMorphTarget(
      lightbulbExplosion,
      earthPositions,
      t,
      1
    )

    setTransformShot(
      5.22,
      51,
      -0.04,
      -0.02,
      0.92
    )

    transformTarget.x =
      desktopOrMobileX(
        RIGHT_X
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

  else if (p < 0.781) {
    if (currentStage !== 'earth') {
      writeStaticTarget(
        earthPositions
      )
    }

    currentStage =
      'earth'

    setHoldShot(
      5.62,
      55,
      0.02
    )

    transformTarget.x =
      desktopOrMobileX(
        RIGHT_X
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

  else if (p < 0.838) {
    currentStage =
      'earth-explosion'

    const t =
      (
        p -
        0.781
      ) /
      0.057

    writeMorphTarget(
      earthPositions,
      earthExplosion,
      t,
      1
    )

    setTransformShot(
      7.38,
      72,
      0.06,
      0.065,
      1.3
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

  else if (p < 0.883) {
    currentStage =
      'logo-forming'

    const t =
      (
        p -
        0.838
      ) /
      0.045

    writeMorphTarget(
      earthExplosion,
      logoPositions,
      t,
      -1
    )

    setTransformShot(
      4.28,
      42,
      0,
      0,
      1.04
    )

    transformTarget.x =
      desktopOrMobileX(
        LOGO_X
      )

    transformTarget.y = 0

    transformTarget.rx = 0

    transformTarget.ry = 0

    transformTarget.rz =
      0
  }

  // ==================================================
  // 11. LOGO FULLY FORMED
  // ==================================================

  else {
    if (currentStage !== 'logo') {
      writeStaticTarget(
        logoPositions
      )
      currentPositions.set(
        logoPositions
      )
      displayPositions.set(
        logoPositions
      )
      particleGeometry.attributes.position.needsUpdate =
        true
    }

    currentStage =
      'logo'

    setHoldShot(
      3.28,
      38,
      0
    )

    morphLerp = 1

    transformTarget.s = 1

    transformTarget.x =
      desktopOrMobileX(
        LOGO_X
      )

    transformTarget.y = 0

    transformTarget.rx =
      0

    transformTarget.rz =
      0

    transformTarget.ry =
      0
  }

  applyScrollCamera(p)
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
          BRAIN_SIZE,
          0.4
        )

      heroBrainDetail =
        buildHeroBrainDetail(
          brainGLB.scene
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
          logoGLB.scene
        )

      logoDetail =
        buildLogoDetail(
          logoGLB.scene,
          brainGLB.scene
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
          2.85
        )

      lightbulbExplosion =
        createExplosion(
          lightbulbPositions,
          2.6
        )

      earthExplosion =
        createExplosion(
          earthPositions,
          3.2
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

const ARROW_ICON = `
  <svg class="btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
`

const USERS_ICON = `
  <svg class="hero-trust-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
`

const SHIELD_ICON = `
  <svg class="hero-trust-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
`

function iconSvg(cls, paths) {
  return `
  <svg class="${cls}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    ${paths}
  </svg>
`
}

const GLOBE_ICON = iconSvg(
  'page2-feature-icon',
  `<circle cx="12" cy="12" r="10" />
   <line x1="2" y1="12" x2="22" y2="12" />
   <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />`
)

const PIN_ICON = iconSvg(
  'page2-feature-icon',
  `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
   <circle cx="12" cy="10" r="3" />`
)

const CAP_ICON = iconSvg(
  'page2-stat-icon',
  `<path d="M22 10 12 5 2 10l10 5 10-5z" />
   <path d="M6 12.5V17a1 1 0 0 0 .3.7c1.2 1.2 3.4 2.3 5.7 2.3s4.5-1.1 5.7-2.3a1 1 0 0 0 .3-.7v-4.5" />
   <path d="M22 10v6" />`
)

const TRENDING_ICON = iconSvg(
  'page2-stat-icon',
  `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
   <polyline points="17 6 23 6 23 12" />`
)

const STAR_ICON = iconSvg(
  'page2-stat-icon',
  `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />`
)

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

    <div class="nav-inline">
      <div class="nav-dropdown">
        <button
          class="nav-dropdown-trigger"
          type="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Programs
          <svg class="nav-caret" width="9" height="6" viewBox="0 0 9 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M1 1l3.5 3.5L8 1" />
          </svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="#">Academic Tutoring</a>
          <a href="#">SAT & ACT Prep</a>
          <a href="#">AP & Advanced Courses</a>
          <a href="#">Programming & STEM</a>
        </div>
      </div>
      <a href="#">How It Works</a>
      <a href="#">Results</a>
      <a href="#">Pricing</a>
      <a href="#">About</a>
    </div>

    <a
      class="nav-signin"
      href="#"
    >
      Sign In
    </a>

    <a
      class="nav-cta"
      href="https://www.metamindsstemacademy.com/consultation"
    >
      Book Free Consultation
      ${ARROW_ICON}
    </a>

    <button
      class="menu-button"
      type="button"
      aria-expanded="false"
      aria-label="Open chapters"
    >
      <span></span>
      <span></span>
    </button>

    <div class="nav-panel">
      <div class="nav-links">
        <a href="#">Academic Tutoring</a>
        <a href="#">SAT & ACT Prep</a>
        <a href="#">AP & Advanced Courses</a>
        <a href="#">Programming & STEM</a>
        <a href="#">How It Works</a>
        <a href="#">Results</a>
        <a href="#">Pricing</a>
        <a href="#">About</a>
      </div>
      <a href="#" class="nav-signin nav-panel-signin">Sign In</a>
      <a
        href="https://www.metamindsstemacademy.com/consultation"
        class="primary-button nav-panel-cta"
      >
        Book Free Consultation
        ${ARROW_ICON}
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

function openNav() {
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

  nav.classList.add(
    'is-open'
  )

  document.body.classList.add(
    'nav-open'
  )

  if (button) {
    button.setAttribute(
      'aria-expanded',
      'true'
    )

    button.setAttribute(
      'aria-label',
      'Close chapters'
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

  const menuButton =
    nav.querySelector(
      '.menu-button'
    )

  menuButton?.addEventListener(
    'click',
    () => {
      if (
        nav.classList.contains(
          'is-open'
        )
      ) {
        closeNav()
      } else {
        openNav()
      }
    }
  )

  nav.querySelector(
    '.nav-panel'
  )?.querySelectorAll(
    'a'
  ).forEach(
    (link) => {
      link.addEventListener(
        'click',
        closeNav
      )
    }
  )

  const dropdown =
    nav.querySelector(
      '.nav-dropdown'
    )

  const dropdownTrigger =
    dropdown?.querySelector(
      '.nav-dropdown-trigger'
    )

  if (dropdown && dropdownTrigger) {
    const setDropdownOpen = (open) => {
      dropdownTrigger.setAttribute(
        'aria-expanded',
        open ? 'true' : 'false'
      )
    }

    dropdown.addEventListener(
      'mouseenter',
      () => setDropdownOpen(true)
    )

    dropdown.addEventListener(
      'mouseleave',
      () => setDropdownOpen(false)
    )

    dropdown.addEventListener(
      'focusin',
      () => setDropdownOpen(true)
    )

    dropdown.addEventListener(
      'focusout',
      (event) => {
        if (
          !dropdown.contains(
            event.relatedTarget
          )
        ) {
          setDropdownOpen(false)
        }
      }
    )

    // Touch devices don't get :hover — tap the trigger to toggle.
    dropdownTrigger.addEventListener(
      'click',
      (event) => {
        event.preventDefault()

        const isOpen =
          dropdownTrigger.getAttribute(
            'aria-expanded'
          ) === 'true'

        setDropdownOpen(!isOpen)
      }
    )
  }
}

function syncNavHighlight(
  _progress
) {
}

function liveCopy(el) {
  const opacity = Number(gsap.getProperty(el, 'opacity')) || 0
  el.classList.toggle('is-live', opacity > 0.25)
}

function copyAnchor(el, desktop) {
  const mid = desktop && el.classList.contains('copy-mid')
  const team = desktop && el.classList.contains('copy-team')
  const consult = desktop && el.classList.contains('copy-consult')
  const rightMid = desktop && el.classList.contains('copy-right-mid')

  return {
    xPercent: mid || consult ? -50 : 0,
    yPercent: mid || team || rightMid ? -50 : 0,
    force3D: true,
  }
}

function addPageTurnBeat(tl, el, t, enter, hold, exit) {
  if (REDUCED_MOTION) {
    tl.to(el, { autoAlpha: 1, duration: enter, ease: 'none' }, t)
    tl.to(el, { duration: hold, ease: 'none' }, t + enter)
    tl.to(el, { autoAlpha: 0, duration: exit, ease: 'none' }, t + enter + hold)
    return t + enter + hold
  }

  const tHold = t + enter
  const tExit = tHold + hold

  tl.to(el, { y: 10, duration: enter, ease: 'power1.out' }, t)
  tl.to(el, {
    autoAlpha: 1,
    duration: enter * 0.5,
    ease: 'power2.in',
  }, t + enter * 0.35)
  tl.to(el, { y: -24, duration: hold, ease: 'none' }, tHold)
  tl.to(el, { y: -220, duration: exit, ease: 'power1.in' }, tExit)
  tl.to(el, {
    autoAlpha: 0,
    duration: exit * 0.5,
    ease: 'power1.out',
  }, tExit)

  return tExit
}

function wireCopyCluster(desktop, selectors, scroll, beats, copyScrub) {
  const els = selectors.map((selector) => document.querySelector(selector))

  if (els.some((el) => !el) || !scroll.trigger || (scroll.endTrigger === null)) {
    return
  }

  els.forEach((el) => {
    gsap.set(el, {
      ...copyAnchor(el, desktop),
      y: REDUCED_MOTION ? 0 : 200,
      autoAlpha: 0,
    })
  })

  const tl = gsap.timeline({
    defaults: { force3D: true },
    scrollTrigger: {
      ...scroll,
      scrub: REDUCED_MOTION ? true : copyScrub,
      onUpdate: () => els.forEach(liveCopy),
    },
  })

  let t = 0
  els.forEach((el, i) => {
    const beat = beats[i]
    t = addPageTurnBeat(tl, el, t, beat.enter, beat.hold, beat.exit)
  })
}

function setupCopyTravel() {
  const copyScrub = REDUCED_MOTION ? false : 1.15
  const mm = gsap.matchMedia()

  const wire = (desktop) => {
    const hero = document.querySelector('.copy-hero')
    const heroChapter = document.querySelector('.chapter-hero')
    const consult = document.querySelector('.copy-consult')
    const consultChapter = document.querySelector('.logo-hold-chapter')
    const morphA = document.querySelector('.chapter-morph-a')
    const morphB = document.querySelector('.chapter-morph-b')
    const lbChapter = document.querySelector('.chapter-lb-hold-item')
    const teamChapter = document.querySelector('.chapter-team')

    if (hero && heroChapter) {
      const base = copyAnchor(hero, desktop)
      const vh = window.innerHeight

      if (REDUCED_MOTION) {
        gsap.set(hero, { ...base, y: 0, autoAlpha: 1 })
        gsap.to(hero, {
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heroChapter,
            start: 'top top',
            end: '+=170%',
            scrub: true,
          },
        })
      } else {
        gsap.set(hero, { ...base, y: 0, autoAlpha: 1 })
        gsap.timeline({
          defaults: { force3D: true },
          scrollTrigger: {
            trigger: heroChapter,
            start: 'top top',
            end: '+=170%',
            scrub: copyScrub,
            onUpdate: () => liveCopy(hero),
          },
        })
          .to(hero, { y: vh * -0.42, duration: 0.64, ease: 'none' })
          .to(hero, { y: -(vh + 80), duration: 0.36, ease: 'power1.in' })
          .to(hero, { autoAlpha: 0, duration: 0.2, ease: 'none' }, '<0.16')
      }
    }

    // Chapter 2 landing + chapter 3 punch lines live in morph-a (700vh).
    wireCopyCluster(
      desktop,
      ['.t2-block', '.t3-intro', '.t3-line1', '.t3-line2', '.t3-line3'],
      {
        trigger: morphA,
        start: 'top 82%',
        end: 'bottom 18%',
      },
      [
        { enter: 0.04, hold: 0.18, exit: 0.06 },
        { enter: 0.04, hold: 0.15, exit: 0.06 },
        { enter: 0.04, hold: 0.14, exit: 0.06 },
        { enter: 0.04, hold: 0.14, exit: 0.06 },
        { enter: 0.04, hold: 0.14, exit: 0.06 },
      ],
      copyScrub
    )

    // Chapter 4 lightbulb hold items are only ~100vh each. One timeline
    // across the five items plus a slice of morph-b so each beat gets a
    // full page before the next takes over, with extra middle dwell.
    wireCopyCluster(
      desktop,
      [
        '.lb-intro',
        '.lb-feature-1',
        '.lb-feature-2',
        '.lb-feature-3',
        '.lb-feature-4',
      ],
      {
        trigger: lbChapter,
        endTrigger: morphB,
        start: 'top 88%',
        end: '40% top',
      },
      [
        { enter: 0.04, hold: 0.13, exit: 0.06 },
        { enter: 0.04, hold: 0.14, exit: 0.06 },
        { enter: 0.04, hold: 0.14, exit: 0.06 },
        { enter: 0.04, hold: 0.14, exit: 0.06 },
        { enter: 0.04, hold: 0.15, exit: 0.06 },
      ],
      copyScrub
    )

    // Chapter 5 virtual-first copy, after the lightbulb lines finish.
    wireCopyCluster(
      desktop,
      ['.t5-main', '.t5-caveat'],
      {
        trigger: morphB,
        start: '38% top',
        end: 'bottom 14%',
      },
      [
        { enter: 0.08, hold: 0.46, exit: 0.1 },
        { enter: 0.08, hold: 0.32, exit: 0.08 },
      ],
      copyScrub
    )

    // Chapters 6–7 earth hold. Extra dwell on the program paths and
    // the long philosophy paragraph.
    wireCopyCluster(
      desktop,
      [
        '.earth-intro',
        '.earth-path-1',
        '.earth-path-2',
        '.earth-path-3',
        '.earth-path-4',
        '.earth-phil-intro',
        '.earth-phil-para',
        '.earth-phil-close',
      ],
      {
        trigger: teamChapter,
        start: 'top bottom',
        end: 'bottom top',
      },
      [
        { enter: 0.02, hold: 0.09, exit: 0.04 },
        { enter: 0.02, hold: 0.09, exit: 0.04 },
        { enter: 0.02, hold: 0.11, exit: 0.04 },
        { enter: 0.02, hold: 0.11, exit: 0.04 },
        { enter: 0.02, hold: 0.09, exit: 0.04 },
        { enter: 0.02, hold: 0.1, exit: 0.04 },
        { enter: 0.02, hold: 0.12, exit: 0.04 },
        { enter: 0.02, hold: 0.09, exit: 0.04 },
      ],
      copyScrub
    )

    if (consult && consultChapter) {
      const base = copyAnchor(consult, desktop)

      gsap.set(consult, {
        ...base,
        y: REDUCED_MOTION ? 0 : 56,
        autoAlpha: 0,
      })
      gsap.to(consult, {
        y: 0,
        autoAlpha: 1,
        ease: REDUCED_MOTION ? 'none' : 'power2.out',
        force3D: true,
        scrollTrigger: {
          trigger: consultChapter,
          start: 'top 72%',
          end: 'top 40%',
          scrub: REDUCED_MOTION ? true : copyScrub,
          onUpdate: () => liveCopy(consult),
        },
      })
    }
  }

  mm.add('(min-width: 768px)', () => {
    wire(true)
  })

  mm.add('(max-width: 767px)', () => {
    wire(false)
  })
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

    <section class="chapter chapter-hero" id="s1">
      <div class="copy copy-left copy-hero">
        <h1>
          A mentor who stays with <span class="grad-accent">your child.</span>
        </h1>
        <p>
          Personalized virtual tutoring with a dedicated mentor, a
          clear learning plan, and progress you can actually follow.
        </p>
        <div class="copy-caveat">
          <p>
            SAT & ACT prep, K–12 academics, AP support, coding, and
            STEM. In-person sessions may be available in select areas
            based on tutor availability.
          </p>
        </div>
        <div class="hero-divider"></div>
        <div class="hero-trust">
          <div class="hero-trust-item hero-trust-item--families">
            ${USERS_ICON}
            <span class="hero-trust-text">
              Trusted by Families<br>Across the Country
            </span>
          </div>
          <div class="hero-trust-sep"></div>
          <div class="hero-trust-item hero-trust-item--vetted">
            ${SHIELD_ICON}
            <span class="hero-trust-text">
              Vetted Tutors.<br>From Prestigious Universities.
            </span>
          </div>
        </div>
        <div class="hero-actions">
          <a
            href="https://www.metamindsstemacademy.com/consultation"
            class="primary-button hero-cta"
          >
            Book Free Consultation
            ${ARROW_ICON}
          </a>
          <a href="#team" class="hero-secondary-cta">
            Explore Programs
          </a>
        </div>
      </div>
      <div class="scroll-marker">
        SCROLL
        <span></span>
      </div>
    </section>

    <section class="chapter chapter-morph chapter-morph-a">
      <div class="copy copy-center copy-mid t2-block">
        <div class="page2-eyebrow">Virtual Tutoring. Real Results.</div>
        <h2>Expert mentors. Personalized learning. Stronger futures.</h2>
        <p>
          MetaMinds provides virtual STEM tutoring and academic
          mentorship for students across the U.S. Our mentors build
          confidence, strengthen skills, and inspire a love for
          learning.
        </p>

        <div class="page2-features">
          <div class="page2-feature-item">
            ${GLOBE_ICON}
            <h4>Virtual First</h4>
            <p>
              All sessions are online so students can learn from the
              best mentors anywhere.
            </p>
          </div>
          <div class="page2-feature-item">
            ${PIN_ICON}
            <h4>In-Person Options</h4>
            <p>
              In-person tutoring may be available in select areas
              depending on tutor availability.
            </p>
          </div>
          <div class="page2-feature-item">
            ${USERS_ICON.replace('hero-trust-icon', 'page2-feature-icon')}
            <h4>Personalized 1:1</h4>
            <p>
              Every student gets a custom learning plan designed
              around their goals.
            </p>
          </div>
        </div>

        <div class="hero-actions page2-actions">
          <a
            href="https://www.metamindsstemacademy.com/consultation"
            class="primary-button hero-cta"
          >
            Book Free Consultation
            ${ARROW_ICON}
          </a>
          <a href="#team" class="hero-secondary-cta">
            Explore Programs
          </a>
        </div>

        <div class="page2-stats">
          <div class="page2-stat-item">
            ${CAP_ICON}
            <div>
              <div class="page2-stat-value">500+</div>
              <div class="page2-stat-label">Students Mentored</div>
              <p>Across all grade levels and skill areas</p>
            </div>
          </div>
          <div class="page2-stat-item">
            ${TRENDING_ICON}
            <div>
              <div class="page2-stat-value">95%</div>
              <div class="page2-stat-label">Improvement Rate</div>
              <p>Students see stronger grades and test scores</p>
            </div>
          </div>
          <div class="page2-stat-item">
            ${STAR_ICON}
            <div>
              <div class="page2-stat-label">Expert Mentors</div>
              <p>Top college students, engineers, and STEM professionals</p>
            </div>
          </div>
          <div class="page2-stat-item">
            ${SHIELD_ICON.replace('hero-trust-icon', 'page2-stat-icon')}
            <div>
              <div class="page2-stat-label">Safe & Supportive</div>
              <p>Carefully vetted mentors and a student-first environment</p>
            </div>
          </div>
        </div>

        <div class="page2-trust">
          <div class="page2-trust-label">Trusted by Families Across the U.S.</div>
        </div>
      </div>

      <div class="copy copy-center copy-mid t3-intro">
        <h2>Understanding changes everything.</h2>
        <p>
          We don't want students memorizing steps just long enough to
          pass Friday's quiz. We want them to understand why
          something works, recognize it again later, and become
          increasingly capable without us.
        </p>
      </div>
      <div class="copy copy-center copy-mid t3-line1">
        <h2>Teach the concept.</h2>
      </div>
      <div class="copy copy-center copy-mid t3-line2">
        <h2>Practice it intentionally.</h2>
      </div>
      <div class="copy copy-center copy-mid t3-line3">
        <h2>See if it sticks.</h2>
      </div>
    </section>

    <section class="chapter chapter-lb-hold-item" id="plan">
      <div class="copy copy-center copy-mid lb-intro">
        <h2>Tutoring shouldn't disappear when the call ends.</h2>
      </div>
    </section>

    <section class="chapter chapter-lb-hold-item">
      <div class="copy copy-center copy-mid lb-feature-1">
        <h2>Session notes</h2>
        <p>What we covered and what comes next.</p>
      </div>
    </section>

    <section class="chapter chapter-lb-hold-item">
      <div class="copy copy-center copy-mid lb-feature-2">
        <h2>Targeted practice</h2>
        <p>Assignments based on what the student actually needs.</p>
      </div>
    </section>

    <section class="chapter chapter-lb-hold-item">
      <div class="copy copy-center copy-mid lb-feature-3">
        <h2>Skill tracking</h2>
        <p>See what's improving and what still needs work.</p>
      </div>
    </section>

    <section class="chapter chapter-lb-hold-item" id="notes">
      <div class="copy copy-center copy-mid lb-feature-4">
        <h2>Parent updates</h2>
        <p>You're not left wondering how tutoring is going.</p>
      </div>
    </section>

    <section class="chapter chapter-morph chapter-morph-b">
      <div class="copy copy-team t5-main">
        <h2>The right mentor doesn't have to live down the street.</h2>
        <p>
          MetaMinds is built around virtual tutoring, so students can
          work with the right mentor regardless of where they live.
        </p>
      </div>
      <div class="copy copy-team copy-caveat t5-caveat">
        <p>
          In-person tutoring may also be available in select areas
          across the U.S. depending on tutor availability.
        </p>
      </div>
    </section>

    <section class="chapter chapter-team" id="team">
      <div class="copy copy-team earth-intro">
        <h2>Support that can grow with them.</h2>
      </div>
      <div class="copy copy-team earth-path-1">
        <h2>Elementary & Middle School</h2>
        <p>
          Build fundamentals, confidence, organization, and strong
          learning habits.
        </p>
      </div>
      <div class="copy copy-team earth-path-2">
        <h2>High School & AP</h2>
        <p>
          Keep up with harder coursework, fill gaps, and prepare for
          what comes next.
        </p>
      </div>
      <div class="copy copy-team earth-path-3">
        <h2>SAT & ACT</h2>
        <p>
          Diagnose weaknesses, build strategy, practice deliberately,
          and track progress.
        </p>
      </div>
      <div class="copy copy-team earth-path-4">
        <h2>Programming & STEM</h2>
        <p>
          Learn to build with code, robotics, engineering, and real
          projects.
        </p>
      </div>
      <div class="copy copy-team earth-phil-intro">
        <h2>
          The earlier students build strong habits, the more options
          they have later.
        </h2>
      </div>
      <div class="copy copy-team earth-phil-para">
        <p>
          A sixth grader struggling with fractions has time to
          rebuild the foundation. A freshman can strengthen algebra
          before the SAT. A high school student can learn to code
          before choosing a college major. Small improvements
          compound when students have time to use them.
        </p>
      </div>
      <div class="copy copy-team earth-phil-close">
        <h2>
          We want students prepared for what comes next, not
          constantly catching up to it.
        </h2>
      </div>
    </section>

    <section
      class="chapter chapter-morph chapter-morph-c"
      aria-hidden="true"
    ></section>

    <section
      id="consultation"
      class="chapter logo-hold-chapter"
    >
      <div class="copy copy-center copy-consult">
        <h2>
          One student. One plan. Years of growth.
        </h2>
        <p>
          MetaMinds is designed to give students a consistent
          academic support system as their goals change—from
          foundational learning to advanced coursework, test
          preparation, and future-ready skills.
        </p>
        <a
          href="https://www.metamindsstemacademy.com/consultation"
          class="primary-button"
        >
          Book a Free Consultation
          ${ARROW_ICON}
        </a>
      </div>
    </section>

    <footer class="sketch-footer">
      <span>MetaMinds STEM Academy</span>
      <a href="mailto:metamindsstemacademy@gmail.com">metamindsstemacademy@gmail.com</a>
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

  const storyTween = gsap.to(
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
            : true,

        onUpdate:
          updateStory,
      },
    }
  )

  ScrollTrigger.refresh()

  // ==================================================
  // COPY MOTION
  // ==================================================

  const heroChapter =
    document.querySelector(
      '.chapter-hero'
    )

  if (
    heroChapter &&
    !REDUCED_MOTION
  ) {
    const marker =
      heroChapter.querySelector(
        '.scroll-marker'
      )

    if (marker) {
      gsap.to(
        marker,
        {
          opacity: 0,

          scrollTrigger: {
            trigger:
              heroChapter,

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

  setupCopyTravel()
  ScrollTrigger.refresh()

  setupVisibilityObserver()

  window.__mmSetProgress = (p) => {
    const next = Math.max(0, Math.min(1, Number(p) || 0))
    story.progress = next
    const st = storyTween.scrollTrigger
    if (st) {
      st.scroll(st.start + (st.end - st.start) * next)
    }
    storyTween.progress(next)
    const prevLerp = morphLerp
    morphLerp = 1
    updateStory()
    currentPositions.set(storyTargetPositions)
    displayPositions.set(storyTargetPositions)
    particleGeometry.attributes.position.needsUpdate = true
    particles.position.x = transformTarget.x
    particles.position.y = transformTarget.y
    particles.scale.setScalar(transformTarget.s)
    camera.position.z = cameraTarget.z
    camera.position.x = cameraTarget.x
    camera.position.y = cameraTarget.y
    camera.fov = cameraTarget.fov
    camera.updateProjectionMatrix()
    bloomPass.strength = bloomTarget
    morphLerp = prevLerp
    updateParticleInstances(true)
    ScrollTrigger.update()
  }
}



// ======================================================
// POINT UPDATE
// ======================================================

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
        morphLerp

      y +=
        dyTarget *
        morphLerp

      z +=
        dzTarget *
        morphLerp

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
    // WRITE POINT POSITION
    // ----------------------------------

    const depth =
      THREE.MathUtils.clamp(
        (z + 2.8) / 5.6,
        0,
        1
      )

    displayPositions[i3] = x
    displayPositions[i3 + 1] = y
    displayPositions[i3 + 2] = z

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

      const isLogoStage =
        currentStage === 'logo' ||
        currentStage === 'logo-forming'

      if (isLogoStage) {
        tempColor.copy(WHITE)
        tempColor.lerp(
          INK,
          0.18
        )
      } else if (isEarthStage) {
        const lat =
          earthParticleLatLon[i * 2]

        const absLat = Math.abs(lat)

        if (absLat > 70) {
          tempColor.lerpColors(
            BLUE,
            INK,
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
            tempColor.lerpColors(BLUE, MUTE, (oceanT - 0.5) * 2)
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
            MUTE,
            (normalizedX - 0.72) / 0.28
          )
        }

        if (influence > 0) {
          tempColor.lerp(
            normalizedX > 0.5
              ? INK
              : WHITE,
            influence * 0.35
          )
        }
      }

      if (isLogoStage) {
        tempColor.multiplyScalar(
          0.48
        )
      } else {
        tempColor.multiplyScalar(
          0.55 +
          depth *
          0.7
        )
      }

      particleColors[i3] = tempColor.r
      particleColors[i3 + 1] = tempColor.g
      particleColors[i3 + 2] = tempColor.b
    }
  }

  particleGeometry.attributes.position.needsUpdate =
    true

  if (updateColors) {
    particleGeometry.attributes.color.needsUpdate =
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
    This does NOT rebuild 38k instance matrices.

    We are rotating / moving the
    Points cloud as a single object.
  */

  const chase =
    REDUCED_MOTION
      ? 1
      : stageIsTransform
        ? 0.085
        : 0.032

  const camChase =
    REDUCED_MOTION
      ? 1
      : (
          currentStage === 'logo' ||
          currentStage === 'logo-forming'
        )
        ? 0.22
        : 0.014

  const idleY =
    REDUCED_MOTION
      ? 0
      : Math.sin(
          lastFrameTime *
          0.00038
        ) *
        0.04

  particles.position.x +=
    (
      transformTarget.x -
      particles.position.x
    ) *
    chase

  particles.position.y +=
    (
      transformTarget.y +
      idleY -
      particles.position.y
    ) *
    chase

  particles.rotation.x +=
    (
      transformTarget.rx -
      particles.rotation.x
    ) *
    chase

  particles.rotation.z +=
    (
      transformTarget.rz -
      particles.rotation.z
    ) *
    chase

  const scaleNow =
    particles.scale.x +
    (
      transformTarget.s -
      particles.scale.x
    ) *
    chase

  particles.scale.setScalar(
    scaleNow
  )

  if (!REDUCED_MOTION) {
    ambientTime.value =
      lastFrameTime *
      0.001

    const idle =
      1 -
      logoStill.value

    camera.position.z +=
      (
        cameraTarget.z +
        Math.sin(
          lastFrameTime *
          0.0002
        ) *
        0.05 *
        idle -
        camera.position.z
      ) *
      camChase

    camera.position.x +=
      (
        cameraTarget.x +
        Math.sin(
          lastFrameTime *
          0.00016
        ) *
        0.028 *
        idle -
        camera.position.x
      ) *
      camChase

    camera.position.y +=
      (
        cameraTarget.y +
        Math.sin(
          lastFrameTime *
          0.00027
        ) *
        0.032 *
        idle -
        camera.position.y
      ) *
      camChase

    cameraRoll +=
      (
        cameraTarget.roll +
        Math.sin(
          lastFrameTime *
          0.00013
        ) *
        0.008 -
        cameraRoll
      ) *
      camChase

    lookTarget.x +=
      (
        particles.position.x *
        0.18 -
        lookTarget.x
      ) *
      camChase

    lookTarget.y +=
      (
        particles.position.y *
        0.42 -
        lookTarget.y
      ) *
      camChase

    lookTarget.z = 0

    camera.lookAt(lookTarget)
    camera.rotateZ(cameraRoll)

    camera.fov +=
      (
        cameraTarget.fov -
        camera.fov
      ) *
      camChase

    camera.updateProjectionMatrix()

    bloomPass.strength +=
      (
        bloomTarget -
        bloomPass.strength
      ) *
      camChase
  } else {
    camera.position.z =
      cameraTarget.z

    camera.fov =
      cameraTarget.fov

    camera.updateProjectionMatrix()
  }

  // ----------------------------------
  // CHEAP IDLE ROTATION
  // ----------------------------------

  if (!REDUCED_MOTION) {
    if (
      currentStage ===
      'earth'
    ) {
      particles.rotation.y +=
        dt *
        0.14
    }

    else if (
      currentStage ===
      'brain'
    ) {
      particles.rotation.y +=
        dt *
        0.24
    }

    else if (
      currentStage ===
      'logo' ||
      currentStage ===
      'logo-forming'
    ) {
      particles.rotation.y +=
        (
          0 -
          particles.rotation.y
        ) *
        0.08
    }

    else {
      particles.rotation.y +=
        (
          transformTarget.ry -
          particles.rotation.y
        ) *
        chase

      particles.rotation.y +=
        dt *
        0.045
    }
  } else {
    particles.rotation.y =
      transformTarget.ry
  }

  // ----------------------------------
  // EXPENSIVE PARTICLE LOOP
  // ONLY WHEN REQUIRED
  // ----------------------------------

  if (!REDUCED_MOTION) {
    debris.rotation.y +=
      dt *
      0.032

    debris.rotation.x +=
      dt *
      0.012

    if (FIELD_COUNT > 0) {
      field.rotation.y -=
        dt *
        0.022

      field.rotation.x +=
        dt *
        0.008

      field.position.x =
        camera.position.x * 0.22

      field.position.y =
        camera.position.y * 0.16
    }

    debris.position.x =
      camera.position.x * 0.09

    debris.position.y =
      camera.position.y * 0.07

    if (volumeField) {
      volumeField.rotation.y -=
        dt * 0.011

      volumeField.position.x =
        camera.position.x * 0.16

      volumeField.position.y =
        camera.position.y * 0.12
    }

    const onLogoHold =
      currentStage === 'logo'

    const onLogo =
      onLogoHold ||
      currentStage === 'logo-forming'

    if (onLogoHold) {
      logoStill.value = 1
    } else {
      logoStill.value +=
        (
          (onLogo ? 1 : 0) -
          logoStill.value
        ) *
        0.14
    }

    if (FIELD_COUNT > 0) {
      const fieldAlpha =
        onLogo ? 0 : 0.55

      fieldMaterial.uniforms.uAlpha.value +=
        (
          fieldAlpha -
          fieldMaterial.uniforms.uAlpha.value
        ) *
        0.1
    }

    debrisMaterial.uniforms.uAlpha.value +=
      (
        (onLogo ? 0 : 0.22) -
        debrisMaterial.uniforms.uAlpha.value
      ) *
      0.1

    if (volumeField) {
      volumeField.material.uniforms.uAlpha.value +=
        (
          (onLogo ? 0 : 0.62) -
          volumeField.material.uniforms.uAlpha.value
        ) *
        0.1
    }

    const onBrainHold =
      currentStage === 'brain'

    particleMaterial.uniforms.uAlpha.value +=
      (
        (
          onLogoHold ? 0.4 :
          onBrainHold ? 0.45 :
          0.9
        ) -
        particleMaterial.uniforms.uAlpha.value
      ) *
      0.1

    if (logoDetail) {
      const detailTarget =
        onLogo ? 0.95 : 0

      for (let li = 0; li < logoDetail.length; li++) {
        const detailMesh = logoDetail[li]

        detailMesh.material.uniforms.uAlpha.value +=
          (
            detailTarget -
            detailMesh.material.uniforms.uAlpha.value
          ) *
          0.12

        detailMesh.visible =
          detailMesh.material.uniforms.uAlpha.value > 0.02
      }
    }

    if (heroBrainDetail) {
      const heroDetailTarget =
        onBrainHold ? 0.95 : 0

      heroBrainDetail.material.uniforms.uAlpha.value +=
        (
          heroDetailTarget -
          heroBrainDetail.material.uniforms.uAlpha.value
        ) *
        0.12

      heroBrainDetail.visible =
        heroBrainDetail.material.uniforms.uAlpha.value > 0.02
    }

    const logoBlend =
      THREE.AdditiveBlending

    if (
      particleMaterial.blending !==
      logoBlend
    ) {
      particleMaterial.blending =
        logoBlend
      particleMaterial.needsUpdate =
        true
    }
  }

  // Copy holds: once particles have settled, do not rewrite
  // instance positions every frame under the type.
  const needParticleLoop =
    particlesNeedUpdate ||
    (
      stageIsTransform &&
      pointerActive &&
      !TOUCH_DEVICE &&
      !REDUCED_MOTION
    )

  if (needParticleLoop) {
    updateParticleInstances(
      false
    )
  }

  if (
    USE_COMPOSER &&
    bloomPass.strength > 0.01
  ) {
    composer.render()
  } else {
    renderer.render(
      scene,
      camera
    )
  }
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
        window.devicePixelRatio || 1,
        window.innerWidth < 768
          ? 1
          : 1.5
      )

    renderer.setPixelRatio(
      ratio
    )

    composer.setPixelRatio(
      ratio
    )

    for (
      let i = 0;
      i < pointMaterials.length;
      i++
    ) {
      pointMaterials[i].uniforms.uPixelRatio.value =
        ratio
    }

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