import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('./public/full-audit-screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Get all sections with id
  const sections = await page.$$('section[id], div[id^="sec"]');
  console.log(`Found ${sections.length} sections with IDs`);

  let idx = 0;
  for (const sec of sections) {
    const id = await page.evaluate(el => el.id || `sec_${idx}`, sec);
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }), sec);
    await new Promise(r => setTimeout(r, 600));
    const filePath = path.join(outputDir, `${String(idx).padStart(2, '0')}_${id}.jpg`);
    await page.screenshot({ path: filePath, type: 'jpeg', quality: 85 });
    console.log(`Captured ${filePath}`);
    idx++;
  }

  await browser.close();
}

run().catch(console.error);
