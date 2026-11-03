import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('./public/deep-audit/sec8-glide');

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

  // 1. Capture Section 7 cards (Our Advantages)
  console.log('Capturing Section 7 cards...');
  const sec7 = await page.$('#sec7');
  if (sec7) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sec7);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outputDir, '01_sec7_our_advantages.jpg'), type: 'jpeg', quality: 95 });
  }

  // 2. Section 8 Pin sequence
  console.log('Capturing Section 8 pin and glide...');
  await page.evaluate(() => {
    document.querySelector('#sec8')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, '02_sec8_start_left_card.jpg'), type: 'jpeg', quality: 95 });

  // Mid glide (+400px)
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, '03_sec8_mid_glide_across.jpg'), type: 'jpeg', quality: 95 });

  // Docked right (+450px)
  await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, '04_sec8_docked_right.jpg'), type: 'jpeg', quality: 95 });

  await browser.close();
  console.log('All screenshots captured in', outputDir);
}

run().catch(console.error);
