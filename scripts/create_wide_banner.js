import sharp from 'sharp';

async function composeWidescreenBanner() {
  const src = 'public/assets/blog_hero_banner.png';
  
  // Canvas width: 3200, target height: 1100 (aspect ratio ~21:7.2 / 24:8.25)
  const targetW = 3200;
  const targetH = 1100;

  // Extract text block from y=120 to y=550 (height: 430)
  const textBuffer = await sharp(src)
    .extract({ left: 180, top: 130, width: 1750, height: 420 })
    .toBuffer();

  // Extract the vials with reflections from y=850 to y=1780 (height: 930)
  const vialsBuffer = await sharp(src)
    .extract({ left: 120, top: 850, width: 2960, height: 930 })
    .resize({ width: 2960, height: 740, fit: 'contain' })
    .toBuffer();

  // Create smooth vertical gradient background matching original exactly
  const svgBg = Buffer.from(`
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#EEF4FA" />
          <stop offset="35%" stop-color="#E3ECF5" />
          <stop offset="65%" stop-color="#D6E3F0" />
          <stop offset="100%" stop-color="#C6D7E9" />
        </linearGradient>
      </defs>
      <rect width="${targetW}" height="${targetH}" fill="url(#bg)" />
    </svg>
  `);

  await sharp(svgBg)
    .composite([
      { input: textBuffer, top: 40, left: 180 },
      { input: vialsBuffer, top: 350, left: 120 }
    ])
    .png({ quality: 95 })
    .toFile('public/assets/blog_hero_wide_vials.png');

  console.log('Successfully created public/assets/blog_hero_wide_vials.png');
}

composeWidescreenBanner().catch(console.error);

