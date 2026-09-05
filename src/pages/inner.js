import { mountPage } from '../page-shell.js'
import {
  academicTutoringHtml,
  apHtml,
  groupClassesHtml,
  howItWorksPageHtml,
  loginPageHtml,
  parentsPageHtml,
  programHubHtml,
  programmingStemHtml,
  resultsPageHtml,
  satActHtml,
} from '../site-copy.js'

const pages = {
  programs: {
    nav: 'programs',
    html: programHubHtml(),
  },
  'academic-tutoring': {
    nav: 'programs',
    html: academicTutoringHtml(),
  },
  'sat-act': {
    nav: 'programs',
    html: satActHtml(),
  },
  ap: {
    nav: 'programs',
    html: apHtml(),
  },
  'programming-stem': {
    nav: 'programs',
    html: programmingStemHtml(),
  },
  'group-classes': {
    nav: 'programs',
    html: groupClassesHtml(),
  },
  'how-it-works': {
    nav: 'how-it-works',
    html: howItWorksPageHtml(),
  },
  results: {
    nav: 'results',
    html: resultsPageHtml(),
  },
  login: {
    nav: 'login',
    html: loginPageHtml(),
  },
  parents: {
    nav: 'parents',
    html: parentsPageHtml(),
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
