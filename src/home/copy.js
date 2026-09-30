/**
 * copy.js
 *
 * Builds all DOM structure and wires GSAP line-reveal animations.
 * Returns refs the timeline needs (section elements, mentor overlay divs,
 * path node elements).
 *
 * Layout contract:
 *   Desktop — particles fill the right/left half, copy floats the other half.
 *   Mobile  — particles fill the upper ~45 % of viewport (via CSS), copy
 *             sits in the lower half; they never overlap.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Nav ───────────────────────────────────────────────────────────────────────

function buildNav() {
  const nav = document.createElement('nav');
  nav.className = 'mm-nav';
  nav.setAttribute('aria-label', 'MetaMinds');
  nav.innerHTML = `
    <a class="mm-nav__brand" href="#scene-hero" aria-label="MetaMinds home">
      <img src="/metaminds-logo.png" alt="MetaMinds STEM Academy" class="mm-nav__logo">
    </a>
    <div class="mm-nav__links" role="list">
      <a href="#scene-understand" role="listitem">Subjects</a>
      <a href="#scene-mentors"    role="listitem">Mentors</a>
      <a href="#scene-plan"       role="listitem">The Plan</a>
    </div>
    <a href="#scene-close" class="mm-nav__cta">Book free consultation</a>
    <button class="mm-nav__burger" aria-label="Open menu" aria-expanded="false" aria-controls="mm-nav-drawer">
      <span></span><span></span>
    </button>
    <div class="mm-nav__drawer" id="mm-nav-drawer" aria-hidden="true">
      <a href="#scene-understand">Subjects</a>
      <a href="#scene-mentors">Mentors</a>
      <a href="#scene-plan">The Plan</a>
      <a href="#scene-close" class="mm-nav__cta mm-nav__cta--drawer">Book free consultation</a>
    </div>
  `;
  document.body.appendChild(nav);

  // Burger toggle
  const burger = nav.querySelector('.mm-nav__burger');
  const drawer = nav.querySelector('.mm-nav__drawer');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('nav-open', open);
  });
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
    });
  });
}

// ── Section builder ───────────────────────────────────────────────────────────

function section(id, cls, inner) {
  const s = document.createElement('section');
  s.id = id;
  s.className = 'scene ' + cls;
  s.innerHTML = inner;
  return s;
}

// ── Hero (scene 1) ────────────────────────────────────────────────────────────

function heroHTML() {
  return `
    <div class="copy copy--left">
      <p class="eyebrow">PERSONALIZED TUTORING FOR A BRIGHTER TOMORROW</p>
      <h1 class="split-lines">A mentor who stays with your child.</h1>
      <p class="sub">One dedicated mentor. A plan you can see. Progress you can track.</p>
      <a href="#scene-close" class="btn btn--orange">Book free consultation</a>
    </div>
    <div class="scroll-hint" aria-hidden="true">
      SCROLL<span class="scroll-hint__line"></span>
    </div>
  `;
}

// ── Struggle (scene 2) ────────────────────────────────────────────────────────

function struggleHTML() {
  return `
    <div class="copy copy--center">
      <h2 class="split-lines">Falling behind. Guessing at homework. Tutors who come and go.</h2>
      <p class="sub">Every family knows this feeling.</p>
    </div>
  `;
}

// ── Understanding (scene 3) ───────────────────────────────────────────────────

function understandHTML() {
  return `
    <div class="copy copy--right">
      <p class="eyebrow eyebrow--blue">EVERY SUBJECT. EVERY GRADE.</p>
      <h2 class="split-lines">Understanding changes everything.</h2>
      <p class="sub">SAT. ACT. AP. Math. Science. Writing. Coding. K12 through college.</p>
    </div>
  `;
}

// ── Mentors (scene 4) ─────────────────────────────────────────────────────────

function mentorsHTML() {
  return `
    <div class="copy copy--left">
      <p class="eyebrow eyebrow--blue">OUR TEAM</p>
      <h2 class="split-lines">The right mentor doesn't have to live down the street.</h2>
    </div>
    <div class="mentor-overlay" aria-hidden="true">
      <div class="mentor-pin" id="mentor-jose">
        <img src="/mentors/jose.jpg" alt="Jose" class="mentor-pin__img">
        <span class="mentor-pin__name">Jose</span>
      </div>
      <div class="mentor-pin" id="mentor-emma">
        <img src="/mentors/emma.jpg" alt="Emma" class="mentor-pin__img">
        <span class="mentor-pin__name">Emma</span>
      </div>
      <div class="mentor-pin" id="mentor-alan">
        <img src="/mentors/alan.jpg" alt="Alan" class="mentor-pin__img">
        <span class="mentor-pin__name">Alan</span>
      </div>
    </div>
  `;
}

// ── Plan (scene 5) ────────────────────────────────────────────────────────────

function planHTML() {
  const nodes = ['Consult', 'Match', 'Plan', 'Teach', 'Grow'];
  const nodeItems = nodes.map((n, i) => `
    <div class="path-node" data-index="${i}">
      <div class="path-node__dot"></div>
      <span>${n}</span>
    </div>
  `).join('');

  return `
    <div class="copy copy--left">
      <p class="eyebrow">THE PLAN</p>
      <h2 class="split-lines">A plan you can actually see.</h2>
      <p class="sub">Notes after every session. Skill tracking. Parent updates.</p>
    </div>
    <div class="path-nodes" aria-hidden="true">${nodeItems}</div>
  `;
}

// ── Close (scene 6) ───────────────────────────────────────────────────────────

function closeHTML() {
  return `
    <div class="copy copy--center">
      <h2 class="split-lines">Book a free consultation.</h2>
      <p class="sub">One dedicated mentor. A plan you can see.</p>
      <a href="#" class="btn btn--orange">Book free consultation</a>
    </div>
  `;
}

// ── Line-reveal animation ──────────────────────────────────────────────────────
// Wraps each text line in a clip mask and slides it up on scroll enter.

function revealLines(section) {
  const targets = section.querySelectorAll('.split-lines, .sub, .eyebrow');
  targets.forEach((el) => {
    // Each element slides up from 32px below
    gsap.fromTo(
      el,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          end:   'top 55%',
          scrub: false,
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Button
  const btn = section.querySelector('.btn');
  if (btn) {
    gsap.fromTo(
      btn,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: btn, start: 'top 88%', toggleActions: 'play none none reverse' },
      }
    );
  }
}

// ── Boot / loading screen ─────────────────────────────────────────────────────

export function showBoot() {
  const boot = document.createElement('div');
  boot.id = 'boot-screen';
  boot.innerHTML = `
    <img src="/metaminds-logo.png" alt="MetaMinds" class="boot-logo">
    <p class="boot-loading">Loading</p>
  `;
  document.body.appendChild(boot);
  return boot;
}

export function hideBoot(bootEl) {
  if (!bootEl) return;
  bootEl.classList.add('is-done');
  setTimeout(() => bootEl.remove(), 800);
}

// ── Progress bar ──────────────────────────────────────────────────────────────

export function buildProgressBar() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  ScrollTrigger.create({
    trigger: '#experience',
    start: 'top top',
    end:   'bottom bottom',
    onUpdate: (s) => { bar.style.transform = `scaleX(${s.progress})`; },
  });
}

// ── buildDOM (main export) ─────────────────────────────────────────────────────

export function buildDOM() {
  buildNav();

  const exp = document.createElement('div');
  exp.id = 'experience';

  const scenes = [
    section('scene-hero',       'scene--hero',       heroHTML()),
    section('scene-struggle',   'scene--struggle',   struggleHTML()),
    section('scene-understand', 'scene--understand', understandHTML()),
    section('scene-mentors',    'scene--mentors',    mentorsHTML()),
    section('scene-plan',       'scene--plan',       planHTML()),
    section('scene-close',      'scene--close',      closeHTML()),
  ];

  scenes.forEach(s => exp.appendChild(s));
  document.body.appendChild(exp);

  // Footer
  const footer = document.createElement('footer');
  footer.className = 'mm-footer';
  footer.innerHTML = `
    <span>MetaMinds STEM Academy</span>
    <a href="mailto:hello@metaminds.com">hello@metaminds.com</a>
  `;
  document.body.appendChild(footer);

  buildProgressBar();

  // Wire line reveals after a tick so ScrollTrigger has layout
  requestAnimationFrame(() => {
    scenes.forEach(revealLines);
  });

  // Mentor pin elements
  const mentorEls = [
    document.getElementById('mentor-jose'),
    document.getElementById('mentor-emma'),
    document.getElementById('mentor-alan'),
  ];

  // Path node elements
  const pathNodeEls = Array.from(document.querySelectorAll('.path-node'));

  return { sections: scenes, mentorEls, pathNodeEls };
}
