import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = process.env.STILL_OUT || '/tmp/lookbar-stills'
mkdirSync(OUT, { recursive: true })

const shots = [
  ['hero', '.chapter-hero'],
  ['how-bulb', '#bulb'],
  ['mentors-stay', '#team'],
  ['results-glow', '#results'],
  ['grow', '#pathways'],
  ['hiw-01-05', '#how-it-works'],
  ['results-2x2', '#results-more'],
  ['mentors-dir', '#mentors'],
  ['fit', '#group-classes'],
  ['subjects', '#subjects'],
  ['ch15-word', '#consultation'],
]

const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
const page = await context.newPage()

for (const [name, sel] of shots) {
  const url = `http://127.0.0.1:5173/?static=1&still=${encodeURIComponent(sel)}`
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const path = `${OUT}/${name}.png`
  await page.screenshot({ path, fullPage: false })
  console.log(path)
}

await browser.close()
