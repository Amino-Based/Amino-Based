import sharp from 'sharp';

async function main() {
  const src = 'public/assets/blog_hero_banner.png';
  const meta = await sharp(src).metadata();
  console.log('Original size:', meta.width, 'x', meta.height);

  // In the original 3200x1800 image:
  // The 5 vials are from y=820 to y=1750 (height: 930) and x=250 to x=2950 (width: 2700).
  // The text is from y=100 to y=680 (height: 580) and x=280 to x=2050 (width: 1770).
  
  // What if we create a clean, elegant panoramic composition:
  // Target dimensions: 3200 x 1200 (aspect ratio 2.66 : 1, which matches 24:9 / 21:8)
  // On desktop 1400px, height is only ~525px (instead of 788px!)
  // In 3200 x 1200:
  // We can position:
  // Top: Text block slightly scaled (e.g. 88% scale) from y=40 to y=480
  // Bottom: The 5 authentic Amino Based vials with reflections from y=420 to y=1180
  // Both fit comfortably with zero overlap, zero clipping!
  
  // Let's test this:
  const textBuffer = await sharp(src)
    .extract({ left: 260, top: 90, width: 1850, height: 600 })
    .resize({ width: 1570, height: 510, fit: 'contain' })
    .toBuffer();

  const vialsBuffer = await sharp(src)
    .extract({ left: 250, top: 830, width: 2700, height: 950 })
    .resize({ width: 2700, height: 750, fit: 'contain' })
    .toBuffer();

  const targetW = 3200;
  const targetH = 1200;

  // Background matching the soft blue-gray studio gradient of the original
  const svgBg = Buffer.from(`
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#EEF4FA" />
          <stop offset="30%" stop-color="#E2ECF6" />
          <stop offset="60%" stop-color="#D4E2EF" />
          <stop offset="100%" stop-color="#C6D7E9" />
        </linearGradient>
      </defs>
      <rect width="${targetW}" height="${targetH}" fill="url(#bg)" />
    </svg>
  `);

  await sharp(svgBg)
    .composite([
      { input: textBuffer, top: 30, left: 280 },
      { input: vialsBuffer, top: 450, left: 250 }
    ])
    .png({ quality: 95 })
    .toFile('public/assets/blog_hero_recomposed.png');

  console.log('Created public/assets/blog_hero_recomposed.png');
}

main().catch(console.error);

