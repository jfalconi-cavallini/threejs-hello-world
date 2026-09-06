// Hero / morph brain topology comes from public/models/brain.glb
// (area-weighted triangle samples → public/particles/brain.f32.bin).
// This file only builds the desktop plexus lines on those points.
// JOSE LOCK: do not replace the GLB sample with a procedural blob
// or a PNG/JPG/CSS photo plate.

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
