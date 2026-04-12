import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = './public/images/hero';
const files = fs.readdirSync(publicDir);

for (const file of files) {
  if (/\.(jpg|webp|png|jpeg)$/i.test(file)) {
    const p = path.join(publicDir, file);
    const stats = fs.statSync(p);
    const meta = await sharp(p).metadata();
    console.log(`Image: ${file} | Size: ${(stats.size/1024).toFixed(2)}KB | Dims: ${meta.width}x${meta.height}`);
  }
}
