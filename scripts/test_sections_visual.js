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

  console.log('Opening page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot Section 9 Element directly
  const sec9 = await page.$('#sec9');
  if (sec9) {
    await sec9.screenshot({ path: path.resolve('./public/deep-audit/exact_sec9_box.jpg'), type: 'jpeg', quality: 95 });
    console.log('Saved exact_sec9_box.jpg');
  }

  // Screenshot Section 10 Element directly
  const sec10 = await page.$('#sec10');
  if (sec10) {
    await sec10.screenshot({ path: path.resolve('./public/deep-audit/exact_sec10_box.jpg'), type: 'jpeg', quality: 95 });
    console.log('Saved exact_sec10_box.jpg');
  }

  // Screenshot Section 4 Bento
  const sec4 = await page.$('#sec4');
  if (sec4) {
    await sec4.screenshot({ path: path.resolve('./public/deep-audit/exact_sec4_box.jpg'), type: 'jpeg', quality: 95 });
    console.log('Saved exact_sec4_box.jpg');
  }

  // Screenshot Section 11 Contact Us
  const sec11 = await page.$('#sec11');
  if (sec11) {
    await sec11.screenshot({ path: path.resolve('./public/deep-audit/exact_sec11_box.jpg'), type: 'jpeg', quality: 95 });
    console.log('Saved exact_sec11_box.jpg');
  }

  await browser.close();
  console.log('Finished capturing all exact boxes.');
}

run().catch(console.error);
