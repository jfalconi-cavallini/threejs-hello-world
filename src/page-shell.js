import { mountAtmosphere, createNavbar, createFooter, setupNav } from './chrome.js'
import { mountLookBar } from './look-bar.js'
import './style.css'
import './frame-routes.css'

export function mountPage({ page, html, frame = false, lookRoute } = {}) {
  document.body.classList.add('is-site-page')
  if (frame) {
    document.body.classList.add('is-frame-page')
  }
  mountAtmosphere()
  createNavbar({ page })

  const main = document.createElement('main')
  main.className = frame ? 'site-shell site-shell--frame' : 'site-shell'
  main.innerHTML = html
  document.body.appendChild(main)
  document.body.appendChild(createFooter())
  setupNav()

  if (lookRoute) {
    mountLookBar({ route: lookRoute })
  }

  if (location.hash) {
    const target = document.querySelector(location.hash)
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ block: 'start' })
      })
    }
  }

  return main
}
