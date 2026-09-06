import { homeAfterChaptersHtml } from './site-copy.js'

export function createHomeAfter() {
  const after = document.createElement('div')
  after.className = 'home-after'
  after.innerHTML = `
    <div class="home-after-inner site-shell">
      ${homeAfterChaptersHtml()}
    </div>
  `

  bindAfterCinematicNav(after)
  return after
}

function bindAfterCinematicNav(after) {
  const sync = () => {
    const top = after.getBoundingClientRect().top
    document.body.classList.toggle('is-after-cinematic', top <= 8)
  }

  const start = () => {
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
  }

  if (after.isConnected) {
    start()
    return
  }

  requestAnimationFrame(start)
}
