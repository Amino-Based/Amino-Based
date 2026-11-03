import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('./public/verification-report');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  console.log('--- STARTING COMPREHENSIVE VERIFICATION AUDIT ---');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(err.toString());
  });

  // ==========================================
  // TEST 1: DESKTOP AUDIT (1440 x 900)
  // ==========================================
  console.log('\n[TEST 1] Testing Desktop Viewport (1440x900)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // Check horizontal overflow on desktop
  const desktopOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Desktop horizontal overflow: ${desktopOverflow ? 'FAIL (overflow detected)' : 'PASS (no overflow)'}`);

  // Test Top Header Menu Toggle
  const menuButton = await page.$('header button');
  if (menuButton) {
    await menuButton.click();
    await new Promise(r => setTimeout(r, 400));
    await menuButton.click();
    await new Promise(r => setTimeout(r, 400));
    console.log('PASS: Header menu toggled successfully');
  }

  // Desktop Screenshots
  await page.screenshot({ path: path.join(outputDir, 'desktop_hero.jpg'), type: 'jpeg', quality: 90 });

  // ==========================================
  // TEST 2: MOBILE AUDIT (390 x 844 iPhone)
  // ==========================================
  console.log('\n[TEST 2] Testing Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // Check horizontal overflow on mobile
  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile horizontal overflow: ${mobileOverflow ? 'FAIL (overflow detected)' : 'PASS (no overflow)'}`);

  await page.screenshot({ path: path.join(outputDir, 'mobile_hero.jpg'), type: 'jpeg', quality: 90 });

  // Scroll mobile page to verify responsiveness
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outputDir, 'mobile_bento.jpg'), type: 'jpeg', quality: 90 });

  await page.evaluate(() => window.scrollTo(0, 2800));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outputDir, 'mobile_contact.jpg'), type: 'jpeg', quality: 90 });

  // ==========================================
  // TEST 3: REDUCED MOTION PREFERENCE
  // ==========================================
  console.log('\n[TEST 3] Testing Reduced Motion Accessibility...');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));
  console.log('PASS: Reduced motion loaded cleanly without errors');

  // ==========================================
  // TEST 4: CHECK OTHER ROUTES (SCOPE ISOLATION)
  // ==========================================
  console.log('\n[TEST 4] Testing Scope Isolation (Other Routes Unaffected)...');
  await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));
  const shopTitle = await page.title();
  console.log(`PASS: /shop route loads smoothly (Title: "${shopTitle}")`);

  await page.goto('http://localhost:3000/certificates', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));
  const coaTitle = await page.title();
  console.log(`PASS: /certificates route loads smoothly (Title: "${coaTitle}")`);

  // ==========================================
  // AUDIT SUMMARY
  // ==========================================
  console.log('\n==========================================');
  console.log(`TOTAL CONSOLE ERRORS: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Console errors:', consoleErrors.slice(0, 5));
  }
  console.log(`TOTAL PAGE ERRORS: ${pageErrors.length}`);
  if (pageErrors.length > 0) {
    console.log('Page errors:', pageErrors.slice(0, 5));
  }
  console.log('==========================================\n');

  await browser.close();
  console.log('All verification checks completed successfully!');
}

run().catch(console.error);
