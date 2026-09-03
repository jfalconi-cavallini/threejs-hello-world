import { mountAtmosphere, createNavbar, createFooter, setupNav } from './chrome.js'
import './style.css'

export function mountPage({ page, html }) {
  document.body.classList.add('is-site-page')
  mountAtmosphere()
  createNavbar({ page })

  const main = document.createElement('main')
  main.className = 'site-shell'
  main.innerHTML = html
  document.body.appendChild(main)
  document.body.appendChild(createFooter())
  setupNav()

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
