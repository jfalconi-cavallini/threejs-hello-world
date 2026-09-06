import * as THREE from 'three'

// Area-weighted triangle samples off a GLB. Brain sampling biases
// the outer cortex shell (frontal / parietal / temporal / occipital)
// and downweights cerebellum, stem, and midline internals so the
// hold reads as two hemispheres + fissure — not a filled glow blob.
// JOSE LOCK: do not replace this with a procedural SDF or a PNG plate.

export const BRAIN_SAMPLE_OPTIONS = {
  roleBias: true,
  outerBias: 2.4,
  puff: 0.028,
  sortOuter: true,
  seed: 0x62726169,
}

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

function meshRole(object) {
  let node = object
  while (node) {
    const n = (node.name || '').toLowerCase()
    if (
      n.includes('front') ||
      n.includes('pariet') ||
      n.includes('temp') ||
      n.includes('occipit')
    ) {
      return 'cortex'
    }
    if (n.includes('cereb')) return 'cerebellum'
    if (n.includes('stem')) return 'stem'
    if (n.includes('corpus')) return 'skip'
    if (n.includes('pitua') || n.includes('pitui')) return 'skip'
    node = node.parent
  }
  return 'surface'
}

const ROLE_WEIGHT = {
  cortex: 1,
  surface: 1,
  cerebellum: 0.11,
  stem: 0.07,
  skip: 0,
}

export function modelToParticlePositions(
  model,
  desiredSize,
  puffScale = 1,
  count,
  options = {}
) {
  if (!count || count <= 0) return null

  model.updateMatrixWorld(true)

  const rand = options.seed != null ? mulberry32(options.seed) : Math.random
  const roleBias = options.roleBias === true
  const outerBias = options.outerBias || 0
  const sortOuter = options.sortOuter === true
  const STRIDE = 10
  const maxTris = options.maxTris ?? Math.max(count * 8, 8000)
  const packed = new Float32Array(maxTris * STRIDE)
  let stored = 0
  let seen = 0

  const vA = new THREE.Vector3()
  const vB = new THREE.Vector3()
  const vC = new THREE.Vector3()
  const edge1 = new THREE.Vector3()
  const edge2 = new THREE.Vector3()
  const cross = new THREE.Vector3()

  let minX = Infinity
  let minY = Infinity
  let minZ = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let maxZ = -Infinity

  const writeTri = (slot, weight) => {
    const base = slot * STRIDE
    packed[base] = vA.x
    packed[base + 1] = vA.y
    packed[base + 2] = vA.z
    packed[base + 3] = vB.x
    packed[base + 4] = vB.y
    packed[base + 5] = vB.z
    packed[base + 6] = vC.x
    packed[base + 7] = vC.y
    packed[base + 8] = vC.z
    packed[base + 9] = weight
  }

  model.traverse((child) => {
    if (!child.isMesh) return
    const geo = child.geometry
    if (!geo?.attributes?.position) return

    const role = roleBias ? meshRole(child) : 'surface'
    const roleWeight = ROLE_WEIGHT[role] ?? 1
    if (roleWeight <= 0) return

    const pos = geo.attributes.position
    const idx = geo.index
    const faceCount = idx ? idx.count / 3 : pos.count / 3

    for (let f = 0; f < faceCount; f++) {
      const a = idx ? idx.getX(f * 3) : f * 3
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

      minX = Math.min(minX, vA.x, vB.x, vC.x)
      minY = Math.min(minY, vA.y, vB.y, vC.y)
      minZ = Math.min(minZ, vA.z, vB.z, vC.z)
      maxX = Math.max(maxX, vA.x, vB.x, vC.x)
      maxY = Math.max(maxY, vA.y, vB.y, vC.y)
      maxZ = Math.max(maxZ, vA.z, vB.z, vC.z)

      seen += 1

      if (stored < maxTris) {
        writeTri(stored, area * roleWeight)
        stored += 1
      } else {
        const j = Math.floor(rand() * seen)
        if (j < maxTris) {
          const slot = j
          const prev = packed[slot * STRIDE + 9]
          const next = area * roleWeight
          if (next >= prev || rand() < next / (prev + next)) {
            writeTri(slot, next)
          }
        }
      }
    }
  })

  if (!stored) return null

  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  const centerZ = (minZ + maxZ) / 2
  const spanX = maxX - minX
  const spanY = maxY - minY
  const spanZ = maxZ - minZ
  const span = Math.max(spanX, spanY, spanZ) || 1
  const lobeOffset = spanZ * 0.22

  let totalWeight = 0
  for (let t = 0; t < stored; t++) {
    const base = t * STRIDE
    const fx = (packed[base] + packed[base + 3] + packed[base + 6]) / 3
    const fy = (packed[base + 1] + packed[base + 4] + packed[base + 7]) / 3
    const fz = (packed[base + 2] + packed[base + 5] + packed[base + 8]) / 3

    const e1x = packed[base + 3] - packed[base]
    const e1y = packed[base + 4] - packed[base + 1]
    const e1z = packed[base + 5] - packed[base + 2]
    const e2x = packed[base + 6] - packed[base]
    const e2y = packed[base + 7] - packed[base + 1]
    const e2z = packed[base + 8] - packed[base + 2]
    let nx = e1y * e2z - e1z * e2y
    let ny = e1z * e2x - e1x * e2z
    let nz = e1x * e2y - e1y * e2x
    const nlen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
    nx /= nlen
    ny /= nlen
    nz /= nlen

    const vx = fx - centerX
    const vy = fy - centerY
    const vz = fz - centerZ
    const vlen = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1
    const outward = (nx * vx + ny * vy + nz * vz) / vlen

    // Inner faces of a thick mesh fill the volume. Keep medial
    // cortex walls (outward-of-lobe) by scoring against each
    // hemisphere's own center, not the global centroid.
    const hemi = vz >= 0 ? 1 : -1
    const lx = vx
    const ly = vy
    const lz = vz - hemi * lobeOffset
    const lobeR = Math.sqrt(lx * lx + ly * ly + lz * lz) / span

    let w = packed[base + 9]
    if (roleBias) {
      w *= outward < -0.12 ? 0.08 : 0.55 + 0.45 * Math.max(0, outward)
    }
    if (outerBias > 0) {
      w *= Math.pow(Math.max(0.08, lobeR), outerBias)
    }
    packed[base + 9] = w
    totalWeight += w
  }

  if (totalWeight <= 0) return null

  const cdf = new Float64Array(stored)
  let cumulative = 0
  for (let t = 0; t < stored; t++) {
    cumulative += packed[t * STRIDE + 9] / totalWeight
    cdf[t] = cumulative
  }

  const scale = desiredSize / span
  const output = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const r = rand()
    let lo = 0
    let hi = stored - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cdf[mid] < r) lo = mid + 1
      else hi = mid
    }
    const base = lo * STRIDE

    let u = rand()
    let v = rand()
    if (u + v > 1) {
      u = 1 - u
      v = 1 - v
    }
    const w = 1 - u - v

    const i3 = i * 3
    const px =
      (w * packed[base] + u * packed[base + 3] + v * packed[base + 6] - centerX) *
      scale
    const py =
      (w * packed[base + 1] +
        u * packed[base + 4] +
        v * packed[base + 7] -
        centerY) *
      scale
    const pz =
      (w * packed[base + 2] +
        u * packed[base + 5] +
        v * packed[base + 8] -
        centerZ) *
      scale

    const e1x = packed[base + 3] - packed[base]
    const e1y = packed[base + 4] - packed[base + 1]
    const e1z = packed[base + 5] - packed[base + 2]
    const e2x = packed[base + 6] - packed[base]
    const e2y = packed[base + 7] - packed[base + 1]
    const e2z = packed[base + 8] - packed[base + 2]
    let nx = e1y * e2z - e1z * e2y
    let ny = e1z * e2x - e1x * e2z
    let nz = e1x * e2y - e1y * e2x
    const nlen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
    nx /= nlen
    ny /= nlen
    nz /= nlen

    const puff = (rand() - 0.08) * 0.16 * puffScale
    output[i3] = px + nx * puff
    output[i3 + 1] = py + ny * puff
    output[i3 + 2] = pz + nz * puff
  }

  if (sortOuter) {
    const order = new Uint32Array(count)
    const radius = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      order[i] = i
      const i3 = i * 3
      radius[i] = Math.hypot(output[i3], output[i3 + 1], output[i3 + 2])
    }
    order.sort((a, b) => radius[b] - radius[a])
    const sorted = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const src = order[i] * 3
      const dst = i * 3
      sorted[dst] = output[src]
      sorted[dst + 1] = output[src + 1]
      sorted[dst + 2] = output[src + 2]
    }
    output.set(sorted)
  }

  return output
}
