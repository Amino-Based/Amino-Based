import sharp from 'sharp';

async function extendBannerToWidescreen() {
  const src = 'public/assets/blog_hero_banner.png';
  const meta = await sharp(src).metadata();
  console.log('Original size:', meta.width, 'x', meta.height);

  // We want a sleek panoramic ratio, e.g. 21:9 or 2.35:1
  // If height = 1800, width = 1800 * (21/9) = 4200 (or 4266)
  // Let's make target: 4266 x 1800 (exact 21.33 : 9, or ~2.37 : 1)
  const targetW = 4200;
  const targetH = 1800;
  const padLeft = Math.floor((targetW - meta.width) / 2); // 500px on left, 500px on right

  // Get the 1-pixel wide edge column from x=0
  const leftCol = await sharp(src)
    .extract({ left: 0, top: 0, width: 1, height: 1800 })
    .toBuffer();

  // Resize the 1px column to fill the padLeft width
  const leftPad = await sharp(leftCol)
    .resize({ width: padLeft, height: 1800, fit: 'fill' })
    .toBuffer();

  // Get the 1-pixel wide edge column from x=3199
  const rightCol = await sharp(src)
    .extract({ left: meta.width - 1, top: 0, width: 1, height: 1800 })
    .toBuffer();

  const padRight = targetW - meta.width - padLeft;
  const rightPad = await sharp(rightCol)
    .resize({ width: padRight, height: 1800, fit: 'fill' })
    .toBuffer();

  // Create the combined wide image
  const wideBanner = await sharp({
    create: {
      width: targetW,
      height: targetH,
      channels: 3,
      background: { r: 238, g: 244, b: 250 }
    }
  })
  .composite([
    { input: leftPad, left: 0, top: 0 },
    { input: src, left: padLeft, top: 0 },
    { input: rightPad, left: padLeft + meta.width, top: 0 }
  ])
  .png({ quality: 95 })
  .toFile('public/assets/blog_hero_our_vials_wide.png');

  console.log('Successfully created public/assets/blog_hero_our_vials_wide.png with dimensions:', targetW, 'x', targetH);
}

extendBannerToWidescreen().catch(console.error);

