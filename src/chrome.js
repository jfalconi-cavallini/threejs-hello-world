export const ARROW_ICON = `
  <svg class="btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
`

export const USERS_ICON = `
  <svg class="hero-trust-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
`

export const SHIELD_ICON = `
  <svg class="hero-trust-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
`

export function iconSvg(cls, paths) {
  return `
  <svg class="${cls}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    ${paths}
  </svg>
`
}

export const GLOBE_ICON = iconSvg(
  'page2-feature-icon',
  `<circle cx="12" cy="12" r="10" />
   <line x1="2" y1="12" x2="22" y2="12" />
   <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />`
)

export const PIN_ICON = iconSvg(
  'page2-feature-icon',
  `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
   <circle cx="12" cy="10" r="3" />`
)

export const CAP_ICON = iconSvg(
  'page2-stat-icon',
  `<path d="M22 10 12 5 2 10l10 5 10-5z" />
   <path d="M6 12.5V17a1 1 0 0 0 .3.7c1.2 1.2 3.4 2.3 5.7 2.3s4.5-1.1 5.7-2.3a1 1 0 0 0 .3-.7v-4.5" />
   <path d="M22 10v6" />`
)

export const TRENDING_ICON = iconSvg(
  'page2-stat-icon',
  `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
   <polyline points="17 6 23 6 23 12" />`
)

export const STAR_ICON = iconSvg(
  'page2-stat-icon',
  `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />`
)

export function mountAtmosphere() {
  if (document.querySelector('.atmosphere')) {
    return
  }

  const atmosphere = document.createElement('div')
  atmosphere.className = 'atmosphere'
  atmosphere.setAttribute('aria-hidden', 'true')
  atmosphere.innerHTML = `
    <div class="atmosphere-vignette"></div>
    <div class="atmosphere-grain"></div>
  `
  document.body.appendChild(atmosphere)
}

function navActive(page, id) {
  return page === id ? ' is-active' : ''
}

const LOCKUP = `
      <span class="brand-plate">
        <img
          src="/metaminds-logo-lock.png"
          alt="MetaMinds STEM Academy"
          class="brand-logo"
        >
      </span>
`

const CONSULT_CTA = `
    <a class="nav-cta" href="/consult">
      <span class="nav-cta-full">Book free 30-minute consult</span>
      <span class="nav-cta-short">Consult</span>
      ${ARROW_ICON}
    </a>
`

export function createNavbar({ page = 'home' } = {}) {
  const nav = document.createElement('nav')
  nav.className = page === 'home'
    ? 'metaminds-nav metaminds-nav--cinematic'
    : 'metaminds-nav'
  nav.setAttribute('aria-label', 'MetaMinds')

  const brandHref = page === 'home' ? '#s1' : '/'

  if (page === 'home') {
    nav.innerHTML = `
    <a class="brand" href="${brandHref}">
      ${LOCKUP}
    </a>
    ${CONSULT_CTA}
  `
    document.body.appendChild(nav)
    return nav
  }

  nav.innerHTML = `
    <a class="brand" href="${brandHref}">
      ${LOCKUP}
    </a>

    <div class="nav-inline">
      <a class="${navActive(page, 'pricing').trim()}" href="/pricing">Pricing</a>
      <a class="${navActive(page, 'about').trim()}" href="/about">About</a>
    </div>

    ${CONSULT_CTA}

    <button
      class="menu-button"
      type="button"
      aria-expanded="false"
      aria-label="Open menu"
    >
      <span></span>
      <span></span>
    </button>

    <div class="nav-panel">
      <div class="nav-links">
        <a class="${navActive(page, 'pricing').trim()}" href="/pricing">Pricing</a>
        <a class="${navActive(page, 'about').trim()}" href="/about">About</a>
      </div>
      <a href="/consult" class="primary-button nav-panel-cta">
        Book free 30-minute consult
        ${ARROW_ICON}
      </a>
    </div>
  `

  document.body.appendChild(nav)
  return nav
}

export function createFooter() {
  const footer = document.createElement('footer')
  footer.className = 'sketch-footer site-footer'
  footer.innerHTML = `
    <a class="footer-brand" href="/">
      <span class="brand-plate footer-plate">
        <img
          src="/metaminds-logo-lock.png"
          alt="MetaMinds STEM Academy"
          class="footer-logo"
        >
      </span>
    </a>
    <nav class="footer-links" aria-label="Footer">
      <a href="/about">About</a>
      <a href="/pricing">Pricing</a>
      <a href="/consult">Consult</a>
      <a href="mailto:metamindsstemacademy@gmail.com">metamindsstemacademy@gmail.com</a>
    </nav>
  `
  return footer
}

function closeNav() {
  const nav = document.querySelector('.metaminds-nav')
  if (!nav) {
    return
  }

  const button = nav.querySelector('.menu-button')
  nav.classList.remove('is-open')
  document.body.classList.remove('nav-open')

  if (button) {
    button.setAttribute('aria-expanded', 'false')
    button.setAttribute('aria-label', 'Open menu')
  }
}

function openNav() {
  const nav = document.querySelector('.metaminds-nav')
  if (!nav) {
    return
  }

  const button = nav.querySelector('.menu-button')
  nav.classList.add('is-open')
  document.body.classList.add('nav-open')

  if (button) {
    button.setAttribute('aria-expanded', 'true')
    button.setAttribute('aria-label', 'Close menu')
  }
}

function setPanelOpen(trigger, panel, open) {
  if (!trigger || !panel) {
    return
  }

  trigger.setAttribute('aria-expanded', open ? 'true' : 'false')
  panel.hidden = !open
}

export function setupNav() {
  const nav = document.querySelector('.metaminds-nav')
  if (!nav) {
    return
  }

  nav.querySelector('.brand')?.addEventListener('click', closeNav)

  nav.querySelectorAll('.nav-cta').forEach((link) => {
    link.addEventListener('click', closeNav)
  })

  const menuButton = nav.querySelector('.menu-button')
  menuButton?.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) {
      closeNav()
    } else {
      openNav()
    }
  })

  nav.querySelector('.nav-panel')?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav)
  })

  const dropdown = nav.querySelector('.nav-dropdown')
  const dropdownTrigger = dropdown?.querySelector('.nav-dropdown-trigger')

  if (dropdown && dropdownTrigger) {
    const setDropdownOpen = (open) => {
      dropdownTrigger.setAttribute('aria-expanded', open ? 'true' : 'false')
    }

    dropdown.addEventListener('mouseenter', () => setDropdownOpen(true))
    dropdown.addEventListener('mouseleave', () => setDropdownOpen(false))
    dropdown.addEventListener('focusin', () => setDropdownOpen(true))
    dropdown.addEventListener('focusout', (event) => {
      if (!dropdown.contains(event.relatedTarget)) {
        setDropdownOpen(false)
      }
    })

    dropdownTrigger.addEventListener('click', (event) => {
      event.preventDefault()
      const isOpen = dropdownTrigger.getAttribute('aria-expanded') === 'true'
      setDropdownOpen(!isOpen)
    })
  }

  const desktopSignIn = nav.querySelector('.nav-signin-wrap > .nav-signin')
  const desktopPanel = nav.querySelector('#signin-panel')
  const mobileSignIn = nav.querySelector('.nav-panel-signin')
  const mobilePanel = nav.querySelector('#signin-panel-mobile')

  desktopSignIn?.addEventListener('click', (event) => {
    event.stopPropagation()
    const open = desktopSignIn.getAttribute('aria-expanded') !== 'true'
    setPanelOpen(desktopSignIn, desktopPanel, open)
    setPanelOpen(mobileSignIn, mobilePanel, false)
  })

  mobileSignIn?.addEventListener('click', (event) => {
    event.stopPropagation()
    const open = mobileSignIn.getAttribute('aria-expanded') !== 'true'
    setPanelOpen(mobileSignIn, mobilePanel, open)
  })

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target)) {
      setPanelOpen(desktopSignIn, desktopPanel, false)
      setPanelOpen(mobileSignIn, mobilePanel, false)
      if (dropdownTrigger) {
        dropdownTrigger.setAttribute('aria-expanded', 'false')
      }
    }
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setPanelOpen(desktopSignIn, desktopPanel, false)
      setPanelOpen(mobileSignIn, mobilePanel, false)
      closeNav()
    }
  })
}
