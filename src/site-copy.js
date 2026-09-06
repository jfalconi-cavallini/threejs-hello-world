import { ARROW_ICON } from './chrome.js'

export const PATHWAYS = [
  {
    href: '/programs/academic-tutoring',
    title: 'Elementary & Middle School',
    body: 'Build fundamentals, confidence, organization, and strong learning habits.',
  },
  {
    href: '/programs/ap',
    title: 'High School & AP',
    body: 'Keep up with harder coursework, fill gaps, and prepare for what comes next.',
  },
  {
    href: '/programs/sat-act',
    title: 'SAT & ACT',
    body: 'Diagnose weaknesses, build strategy, practice deliberately, and track progress.',
  },
  {
    href: '/programs/programming-stem',
    title: 'Programming & STEM',
    body: 'Learn to build with code, robotics, engineering, and real projects.',
  },
]

export const PROGRAM_HUB_CARDS = [
  {
    href: '/programs/academic-tutoring',
    title: 'Academic Tutoring',
    body: 'Elementary and middle school foundations — math and core academics.',
  },
  {
    href: '/programs/sat-act',
    title: 'SAT & ACT Prep',
    body: 'Diagnose, practice, and track — without average-score theater.',
  },
  {
    href: '/programs/ap',
    title: 'AP & Advanced Courses',
    body: 'Keep up with harder coursework. Fill gaps. Prepare for what’s next.',
  },
  {
    href: '/programs/programming-stem',
    title: 'Programming & STEM',
    body: 'Build with code, robotics, engineering, and real projects.',
  },
  {
    href: '/programs/group-classes',
    title: 'Group Classes',
    body: 'Small groups are separate from 1-on-1. Same standards. Ask what’s running.',
  },
]

export const HOW_IT_WORKS_STEPS = [
  {
    n: '01',
    title: 'Free consultation',
    body: 'Tell us about your child. We listen for goals, gaps, and what a good week looks like for your family.',
  },
  {
    n: '02',
    title: 'Mentor match',
    body: 'We match one dedicated tutor to the coursework — someone who can stay, not a rotating cast.',
  },
  {
    n: '03',
    title: 'Build the plan',
    body: 'You get a clear plan you can actually see: focus areas, practice, and what “better” means next.',
  },
  {
    n: '04',
    title: 'Teach, practice, track',
    body: 'Sessions that teach. Practice matched to the weak spot. Notes and skill tracking so progress isn’t a black box.',
  },
  {
    n: '05',
    title: 'Adjust',
    body: 'When something isn’t sticking, we change the plan — same mentor, clearer next step.',
  },
]

export const HOME_FAQ = [
  {
    q: 'Is tutoring virtual or in person?',
    a: 'Virtual is primary — Zoom from anywhere. In person is available when it fits your family and we have a mentor nearby.',
  },
  {
    q: 'Can I choose the mentor?',
    a: 'We match first so the fit is right for the coursework. If it’s not working, we rematch — you are not stuck.',
  },
  {
    q: 'Is the consult really free?',
    a: 'Yes. Thirty minutes. No pitch theater. We figure out level, hours, and whether MetaMinds is the right fit.',
  },
  {
    q: 'How does scheduling work?',
    a: 'You book sessions with your dedicated tutor around your week. Consistency matters more than packing the calendar.',
  },
  {
    q: 'How do I know what’s happening?',
    a: 'Session notes after every session, skill tracking, and parent updates. You see the plan and the progress.',
  },
  {
    q: 'Can we cover more than one subject?',
    a: 'Yes. One mentor can cover related work, or we add another when the load needs it — still with notes and a plan.',
  },
]

const HOME_MENTOR_RAIL = ['Jose', 'Emma', 'Alan', 'Christian']

export const MENTOR_PREVIEW = [
  {
    name: 'Jose',
    role: 'Founder & Mentor',
    line: 'CS and SAT/ACT.',
    tags: ['Math', 'SAT/ACT', 'Programming'],
    bio: 'UCSD Computer Science. Passionate about helping students break down hard problems and build confidence.',
    initials: 'JF',
    photo: '/mentors/jose.jpg',
  },
  {
    name: 'Emma',
    role: 'Co-Founder',
    line: 'ML, data, and SAT/ACT.',
    tags: ['Science', 'Math', 'College Prep'],
    bio: 'UCSD Neuroscience. Berkeley master’s. Loves helping students understand and enjoy learning.',
    initials: 'EB',
    photo: '/mentors/emma.jpg',
  },
  {
    name: 'Alan',
    role: 'Mentor',
    line: 'Hardware validation engineer. STEM.',
    tags: ['STEM', 'Engineering'],
    bio: 'Hardware validation engineer. STEM.',
    initials: 'AM',
    photo: '/mentors/alan.jpg',
  },
  {
    name: 'Christian',
    role: 'Mentor',
    line: 'Math and CS. MBA candidate.',
    tags: ['Math', 'CS'],
    bio: 'Math and CS. MBA candidate.',
    initials: 'CT',
    photo: '/mentors/christian.jpg',
  },
]

export const GROUP_PREVIEW_CARDS = [
  {
    title: 'SAT small group',
    body: 'Diagnose, practice, and track — without average-score theater.',
  },
  {
    title: 'Programming & STEM group',
    body: 'Build with code, robotics, engineering, and real projects.',
  },
]

const FAMILY_GETS = [
  'One dedicated mentor',
  'Notes after every session',
  'A plan you can actually see',
  'Skill tracking',
  'Parent updates so you’re not left guessing',
]

const ACADEMIC_FAMILY_GETS = [
  'One dedicated mentor',
  'Notes after every session',
  'A plan you can actually see',
  'Practice with feedback, not busywork',
  'Parent updates so you’re not left guessing',
]

export function mediaPlaceholder(label) {
  return `<p class="media-ph">${label} — placeholder until approved.</p>`
}

export function ctaRow() {
  return `
    <div class="hero-actions">
      <a class="primary-button" href="/consult">
        Book Free Consultation
        ${ARROW_ICON}
      </a>
      <a class="hero-secondary-cta" href="/pricing">See mentoring rates</a>
    </div>
  `
}

export function consultBand(title, lead) {
  return `
    <section class="page-cta-band">
      <h2>${title}</h2>
      <p>${lead}</p>
      ${ctaRow()}
    </section>
  `
}

export function ratesLinkHtml() {
  return `<a class="hero-secondary-cta" href="/pricing">See mentoring rates</a>`
}

function sellList(items) {
  return `
    <ul class="promise-list">
      ${items
        .map((item) => `<li>${item}</li>`)
        .join('')}
    </ul>
  `
}

function allProgramsLink() {
  return `<p class="page-quiet"><a href="/programs">All programs</a></p>`
}

const CHILD_CLOSE = consultBand(
  'Ready to match a mentor?',
  'Book the free consult. We’ll take it from there.'
)

function howWeStartBlock() {
  return `
    <section class="page-block">
      <h2>How we start</h2>
      <p>Free consult. We match one dedicated tutor to the coursework.</p>
      <p class="page-quiet">${ratesLinkHtml()}</p>
      ${allProgramsLink()}
    </section>
  `
}

export function pathwayCardsHtml() {
  return PATHWAYS.map(
    (item) => `
      <article class="pathway-card">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
        <a href="${item.href}">View program${ARROW_ICON}</a>
      </article>
    `
  ).join('')
}

export function howItWorksListHtml() {
  return `
    <ol class="steps work-timeline work-timeline--rail">
      ${HOW_IT_WORKS_STEPS.map(
        (step) => `
          <li class="work-step glow-card">
            <span class="work-step-n">${step.n || ''}</span>
            <div>
              <strong>${step.title}</strong>
              <p>${step.body}</p>
            </div>
          </li>
        `
      ).join('')}
    </ol>
  `
}

export function homeFaqHtml() {
  return `
    <dl class="faq-list">
      ${HOME_FAQ.map(
        (item) => `
          <div class="faq-item">
            <dt>${item.q}</dt>
            <dd>${item.a}</dd>
          </div>
        `
      ).join('')}
    </dl>
  `
}

function subjectGlyph(tone) {
  const key = String(tone || '').replace('subject-ico--', '')
  const paths = {
    math: 'M7 7h3v3H7zm7 0h3v3h-3zM7 14h3v3H7zm7 0h3v3h-3zM4 4h16v2H4zm0 14h16v2H4z',
    eng: 'M6 4h5a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H6zm7 0h5v13.5h-5.5A2.5 2.5 0 0 0 16 20V7a3 3 0 0 0-3-3z',
    sci: 'M9 3h6v2h-1l-2 7h4l-5 9-1.2-2.2L13 12H8.8L11 5H9z',
    sat: 'M4 18h3v-6H4zm6.5 0h3V6h-3zM17 18h3v-9h-3z',
    code: 'M8.3 16.3 3.9 12l4.4-4.3L7 6.3 1.7 12 7 17.7zm7.4 0 1.3 1.4L22.3 12 16.99 6.3l-1.3 1.4L20.1 12z',
    ap: 'M12 3 3 8v2h18V8zm-7 9h2v7H5zm5 0h4v7h-4zm7 0h2v7h-2z',
    hw: 'M4 18.5 16.8 5.7l2.5 2.5L6.5 21H4zM18.1 4.4l1.5-1.5 2.5 2.5-1.5 1.5z',
    coach: 'M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm0 2a7 7 0 1 1-7 7 7 7 0 0 1 7-7zm0 3.2 2.4 4.8H9.6z',
    stem: 'M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6zm0 4.2 4.8 2.4V12c0 3.2-2 5.8-4.8 6.8-2.8-1-4.8-3.6-4.8-6.8V8.6z',
  }
  return `<svg class="subject-glyph" viewBox="0 0 24 24"><path fill="currentColor" d="${paths[key] || paths.math}"/></svg>`
}

const SAT_ICO = `<svg class="results-ico-glyph" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 18h3v-6H4zm6.5 0h3V6h-3zM17 18h3v-9h-3z"/></svg>`
const SCHOOL_ICO = `<svg class="results-ico-glyph" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3 1 8l11 5 9-4.09V15h2V8zm-7 9.18V16c0 1.66 3.13 3 7 3s7-1.34 7-3v-3.82l-7 3.18z"/></svg>`
const PARENT_ICO = `<svg class="results-ico-glyph" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 11a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 9 11zm6.5 0A3 3 0 1 0 12.5 8a3 3 0 0 0 3 3zM9 12.5c-3.05 0-7 1.54-7 4.6V19h8.2v-1.4c0-1.3.5-2.4 1.3-3.3C10.6 13 9.8 12.5 9 12.5zm6.5 0c-.4 0-.9 0-1.3.1 1.5.8 2.5 2 2.5 3.5V19H22v-1.9c0-2.4-3.1-3.6-6.5-3.6z"/></svg>`
const CODE_ICO = `<svg class="results-ico-glyph" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8.3 16.3 3.9 12l4.4-4.3L7 6.3 1.7 12 7 17.7zm7.4 0 1.3 1.4L22.3 12 16.99 6.3l-1.3 1.4L20.1 12zM13.1 6.2l-2.2 11.6 1.96.38 2.2-11.6z"/></svg>`

function progressCard({
  ico,
  tone,
  title,
  before,
  after,
  badge,
  body,
  example = false,
}) {
  return `
    <article class="glow-card progress-card">
      ${example ? '<p class="example-tag">Example</p>' : ''}
      <div class="results-frame-head">
        <span class="results-ico ${tone}">${ico}</span>
        <p class="score-kicker">${title}</p>
        <span class="results-badge">${badge}</span>
      </div>
      <p class="before-after">
        <span>Before <strong>${before}</strong></span>
        <span class="before-after-arrow">→</span>
        <span>After <strong class="after-val">${after}</strong></span>
      </p>
      <p>${body}</p>
    </article>
  `
}

export function resultsScoreCardsHtml() {
  return `
    <div class="glow-score-grid progress-2x2">
      ${progressCard({
        ico: SAT_ICO,
        tone: 'results-ico--sat',
        title: 'SAT Math',
        before: '370',
        after: '590',
        badge: '+220',
        body: 'Built a stronger foundation and improved problem solving skills.',
      })}
      ${progressCard({
        ico: SCHOOL_ICO,
        tone: 'results-ico--school',
        title: 'SAT Composite',
        before: '950',
        after: '1110',
        badge: '+160',
        body: 'Increased overall score through targeted practice and strategy.',
      })}
      ${progressCard({
        ico: SCHOOL_ICO,
        tone: 'results-ico--school',
        title: 'AP Calculus',
        before: '3',
        after: '5',
        badge: '+2',
        body: 'Deepened conceptual understanding and improved test performance.',
        example: true,
      })}
      ${progressCard({
        ico: CODE_ICO,
        tone: 'results-ico--sat',
        title: 'Intro to Python',
        before: 'Beginner',
        after: 'Confident',
        badge: 'Built real projects',
        body: 'Went from no experience to building independent projects.',
        example: true,
      })}
    </div>
    <article class="glow-card quote-card quote-card--frame">
      <p class="example-tag">Example</p>
      <p class="quote-mark" aria-hidden="true">“</p>
      <p class="quote-text">My son’s confidence in math has completely changed. He actually looks forward to his sessions, and his grades have improved a lot.</p>
      <p class="quote-by">— Parent of 10th Grade Student</p>
      <div class="quote-nav" aria-hidden="true">
        <span class="quote-nav-btn">‹</span>
        <span class="quote-dots"><i class="is-on"></i><i></i><i></i></span>
        <span class="quote-nav-btn">›</span>
      </div>
    </article>
  `
}

export function resultsFrameHtml() {
  return `
    <article class="glow-card results-frame">
      <div class="results-frame-block">
        <div class="results-frame-head">
          <span class="results-ico results-ico--sat">${SAT_ICO}</span>
          <h3>SAT Prep</h3>
          <span class="results-badge">+220 Math</span>
        </div>
        <p class="score-line">370 → 590</p>
        <p class="score-kicker">SAT Math · individual student result</p>
        <p class="results-frame-sub">SAT Composite 950 → 1110 <span class="results-badge results-badge--ghost">+160</span></p>
        <svg class="results-chart" viewBox="0 0 320 140" role="img" aria-label="SAT Math 370 to 590">
          <defs>
            <linearGradient id="results-frame-sat-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#ff5c00"/>
              <stop offset="1" stop-color="#3d8bff"/>
            </linearGradient>
            <linearGradient id="results-frame-sat-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="rgba(61,139,255,0.28)"/>
              <stop offset="1" stop-color="rgba(61,139,255,0)"/>
            </linearGradient>
          </defs>
          <line x1="24" y1="28" x2="304" y2="28" class="results-chart-grid"/>
          <line x1="24" y1="64" x2="304" y2="64" class="results-chart-grid"/>
          <line x1="24" y1="100" x2="304" y2="100" class="results-chart-grid"/>
          <path d="M24 100 C 90 94, 140 78, 190 52 S 270 30, 296 24" fill="url(#results-frame-sat-fill)" stroke="none"/>
          <path d="M24 100 C 90 94, 140 78, 190 52 S 270 30, 296 24" fill="none" stroke="url(#results-frame-sat-line)" stroke-width="2.6" stroke-linecap="round"/>
          <circle cx="24" cy="100" r="4" fill="#ff5c00"/>
          <text x="24" y="118" class="results-chart-node" text-anchor="middle">370</text>
          <circle cx="296" cy="24" r="4.5" fill="#3d8bff"/>
          <text x="296" y="16" class="results-chart-node" text-anchor="middle">590</text>
        </svg>
      </div>
      <div class="results-frame-block">
        <div class="results-frame-head">
          <span class="results-ico results-ico--school">${SCHOOL_ICO}</span>
          <h3>School Support</h3>
        </div>
        <p>Cleaner work, stronger understanding, more confidence.</p>
        <div class="results-chips">
          <span>Better grades</span>
          <span>More participation</span>
          <span>Higher confidence</span>
        </div>
      </div>
      <div class="results-frame-block">
        <div class="results-frame-head">
          <span class="results-ico results-ico--parent">${PARENT_ICO}</span>
          <h3>Parent Visibility</h3>
        </div>
        <p>Updates after sessions and clear next steps.</p>
        <div class="results-chips">
          <span>Session notes</span>
          <span>Progress tracking</span>
          <span>Action plans</span>
        </div>
      </div>
      <a class="primary-button results-frame-cta" href="/consult">
        Book Free Consultation
        ${ARROW_ICON}
      </a>
    </article>
  `
}

export function resultsStripHtml({ eyebrow = 'Verified' } = {}) {
  return `
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
    <div class="score-grid">
      <article class="score-card">
        <p class="score-kicker">SAT Math</p>
        <p class="score-line">370 → 590</p>
      </article>
      <article class="score-card">
        <p class="score-kicker">SAT Composite</p>
        <p class="score-line">950 → 1110</p>
      </article>
    </div>
    <p class="results-disclaimer">
      SAT Math 370 → 590 · SAT Composite 950 → 1110 · Individual student results. Outcomes vary and are not guaranteed.
    </p>
    ${mediaPlaceholder('Score screenshot')}
  `
}

export function testimonialsPlaceholderHtml() {
  return `
    <section class="page-block" id="testimonials">
      <p class="eyebrow eyebrow-dash">Testimonials</p>
      <h2>What families notice.</h2>
      <p class="placeholder-note">
        Real parent quotes coming — we don’t invent them.
      </p>
    </section>
  `
}

function bookWide(extraClass = '') {
  return `
    <a class="primary-button frame-book ${extraClass}" href="/consult">
      Book Free Consultation
      ${ARROW_ICON}
    </a>
  `
}

function frameScroll() {
  return `
    <div class="frame-scroll" aria-hidden="true">
      <span class="frame-scroll-bar"><i></i></span>
      SCROLL
    </div>
  `
}

function glyph(d) {
  return `<svg class="frame-glyph" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg>`
}

function risingBarsViz() {
  const heights = [26, 36, 47, 59, 70]
  const barW = 10.6
  const step = 14.6
  const base = 74
  const startX = 2.4
  const bars = heights.map((h, i) => {
    const x = startX + i * step
    const y = base - h
    const hatch = []
    for (let yy = y + 0.6; yy < base - 0.4; yy += 1.15) {
      const t = (base - yy) / h
      hatch.push(
        `<rect x="${x + 0.35}" y="${yy.toFixed(2)}" width="${barW - 0.7}" height="0.92" rx="0.32" fill="#e0f2fe" opacity="${(0.16 + t * 0.5).toFixed(2)}"/>`
      )
    }
    return `
      <ellipse class="jose-bar-halo" cx="${x + barW / 2}" cy="${y + 3}" rx="${barW}" ry="7.5" fill="#7dd3fc"/>
      <rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="2.1" fill="url(#ch9-bar)" filter="url(#ch9-grain)"/>
      ${hatch.join('')}
      <ellipse cx="${x + barW / 2}" cy="${y + 1.1}" rx="${barW * 0.46}" ry="2.1" fill="#f0f9ff" opacity="0.95"/>
    `
  }).join('')

  const trail = []
  for (let t = 0; t <= 1.001; t += 0.055) {
    const x = 5 + t * 74
    const y = 68.5 - (t * 0.35 + t * t * 0.65) * 58
    const r = 0.55 + t * 1.25
    trail.push(
      `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r.toFixed(2)}" fill="#ff7a18" opacity="${(0.28 + t * 0.62).toFixed(2)}"/>`
    )
  }

  return `
    <svg class="jose-bars-svg" viewBox="0 0 90 78" aria-hidden="true">
      <defs>
        <linearGradient id="ch9-bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stop-color="#1e3a8a"/>
          <stop offset="0.38" stop-color="#2563eb"/>
          <stop offset="0.74" stop-color="#60a5fa"/>
          <stop offset="1" stop-color="#c4b5fd"/>
        </linearGradient>
        <linearGradient id="ch9-arrow" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#ff3d00"/>
          <stop offset="0.5" stop-color="#ff6a00"/>
          <stop offset="1" stop-color="#ffc38a"/>
        </linearGradient>
        <filter id="ch9-grain" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="3" seed="4" result="n"/>
          <feColorMatrix in="n" type="luminanceToAlpha" result="a"/>
          <feComponentTransfer in="a" result="t">
            <feFuncA type="linear" slope="0.75"/>
          </feComponentTransfer>
          <feFlood flood-color="#9ec5ff" result="c"/>
          <feComposite in="c" in2="t" operator="in" result="g"/>
          <feBlend in="SourceGraphic" in2="g" mode="overlay"/>
        </filter>
        <filter id="ch9-arrow-glow" x="-50%" y="-90%" width="200%" height="260%">
          <feGaussianBlur stdDeviation="1.9" result="b"/>
          <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 0.32 0 0 0  0 0 0 0 0  0 0 0 1.55 0" result="o"/>
          <feMerge>
            <feMergeNode in="o"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <marker id="ch9-head" markerWidth="8.5" markerHeight="8.5" refX="7.2" refY="4.25" orient="auto">
          <path d="M0 0.4 L8.5 4.25 L0 8.1 Z" fill="#ff8a2a"/>
        </marker>
      </defs>
      <ellipse cx="46" cy="62" rx="40" ry="18" fill="#3d8bff" opacity="0.26"/>
      ${bars}
      <g filter="url(#ch9-arrow-glow)">
        ${trail.join('')}
        <path d="M5.5 67.5 Q 36 52 79 9.5" stroke="url(#ch9-arrow)" stroke-width="3.8" stroke-linecap="round" fill="none" marker-end="url(#ch9-head)"/>
      </g>
    </svg>
  `
}

const HIW_ICOS = {
  '01': glyph('M4 4h16v12H7l-3 3zM8 8h8v2H8zm0 4h5v2H8z'),
  '02': glyph('M9 11a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 9 11zm6.5 0A3 3 0 1 0 12.5 8a3 3 0 0 0 3 3zM9 12.5c-3.05 0-7 1.54-7 4.6V19h8.2v-1.4c0-1.3.5-2.4 1.3-3.3C10.6 13 9.8 12.5 9 12.5zm6.5 0c-.4 0-.9 0-1.3.1 1.5.8 2.5 2 2.5 3.5V19H22v-1.9c0-2.4-3.1-3.6-6.5-3.6z'),
  '03': glyph('M6 3h9l5 5v13H6zm9 1.5V9h4.5zM8 12h8v1.5H8zm0 3.5h8V17H8z'),
  '04': glyph('M4 18h3v-6H4zm6.5 0h3V6h-3zM17 18h3v-9h-3z'),
  '05': glyph('M12 6V3L8 7l4 4V8a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z'),
}

const TRAIT_ICOS = [
  ['trait-ico--orange', glyph('M9 11a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 9 11zm6.5 0A3 3 0 1 0 12.5 8a3 3 0 0 0 3 3zM2 19v-1.9C2 14.6 5.95 13 9 13c.8 0 1.6.1 2.3.4-.8.9-1.3 2-1.3 3.3V19zm13.5-6c3.4 0 6.5 1.2 6.5 3.6V19h-5.3v-1.9c0-1.5-1-2.7-2.5-3.5.4-.1.9-.1 1.3-.1z')],
  ['trait-ico--blue', glyph('M12 3 3 8v2h18V8zm-7 9h2v7H5zm5 0h4v7h-4zm7 0h2v7h-2z')],
  ['trait-ico--purple', glyph('M4 18h3v-6H4zm6.5 0h3V6h-3zM17 18h3v-9h-3z')],
  ['trait-ico--pink', glyph('M12 21s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z')],
]

const SUBJECT_BAR = [
  ['Personalized learning plans', glyph('M12 3 3 8v2h18V8zm-7 9h2v7H5zm5 0h4v7h-4zm7 0h2v7h-2z')],
  ['Progress tracking', glyph('M4 18h3v-6H4zm6.5 0h3V6h-3zM17 18h3v-9h-3z')],
  ['Supportive mentors', glyph('M9 11a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 9 11zm6.5 0A3 3 0 1 0 12.5 8a3 3 0 0 0 3 3zM2 19v-1.9C2 14.6 5.95 13 9 13c.8 0 1.6.1 2.3.4-.8.9-1.3 2-1.3 3.3V19z')],
]

export function mentorPreviewHtml({ home = false } = {}) {
  const people = home
    ? MENTOR_PREVIEW.filter((person) => HOME_MENTOR_RAIL.includes(person.name))
    : MENTOR_PREVIEW
  return people.map(
    (person) => `
      <article class="mentor-card glow-card mentor-dir-card">
        <div class="mentor-photo${person.photo ? ' mentor-photo--shot' : ''}" aria-hidden="true">
          ${person.photo
            ? `<img class="mentor-shot" src="${person.photo}" alt="" width="160" height="160">`
            : `<span class="mentor-sil"></span><span class="mentor-initials">${person.initials}</span>`}
        </div>
        <h3>${person.name}</h3>
        <p class="mentor-role">${person.role}</p>
        <div class="mentor-tags">${(person.tags || []).map((tag) => `<span>${tag}</span>`).join('')}</div>
        <p>${person.bio || person.line}</p>
      </article>
    `
  ).join('')
}

export function homeAfterChaptersHtml() {
  const progressBeats = [
    ['Session notes', 'The tutor who taught writes what was covered and what comes next.'],
    ['Skill focus', 'See what’s sticking and what still needs work.'],
    ['Targeted practice', 'Homework matched to the weak spot — not a random worksheet pile.'],
    ['Parent updates', 'Quick updates so you’re not left guessing how tutoring is going.'],
  ]
  const growStages = [
    ['Elementary', 'Build strong foundations and confidence.', 'plant-dot--1', '/frames/ch06-stage1-sprout.png'],
    ['Middle School', 'Strengthen independence, study habits, and core skills.', 'plant-dot--2', '/frames/ch06-stage2-sapling.png'],
    ['High School', 'Tackle advanced classes, AP courses, and test preparation with confidence.', 'plant-dot--3', '/frames/ch06-stage3-young-tree.png'],
    ['College & Beyond', 'Continue growing with support for college courses, career goals, and real-world skills.', 'plant-dot--4', '/frames/ch06-stage4-full-tree.png'],
  ]
  const earlyExamples = [
    ['Middle school math', 'Fractions and algebra readiness compound. Gaps here show up for years.'],
    ['Freshman algebra before the SAT', 'The SAT rewards fluency built early — not a two-week cram over shaky algebra.'],
    ['Coding years early', 'Projects stack. A student who builds for years walks into harder STEM with proof, not hope.'],
  ]
  const frameHow = [
    ['01', 'hiw-n--1', 'Free Consultation', 'We learn about your student, current classes, challenges, goals, and what has or hasn’t worked.'],
    ['02', 'hiw-n--2', 'Mentor Match', 'We match your student with a mentor based on subject, level, personality, goals, and availability.'],
    ['03', 'hiw-n--3', 'Build the Plan', 'Initial sessions help identify strengths, gaps, and priorities. We create a tailored plan.'],
    ['04', 'hiw-n--4', 'Teach, Practice, Track', 'Your student meets regularly, gets targeted practice, and receives detailed session notes and progress tracking.'],
    ['05', 'hiw-n--5', 'Adjust and Grow', 'We review progress, adjust the plan, and keep supporting your student as their goals evolve.'],
  ]
  const mentorTraits = [
    ['Careful Selection', 'Subject knowledge and communication — not a resume with a GPA on it.'],
    ['Subject Expertise', 'Matched by academic level and the work your child needs.'],
    ['Personalized Match', 'Learning style and personality, not whoever is free that week.'],
    ['A Real Relationship', 'Trust and long-term progress. The mentor stays.'],
  ]
  const subjects3 = [
    ['Math', 'Foundations through calculus — concept first, then fluency.', '/programs/academic-tutoring', 'subject-ico--math'],
    ['English', 'Writing, reading, and the language that carries every other class.', '/programs/academic-tutoring', 'subject-ico--eng'],
    ['Science', 'Biology, chemistry, physics — taught so it actually sticks.', '/programs/academic-tutoring', 'subject-ico--sci'],
    ['SAT / ACT Prep', 'Diagnose, practice, and track — without average-score theater.', '/programs/sat-act', 'subject-ico--sat'],
    ['Programming', 'Python, projects, and code a student can point to.', '/programs/programming-stem', 'subject-ico--code'],
    ['AP Support', 'Keep pace with harder coursework. Fill gaps. Walk in ready.', '/programs/ap', 'subject-ico--ap'],
    ['Homework Help', 'Practice with feedback, not busywork.', '/programs/academic-tutoring', 'subject-ico--hw'],
    ['Academic Coaching', 'Habits, organization, and a plan you can see.', '/programs/academic-tutoring', 'subject-ico--coach'],
    ['STEM Enrichment', 'Robotics, engineering, and projects that stack.', '/programs/programming-stem', 'subject-ico--stem'],
  ]

  return `
    <section class="page-block" id="progress">
      <p class="eyebrow eyebrow-dash">Progress</p>
      <h2>Progress you can actually track.</h2>
      <p>
        Notes after every session. Skill focus. Practice that follows the plan. Parent visibility without chasing the tutor.
      </p>
      <div class="glow-grid">
        ${progressBeats.map(([title, body]) => `
          <article class="glow-card">
            <h3>${title}</h3>
            <p>${body}</p>
          </article>
        `).join('')}
      </div>
      <div class="glow-card portal-card" id="parent-portal">
        <p class="example-tag">Preview — not live yet.</p>
        <h3>Parent portal — not live yet.</h3>
        <p>We’re building a clearer home for notes, plans, and updates. A full parent login is not available yet.</p>
        <div class="portal-mock" aria-hidden="true">
          <div class="portal-mock-chrome">
            <span></span><span></span><span></span>
            <em>Parent view</em>
          </div>
          <div class="portal-mock-body">
            <div class="portal-mock-note">
              <strong>Last session</strong>
              <i></i><i></i>
            </div>
            <div class="portal-mock-skills">
              <div><label>Focus</label><b style="--p:72%"></b></div>
              <div><label>Practice</label><b style="--p:54%"></b></div>
              <div><label>Next step</label><b style="--p:81%"></b></div>
            </div>
          </div>
        </div>
        <p>Today the working door is the free consult and direct updates from your mentor — not a self-serve parent login.</p>
        <p><a href="/parents">Parents page</a></p>
      </div>
      ${consultBand(
        'Want progress you can follow?',
        'The consult is where we map the starting point.'
      )}
    </section>

    <section class="home-frame" id="pathways">
      <p class="eyebrow eyebrow-dash">How they grow</p>
      <h2>Support that grows with them<span class="stop">.</span></h2>
      <p>From building foundations to achieving big goals, MetaMinds stays with your child through every stage.</p>
      <div class="grow-rail grow-rail--stages">
        ${growStages.map(([title, body, dot, src], i) => `
          <article class="grow-copy grow-copy--stage${src ? ' is-ready' : ' is-slot'}" data-stage="${i + 1}">
            <div class="plant-stage-frame" aria-hidden="true">
              ${src
                ? `<img class="plant-stage" src="${src}" alt="" width="320" height="320">`
                : `<span class="plant-stage-slot" data-stage="${i + 1}"></span>`}
            </div>
            <span class="plant-dot ${dot}"></span>
            <h3>${title}</h3>
            <p>${body}</p>
          </article>
        `).join('')}
      </div>
      <article class="glow-card partner-card partner-card--icon">
        <span class="partner-ico" aria-hidden="true">${glyph('M4 18h3v-6H4zm6.5 0h3V6h-3zM17 18h3v-9h-3z')}</span>
        <div>
          <p class="score-kicker">A long-term academic partner</p>
          <p class="beat-tagline">Your child’s goals will change. Our support evolves with them. Same mission. Every stage.</p>
        </div>
      </article>
      ${bookWide()}
      ${frameScroll()}
    </section>

    <section class="page-block" id="start-earlier">
      <p class="eyebrow eyebrow-dash">Why start earlier</p>
      <h2>The earlier students build strong habits, the more options they have later.</h2>
      <p>Not panic. Not pressure. Just time used well — so the next course doesn’t assume skills that never landed.</p>
      <div class="glow-grid glow-grid--3">
        ${earlyExamples.map(([title, body]) => `
          <article class="glow-card">
            <h3>${title}</h3>
            <p>${body}</p>
          </article>
        `).join('')}
      </div>
      <p>So they’re prepared for what’s next — not constantly catching up.</p>
      <p class="page-quiet">Individual results vary. We don’t guarantee outcomes.</p>
    </section>

    <section class="home-frame home-frame--hiw" id="how-it-works">
      <p class="eyebrow eyebrow-dash">How it works</p>
      <h2>A clear process from start to progress<span class="stop">.</span></h2>
      <p>We keep things simple, structured, and focused on your student’s goals.</p>
      <span class="jose-viz jose-viz--orbs" aria-hidden="true"></span>
      <ol class="hiw-rail">
        ${frameHow.map(([n, tone, title, body]) => `
          <li class="hiw-step">
            <span class="hiw-n ${tone}">${n}</span>
            <article class="glow-card hiw-card">
              <span class="hiw-ico ${tone}" aria-hidden="true">${HIW_ICOS[n]}</span>
              <div>
                <h3>${title}</h3>
                <p>${body}</p>
              </div>
            </article>
          </li>
        `).join('')}
      </ol>
      <article class="glow-card partner-card partner-card--icon">
        <span class="partner-ico" aria-hidden="true">${glyph('M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3zm.5 4.2v5.3l3.8 2.2-.9 1.5L11 13V7.2z')}</span>
        <div>
          <p class="score-kicker">Same goal at every step.</p>
          <p>More confidence. Better understanding. Real progress.</p>
        </div>
      </article>
      ${bookWide()}
      ${frameScroll()}
    </section>

    <section class="home-frame home-frame--results" id="results">
      <p class="eyebrow eyebrow-dash">Results</p>
      <h2>Progress you can point to<span class="stop">.</span></h2>
      <p>No fake promises. Just consistent work, targeted practice, and measurable improvement parents can actually see.</p>
      ${resultsFrameHtml()}
      ${frameScroll()}
    </section>
    <section class="home-frame home-frame--scores" id="results-more">
      <p class="eyebrow eyebrow-dash">Real student progress</p>
      <div class="score-hero-row">
        <div>
          <h2>Real students.<br>Real progress<span class="stop">.</span></h2>
          <p>With the right support, students gain confidence and reach goals they once thought were out of reach.</p>
        </div>
        <div class="jose-viz jose-viz--bars" aria-hidden="true">
          ${risingBarsViz()}
        </div>
      </div>
      ${resultsScoreCardsHtml()}
      <p class="results-disclaimer">
        Individual results are examples from real MetaMinds students. Outcomes vary and are not guaranteed.
      </p>
      ${bookWide()}
      ${frameScroll()}
    </section>

    <section class="home-frame home-frame--subjects" id="subjects">
      <p class="eyebrow eyebrow-dash">Subjects we offer</p>
      <h2>Support in the subjects that matter<span class="stop">.</span></h2>
      <p>From math to programming, we help students build understanding, confidence, and real skills that last.</p>
      <div class="subject-3x3">
        ${subjects3.map(([title, body, href, tone]) => `
          <a class="glow-card subject-tile" href="${href}">
            <span class="subject-tile-top">
              <span class="subject-ico ${tone}" aria-hidden="true">${subjectGlyph(tone)}</span>
              <span class="subject-go" aria-hidden="true">${ARROW_ICON}</span>
            </span>
            <h3>${title}</h3>
            <p>${body}</p>
          </a>
        `).join('')}
      </div>
      <div class="subject-bar">
        ${SUBJECT_BAR.map(([label, ico]) => `
          <span><em aria-hidden="true">${ico}</em>${label}</span>
        `).join('')}
      </div>
      <div class="skills-next">
        <p class="eyebrow">More than academics</p>
        <h3>Skills for what’s next.</h3>
        <p>Problem-solving and a growth mindset — not just the next assignment.</p>
      </div>
      ${bookWide()}
      ${frameScroll()}
    </section>

    <section class="home-frame home-frame--mentors" id="mentors">
      <p class="eyebrow eyebrow-dash">Our mentors</p>
      <div class="mentor-hero-row">
        <div>
          <h2>The right person matters<span class="stop">.</span></h2>
          <p>We match your student with a mentor who fits their subject, level, goals, and learning style.</p>
        </div>
        <div class="jose-viz jose-viz--pair" aria-hidden="true"></div>
      </div>
      <div class="mentor-traits">
        ${mentorTraits.map(([title, body], i) => `
          <article class="mentor-trait">
            <span class="trait-ico ${TRAIT_ICOS[i][0]}" aria-hidden="true">${TRAIT_ICOS[i][1]}</span>
            <h3>${title}</h3>
            <p>${body}</p>
          </article>
        `).join('')}
      </div>
      <div class="mentor-dir-head">
        <p class="score-kicker mentor-dir-label">Meet a few of our mentors</p>
        <a class="mentor-all" href="/mentors">View all mentors →</a>
      </div>
      <div class="mentor-dir">
        ${mentorPreviewHtml({ home: true })}
      </div>
      <article class="glow-card partner-card partner-card--icon">
        <span class="partner-ico" aria-hidden="true">${TRAIT_ICOS[0][1]}</span>
        <p><strong>More than a tutor.</strong> Our mentors are students, graduates, and professionals who care about your success.</p>
      </article>
      ${bookWide()}
      ${frameScroll()}
    </section>

    <section class="home-frame home-frame--fit" id="group-classes">
      <p class="eyebrow eyebrow-dash">Find the right fit</p>
      <h2>Choose the kind of support that fits<span class="stop">.</span></h2>
      <p>1-on-1 mentoring is the core. Small groups are a separate format — same standards, shared goals.</p>
      <div class="fit-portals" aria-hidden="true">
        <div class="fit-portal fit-portal--one">
          <span class="fit-fig fit-fig--solo"></span>
          <span>1-on-1</span>
        </div>
        <div class="fit-portal fit-portal--group">
          <span class="fit-fig fit-fig--a"></span>
          <span class="fit-fig fit-fig--b"></span>
          <span class="fit-fig fit-fig--c"></span>
          <span>Group</span>
        </div>
      </div>
      <div class="compare-grid compare-grid--fit">
        <article class="glow-card compare-card compare-card--one">
          <span class="compare-ico compare-ico--one" aria-hidden="true">${glyph('M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 1.5c-3.3 0-8 1.7-8 5V20h16v-1.5c0-3.3-4.7-5-8-5z')}</span>
          <h3>1-on-1 Mentoring</h3>
          <p class="score-kicker">Personalized. Flexible. Focused.</p>
          <ul class="compare-list">
            <li>Individualized instruction</li>
            <li>Support with schoolwork</li>
            <li>Targeted test preparation</li>
            <li>Build confidence and study habits</li>
            <li>Flexible scheduling</li>
            <li>Adjusts as goals change</li>
          </ul>
          <a class="fit-link fit-link--one" href="/consult">Learn more${ARROW_ICON}</a>
        </article>
        <article class="glow-card compare-card compare-card--group">
          <span class="compare-ico compare-ico--group" aria-hidden="true">${TRAIT_ICOS[0][1]}</span>
          <h3>Small Group Classes</h3>
          <p class="score-kicker">Learn together. Go further.</p>
          <ul class="compare-list">
            <li>Same standards. Shared goals.</li>
            <li>Structured curriculum</li>
            <li>Great for SAT prep and programming</li>
            <li>Learn with motivated peers</li>
            <li>Engaging and interactive</li>
            <li>Taught by experienced mentors</li>
          </ul>
          <a class="fit-link fit-link--group" href="/programs/group-classes">Explore group classes${ARROW_ICON}</a>
        </article>
      </div>
      <article class="glow-card partner-card partner-card--icon fit-consult">
        <span class="partner-ico" aria-hidden="true">${glyph('M12 3 3 8v2h18V8zm-7 9h2v7H5zm5 0h4v7h-4zm7 0h2v7h-2z')}</span>
        <p>Not sure which is right for your student? We’ll help you decide during your free consultation.</p>
        <a class="fit-consult-link" href="/consult">Book a consultation${ARROW_ICON}</a>
      </article>
      <p class="score-kicker group-topics-label">Common group class topics</p>
      <div class="group-topics group-topics--4">
        <article class="glow-card topic-card">
          <span class="topic-thumb topic-thumb--sat" aria-hidden="true"></span>
          <h3>SAT Prep</h3>
          <p>Strategy, practice, and real progress.</p>
        </article>
        <article class="glow-card topic-card">
          <span class="topic-thumb topic-thumb--code" aria-hidden="true"></span>
          <h3>Programming</h3>
          <p>From beginner to advanced.</p>
        </article>
        <article class="glow-card topic-card">
          <span class="topic-thumb topic-thumb--robot" aria-hidden="true"></span>
          <h3>Robotics &amp; STEM</h3>
          <p>Build, create, problem solve.</p>
        </article>
        <article class="glow-card topic-card">
          <span class="topic-thumb topic-thumb--math" aria-hidden="true"></span>
          <h3>Math Enrichment</h3>
          <p>Stronger foundations and deeper understanding.</p>
        </article>
      </div>
      ${bookWide()}
      ${frameScroll()}
    </section>

    <section class="page-block" id="pricing-preview">
      <p class="eyebrow eyebrow-dash">Pricing</p>
      <h2>Clear rates. The mentor who stays is the point.</h2>
      <p>Rate follows your child’s level. Full numbers on Pricing — not here.</p>
      <div class="chip-row">
        <span class="subject-chip">1-on-1 mentoring</span>
        <span class="subject-chip">Small group programs</span>
        <span class="subject-chip">In-person in select areas</span>
      </div>
      <p class="page-quiet">Want the top mentor band at any age? That’s the College rate — see Pricing.</p>
      <div class="hero-actions">
        <a class="primary-button" href="/consult">Book Free Consultation${ARROW_ICON}</a>
        <a class="hero-secondary-cta" href="/pricing">View Pricing</a>
      </div>
    </section>

    ${testimonialsPlaceholderHtml()}

    <section class="page-block faq-block" id="faq">
      <p class="eyebrow eyebrow-dash">FAQ</p>
      <h2>Questions parents ask</h2>
      ${homeFaqHtml()}
      <p class="page-quiet"><a href="#faq">View all questions</a></p>
    </section>
  `
}

export function groupPreviewCardsHtml() {
  return GROUP_PREVIEW_CARDS.map(
    (item) => `
      <article class="pathway-card">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </article>
    `
  ).join('')
}

export function programHubHtml() {
  const cards = PROGRAM_HUB_CARDS.map(
    (item) => `
      <article class="glow-card">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
        <p><a href="${item.href}">Open program</a></p>
      </article>
    `
  ).join('')

  return `
    <section class="page-hero">
      <p class="eyebrow">Programs</p>
      <h1>Find the work that fits.</h1>
      <p class="page-lead">
        Academic tutoring, SAT &amp; ACT, AP, programming &amp; STEM,
        and small group programs. One dedicated mentor. Notes after
        every session.
      </p>
      ${ctaRow()}
    </section>
    <section class="page-block">
      <div class="program-grid program-grid--glow">${cards}</div>
      <div class="subject-grid">
        <a class="subject-chip" href="/programs/sat-act">SAT</a>
        <a class="subject-chip" href="/programs/sat-act">ACT</a>
        <a class="subject-chip" href="/programs/ap">AP</a>
        <a class="subject-chip" href="/programs/academic-tutoring">Math</a>
        <a class="subject-chip" href="/programs/academic-tutoring">Science</a>
        <a class="subject-chip" href="/programs/academic-tutoring">Writing</a>
        <a class="subject-chip" href="/programs/programming-stem">Coding</a>
      </div>
      <p class="page-quiet">
        Virtual is primary. In person when it fits your family and we have a mentor nearby.
      </p>
    </section>
    ${consultBand(
      'Not sure where to start?',
      'The free consult is how we match the work to your child.'
    )}
  `
}

export function academicTutoringHtml() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Academic Tutoring</p>
      <h1>Elementary &amp; Middle School</h1>
      <p class="page-lead">
        Build fundamentals, confidence, organization, and strong learning habits.
      </p>
      ${ctaRow()}
    </section>
    <section class="page-block">
      <h2>What this is for</h2>
      <p>
        Elementary and middle school foundations — math and core academics.
        Rebuild the foundation before the next course assumes it.
      </p>
      ${mediaPlaceholder('Program photo')}
    </section>
    <section class="page-block">
      <h2>What your family gets</h2>
      ${sellList(ACADEMIC_FAMILY_GETS)}
    </section>
    ${howWeStartBlock()}
    ${CHILD_CLOSE}
  `
}

export function satActHtml() {
  return `
    <section class="page-hero">
      <p class="eyebrow">SAT &amp; ACT Prep</p>
      <h1>SAT &amp; ACT</h1>
      <p class="page-lead">
        Diagnose weaknesses, build strategy, practice deliberately, and track progress.
      </p>
      ${ctaRow()}
    </section>
    <section class="page-block">
      <h2>How we run it</h2>
      <p>
        Diagnose the weak spots, build strategy, practice
        deliberately, and track what moved. One dedicated mentor.
        Notes after every session.
      </p>
    </section>
    <section class="page-block">
      ${resultsStripHtml()}
      <p class="page-quiet">No average-score theater.</p>
    </section>
    <section class="page-block">
      <h2>Virtual first</h2>
      <p>
        Virtual is primary. In person when it fits your family and we have a mentor nearby.
      </p>
      ${allProgramsLink()}
    </section>
    ${CHILD_CLOSE}
  `
}

export function apHtml() {
  return `
    <section class="page-hero">
      <p class="eyebrow">AP &amp; Advanced Courses</p>
      <h1>High School &amp; AP</h1>
      <p class="page-lead">
        Keep up with harder coursework, fill gaps, and prepare for what comes next.
      </p>
      ${ctaRow()}
    </section>
    <section class="page-block">
      <h2>Matched to the course</h2>
      <p>Mentors are matched to the course. Same notes. Same plan you can actually see.</p>
      ${mediaPlaceholder('Program photo')}
    </section>
    <section class="page-block">
      <h2>What “better” looks like</h2>
      <p>
        Keep pace with harder coursework, fill gaps, and walk
        into the next exam or semester more ready. Individual student results.
        Outcomes vary and are not guaranteed.
      </p>
    </section>
    ${howWeStartBlock()}
    ${CHILD_CLOSE}
  `
}

export { programmingStemHtml } from './frame-routes.js'

export function groupClassesHtml() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Group Classes</p>
      <h1>Small group programs</h1>
      <p class="page-lead">
        1-on-1 mentoring is the core. Small group programs are separate — same standards, shared goals.
      </p>
      ${ctaRow()}
    </section>
    <section class="page-block">
      <h2>Honest inventory</h2>
      <p>
        What’s running changes. We won’t list a fake catalog.
      </p>
      ${mediaPlaceholder('Group class photo')}
    </section>
    <section class="page-block">
      <h2>When a group fits</h2>
      <p>
        Same standards. Shared goals. Ask what’s running.
      </p>
      <p class="page-quiet">
        Do not invent seat counts.
      </p>
      ${allProgramsLink()}
    </section>
    ${CHILD_CLOSE}
  `
}

export function howItWorksPageHtml() {
  return `
    <section class="page-hero">
      <p class="eyebrow">How it works</p>
      <h1>How MetaMinds works</h1>
      <p class="page-lead">
        Five clear steps from the first conversation to a plan that keeps moving.
      </p>
      ${ctaRow()}
    </section>
    <section class="page-block">
      ${howItWorksListHtml()}
    </section>
    <section class="page-block">
      <h2>What stays the same</h2>
      <p>
        One dedicated tutor. A plan you can actually see. Notes after every session.
        The mentor stays.
      </p>
    </section>
    <section class="page-block">
      <h2>What we don’t do</h2>
      <p>
        We don’t sell averages or guarantees. We don’t shuffle tutors week to week.
        AI never takes the chair.
      </p>
      <p class="page-quiet">${ratesLinkHtml()}</p>
    </section>
    ${consultBand(
      'Start with the free consult.',
      'Thirty minutes. No obligation. We figure out whether MetaMinds is the right fit.'
    )}
  `
}

export function resultsPageHtml() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Results</p>
      <h1>Real student progress</h1>
      <p class="page-lead">
        Individual student results. Outcomes vary and are not guaranteed.
      </p>
      ${ctaRow()}
    </section>
    <section class="page-block">
      ${resultsStripHtml()}
    </section>
    <section class="page-block">
      <h2>How we talk about progress</h2>
      <p>
        We show individual student results we can stand behind.
        We do not invent SAT averages, percentages, or headcount.
        Individual student results. Outcomes vary and are not guaranteed.
      </p>
    </section>
    <section class="page-block">
      <h2>What families see week to week</h2>
      <p>
        Notes after every session. Skill tracking. Parent updates so you’re not left guessing.
      </p>
    </section>
    ${testimonialsPlaceholderHtml()}
    ${consultBand(
      'Want progress you can follow?',
      'The consult is where we map the starting point.'
    )}
  `
}

export function parentsPageHtml() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Parents</p>
      <h1>How families stay in the loop</h1>
      <p class="page-lead">
        Notes after every session. A plan you can see. The consult is the working door.
      </p>
      ${ctaRow()}
    </section>
    <section class="page-block">
      <h2>What you get now</h2>
      ${sellList(FAMILY_GETS)}
    </section>
    <section class="page-block" id="parent-portal">
      <p class="eyebrow">Parent portal</p>
      <h2>Not live yet.</h2>
      <p>
        Today the working door is the free consult and direct updates from your mentor — not a self-serve parent login.
      </p>
      ${mediaPlaceholder('Parent portal screenshot')}
    </section>
    <section class="page-block">
      <h2>Sign in</h2>
      <p>
        Parent sign-in is not live yet.
        <a href="/login">Sign In</a> is a stub.
        For now, book a consult or email
        <a href="mailto:metamindsstemacademy@gmail.com">metamindsstemacademy@gmail.com</a>.
      </p>
    </section>
    ${consultBand(
      'Questions about how families work with us?',
      'Book the free consult — that’s the working door today.'
    )}
  `
}

export function mentorsPageHtml() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Mentors</p>
      <h1>Mentors who stay.</h1>
      <p class="page-lead">
        The right mentor doesn’t have to live down the street.
        Virtual is primary. In person is available when a tutor is already nearby.
      </p>
      ${ctaRow()}
    </section>
    <section class="page-block">
      <h2>This page is a stub.</h2>
      <p>
        No roster, rates, or mentor ladder here yet.
        Founders are on <a href="/about">About</a>.
        The working door is the free consult.
      </p>
      ${mediaPlaceholder('Mentor photos')}
    </section>
    ${consultBand(
      'Want the right fit?',
      'Book the free consult — that’s the working door today.'
    )}
  `
}

export function loginPageHtml() {
  return `
    <section class="page-hero page-hero--empty">
      <p class="eyebrow">Sign In</p>
      <h1>Parent sign-in is not live yet.</h1>
      <p class="page-lead">
        This is a stub. For now, book a consult or email
        <a href="mailto:metamindsstemacademy@gmail.com">metamindsstemacademy@gmail.com</a>.
      </p>
    </section>
    ${consultBand(
      'Book Free Consultation',
      'Free. 30 minutes. DFW. Zoom.'
    )}
  `
}
