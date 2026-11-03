import puppeteer from 'puppeteer-core';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

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

  const sec9 = await page.$('#sec9');
  if (sec9) {
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }), sec9);
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: './public/deep-audit/popups-and-texts/04_sec9_viewport.jpg', type: 'jpeg', quality: 95 });
    await sec9.screenshot({ path: './public/deep-audit/popups-and-texts/04_sec9_exact_element.jpg', type: 'jpeg', quality: 95 });
    console.log('Saved Section 9 screenshots');
  }
  await browser.close();
}

run().catch(console.error);
