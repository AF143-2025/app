const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SIZES = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

async function generateIcons() {
  const sourceImage = path.join(__dirname, '..', 'public', 'icon-512.png');
  const resDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

  if (!fs.existsSync(sourceImage)) {
    console.error('Source icon not found:', sourceImage);
    process.exit(1);
  }

  for (const { dir, size } of SIZES) {
    const targetDir = path.join(resDir, dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Square icon
    const squareIconPath = path.join(targetDir, 'ic_launcher.png');
    await sharp(sourceImage)
      .resize(size, size)
      .toFile(squareIconPath);
    console.log(`Generated: ${squareIconPath}`);

    // Round icon
    const circleSvg = Buffer.from(
      `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" /></svg>`
    );
    const roundIconPath = path.join(targetDir, 'ic_launcher_round.png');
    await sharp(sourceImage)
      .resize(size, size)
      .composite([{ input: circleSvg, blend: 'dest-in' }])
      .toFile(roundIconPath);
    console.log(`Generated: ${roundIconPath}`);
  }

  // Generate splash logo in drawable
  const drawableDir = path.join(resDir, 'drawable');
  if (!fs.existsSync(drawableDir)) {
    fs.mkdirSync(drawableDir, { recursive: true });
  }

  const splashLogoPath = path.join(drawableDir, 'splash_logo.png');
  await sharp(sourceImage)
    .resize(300, 300)
    .toFile(splashLogoPath);
  console.log(`Generated: ${splashLogoPath}`);

  console.log('All Android icons and assets generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
