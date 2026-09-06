// Hero / morph brain topology comes from public/models/brain.glb
// (outer-cortex triangle samples → public/particles/brain.f32.bin).
// JOSE LOCK: do not replace the GLB sample with a procedural blob
// or a PNG/JPG/CSS photo plate.

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

// brain.glb world axes: X = anterior–posterior, Y = superior,
// Z = left–right. The hero camera looks down −Z, so a raw sample
// reads as a side-on oval. Remap hemispheres onto X and pitch so
// the cortex silhouette (two lobes + fissure) faces the hold.
export function finishBrainPositions(positions, desiredSize = 3.2) {
  const count = positions.length / 3
  const pitch = -0.64
  const c = Math.cos(pitch)
  const s = Math.sin(pitch)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const ap = positions[i3]
    const up = positions[i3 + 1]
    const lr = positions[i3 + 2]
    const x = lr
    const y = up
    const z = -ap
    positions[i3] = x
    positions[i3 + 1] = y * c - z * s
    positions[i3 + 2] = y * s + z * c
  }

  normalizeBounds(positions, count, desiredSize)

  // Open a thin dark midline so 1.6k phone points do not fill the
  // longitudinal fissure. Keep this a groove, not a cheek split.
  const halfGap = desiredSize * 0.022
  const groove = desiredSize * 0.020
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    let x = positions[i3]
    const ax = Math.abs(x)
    if (ax < halfGap * 2.6) {
      const side = x < 0 ? -1 : x > 0 ? 1 : i % 2 ? 1 : -1
      x += side * (halfGap * 2.6 - ax) * 0.48
      positions[i3] = x
    }
    const mid = Math.exp(-(positions[i3] * positions[i3]) / (groove * 3.4))
    positions[i3 + 1] -= mid * desiredSize * 0.028
  }

  normalizeBounds(positions, count, desiredSize)
  return positions
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
