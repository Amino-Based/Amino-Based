import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('./public/deep-audit/sec7-sec8-verify');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Capture Section 7 Advantages cards and close up of numbers
  console.log('Capturing Section 7...');
  const sec7 = await page.$('#sec7');
  if (sec7) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sec7);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, 'sec7_full_view.jpg'), type: 'jpeg', quality: 95 });

    // Close-up of card bottoms
    const cards = await page.$$('.advantage-card');
    if (cards.length > 0) {
      console.log(`Found ${cards.length} advantage cards`);
    }
  }

  // 2. Section 8 Scroll sequence
  console.log('Capturing Section 8 sequence...');
  const sec8 = await page.$('#sec8');
  if (sec8) {
    // Scroll so sec8 is pinned at top
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }), sec8);
    await new Promise(r => setTimeout(r, 1000));
    const startY = await page.evaluate(() => window.scrollY);

    // Initial pin point (start: card on left over robot apparatus)
    await page.screenshot({ path: path.join(outputDir, 'sec8_pin_01_start.jpg'), type: 'jpeg', quality: 95 });

    // Mid scrub (+350px: card glides across center)
    await page.evaluate(y => window.scrollTo(0, y + 350), startY);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, 'sec8_pin_02_mid.jpg'), type: 'jpeg', quality: 95 });

    // Full glide (+750px: card docked on right)
    await page.evaluate(y => window.scrollTo(0, y + 750), startY);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, 'sec8_pin_03_docked.jpg'), type: 'jpeg', quality: 95 });
  }

  await browser.close();
  console.log('Done! Captured files in', outputDir);
}

run().catch(console.error);
