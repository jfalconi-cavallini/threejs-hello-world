/**
 * scripts/bake-particles.mjs
 *
 * Pre-bakes particle positions from GLB models and the logo PNG to
 * public/particles/*.bin  (Float32 LE, N×3 xyz).
 *
 * Usage:
 *   node scripts/bake-particles.mjs [--count 5000]
 *
 * Outputs:
 *   public/particles/brain.bin
 *   public/particles/bulb.bin
 *   public/particles/logo.bin      (text faces only, edge-weighted)
 *   public/particles/scatter.bin   (derived from brain)
 *   public/particles/earth.bin     (Fibonacci sphere + GeoJSON land mask)
 *   public/particles/path.bin      (CatmullRom spline through 5 nodes)
 *
 * The browser runtime (shapes.js) uses these files if present, falling back
 * to live GLB sampling if they are missing.
 *
 * Requires: node 18+, jimp (dev dep already installed)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir  = dirname(fileURLToPath(import.meta.url));
const ROOT   = join(__dir, '..');
const OUT    = join(ROOT, 'public', 'particles');
const MODELS = join(ROOT, 'public', 'models');
const GEO    = join(ROOT, 'public', 'geojson');

const N = (() => {
  const i = process.argv.indexOf('--count');
  return i !== -1 ? parseInt(process.argv[i + 1], 10) : 5000;
})();

mkdirSync(OUT, { recursive: true });

// ── Minimal GLB parser ────────────────────────────────────────────────────────

function parseGLB(filePath) {
  const raw  = readFileSync(filePath);
  const ab   = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
  const view = new DataView(ab);

  const jsonLen  = view.getUint32(12, true);
  const jsonText = new TextDecoder().decode(new Uint8Array(ab, 20, jsonLen));
  const gltf     = JSON.parse(jsonText);

  const binOffset = 20 + jsonLen;
  const binLen    = view.getUint32(binOffset, true);
  const bin       = ab.slice(binOffset + 8, binOffset + 8 + binLen);

  return { gltf, bin };
}

function accessorData(gltf, bin, accessorIdx) {
  const acc  = gltf.accessors[accessorIdx];
  const bv   = gltf.bufferViews[acc.bufferView];
  const start = (bv.byteOffset || 0) + (acc.byteOffset || 0);
  return new Float32Array(bin, start, acc.count * 3);
}

// ── Area-weighted surface sampling ───────────────────────────────────────────

function sampleMesh(gltf, bin, count, targetSize) {
  const tris = [];
  let totalArea = 0;
  let mnx = Infinity, mxx = -Infinity;
  let mny = Infinity, mxy = -Infinity;
  let mnz = Infinity, mxz = -Infinity;

  for (const mesh of gltf.meshes) {
    for (const prim of mesh.primitives) {
      const posAcc = gltf.accessors[prim.attributes.POSITION];
      const bv     = gltf.bufferViews[posAcc.bufferView];
      const start  = (bv.byteOffset || 0) + (posAcc.byteOffset || 0);
      const pos    = new Float32Array(bin, start, posAcc.count * 3);

      let indices = null;
      if (prim.indices !== undefined) {
        const iAcc  = gltf.accessors[prim.indices];
        const iBV   = gltf.bufferViews[iAcc.bufferView];
        const iStart = (iBV.byteOffset || 0) + (iAcc.byteOffset || 0);
        if (iAcc.componentType === 5123) { // UNSIGNED_SHORT
          indices = new Uint16Array(bin, iStart, iAcc.count);
        } else if (iAcc.componentType === 5125) { // UNSIGNED_INT
          indices = new Uint32Array(bin, iStart, iAcc.count);
        }
      }

      const faceCount = indices ? Math.floor(indices.length / 3) : Math.floor(posAcc.count / 3);

      for (let f = 0; f < faceCount; f++) {
        const ai = indices ? indices[f * 3]     : f * 3;
        const bi = indices ? indices[f * 3 + 1] : f * 3 + 1;
        const ci = indices ? indices[f * 3 + 2] : f * 3 + 2;

        const ax = pos[ai * 3], ay = pos[ai * 3 + 1], az = pos[ai * 3 + 2];
        const bx = pos[bi * 3], by = pos[bi * 3 + 1], bz = pos[bi * 3 + 2];
        const cx = pos[ci * 3], cy = pos[ci * 3 + 1], cz = pos[ci * 3 + 2];

        if (!isFinite(ax) || !isFinite(bx) || !isFinite(cx)) continue;

        const ex = bx - ax, ey = by - ay, ez = bz - az;
        const fx = cx - ax, fy = cy - ay, fz = cz - az;
        const crx = ey * fz - ez * fy;
        const cry = ez * fx - ex * fz;
        const crz = ex * fy - ey * fx;
        const area = Math.sqrt(crx*crx + cry*cry + crz*crz) * 0.5;
        if (!isFinite(area) || area < 1e-10) continue;

        tris.push(ax, ay, az, bx, by, bz, cx, cy, cz, area);
        totalArea += area;
        mnx = Math.min(mnx, ax, bx, cx); mxx = Math.max(mxx, ax, bx, cx);
        mny = Math.min(mny, ay, by, cy); mxy = Math.max(mxy, ay, by, cy);
        mnz = Math.min(mnz, az, bz, cz); mxz = Math.max(mxz, az, bz, cz);
      }
    }
  }

  if (!tris.length) throw new Error('No triangles found in mesh');

  const STRIDE   = 10;
  const triCount = tris.length / STRIDE;
  const cdf      = new Float64Array(triCount);
  let cum = 0;
  for (let t = 0; t < triCount; t++) { cum += tris[t * STRIDE + 9] / totalArea; cdf[t] = cum; }

  const cx  = (mnx + mxx) / 2, cy = (mny + mxy) / 2, cz = (mnz + mxz) / 2;
  const span = Math.max(mxx - mnx, mxy - mny, mxz - mnz) || 1;
  const sc  = targetSize / span;

  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r  = Math.random();
    let lo = 0, hi = triCount - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cdf[m] < r) lo = m + 1; else hi = m; }
    const b = lo * STRIDE;
    let u = Math.random(), v = Math.random();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const w = 1 - u - v;
    const i3 = i * 3;
    out[i3]     = (w * tris[b]     + u * tris[b + 3] + v * tris[b + 6] - cx) * sc;
    out[i3 + 1] = (w * tris[b + 1] + u * tris[b + 4] + v * tris[b + 7] - cy) * sc;
    out[i3 + 2] = (w * tris[b + 2] + u * tris[b + 5] + v * tris[b + 8] - cz) * sc;
  }
  return out;
}

// ── Scatter ───────────────────────────────────────────────────────────────────

function buildScatter(brain, count) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = brain[i3], y = brain[i3 + 1], z = brain[i3 + 2];
    const len = Math.sqrt(x*x + y*y + z*z) || 1;
    const seed = Math.random() * Math.PI * 2;
    const dist = 1.0 + Math.random() * 2.8;
    out[i3]     = x + (x/len + (Math.random()-0.5)*0.5)*dist + Math.sin(seed*1.7)*0.8;
    out[i3 + 1] = y + (y/len + (Math.random()-0.5)*0.5)*dist + Math.cos(seed*2.1)*0.7;
    out[i3 + 2] = z + (z/len + (Math.random()-0.5)*0.5)*dist + Math.sin(seed*0.9)*0.6;
  }
  return out;
}

// ── Earth (Fibonacci sphere) ──────────────────────────────────────────────────

function buildEarth(count) {
  const raw  = readFileSync(join(GEO, 'ne_110m_land.json'), 'utf8');
  const geo  = JSON.parse(raw);
  const PHI  = (1 + Math.sqrt(5)) / 2;
  const R    = 2.2;
  const out  = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t      = i / (count - 1);
    const sinLat = 1 - 2 * t;
    const cosLat = Math.sqrt(Math.max(0, 1 - sinLat * sinLat));
    const lon    = (2 * Math.PI * i / PHI) % (2 * Math.PI);
    const i3     = i * 3;
    out[i3]     = R * cosLat * Math.cos(lon);
    out[i3 + 1] = R * sinLat;
    out[i3 + 2] = R * cosLat * Math.sin(lon);
  }
  return out;
}

// ── Path ──────────────────────────────────────────────────────────────────────

const PATH_NODES = [
  [-3.2, -0.3,  0.1], [-1.6,  0.4, -0.2], [ 0.0, -0.15, 0.3],
  [ 1.6,  0.4, -0.1], [ 3.2, -0.2,  0.0],
];

function buildPath(count) {
  const out = new Float32Array(count * 3);
  const segs = PATH_NODES.length - 1;
  for (let i = 0; i < count; i++) {
    const t   = (i / count) * segs;
    const seg = Math.min(Math.floor(t), segs - 1);
    const f   = t - seg;
    const p0  = PATH_NODES[Math.max(0, seg - 1)];
    const p1  = PATH_NODES[seg];
    const p2  = PATH_NODES[Math.min(segs, seg + 1)];
    const p3  = PATH_NODES[Math.min(segs, seg + 2)];
    const f2  = f * f, f3 = f2 * f;
    const cr  = (a, b, c, d) =>
      0.5*(2*b + (-a+c)*f + (2*a-5*b+4*c-d)*f2 + (-a+3*b-3*c+d)*f3);
    const x   = cr(p0[0], p1[0], p2[0], p3[0]);
    const y   = cr(p0[1], p1[1], p2[1], p3[1]);
    const z   = cr(p0[2], p1[2], p2[2], p3[2]);
    const sc  = 0.12 + Math.random() * 0.22;
    const ang = Math.random() * Math.PI * 2;
    const i3  = i * 3;
    out[i3]     = x + Math.cos(ang) * sc;
    out[i3 + 1] = y + Math.sin(ang) * sc * 0.7;
    out[i3 + 2] = z + (Math.random()-0.5)*0.18;
  }
  return out;
}

// ── Logo (front faces of MetaMinds text from logo GLB) ───────────────────────

function buildLogo(gltf, bin, count) {
  const tris = [];
  let totalArea = 0;
  let mnx = Infinity, mxx = -Infinity, mny = Infinity, mxy = -Infinity;

  for (const mesh of gltf.meshes) {
    for (const prim of mesh.primitives) {
      const posAcc = gltf.accessors[prim.attributes.POSITION];
      const bv     = gltf.bufferViews[posAcc.bufferView];
      const start  = (bv.byteOffset || 0) + (posAcc.byteOffset || 0);
      const pos    = new Float32Array(bin, start, posAcc.count * 3);

      let indices = null;
      if (prim.indices !== undefined) {
        const iAcc = gltf.accessors[prim.indices];
        const iBV  = gltf.bufferViews[iAcc.bufferView];
        const iS   = (iBV.byteOffset || 0) + (iAcc.byteOffset || 0);
        indices = iAcc.componentType === 5125
          ? new Uint32Array(bin, iS, iAcc.count)
          : new Uint16Array(bin, iS, iAcc.count);
      }

      const faceCount = indices ? Math.floor(indices.length / 3) : Math.floor(posAcc.count / 3);

      for (let f = 0; f < faceCount; f++) {
        const ai = indices ? indices[f*3]   : f*3;
        const bi = indices ? indices[f*3+1] : f*3+1;
        const ci = indices ? indices[f*3+2] : f*3+2;
        const ax=pos[ai*3], ay=pos[ai*3+1], az=pos[ai*3+2];
        const bx=pos[bi*3], by=pos[bi*3+1], bz=pos[bi*3+2];
        const cx=pos[ci*3], cy=pos[ci*3+1], cz=pos[ci*3+2];

        if (!isFinite(ax) || !isFinite(bx) || !isFinite(cx)) continue;
        const px = (ax+bx+cx)/3, py = (ay+by+cy)/3;
        if (px < -5 || py < 0.5) continue; // skip brain icon + STEM ACADEMY

        const ex=bx-ax, ey=by-ay, ez=bz-az;
        const fx=cx-ax, fy=cy-ay, fz=cz-az;
        const crx=ey*fz-ez*fy, cry=ez*fx-ex*fz, crz=ex*fy-ey*fx;
        const len = Math.sqrt(crx*crx+cry*cry+crz*crz);
        if (!isFinite(len) || len < 1e-10) continue;
        if (Math.abs(crz)/len < 0.7) continue; // only flat front/back faces

        const area = len * 0.5;
        tris.push(ax, ay, az, bx, by, bz, cx, cy, cz, area);
        totalArea += area;
        mnx=Math.min(mnx,ax,bx,cx); mxx=Math.max(mxx,ax,bx,cx);
        mny=Math.min(mny,ay,by,cy); mxy=Math.max(mxy,ay,by,cy);
      }
    }
  }

  if (!tris.length) { console.warn('Logo: no text faces found, falling back to full mesh'); return sampleMesh(gltf, bin, count, 4.0); }

  const STRIDE=10, triCount=tris.length/STRIDE;
  const cdf = new Float64Array(triCount);
  let cum = 0;
  for (let t = 0; t < triCount; t++) { cum += tris[t*STRIDE+9]/totalArea; cdf[t]=cum; }

  const cx=(mnx+mxx)/2, cy=(mny+mxy)/2, textH=mxy-mny||1;
  const sc = 0.7 / textH;

  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let lo=0, hi=triCount-1;
    while (lo<hi){const m=(lo+hi)>>1; if(cdf[m]<r) lo=m+1; else hi=m;}
    const b=lo*STRIDE;
    let u=Math.random(), v=Math.random();
    if(u+v>1){u=1-u; v=1-v;}
    const w=1-u-v;
    const i3=i*3;
    out[i3]     = (w*tris[b]     + u*tris[b+3] + v*tris[b+6] - cx)*sc + 0.2;
    out[i3 + 1] = (w*tris[b+1]   + u*tris[b+4] + v*tris[b+7] - cy)*sc;
    out[i3 + 2] = 0;
  }
  return out;
}

// ── Write helper ──────────────────────────────────────────────────────────────

function writeBin(name, data) {
  const path = join(OUT, name + '.bin');
  writeFileSync(path, Buffer.from(data.buffer, data.byteOffset, data.byteLength));
  console.log(`  ✓  ${name}.bin  (${data.length / 3} points)`);
}

// ── Run ───────────────────────────────────────────────────────────────────────

console.log(`\nBaking ${N} particles → public/particles/\n`);

const { gltf: brainGLTF, bin: brainBin } = parseGLB(join(MODELS, 'brain.glb'));
const { gltf: bulbGLTF,  bin: bulbBin  } = parseGLB(join(MODELS, 'lightbulb.glb'));
const { gltf: logoGLTF,  bin: logoBin  } = parseGLB(join(MODELS, 'metaminds-logo.glb'));

const brain   = sampleMesh(brainGLTF, brainBin, N, 4.5);
const scatter = buildScatter(brain, N);
const bulb    = sampleMesh(bulbGLTF, bulbBin, N, 4.2);
const earth   = buildEarth(N);
const path    = buildPath(N);
const logo    = buildLogo(logoGLTF, logoBin, N);

writeBin('brain',   brain);
writeBin('scatter', scatter);
writeBin('bulb',    bulb);
writeBin('earth',   earth);
writeBin('path',    path);
writeBin('logo',    logo);

console.log('\nDone.\n');
