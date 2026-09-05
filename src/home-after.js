import {
  consultBand,
  groupPreviewCardsHtml,
  homeFaqHtml,
  howItWorksListHtml,
  mentorPreviewHtml,
  pathwayCardsHtml,
  resultsStripHtml,
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
        ${resultsStripHtml({ eyebrow: 'Real student progress' })}
      </section>

      <section class="page-block" id="parent-portal">
        <p class="eyebrow">Parent portal</p>
        <h2>A portal for families — not live yet.</h2>
        <p>
          Today the working door is the free consult and direct updates from your mentor — not a self-serve parent login.
        </p>
        <p><a href="/parents">Parents page</a> · <a href="/login">Sign In</a></p>
      </section>

      <section class="page-block" id="mentors">
        <p class="eyebrow">Mentors</p>
        <h2>Mentors who stay.</h2>
        <p>
          One dedicated tutor matched to the coursework. Same notes.
          Same system.
        </p>
        <div class="mentor-preview-grid">
          ${mentorPreviewHtml()}
        </div>
        <p><a href="/about">Meet the team</a></p>
      </section>

      <section class="page-block" id="group-classes">
        <p class="eyebrow">Group programs</p>
        <h2>Small group programs are separate.</h2>
        <p>
          1-on-1 mentoring is the core. Small group programs are separate — same standards, shared goals.
        </p>
        <div class="pathway-grid">
          ${groupPreviewCardsHtml()}
        </div>
        <p><a href="/programs/group-classes">Group Classes</a></p>
        <p class="page-quiet">What’s running changes.</p>
      </section>

      <section class="page-block" id="pricing-preview">
        <p class="eyebrow">Pricing</p>
        <h2>Rate follows your child’s level.</h2>
        <p>
          Bigger packages, lower hourly rate. Want a Lead mentor at
          any age? That’s the College rate.
        </p>
        <p><a href="/pricing">See mentoring rates</a></p>
      </section>

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
