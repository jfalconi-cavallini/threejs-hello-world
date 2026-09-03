import { mountPage } from '../page-shell.js'
import { ARROW_ICON } from '../chrome.js'

mountPage({
  page: 'not-found',
  html: `
    <section class="page-hero page-hero--empty">
      <p class="eyebrow">404</p>
      <h1>This page is not on the preview.</h1>
      <p class="page-lead">
        The public shell lives on Home, Consult, Pricing, and About.
        Nothing else is wired yet.
      </p>
      <div class="hero-actions">
        <a class="primary-button" href="/">Back to MetaMinds${ARROW_ICON}</a>
        <a class="hero-secondary-cta" href="/consult">Book a free consult</a>
      </div>
    </section>
  `,
})
