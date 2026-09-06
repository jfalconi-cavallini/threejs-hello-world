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
    <ol class="steps work-timeline">
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
      <article class="glow-card quote-card">
        <p class="example-tag">Example</p>
        <p class="quote-text">“We finally see the week — not just the hour.”</p>
        <p class="quote-by">A parent — layout placeholder</p>
      </article>
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

export function homeAfterChaptersHtml() {
  const progressBeats = [
    ['Session notes', 'The tutor who taught writes what was covered and what comes next.'],
    ['Skill focus', 'See what’s sticking and what still needs work.'],
    ['Targeted practice', 'Homework matched to the weak spot — not a random worksheet pile.'],
    ['Parent updates', 'Quick updates so you’re not left guessing how tutoring is going.'],
  ]
  const growStages = [
    ['Elementary', 'Build reading, math, and habits while the foundation is still soft.'],
    ['Middle School', 'Keep confidence and organization as coursework gets heavier.'],
    ['High School', 'AP, exams, and harder classes — with a mentor who stays through the climb.'],
    ['College & Beyond', 'College coursework and what comes next — same notes, same plan you can see.'],
  ]
  const earlyExamples = [
    ['Middle school math', 'Fractions and algebra readiness compound. Gaps here show up for years.'],
    ['Freshman algebra before the SAT', 'The SAT rewards fluency built early — not a two-week cram over shaky algebra.'],
    ['Coding years early', 'Projects stack. A student who builds for years walks into harder STEM with proof, not hope.'],
  ]
  const subjects = [
    'SAT', 'ACT', 'AP', 'Math', 'Science', 'Writing', 'Coding',
  ]
  const extraMentors = [
    { name: 'Daniel', line: 'Example mentor card — frame layout.', example: true },
    { name: 'Priya', line: 'Example mentor card — frame layout.', example: true },
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
        <p>Today the working door is the free consult and direct updates from your mentor — not a self-serve parent login.</p>
        <p><a href="/parents">Parents page</a></p>
      </div>
      ${consultBand(
        'Want progress you can follow?',
        'The consult is where we map the starting point.'
      )}
    </section>

    <section class="page-block" id="pathways">
      <p class="eyebrow eyebrow-dash">How students grow</p>
      <h2>Support that can grow with them.</h2>
      <p>One system from the early years through college — not a one-semester patch.</p>
      <div class="grow-rail">
        ${growStages.map(([title, body], i) => `
          <article class="glow-card grow-card">
            <span class="work-step-n">0${i + 1}</span>
            <h3>${title}</h3>
            <p>${body}</p>
          </article>
        `).join('')}
      </div>
      <p class="beat-tagline">The mentor stays. The plan updates. The student keeps moving.</p>
      <p class="page-quiet">K–12 through college. Virtual primary.</p>
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

    <section class="page-block" id="how-it-works">
      <p class="eyebrow eyebrow-dash">How it works</p>
      <h2>How MetaMinds works</h2>
      <p>Five clear steps. One dedicated mentor. A plan you can see.</p>
      ${howItWorksListHtml()}
      <p class="page-quiet"><a href="/how-it-works">How it works</a></p>
      ${consultBand(
        'Start with the free consult.',
        'Thirty minutes. No obligation. We figure out whether MetaMinds is the right fit.'
      )}
    </section>

    <section class="page-block" id="results">
      <p class="eyebrow eyebrow-dash">Results</p>
      <h2>Real student progress</h2>
      <p>Individual student results. Outcomes vary and are not guaranteed.</p>
      <div class="score-grid glow-score-grid">
        <article class="glow-card score-card">
          <p class="score-kicker">SAT Math</p>
          <p class="score-line">370 → 590</p>
          <p class="score-delta">+220</p>
        </article>
        <article class="glow-card score-card">
          <p class="score-kicker">SAT Composite</p>
          <p class="score-line">950 → 1110</p>
          <p class="score-delta">+160</p>
        </article>
        <article class="glow-card score-card">
          <p class="example-tag">Example</p>
          <p class="score-kicker">School support</p>
          <p class="score-line score-line--sm">AP Calc 3 → 5</p>
        </article>
        <article class="glow-card score-card">
          <p class="example-tag">Example</p>
          <p class="score-kicker">Parent visibility</p>
          <p class="score-line score-line--sm">Python beginner → confident</p>
        </article>
      </div>
      <p class="results-disclaimer">
        SAT Math 370 → 590 · SAT Composite 950 → 1110 · Individual student results. Outcomes vary and are not guaranteed.
      </p>
      <p class="page-quiet">We show named outcomes only when they’re real. No averages. No invented quotes.</p>
      <p><a href="/results">See results</a> · <a class="primary-button" href="/consult">Book Free Consultation${ARROW_ICON}</a></p>
    </section>

    <section class="page-block" id="subjects">
      <p class="eyebrow eyebrow-dash">Subjects</p>
      <h2>What we teach</h2>
      <div class="subject-grid">
        ${subjects.map((item) => `<span class="subject-chip">${item}</span>`).join('')}
      </div>
      <p class="page-quiet"><a href="/programs">See programs</a></p>
    </section>

    <section class="page-block" id="mentors">
      <p class="eyebrow eyebrow-dash">Mentors</p>
      <h2>Mentors who stay.</h2>
      <p>Matched to the coursework and the student’s level — not a rotating cast.</p>
      <p>We place mentors by the work your child needs. We don’t sell a public tier ladder.</p>
      <div class="mentor-preview-grid">
        ${mentorPreviewHtml()}
        ${extraMentors.map((person) => `
          <article class="mentor-card glow-card">
            <p class="example-tag">Example</p>
            ${mediaPlaceholder('Mentor photo')}
            <h3>${person.name}</h3>
            <p>${person.line}</p>
          </article>
        `).join('')}
      </div>
      <p><a href="/mentors">Meet our mentors</a></p>
    </section>

    <section class="page-block" id="group-classes">
      <p class="eyebrow eyebrow-dash">Choose your support</p>
      <h2>Choose the support that fits.</h2>
      <p>1-on-1 mentoring is the core. Small groups are separate — same standards, shared goals.</p>
      <div class="compare-grid">
        <article class="glow-card">
          <h3>1-on-1 mentoring</h3>
          <p>One dedicated mentor. A plan you can see. Notes after every session.</p>
        </article>
        <article class="glow-card">
          <h3>Small group programs</h3>
          <p>Small groups are separate from 1-on-1. Same standards. Shared goals. A different format — not a discount track.</p>
        </article>
      </div>
      <p class="page-quiet">What’s running changes. We won’t list a fake catalog.</p>
      <p><a href="/programs/group-classes">Explore group classes</a></p>
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
        Code, robotics, and engineering as real work — projects
        a student can point to, not a playlist of videos.
      </p>
      <p class="page-quiet">
        AI can assist a tutor. It does not replace the mentor or invent the curriculum.
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
