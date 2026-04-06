import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, parse } from 'path';

const heroDir = './public/images/hero';

const files = await readdir(heroDir);
const imageFiles = files.filter(f => /\.(jpg|jpeg|JPG|JPEG|png|PNG)$/i.test(f));

console.log(`Found ${imageFiles.length} images to optimize:\n`);

for (const file of imageFiles) {
  const inputPath = join(heroDir, file);
  const { name } = parse(file);

  const { size: originalSize } = await stat(inputPath);

  // Full size WebP (max 1400px wide, for desktop)
  const fullOut = join(heroDir, `${name}.webp`);
  await sharp(inputPath)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(fullOut);

  // Mobile size WebP (max 700px wide)
  const mobileOut = join(heroDir, `${name}-mobile.webp`);
  await sharp(inputPath)
    .resize({ width: 700, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(mobileOut);

  const { size: fullSize } = await stat(fullOut);
  const { size: mobileSize } = await stat(mobileOut);

  console.log(`✅ ${file}`);
  console.log(`   Original:    ${(originalSize / 1024).toFixed(0)} KB`);
  console.log(`   Desktop .webp: ${(fullSize / 1024).toFixed(0)} KB  (${Math.round((1 - fullSize/originalSize)*100)}% smaller)`);
  console.log(`   Mobile .webp:  ${(mobileSize / 1024).toFixed(0)} KB  (${Math.round((1 - mobileSize/originalSize)*100)}% smaller)\n`);
}

console.log('Done! Update IMAGES in App.tsx to use .webp files.');
