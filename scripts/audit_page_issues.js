import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('./public/deep-audit/page-audit');

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

  const sections = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('section')).map((el, i) => {
      const rect = el.getBoundingClientRect();
      return {
        index: i,
        id: el.id,
        top: Math.round(rect.top + window.scrollY),
        height: Math.round(rect.height),
      };
    });
  });
  console.log('Sections overview:', JSON.stringify(sections, null, 2));

  // 1. Screenshot Section 3 (Mission / text reveal)
  await page.evaluate(() => {
    document.querySelector('#sec3')?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, '01_sec3_mission.jpg'), type: 'jpeg' });

  // 2. Screenshot Section 6 (Science behind services / timeline & text)
  await page.evaluate(() => {
    document.querySelector('#sec6')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, '02_sec6_science.jpg'), type: 'jpeg' });

  // 3. Screenshot Section 9 (Our Team / popup badge)
  await page.evaluate(() => {
    document.querySelector('#sec9')?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, '03_sec9_team.jpg'), type: 'jpeg' });

  // 4. Screenshot Section 11 (Contact Us)
  await page.evaluate(() => {
    document.querySelector('#sec11')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, '04_sec11_contact_start.jpg'), type: 'jpeg' });

  await page.evaluate(() => {
    window.scrollBy({ top: 350, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, '05_sec11_contact_mid.jpg'), type: 'jpeg' });

  await browser.close();
  console.log('Finished capturing screenshots in', outputDir);
}

run().catch(console.error);
