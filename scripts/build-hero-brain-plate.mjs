import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Deterministic hemispheric brain plate. Same silhouette the live
// morph sculpts toward — warm left / cool right, sitting on a floor.
const W = 800
const H = 520
const CX = 400
const CY = 248

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

function brainLocal(hemi, rand) {
  const theta = rand() * Math.PI * 2
  const u = rand()
  const phi = Math.acos(2 * u - 1)
  let x = Math.sin(phi) * Math.cos(theta)
  let y = Math.cos(phi)
  let z = Math.sin(phi) * Math.sin(theta)

  x = hemi * (0.16 + Math.abs(x) * 0.84)
  x *= 0.92
  y *= 0.70
  z *= 0.62
  y += 0.10

  const temporal = Math.max(0, -y + 0.02) * Math.abs(x)
  y -= temporal * 0.62
  x += hemi * temporal * 0.22
  z += temporal * 0.18

  if (z > 0 && y > -0.05) {
    z += 0.10 * (y + 0.18)
  }

  const wrinkle =
    Math.sin(x * 16 + y * 11) * Math.cos(z * 13) * 0.028
  const len = Math.hypot(x, y, z) || 1
  x += (x / len) * wrinkle
  y += (y / len) * wrinkle
  z += (z / len) * wrinkle

  const inward = rand() * 0.16
  x *= 1 - inward
  y *= 1 - inward
  z *= 1 - inward

  return { x, y, z }
}

function project(p) {
  const sx = CX + p.x * 310
  const sy = CY - p.y * 250 - p.z * 36
  return { x: sx, y: sy, z: p.z }
}

function hex(warm, t) {
  const lerp = (a, b, u) => Math.round(a + (b - a) * u)
  if (warm) {
    const r = lerp(255, 255, t)
    const g = lerp(92, 184, t)
    const b = lerp(0, 80, t)
    return `rgb(${r},${g},${b})`
  }
  const r = lerp(30, 103, t)
  const g = lerp(90, 232, t)
  const b = lerp(255, 249, t)
  return `rgb(${r},${g},${b})`
}

const rand = mulberry32(0xb0a12)
const dots = []
const max = 720
let guard = 0

while (dots.length < max && guard < max * 40) {
  guard += 1
  const hemi = dots.length % 2 === 0 ? -1 : 1
  const p = brainLocal(hemi, rand)
  if (Math.abs(p.x) < 0.055 && p.y > -0.12) continue
  const q = project(p)
  if (q.x < 36 || q.x > W - 36 || q.y < 28 || q.y > 430) continue
  dots.push({ ...q, hemi, warm: hemi < 0 })
}

const nodes = []
const nRand = mulberry32(0x51a7)
for (let i = 0; i < 28; i++) {
  const hemi = i % 2 === 0 ? -1 : 1
  const p = brainLocal(hemi, nRand)
  const q = project({
    x: p.x * 1.38,
    y: p.y * 1.12,
    z: p.z * 1.2,
  })
  nodes.push(q)
}

const links = []
for (let i = 0; i < nodes.length; i++) {
  const dists = nodes
    .map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
    .filter((n) => n.j > i && n.d > 18 && n.d < 150)
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)
  for (const n of dists) links.push([i, n.j])
}

const particleCircles = dots
  .map((d) => {
    const depth = (d.z + 0.7) / 1.4
    const r = 1.1 + depth * 2.1
    const t = Math.abs(d.x - CX) / 310
    const fill = hex(d.warm, Math.min(1, t))
    const op = 0.42 + depth * 0.5
    return `<circle cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="${r.toFixed(2)}" fill="${fill}" fill-opacity="${op.toFixed(2)}"/>`
  })
  .join('')

const plexus = [
  ...links.map(([a, b]) => {
    const c = nodes[a].x < CX ? '255,92,0' : '61,139,255'
    return `<line x1="${nodes[a].x.toFixed(1)}" y1="${nodes[a].y.toFixed(1)}" x2="${nodes[b].x.toFixed(1)}" y2="${nodes[b].y.toFixed(1)}" stroke="rgb(${c})" stroke-opacity="0.22" stroke-width="0.7"/>`
  }),
  ...nodes.map((n) => {
    const c = n.x < CX ? '255,92,0' : '61,139,255'
    return `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="1.6" fill="rgb(${c})" fill-opacity="0.55"/>`
  }),
].join('')

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none">
  <defs>
    <radialGradient id="leftGlow" cx="36%" cy="48%" r="42%">
      <stop offset="0%" stop-color="#ff8a1a" stop-opacity="0.95"/>
      <stop offset="42%" stop-color="#ff5c00" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#ff5c00" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="rightGlow" cx="64%" cy="46%" r="42%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.88"/>
      <stop offset="40%" stop-color="#3d8bff" stop-opacity="0.52"/>
      <stop offset="100%" stop-color="#3d8bff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="core" cx="50%" cy="52%" r="28%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="292" cy="262" rx="168" ry="142" fill="url(#leftGlow)"/>
  <ellipse cx="508" cy="254" rx="168" ry="142" fill="url(#rightGlow)"/>
  <ellipse cx="400" cy="268" rx="86" ry="110" fill="url(#core)"/>
  <g opacity="0.9">${plexus}</g>
  <g>${particleCircles}</g>
</svg>
`

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'frames')
mkdirSync(outDir, { recursive: true })
const out = path.join(outDir, 'hero-brain-hemi.svg')
writeFileSync(out, svg)
console.log(`${out}  ${svg.length} bytes  ${dots.length} dots`)
