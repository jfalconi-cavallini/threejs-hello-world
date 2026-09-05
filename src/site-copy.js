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

export const MENTOR_PREVIEW = [
  { name: 'Jose Falconi-Cavallini', line: 'CS and SAT/ACT.' },
  { name: 'Emma Brugman', line: 'ML, data, and SAT/ACT.' },
  { name: 'Johan Falconi-Cavallini', line: 'Engineering and math.' },
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
      <p class="eyebrow">Testimonials</p>
      <p class="placeholder-note">
        Real parent quotes coming — we don’t invent them.
      </p>
    </section>
  `
}

export function mentorPreviewHtml() {
  return MENTOR_PREVIEW.map(
    (person) => `
      <article class="mentor-card">
        ${mediaPlaceholder('Mentor photo')}
        <h3>${person.name}</h3>
        <p>${person.line}</p>
      </article>
    `
  ).join('')
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
      <article>
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
      <div class="program-grid">${cards}</div>
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
      ${sellList(FAMILY_GETS)}
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
      <p class="page-quiet">
        No average-score theater. Individual student results. Outcomes vary and are not guaranteed.
      </p>
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

export function programmingStemHtml() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Programming &amp; STEM</p>
      <h1>Programming &amp; STEM</h1>
      <p class="page-lead">
        Learn to build with code, robotics, engineering, and real projects.
      </p>
      ${ctaRow()}
    </section>
    <section class="page-block">
      <h2>Projects, not playlists</h2>
      <p>
        Projects a student can point to — not a playlist of videos.
        One dedicated mentor who stays with the work.
      </p>
      ${mediaPlaceholder('Program photo')}
    </section>
    <section class="page-block">
      <h2>What we cover</h2>
      <p>
        Code, robotics, and engineering as real work.
        What’s on the table is matched on the consult — we don’t list a catalog we can’t keep honest.
      </p>
      <p class="page-quiet">
        AI can assist a tutor. It never takes the chair.
      </p>
      ${allProgramsLink()}
    </section>
    ${CHILD_CLOSE}
  `
}

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
        What’s running changes. Ask on the consult — we don’t list a catalog we can’t keep honest.
      </p>
      ${mediaPlaceholder('Group class photo')}
    </section>
    <section class="page-block">
      <h2>When a group fits</h2>
      <p>
        Same standards. Shared goals. Ask what’s running.
      </p>
      <p class="page-quiet">
        We don’t invent seat counts. Ask on the consult what’s running.
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
        Free consult. One dedicated tutor. A plan you can see. Notes after every session.
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
      'Thirty minutes. We figure out whether MetaMinds is the right fit.'
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
      'Book the free consult. No score guarantees. A mentor who stays.'
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
      'The free consult is how we match the work to your child.'
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
