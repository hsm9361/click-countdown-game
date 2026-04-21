import puppeteer from 'puppeteer-core'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const screenshotsDir = path.resolve(__dirname, '..', 'screenshots')

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const APP_URL = process.env.APP_URL ?? 'http://localhost:49289'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function fresh(browser, viewport, onNewDocScript) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  if (onNewDocScript) {
    await page.evaluateOnNewDocument(onNewDocScript)
  }
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => {
    try {
      localStorage.clear()
    } catch {}
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.target-btn', { timeout: 4000 })
  return page
}

async function capture(page, name) {
  await page.screenshot({
    path: path.join(screenshotsDir, name),
    type: 'png',
  })
  console.log('saved', name)
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
  })

  try {
    // 01 desktop initial gameplay
    {
      const page = await fresh(browser, { width: 1280, height: 800 })
      await wait(400)
      await capture(page, '01-desktop-gameplay.png')
      await page.close()
    }

    // 02 desktop game over (first round timeout)
    {
      const page = await fresh(browser, { width: 1280, height: 800 })
      await page.waitForSelector('#gameover-overlay', { timeout: 5000 })
      await wait(120)
      await capture(page, '02-desktop-gameover.png')
      await page.close()
    }

    // 03 mobile portrait gameplay
    {
      const page = await fresh(browser, { width: 375, height: 812 })
      await wait(400)
      await capture(page, '03-mobile-gameplay.png')
      await page.close()
    }

    // 04 mobile portrait game over
    {
      const page = await fresh(browser, { width: 375, height: 812 })
      await page.waitForSelector('#gameover-overlay', { timeout: 5000 })
      await wait(120)
      await capture(page, '04-mobile-gameover.png')
      await page.close()
    }

    // 05 pop animation + reaction time mid-animation
    {
      const page = await fresh(browser, { width: 1280, height: 800 })
      await wait(280)
      await page.evaluate(() => {
        const t = document.querySelector('.target-btn:not(.is-popping)')
        t?.click()
      })
      await wait(130)
      await capture(page, '05-pop-reaction.png')
      await page.close()
    }

    // 06 multi-click badge visible (force Math.random = 0, advance to round 3)
    {
      const page = await fresh(
        browser,
        { width: 1280, height: 800 },
        () => {
          Math.random = () => 0
        },
      )
      for (let r = 0; r < 2; r += 1) {
        await page.evaluate(() => {
          const t = document.querySelector('.target-btn:not(.is-popping)')
          t?.click()
        })
        await wait(80)
      }
      await page.waitForSelector('.target-btn .click-badge', { timeout: 3000 })
      // Wait for previous reaction-text/pop to fully fade (900ms anim + margin)
      await wait(1100)
      await capture(page, '06-multiclick-badge.png')
      await page.close()
    }

    // 07 game over with avg reaction row (play 2 rounds then let 3rd expire)
    {
      const page = await fresh(browser, { width: 1280, height: 800 })
      for (let r = 0; r < 2; r += 1) {
        await page.evaluate(() => {
          const t = document.querySelector('.target-btn:not(.is-popping)')
          t?.click()
        })
        await wait(150)
      }
      await page.waitForSelector('#gameover-overlay', { timeout: 6000 })
      await page.waitForSelector('#gameover-panel .avg-row', { timeout: 1500 })
      await wait(120)
      await capture(page, '07-gameover-with-avg.png')
      await page.close()
    }
  } finally {
    await browser.close()
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
