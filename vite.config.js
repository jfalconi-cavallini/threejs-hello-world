import { defineConfig } from 'vite'

const htmlPages = {
  '/consult': '/consult.html',
  '/pricing': '/pricing.html',
  '/about': '/about.html',
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
        notFound: '404.html',
      },
    },
  },
})
