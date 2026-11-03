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

  const triggerInfo = await page.evaluate(() => {
    const card = document.querySelector('#sec8 [class*="rounded-[28px]"]');
    // Find ScrollTrigger instance
    // @ts-ignore
    const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll() : [];
    // Or check gsap
    // @ts-ignore
    const st = card?._gsap?.getTweens ? card._gsap : null;
    return {
      cardStyle: card?.getAttribute('style'),
      scrollY: window.scrollY,
      sec8Top: document.querySelector('#sec8')?.getBoundingClientRect().top
    };
  });
  console.log('triggerInfo:', triggerInfo);
  await browser.close();
}

main().catch(console.error);
