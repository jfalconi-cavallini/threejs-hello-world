import { mountPage } from '../page-shell.js'
import { ARROW_ICON } from '../chrome.js'

mountPage({
  page: 'pricing',
  html: `
    <section class="page-hero">
      <p class="eyebrow">Mentoring tiers</p>
      <h1>Same system. The mentor who stays is the point.</h1>
      <p class="page-lead">
        Every family gets one dedicated tutor, a plan you can follow,
        and notes after every session. The difference is who sits
        across from your child.
      </p>
    </section>

    <section class="tier-grid" aria-label="Mentoring tiers">
      <article class="tier-card tier-card--premium" id="premium">
        <div class="tier-head">
          <p class="tier-kicker">Premium</p>
          <h2>Experienced specialists</h2>
        </div>
        <p class="tier-rate">From $70/hr</p>
        <p>
          Practicing engineers, scientists, and subject specialists
          who have taught this material for years. Built for
          SAT, ACT, AP, and advanced coursework.
        </p>
        <ul>
          <li>One dedicated tutor</li>
          <li>Session notes after every session</li>
          <li>SAT, ACT, AP, math, and coding</li>
          <li>Single session through longer packages</li>
        </ul>
        <a class="primary-button" href="/consult">
          Book a free consult
          ${ARROW_ICON}
        </a>
      </article>

      <article class="tier-card tier-card--college" id="college">
        <div class="tier-head">
          <p class="tier-kicker">College Mentor</p>
          <h2>Close to the coursework</h2>
        </div>
        <p class="tier-rate">From $50/hr</p>
        <p>
          High-achieving college students, selected and supervised
          by MetaMinds. The full system — notes, practice, parent
          updates, skill tracking — with a mentor still inside
          the work your child is doing.
        </p>
        <ul>
          <li>One dedicated tutor</li>
          <li>Session notes after every session</li>
          <li>High school, middle school, and elementary — same notes, same system.</li>
          <li>Single session through longer packages</li>
        </ul>
        <a class="primary-button" href="/consult">
          Book a free consult
          ${ARROW_ICON}
        </a>
      </article>
    </section>

    <section class="page-block">
      <h2>Included with every family</h2>
      <div class="include-grid">
        <article>
          <h3>1-on-1 only</h3>
          <p>No group classes. Your child is the session.</p>
        </article>
        <article>
          <h3>Session notes</h3>
          <p>The tutor who taught writes what you both need next.</p>
        </article>
        <article>
          <h3>Skill tracking</h3>
          <p>See what is sticking and what still needs work.</p>
        </article>
        <article>
          <h3>Parent updates</h3>
          <p>You are not left guessing how tutoring is going.</p>
        </article>
      </div>
    </section>

    <section class="page-block">
      <h2>Packages after the consult.</h2>
      <p>
        Start with a free 30 minutes. We’ll match the mentor and the hours to your kid — not a grid you have to decode alone.
      </p>
      <a class="primary-button" href="/consult">
        Book free 30-minute consult
        ${ARROW_ICON}
      </a>
    </section>

    <section class="page-cta-band">
      <h2>Not sure which mentor fits?</h2>
      <p>The free 30-minute consult is how we decide — together, in DFW or on a call.</p>
      <a class="primary-button" href="/consult">
        Book free 30-minute consult
        ${ARROW_ICON}
      </a>
    </section>
  `,
})
