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

export const HOW_IT_WORKS_STEPS = [
  {
    title: 'Free consult',
    body: 'Tell us about your child. We listen for goals, gaps, and what a good week looks like for your family.',
  },
  {
    title: 'Match a mentor',
    body: 'We match one dedicated tutor to the coursework — someone who can stay, not a rotating cast.',
  },
  {
    title: 'Build the plan',
    body: 'You get a clear plan you can actually see: focus areas, practice, and what “better” means next.',
  },
  {
    title: 'Track the work',
    body: 'Notes after every session. Skill tracking. Parent updates so you’re not left guessing.',
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

export function consultBand(title, lead) {
  return `
    <section class="page-cta-band">
      <h2>${title}</h2>
      <p>${lead}</p>
      <a class="primary-button" href="/consult">
        Book Free Consultation
        ${ARROW_ICON}
      </a>
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
    <ol class="steps">
      ${HOW_IT_WORKS_STEPS.map(
        (step) => `
          <li>
            <strong>${step.title}</strong>
            ${step.body}
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

export function resultsStripHtml() {
  return `
    <p class="eyebrow">Real student progress</p>
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
    <p class="placeholder-note">
      Score screenshot — placeholder until approved.
    </p>
  `
}

export function testimonialsPlaceholderHtml() {
  return `
    <section class="page-block" id="testimonials">
      <p class="eyebrow">Testimonials</p>
      <p class="placeholder-note">
        Placeholder — no testimonials approved yet. We do not invent quotes.
      </p>
    </section>
  `
}
