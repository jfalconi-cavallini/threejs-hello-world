import { mountPage } from '../page-shell.js'
import { ARROW_ICON } from '../chrome.js'

mountPage({
  page: 'pricing',
  html: `
    <section class="page-hero">
      <p class="eyebrow">Rates</p>
      <h1>Clear rates. The mentor who stays is the point.</h1>
      <p class="page-lead">
        One dedicated tutor. Notes after every session. Rate follows
        your child’s level and how many hours you book.
      </p>
    </section>

    <section class="rate-block" aria-label="Mentoring rates">
      <p class="rate-whisper">Want a Lead mentor at any age? That’s the College rate.</p>
      <p class="rate-whisper rate-whisper--sub">Bigger packages, lower rate. All rates are per hour.</p>
      <div class="rate-table-wrap">
        <table class="rate-table">
          <thead>
            <tr>
              <th scope="col">Level</th>
              <th scope="col">1 hr</th>
              <th scope="col">4 hr</th>
              <th scope="col">8 hr</th>
              <th scope="col">20 hr</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <span class="rate-level">College</span>
                <span class="rate-detail">Lead mentors · college coursework</span>
              </th>
              <td data-label="1 hr">$95/hr</td>
              <td data-label="4 hr">$85/hr</td>
              <td data-label="8 hr">$75/hr</td>
              <td data-label="20 hr">$65/hr</td>
            </tr>
            <tr>
              <th scope="row">
                <span class="rate-level">High school</span>
                <span class="rate-detail">Experienced and senior mentors · SAT, ACT, AP, and high school courses</span>
              </th>
              <td data-label="1 hr">$80/hr</td>
              <td data-label="4 hr">$70/hr</td>
              <td data-label="8 hr">$60/hr</td>
              <td data-label="20 hr">$50/hr</td>
            </tr>
            <tr>
              <th scope="row">
                <span class="rate-level">Middle school</span>
                <span class="rate-detail">Core and experienced mentors · middle school courses</span>
              </th>
              <td data-label="1 hr">$55/hr</td>
              <td data-label="4 hr">$50/hr</td>
              <td data-label="8 hr">$45/hr</td>
              <td data-label="20 hr">$40/hr</td>
            </tr>
            <tr>
              <th scope="row">
                <span class="rate-level">Elementary</span>
                <span class="rate-detail">Core mentors · elementary foundations</span>
              </th>
              <td data-label="1 hr">$50/hr</td>
              <td data-label="4 hr">$45/hr</td>
              <td data-label="8 hr">$40/hr</td>
              <td data-label="20 hr">$35/hr</td>
            </tr>
          </tbody>
        </table>
      </div>
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

    <section class="page-block faq-block" id="faq">
      <h2>Questions parents ask</h2>
      <dl class="faq-list">
        <div class="faq-item">
          <dt>Is this monthly?</dt>
          <dd>No. You book hours. Bigger packages lower the hourly rate. We never say “monthly.”</dd>
        </div>
        <div class="faq-item">
          <dt>Who sits with my child?</dt>
          <dd>One dedicated tutor matched on the consult. Same mentor stays with the work.</dd>
        </div>
        <div class="faq-item">
          <dt>What’s the difference between levels?</dt>
          <dd>Rate follows your child’s level — Elementary, Middle school, High school, or College. Mentors are matched to the coursework.</dd>
        </div>
        <div class="faq-item">
          <dt>Can I get a Lead mentor for a younger student?</dt>
          <dd>Yes. Lead mentors are available at every age — billed at the College rate.</dd>
        </div>
        <div class="faq-item">
          <dt>Do you guarantee a score jump?</dt>
          <dd>No. We don’t sell averages or guarantees. We diagnose, practice on purpose, and show you the notes. Individual results vary.</dd>
        </div>
        <div class="faq-item">
          <dt>DFW only?</dt>
          <dd>We’re rooted in Dallas–Fort Worth. Sessions are Zoom-first; in-person only where a tutor is already nearby.</dd>
        </div>
      </dl>
    </section>

    <section class="page-cta-band">
      <h2>Not sure which rate fits?</h2>
      <p>The free 30-minute consult is how we match level, mentor, and hours — together, in DFW or on Zoom.</p>
      <a class="primary-button" href="/consult">
        Book free 30-minute consult
        ${ARROW_ICON}
      </a>
    </section>
  `,
})
