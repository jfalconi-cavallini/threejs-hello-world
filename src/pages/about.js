import { mountPage } from '../page-shell.js'
import { aboutPageHtml } from '../frame-routes.js'

mountPage({
  page: 'about',
  frame: true,
  lookRoute: '/about',
  html: aboutPageHtml(),
})
