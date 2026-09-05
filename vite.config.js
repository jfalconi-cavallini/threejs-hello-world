import { defineConfig } from 'vite'

const htmlPages = {
  '/consult': '/consult.html',
  '/consultation': '/consult.html',
  '/pricing': '/pricing.html',
  '/about': '/about.html',
  '/programs': '/programs.html',
  '/programs/academic-tutoring': '/programs/academic-tutoring.html',
  '/programs/sat-act': '/programs/sat-act.html',
  '/programs/ap': '/programs/ap.html',
  '/programs/programming-stem': '/programs/programming-stem.html',
  '/programs/group-classes': '/programs/group-classes.html',
  '/how-it-works': '/how-it-works.html',
  '/results': '/results.html',
  '/login': '/login.html',
  '/parents': '/parents.html',
}

function cleanHtmlUrls() {
  return {
    name: 'clean-html-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = req.url?.split('?')[0]
        const mapped = htmlPages[path]
        if (mapped) {
          req.url = mapped + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '')
        }
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = req.url?.split('?')[0]
        const mapped = htmlPages[path]
        if (mapped) {
          req.url = mapped + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '')
        }
        next()
      })
    },
  }
}

export default defineConfig({
  appType: 'mpa',
  plugins: [cleanHtmlUrls()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        consult: 'consult.html',
        pricing: 'pricing.html',
        about: 'about.html',
        programs: 'programs.html',
        programsAcademic: 'programs/academic-tutoring.html',
        programsSatAct: 'programs/sat-act.html',
        programsAp: 'programs/ap.html',
        programsStem: 'programs/programming-stem.html',
        programsGroup: 'programs/group-classes.html',
        howItWorks: 'how-it-works.html',
        results: 'results.html',
        login: 'login.html',
        parents: 'parents.html',
        notFound: '404.html',
      },
    },
  },
})
