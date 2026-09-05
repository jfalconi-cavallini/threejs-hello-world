import { mountPage } from '../page-shell.js'
import { ARROW_ICON } from '../chrome.js'

const EMAIL = 'metamindsstemacademy@gmail.com'

mountPage({
  page: 'consult',
  html: `
    <section class="page-hero">
      <p class="eyebrow">Dallas–Fort Worth · Free 30 minutes</p>
      <h1>Book a consult. Meet the mentor who stays with your kid.</h1>
      <p class="page-lead">
        One dedicated tutor. Session notes after every session.
        SAT, ACT, AP, math, and coding. AI assists. It never replaces.
      </p>
    </section>

    <section class="page-split">
      <div class="consult-promise">
        <h2>What the 30 minutes is for</h2>
        <ul class="promise-list">
          <li>
            <strong>Your child, not a roster.</strong>
            We match one tutor and stay with them. No weekly shuffle.
          </li>
          <li>
            <strong>A plan you can see.</strong>
            After every session the tutor who taught writes notes
            for you and your child.
          </li>
          <li>
            <strong>The work that matters.</strong>
            SAT, ACT, AP, math, and coding — diagnosed first,
            practiced on purpose.
          </li>
          <li>
            <strong>Human first.</strong>
            AI can help a mentor prepare. It does not teach
            your kid instead of one.
          </li>
        </ul>
        <p class="consult-rate-link">
          Rates by grade and hours —
          <a href="/pricing">see Mentoring rates</a>.
        </p>
        <p class="page-quiet">
          Rates lock after the consult. Virtual first, with in-person
          only where a tutor is already nearby.
        </p>
      </div>

      <div class="consult-pane">
      <form class="consult-form" id="consult-form" novalidate>
        <div class="form-intro">
          <h2>Request your consult</h2>
          <p>Tell us about your child. We’ll open a prepared email for you to send.</p>
        </div>

        <label>
          <span>Parent name</span>
          <input name="parent" type="text" autocomplete="name" required>
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autocomplete="email" required>
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" autocomplete="tel">
        </label>
        <label>
          <span>Student grade</span>
          <select name="grade" required>
            <option value="">Select a grade</option>
            <option>Elementary</option>
            <option>Middle school</option>
            <option>9th</option>
            <option>10th</option>
            <option>11th</option>
            <option>12th</option>
            <option>College</option>
          </select>
        </label>
        <fieldset>
          <legend>What should we focus on?</legend>
          <div class="check-grid">
            <label class="check"><input type="checkbox" name="focus" value="SAT"> SAT</label>
            <label class="check"><input type="checkbox" name="focus" value="ACT"> ACT</label>
            <label class="check"><input type="checkbox" name="focus" value="AP"> AP</label>
            <label class="check"><input type="checkbox" name="focus" value="Math"> Math</label>
            <label class="check"><input type="checkbox" name="focus" value="Coding"> Coding</label>
            <label class="check"><input type="checkbox" name="focus" value="Other"> Other</label>
          </div>
        </fieldset>
        <label>
          <span>Anything we should know</span>
          <textarea name="notes" rows="4" placeholder="Goals, timing, or the last thing that clicked — or didn’t."></textarea>
        </label>
        <p class="form-error" id="consult-error" hidden></p>
        <button class="primary-button" type="submit">
          Request free 30-minute consult
          ${ARROW_ICON}
        </button>
        <p class="page-quiet">
          Prefer email?
          <a href="mailto:${EMAIL}">${EMAIL}</a>
        </p>
      </form>

      <div class="consult-success" id="consult-success" hidden>
        <p class="eyebrow">Almost done</p>
        <h2>Send the email to finish your request.</h2>
        <p>
          We filled it in for you. If nothing opened, tap
          <a data-mail-link href="mailto:${EMAIL}">email the academy</a>
          below.
        </p>
        <a class="primary-button" href="/pricing">See Mentoring rates${ARROW_ICON}</a>
      </div>
      </div>
    </section>
  `,
})

const form = document.querySelector('#consult-form')
const success = document.querySelector('#consult-success')
const errorEl = document.querySelector('#consult-error')

form?.addEventListener('submit', (event) => {
  event.preventDefault()

  const data = new FormData(form)
  const parent = String(data.get('parent') || '').trim()
  const email = String(data.get('email') || '').trim()
  const grade = String(data.get('grade') || '').trim()

  if (!parent || !email || !grade) {
    errorEl.hidden = false
    errorEl.textContent = 'Add a parent name, email, and grade so the email is complete.'
    return
  }

  errorEl.hidden = true
  form.hidden = true
  success.hidden = false
  success.scrollIntoView({ block: 'start', behavior: 'smooth' })

  const focus = data.getAll('focus').join(', ') || 'Not specified'
  const phone = String(data.get('phone') || '').trim() || 'Not given'
  const notes = String(data.get('notes') || '').trim() || 'None'
  const subject = encodeURIComponent(`Consult request — ${parent}`)
  const body = encodeURIComponent(
    `Parent: ${parent}\nEmail: ${email}\nPhone: ${phone}\nGrade: ${grade}\nFocus: ${focus}\nNotes: ${notes}`
  )
  const mailto = `mailto:${EMAIL}?subject=${subject}&body=${body}`
  const mailLink = success.querySelector('[data-mail-link]')
  if (mailLink) {
    mailLink.href = mailto
  }
  window.location.assign(mailto)
})
