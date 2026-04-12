import sharp from 'sharp';
import fs from 'fs/promises';
import { join } from 'path';

const heroDir = './public/images/hero';

const HUGE_FILES = ['portrait.jpg', 'trumpet.jpg', 'singing.JPG'];

async function run() {
  for (const file of HUGE_FILES) {
    const inputPath = join(heroDir, file);
    try {
      const { size: originalSize } = await fs.stat(inputPath);
      const tempPath = join(heroDir, `temp-${file}`);
      
      await sharp(inputPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .jpeg({ quality: 75, progressive: true })
        .toFile(tempPath);
        
      const { size: newSize } = await fs.stat(tempPath);
      
      // replace original
      await fs.rename(tempPath, inputPath);
      
      console.log(`✅ ${file}: ${(originalSize / 1024).toFixed(0)}KB -> ${(newSize / 1024).toFixed(0)}KB`);
    } catch (e) {
      console.error(`Failed to compress ${file}:`, e.message);
    }
  }
}

run();
