import sharp from 'sharp';

async function createSideBySideBanner() {
  const src = 'public/assets/blog_hero_banner.png';
  
  // Target: 3200 x 1000 (aspect ratio 3.2 : 1, matching lg:aspect-[32/10])
  const targetW = 3200;
  const targetH = 1000;

  // 1. Extract the text block (without extra background)
  // Text starts around x: 310, y: 110, width: 1710, height: 590
  const textBuffer = await sharp(src)
    .extract({ left: 310, top: 110, width: 1710, height: 590 })
    .resize({ width: 1350, height: 465, fit: 'contain' })
    .toBuffer();

  // 2. Extract the 5 vials with reflections
  // Vials span from x: 300 to 2900, y: 800 to 1750
  const vialsBuffer = await sharp(src)
    .extract({ left: 300, top: 800, width: 2600, height: 950 })
    .resize({ width: 1750, height: 640, fit: 'contain' })
    .toBuffer();

  // 3. Create background gradient matching original
  const svgBg = Buffer.from(`
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#EEF4FA" />
          <stop offset="45%" stop-color="#E2ECF6" />
          <stop offset="75%" stop-color="#D4E2EF" />
          <stop offset="100%" stop-color="#C6D7E9" />
        </linearGradient>
      </defs>
      <rect width="${targetW}" height="${targetH}" fill="url(#bg)" />
    </svg>
  `);

  await sharp(svgBg)
    .composite([
      { input: textBuffer, top: 260, left: 120 },
      { input: vialsBuffer, top: 280, left: 1400 }
    ])
    .png({ quality: 95 })
    .toFile('public/assets/blog_hero_side_by_side.png');

  console.log('Successfully created blog_hero_side_by_side.png');
}

createSideBySideBanner().catch(console.error);

