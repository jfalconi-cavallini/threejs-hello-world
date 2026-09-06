import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Offline sample of the three homepage forms. The parent-facing
// boot path ships these Float32 bins (~60KB each) instead of
// decoding lightbulb.glb (14.7MB) / logo.glb (7.6MB) on hard refresh.
const BAKE_COUNT = 5000
const BRAIN_SIZE = 3.2
const LIGHTBULB_SIZE = 4.45
const LOGO_SIZE = 4.6

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'particles')

globalThis.self = globalThis

function readGLB(filePath) {
  const buf = readFileSync(filePath)
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

function rebuildGLBWithoutTextures(arrayBuffer) {
  const view = new DataView(arrayBuffer)
  let offset = 12
  let json = null
  let bin = null

  while (offset + 8 <= arrayBuffer.byteLength) {
    const chunkLength = view.getUint32(offset, true)
    const chunkType = view.getUint32(offset + 4, true)
    offset += 8
    const chunk = arrayBuffer.slice(offset, offset + chunkLength)
    offset += chunkLength

    if (chunkType === 0x4e4f534a) {
      json = JSON.parse(new TextDecoder().decode(new Uint8Array(chunk)))
    } else if (chunkType === 0x004e4942) {
      bin = chunk
    }
  }

  if (!json || !bin) {
    throw new Error('Invalid GLB')
  }

  json.images = []
  json.textures = []
  for (const material of json.materials || []) {
    if (material.pbrMetallicRoughness) {
      delete material.pbrMetallicRoughness.baseColorTexture
      delete material.pbrMetallicRoughness.metallicRoughnessTexture
    }
    delete material.normalTexture
    delete material.occlusionTexture
    delete material.emissiveTexture
  }

  const jsonBytes = new TextEncoder().encode(JSON.stringify(json))
  const jsonPad = (4 - (jsonBytes.length % 4)) % 4
  const jsonChunkLength = jsonBytes.length + jsonPad
  const total = 12 + 8 + jsonChunkLength + 8 + bin.byteLength
  const out = new ArrayBuffer(total)
  const outView = new DataView(out)
  const outBytes = new Uint8Array(out)

  outView.setUint32(0, 0x46546c67, true)
  outView.setUint32(4, 2, true)
  outView.setUint32(8, total, true)
  outView.setUint32(12, jsonChunkLength, true)
  outView.setUint32(16, 0x4e4f534a, true)
  outBytes.set(jsonBytes, 20)
  for (let i = 0; i < jsonPad; i++) {
    outBytes[20 + jsonBytes.length + i] = 0x20
  }
  outView.setUint32(20 + jsonChunkLength, bin.byteLength, true)
  outView.setUint32(24 + jsonChunkLength, 0x004e4942, true)
  outBytes.set(new Uint8Array(bin), 28 + jsonChunkLength)

  return out
}

function parseGLB(filePath) {
  const stripped = rebuildGLBWithoutTextures(readGLB(filePath))

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.parse(stripped, '', resolve, reject)
  })
}

function modelToParticlePositions(model, desiredSize, puffScale, count) {
  model.updateMatrixWorld(true)

  const STRIDE = 10
  const maxTris = Math.max(count * 8, 8000)
  const packed = new Float32Array(maxTris * STRIDE)
  let stored = 0
  let seen = 0
  let totalArea = 0

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

  const writeTri = (slot, area) => {
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
    packed[base + 9] = area
  }

  model.traverse((child) => {
    if (!child.isMesh) return
    const geo = child.geometry
    if (!geo?.attributes?.position) return

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

      seen += 1

      if (stored < maxTris) {
        writeTri(stored, area)
        totalArea += area
        stored += 1
      } else {
        const j = Math.floor(Math.random() * seen)
        if (j < maxTris) {
          totalArea -= packed[j * STRIDE + 9]
          writeTri(j, area)
          totalArea += area
        }
      }

      minX = Math.min(minX, vA.x, vB.x, vC.x)
      minY = Math.min(minY, vA.y, vB.y, vC.y)
      minZ = Math.min(minZ, vA.z, vB.z, vC.z)
      maxX = Math.max(maxX, vA.x, vB.x, vC.x)
      maxY = Math.max(maxY, vA.y, vB.y, vC.y)
      maxZ = Math.max(maxZ, vA.z, vB.z, vC.z)
    }
  })

  if (!stored || totalArea <= 0) {
    throw new Error('Model contained no usable mesh vertices.')
  }

  const cdf = new Float64Array(stored)
  let cumulative = 0
  for (let t = 0; t < stored; t++) {
    cumulative += packed[t * STRIDE + 9] / totalArea
    cdf[t] = cumulative
  }

  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  const centerZ = (minZ + maxZ) / 2
  const scale =
    desiredSize / Math.max(maxX - minX, maxY - minY, maxZ - minZ)

  const output = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const r = Math.random()
    let lo = 0
    let hi = stored - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cdf[mid] < r) lo = mid + 1
      else hi = mid
    }
    const base = lo * STRIDE

    let u = Math.random()
    let v = Math.random()
    if (u + v > 1) {
      u = 1 - u
      v = 1 - v
    }
    const w = 1 - u - v

    const i3 = i * 3
    const px =
      (w * packed[base] +
        u * packed[base + 3] +
        v * packed[base + 6] -
        centerX) *
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

    const puff = (Math.random() - 0.22) * 0.22 * puffScale
    output[i3] = px + nx * puff
    output[i3 + 1] = py + ny * puff
    output[i3 + 2] = pz + nz * puff
  }

  return output
}

function writeBake(name, positions) {
  if (positions.length !== BAKE_COUNT * 3) {
    throw new Error(`${name} bake length ${positions.length}`)
  }

  for (let i = 0; i < positions.length; i++) {
    if (!Number.isFinite(positions[i])) {
      throw new Error(`${name} bake has non-finite values`)
    }
  }

  const file = path.join(outDir, `${name}.f32.bin`)
  writeFileSync(file, Buffer.from(positions.buffer))
  console.log(
    `${name}.f32.bin  ${positions.byteLength} bytes  ${BAKE_COUNT} points`
  )
}

const jobs = [
  {
    // Topology source for the hero / morph brain. Area-weighted
    // triangle samples off public/models/brain.glb — not a
    // procedural cortex SDF.
    name: 'brain',
    file: 'brain.glb',
    size: BRAIN_SIZE,
    puff: 0.18,
  },
  {
    name: 'lightbulb',
    file: 'lightbulb.glb',
    size: LIGHTBULB_SIZE,
    puff: 1,
  },
  {
    name: 'logo',
    file: 'metaminds-logo.glb',
    size: LOGO_SIZE,
    puff: 0.25,
  },
]

mkdirSync(outDir, { recursive: true })

for (const job of jobs) {
  const gltf = await parseGLB(path.join(root, 'public', 'models', job.file))
  const positions = modelToParticlePositions(
    gltf.scene,
    job.size,
    job.puff,
    BAKE_COUNT
  )
  writeBake(job.name, positions)
}

writeFileSync(
  path.join(outDir, 'manifest.json'),
  `${JSON.stringify({ count: BAKE_COUNT, stride: 3, format: 'f32le' }, null, 2)}\n`
)
