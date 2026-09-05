import { mountPage } from '../page-shell.js'
import { ARROW_ICON } from '../chrome.js'

mountPage({
  page: 'about',
  html: `
    <section class="page-hero">
      <p class="eyebrow">About MetaMinds</p>
      <h1>Mentors who stay.</h1>
      <p class="page-lead">
        Dallas–Fort Worth. Zoom. The right mentor doesn’t have to live down the street.
      </p>
    </section>

    <section class="page-block about-story" id="why">
      <h2>Why we built this</h2>
      <p>The tutor who clicked kept leaving.</p>
      <p>We wanted one mentor who stays, and notes a parent can actually read.</p>
      <p>Dallas–Fort Worth. Zoom. Small on purpose.</p>
    </section>

    <section class="page-block" id="founders" aria-label="The people building it">
      <h2>The people building it</h2>
      <div class="founders">
      <article class="founder">
        <h3>Jose Falconi-Cavallini</h3>
        <p>CEO &amp; Co-Founder. CS and SAT/ACT.</p>
      </article>
      <article class="founder">
        <h3>Emma Brugman</h3>
        <p>Co-Founder. ML, data, and SAT/ACT.</p>
      </article>
      <article class="founder">
        <h3>Johan Falconi-Cavallini</h3>
        <p>Co-Founder. Engineering and math.</p>
      </article>
      <article class="founder">
        <h3>Roberto Medina</h3>
        <p>R&amp;D design engineer. STEM.</p>
      </article>
      <article class="founder">
        <h3>Alan Martinez</h3>
        <p>Hardware validation engineer. STEM.</p>
      </article>
      <article class="founder">
        <h3>Christian Tapia</h3>
        <p>Math and CS. MBA candidate.</p>
      </article>
      </div>
    </section>

    <section class="page-block about-voice">
      <h2>The mentor stays. AI does not take the chair.</h2>
      <p>
        We teach the concept, practice it on purpose, and check
        whether it sticks. After every session the tutor who taught
        writes notes for you and your child. That is the product.
        Tools can help a mentor prepare. They never replace one.
      </p>
    </section>

    <section class="page-block" id="programs">
      <h2>What we teach</h2>
      <div class="program-grid">
        <article id="academic">
          <h3>Academic tutoring</h3>
          <p>
            Elementary through high school math and core academics.
            Rebuild the foundation before the next course assumes it.
          </p>
        </article>
        <article id="test-prep">
          <h3>SAT &amp; ACT</h3>
          <p>
            Diagnose the weak spots, build strategy, practice
            deliberately, and track what moved. No average-score theater.
          </p>
        </article>
        <article id="ap">
          <h3>AP &amp; advanced courses</h3>
          <p>
            Keep pace with harder coursework, fill gaps, and walk
            into the next exam or semester more ready.
          </p>
        </article>
        <article id="stem">
          <h3>Programming &amp; STEM</h3>
          <p>
            Code, robotics, and engineering as real work — projects
            a student can point to, not a playlist of videos.
          </p>
        </article>
      </div>
    </section>

    <section class="page-block">
      <h2>How a family actually works with us</h2>
      <ol class="steps">
        <li>
          <strong>Free 30-minute consult.</strong>
          We listen first: grade, goals, SAT / ACT / AP / math / coding.
        </li>
        <li>
          <strong>One dedicated tutor.</strong>
          Rate follows your child’s level. Same system.
        </li>
        <li>
          <strong>Notes after every session.</strong>
          You see what was taught and what comes next. No exceptions.
        </li>
      </ol>
    </section>

    <section class="page-cta-band">
      <h2>Ready to meet the mentor who stays?</h2>
      <p>Book the free consult. We’ll take it from there.</p>
      <a class="primary-button" href="/consult">
        Book free 30-minute consult
        ${ARROW_ICON}
      </a>
    </section>
  `,
})
