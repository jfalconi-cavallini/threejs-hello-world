/**
 * src/home/index.js — MetaMinds homepage entry point
 *
 * Boot order:
 *   1. CSS loads; boot screen visible immediately — no blank flash.
 *   2. DOM built synchronously: nav + 6 sections + footer. Text is readable.
 *   3. After first paint, load Three.js and GSAP asynchronously.
 *   4. Sample / load particle shapes.
 *   5. Create point cloud, wire timeline, fade canvas in, dismiss boot screen.
 */

import './home.css';
import { showBoot, hideBoot, buildDOM } from './copy.js';

const isMobile       = window.innerWidth < 768;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── 1. Boot screen + DOM (synchronous, before WebGL) ─────────────────────────
const bootEl = showBoot();
const { sections, mentorEls, pathNodeEls } = buildDOM();

// ── 2. Defer heavy imports until after first paint ────────────────────────────
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    bootstrap().catch((err) => {
      console.error('[MetaMinds] Scene init failed:', err);
      hideBoot(bootEl);
    });
  });
});

// ── bootstrap ─────────────────────────────────────────────────────────────────
async function bootstrap() {
  // Parallel async imports — keeps the initial bundle tiny
  const [sceneModule, { loadShapes }, timelineModule, { default: gsap }] =
    await Promise.all([
      import('./scene.js'),
      import('./shapes.js'),
      import('./timeline.js'),
      import('gsap'),
    ]);

  const { init, createParticles, tick, getPoints, getCamera } = sceneModule;
  const { buildTimeline, buildReducedTimeline } = timelineModule;

  // Renderer, scene, camera
  const { renderer, camera } = init();

  // Particle count — mobile gets fewer for 60 fps
  const N = isMobile ? 2500 : 5000;

  // Load all six shape buffers
  const shapes = await loadShapes(N);

  // One THREE.Points with 6 position attributes
  const { material } = createParticles(shapes);
  const points = getPoints();

  // Scroll-driven morph + Lenis (desktop only)
  if (prefersReduced) {
    buildReducedTimeline({ material, sections });
  } else {
    buildTimeline({ material, points, camera, mentorEls, pathNodeEls });
  }

  // Single gsap.ticker loop — no other rAF
  const t0 = performance.now();
  gsap.ticker.fps(60);
  gsap.ticker.add(() => {
    tick((performance.now() - t0) / 1000);
  });

  // Mouse parallax on brain hero (desktop only)
  if (!isMobile && !prefersReduced && points) {
    let mx = 0, my = 0;
    window.addEventListener('pointermove', (e) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 0.20;
      my = (e.clientY / window.innerHeight - 0.5) * 0.14;
    });
    gsap.ticker.add(() => {
      if (!material) return;
      const up = material.uniforms.uProgress.value;
      // Only lean during brain hero (uProgress < 0.5)
      const weight = Math.max(0, 1 - up * 2);
      if (weight > 0 && points) {
        points.rotation.y += (mx * weight - points.rotation.y) * 0.06;
        points.rotation.x += (-my * weight - points.rotation.x) * 0.06;
      }
    });
  }

  // Reveal canvas, hide boot screen
  renderer.domElement.classList.add('is-ready');
  hideBoot(bootEl);

  console.log('[MetaMinds] Ready. N =', N);
}
