import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('./public/deep-audit/popups-and-texts');

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

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.toString()));

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Verify Section 3 Text Reveal
  console.log('Capturing Section 3 Text Reveal...');
  await page.evaluate(() => {
    document.querySelector('#sec3')?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, '01_sec3_text_reveal.jpg'), type: 'jpeg', quality: 95 });

  // 2. Verify Section 4 Bento Floating Team Pill Popup
  console.log('Capturing Section 4 Bento Floating Team Popup...');
  await page.evaluate(() => {
    document.querySelector('#sec4')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, '02_sec4_bento_popup.jpg'), type: 'jpeg', quality: 95 });

  // 3. Verify Section 6 Science Text Reveal
  console.log('Capturing Section 6 Science Text Reveal...');
  await page.evaluate(() => {
    document.querySelector('#sec6')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, '03_sec6_science_text.jpg'), type: 'jpeg', quality: 95 });

  // 4. Verify Section 9 Team Member 3D Tilt & Floating Popup Card
  console.log('Capturing Section 9 Our Team Floating Popup Card...');
  await page.evaluate(() => {
    document.querySelector('#sec9')?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, '04_sec9_team_popup.jpg'), type: 'jpeg', quality: 95 });

  // 5. Verify Section 11 Contact Us Pin & Slot-in Popup
  console.log('Capturing Section 11 Contact Us signature slot-in sequence...');
  // Scroll to start of Section 11 pin
  await page.evaluate(() => {
    document.querySelector('#sec11')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, '05_sec11_contact_start.jpg'), type: 'jpeg', quality: 95 });

  // Mid-scrub (+350px)
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, '06_sec11_contact_mid_glide.jpg'), type: 'jpeg', quality: 95 });

  // Settled docked (+400px)
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, '07_sec11_contact_docked.jpg'), type: 'jpeg', quality: 95 });

  await browser.close();
  console.log('Verification finished. Console errors encountered:', errors);
  console.log('All screenshots written to:', outputDir);
}

run().catch(console.error);
