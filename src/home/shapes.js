/**
 * shapes.js
 *
 * Builds all six Float32Array(N*3) position buffers:
 *   brain, scatter, bulb, earth, path, logo
 *
 * brain / bulb / logo → area-weighted surface sampling from GLBs
 * scatter             → brain positions pushed outward with noise
 * earth               → Fibonacci sphere, land particles from GeoJSON
 * path                → CatmullRom spline through five nodes
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ── GLB helper ────────────────────────────────────────────────────────────────

function loadGLB(url) {
  return new Promise((resolve, reject) => {
    new GLTFLoader().load(url, resolve, undefined, reject);
  });
}

// ── Area-weighted surface sampling ───────────────────────────────────────────
// Returns Float32Array(N*3) of points on the mesh surface.

function sampleSurface(gltfScene, N, targetSize = 4.5) {
  gltfScene.updateMatrixWorld(true);

  const tris = [];
  let totalArea = 0;
  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();
  const e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), cr = new THREE.Vector3();
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  gltfScene.traverse((child) => {
    if (!child.isMesh) return;
    const geo = child.geometry;
    if (!geo?.attributes?.position) return;
    const pos = geo.attributes.position;
    const idx = geo.index;
    const faceCount = idx ? idx.count / 3 : pos.count / 3;

    for (let f = 0; f < faceCount; f++) {
      const a = idx ? idx.getX(f * 3)     : f * 3;
      const b = idx ? idx.getX(f * 3 + 1) : f * 3 + 1;
      const c = idx ? idx.getX(f * 3 + 2) : f * 3 + 2;

      vA.fromBufferAttribute(pos, a).applyMatrix4(child.matrixWorld);
      vB.fromBufferAttribute(pos, b).applyMatrix4(child.matrixWorld);
      vC.fromBufferAttribute(pos, c).applyMatrix4(child.matrixWorld);

      e1.subVectors(vB, vA);
      e2.subVectors(vC, vA);
      cr.crossVectors(e1, e2);
      const area = cr.length() * 0.5;
      if (area < 1e-10) continue;

      tris.push(vA.x, vA.y, vA.z, vB.x, vB.y, vB.z, vC.x, vC.y, vC.z, area);
      totalArea += area;
      minX = Math.min(minX, vA.x, vB.x, vC.x); maxX = Math.max(maxX, vA.x, vB.x, vC.x);
      minY = Math.min(minY, vA.y, vB.y, vC.y); maxY = Math.max(maxY, vA.y, vB.y, vC.y);
      minZ = Math.min(minZ, vA.z, vB.z, vC.z); maxZ = Math.max(maxZ, vA.z, vB.z, vC.z);
    }
  });

  if (!tris.length) return new Float32Array(N * 3);

  const STRIDE    = 10; // 9 floats + 1 area
  const triCount  = tris.length / STRIDE;
  const cdf       = new Float64Array(triCount);
  let cumulative  = 0;
  for (let t = 0; t < triCount; t++) {
    cumulative += tris[t * STRIDE + 9] / totalArea;
    cdf[t] = cumulative;
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;
  const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1;
  const scale = targetSize / span;

  const out = new Float32Array(N * 3);

  for (let i = 0; i < N; i++) {
    // Binary search for triangle weighted by area
    const r = Math.random();
    let lo = 0, hi = triCount - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < r) lo = mid + 1; else hi = mid;
    }
    const base = lo * STRIDE;

    // Random barycentric point inside the triangle
    let u = Math.random(), v = Math.random();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const w = 1 - u - v;

    const i3 = i * 3;
    out[i3]     = (w * tris[base]     + u * tris[base + 3] + v * tris[base + 6] - cx) * scale;
    out[i3 + 1] = (w * tris[base + 1] + u * tris[base + 4] + v * tris[base + 7] - cy) * scale;
    out[i3 + 2] = (w * tris[base + 2] + u * tris[base + 5] + v * tris[base + 8] - cz) * scale;
  }

  return out;
}

// ── Scatter shape ─────────────────────────────────────────────────────────────
// Push brain positions outward with directional noise so particles look
// restless and the shape dissolves organically.

function buildScatter(brain, N) {
  const out = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const x = brain[i3], y = brain[i3 + 1], z = brain[i3 + 2];
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    // Random outward direction with swirl
    const seed  = Math.random() * Math.PI * 2;
    const dist  = 1.0 + Math.random() * 2.8;
    const swirl = Math.sin(seed * 1.7) * 0.8;
    out[i3]     = x + (x / len + (Math.random() - 0.5) * 0.5) * dist + swirl;
    out[i3 + 1] = y + (y / len + (Math.random() - 0.5) * 0.5) * dist + Math.cos(seed * 2.1) * 0.7;
    out[i3 + 2] = z + (z / len + (Math.random() - 0.5) * 0.5) * dist + Math.sin(seed * 0.9) * 0.6;
  }
  return out;
}

// ── Earth (Fibonacci sphere + GeoJSON land test) ──────────────────────────────

function buildLandPolygons(geojson) {
  const polys = [];
  for (const feat of geojson.features) {
    const g = feat.geometry;
    const addRing = (coords) => {
      const ring = coords[0];
      let mn = Infinity, mx = -Infinity, ml = Infinity, xl = -Infinity;
      for (const pt of ring) {
        if (pt[0] < mn) mn = pt[0]; if (pt[0] > mx) mx = pt[0];
        if (pt[1] < ml) ml = pt[1]; if (pt[1] > xl) xl = pt[1];
      }
      polys.push({ ring, minLon: mn, maxLon: mx, minLat: ml, maxLat: xl });
    };
    if (g.type === 'Polygon')      addRing(g.coordinates);
    if (g.type === 'MultiPolygon') g.coordinates.forEach(p => addRing(p));
  }
  return polys;
}

function pointInRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

export function buildEarth(_geojson, N) {
  const radius = 2.2;
  const PHI    = (1 + Math.sqrt(5)) / 2;
  const out    = new Float32Array(N * 3);

  for (let i = 0; i < N; i++) {
    const t      = i / (N - 1);
    const sinLat = 1 - 2 * t;
    const cosLat = Math.sqrt(Math.max(0, 1 - sinLat * sinLat));
    const lon    = (2 * Math.PI * i / PHI) % (2 * Math.PI);
    const i3     = i * 3;
    out[i3]     = radius * cosLat * Math.cos(lon);
    out[i3 + 1] = radius * sinLat;
    out[i3 + 2] = radius * cosLat * Math.sin(lon);
  }
  return out;
}

// ── Path shape ────────────────────────────────────────────────────────────────
// CatmullRom-like spline through 5 nodes; particles cluster at nodes and thin
// out along the connecting segments.

const PATH_NODES = [
  [-3.2, -0.3,  0.1],
  [-1.6,  0.4, -0.2],
  [ 0.0, -0.15, 0.3],
  [ 1.6,  0.4, -0.1],
  [ 3.2, -0.2,  0.0],
];

export function buildPath(N) {
  const out = new Float32Array(N * 3);

  // Sample points along a CatmullRom spline
  const segments = PATH_NODES.length - 1;

  for (let i = 0; i < N; i++) {
    // Concentrate more particles near the nodes (cosine distribution)
    const raw = i / N;
    const t = raw * segments;
    const seg = Math.min(Math.floor(t), segments - 1);
    const frac = t - seg;

    // CatmullRom: p0, p1, p2, p3
    const p0 = PATH_NODES[Math.max(0, seg - 1)];
    const p1 = PATH_NODES[seg];
    const p2 = PATH_NODES[Math.min(segments, seg + 1)];
    const p3 = PATH_NODES[Math.min(segments, seg + 2)];

    const f2 = frac * frac, f3 = f2 * frac;
    const catmull = (a, b, c, d) =>
      0.5 * (2 * b + (-a + c) * frac + (2 * a - 5 * b + 4 * c - d) * f2 + (-a + 3 * b - 3 * c + d) * f3);

    const x = catmull(p0[0], p1[0], p2[0], p3[0]);
    const y = catmull(p0[1], p1[1], p2[1], p3[1]);
    const z = catmull(p0[2], p1[2], p2[2], p3[2]);

    // Perpendicular scatter to give the path volume
    const scatter = 0.12 + Math.random() * 0.22;
    const angle   = Math.random() * Math.PI * 2;

    const i3 = i * 3;
    out[i3]     = x + Math.cos(angle) * scatter;
    out[i3 + 1] = y + Math.sin(angle) * scatter * 0.7;
    out[i3 + 2] = z + (Math.random() - 0.5) * 0.18;
  }
  return out;
}

// ── Logo (front-face only, MetaMinds text region) ────────────────────────────
// Samples only Z-facing faces (|nz| > 0.7) that are within the MetaMinds
// text bounding box, producing a crisp letter fill.

function sampleLogoFaces(gltfScene, N) {
  gltfScene.updateMatrixWorld(true);
  const tris = [];
  let totalArea = 0;
  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();
  const e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), cr = new THREE.Vector3();
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  gltfScene.traverse((child) => {
    if (!child.isMesh) return;
    const geo = child.geometry;
    if (!geo?.attributes?.position) return;
    const pos = geo.attributes.position;
    const idx = geo.index;
    const faceCount = idx ? idx.count / 3 : pos.count / 3;

    for (let f = 0; f < faceCount; f++) {
      const a = idx ? idx.getX(f * 3)     : f * 3;
      const b = idx ? idx.getX(f * 3 + 1) : f * 3 + 1;
      const c = idx ? idx.getX(f * 3 + 2) : f * 3 + 2;
      vA.fromBufferAttribute(pos, a).applyMatrix4(child.matrixWorld);
      vB.fromBufferAttribute(pos, b).applyMatrix4(child.matrixWorld);
      vC.fromBufferAttribute(pos, c).applyMatrix4(child.matrixWorld);

      // Skip STEM ACADEMY (y < 0.5) and brain icon (x < -5)
      const cx = (vA.x + vB.x + vC.x) / 3;
      const cy = (vA.y + vB.y + vC.y) / 3;
      if (cx < -5 || cy < 0.5) continue;

      e1.subVectors(vB, vA); e2.subVectors(vC, vA); cr.crossVectors(e1, e2);
      const len = cr.length();
      if (len < 1e-10) continue;
      // Only flat front/back faces — skip extrusion side-walls
      if (Math.abs(cr.z) / len < 0.7) continue;

      const area = len * 0.5;
      tris.push(vA.x, vA.y, vA.z, vB.x, vB.y, vB.z, vC.x, vC.y, vC.z, area);
      totalArea += area;
      minX = Math.min(minX, vA.x, vB.x, vC.x); maxX = Math.max(maxX, vA.x, vB.x, vC.x);
      minY = Math.min(minY, vA.y, vB.y, vC.y); maxY = Math.max(maxY, vA.y, vB.y, vC.y);
    }
  });

  if (!tris.length) return sampleSurface(gltfScene, N, 4.0);

  const STRIDE   = 10;
  const triCount = tris.length / STRIDE;
  const cdf      = new Float64Array(triCount);
  let cum = 0;
  for (let t = 0; t < triCount; t++) { cum += tris[t * STRIDE + 9] / totalArea; cdf[t] = cum; }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const textH = maxY - minY || 1;
  const scale = 0.7 / textH;  // ~0.7 scene units tall — legible on mobile
  const offsetX = 0.2;        // nudge text slightly right of centre

  const out = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = Math.random();
    let lo = 0, hi = triCount - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cdf[mid] < r) lo = mid + 1; else hi = mid; }
    const base = lo * STRIDE;
    let u = Math.random(), v = Math.random();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const w = 1 - u - v;
    const i3 = i * 3;
    out[i3]     = (w * tris[base]     + u * tris[base + 3] + v * tris[base + 6] - cx) * scale + offsetX;
    out[i3 + 1] = (w * tris[base + 1] + u * tris[base + 4] + v * tris[base + 7] - cy) * scale;
    out[i3 + 2] = 0;
  }
  return out;
}

// ── Pre-baked bin loader ──────────────────────────────────────────────────────
// When public/particles/*.bin exist (generated by scripts/bake-particles.mjs),
// loads them directly—no GLB parsing needed. Falls back to live GLB sampling.

async function tryLoadBin(name) {
  try {
    const res = await fetch(`/particles/${name}.bin`);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return new Float32Array(buf);
  } catch {
    return null;
  }
}

// Resample a Float32Array to exactly N points (repeat / trim)
function resample(src, N) {
  if (src.length === N * 3) return src;
  const out = new Float32Array(N * 3);
  const srcN = src.length / 3;
  for (let i = 0; i < N; i++) {
    const j = (i % srcN) * 3;
    out[i * 3]     = src[j];
    out[i * 3 + 1] = src[j + 1];
    out[i * 3 + 2] = src[j + 2];
  }
  return out;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function loadShapes(N) {
  // Try pre-baked bins first (fast path)
  const [brainBin, scatterBin, bulbBin, earthBin, pathBin, logoBin] = await Promise.all([
    tryLoadBin('brain'), tryLoadBin('scatter'), tryLoadBin('bulb'),
    tryLoadBin('earth'), tryLoadBin('path'),    tryLoadBin('logo'),
  ]);

  const allBaked = brainBin && scatterBin && bulbBin && earthBin && pathBin && logoBin;

  if (allBaked) {
    return {
      brain:   resample(brainBin,   N),
      scatter: resample(scatterBin, N),
      bulb:    resample(bulbBin,    N),
      earth:   resample(earthBin,   N),
      path:    resample(pathBin,    N),
      logo:    resample(logoBin,    N),
    };
  }

  // Fallback: live GLB sampling (slower but always works)
  console.info('[shapes] Pre-baked bins not found, sampling from GLBs…');

  const [brainGLB, bulbGLB, logoGLB, geojson] = await Promise.all([
    loadGLB('/models/brain.glb'),
    loadGLB('/models/lightbulb.glb'),
    loadGLB('/models/metaminds-logo.glb'),
    fetch('/geojson/ne_110m_land.json').then(r => r.json()),
  ]);

  const brain   = sampleSurface(brainGLB.scene, N, 4.5);
  const scatter = buildScatter(brain, N);
  const bulb    = sampleSurface(bulbGLB.scene, N, 4.2);
  const earth   = buildEarth(geojson, N);
  const path    = buildPath(N);
  const logo    = sampleLogoFaces(logoGLB.scene, N);

  return { brain, scatter, bulb, earth, path, logo };
}

// Export PATH_NODES so timeline.js can project them for the DOM labels
export { PATH_NODES };
