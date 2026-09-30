/**
 * timeline.js
 *
 * Wires Lenis (desktop only) → GSAP ticker → ScrollTrigger → uProgress.
 *
 * uProgress drives the shader morph:
 *   0 = brain | 1 = scatter | 2 = bulb | 3 = earth | 4 = path | 5 = logo
 *
 * Scroll-to-uProgress map (raw scroll progress 0→1):
 *   0.00–0.08  : brain hero hold          (uP = 0)
 *   0.08–0.22  : brain → scatter          (uP 0→1)
 *   0.22–0.36  : scatter hold             (uP = 1)
 *   0.36–0.48  : scatter → bulb           (uP 1→2)
 *   0.48–0.62  : bulb hold                (uP = 2)
 *   0.62–0.72  : bulb → earth             (uP 2→3)
 *   0.72–0.84  : earth hold + spin        (uP = 3)
 *   0.84–0.91  : earth → path             (uP 3→4)
 *   0.91–0.95  : path hold                (uP = 4)
 *   0.95–1.00  : path → logo              (uP 4→5)
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// ── Progress remap ────────────────────────────────────────────────────────────

function remap(p) {
  if (p < 0.08)  return 0;
  if (p < 0.22)  return (p - 0.08) / 0.14;
  if (p < 0.36)  return 1;
  if (p < 0.48)  return 1 + (p - 0.36) / 0.12;
  if (p < 0.62)  return 2;
  if (p < 0.72)  return 2 + (p - 0.62) / 0.10;
  if (p < 0.84)  return 3;
  if (p < 0.91)  return 3 + (p - 0.84) / 0.07;
  if (p < 0.95)  return 4;
  return 4 + (p - 0.95) / 0.05;
}

// ── Earth rotation ────────────────────────────────────────────────────────────

let earthT0 = null;

function tickEarthSpin(p, points) {
  if (!points) return;
  if (p >= 0.72 && p < 0.84) {
    if (earthT0 === null) earthT0 = performance.now();
    points.rotation.y = ((performance.now() - earthT0) / 1000) * 0.28;
  } else {
    earthT0 = null;
    points.rotation.y *= 0.93; // ease back to zero
  }
}

// ── Mentor overlay (CSS positioning) ─────────────────────────────────────────

const MENTORS = [
  { lat:  9.9, lon: -84.1 }, // Jose — San José, CR
  { lat: 51.5, lon:  -0.1 }, // Emma — London
  { lat: 34.0, lon:-118.2 }, // Alan — Los Angeles
];
const EARTH_R = 2.2;

function latLonTo3D(lat, lon) {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -EARTH_R * Math.sin(phi) * Math.cos(theta),
     EARTH_R * Math.cos(phi),
     EARTH_R * Math.sin(phi) * Math.sin(theta),
  );
}

function tickMentors(mentorEls, points, camera, p) {
  if (!mentorEls || !points || !camera) return;
  const show = p >= 0.62 && p < 0.84;

  mentorEls.forEach((el, i) => {
    if (!show) { el.style.opacity = '0'; el.style.pointerEvents = 'none'; return; }
    const w3 = latLonTo3D(MENTORS[i].lat, MENTORS[i].lon);
    w3.applyEuler(points.rotation);
    w3.add(points.position);
    const proj = w3.clone().project(camera);
    if (proj.z > 1) { el.style.opacity = '0'; return; }
    const hw = window.innerWidth / 2, hh = window.innerHeight / 2;
    el.style.opacity       = '1';
    el.style.pointerEvents = 'none';
    el.style.left          = (proj.x * hw + hw) + 'px';
    el.style.top           = (-proj.y * hh + hh) + 'px';
  });
}

// ── Path node highlights ───────────────────────────────────────────────────────

function tickPathNodes(nodeEls, p) {
  if (!nodeEls) return;
  const t = Math.max(0, Math.min(1, (p - 0.91) / 0.04));
  nodeEls.forEach((el, i) => el.classList.toggle('is-active', i < Math.ceil(t * 5)));
}

// ── buildTimeline ─────────────────────────────────────────────────────────────

export function buildTimeline({ material, points, camera, mentorEls, pathNodeEls }) {
  const isMobile      = window.innerWidth < 768;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lenis — desktop only, async import so it doesn't block first paint
  if (!isMobile && !prefersReduced) {
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    });
  }

  ScrollTrigger.create({
    trigger: '#experience',
    start:   'top top',
    end:     'bottom bottom',
    scrub:   isMobile ? 0.3 : 0.8,
    onUpdate(self) {
      const raw = self.progress;
      if (material) material.uniforms.uProgress.value = remap(raw);
      tickEarthSpin(raw, points);
      tickMentors(mentorEls, points, camera, raw);
      tickPathNodes(pathNodeEls, raw);
    },
  });
}

// ── Reduced-motion fallback ───────────────────────────────────────────────────

export function buildReducedTimeline({ material, sections }) {
  const prog = [0, 1, 2, 3, 4, 5];
  sections.forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      onEnter()     { if (material) material.uniforms.uProgress.value = prog[i]; },
      onEnterBack() { if (material) material.uniforms.uProgress.value = prog[i]; },
    });
  });
}
