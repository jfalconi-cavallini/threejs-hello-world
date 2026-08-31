import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import './style.css'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({
  ignoreMobileResize: true,
})

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
        src="/metaminds-lockup.png"
        alt="MetaMinds STEM Academy"
        class="boot-logo"
      >
      <p>Loading</p>
    </div>
  `

  document.body.appendChild(
    boot
  )

  document.documentElement.classList.add(
    'is-booting'
  )

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }

  if (location.hash) {
    history.replaceState(
      null,
      '',
      location.pathname + location.search
    )
  }

  window.scrollTo(0, 0)

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
    ? 4000
    : 10000

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
const LEFT_X = -1.25
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
    uLogoStill: logoStill,
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
        uniform float uLogoStill;
        uniform float uPixelRatio;
        uniform float uSize;
        uniform float uDrift;
        attribute float aScale;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          float seed = position.x * 1.73 + position.y * 2.11 + position.z * 1.37;
          vec3 pos = position;
          float driftAmt = uDrift * mix(1.0, 0.0, uLogoStill);
          pos += vec3(
            sin(uTime * 0.53 + seed) * 1.15,
            cos(uTime * 0.41 + seed * 1.2) * 0.88,
            sin(uTime * 0.47 + seed * 0.8) * 1.02
          ) * driftAmt;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float dist = max(0.42, -mvPosition.z);
          float atten = mix(12.4 / dist, 5.4, uLogoStill);
          float sz = uSize * aScale * atten * uPixelRatio;
          sz = min(sz, mix(58.0, 7.2, uLogoStill));
          gl_PointSize = max(sz, mix(1.15, 2.4, uLogoStill));
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = mix(0.78, 0.94, uLogoStill);
        }
      `,
      fragmentShader: `
        uniform float uAlpha;
        uniform float uLogoStill;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          if (d > 0.5) discard;
          float soft = smoothstep(0.5, 0.10, d);
          float hard = 1.0 - smoothstep(0.22, 0.40, d);
          float core = mix(soft, hard * 0.92, uLogoStill);
          float hot = mix(smoothstep(0.22, 0.0, d), 0.55, uLogoStill);
          vec3 rgb = vColor * mix(0.72 + hot * 0.55, 1.08, uLogoStill);
          gl_FragColor = vec4(rgb, core * vAlpha * uAlpha);
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
    size: MOBILE_AT_LOAD ? 5.6 : 4.4,
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
    ? 14
    : 42

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
    size: MOBILE_AT_LOAD ? 18 : 22,
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
    : 2000

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
    size: MOBILE_AT_LOAD ? 2.4 : 1.85,
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

// Extra volumetric dust — golden-ratio sphere, no Math.random
// so the existing RNG stream for forms/explosions stays intact.
const VOLUME_COUNT =
  MOBILE_AT_LOAD
    ? 0
    : 2500

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
      size: MOBILE_AT_LOAD ? 2.1 : 1.55,
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

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () =>
      reject(new Error('Could not load ' + url))
    img.src = url
  })
}

// ======================================================
// MODEL -> PARTICLES
// ======================================================

function modelToParticlePositions(
  model,
  desiredSize,
  puffScale = 1
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
    const px = (w * tris[base]     + u * tris[base + 3] + v * tris[base + 6] - centerX) * scale
    const py = (w * tris[base + 1] + u * tris[base + 4] + v * tris[base + 7] - centerY) * scale
    const pz = (w * tris[base + 2] + u * tris[base + 5] + v * tris[base + 8] - centerZ) * scale
    const plen = Math.sqrt(px * px + py * py + pz * pz) || 1
    const puff = (Math.random() - 0.22) * 0.22 * puffScale
    output[i3]     = px + (px / plen) * puff
    output[i3 + 1] = py + (py / plen) * puff
    output[i3 + 2] = pz + (pz / plen) * puff
  }

  return output
}

// ======================================================
// LOGO — locked brain icon as the assembled 3D mark
// ======================================================

// Four draws per former text sample. Must stay so
// explosion / globe RNG downstream does not shift.
function consumeLogoSampleRng(count) {
  for (let i = 0; i < count; i++) {
    Math.random()
    Math.random()
    Math.random()
    Math.random()
  }
}

let wordMark = null
let logoBrainCount = 0
let logoColors = null

function sampleColoredSilhouette(img, count, worldWidth, zDepth) {
  const srcW = img.naturalWidth
  const srcH = img.naturalHeight
  const canvas = document.createElement('canvas')
  canvas.width = srcW
  canvas.height = srcH
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0)
  const data = ctx.getImageData(0, 0, srcW, srcH).data

  // Locked mark: cyan left #0BA8E6 + white traces,
  // navy right #182231 + orange #FF8A00 traces.
  // The crop is RGB (no alpha); black padding is empty space.
  const CYAN = [0x0b / 255, 0xa8 / 255, 0xe6 / 255]
  const NAVY = [0x18 / 255, 0x22 / 255, 0x31 / 255]
  const WHITE = [1, 1, 1]
  const ORANGE = [1, 0x8a / 255, 0]
  const PALETTE = [null, WHITE, ORANGE, CYAN, NAVY]

  const kindOf = (r, g, b) => {
    const sum = r + g + b
    if (sum < 22) return 0
    if (r > 190 && g > 200 && b > 200) return 1
    if (r > 160 && g > 70 && g < 185 && b < 55) return 2
    if (b > 145 && g > 90 && r < 90) return 3
    if (b >= 14 && b < 110 && r < 60 && g < 70) return 4
    if (sum < 28) return 0
    if (r > b + 40 && r > 120) return 2
    if (b > 130) return 3
    return 4
  }

  const isBg = new Uint8Array(srcW * srcH)
  for (let p = 0, i = 0; p < srcW * srcH; p++, i += 4) {
    if (kindOf(data[i], data[i + 1], data[i + 2]) === 0) {
      isBg[p] = 1
    }
  }

  const TRACE_DUP = 6
  const EDGE_DUP = 4
  const cells = []
  let minX = srcW
  let minY = srcH
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < srcH; y++) {
    for (let x = 0; x < srcW; x++) {
      const p = y * srcW + x
      if (isBg[p]) continue
      const i = p * 4
      const kind = kindOf(data[i], data[i + 1], data[i + 2])
      if (!kind) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
      const rgb = PALETTE[kind]
      const isTrace = kind === 1 || kind === 2 ? 1 : 0
      let copies = isTrace ? TRACE_DUP : 1
      if (
        (y > 0 && isBg[p - srcW]) ||
        (y + 1 < srcH && isBg[p + srcW]) ||
        (x > 0 && isBg[p - 1]) ||
        (x + 1 < srcW && isBg[p + 1])
      ) {
        copies += EDGE_DUP
      }
      for (let n = 0; n < copies; n++) {
        cells.push(x, y, rgb[0], rgb[1], rgb[2], isTrace)
      }
    }
  }

  const STRIDE = 6
  const cellCount = cells.length / STRIDE
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  if (!cellCount) return { positions, colors }

  const contentW = Math.max(1, maxX - minX + 1)
  const contentH = Math.max(1, maxY - minY + 1)
  const midX = (minX + maxX + 1) / 2
  const midY = (minY + maxY + 1) / 2
  const worldHeight = worldWidth * (contentH / contentW)
  const PHI = 0.618033988749895
  const layers = 7
  const pixelW = worldWidth / contentW
  const pixelH = worldHeight / contentH

  for (let i = 0; i < count; i++) {
    const idx = Math.floor(((i * PHI) % 1) * cellCount)
    const base = idx * STRIDE
    const x = cells[base]
    const y = cells[base + 1]
    const isTrace = cells[base + 5]
    const layer = isTrace ? 4 + (i % 3) : i % layers
    const zt = layer / (layers - 1)
    const puff = 1 - 0.10 * Math.abs(zt - 0.5) * 2
    const jx = ((i * 0.173 + 0.31) % 1) - 0.5
    const jy = ((i * 0.271 + 0.17) % 1) - 0.5
    const i3 = i * 3
    positions[i3] =
      ((x + 0.5 - midX) / contentW) * worldWidth * puff +
      jx * pixelW * 0.55
    positions[i3 + 1] =
      ((midY - (y + 0.5)) / contentH) * worldHeight * puff +
      jy * pixelH * 0.55
    positions[i3 + 2] =
      (zt - 0.5) * zDepth + (isTrace ? 0.06 : 0)
    colors[i3]     = cells[base + 2]
    colors[i3 + 1] = cells[base + 3]
    colors[i3 + 2] = cells[base + 4]
  }

  return { positions, colors }
}

function generateLogoPositions(brainImg) {
  consumeLogoSampleRng(
    PARTICLE_COUNT - Math.floor(PARTICLE_COUNT * 0.12)
  )

  const output = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  logoBrainCount = PARTICLE_COUNT

  const brain = sampleColoredSilhouette(
    brainImg,
    PARTICLE_COUNT,
    3.15,
    1.05
  )

  output.set(brain.positions)
  colors.set(brain.colors)

  // Draw traces on top of fill when the assembled mark
  // switches to normal blending.
  {
    let write = 0
    const posSwap = new Float32Array(PARTICLE_COUNT * 3)
    const colSwap = new Float32Array(PARTICLE_COUNT * 3)
    const copyParticle = (src) => {
      const s3 = src * 3
      const d3 = write * 3
      posSwap[d3]     = output[s3]
      posSwap[d3 + 1] = output[s3 + 1]
      posSwap[d3 + 2] = output[s3 + 2]
      colSwap[d3]     = colors[s3]
      colSwap[d3 + 1] = colors[s3 + 1]
      colSwap[d3 + 2] = colors[s3 + 2]
      write++
    }
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const isTrace =
        (colors[i3] > 0.85 && colors[i3 + 1] > 0.85) ||
        (colors[i3] > 0.85 && colors[i3 + 2] < 0.12)
      if (!isTrace) copyParticle(i)
    }
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const isTrace =
        (colors[i3] > 0.85 && colors[i3 + 1] > 0.85) ||
        (colors[i3] > 0.85 && colors[i3 + 2] < 0.12)
      if (isTrace) copyParticle(i)
    }
    output.set(posSwap)
    colors.set(colSwap)
  }

  logoColors = colors
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
    { p: 0.00, z: 4.55, fov: 50, x: -0.68 },
    { p: 0.16, z: 4.40, fov: 51, x: -0.62 },
    { p: 0.20, z: 1.85, fov: 68, x: -0.08 },
    { p: 0.27, z: 1.38, fov: 74, x:  0.00 },
    { p: 0.34, z: 5.35, fov: 46, x:  0.00 },
    { p: 0.52, z: 5.20, fov: 46, x:  0.00 },
    { p: 0.56, z: 1.55, fov: 72, x:  0.00 },
    { p: 0.62, z: 1.72, fov: 68, x:  0.00 },
    { p: 0.66, z: 4.70, fov: 48, x: -0.72 },
    { p: 0.80, z: 4.55, fov: 48, x: -0.68 },
    { p: 0.84, z: 1.62, fov: 70, x:  0.00 },
    { p: 0.90, z: 3.55, fov: 50, x:  0.00 },
    { p: 0.93, z: 4.45, fov: 48, x:  0.00 },
    { p: 1.00, z: 4.85, fov: 46, x:  0.00 },
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
    const onLogo = p >= 0.91
    const onCopyHold =
      p < 0.18 ||
      (p >= 0.34 && p < 0.52) ||
      (p >= 0.64 && p < 0.82)

    cameraTarget.z *= onLogo
      ? 1.18
      : onCopyHold
        ? 2.15
        : 1.28
  }

  if (MOBILE_AT_LOAD || p >= 0.90) {
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

function effectiveStoryProgress() {
  let p = story.progress

  const hold = document.querySelector('.logo-hold-chapter')
  if (hold) {
    const rect = hold.getBoundingClientRect()
    const vh = window.innerHeight || 1
    if (rect.top < vh * 0.72) {
      const travel = Math.max(1, hold.offsetHeight * 0.45)
      const into = vh * 0.72 - rect.top
      const local = Math.max(0, Math.min(1, into / travel))
      p = Math.max(p, 0.82 + local * 0.18)
    }
  }

  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight
  if (maxScroll > 1) {
    const raw = window.scrollY / maxScroll
    if (raw > 0.96) {
      p = 1
    }
  }

  return Math.max(0, Math.min(1, p))
}

function updateStory() {
  if (!modelsReady) {
    return
  }

  const p =
    effectiveStoryProgress()

  if (scrollProgressBar) {
    scrollProgressBar.style.transform =
      `scaleX(${p})`
  }

  syncNavHighlight(p)

  syncCopyBeats(p)

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

  if (p < 0.18) {
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
      desktopOrMobileX(
        RIGHT_X
      )

    transformTarget.y =
      isMobile()
        ? -1.85
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

  else if (p < 0.24) {
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

    const t =
      smoothstep(
        (
          p -
          0.18
        ) /
          0.06
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
        0.24
      ) /
      0.06

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

  else if (p < 0.34) {
    currentStage =
      'lightbulb-forming'

    const t =
      (
        p -
        0.30
      ) /
      0.04

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

  else if (p < 0.54) {
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

  else if (p < 0.58) {
    currentStage =
      'lightbulb-explosion'

    const t =
      (
        p -
        0.54
      ) /
      0.04

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

  else if (p < 0.64) {
    currentStage =
      'earth-forming'

    const t =
      (
        p -
        0.58
      ) /
      0.06

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

  else if (p < 0.82) {
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

  else if (p < 0.87) {
    currentStage =
      'earth-explosion'

    const t =
      (
        p -
        0.82
      ) /
      0.05

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

  else if (p < 0.91) {
    currentStage =
      'logo-forming'

    const t =
      (
        p -
        0.87
      ) /
      0.04

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

  loadImage(
    '/metaminds-brain.png'
  ),

  document.fonts
    ? document.fonts.ready
    : Promise.resolve(),
])
  .then(
    ([
      brainGLB,
      bulbGLB,
      landGeoJSON,
      logoGLB,
      lockedBrainImg,
      _fontsReady,
    ]) => {
      brainPositions =
        modelToParticlePositions(
          brainGLB.scene,
          BRAIN_SIZE,
          0.4
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
          lockedBrainImg
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

      if (bootScreen) {
        bootScreen.classList.add(
          'is-done'
        )
      }

      document.documentElement.classList.remove(
        'is-booting'
      )
      window.scrollTo(0, 0)

      createPage()

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
    <a class="brand" href="#">
      <img
        src="/metaminds-lockup.png"
        alt="MetaMinds STEM Academy"
        class="brand-logo"
      >
    </a>

    <a
      class="nav-cta"
      href="https://www.metamindsstemacademy.com/consultation"
    >
      Book Free Consultation
    </a>
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

  nav.querySelector(
    '.brand'
  )?.addEventListener(
    'click',
    (event) => {
      event.preventDefault()
      closeNav()
      window.scrollTo(0, 0)
    }
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
}

function syncNavHighlight(
  _progress
) {
}

function beatGate(p, start, end, fade = 0.012) {
  if (p < start || p > end) {
    return 0
  }

  const distIn = p - start
  const distOut = end - p

  if (distIn < fade && start > 0) {
    return smootherstep(distIn / fade)
  }

  if (distOut < fade) {
    return smootherstep(distOut / fade)
  }

  return 1
}

const COPY_BEATS = [
  { selector: '.copy-hero', start: 0.00, end: 0.165 },
  { selector: '.chapter-plan .copy', start: 0.345, end: 0.415 },
  { selector: '.chapter-notes .copy', start: 0.42, end: 0.468 },
  { selector: '.chapter-teach .copy', start: 0.47, end: 0.52 },
  { selector: '.copy-team', start: 0.66, end: 0.805 },
  { selector: '.copy-consult', start: 0.915, end: 1.05 },
]

function syncCopyBeats(p) {
  for (let i = 0; i < COPY_BEATS.length; i++) {
    const beat = COPY_BEATS[i]
    const el = document.querySelector(beat.selector)

    if (!el) {
      continue
    }

    const hardOff =
      beat.selector.indexOf('teach') !== -1 &&
      p >= 0.52

    const gate =
      hardOff
        ? 0
        : beatGate(p, beat.start, beat.end)
    el.style.opacity = String(gate)
    el.classList.toggle('is-live', gate > 0.04)
  }

  const endBrand = document.querySelector('.end-brand')
  if (endBrand) {
    const gate = beatGate(p, 0.86, 1.05, 0.02)
    endBrand.style.opacity = String(gate)
    endBrand.classList.toggle('is-live', gate > 0.04)
  }
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
          A mentor who stays with your kid.
        </h1>
      </div>
      <div class="scroll-marker">
        SCROLL
        <span></span>
      </div>
    </section>

    <section
      class="chapter chapter-morph chapter-morph-a"
      aria-hidden="true"
    ></section>

    <section class="chapter chapter-plan" id="plan">
      <div class="copy copy-center copy-mid">
        <h2>
          A plan you can actually see.
        </h2>
      </div>
    </section>

    <section class="chapter chapter-notes" id="notes">
      <div class="copy copy-center copy-mid">
        <h2>
          Notes after every session.
        </h2>
      </div>
    </section>

    <section class="chapter chapter-teach" id="teach">
      <div class="copy copy-center copy-mid">
        <h2>
          SAT. ACT. AP. Math. Coding.
        </h2>
        <p>
          K–12 through college.
        </p>
      </div>
    </section>

    <section
      class="chapter chapter-morph chapter-morph-b"
      aria-hidden="true"
    ></section>

    <section class="chapter chapter-team" id="team">
      <div class="copy copy-left copy-team">
        <h2>
          Mentors who stay.
        </h2>
      </div>
    </section>

    <section
      class="chapter chapter-morph chapter-morph-c"
      aria-hidden="true"
    ></section>

    <div class="end-brand" aria-hidden="true">
      <img
        class="end-brand-icon"
        src="/metaminds-brain.png"
        alt=""
      >
      <p class="end-brand-word">
        <span>Meta</span><span class="minds">Minds</span>
      </p>
    </div>

    <section
      id="consultation"
      class="chapter logo-hold-chapter"
    >
      <div class="copy copy-center copy-consult">
        <h2>
          Let's find the right tutor.
        </h2>
        <p>
          Free. 30 minutes.
        </p>
        <p>
          DFW. Zoom.
        </p>
        <a
          href="https://www.metamindsstemacademy.com/consultation"
          class="primary-button"
        >
          Book Free Consultation
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

        invalidateOnRefresh:
          true,

        fastScrollEnd:
          true,

        scrub:
          REDUCED_MOTION
            ? false
            : 0.4,

        onUpdate:
          updateStory,
      },
    }
  )

  let introLocked = true
  const releaseIntro = () => {
    introLocked = false
  }
  window.addEventListener('wheel', releaseIntro, { once: true, passive: true })
  window.addEventListener('touchstart', releaseIntro, { once: true, passive: true })
  window.addEventListener('keydown', releaseIntro, { once: true })
  window.setTimeout(releaseIntro, 1800)

  const pinIntro = () => {
    if (!introLocked) {
      return
    }
    window.scrollTo(0, 0)
    story.progress = 0
    storyTween.progress(0)
    const st = storyTween.scrollTrigger
    if (st) {
      st.scroll(st.start)
    }
    updateStory()
  }

  ScrollTrigger.refresh()
  pinIntro()
  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
    pinIntro()
    requestAnimationFrame(() => {
      pinIntro()
    })
  })
  window.setTimeout(() => {
    if (introLocked) {
      ScrollTrigger.refresh()
      pinIntro()
    } else {
      ScrollTrigger.refresh()
    }
  }, 400)

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

  setupVisibilityObserver()

  syncCopyBeats(story.progress)

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

      if (isLogoStage && logoColors) {
        tempColor.setRGB(
          logoColors[i3],
          logoColors[i3 + 1],
          logoColors[i3 + 2]
        )
      } else if (isLogoStage) {
        tempColor.copy(WHITE)
        tempColor.lerp(
          INK,
          0.10
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

      if (!isLogoStage) {
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
      logoStill.value +=
        (
          0.38 -
          logoStill.value
        ) *
        0.14
    } else {
      logoStill.value +=
        (
          0 -
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

    particleMaterial.uniforms.uAlpha.value +=
      (
        (onLogoHold ? 0 : 0.9) -
        particleMaterial.uniforms.uAlpha.value
      ) *
      (onLogoHold ? 0.35 : 0.1)

    particles.visible =
      !onLogoHold ||
      particleMaterial.uniforms.uAlpha.value > 0.03

    if (wordMark) {
      wordMark.visible = false
      wordMark.material.opacity = 0
    }

    const logoBlend =
      onLogoHold
        ? THREE.NormalBlending
        : THREE.AdditiveBlending

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