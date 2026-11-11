import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\ADIL RAZA KHAN\\.gemini\\antigravity\\brain\\415a6c31-def6-4bae-b5d0-a88ef544a74b';
const outputDir = path.resolve('./public/animation-captures/contact_sequence');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  console.log('Launching Chrome for Contact Us visual capture...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2500));

  const sec11 = await page.$('#sec11');
  if (!sec11) {
    console.error('Section 11 (#sec11) not found');
    await browser.close();
    return;
  }

  // Get sec11 top position
  const secTop = await page.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY;
  }, sec11);

  console.log(`sec11 absolute top position: ${secTop}px`);

  const steps = [
    {
      name: '01_approaching_contact_us',
      scrollY: Math.max(0, secTop - 650),
      delay: 1000,
      desc: 'Approaching Contact Us: Previous banner moving upward, Contact Us heading entering'
    },
    {
      name: '02_heading_and_card_appearing',
      scrollY: secTop + 180,
      delay: 1000,
      desc: 'Heading and floating card appearing: Heading letters transition from subtle grey to deep black, floating purple card ascends and untwists level'
    },
    {
      name: '03_complete_contact_us_section',
      scrollY: secTop + 550,
      delay: 1000,
      desc: 'Complete Contact Us section: Fully settled layout with centered lavender card, 3-pill top row inputs, textarea, and purple squircle send button'
    }
  ];

  for (const step of steps) {
    console.log(`Capturing ${step.name} at scrollY=${step.scrollY}...`);
    await page.evaluate(y => window.scrollTo(0, y), step.scrollY);
    await new Promise(r => setTimeout(r, step.delay));
    
    const filePath = path.join(outputDir, `${step.name}.jpg`);
    const artPath = path.join(artifactDir, `${step.name}.jpg`);
    await page.screenshot({ path: filePath, type: 'jpeg', quality: 92 });
    fs.copyFileSync(filePath, artPath);
    console.log(`Saved and copied to artifact: ${step.name}.jpg`);
  }

  // Capture Mobile Viewport (390x844)
  console.log('Capturing Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const mobileSec11 = await page.$('#sec11');
  const mobileSecTop = await page.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY;
  }, mobileSec11);

  await page.evaluate(y => window.scrollTo(0, y), mobileSecTop + 200);
  await new Promise(r => setTimeout(r, 1000));

  const mobileFilePath = path.join(outputDir, '04_mobile_contact_us.jpg');
  const mobileArtPath = path.join(artifactDir, '04_mobile_contact_us.jpg');
  await page.screenshot({ path: mobileFilePath, type: 'jpeg', quality: 92 });
  fs.copyFileSync(mobileFilePath, mobileArtPath);
  console.log('Saved and copied to artifact: 04_mobile_contact_us.jpg');

  // Interactive Form Test
  console.log('Testing interactive form fields on desktop...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(y => window.scrollTo(0, y), secTop + 550);
  await new Promise(r => setTimeout(r, 800));

  await page.type('input[placeholder="Name"]', 'Dr. Sarah Lin');
  await page.type('input[placeholder="E-mail"]', 'sarah.lin@bioresearch.org');
  await page.type('input[placeholder="Subject"]', 'Analytical Peptide Lot Inquiry');
  await page.type('textarea[placeholder="Message"]', 'Requesting MS/HPLC CoA verification documentation for Lot #AM-8842.');

  const formFilePath = path.join(outputDir, '05_contact_form_filled.jpg');
  const formArtPath = path.join(artifactDir, '05_contact_form_filled.jpg');
  await page.screenshot({ path: formFilePath, type: 'jpeg', quality: 92 });
  fs.copyFileSync(formFilePath, formArtPath);
  console.log('Saved and copied to artifact: 05_contact_form_filled.jpg');

  await browser.close();
  console.log('All mandatory visual captures successfully completed!');
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
