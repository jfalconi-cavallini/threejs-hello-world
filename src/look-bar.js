export function mountLookBar({ route, tipped = false } = {}) {
  if (document.querySelector('.look-bar')) {
    return
  }

  const bar = document.createElement('aside')
  bar.className = tipped ? 'look-bar is-tipped' : 'look-bar'
  bar.setAttribute('aria-label', 'Standing look bar')
  bar.innerHTML = `
    <p class="look-bar-kicker">Look</p>
    <p class="look-bar-route">${route}</p>
    <p class="look-bar-note">Tip when stills match frames</p>
    <button class="look-bar-tip" type="button" aria-pressed="${tipped ? 'true' : 'false'}">
      ${tipped ? 'Tipped' : 'Tip'}
    </button>
  `

  const button = bar.querySelector('.look-bar-tip')
  button?.addEventListener('click', () => {
    const on = !bar.classList.contains('is-tipped')
    bar.classList.toggle('is-tipped', on)
    button.setAttribute('aria-pressed', on ? 'true' : 'false')
    button.textContent = on ? 'Tipped' : 'Tip'
  })

  document.body.appendChild(bar)
  return bar
}
