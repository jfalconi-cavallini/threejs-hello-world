import { mountPage } from '../page-shell.js'
import { PROGRAM_LINKS } from '../chrome.js'
import {
  consultBand,
  homeFaqHtml,
  howItWorksListHtml,
  resultsStripHtml,
} from '../site-copy.js'

function programHubHtml() {
  const cards = PROGRAM_LINKS.map(
    (item) => `
      <article>
        <h3>${item.label}</h3>
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
    </section>
    <section class="page-block">
      <div class="program-grid">${cards}</div>
    </section>
    ${consultBand(
      'Not sure where to start?',
      'The free consult is how we match the work to your child.'
    )}
  `
}

function programPage({ eyebrow, title, lead, body }) {
  return `
    <section class="page-hero">
      <p class="eyebrow">${eyebrow}</p>
      <h1>${title}</h1>
      <p class="page-lead">${lead}</p>
    </section>
    <section class="page-block">
      ${body}
      <p class="page-quiet"><a href="/programs">All programs</a></p>
    </section>
    ${consultBand(
      'Ready to match a mentor?',
      'Book the free consult. We’ll take it from there.'
    )}
  `
}

const pages = {
  programs: {
    nav: 'programs',
    html: programHubHtml(),
  },
  'academic-tutoring': {
    nav: 'programs',
    html: programPage({
      eyebrow: 'Academic Tutoring',
      title: 'Elementary & Middle School',
      lead: 'Build fundamentals, confidence, organization, and strong learning habits.',
      body: `
        <p>Math and core academics. Rebuild the foundation before the next course assumes it. One dedicated mentor. Notes after every session.</p>
      `,
    }),
  },
  'sat-act': {
    nav: 'programs',
    html: programPage({
      eyebrow: 'SAT & ACT Prep',
      title: 'SAT & ACT',
      lead: 'Diagnose weaknesses, build strategy, practice deliberately, and track progress.',
      body: `
        <p>No average-score theater. The progress we can show today:</p>
        ${resultsStripHtml()}
      `,
    }),
  },
  ap: {
    nav: 'programs',
    html: programPage({
      eyebrow: 'AP & Advanced Courses',
      title: 'High School & AP',
      lead: 'Keep up with harder coursework, fill gaps, and prepare for what comes next.',
      body: `
        <p>Mentors are matched to the course. Same notes. Same plan you can actually see.</p>
      `,
    }),
  },
  'programming-stem': {
    nav: 'programs',
    html: programPage({
      eyebrow: 'Programming & STEM',
      title: 'Programming & STEM',
      lead: 'Learn to build with code, robotics, engineering, and real projects.',
      body: `
        <p>Projects a student can point to — not a playlist of videos. One dedicated mentor who stays with the work.</p>
      `,
    }),
  },
  'group-classes': {
    nav: 'programs',
    html: programPage({
      eyebrow: 'Group Classes',
      title: 'Small group programs',
      lead: '1-on-1 mentoring is the core. Small group programs are separate — same standards, shared goals.',
      body: `
        <p>What’s running changes. Ask on the consult — we don’t list a catalog we can’t keep honest.</p>
      `,
    }),
  },
  'how-it-works': {
    nav: 'how-it-works',
    html: `
      <section class="page-hero">
        <p class="eyebrow">How it works</p>
        <h1>How MetaMinds works</h1>
        <p class="page-lead">
          Free consult. One dedicated tutor. A plan you can see. Notes after every session.
        </p>
      </section>
      <section class="page-block">
        ${howItWorksListHtml()}
      </section>
      ${consultBand(
        'Start with the free consult.',
        'Thirty minutes. We figure out whether MetaMinds is the right fit.'
      )}
    `,
  },
  results: {
    nav: 'results',
    html: `
      <section class="page-hero">
        <p class="eyebrow">Results</p>
        <h1>Real student progress</h1>
        <p class="page-lead">
          Individual results vary.
        </p>
      </section>
      <section class="page-block">
        ${resultsStripHtml()}
      </section>
      <section class="page-block" id="testimonials">
        <p class="eyebrow">Testimonials</p>
        <p class="placeholder-note">
          Placeholder — no testimonials approved yet. We do not invent quotes.
        </p>
      </section>
      ${consultBand(
        'Want the same kind of plan?',
        'Book the free consult. No score guarantees. A mentor who stays.'
      )}
    `,
  },
  login: {
    nav: 'login',
    html: `
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
    `,
  },
  parents: {
    nav: 'parents',
    html: `
      <section class="page-hero page-hero--empty">
        <p class="eyebrow">Parents</p>
        <h1>A page for families — not live yet.</h1>
        <p class="page-lead">
          This is a stub. The consult is the working door.
        </p>
      </section>
      ${consultBand(
        'Book Free Consultation',
        'Tell us about your child. We’ll take it from there.'
      )}
    `,
  },
}

const spec = pages[document.body.dataset.page]

if (!spec) {
  mountPage({
    page: 'not-found',
    html: `
      <section class="page-hero page-hero--empty">
        <p class="eyebrow">404</p>
        <h1>This page is not on the preview.</h1>
      </section>
    `,
  })
} else {
  mountPage({
    page: spec.nav,
    html: spec.html,
  })
}
