import * as THREE from 'three';

// ── Vertex shader ─────────────────────────────────────────────────────────────
const VERT = /* glsl */`
precision highp float;

// Shape targets uploaded as attributes so ALL morphing lives on the GPU.
// "position" built-in  →  shape 0 (brain)
attribute vec3 aScatter; //  shape 1
attribute vec3 aBulb;    //  shape 2
attribute vec3 aEarth;   //  shape 3
attribute vec3 aPath;    //  shape 4
attribute vec3 aLogo;    //  shape 5

attribute float aRand;   // [0,1] per-particle randomness
attribute float aDelay;  // [0,1] stagger offset

uniform float uProgress; // 0.0 – 5.0  (driven by GSAP scroll)
uniform float uTime;
uniform float uSize;     // base point size in pixels

varying vec3  vColor;
varying float vAlpha;

// ── helpers ───────────────────────────────────────────────────────────────────

float smoothS(float t) {
  return t * t * (3.0 - 2.0 * t);
}

// Per-particle staggered local progress (0→1) for a raw morph value
float stagger(float raw) {
  // each particle starts a little later, scaled so the last one still
  // finishes at raw = 1.0
  float maxDelay = 0.28;
  float t = (raw - aDelay * maxDelay) / (1.0 - maxDelay);
  return smoothS(clamp(t, 0.0, 1.0));
}

// Dynamically pick one of the six positions by index (GLSL has no array index
// on attributes, so we use a chain of mix/step)
vec3 shapePos(int idx) {
  if (idx == 0) return position;
  if (idx == 1) return aScatter;
  if (idx == 2) return aBulb;
  if (idx == 3) return aEarth;
  if (idx == 4) return aPath;
  return aLogo;
}

// ── main ──────────────────────────────────────────────────────────────────────

void main() {
  float prog  = clamp(uProgress, 0.0, 5.0);
  int   from  = int(floor(prog));
  float rawT  = fract(prog);
  float t     = stagger(rawT);

  vec3 p = mix(shapePos(from), shapePos(from + 1), t);

  // Gentle per-particle breathing so the cloud never looks frozen
  float phase = aRand * 6.2831;
  p.x += sin(uTime * 0.55 + phase)        * 0.018;
  p.y += cos(uTime * 0.43 + phase * 0.7)  * 0.014;
  p.z += sin(uTime * 0.31 + phase * 1.3)  * 0.012;

  // ── color ────────────────────────────────────────────────────────────────
  vec3 blue  = vec3(0.18, 0.44, 1.00);
  vec3 cyan  = vec3(0.00, 0.82, 0.95);
  vec3 white = vec3(1.00, 1.00, 1.00);

  // Vary hue across particles; ~8 % become white highlights
  float isWhite = step(0.92, aRand);
  vColor = mix(mix(blue, cyan, fract(aRand * 3.7)), white, isWhite);
  vAlpha = 0.55 + 0.45 * aRand;

  // ── size & projection ─────────────────────────────────────────────────────
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize / -mv.z;
  gl_Position  = projectionMatrix * mv;
}
`;

// ── Fragment shader ───────────────────────────────────────────────────────────
const FRAG = /* glsl */`
precision mediump float;
varying vec3  vColor;
varying float vAlpha;

void main() {
  vec2  uv = gl_PointCoord - 0.5;
  float d  = dot(uv, uv);          // 0 at center, 0.25 at edge
  if (d > 0.25) discard;

  // Soft glow: bright core, soft corona
  float alpha = 1.0 - smoothstep(0.06, 0.25, d);
  gl_FragColor = vec4(vColor, alpha * vAlpha);
}
`;

// ── Module state ──────────────────────────────────────────────────────────────

let renderer, scene, camera, points;
export let material = null;

// ── init ──────────────────────────────────────────────────────────────────────

export function init() {
  const isMobile = window.innerWidth < 768;

  renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = 'scene-canvas';
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05070c);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 6.5;

  window.addEventListener('resize', onResize);

  return { renderer, scene, camera };
}

// ── createParticles ───────────────────────────────────────────────────────────

export function createParticles(shapes) {
  const N = shapes.brain.length / 3;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position',  new THREE.BufferAttribute(shapes.brain,   3));
  geo.setAttribute('aScatter',  new THREE.BufferAttribute(shapes.scatter, 3));
  geo.setAttribute('aBulb',     new THREE.BufferAttribute(shapes.bulb,    3));
  geo.setAttribute('aEarth',    new THREE.BufferAttribute(shapes.earth,   3));
  geo.setAttribute('aPath',     new THREE.BufferAttribute(shapes.path,    3));
  geo.setAttribute('aLogo',     new THREE.BufferAttribute(shapes.logo,    3));

  const rands  = new Float32Array(N);
  const delays = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    rands[i]  = Math.random();
    delays[i] = Math.random();
  }
  geo.setAttribute('aRand',  new THREE.BufferAttribute(rands,  1));
  geo.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1));

  const isMobile = window.innerWidth < 768;

  material = new THREE.ShaderMaterial({
    vertexShader:   VERT,
    fragmentShader: FRAG,
    transparent:    true,
    depthWrite:     false,
    blending:       THREE.AdditiveBlending,
    uniforms: {
      uProgress: { value: 0.0 },
      uTime:     { value: 0.0 },
      uSize:     { value: isMobile ? 90 : 160 },
    },
  });

  points = new THREE.Points(geo, material);
  scene.add(points);

  return { points, material };
}

// ── tick (called from gsap.ticker) ────────────────────────────────────────────

export function tick(elapsedSeconds) {
  if (material) material.uniforms.uTime.value = elapsedSeconds;
  if (renderer && scene && camera) renderer.render(scene, camera);
}

// ── getters used by timeline ──────────────────────────────────────────────────

export function getPoints()   { return points; }
export function getCamera()   { return camera; }
export function getRenderer() { return renderer; }

// ── resize ────────────────────────────────────────────────────────────────────

function onResize() {
  if (!renderer) return;
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, w < 768 ? 1.0 : 1.5));
}
