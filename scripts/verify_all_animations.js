import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('./public/final-animation-audit');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  console.log('Starting animation verification...');
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

  // 1. Hero initial state (claw firmly clamping peptide)
  await page.screenshot({ path: path.join(outputDir, '01_hero_initial.jpg'), type: 'jpeg', quality: 90 });
  console.log('1. Captured hero initial');

  // 2. Hero claw retracting on scroll
  await page.evaluate(() => window.scrollTo(0, 320));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outputDir, '02_hero_claw_retracted.jpg'), type: 'jpeg', quality: 90 });
  console.log('2. Captured hero claw retracted');

  // 3. Orbit diagram & stats
  const sec3 = await page.$('#sec3');
  if (sec3) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sec3);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outputDir, '03_orbit_stats.jpg'), type: 'jpeg', quality: 90 });
    console.log('3. Captured orbit & stats');
  }

  // 4. Bento Grid
  const sec4 = await page.$('#sec4');
  if (sec4) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sec4);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outputDir, '04_bento_grid.jpg'), type: 'jpeg', quality: 90 });
    console.log('4. Captured bento grid');
  }

  // 5. Stacked Service Cards
  const sec5 = await page.$('#sec5');
  if (sec5) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sec5);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outputDir, '05_stacked_cards.jpg'), type: 'jpeg', quality: 90 });
    console.log('5. Captured stacked cards');
  }

  // 6. Science timeline
  const sec6 = await page.$('#sec6');
  if (sec6) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sec6);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outputDir, '06_science_timeline.jpg'), type: 'jpeg', quality: 90 });
    console.log('6. Captured science timeline');
  }

  // 7. Lab HUD device (clean background + waveform)
  const sec8 = await page.$('#sec8');
  if (sec8) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sec8);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outputDir, '07_lab_hud_device.jpg'), type: 'jpeg', quality: 90 });
    console.log('7. Captured lab hud device');
  }

  // 8. Educational Webinars
  const secWebinars = await page.$('#sec-webinars');
  if (secWebinars) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), secWebinars);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outputDir, '08_webinars.jpg'), type: 'jpeg', quality: 90 });
    console.log('8. Captured webinars');
  }

  // 9. Team member card (Sarah Mitchell pendulum lanyard badge)
  const sec9 = await page.$('#sec9');
  if (sec9) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sec9);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outputDir, '09_team_lanyard.jpg'), type: 'jpeg', quality: 90 });
    console.log('9. Captured team lanyard badge');
  }

  // 10. History milestones
  const sec10 = await page.$('#sec10');
  if (sec10) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sec10);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outputDir, '10_history_milestones.jpg'), type: 'jpeg', quality: 90 });
    console.log('10. Captured history milestones');
  }

  // 11. Brand Orb Chamber
  const secOrb = await page.$('#sec-brand-chamber');
  if (secOrb) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), secOrb);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outputDir, '11_brand_orb_chamber.jpg'), type: 'jpeg', quality: 90 });
    console.log('11. Captured brand orb chamber');
  }

  // 12. Contact section initial and slotted states
  const sec11 = await page.$('#sec11');
  if (sec11) {
    // Approach
    await page.evaluate(el => {
      const rect = el.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + rect.top - 450);
    }, sec11);
    await new Promise(r => setTimeout(r, 700));
    await page.screenshot({ path: path.join(outputDir, '12_contact_flight.jpg'), type: 'jpeg', quality: 90 });
    console.log('12. Captured contact flight');

    // Landed & Split
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), sec11);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outputDir, '13_contact_landed_form.jpg'), type: 'jpeg', quality: 90 });
    console.log('13. Captured contact landed form');
  }

  await browser.close();
  console.log('All verification captures completed successfully!');
}

run().catch(console.error);
