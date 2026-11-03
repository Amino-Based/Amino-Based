import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('./public/animation-captures/contact_sequence');

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

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  const sec11 = await page.$('#sec11');
  if (!sec11) {
    console.error('Section 11 not found');
    await browser.close();
    return;
  }

  // Get sec11 top position
  const secTop = await page.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY;
  }, sec11);

  // Trigger: start is "top 80%" (i.e. secTop - 900 * 0.8 = secTop - 720)
  // End is "top 25%" (i.e. secTop - 900 * 0.25 = secTop - 225)
  // Total trigger distance is ~495px
  const startY = secTop - 900;
  const steps = [
    { name: '01_contact_word_intact', scrollY: startY + 50 },
    { name: '02_contact_badge_arriving_tilt', scrollY: startY + 220 },
    { name: '03_contact_badge_landing_fade_tac', scrollY: startY + 380 },
    { name: '04_contact_settled_full_form', scrollY: startY + 580 },
  ];

  for (const step of steps) {
    await page.evaluate(y => window.scrollTo(0, y), step.scrollY);
    await new Promise(r => setTimeout(r, 600));
    const filePath = path.join(outputDir, `${step.name}.jpg`);
    await page.screenshot({ path: filePath, type: 'jpeg', quality: 90 });
    console.log(`Saved ${step.name}.jpg at scrollY=${step.scrollY}`);
  }

  await browser.close();
  console.log('Sequence capture complete!');
}

run().catch(console.error);
