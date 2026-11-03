import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('./public/deep-audit/sec8-steps');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Find sec8 position
  const sec8Info = await page.evaluate(() => {
    const el = document.querySelector('#sec8');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { top: rect.top + window.scrollY, height: rect.height };
  });

  console.log('sec8Info:', sec8Info);

  if (sec8Info) {
    // Scroll in 5 increments through the pin
    // start: top top is at window.scrollY = sec8Info.top
    const pinStart = sec8Info.top;
    
    // Just before pin
    await page.evaluate(y => window.scrollTo(0, y - 200), pinStart);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(outputDir, 'step_01_approaching.jpg'), type: 'jpeg', quality: 90 });

    // Pin starts (0%)
    await page.evaluate(y => window.scrollTo(0, y), pinStart);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(outputDir, 'step_02_pin_start_0pct.jpg'), type: 'jpeg', quality: 90 });

    // Pin 33% (card glides center-left)
    await page.evaluate(y => window.scrollTo(0, y + 250), pinStart);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(outputDir, 'step_03_pin_33pct.jpg'), type: 'jpeg', quality: 90 });

    // Pin 66% (card glides center-right)
    await page.evaluate(y => window.scrollTo(0, y + 500), pinStart);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(outputDir, 'step_04_pin_66pct.jpg'), type: 'jpeg', quality: 90 });

    // Pin 100% (card docked on right)
    await page.evaluate(y => window.scrollTo(0, y + 750), pinStart);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(outputDir, 'step_05_pin_100pct_docked.jpg'), type: 'jpeg', quality: 90 });
  }

  await browser.close();
  console.log('Finished capturing steps in', outputDir);
}

run().catch(console.error);
