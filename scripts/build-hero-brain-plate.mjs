import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const W = 800
const H = 480

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

// Front-elevated brain lobes. Wider than tall, open fissure,
// temporal droop. Not two overlapping circles.
const LEFT = `
  M 392 78
  C 348 52 268 48 198 78
  C 128 108 88 168 96 228
  C 104 286 142 328 198 348
  C 248 366 304 352 348 318
  C 372 298 386 262 390 214
  C 394 168 396 118 392 78
  Z
`
const RIGHT = `
  M 408 78
  C 452 52 532 48 602 78
  C 672 108 712 168 704 228
  C 696 286 658 328 602 348
  C 552 366 496 352 452 318
  C 428 298 414 262 410 214
  C 406 168 404 118 408 78
  Z
`

function pointInLobe(x, y, hemi) {
  const cx = hemi < 0 ? 268 : 532
  const cy = 198
  const dx = (x - cx) / 168
  const dy = (y - cy) / 132
  const temporal = y > 250 ? ((x - (hemi < 0 ? 210 : 590)) / 90) * 0.18 : 0
  const rx = 1 + Math.max(0, -temporal)
  const ry = 1 + (y > 280 ? 0.12 : 0)
  if (hemi < 0 && x > 394) return false
  if (hemi > 0 && x < 406) return false
  return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) < 1
}

const rand = mulberry32(0xb0a12)
const dots = []
while (dots.length < 820) {
  const hemi = dots.length % 2 === 0 ? -1 : 1
  const x = 90 + rand() * 620
  const y = 50 + rand() * 340
  if (!pointInLobe(x, y, hemi)) continue
  const t = Math.min(1, Math.abs(x - 400) / 240)
  const depth = rand()
  const r = 1.05 + depth * 2.15
  const warm = hemi < 0
  const fill = warm
    ? `rgb(255,${Math.round(92 + t * 90)},${Math.round(t * 40)})`
    : `rgb(${Math.round(40 + t * 60)},${Math.round(120 + t * 90)},255)`
  dots.push(
    `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${fill}" fill-opacity="${(0.46 + depth * 0.48).toFixed(2)}"/>`
  )
}

const nRand = mulberry32(0x51a7)
const nodes = []
while (nodes.length < 22) {
  const hemi = nodes.length % 2 === 0 ? -1 : 1
  const x = 70 + nRand() * 660
  const y = 40 + nRand() * 360
  if (!pointInLobe(x, y, hemi) && nRand() > 0.35) continue
  nodes.push({ x, y, hemi })
}

const links = []
for (let i = 0; i < nodes.length; i++) {
  const near = nodes
    .map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
    .filter((n) => n.j > i && n.d > 24 && n.d < 140)
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)
  for (const n of near) links.push([i, n.j])
}

const plexus = [
  ...links.map(([a, b]) => {
    const c = nodes[a].x < 400 ? '255,92,0' : '61,139,255'
    return `<line x1="${nodes[a].x.toFixed(1)}" y1="${nodes[a].y.toFixed(1)}" x2="${nodes[b].x.toFixed(1)}" y2="${nodes[b].y.toFixed(1)}" stroke="rgb(${c})" stroke-opacity="0.28" stroke-width="0.8"/>`
  }),
  ...nodes.map((n) => {
    const c = n.x < 400 ? '255,92,0' : '61,139,255'
    return `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="1.7" fill="rgb(${c})" fill-opacity="0.6"/>`
  }),
].join('')

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none">
  <defs>
    <clipPath id="leftLobe"><path d="${LEFT}"/></clipPath>
    <clipPath id="rightLobe"><path d="${RIGHT}"/></clipPath>
    <radialGradient id="leftGlow" cx="38%" cy="46%" r="58%">
      <stop offset="0%" stop-color="#ffb450" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#ff5c00" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#ff5c00" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="rightGlow" cx="62%" cy="46%" r="58%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.9"/>
      <stop offset="45%" stop-color="#3d8bff" stop-opacity="0.52"/>
      <stop offset="100%" stop-color="#3d8bff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <g clip-path="url(#leftLobe)">
    <rect x="80" y="40" width="330" height="340" fill="url(#leftGlow)"/>
  </g>
  <g clip-path="url(#rightLobe)">
    <rect x="390" y="40" width="330" height="340" fill="url(#rightGlow)"/>
  </g>
  <path d="${LEFT}" stroke="rgba(255,184,80,0.35)" stroke-width="1.2"/>
  <path d="${RIGHT}" stroke="rgba(103,232,249,0.32)" stroke-width="1.2"/>
  <g opacity="0.88">${plexus}</g>
  <g>${dots.join('')}</g>
</svg>
`

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'frames')
mkdirSync(outDir, { recursive: true })
writeFileSync(path.join(outDir, 'hero-brain-hemi.svg'), svg)
console.log(`hero-brain-hemi.svg  ${svg.length} bytes  ${dots.length} dots`)
