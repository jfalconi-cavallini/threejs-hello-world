import {
  consultBand,
  homeFaqHtml,
  howItWorksListHtml,
  pathwayCardsHtml,
  resultsStripHtml,
  testimonialsPlaceholderHtml,
} from './site-copy.js'

export function createHomeAfter() {
  const after = document.createElement('div')
  after.className = 'home-after'
  after.innerHTML = `
    <div class="home-after-inner site-shell">
      <section class="page-block" id="pathways">
        <p class="eyebrow">How they grow</p>
        <h2>Support that can grow with them.</h2>
        <p>
          The earlier students build strong habits, the more options
          they have later. No fear. No guarantees.
        </p>
        <div class="pathway-grid">
          ${pathwayCardsHtml()}
        </div>
      </section>

      <section class="page-block" id="how-it-works">
        <h2>How MetaMinds works</h2>
        ${howItWorksListHtml()}
      </section>

      <section class="page-block" id="results">
        ${resultsStripHtml()}
      </section>

      <section class="page-block" id="parent-portal">
        <p class="eyebrow">Parent portal</p>
        <h2>A portal for families — not live yet.</h2>
        <p class="placeholder-note">
          Placeholder. Sign-in is a stub. The consult is the working door.
        </p>
        <p><a href="/parents">Parents page</a> · <a href="/login">Sign In</a></p>
      </section>

      <section class="page-block" id="mentors">
        <p class="eyebrow">Mentors</p>
        <h2>Mentors who stay.</h2>
        <p>
          One dedicated tutor matched to the coursework. Same notes.
          Same system. No public cheap-to-expensive mentor ladder.
        </p>
        <p><a href="/about#founders">Meet the people building it</a></p>
      </section>

      <section class="page-block" id="group-classes">
        <p class="eyebrow">Group classes</p>
        <h2>Small group programs are separate.</h2>
        <p>
          1-on-1 mentoring is the core. Small groups — SAT (about four
          students) and Programming &amp; STEM — share the same
          standards and the same goals. What’s running changes; ask
          on the consult.
        </p>
        <p><a href="/programs/group-classes">Group Classes</a></p>
      </section>

      <section class="page-block" id="pricing-preview">
        <p class="eyebrow">Pricing</p>
        <h2>Rate follows your child’s level.</h2>
        <p>
          Bigger packages, lower hourly rate. Want a Lead mentor at
          any age? That’s the College rate.
        </p>
        <p><a href="/pricing">See Mentoring rates</a></p>
      </section>

      ${testimonialsPlaceholderHtml()}

      <section class="page-block faq-block" id="faq">
        <h2>Questions parents ask</h2>
        ${homeFaqHtml()}
      </section>

      ${consultBand(
        "Let's find the right tutor.",
        'Free. 30 minutes. DFW. Zoom.'
      )}
    </div>
  `

  return after
}
