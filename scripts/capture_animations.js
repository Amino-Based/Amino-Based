import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('./public/animation-captures');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  console.log('Launching Chrome with puppeteer-core...');
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

  // 1. Hero top capture
  await page.screenshot({ path: path.join(outputDir, '01_hero_initial.jpg'), type: 'jpeg', quality: 90 });
  console.log('Captured 01_hero_initial.jpg');

  // 2. Hero claw animation (scroll down 300px)
  await page.evaluate(() => window.scrollTo(0, 350));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, '02_hero_claw_moving.jpg'), type: 'jpeg', quality: 90 });
  console.log('Captured 02_hero_claw_moving.jpg');

  // 3. Scroll to Orbit / Peptide deck
  const orbitSec = await page.$('#sec3');
  if (orbitSec) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), orbitSec);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, '03_orbit_section.jpg'), type: 'jpeg', quality: 90 });
    console.log('Captured 03_orbit_section.jpg');
  }

  // 4. Scroll to Contact section approach (just before sec11)
  const sec11 = await page.$('#sec11');
  if (sec11) {
    // Before contact badge triggers fully
    await page.evaluate(el => {
      const rect = el.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + rect.top - 600);
    }, sec11);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, '04_contact_approaching.jpg'), type: 'jpeg', quality: 90 });
    console.log('Captured 04_contact_approaching.jpg');

    // Inside contact section (badge animated and split text)
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sec11);
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(outputDir, '05_contact_animated_full.jpg'), type: 'jpeg', quality: 90 });
    console.log('Captured 05_contact_animated_full.jpg');
  }

  await browser.close();
  console.log('Done capturing animation frames!');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
