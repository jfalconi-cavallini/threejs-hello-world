import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import {
  BRAIN_SAMPLE_OPTIONS,
  modelToParticlePositions,
} from '../src/sample-mesh.js'

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
    // Topology source for the hero / morph brain. Outer-cortex
    // triangle samples off public/models/brain.glb — not a
    // procedural SDF, not a volume fill of cerebellum / internals.
    name: 'brain',
    file: 'brain.glb',
    size: BRAIN_SIZE,
    puff: BRAIN_SAMPLE_OPTIONS.puff,
    options: {
      ...BRAIN_SAMPLE_OPTIONS,
      maxTris: 52000,
    },
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
    BAKE_COUNT,
    job.options
  )
  if (!positions) {
    throw new Error(`${job.name} produced no samples`)
  }
  writeBake(job.name, positions)
}

writeFileSync(
  path.join(outDir, 'manifest.json'),
  `${JSON.stringify({ count: BAKE_COUNT, stride: 3, format: 'f32le' }, null, 2)}\n`
)
