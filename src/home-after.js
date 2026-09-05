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
