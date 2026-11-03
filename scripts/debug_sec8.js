import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  // Wait for fonts & ScrollTrigger refresh
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  const info = await page.evaluate(() => {
    const sec8 = document.querySelector('#sec8');
    const card = document.querySelector('#sec8 [class*="rounded-[28px]"]');
    return {
      cardStyle: card?.getAttribute('style'),
      cardTransform: card ? window.getComputedStyle(card).transform : null,
      sec8Bounding: sec8?.getBoundingClientRect(),
      scrollY: window.scrollY
    };
  });
  console.log('Initial sec8 info at scroll 0:', info);

  // Now scroll smoothly to sec8
  await page.evaluate(() => {
    document.querySelector('#sec8')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 800));

  const atPinStart = await page.evaluate(() => {
    const card = document.querySelector('#sec8 [class*="rounded-[28px]"]');
    const purity = document.querySelector('#sec8 span[class*="text-4xl"]');
    return {
      cardStyle: card?.getAttribute('style'),
      cardTransform: card ? window.getComputedStyle(card).transform : null,
      purity: purity?.textContent.trim(),
      scrollY: window.scrollY,
      sec8Bounding: document.querySelector('#sec8')?.getBoundingClientRect()
    };
  });
  console.log('At pin start:', atPinStart);

  // Scroll down 400px (mid-glide)
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 800));

  const midPin = await page.evaluate(() => {
    const card = document.querySelector('#sec8 [class*="rounded-[28px]"]');
    const purity = document.querySelector('#sec8 span[class*="text-4xl"]');
    return {
      cardStyle: card?.getAttribute('style'),
      cardTransform: card ? window.getComputedStyle(card).transform : null,
      purity: purity?.textContent.trim(),
      scrollY: window.scrollY
    };
  });
  console.log('At mid pin (+400px):', midPin);

  // Scroll down another 450px (docked)
  await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 800));

  const dockedPin = await page.evaluate(() => {
    const card = document.querySelector('#sec8 [class*="rounded-[28px]"]');
    const purity = document.querySelector('#sec8 span[class*="text-4xl"]');
    return {
      cardStyle: card?.getAttribute('style'),
      cardTransform: card ? window.getComputedStyle(card).transform : null,
      purity: purity?.textContent.trim(),
      scrollY: window.scrollY
    };
  });
  console.log('At docked pin (+850px):', dockedPin);

  await browser.close();
}

main().catch(console.error);
