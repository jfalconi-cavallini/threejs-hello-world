// Procedural hero brain — same PARTICLE_COUNT as the morph budget.
// Superior (top-down) silhouette with a longitudinal fissure and
// sulci. Two disconnected cheek-blobs are the PR #31 fail; this
// stays one organ with a groove, not a gap.
// JOSE LOCK: this form is sampled into live Points. Do not replace
// the hero hold with a PNG/JPG/CSS photo plate.

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash3(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return n - Math.floor(n)
}

function noise3(x, y, z) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const fx = x - ix
  const fy = y - iy
  const fz = z - iz
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const uz = fz * fz * (3 - 2 * fz)

  const n000 = hash3(ix, iy, iz)
  const n100 = hash3(ix + 1, iy, iz)
  const n010 = hash3(ix, iy + 1, iz)
  const n110 = hash3(ix + 1, iy + 1, iz)
  const n001 = hash3(ix, iy, iz + 1)
  const n101 = hash3(ix + 1, iy, iz + 1)
  const n011 = hash3(ix, iy + 1, iz + 1)
  const n111 = hash3(ix + 1, iy + 1, iz + 1)

  const x00 = n000 + (n100 - n000) * ux
  const x10 = n010 + (n110 - n010) * ux
  const x01 = n001 + (n101 - n001) * ux
  const x11 = n011 + (n111 - n011) * ux
  const y0 = x00 + (x10 - x00) * uy
  const y1 = x01 + (x11 - x01) * uy
  return y0 + (y1 - y0) * uz
}

function fbm(x, y, z) {
  return (
    noise3(x, y, z) * 0.57 +
    noise3(x * 2.13, y * 2.13, z * 2.13) * 0.29 +
    noise3(x * 4.27, y * 4.27, z * 4.27) * 0.14
  )
}

function rotateX(x, y, z, angle) {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return [x, y * c - z * s, y * s + z * c]
}

function normalizeBounds(output, count, desiredSize) {
  let minX = Infinity
  let minY = Infinity
  let minZ = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let maxZ = -Infinity

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    minX = Math.min(minX, output[i3])
    minY = Math.min(minY, output[i3 + 1])
    minZ = Math.min(minZ, output[i3 + 2])
    maxX = Math.max(maxX, output[i3])
    maxY = Math.max(maxY, output[i3 + 1])
    maxZ = Math.max(maxZ, output[i3 + 2])
  }

  const cx = (minX + maxX) * 0.5
  const cy = (minY + maxY) * 0.5
  const cz = (minZ + maxZ) * 0.5
  const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1
  const scale = desiredSize / span

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    output[i3] = (output[i3] - cx) * scale
    output[i3 + 1] = (output[i3 + 1] - cy) * scale
    output[i3 + 2] = (output[i3 + 2] - cz) * scale
  }
}

// Sample a cortical point in local brain space:
// x = left/right, y = superior, z = anterior (+z = front).
function sampleCortex(rand) {
  const hemi = rand() < 0.5 ? -1 : 1

  // Rejection-sample the superior oval so the outline is a brain,
  // not two offset spheres.
  let u = 0
  let v = 0
  for (let k = 0; k < 8; k++) {
    u = (rand() * 2 - 1) * 1.08
    v = (rand() * 2 - 1) * 1.22
    const nx = u / 0.92
    const nz = v / 1.08
    if (nx * nx + nz * nz <= 1) break
  }

  // Frontal poles taper; occipital / parietal stay fuller.
  const front = Math.max(0, v)
  const back = Math.max(0, -v)
  const width = 0.86 + back * 0.10 - front * 0.16
  // Keep the hemispheres joined. A 0.05+ offset was the PR #31
  // cheek-split. The fissure is a groove in Y, not a gap in X.
  let x = hemi * (0.012 + Math.abs(u) * width)
  let z = v * (1.02 - Math.abs(u) * 0.08)

  // Temporal fullness sits mid-lateral, slightly posterior — a
  // gentle side swell, not a hanging cheek pair.
  const temporal = Math.exp(-((z + 0.12) * (z + 0.12)) / 0.22) *
    Math.max(0, Math.abs(x) - 0.28)
  x += hemi * temporal * 0.22

  // Superior dome: highest over the parietal, lower at poles.
  const r2 = (x / 0.95) * (x / 0.95) + (z / 1.12) * (z / 1.12)
  let y = 0.42 * Math.sqrt(Math.max(0, 1 - r2 * 0.72))
  y *= 0.78 + (1 - r2) * 0.22
  y -= front * 0.06 + back * 0.03

  // Longitudinal fissure: a groove, not a cut. Points stay one
  // organ; the midline only sinks and pinches.
  const mid = Math.exp(-(x * x) / 0.018)
  y -= mid * 0.22
  x += hemi * mid * 0.035

  // Central + arcuate sulci. Density gathers in the recesses
  // (Jose target: folds read as brighter grooves).
  const sulcus =
    Math.sin(z * 9.4 + x * 1.6) * 0.55 +
    Math.sin((z * 0.62 + Math.abs(x) * 1.15) * 7.2) * 0.35 +
    Math.sin((z * 1.4 - x * hemi * 0.8) * 11.0) * 0.22
  const warp = fbm(x * 3.4, y * 4.1, z * 3.2) - 0.5
  const fold = sulcus + warp * 1.15
  const recess = Math.max(0, -fold)
  const ridge = Math.max(0, fold)

  const len = Math.hypot(x, y * 1.4, z) || 1
  const inward = recess * 0.078 + mid * 0.016
  x -= (x / len) * inward
  y -= inward * 0.92 + ridge * 0.012
  z -= (z / len) * inward * 0.6

  // Inferior flatten so the form can sit on the floor glow.
  if (y < 0.02) y = 0.02 - (0.02 - y) * 0.35

  return { x, y, z, recess, mid }
}

function sampleCerebellum(rand) {
  const hemi = rand() < 0.5 ? -1 : 1
  const theta = rand() * Math.PI * 2
  const phi = Math.acos(2 * rand() - 1)
  let x = Math.sin(phi) * Math.cos(theta) * 0.26
  let y = Math.cos(phi) * 0.14
  let z = Math.sin(phi) * Math.sin(theta) * 0.18
  x = hemi * (0.04 + Math.abs(x) * 0.72)
  z -= 0.92
  y -= 0.08
  const folia = Math.sin(x * 28) * Math.sin(z * 22) * 0.012
  y += folia
  return { x, y, z, recess: 0.25, mid: 0 }
}

function sampleStem(rand) {
  const t = rand()
  const a = rand() * Math.PI * 2
  const r = 0.055 + rand() * 0.04
  return {
    x: Math.cos(a) * r,
    y: -0.22 - t * 0.18,
    z: -0.42 - t * 0.16,
    recess: 0,
    mid: 0.2,
  }
}

export function generateBrainPositions(count, desiredSize = 3.2) {
  const rand = mulberry32(0x6d1bd5)
  const output = new Float32Array(count * 3)
  const cortexN = Math.floor(count * 0.92)
  const cereN = Math.floor(count * 0.06)

  for (let i = 0; i < count; i++) {
    let sample
    if (i < cortexN) {
      sample = sampleCortex(rand)
    } else if (i < cortexN + cereN) {
      sample = sampleCerebellum(rand)
    } else {
      sample = sampleStem(rand)
    }

    // A little volume under the surface so the cloud has depth,
    // not a paper-thin shell.
    const inward = rand() * rand() * 0.16
    let x = sample.x * (1 - inward)
    let y = sample.y * (1 - inward * 0.7)
    let z = sample.z * (1 - inward)

    // Jose still: superior view, pitched so the fissure and
    // both hemispheres read in one frame. Not a lateral pair.
    const pitched = rotateX(x, y, z, -0.72)
    output[i * 3] = pitched[0]
    output[i * 3 + 1] = pitched[1]
    output[i * 3 + 2] = pitched[2]
  }

  normalizeBounds(output, count, desiredSize)
  return output
}

export function buildPlexusSegments(positions, maxSegments = 900) {
  const count = positions.length / 3
  const cell = 0.22
  const buckets = new Map()

  const keyOf = (ix, iy, iz) => `${ix}|${iy}|${iz}`

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const ix = Math.floor(positions[i3] / cell)
    const iy = Math.floor(positions[i3 + 1] / cell)
    const iz = Math.floor(positions[i3 + 2] / cell)
    const key = keyOf(ix, iy, iz)
    let list = buckets.get(key)
    if (!list) {
      list = []
      buckets.set(key, list)
    }
    list.push(i)
  }

  const segs = []
  const seen = new Set()
  const minD = 0.045
  const maxD = 0.20

  for (let i = 0; i < count && segs.length < maxSegments; i++) {
    const i3 = i * 3
    const ix = Math.floor(positions[i3] / cell)
    const iy = Math.floor(positions[i3 + 1] / cell)
    const iz = Math.floor(positions[i3 + 2] / cell)

    let best = -1
    let bestD = maxD
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const list = buckets.get(keyOf(ix + dx, iy + dy, iz + dz))
          if (!list) continue
          for (let n = 0; n < list.length; n++) {
            const j = list[n]
            if (j <= i) continue
            const j3 = j * 3
            const d = Math.hypot(
              positions[i3] - positions[j3],
              positions[i3 + 1] - positions[j3 + 1],
              positions[i3 + 2] - positions[j3 + 2]
            )
            if (d < minD || d > maxD) continue
            if (d < bestD) {
              bestD = d
              best = j
            }
          }
        }
      }
    }

    if (best < 0) continue
    const pair = `${i}:${best}`
    if (seen.has(pair)) continue
    seen.add(pair)
    segs.push(i, best)
  }

  const out = new Float32Array(segs.length * 3)
  for (let s = 0; s < segs.length; s++) {
    const src = segs[s] * 3
    const dst = s * 3
    out[dst] = positions[src]
    out[dst + 1] = positions[src + 1]
    out[dst + 2] = positions[src + 2]
  }

  return out
}
