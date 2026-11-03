const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generate() {
  const brainDir = 'C:/Users/ADIL RAZA KHAN/.gemini/antigravity/brain/e278f0f0-6b05-4bd5-8d8e-68a94a22c335';
  
  // 1. Process GLP-1TRZ from shelf_vial_glp2tz.png
  // 2. Process GLP-3RTA from shelf_vial_glp3rt.png
  
  const products = [
    {
      source: 'public/assets/shelf_vial_glp2tz.png',
      targetName: 'shelf_vial_glp1trz.png',
      title: 'GLP-1TRZ',
      dosage: '10 mg',
      fontSize: 12.5,
      letterSpacing: '0.2px',
      lineWidth: 36,
    },
    {
      source: 'public/assets/shelf_vial_glp3rt.png',
      targetName: 'shelf_vial_glp3rta.png',
      title: 'GLP-3RTA',
      dosage: '10 mg',
      fontSize: 12.5,
      letterSpacing: '0.1px',
      lineWidth: 36,
    }
  ];

  for (const item of products) {
    const srcBuf = await sharp(item.source).raw().toBuffer({ resolveWithObject: true });
    const w = srcBuf.info.width;
    const h = srcBuf.info.height;
    const ch = srcBuf.info.channels;
    const data = Buffer.from(srcBuf.data);

    // Let's create a clean label patch for the text area (y: 206 to 237, x: 139 to 216)
    // We sample the pristine cylinder color from y: 202 and x: 139..216
    // The cylinder in this area has a very subtle gradient:
    // Left (x=139): rgb(1, 16, 38) -> Right (x=216): rgb(3, 24, 58)
    for (let y = 205; y <= 236; y++) {
      for (let x = 138; x <= 216; x++) {
        const factor = (x - 138) / (216 - 138);
        const r = Math.round(1 + factor * 2);
        const g = Math.round(16 + factor * 8);
        const b = Math.round(38 + factor * 20);

        // Soft feathering at the edges so there is zero seam
        let alpha = 1.0;
        if (x < 141) alpha = (x - 137) / 4;
        if (x > 213) alpha = (217 - x) / 4;
        if (y < 208) alpha = Math.min(alpha, (y - 204) / 4);
        if (y > 233) alpha = Math.min(alpha, (237 - y) / 4);

        const idx = (y * w + x) * ch;
        data[idx] = Math.round(data[idx] * (1 - alpha) + r * alpha);
        data[idx+1] = Math.round(data[idx+1] * (1 - alpha) + g * alpha);
        data[idx+2] = Math.round(data[idx+2] * (1 - alpha) + b * alpha);
      }
    }

    const patchedBase = await sharp(data, { raw: { width: w, height: h, channels: ch } }).png().toBuffer();

    // Now composite the exact SVG text
    // x: 144, y for title baseline: 218
    // y for dosage baseline: 230
    // y for line: 234.5
    const svgOverlay = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <text x="144" y="217.5" font-family="Arial, 'Segoe UI', sans-serif" font-weight="700" font-size="${item.fontSize}" fill="#ffffff" letter-spacing="${item.letterSpacing}">${item.title}</text>
        <text x="144" y="229.5" font-family="Arial, 'Segoe UI', sans-serif" font-weight="700" font-size="9" fill="#00b4d8" letter-spacing="0.2px">${item.dosage}</text>
        <line x1="144" y1="233.5" x2="${144 + item.lineWidth}" y2="233.5" stroke="#00b4d8" stroke-width="1.2" stroke-linecap="square"/>
      </svg>
    `;

    const finalImage = await sharp(patchedBase)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .png()
      .toBuffer();

    // Save to brain dir for visual verification
    fs.writeFileSync(path.join(brainDir, item.targetName), finalImage);
    // Also save a cropped zoom of the vial for inspection
    await sharp(finalImage)
      .extract({ left: 130, top: 100, width: 105, height: 210 })
      .png()
      .toFile(path.join(brainDir, 'zoom_' + item.targetName));

    console.log('Generated:', item.targetName);
  }
}

generate();
